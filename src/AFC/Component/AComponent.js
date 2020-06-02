/**
 * @author asoocool
 */

/*
this.dataKeyMap = 
{
	obcpp_logn_025a:
	{
		InBlock1: ['UI_UNIT_CLS', 'WRAP_ACNT_YN', '', '', ''], 
		InBlock2: ['', '' ,'ACNO', 'ASNO', '']
	},
	
	obcpp_logn_101a:
	{
		OutBlock1: ['UI_UNIT_CLS', 'WRAP_ACNT_YN', '', '', ''], 
		OutBlock2: ['', '' ,'ACNO', 'ASNO', ''],
		NextBlock1: ['WRAP_ACNT_YN'],
	}
}
*/

function AComponent()
{
    this.element = null;		//dom tree object
    this.$ele = null;			//jQuery object
    this.parent = null;			//parent AView
    this.aevent = null;
    this.eventStop = true;		//클릭 업 이벤트시 이벤트 전달 막음
    
	this.isEnable = true;
	this.events = null;
	this.baseName = '';
	this.className = this.constructor.name;
	
	this.compId = '';
	this.groupName = '';
	
	//	드래그 & 드랍 Manager
	this.ddManager = null;
	
	//자신이 사용할 네트웍 블럭의 data key
	this.dataKeyMap = null;
	this.mappingType = 0;
	
	this.sgapW = null;
	this.sgapH = null;
	this.centerX = null;
	this.centerY = null;
	
}

AComponent.VISIBLE = 0;
AComponent.INVISIBLE = 1;
AComponent.GONE = 2;

AComponent.MASK = [afc.returnAsIt, afc.addComma, afc.addPercent, afc.commaPercent, afc.absPercent,
				   afc.absComma, afc.absCommaPercent, afc.abs, afc.formatDate, afc.formatTime,
				   afc.formatMonth, afc.formatDateTime, afc.formatTic, afc.floor2, afc.floor2Per,
				   afc.intComma, afc.plusfloorPercent, afc.absFloor2, afc.absFloor2Per, afc.formatHMS,
				   afc.sigaTotalAmount, afc.capitalAmount, afc.intComma, afc.addCommaIfFixed, afc.absCommaIfFixed,
				   afc.absFloor1, afc.formatDate2, afc.oneHundredMillionAmount ];

AComponent.prototype.init = function(context, evtListener)
{
    //if(typeof(context)=="string") this.element = $(context)[0];
    //직접 객체가 넘어오는 경우 -> $('')[0]
    //else this.element = context;
    
    if(!context)
    {
    	var compInfo = afc.COMP_CTX[this.className];
		context = $(compInfo.tag);
		context.css(compInfo.defStyle);
		this.element = context[0];
    }
    else this.element = context;
    
	this.events = {};
    this.element.acomp = this;	//AComponent object
    
    this.$ele = $(this.element);
    
    //컴포넌트 아이디값 셋팅, 클래스 명은 제거한다.
	var inx = this.element.id.indexOf(afc.CLASS_MARK);
	if(inx>-1) this.compId = this.element.id.substring(inx+afc.CMARK_LEN);
	
	//그룹네임을 셋팅한다.
	this.groupName = this.getAttr(afc.ATTR_GROUP);
    
	this.baseName = this.getAttr(afc.ATTR_BASE);
	//APage 와 같이 delegator 방식인 경우 className 을 다싯 셋팅해야 하기 때문에 
	//다시 한번 셋팅한다.
	this.className = this.getAttr(afc.ATTR_CLASS);

	this.sgapW = this.getAttr('data-sgap-width');
	this.sgapH = this.getAttr('data-sgap-height');
	this.centerX = this.getAttr('data-center-left');
	this.centerY = this.getAttr('data-center-top');
	
	//if(evtListener) this.loadEventInfo(evtListener);
	this.loadEventInfo(evtListener);
	this.loadQueryInfo();
	
	//if(this.defaultAction) this.defaultAction();
};

AComponent.prototype.reuse = function()
{
	//기존 정보를 이용하여 aquery.addQueryComp() 만 다시 셋팅한다.
	this.reuseQueryInfo();
};

//Do not call directly 
AComponent.prototype.release = function()
{
	this.removeFromAQuery();
	this.ddManager = null;
};

//현재 받은 데이터의 key에 값이 없을경우 이전 데이터를 merge함
AComponent.prototype.preValMerge = function(comp, data, keyArr)
{
	if(!comp.preVal) comp.preVal = new Object();
	
	var keyOne = null;
	for(var i = 0; i<keyArr.length; i++)
	{
		keyOne = keyArr[i];
		if(data[keyOne]) comp.preVal[keyOne] = data[keyOne];
		else data[keyOne] = comp.preVal[keyOne];
	}
};

AComponent.prototype.getContainer = function()
{
	return this.element.container; 
};

AComponent.prototype.getContainerId = function()
{
	if(this.element.container) return this.element.container.getContainerId();
	else return null;
};

AComponent.prototype.getRootView = function()
{
	return this.element.rootView; 
};

AComponent.prototype.getElement = function()
{
    return this.element;
};

AComponent.prototype.get$ele = function()
{
	return this.$ele;
};

AComponent.prototype.getStyle = function(key)
{
	if(this.element) return this.element.style[key];
	else return '';
};

AComponent.prototype.setStyle = function(key, value)
{
	if(this.element) this.element.style[key] = value;
};

AComponent.prototype.setStyleObj = function(obj)
{
	if(this.element)
	{
		for(var p in obj)
    		this.element.style[p] = obj[p];
	}
};

AComponent.prototype.getAttr = function(key)
{
	return this.element.getAttribute(key);
};

AComponent.prototype.setAttr = function(key, value)
{
	if(this.element) return this.element.setAttribute(key, value);
	else return null;
};

/*
AComponent.prototype.addClass = function(className)
{
	var curClass = this.element.className;
	
    if(curClass.indexOf(className)==-1)
    	this.element.className = curClass+' '+className;
};

AComponent.prototype.removeClass = function(className)
{
	this.element.className = this.element.className.replace(' '+className, '');
};
*/

AComponent.prototype.addClass = function(className)
{
	if(this.$ele) this.$ele.addClass(className);
};

AComponent.prototype.removeClass = function(className)
{
	if(this.$ele) this.$ele.removeClass(className);
};

//직접 호출하지 말것. 실제로 컴포넌트의 부모를 바꾸러면 parent.addComponent 를 사용해야 함.
//addComponent 만 호출하면 이전 부모에서 자동으로 새로운 부모로 이동함, 이전 부모에서 삭제하지 않아도 됨.
AComponent.prototype.setParent = function(parent)
{
	if(parent)
	{
		this.element.container = parent.getContainer();
		this.element.rootView = parent.getRootView();
		
		if(this.compId!='')
			this.element.id = this.element.rootView.className+afc.CLASS_MARK+this.compId;
	}
	
	this.parent = parent;
};

AComponent.prototype.getParent = function()
{
	return this.parent;
};

//편집기에서 셋팅한 id
AComponent.prototype.getComponentId = function()
{
	return this.compId;
};

AComponent.prototype.setComponentId = function(compId)//, findOwner)
{
	//if(findOwner) this.element.id = findOwner.className+afc.CLASS_MARK+compId;
	//else this.element.id.replace(afc.CLASS_MARK+this.compId, afc.CLASS_MARK+compId);
	
	if(this.element.id)
		this.element.id.replace(afc.CLASS_MARK+this.compId, afc.CLASS_MARK+compId);
	
	this.compId = compId;
};

AComponent.prototype.getGroupName = function()
{
	return this.groupName;
};

AComponent.prototype.setGroupName = function(groupName)
{
	this.setAttr('data-group', groupName);
	this.groupName = groupName;
};

//태그의 id attribute (실제 id)
AComponent.prototype.getElementId = function()
{
	return this.element.id;
};

/*
AComponent.prototype.setElementId = function(eleId)
{
	var inx = eleId.indexOf(afc.CLASS_MARK);
	this.compId = eleId.substring(inx+afc.CMARK_LEN);
	this.element.id = eleId;
};
*/

AComponent.prototype.isShow = function()
{
	return (this.$ele.css('display')!='none' && this.$ele.css('visibility')=='visible');
};

AComponent.prototype.show = function(showType)
{
	switch(showType)
	{
		case AComponent.VISIBLE:
			this.$ele.show(); 
			this.$ele.css('visibility', 'visible');
		break;
		
		case AComponent.INVISIBLE: 
			this.$ele.css('visibility', 'hidden');
		break;
			
		case AComponent.GONE: this.$ele.hide(); break;
	}
};

AComponent.prototype.enable = function(isEnable)
{
	this.isEnable = isEnable;
	
	if(isEnable) this.$ele.css('pointer-events', 'auto');
	else this.$ele.css('pointer-events', 'none');
};

//{left,top,right,bottom}
AComponent.prototype.getBoundRect = function()
{
	return this.element.getBoundingClientRect();
};

AComponent.prototype.getPos = function()
{
	return this.$ele.position();
};

AComponent.prototype.setPos = function(pos)
{
	this.$ele.css( { 'left': pos.left+'px', 'top': pos.top+'px' });
};

AComponent.prototype.getWidth = function()
{
	return this.$ele.width();
};

AComponent.prototype.getHeight = function()
{
	return this.$ele.height();
};

AComponent.prototype.setWidth = function(w)
{
	this.$ele.width(w);
};

AComponent.prototype.setHeight = function(h)
{
	this.$ele.height(h);
};

AComponent.prototype.setInlineStyle = function()
{
	this.setStyleObj({ position:'static', display:'inline-block', 'margin-bottom':'-5px' });
	//this.setStyleObj({ position:'static', display:'inline-table', 'margin-bottom':'-5px' });
};

AComponent.prototype.removeFromView = function(onlyRelease)
{
	this.release();
	
	//리스트뷰가 view pool 을 사용할 경우 
	if(!onlyRelease)
	{
		this.setParent(null);
		this.$ele.remove();
    	this.$ele = null;
		this.element = null;
	}
};

AComponent.prototype.addEventListener = function(evtName, listener, funcName)
{
	var evts = this.events[evtName];
	if(!evts) 
	{
		evts = new Array();
		this.events[evtName] = evts;
		
		//AXEvent 가 구현해 놓은 event 처리 함수를 얻어온다.
		var evtFunc = this.aevent[evtName];
		if(evtFunc) evtFunc.call(this.aevent);
	}
	
	//기존에 같은 이벤트, 같은 리스너가 등록되어 있다면 삭제 -> removeEventListener 함수 내부에서 체크
	else this.removeEventListener(evtName, listener);
	
	evts.push(
	{
		'listener': listener,
		'funcName': funcName
	});
};

AComponent.prototype.removeEventListener = function(evtName, listener)
{
	var evts = this.events[evtName];
	
	if(evts)
	{
		for(var i=0; i<evts.length; i++)
		{
			if(evts[i].listener===listener)
			{
				evts.splice(i, 1);
				return;
			}
		}
	}
};

/*
AComponent.prototype.reportEvent = function(evtName, info, delay)
{
	var evts = this.events[evtName];
	
	if(evts)
	{
		var thisObj = this;
		
		//_reportHelper();
		if(delay==undefined || delay<=0) _reportHelper();
		else setTimeout(_reportHelper, delay);
		
		function _reportHelper()
		{
			var evt;
			for(var i=0; i<evts.length; i++)
			{
				evt = evts[i]; 
				evt.listener[evt.funcName](thisObj, info);
			}
		}		
	}
};
*/

//setTimeout so slow...
AComponent.prototype.reportEvent = function(evtName, info)
{
	var evts = this.events[evtName];
	
	if(evts)
	{
		var evt;
		for(var i=0; i<evts.length; i++)
		{
			evt = evts[i]; 
			evt.listener[evt.funcName](this, info);
		}
	}
};

AComponent.prototype.reportEventDelay = function(evtName, info, delay)
{
	var thisObj = this;
	
	setTimeout(function()
	{
		thisObj.reportEvent(evtName, info);
		
	}, delay);
};

/*
AComponent.prototype.updatePosition = function(pWidth, pHeight)
{
	//stretch-margin 계산
	var valX = this.getAttr('data-sgap-width');
	var valY = this.getAttr('data-sgap-height');
	if(valX) this.setStyle('width', this.calcStretch('left', valX, pWidth)+'px');
	if(valY) this.setStyle('height', this.calcStretch('top', valY, pHeight)+'px');

	//center x,y 계산
	valX = this.getAttr('data-center-left');
	valY = this.getAttr('data-center-top');
	if(valX) this.setStyle('left', this.calcCenter('width', pWidth)+'px'); 
	if(valY) this.setStyle('top', this.calcCenter('height', pHeight)+'px');
};
*/

//pWidth : parent width, pHeight : parent height
AComponent.prototype.updatePosition = function(pWidth, pHeight)
{
	//stretch-margin 계산
	if(this.sgapW) this.setStyle('width', this.calcStretch('left', this.sgapW, pWidth)+'px');
	if(this.sgapH) this.setStyle('height', this.calcStretch('top', this.sgapH, pHeight)+'px');

	//center x,y 계산
	if(this.centerX) this.setStyle('left', (pWidth/2 - this.$ele.width()/2)+'px'); 
	if(this.centerY) this.setStyle('top', (pHeight/2 - this.$ele.height()/2)+'px');
};

AComponent.prototype.calcStretch = function(key, margin, pSize)
{
	var isPercent = (margin.indexOf('%')>-1);
	
	margin = parseInt(margin, 10);
	
	//if(isPercent) alert(margin);	
	
	var pos = this.getStyle(key);
	if(!pos || pos=='auto')
	{
		key = (key=='left') ? 'right' : 'bottom';
		pos = this.getStyle(key);
	}
	
	if(isPercent) margin = pSize*(margin/100);

	return (pSize - margin - parseInt(pos, 10));
};

/*
AComponent.prototype.calcCenter = function(key, pSize)
{
	var tSize = $(this.element).css(key);
	
	return pSize/2 - parseInt(tSize, 10)/2;
};
*/

AComponent.prototype.loadEventInfo = function(evtListener)
{
	var evtClass = window[this.baseName+'Event']; 
	
	//이벤트 구현 클래스가 존재하지 않는 경우
	if(!evtClass) return;
	
	this.aevent = new evtClass(this);
	this.aevent.defaultAction();
	
	if(evtListener)
	{
		var evtInfo, events = afc.getEventList(this.baseName);
	
		for(var i=0; i<events.length; i++)
		{
			evtInfo = this.getAttr(afc.ATTR_LISTENER+'-'+events[i]);
			if(evtInfo)
			{
				evtInfo = evtInfo.split(':');
				this.addEventListener(events[i], evtListener, $.trim(evtInfo[1]));
				
				//AXEvent 가 구현해 놓은 event 처리 함수를 얻어온다.
				//evtFunc = this.aevent[events[i]];
				//if(evtFunc) evtFunc.call(this.aevent);
			}
		}
	}
};

AComponent.prototype.bindEvent = function(eventName, callback)
{
	AEvent.bindEvent(this.element, eventName, callback);
};

AComponent.prototype.unbindEvent = function(eventName, callback)
{
	AEvent.unbindEvent(this.element, eventName, callback);
};


AComponent.prototype.loadQueryInfo = function()
{
	//"obacb_balc_041r|obcpp_scrn_001r"
	var queryNames = this.getAttr(afc.ATTR_QUERY_NAME);
	
	if(!queryNames || queryNames=='') return;

	//정보가 존재하면 메모리 할당
	this.dataKeyMap = {};
	
	//쿼리 매핑 방법에 대한 셋팅 값
	var mtype = this.getAttr('data-mapping-type');
	if(mtype) this.mappingType = parseInt(mtype, 10);
	
	queryNames = queryNames.split('|');	//[obacb_balc_041r, obcpp_scrn_001r]
	
	var aquery, qryName, keyBlocks, dataKeyArr, keyMapObj;
	var ctnrId = this.getContainerId();
	for(var i=0; i<queryNames.length; i++)
	{
		qryName = queryNames[i];
		aquery = AQuery.getSafeQuery(qryName);

		//"InBlock1,UI_UNIT_CLS,WRAP_ACNT_YN,,,|OutBlock2,,,ACNO,ASNO,"
		keyBlocks = this.getAttr('data-blocks-'+qryName);

		//real tr 이 아닌 경우만
		//if(aquery.getQueryType()!='.Feed')
		//{
			//auto mapping --> 필드키를 매핑한 상태를 보고 자동으로 블럭을 셋팅한다.
			if(this.mappingType==0)
			{
				//쿼리는 셋팅했지만 필드키를 매핑하지 않은 경우는 
				//쿼리에 컴포넌트를 등록하지 않는다.
				if(keyBlocks)
				{
					if(keyBlocks.indexOf('InBlock')>-1) aquery.addQueryComp(ctnrId, 'input', this);
					if(keyBlocks.indexOf('OutBlock')>-1) aquery.addQueryComp(ctnrId, 'output', this);
				}
			}
			//inblock mapping --> 필드키를 등록하지 않고도 input 영역에 컴포넌트를 등록할 수 있다.
			else if(this.mappingType==1) aquery.addQueryComp(ctnrId, 'input', this);
			//outblock mapping --> 필드키를 등록하지 않고도 output 영역에 컴포넌트를 등록할 수 있다.
			else if(this.mappingType==2) aquery.addQueryComp(ctnrId, 'output', this);
			
			//child mapping -> 부모 뷰가 자식의 updateComponent 를 호출해 주므로 addQueryComp 를 하지 않는다.
			//else if(this.mappingType==3);
		//}

		if(!keyBlocks || keyBlocks=='') this.dataKeyMap[qryName] = null;
		else 
		{
			keyMapObj = this.dataKeyMap[qryName] = {};

			//["InBlock1,UI_UNIT_CLS,WRAP_ACNT_YN,,,", "OutBlock2,,,ACNO,ASNO,"]
			keyBlocks = keyBlocks.split('|');
			for(var j=0; j<keyBlocks.length; j++)
			{
				dataKeyArr = keyBlocks[j].split(',');
				
				//obcpp_logn_101a: 
				//{ 
				//	InBlock1: ['UI_UNIT_CLS', 'WRAP_ACNT_YN', '', '', ''], 
				//	OutBlock2:['', '' ,'ACNO', 'ASNO', ''] 
				//}
				keyMapObj[dataKeyArr[0]] = dataKeyArr;
				dataKeyArr.shift();	//첫번째 원소 blockName 은 삭제
			}
		}
		
	}
};


AComponent.prototype.reuseQueryInfo = function()
{
	if(!this.dataKeyMap) return;
	
	var aquery, qryName, keyBlocks;
	var ctnrId = this.getContainerId();
	for(qryName in this.dataKeyMap)
	{
		aquery = AQuery.getSafeQuery(qryName);
		
		//"InBlock1,UI_UNIT_CLS,WRAP_ACNT_YN,,,|OutBlock2,,,ACNO,ASNO,"
		keyBlocks = this.getAttr('data-blocks-'+qryName);
		
		//real tr 이 아닌 경우만
		if(aquery.getQueryType()!='.Feed')
		{
			//auto mapping
			if(this.mappingType==0)
			{
				if(keyBlocks)
				{
					if(keyBlocks.indexOf('InBlock')>-1) aquery.addQueryComp(ctnrId, 'input', this);
					if(keyBlocks.indexOf('OutBlock')>-1) aquery.addQueryComp(ctnrId, 'output', this);
				}
			}
			//inblock mapping
			else if(this.mappingType==1) aquery.addQueryComp(ctnrId, 'input', this);
			//outblock mapping
			else if(this.mappingType==2) aquery.addQueryComp(ctnrId, 'output', this);
			
			//child mapping -> 부모 뷰가 자식의 updateComponent 를 호출해 주므로 addQueryComp 를 하지 않는다.
			//else if(this.mappingType==3);
		}
	}
	
};

AComponent.prototype.removeFromAQuery = function()
{
	if(!this.dataKeyMap) return;
	
	var aquery, qryName;
	var ctnrId = this.getContainerId();
	for(qryName in this.dataKeyMap)
	{
		aquery = AQuery.getSafeQuery(qryName);
		
		if(aquery)
		{
			//afc.log(ctnrId + ':' + qryName);
		
			aquery.removeQueryComp(ctnrId, 'input', this);
			aquery.removeQueryComp(ctnrId, 'output', this);
		}
	}
};

AComponent.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	/*	
	//---- example ----
	
	if(!keyArr) return;
	
	var data, value;
	for(var i=0; i<3; i++)
	{
		data = dataArr[i];
		for(var j=0; j<keyArr.length; j++)
		{
			value = ... ;
			data[keyArr[j]] = value;
		}
	}
	
	//InBlock 이 occurs 인 경우
	//실제로 셋팅된 개수로 맞춰줘야 한다. 이후의 원소는 삭제된다.	
	dataArr.length = 3;	
	
	//--------------------
	// simple
	//--------------------
	
	if(!keyArr) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getText();
	*/
};

AComponent.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	/*	
	//---- example ----
	
	if(!keyArr) return;
	
	var data, value;
	for(var i=0; i<dataArr.length; i++)
	{
		data = dataArr[i];
		for(var j=0; j<keyArr.length; j++)
		{
			value = data[keyArr[j]];
			...
		}
	}
	
	//--------------------
	// simple
	//--------------------
	
	if(!keyArr) return;
	
	var data = dataArr[0];
	this.setText(data[keyArr[0]]);
	*/
};

//Component 의 값을 QueryData 에 반영한다.
AComponent.prototype.updateQueryData = function(queryData)
{
	var keyMap = this.dataKeyMap[queryData.getQueryName()];
	if(keyMap)
	{
		for(var blockName in keyMap)
			this.getQueryData(queryData.getBlockData(blockName), keyMap[blockName], queryData);
	}
	//else if(this.mappingType!=3) this.getQueryData(null, null, queryData);
	else this.getQueryData(null, null, queryData);
};

/*
//queryData 의 값을 컴포넌트에 반영한다.
AComponent.prototype.updateComponent = function(queryData)
{
	var qryName = queryData.getQueryName(), keyMap, blockName;
	
	//qryName 없이 queryData 가 넘어오면 리얼 데이터이다.
	//리얼데이터 수신 시 dataKey 가 동일한 컴포넌트 들은 일단 모두 updateComponent 가 호출된다.
	//자신이 사용하는 fid 와 사용하지 않는 fid 가 혼합되어 들어오기 때문에(자신이 전혀 사용하지 않는 fid 만 셋팅되어져 올 수도 있다.)
	//setQueryData 내부에서 비교 로직을 구현해야 한다. io 엔진에서 미리 비교하여 사용하지 않으면 넘겨주지 않을 수도 있지만
	//여러개중에서 하나라도 사용되면 넘겨주기때문에 어차피 setQueryData 내부에서 다시 비교해야 하므로 비효율적이다.
	if(!qryName)
	{
		for(var i=0; i<this.realQryNames.length; i++)
		{
			keyMap = this.dataKeyMap[this.realQryNames[i]];
			if(keyMap)
			{
				for(blockName in keyMap)
					this.setQueryData(queryData.getBlockData(blockName), keyMap[blockName], queryData);
			}
			else this.setQueryData(null, null, queryData);
		}
	}
	else
	{
		keyMap = this.dataKeyMap[qryName];
		if(keyMap)
		{
			for(blockName in keyMap)
				this.setQueryData(queryData.getBlockData(blockName), keyMap[blockName], queryData);
		}
		else this.setQueryData(null, null, queryData);
	}
};
*/

//queryData 의 값을 컴포넌트에 반영한다.

//--------------------------------------------------------------------------------------------------------------------
//리얼데이터 수신 시 dataKey 가 동일한 컴포넌트 들은 일단 모두 updateComponent 가 호출된다.
//자신이 사용하는 fid 와 사용하지 않는 fid 가 혼합되어 들어오기 때문에(자신이 사용하지 않는 fid 만 셋팅 되어져 올 수도 있다.)
//setQueryData 내부에서 비교 로직을 구현해야 한다. io 엔진에서 미리 비교하여 사용하지 않으면 넘겨주지 않을 수도 있지만
//여러개중에서 하나라도 사용되면 넘겨주기때문에 어차피 setQueryData 내부에서 다시 비교해야 하므로 비효율적이다.

//--> 다음과 같이 변경
	
//자신과 상관없는 queryData 는 들어오지 않도록 체크해 주고 있음.
//하지만 자신이 사용하는 fid 와 사용하지 않는 fid 가 혼합되어 들어오기 때문에(여러개 중에서 하나라도 사용되면 넘겨준다.)
//setQueryData 내부에서 비교 로직을 구현해야 한다. 
//--------------------------------------------------------------------------------------------------------------------

AComponent.prototype.updateComponent = function(queryData)
{
	var qryName = queryData.getQueryName(), keyMap, blockName;

	/*
	try 
	{
		keyMap = this.dataKeyMap[qryName];
		if(keyMap)
		{
			for(blockName in keyMap)
				this.setQueryData(queryData.getBlockData(blockName), keyMap[blockName], queryData);
		}
		else this.setQueryData(null, null, queryData);
	} 
	catch(e) 
	{
		alert(e.stack);
	}
	*/

	keyMap = this.dataKeyMap[qryName];
	if(keyMap)
	{
		for(blockName in keyMap)
			this.setQueryData(queryData.getBlockData(blockName), keyMap[blockName], queryData);
	}
	else this.setQueryData(null, null, queryData);

};


//---------------
/*
AComponent.prototype.addRealQryName = function(qryName)
{
	if(!this.realQryNames) this.realQryNames = [];
	
	for(var i=0; i<this.realQryNames.length; i++)
	{
		if(this.realQryNames[i]==qryName) return;
	}
	
	this.realQryNames.push(qryName);
};

AComponent.prototype.removeRealQryName = function(qryName)
{
	if(!this.realQryNames) return;
	
	for(var i=0; i<this.realQryNames.length; i++)
	{
		if(this.realQryNames[i]==qryName)
		{
			this.realQryNames.splice(i, 1);
			return;
		}
	}
};
*/

//----------------------

AComponent.prototype.toString = function()
{
	var ret = '\n{\n', value;
    for(var p in this) 
    {
        if(!this.hasOwnProperty(p)) continue;
        
        value = this[p];
        
        if(typeof(value) == 'function') continue;
        
        else if(value instanceof HTMLElement)
        {
        	if(afc.logOption.compElement) ret += '    ' + p + ' : ' + $(value)[0].outerHTML + ',\n';
        	else ret += '    ' + p + ' : ' + value + ',\n';
        }
        else if(value instanceof Object) ret += '    ' + p +' : ' + value.constructor.name + ',\n';
		else ret += '    ' + p + ' : ' + value + ',\n';
    }
    ret += '}\n';
    
    return ret;
};

//drag & drop 관련
AComponent.prototype.enableDrag = function(isDraggable, offsetX, offsetY)
{
	if(!this.ddManager) this.ddManager = new DDManager(this);
	
	if(!offsetX) offsetX = 0;
	if(!offsetY) offsetY = 0;
	
	this.ddManager.setOffset(offsetX, offsetY);
	this.ddManager.enableDrag(isDraggable);
};

AComponent.prototype.enableDrop = function(isDroppable)
{
	if(!this.ddManager) this.ddManager = new DDManager(this);
	this.ddManager.enableDrop(isDroppable);
};

AComponent.prototype.actionDelay = function(filter)
{
	var fComp = this.$ele;
	if(filter) fComp = this.$ele.find(filter);
	  
	fComp.css('pointer-events', 'none');
	
	var thisObj = this;
	setTimeout(function() 
	{
		if(thisObj.$ele) fComp.css('pointer-events', 'auto'); 
	}, afc.DISABLE_TIME);
};

//android 4.3 이하, BugFix
//윈도우가 구현한 preventDefault 가 실행되지 않도록, AWindow.prototype.preventTouch 참조
AComponent.prototype.escapePreventTouch = function()
{
	if(afc.andVer>4.3) return;
	
	if(this.getContainer() instanceof AWindow)
	{
		var thisObj = this;
	    this.$ele.bind('touchstart', function(e)
	    {
			//스크롤 매니저가 구현된 컴포넌트는 리턴
			if(thisObj.scrlManager || thisObj.scrlManagerX || thisObj.scrlManagerY) return;
	    	
	    	if(thisObj.isScroll && !thisObj.isScroll()) return; 
	    	
	    	e.stopPropagation();
	    });
	}
};

AComponent.prototype.escapePreventDefault = function()
{
    this.$ele.bind('touchstart', function(e)
    {
    	e.stopPropagation();
    });
};

AComponent.prototype.setEventSync = function(dstEventEle) 
{
	if(dstEventEle)
	{
		if(this.downHandler) this.setEventSync(null);
	
		this.downHandler = function(e)	{ AEvent.triggerEvent(dstEventEle, AEvent.ACTION_DOWN, e); };
		this.moveHandler = function(e)	{ AEvent.triggerEvent(dstEventEle, AEvent.ACTION_MOVE, e); };
		this.upHandler = function(e)	{ AEvent.triggerEvent(dstEventEle, AEvent.ACTION_UP, e); };
	
		AEvent.bindEvent(this.element, AEvent.ACTION_DOWN, this.downHandler);
		AEvent.bindEvent(this.element, AEvent.ACTION_MOVE, this.moveHandler);
		AEvent.bindEvent(this.element, AEvent.ACTION_UP, this.upHandler);
	}
	else
	{
		AEvent.unbindEvent(this.element, AEvent.ACTION_DOWN, this.downHandler);
		AEvent.unbindEvent(this.element, AEvent.ACTION_MOVE, this.moveHandler);
		AEvent.unbindEvent(this.element, AEvent.ACTION_UP, this.upHandler);
		
		this.downHandler = this.moveHandler = this.upHandler = null;
	}
};

//info : {maxChar:15, fontSize:24}
AComponent.prototype.autoShrink = function(info) 
{
	this.$ele.autoShrink(info);
};

//info : {maxChar:15, fontSize:24}
AComponent.prototype.setShrinkInfo = function(info)
{
	this.shrinkInfo = info;
};

// 2019-04-15 : 이경임
// 크롬 웹뷰 72 화면 스크롤 깨짐 이슈 해결 위해
// 컴포넌트의 오버플로우 속성을 hidden으로, 최소 가로/세로 길이를 0으로 설정
AComponent.prototype.fixScrlLayout = function()
{
	this.$ele.css({'min-height':0 , 'min-width':0 , 'overflow':'hidden'});
};











