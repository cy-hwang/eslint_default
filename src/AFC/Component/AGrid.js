/**
* 기본 그리드 객체 입니다.
*
* @class AGrid
* @constructor
*/

function AGrid()
{
	AComponent.call(this);
	
	//선택된 셀,행 집합
    this.selectedCells = new Array();
    
    this.includeData = false;
	
	//스크롤 복원값
    this.savedScrollPos = -1;
	this.scrollArea = null;
	//this.isScrollVisible = false;
	
	//그리드 터치시 상위로 이벤트 전달 여부
	this.isStoppagation = true;
	
	//그리드 선택시 addClass Name
	this.selectStyleName = 'agrid_select';
	
	// 그리드 옵션
	this.option =
    {
        isSingleSelect: true,      	//ctrl 키를 누르고 선택해도 하나만 선택된다. 
        isFullRowSelect: false,     //특정 cell 을 클릭해도 그 row 전체가 선택된다.
        isSelectable : false,		//선택 [불]가능 옵션 플래그
        isRClickSelect: false,      //우클릭으로 선택 가능한지
        isHideHeader : false,		//헤더를 숨길지
		isFlexibleRow : false,		//TR의 높이를 TABLE 높이에 풀로 맞춤
		isTransition: false			//in scrollManager scroll, do we use transition
		
    };
	
	//컬럼 개수
	this.columnCount = 0;
	
	//바디 로우 셋 템플릿 변수
	this.rowTemplate = null;
	this.rowTmplHeight = 0;
	//헤더 로우 셋 템플릿 변수
	this.hRowTemplate = null;
	this.hRowTmplHeight = 0;
	
	this.headerTable = null;
	this.bodyTable = null;
	this.showThead = null;		
    this.hideThead = null;		
	this.tHead = null;			//thead of table
	this.tBody = null;			//tbody of table
	//---------------------------------
	
	//자체적인 스크롤 구현
	this.scrlManager = null;
	//백업 매니저 관련
	//this.bkManager = null;
	
	//그리드 리얼 관련
	this.realMap = null;
	//this.realKey = null;
	
	this.scrollComp = null;
	
	this.toggleColArr = null;	
	this.toggleColOfs = null;
	
	this.toggleRowArr = null;	
	this.toggleRowOfs = null;
	
	this.oriColArr = null;
		
	//keyArr과 동일한 길이의 mask, color 함수 배열
	this.maskArr = [];
	//this.maskArg = [];
	//text size auto shrink info
	this.shrinkInfo = [];
	
	//바디 상단선 높이(isHideHeader?1:0)
	this.bodyTopBorderH = 0;
}
afc.extendsClass(AGrid, AComponent);

AGrid.prototype.init = function(context, evtListener)
{
	//---------------------------------------------------------------
	//	이벤트 구현시 필요하므로 init 전에 변수를 만들어 두어야 한다.
		this.scrollArea = $('<div style="height:100%; overflow:auto; -webkit-overflow-scrolling:touch;"></div>');
	//------------------------------------------------------------------
	
	
	AComponent.prototype.init.call(this, context, evtListener);
	
	//-------------------------------------------------
	//	반복적으로 추가할 템플릿을 복제하여 생성
	//-------------------------------------------------
	
	//헤더 템플릿
	this.hRowTemplate = this.$ele.find('.head-prop tr').clone();
	//바디 템플릿
	this.rowTemplate = this.$ele.find('.body-prop tr').clone();
	
	//컬럼 개수
    this.columnCount = this.hRowTemplate.eq(0).children().length;
	
	//--------------------------------------------------------------------------------------------------------------
	//	그리드 구현 기본 알고리즘
	//	하나의 <table> 을 클론하여 두개의 테이블을 중첩시킨 후
	//	[헤더] 역할을 하는 <table> 은 <tbody> 부분을 제거하고 최상단으로 띄운다.
	//	[바디] 역할을 하는 <table> 은 <thead> 부분을 hide 시켜 [헤더 table] 밑으로 들어가게 한다.  
	
	this.headerTable = this.$ele.children('table');
	this.bodyTable = this.headerTable.clone();
	
	//바디 제거
	this.headerTable.children('tbody').remove();
	this.headerTable.css(
	{
		'position': 'absolute',
		'left': '0px', 'top': '0px',
		'z-index': 10,
		'box-sizing':'boder-box',
		'-webkit-transform':'translateZ(10px)'
	});
	
	//scrollArea 만들어 붙이기
	//this.scrollArea = $('<div style="height:100%; overflow:auto; -webkit-overflow-scrolling:touch;"></div>');
	//뒷 배경 1px 보이는 버그 픽스
	//this.scrollArea.css('border-top', '1px solid transparent');
	this.scrollArea.append(this.bodyTable);
	
	this.$ele.append(this.headerTable);
	this.$ele.append(this.scrollArea);
	
	//--------------------------------------------------
	//	관리 변수 세팅
	//--------------------------------------------------
	//thead 태그는 타이틀명을 변경하기 위해서 필요
	this.tHead = this.headerTable.children('thead');
	
	//tbody 태그는 자주 쓰이므로 변수로 저장해 둔다.
	this.tBody = this.bodyTable.children('tbody');
	//기본으로 들어있던 <tr> 태그는 삭제한다.
	this.tBody.children('tr').remove();
	
	this.showThead = this.headerTable.children('thead');
	
    this.hideThead = this.bodyTable.children('thead');
    
    this.hideThead.css('visibility', 'hidden');
    
    
	//----------------------------------------------------    
	//	옵션값 셋팅
	//----------------------------------------------------
    
	var opt = 
	{
		isHideHeader : this.$ele.attr('data-hide-header')=='true' ? true : false,
		isSingleSelect : this.$ele.attr('data-single-select')=='true' ? true : false,
		isFullRowSelect : this.$ele.attr('data-fullrow-select')=='true' ? true : false,
		isRClickSelect : this.$ele.attr('data-rclick-select')=='true' ? true : false,
		isSelectable : this.$ele.attr('data-selectable')=='true' ? true : false,
		isFlexibleRow : this.$ele.attr('data-flexible-row')=='true' ? true : false,
		isTransition : (this.$ele.attr('data-use-transition')=='true'),
	};
	
	this.setGridOption(opt);
	
	if(this.option.isTransition)
	{
		//안드로이드이고 6.0 이상만 가능
		this.option.isTransition = (afc.isAndroid && afc.andVer>=6.0);
	}
	
	if(this.option.isFlexibleRow) this.setFlexibleRow();
	
	//-----------------
	//	select style
	this.selectStyleName = this.$ele.attr('data-select-style');
	if(!this.selectStyleName) this.selectStyleName = 'agrid_select';
	
	//편집기에서 적용됐던 기본 셀렉트 클래스 제거
	var selRow = this.rowTemplate.eq(0);
	
	if(this.option.isFullRowSelect)
	{
		var thisObj = this;
		selRow.children().each(function()
		{
			$(this).removeClass(thisObj.selectStyleName);
		});
	}
	
	else selRow.children().eq(0).removeClass(this.selectStyleName);
	
	//바디 로우 템플릿의 높이를 구해둔다.
	for(var i=0; i<this.rowTemplate.length; i++)
		this.rowTmplHeight += parseInt(this.rowTemplate.eq(i).attr('height'), 10);
	
	//바디 로우 템플릿의 높이를 구해둔다.
	for(var i=0; i<this.hRowTemplate.length; i++)
		this.hRowTmplHeight += parseInt(this.hRowTemplate.eq(i).attr('height'), 10);
	
	this.escapePreventTouch();
	
	if(!this.option.isHideHeader)
	{
		this.bodyTopBorderH = 1;
		this.scrollArea.css('border-top', '1px solid transparent');
		var headerTd = this.tHead.children('tr').children('td');
		for(var i=0; i<headerTd.length; i++)
		{
			this.aevent._select(headerTd.eq(i));
			this.aevent._longtab(headerTd.eq(i));
		}	
	}
	
	this.loadMaskInfo();
	
};

AGrid.prototype.setScrollArrow = function(headHeight)
{
	var sa = new ScrollArrow();
	sa.setArrow('vertical');
	sa.apply(this.scrollArea[0]);
	
	if(!headHeight)
	{
		if(this.option.isHideHeader) headHeight = 5;
		else headHeight = this.hRowTmplHeight+5;
	}
	sa.arrow1.css('top', headHeight+'px');
};

AGrid.prototype.loadMaskInfo = function()
{
	var maskInfo = [];
	for(var i=0; i<this.rowTemplate.length; i++)
	{
		for(var j=0; j<this.columnCount; j++)
		{
			if( $(this.getCell(i, j)).attr('data-span') ) continue;
			maskInfo.push(0);
		}
	}
	
	this.setMaskInfo(maskInfo);
	//var maskInfo = this.getAttr(afc.ATTR_MASK);
	//if(maskInfo) this.setMaskInfo(maskInfo.split(','));
};

AGrid.prototype.setFlexibleRow = function()
{
	this.bodyTable.css('height', '100%');
	this.rowTemplate.css('height', '');
	this.rowTemplate.attr('height', '');
};

/*
AGrid.prototype.transForPivot = function()
{
	this.$ele.append(this.bodyTable);
	this.scrollArea.remove();
	this.scrollArea = null;
};
*/

AGrid.prototype.enableScrlManager = function(leftSyncArea, rightSyncArea)
{
	if(this.scrlManager) return;

	var thisObj = this;
	
	//트랜지션 가속 사용 여부
	//ios do not use
	//this.option.isTransition = (afc.isAndroid && afc.andVer>=6.0);
	//this.option.isTransition = false;
	
	this.scrlManager = new ScrollManager();
	
	if(this.option.isTransition)	
	{
		//ScrollManager 의  스크롤이 중지되면 호출되어진다.
		this.scrlManager.setStopCallback(function()
		{
			_stopHelper(thisObj.scrollArea[0], thisObj.bodyTable[0]);

			if(leftSyncArea) _stopHelper(leftSyncArea, leftSyncArea.children[0] );
			if(rightSyncArea) _stopHelper(rightSyncArea, rightSyncArea.children[0] );

			if(thisObj.scrollComp) 
			{
				var compEle = thisObj.scrollComp.element;
				_stopHelper(null, compEle);

				var pos = thisObj.scrollComp.getPos();

				pos.top += compEle.transY;
				thisObj.scrollComp.setStyle('top', pos.top+'px');
				compEle.transY = 0;
			}
		});

		function _stopHelper(scrlArea, scrlEle)
		{
			$(scrlEle).css(
			{
				'-webkit-transform': '',
				'-webkit-transition-property': '',
				'-webkit-transition-duration': '',
				'-webkit-transition-timing-function': '',
				'-webkit-transition-delay': ''
			});

			if(scrlArea)
			{
				scrlArea.scrollTop -= scrlEle.transY;
				scrlEle.transY = 0;
			}
		}
		//-----------------
	}
	
	//we must delete this option on this mode.
	this.scrollArea.css('-webkit-overflow-scrolling', '');	//ios overflow-scrolling delete
	
	this.scrollImplement(leftSyncArea, rightSyncArea);
	this.aevent._scroll();
};


AGrid.prototype.applyBackupScroll = function()
{
	if(this.bkManager) this.bkManager.applyBackupScroll();
};


AGrid.prototype.setScrollComp = function(acomp)
{
	this.scrollComp = acomp;
	
};

AGrid.prototype.scrollImplement = function(leftSyncArea, rightSyncArea) 
{
	var thisObj = this;
	
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false;
	
	var scrlArea = this.scrollArea[0],
		transTop, transBottom, scrlEle = null, leftEle = null, rightEle = null, compEle = null, 
		scrlFunc = _scrlHelper, initFunc = _initHelper;
		
	if(this.option.isTransition) 
	{
		scrlFunc = _scrlHelper2;
		initFunc = _initHelper2;
	}
	
	//--------------------------------------------------------
	//	scroll 그리드 
	
	//touch start
	AEvent.bindEvent(scrlArea, AEvent.ACTION_DOWN, function(e)
	{
		//다른 그리드로부터 touchstart 가 발생했음을 통보 받은 경우
		if(e.userData)
		{
			//thisObj.scrlManager.initScroll(0);
			thisObj.scrlManager.initScroll(e.changedTouches[0].clientY);
			
			return;
		}
	
		isDown = true;
		
		e.preventDefault();
		
		//자신의 스크롤 매니저가 구동의 주체가 아닌 경우
		//다른 그리드에게 알려준다.
		if(!thisObj.scrlManager.scrlTimer)
		{
			e.userData = true;
			if(leftSyncArea) AEvent.triggerEvent(leftSyncArea, AEvent.ACTION_DOWN, e);
			if(rightSyncArea) AEvent.triggerEvent(rightSyncArea, AEvent.ACTION_DOWN, e);
		}
		
		thisObj.scrlManager.initScroll(e.changedTouches[0].clientY);
		
		//asoocool test
		initFunc();
	});
	
	//touch move
	AEvent.bindEvent(scrlArea, AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		thisObj.scrlManager.updateScroll(e.changedTouches[0].clientY, scrlFunc);
	});
	
	//touch end
	AEvent.bindEvent(scrlArea, AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		e.preventDefault();
		
		thisObj.scrlManager.scrollCheck(e.changedTouches[0].clientY, scrlFunc);
	});
	
	function _initHelper()
	{
		if(thisObj.scrollComp)
			transTop = thisObj.scrollComp.getPos().top + scrlArea.scrollTop;
	}
	
	function _initHelper2()
	{
		//----------------------------------------------------------------------
		transTop = scrlArea.scrollTop;
		transBottom = -(scrlArea.scrollHeight - scrlArea.offsetHeight - scrlArea.scrollTop + 1);
		
		scrlEle = thisObj.bodyTable[0];
		//--------------------------------------------------------------------
		
		_moveHelper(scrlEle);
		
		if(leftSyncArea) 
		{
			leftEle = leftSyncArea.children[0];
			_moveHelper(leftEle);
		}

		if(rightSyncArea) 
		{
			rightEle = rightSyncArea.children[0];
			_moveHelper(rightEle);
		}

		if(thisObj.scrollComp) 
		{
			compEle = thisObj.scrollComp.element;
			_moveHelper(compEle);
		}
	}
	
	function _scrlHelper(move)
	{
		if(!move || move==0) return true;
		
		var oldTop = scrlArea.scrollTop;

		//scrollComp 는 css 값을 셋팅하기 때문에 똑같이 맞춰주기 위해 소수점을 버림.
		if(thisObj.scrollComp) move = parseInt(move);
		
		scrlArea.scrollTop += move;

		if(leftSyncArea) leftSyncArea.scrollTop = scrlArea.scrollTop;
		if(rightSyncArea) rightSyncArea.scrollTop = scrlArea.scrollTop; 
		
		if(oldTop==scrlArea.scrollTop) return false;
		
		if(thisObj.scrollComp)
		{
			thisObj.scrollComp.setStyle('top', (transTop-scrlArea.scrollTop)+'px');
		}
		
		return true;
	}
	
	function _scrlHelper2(move)	
	{
		var retVal = false;
		
		if(!move || move==0) return true;
		
		//already scrollTop or scrollBottom
		if( (scrlEle.transY==transTop && move<0) || (scrlEle.transY==transBottom && move>0)  ) return false;
		
		scrlEle.transY -= move;
		
		if(scrlEle.transY>=transTop) scrlEle.transY = transTop;
		else if( scrlEle.transY <= transBottom) scrlEle.transY = transBottom;
		else retVal = true;
		
		_moveHelper(scrlEle);
		
		if(leftEle) 
		{
			leftEle.transY = scrlEle.transY;
			_moveHelper(leftEle);
		}
		
		if(rightEle) 
		{
			rightEle.transY = scrlEle.transY;
			_moveHelper(rightEle);
		}
		
		if(compEle) 
		{
			compEle.transY = scrlEle.transY;
			_moveHelper(compEle);
		}
		
		return retVal;
	}
	
	function _moveHelper(ele)
	{
		ele.style.webkitTransition = 'all 0.1s linear';
		ele.style.webkitAnimationFillMode = 'forwards';
  		ele.style.webkitTransform = 'translateY(' + ele.transY + 'px)';
	}
	
};


AGrid.prototype.scrollTopManage = function()
{
	//트랜지션 기능을 사용하는 경우는 자체적으로 호출되므로 다시 해주면 안됨.
	if(this.scrlManager && !this.option.isTransition) this.scrlManager.stopScrollTimer();

	if(this.bkManager && this.bkManager.checkHeadBackup()) return false;
	else return true;
};

AGrid.prototype.scrollBottomManage = function()
{
	//트랜지션 기능을 사용하는 경우는 자체적으로 호출되므로 다시 해주면 안됨.
	if(this.scrlManager && !this.option.isTransition) this.scrlManager.stopScrollTimer();

	if(this.bkManager && this.bkManager.checkTailBackup()) return false;
	else return true;
};


AGrid.prototype.setIncludeData = function(includeData)
{
	this.includeData = includeData;
};

//----------------------------------------------------------------
//   add/remove   
//----------------------------------------------------------------

//rowData : [1,2,3,'abc']
//하나의 row 를 추가한다.
AGrid.prototype.addRow = function(rowData, isApplyBackupScroll)
{
	var row = this.createRow(rowData);
	
	if(this.includeData) row.get(0).rowset = row;
	if(this.bkManager && this.bkManager.appendItemManage(row, isApplyBackupScroll) ) return row;
	
	this.tBody.append(row);
    
    return row;
};

//하나의 row를 상단에 추가한다.
AGrid.prototype.prependRow = function(rowData)
{
	var row = this.createRow(rowData);
	
	if(this.bkManager && this.bkManager.prependItemManage(row) ) return row;
	
	this.tBody.prepend(row);
	
    return row;
};

//하나의 row 를 삽입한다. 
AGrid.prototype.insertRow = function(nRow, rowData)
{
	var row = this.createRow(rowData);
   	var	rowsetNum = this.rowTemplate.length * nRow;
   	   	
   	$(this.getRow(rowsetNum)).before(row);
    
    return row;
};

AGrid.prototype.removeRow = function(rowIdx)
{
    $(this.getRow(rowIdx)).removeNoLeak();
	
    //this.checkScrollbar(false);
    
    /*	차후에 처리 필요
    if(this.bkManager)
    {
    	
    }
    */
};


//로우셋에 데이터를 넣고 싶은경우 호출
AGrid.prototype.addRowWithData = function(rowData, data, isApplyBackupScroll)
{
	var rows = this.addRow(rowData, isApplyBackupScroll);
	if(data == null) data = rowData;
	var cellIdx = 0;
	
	if(this.option.isFullRowSelect)
	{
		rows.get(0).oridata = data;
	}
	else
	{
		for(var i = 0; i < rows.length; i++)
		{
			var row = $(rows[i]);
			var children = row.children();
			for(var j = 0; j < children.length; j++)
			{
				if(!children.eq(j).attr('data-span'))
					this.setCellData(row, j, data[cellIdx++]);
			}
		}
	}
};

AGrid.prototype.getDataByOption = function(rowInfo)
{
	if(this.option.isFullRowSelect)
	{
		if(rowInfo.get(0).oridata) return rowInfo.get(0).oridata;
		else
		{
			var retData = new Array();
			var tdArr = null;
			for(var i = 0; i<rowInfo.length; i++)
			{
				tdArr = rowInfo.eq(i).children();
				for(var j = 0; j<tdArr.length; j++)
					retData.push(tdArr.eq(j).text());	
			}
			return retData;
		}
	} 
	else return rowInfo[0].data;
};

AGrid.prototype.getRowSetByIndex = function(idx)
{
	return this.$getRow(idx*this.rowTemplate.length).get(0).rowset;
};


//info값으로 로우 index가져오기
AGrid.prototype.getRowIndexByInfo = function(rowInfo)
{
	//return rowInfo.eq(0).index();
	
	return this.indexOfRow(rowInfo.eq(0));
};

//로우 또는 로우셋 데이터를 가져오기
AGrid.prototype.getRowDataByIndex = function(rowIdx)
{
	return this.tBody.children().get(rowIdx).oridata;
};

AGrid.prototype.removeRowSet = function(rowIdx)
{
	var rowSetLength = this.rowTemplate.length;
	var startIdx = rowSetLength*rowIdx;
	var endIdx = startIdx+rowSetLength;
	
	$(this.getRows(startIdx, endIdx)).removeNoLeak();
};


AGrid.prototype.removeAll = function()
{
	this.tBody.children().removeNoLeak();//tbody tr
	
	//this.checkScrollbar(false);
	
	if(this.bkManager) this.bkManager.clearAll();
	
	//4.3 안드로이드 로우셋 안지워지는 버그 대응
	if(afc.andVer<4.4 && this.scrollArea)
	{
		this.scrollArea.hide();
		var thisObj = this;
		setTimeout(function(){
			thisObj.scrollArea.show();
		},1);

	}
};

//----------------------------------------------------------------
//   select cell  
//----------------------------------------------------------------

// isFullRowSelect 가 참이면 cell 은 <tr> 객체임 즉, row
AGrid.prototype.selectCell = function(cell)
{
	if(!this.option.isSelectable) return;
	
    this.clearSelected();

    //새롭게 선택된 셀을 추가하고 배경 색을 바꾼다.
    this.selectedCells.push(cell);
    
	if(this.option.isFullRowSelect)
	{
		var thisObj = this;
		
		//isFullRowSelect일 경우에 rowSet이 있으면 
		$(cell).children().each(function()
		{
			$(this).addClass(thisObj.selectStyleName);
		});
	}
	
	else $(cell).addClass(this.selectStyleName);
};

// isFullRowSelect 가 참이면 cell 은 <tr> 객체임 즉, row
AGrid.prototype.deselectCell = function(cell)
{
	this.clearSelected();
    
	if(this.option.isFullRowSelect)
	{
		var thisObj = this;
		
		//isFullRowSelect일 경우에 rowSet이 있으면 
		$(cell).children().each(function()
		{
			$(this).removeClass(thisObj.selectStyleName);
		});
	}
	
	else $(cell).removeClass(this.selectStyleName);
};

//그리드안의 데이터 모두 지우기
AGrid.prototype.clearAll = function()
{
    this.tBody.find('td').each(function()
    {
        this.textContent = '';
		this.style.background = '';
    });
};

AGrid.prototype.clearContents = function()
{
    this.tBody.find('td').each(function()
    {
        this.textContent = '';
    });
};

//선택된 셀(행)을 모두 해제시키는 함수
AGrid.prototype.clearSelected = function()
{
	var cell = null;

	//선택되어져 있던 셀들의 배경을 원상복귀 한다.
	
	if(this.option.isFullRowSelect)
	{
		var thisObj = this;
		
		for(var i=0; i<this.selectedCells.length; i++) 
		{
			$(this.selectedCells[i]).children().each(function()
			{
				$(this).removeClass(thisObj.selectStyleName);
			});
		}
	}
	else 
	{
		for(var i=0; i<this.selectedCells.length; i++) 
		{
			$(this.selectedCells[i]).removeClass(this.selectStyleName);
		}
	}
	
	
    //선택 목록에서 모두 제거
    this.selectedCells.length = 0;
};


//----------------------------------------------------------------
//   Util functions
//----------------------------------------------------------------

AGrid.prototype.showHeader = function()
{
    this.showThead.show();
    this.hideThead.show();
};

AGrid.prototype.hideHeader = function()
{
    this.showThead.hide();
    this.hideThead.hide();
};

AGrid.prototype.addToggleCol = function(toggleColArr, defaultIdx)
{
	if(!this.toggleColArr)
	{
		this.toggleColArr = new Array();
		this.toggleColOfs = new Array();
		this.toggleHeadArr = new Array();
	} 
	
	var arr = new Array();
	for(var i=0; i<toggleColArr.length; i++)
	{
		arr.push(this.headerTable.find('tr').children().eq(toggleColArr[i]).text());
		this.hideThead.find('tr').children().eq(toggleColArr[i]).text('');
	}
	
    this.toggleColArr.push(toggleColArr);
	this.toggleHeadArr.push(arr);
	
    var lastIdx = this.toggleColArr.length-1;
    
    this.toggleColOfs.push((defaultIdx != undefined) ? defaultIdx : 0); 
	
    var tdChild = this.rowTemplate.children();
    var headCols = this.headerTable.find('col');
    var bodyCols = this.bodyTable.find('col');
	
    this.tempW = bodyCols.eq(this.toggleColArr[lastIdx][this.toggleColOfs[lastIdx]])[0].width;
	
    var colIdx = null;
    for(var i=0; i<this.toggleColArr[lastIdx].length; i++)
    {
    	colIdx = this.toggleColArr[lastIdx][i];
    	if(i != this.toggleColOfs[lastIdx])
    	{
    		headCols.eq(colIdx)[0].width = 0;
			this.headerTable.find('tr').children().eq(colIdx).text('');
    		bodyCols.eq(colIdx)[0].width = 0;	
    	}
    	//tdChild.eq(colIdx)[0].style.setProperty("border-right", "none", "important");
    }
};

AGrid.prototype.toggleCol = function(groupIdx)
{
	var headCols = this.headerTable.find('col');
    var bodyCols = this.bodyTable.find('col');
    
    var curOfs = this.toggleColArr[groupIdx][this.toggleColOfs[groupIdx]];
    
    headCols.eq(curOfs)[0].width = 0;
	this.headerTable.find('tr').children().eq(curOfs).text('');
    bodyCols.eq(curOfs)[0].width = 0;
    
    this.toggleColOfs[groupIdx]++;
    
	if(this.toggleColArr[groupIdx].length <= this.toggleColOfs[groupIdx]) this.toggleColOfs[groupIdx] = 0;
	
	curOfs = this.toggleColArr[groupIdx][this.toggleColOfs[groupIdx]];
	var text = this.toggleHeadArr[groupIdx][this.toggleColOfs[groupIdx]];
	if(text) this.headerTable.find('tr').children().eq(curOfs).text(text);
	this.headerTable.find('tr').children().eq(curOfs).show();
	headCols.eq(curOfs)[0].width = '';
   	bodyCols.eq(curOfs)[0].width = '';
};

AGrid.prototype.hideColumnIndex = function(index)
{
	var headCol = this.headerTable.find('col').eq(index);
	var bodyCol = this.bodyTable.find('col').eq(index);
	
	this.tempW = bodyCol[0].width;
	
	headCol[0].width = 0;
	bodyCol[0].width = 0;
};

AGrid.prototype.showColumnIndex = function(index, width)
{
	var headCol = this.headerTable.find('col').eq(index);
	var bodyCol = this.bodyTable.find('col').eq(index);
	
	var colWidth = '';
	if(width) colWidth = width;
	else if(this.tempW)
	{
		colWidth = this.tempW;
		this.tempW = '';
	} 
	headCol[0].width = colWidth;
	bodyCol[0].width = colWidth;
};

AGrid.prototype.findRowByCellText = function(nCol, text)
{
	var retRow = null;
	var thisObj = this;
	
	this.tBody.children().each(function()
	{
		if(thisObj.getCellText(this, nCol)==text)
		{
			retRow = this;
			return false;
		}
	});
	
	return retRow;
};

AGrid.prototype.findRowByCellData = function(nCol, data)
{
	var retRow = null;
	var thisObj = this;
	
	this.tBody.children().each(function()
	{
		if(thisObj.getCellData(this, nCol)==data)
		{
			retRow = this;
			return false;
		}
	});
	
	return retRow;
};


//-----------------------
//  get functions
//-----------------------

//row 의 개수를 리턴한다.
AGrid.prototype.getRowCount = function()
{
    return this.tBody.children().length;
};

AGrid.prototype.getRowSetCount = function()
{
	return this.getRowCount()/this.rowTemplate.length;
};

AGrid.prototype.getColumnCount = function()
{
    return this.columnCount; 
};

//특정 idx 의 cell 을 얻어온다.
//rowIdx 값은 row 객체가 될 수 있다.
AGrid.prototype.getCell = function(rowIdx, colIdx)
{
    var row = null;
    if(typeof(rowIdx)=="number") row = this.tBody.children().eq(rowIdx); //tbody tr
    else row = $(rowIdx);
    
	return row.children().get(colIdx);
};

//특정 header idx 의 cell 을 얻어온다.
//rowIdx 값은 row 객체가 될 수 있다.
AGrid.prototype.getHeaderCell = function(rowIdx, colIdx)
{
    var row = null;
    if(typeof(rowIdx)=="number") row = this.tHead.children().eq(rowIdx); //tbody tr
    else row = $(rowIdx);
    
	return row.children().get(colIdx);
};

//특정 인덱스의 row 를 얻어온다.
AGrid.prototype.$getRow = function(rowIdx)
{
	if(this.bkManager) 
		rowIdx -= this.bkManager.getHeadCount();
	
	return this.tBody.children().eq(rowIdx);
};

//특정 인덱스의 row 를 얻어온다.
AGrid.prototype.getRow = function(rowIdx)
{
	if(this.bkManager) 
		rowIdx -= this.bkManager.getHeadCount();

	return this.tBody.children().get(rowIdx);
};

AGrid.prototype.getLastRow = function()
{
	return this.tBody.children().last()[0];
};

AGrid.prototype.getFirstRow = function()
{
	return this.tBody.children().first()[0];
};


//특정 인덱스의 row 를 얻어온다.
AGrid.prototype.getRows = function(start, end)
{
	if(start!=undefined) return this.tBody.children().slice(start, end);
	else return this.tBody.children();
};

AGrid.prototype.getCellText = function(rowIdx, colIdx)
{
    return $(this.getCell(rowIdx, colIdx)).text();
};

AGrid.prototype.getCellTag = function(rowIdx, colIdx)
{
    return $(this.getCell(rowIdx, colIdx)).html();
};

AGrid.prototype.getCellData = function(rowIdx, colIdx)
{
    return this.getCell(rowIdx, colIdx).data;
};

//파라미터로 넘어온 cell 의 row, col index 를 배열로 리턴한다. -> [row, col]
AGrid.prototype.indexOfCell = function(cell)
{
	var row = $(cell).parent(); 
    return [this.indexOfRow(row), row.children().index(cell)];
};

//파라미터로 넘어온 row 의 index 를 리턴한다.
AGrid.prototype.indexOfRow = function(row)
{
    //return this.tBody.children().index(row);
	
	if(this.bkManager) 
	{
		var inx = this.tBody.children().index(row);
		if(inx<0) return inx;
		else return inx + this.bkManager.getHeadCount();
	}

	else return this.tBody.children().index(row);
	
};

//파라미터로 넘어온 cell 의 row index 를 리턴한다.
AGrid.prototype.rowIndexOfCell = function(cell)
{
	return this.indexOfRow($(cell).parent());
};

//파라미터로 넘어온 cell 의 column index 를 리턴한다.
AGrid.prototype.colIndexOfCell = function(cell)
{
	return $(cell).parent().children().index(cell);
};

AGrid.prototype.getSelectedCells = function()
{
    return this.selectedCells;
};


//-----------------------
//  set functions
//-----------------------



AGrid.prototype.setHeaderCellText = function(rowIdx, colIdx, txt)
{
    $(this.getHeaderCell(rowIdx, colIdx)).text(txt);
};

AGrid.prototype.setCellText = function(rowIdx, colIdx, txt)
{
	var cell = this.getCell(rowIdx, colIdx);
	if(cell) 
	{
		cell.textContent = txt;
		Util.autoShrink(cell, this.shrinkInfo[colIdx]);
	}

	/*
	var cell = $(this.getCell(rowIdx, colIdx));
    cell.text(txt);
	
	cell.autoShrink(this.shrinkInfo[colIdx]);
	//this.checkAutoShrink(colIdx, cell);
	*/
};

AGrid.prototype.setCellTag = function(rowIdx, colIdx, tag)
{
	if(tag==undefined) return;
	
	var cell = this.getCell(rowIdx, colIdx);
	if(cell) 
	{
		cell.innerHTML = tag;
		//cell.childNode[0].nodeValue = tag;
		Util.autoShrink(cell, this.shrinkInfo[colIdx]);
	}

	//var cell = $(this.getCell(rowIdx, colIdx));
    //cell.html(tag);
	//cell.autoShrink(this.shrinkInfo[colIdx]);
};

AGrid.prototype.setCellData = function(rowIdx, colIdx, data)
{
    this.getCell(rowIdx, colIdx).data = data;
};

AGrid.prototype.loadCellView = function(rowIdx, colIdx, url)
{
    var cell = this.getCell(rowIdx, colIdx);	//td
    var $item = $('<div></div>');

    $item.css(
    {
        width: '100%', height: '100%', overflow: 'auto'
    });
    
    $(cell).html($item);
    
	url = url.replace('.lay', '.html');

	var thisObj = this, aview = null;
	
	//cls 파일 동적 로딩
	if(PROJECT_OPTION.dynamicInc) afc.loadScript(url.replace('.html', '.js'));
	
	afc.loadSync($item[0], url, function(success)
	{
		if(!success) return;
		
		var viewObj = $(this).children();
		
		//AView의 absolute 옵션을 relative로 바꿔준다.
		viewObj.css('position', 'relative');

		var className = viewObj.attr(afc.ATTR_CLASS);
		aview = new window[className]();
		if(aview) 
		{
        	aview.url = url;
        	
            this.view = aview;
            aview.item = this;
            aview.owner = thisObj;
            
            viewObj[0].container = thisObj.getContainer();
            viewObj[0].rootView = aview;
            aview.init(viewObj[0], aview);
            aview.updatePosition();
		}
	});
	
	return aview;
};


AGrid.prototype.setCellTextColor = function(rowIdx, colIdx, color)
{
	var cell = this.getCell(rowIdx, colIdx);
	cell.style.setProperty('color', color, 'important');
};

AGrid.prototype.setCellStyle = function(rowIdx, colIdx, style)
{
	$(this.getCell(rowIdx, colIdx)).css(style);
};

AGrid.prototype.cellAddClass = function(rowIdx, colIdx, className)
{
    $(this.getCell(rowIdx, colIdx)).addClass(className);
};

AGrid.prototype.cellRemoveClass = function(rowIdx, colIdx, className)
{
    $(this.getCell(rowIdx, colIdx)).removeClass(className);
};

//그리드의 옵션을 지정 
AGrid.prototype.setGridOption = function(option)
{
    for(var p in option)
    {
    	if(!option.hasOwnProperty(p) || this.option[p]==undefined) continue;
    	
        this.option[p] = option[p];
    }
};

//----------------------------------------------------------------
//   SCROLL AREA
//----------------------------------------------------------------
//스크롤

AGrid.prototype.getScrollPos = function()
{
	return this.scrollArea[0].scrollTop;
};

AGrid.prototype.scrollTo = function(pos)
{
	this.scrollArea[0].scrollTop = pos;
	
	if(this.option.isTransition) this.bodyTable[0].transY = 0;
};

AGrid.prototype.scrollOffset = function(offset)
{
	this.scrollArea[0].scrollTop += offset;
	
	if(this.option.isTransition) this.bodyTable[0].transY = 0;
};

//row or rowIndex
AGrid.prototype.scrollIntoArea = function(row, isAlignTop)
{
	if(typeof(row)=="number") row = this.getRow(row);
	
	row.scrollIntoView(isAlignTop);
	
	if(this.option.isTransition) this.bodyTable[0].transY = 0;
};

AGrid.prototype.scrollToTop = function()
{
	this.scrollArea[0].scrollTop = this.scrollArea[0].scrollHeight*-1;
	
	if(this.option.isTransition) this.bodyTable[0].transY = 0;
};

AGrid.prototype.scrollToBottom = function()
{
	this.scrollArea[0].scrollTop = this.scrollArea[0].scrollHeight;
	
	if(this.option.isTransition) this.bodyTable[0].transY = 0;
};

AGrid.prototype.scrollToCenter = function()
{
	this.scrollArea[0].scrollTop = (this.scrollArea[0].scrollHeight - this.element.offsetHeight)/2;
	
	if(this.option.isTransition) this.bodyTable[0].transY = 0;
};

AGrid.prototype.saveScrollPos = function()
{
	this.savedScrollPos = this.scrollArea[0].scrollTop;
};

AGrid.prototype.restoreScrollPos = function()
{
	if(this.savedScrollPos!=-1) 
	{
		this.scrollArea[0].scrollTop = this.savedScrollPos;
		this.savedScrollPos = -1;
	}
};

AGrid.prototype.isScrollTop = function()
{
	return (this.scrollArea[0].scrollTop == 0);
};

AGrid.prototype.isScrollBottom = function()
{
	var scrlEle = this.scrollArea[0];
	
	return ((scrlEle.offsetHeight + scrlEle.scrollTop-1) == scrlEle.scrollHeight);
};

AGrid.prototype.isMoreScrollTop = function()
{
	if(this.scrollArea[0].scrollTop > 0) return true;
	else return false;	
};

AGrid.prototype.isMoreScrollBottom = function()
{
	//2019.01.25 HCY Chrome webview version 71이후부터 scrollTop 값 int > float : ScrollTop 값이 -0.99~+0.99 까지 추가로 변동하기에 +1 적용
	//동일함수가 AGird(수정), ADropBox(미수정), ScrollArrow(수정), AView(미수정), AListView(미수정)에 존재
	if(this.scrollArea[0].offsetHeight + this.scrollArea[0].scrollTop + 1 < this.scrollArea[0].scrollHeight) return true;
	else return false;	
};

AGrid.prototype.isScroll = function()
{
    return (this.scrollArea[0].offsetHeight < this.scrollArea[0].scrollHeight);
};

//headerTable를 변경된 그리드 컨트롤 사이즈에 맞게 조정한다.
AGrid.prototype.resizeGridHeader = function()
{
	/*
    var isVis = this.scrollArea.hasScrollBar(); 
    this.headerTable.width(this.scrollArea.width()-17*isVis);
    */
};


///////////////////////////////////////////////////////////////////////
//
//	private area
//
///////////////////////////////////////////////////////////////////////


//rowSet 객체를 리턴한다.
AGrid.prototype.createRow = function(rowData)
{
	//템플릿이 있으면 복제하여 사용
	if(this.rowTemplate)
	{
		var idx = 0, rowSet = null, cell, cells, cellData; 
		
		rowSet = this.rowTemplate.clone();	//<tr></tr> <tr></tr> ...
		
		for(var i=0; i<rowSet.length; i++)
		{
			cells = $(rowSet[i]).children('td');	//<td><td> ...
			for(var j=0; j<cells.length; j++)
			{
				cell = $(cells[j]);
				//if(cell.css('display')!='none')
				if(!cell.attr('data-span')) 
				{
					cellData = rowData[idx];
					if(rowData.length>idx)
					{
						if(typeof cellData == 'object')
						{	
							cell.append(cellData.element);
							cell[0].data = cellData;
						}
						else cell.html(cellData);
					}
					
					cell.autoShrink(this.shrinkInfo[idx]);
					
					idx++;
				}
				
				//각 셀에 이벤트를 셋팅한다.
				if(!this.option.isFullRowSelect && this.option.isSelectable)
				{
					this.aevent._select(cell);
					this.aevent._longtab(cell);
				}
				
				//cell.autoShrink(this.shrinkInfo[idx]);
			}
		}
		
		//로우 전체에 이벤트를 셋팅한다.
        if(this.option.isFullRowSelect && this.option.isSelectable)
		{
			this.aevent._select(rowSet);
			this.aevent._longtab(rowSet);
		}
		
		return rowSet;
	}
	
	else
	{
		//템플릿이 없으면 만든다.
		this.rowTemplate = $('<tr></tr>');
		
	    for(var i=0; i<this.columnCount; i++)
	    	this.rowTemplate.append('<td></td>');

	    return this.createRow(rowData);
	}
};

//info : {maxChar:15, fontSize:24}
AGrid.prototype.setShrinkInfo = function(col, info)
{
	if(col<0)
	{
		for(var i=0; i<this.columnCount; i++)
			this.shrinkInfo[i] = info;
	}
	else this.shrinkInfo[col] = info;
};

/*
AGrid.prototype.checkAutoShrink = function(col, cell)
{
	var info = this.shrinkInfo[col];
	if(info)
	{
		var txt = cell.text();
		var len = (info.maxChar-txt.length)/txt.length;

		//afc.log(len);
		if(len<0)
		{
			//afc.log((info.fontSize+info.fontSize*len));
			cell.css('font-size', (info.fontSize+info.fontSize*len)+'px');
		}
	}
};
*/

//스크롤바 존재 여부에 따라 headerTable 의 사이즈를 조정한다.
AGrid.prototype.checkScrollbar = function(isAdd)
{
	/*
    //add 인 경우는 스크롤바가 안 보이는 경우만 체크하고
    //remove 인 경우는 스크롤바가 보이는 경우만 체크한다. 
    if(isAdd==!this.isScrollVisible)
    {
        this.isScrollVisible = this.scrollArea.hasScrollBar(); 
        if(isAdd==this.isScrollVisible) 
            this.headerTable.width(this.scrollArea.width()-17*isAdd);
    }
    */
};


AGrid.prototype.setRealMap = function()
{
	this.realMap = {};
};

/*
AGrid.prototype.setRealMap = function(realKey)
{
	this.realKey = realKey;
	this.realMap = {};
	this.isRealMode = false;
};
*/

AGrid.prototype.setMaskInfo = function(arr)
{
	var temp = null;
	
	this.maskArr = [];
	
	for(var i=0; i<arr.length; i++)
	{
		if(typeof(arr[i]) == 'function') this.maskArr[i] = arr[i];
		else
		{
			temp = arr[i].toString().split('|');
			if(temp[0]!='')
			{
				if(AComponent.MASK[temp[0]]) this.maskArr[i] = AComponent.MASK[temp[0]];
				else this.maskArr[i] = eval(temp[0]);
			}
			else this.maskArr[i] = afc.returnAsIt;
			//this.maskArg[i] = temp[1];
		}
	}
	//this.changeSetQueryData();
};

AGrid.prototype.resetMaskInfo = function()
{
	this.maskArr = [];
	//this.maskArg = [];
	
	//this.changeSetQueryData();
};

/*
AGrid.prototype.changeSetQueryData = function()
{
	if(this.maskArr.length>0) this.setQueryData = this.maskQueryData;
 	else this.setQueryData = this.baseQueryData;
};
*/

AGrid.prototype.getMaskValue = function(index, data, keyVal)
{
	if(this.maskArr) return this.maskArr[index](data[keyVal]);
	else return data[keyVal];
};

AGrid.prototype.setTimeUpdate = function(updateTime, timeKey)
{
	//분단위로 조회되도록 설정
	this.timeShare = 0;
	this.updateTime = updateTime;
	this.timeKey = timeKey;
};

AGrid.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	if(queryData.isReal) this.doRealPattern(dataArr, keyArr, queryData);
	else this.doAddPattern(dataArr, keyArr, queryData);
};

AGrid.prototype.doRealPattern = function(dataArr, keyArr, queryData)
{
	var data, row, keyVal, arr, dataObj, ret;
	
	data = dataArr[0];
	dataObj = AQueryData.getDataKeyObj(data.key);

	//update
	if(this.updateType==0)
	{
		//row = this.realMap[data[this.realKey]];
		row = this.realMap[data.key];
		var idx = 0, cell;
		for(var j=0; j<keyArr.length; j++)
		{
			keyVal = keyArr[j];
			cell = this.getCell(row, idx);
			
			if(!cell) continue;
			
			if(cell.getAttribute('data-span'))
			{
				idx++;
				j--;
				continue;
			}

			//cell 이 파라미터로 추가된 것은 stockGrid 가 setCellTag 를 호출하지 않고 
			//직접 element 의 속성을 변경하기 위해서 추가되었다. 
			//setCellText 에서는 사용하지 않지만 stockGrid 가 setCellText를 setCellTag 로 함수를 변경하기때문에 
			//여기서 호출하는 것이 필요하다.
			if(keyVal && data[keyVal] != undefined ) 
			{
				/*2018.09.27 HCY Component에 하나 이상의 key가 real로 등록(join) 및 같은 FID를 양쪽 key에서 사용시 
				 * ex. PB 8259 > ELW, 기초자산 2개의 key로 조회 + DSItem이 'ELW D1현재가', '기초자산 D2현재가' 두개로 등록
				 *
				 * 1. 문제상황: real 값은 D1현재가로 두개가 내려옴
				 * Real ex. "key": "068_52CE60", "D1현재가": 40  or "key": "001_006400", "D1현재가": 259000
				 * 현 구조에서는 컴포넌트 내부 key값에 따른 dsItem 구분이 불가하기에 D1현재가 항목만 계속 변경됨
				 *
				 * 2. 처리방안: setQueryData 함수를 화면단에서 재구현
				 * 1) key에 따라 dataArr의 값 변경
				 *	if(data["key"] == a) {
				 *	  data["D2현재가"] = data["D1현재가"];
				 *	  delete data["D1현재가"];
				 *	} 
				 *
				 * 2) dataObj가 아닌 data값 사용 > dataObj는 type insert용으로 사용되는 것이나 소스변경은 위험성이 있어 하지 않음
				 * ret = this.getMaskValue(j, data, keyVal, cell);
				 *
				 */
				ret = this.getMaskValue(j, dataObj, keyVal, cell);
				if(ret) this.setCellText(row, idx, ret);
			}
			
			idx++;
		}
	}
	
	//time update
	else if(this.updateType==2)
	{
		var realRow = this.realMap[data.key];
		if(!realRow) return;
		
		data = dataArr[0];
		
		var timeShare = parseInt(afc.formatSecond(data[this.timeKey])/this.updateTime, 10);
		var timeRest = afc.formatSecond(data[this.timeKey])%this.updateTime;
		
		if(timeShare-this.timeShare>1)
		{
			arr = new Array(keyArr.length);
			for(var j=0; j<keyArr.length; j++)
			{
				keyVal = keyArr[j];

				if(keyVal) arr[j] = this.getMaskValue(j, dataObj, keyVal);
				else arr[j] = ''; 
			}

			row = this.prependRow(arr);
			this.realMap[data.key] = row;
			
			this.timeShare = timeShare;
			if(timeShare > afc.formatSecond('240000')/this.updateTime) timeShare = 0;
		}
		else if(timeShare-this.timeShare==1 && timeRest > 0)
		{
			arr = new Array(keyArr.length);
			for(var j=0; j<keyArr.length; j++)
			{
				keyVal = keyArr[j];

				if(keyVal) arr[j] = this.getMaskValue(j, dataObj, keyVal);
				else arr[j] = ''; 
			}

			row = this.prependRow(arr);
			this.realMap[data.key] = row;
			this.timeShare = timeShare;
		}
		else
		{
			row = realRow;
			
			var idx = 0, cell;
			for(var j=0; j<keyArr.length; j++)
			{
				keyVal = keyArr[j];
				cell = this.getCell(row, idx);
				
				if(!cell) continue;

				if(cell.getAttribute('data-span'))
				{
					idx++;
					j--;
					continue;
				}

				if(keyVal && data[keyVal] != undefined) 
				{
					ret = this.getMaskValue(j, dataObj, keyVal, cell);
					if(ret) this.setCellText(row, idx, ret);
				}
				
				idx++;
			}
		}
	}
	
	//insert
	else
	{
		arr = new Array(keyArr.length);
		for(var j=0; j<keyArr.length; j++)
		{
			keyVal = keyArr[j];

			if(keyVal) arr[j] = this.getMaskValue(j, dataObj, keyVal);
			else arr[j] = '';
		}

		//prepend
		if(this.updateType==-1) row = this.prependRow(arr);
		//append
		else if(this.updateType==1) row = this.addRow(arr, true);
	}
	
	if(this.includeData) row.get(0).oridata = data; 
};

AGrid.prototype.doAddPattern = function(dataArr, keyArr, queryData)
{
	var data, row, keyVal, arr;
	
	if(this.realMap && this.updateType!=0) //insert 는 리얼맵을 만들지 않는다.
	{
		if(this.updateType == 2)
		{
			if(dataArr && dataArr.length > 0)
			{
				this.timeShare = parseInt(afc.formatSecond(dataArr[0][this.timeKey])/this.updateTime, 10);
				if(this.timeShare > afc.formatSecond('240000')/this.updateTime) this.timeShare = 0;
			}
		}
		else this.realMap = null;
		
	}

	for(var i=0; i<dataArr.length; i++)
	{
	
		data = dataArr[i];
		arr = new Array(keyArr.length);

		for(var j=0; j<keyArr.length; j++)
		{
			keyVal = keyArr[j];

			if(keyVal) arr[j] = this.getMaskValue(j, data, keyVal);
			else arr[j] = ''; 
		}

		row = this.addRow(arr);
		if(this.includeData) row.get(0).oridata = data;

		//리얼맵 생성 중...
		if(this.realMap) 
		{
			//히스토리 기간 일별 같은 경우... 최상단 로우에 리얼 업데이트가 필요
			//추가되는 로우가 덮어써지지 않도록 함.
			
			if(data.key) 
			{
				if(!this.realMap[data.key]) this.realMap[data.key] = row;
			}
			else 
			{
				for(var k=0; k<data.keys.length; k++)
					if(!this.realMap[data.keys[k]]) this.realMap[data.keys[k]] = row;
			}
		}
	}

	if(this.bkManager) this.bkManager.applyBackupScroll();
};


AGrid.prototype.getQueryData = function(dataArr, keyArr)
{
	
};

AGrid.prototype.createBackup = function(maxRow, restoreCount)
{
	if(!window['BackupManager']) return;
	
	//if(this.bkManager) return;//this.bkManager.destroy();
	
	this.destroyBackup();

	this.bkManager = new BackupManager();
	this.bkManager.create(this, maxRow, restoreCount);
	this.bkManager.setBackupInfo(this.rowTmplHeight, this.rowTemplate.length, this.scrollArea[0], this.tBody);
	
	//we don't use grid scroll in PivotGridView
	if(this.scrollArea) this.aevent._scroll();
	
	//ios must enable scrollManager in backup
	if(afc.isIos) this.enableScrlManager();
};

AGrid.prototype.destroyBackup = function()
{
	if(this.bkManager)
	{
		this.bkManager.destroy();
		this.bkManager = null;
	}
};

//-----------------------------------------------------
//	BackupManager delegate function

AGrid.prototype.getTopItem = function()
{
	return this.getFirstRow();
};

AGrid.prototype.getBottomItem = function()
{
	return this.getLastRow();
};

AGrid.prototype.getTotalCount = function()
{
	return this.getRowCount();
};

//--------------------------------------------------------------

AGrid.prototype.toggleColIndex = function(groupIdx, colIdx)
{
	var headCols = this.headerTable.find('col');
    var bodyCols = this.bodyTable.find('col');
    
    var curOfs = this.toggleColArr[groupIdx][this.toggleColOfs[groupIdx]];
    
    headCols.eq(curOfs)[0].width = 0;
	this.headerTable.find('tr').children().eq(curOfs).text('');
    bodyCols.eq(curOfs)[0].width = 0;
    
    this.toggleColOfs[groupIdx]=colIdx;
    
	//if(this.toggleColArr[groupIdx].length <= this.toggleColOfs[groupIdx]) this.toggleColOfs[groupIdx] = 0;
	
	curOfs = this.toggleColArr[groupIdx][this.toggleColOfs[groupIdx]];
	var text = this.toggleHeadArr[groupIdx][this.toggleColOfs[groupIdx]];
	if(text) this.headerTable.find('tr').children().eq(curOfs).text(text);
	this.headerTable.find('tr').children().eq(curOfs).show();
	headCols.eq(curOfs)[0].width = '';
   	bodyCols.eq(curOfs)[0].width = '';
};
