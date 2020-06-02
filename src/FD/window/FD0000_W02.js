
/**
Constructor
Do not call Function in Constructor.
*/
function FD0000_W02(containerId)
{
	BaseWindow.call(this, containerId);

	this.menuSupportWin = null; 
	this.menuView = null;
	
	this.scrollEleArr = [];
	this.scrollArr = [0];
}
afc.extendsClass(FD0000_W02, BaseWindow);


FD0000_W02.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	this.menuView = this.findCompById('MenuView');

	this.showLastConnectTime();
	
	var thisObj = this;
	
	/*
	this.appCloseBtn = this.findCompById('AppCloseBtn');
	if(afc.isIos) this.appCloseBtn.$ele.hide();
	*/
	
	this.winHeight = this.opener.getHeight(); //$(document).height();
	this.setHeight(this.winHeight);	//컨텐츠 높이를 프레임페이지 높이로 한다.
	/*
	//모드뷰 영역 설정 초기화
	this.doInitModeView();
	
	//전체메뉴 탭매니저 초기화
	this.doInitTabManaer();
	*/
	this.doLoadMenuIni();
	
	//프레임페이지의 하단 버튼을 보이게 한다.
	theApp.frmPage.showBtmMenu();
	this.doChangeMode();
	
	this.doShow();
	
	this.btnFund = this.findCompById('Button10');
	
	this.btnFund.enable(false);
};

//모드 변경 함수
FD0000_W02.prototype.doChangeMode = function(mode)
{
	//모드에 따라 윈도우 크기 변경
	this.doChangeWinHeightInMode(mode);
};

/*
** 모드에 따라 윈도우크기 변경
*@mode 현재 윈도우 모드
*/
FD0000_W02.prototype.doChangeWinHeightInMode = function(mode)
{
	var docuHeight = $(document).height();
	this.frame.height(docuHeight);
	
	if('edit' == mode)
	{
		this.frame.css('height', docuHeight + "px");	//윈도우 크기를 프레임페이지 크기로
	}
	else
	{
		this.frame.css('height', (docuHeight-95) + "px" );
	}
}

FD0000_W02.prototype.doLoadMenuIni = function()
{
	var bigMenus = theApp.menuInfo.getMenuInfo();
	
	this.doSetHomeMenuBtnsTabSubView(this.menuView, bigMenus);
};

//윈도우 보일때
FD0000_W02.prototype.doShow = function()
{
	this.showLastConnectTime();
	
	this.frame.css('z-index', (AWindow.BASE_ZINDEX + AWindow.wndList.length*100));
	
	//this.opener.showBtmMenu();
	/*
	this.opener.menuBtn.removeClass('BT_015_NOR');
	this.opener.menuBtn.addClass('BT_015_X_NOR');
	
	this.opener.menuBtn.$ele.addClass('startFlip').one('webkitAnimationEnd', function(){
		$(this).removeClass('startFlip');
	});
	*/
	/*
	this.tvManager.tabView.enableAnimation(false); //.isAnimation = true;
	this.tvManager.changeTab('MenuHomeBtn');
	*/
	this.show();
	this.reCalcScrollArr();
	/*
	this.doAddHistoryBtn();
	this.reCalcScrollArr();
	this.tvManager.tabView.enableAnimation(true); //.isAnimation = true;
	*/
	this.view.setHeight($(document).height() -theApp.frmPage.btmAreaView.getHeight());
	//this.view.setHeight($(document).height());
	this.view.updatePosition();
	/*
	this.doInitAllMenuViewHeight();
	*/
};

//메뉴윈도우 닫힐때 
FD0000_W02.prototype.doHide = function()
{
	var thisObj = this;
	setTimeout(function(){
		thisObj.hide();
		/*
		thisObj.onClearBtnClick();
		*/
	}, 100);
}; 



//메뉴윈도우 닫힐때 
FD0000_W02.prototype.onClose = function(){
	
	this.doHide();
	
	return false;
	
}; 

/*
**홈메뉴(전체메뉴)뷰 내용 생성
@view 탭의 홈서브뷰, 편집모드 전체메뉴 뷰
*/
FD0000_W02.prototype.doSetHomeMenuBtnsTabSubView = function(view, bigMenus, noPush)
{
	var bMenu, btnIdx, childMenus, subMenus, posTop = 0, me = this, oMenuName;
	
	view.enableScrlManagerY();
	
	
	//뷰초기화
	view.removeChildren(); 
	
	/*
	//전체메뉴일 경우 히스토리 메뉴 생성
	this.doSetMenuHistoryView(view);
	*/
	var oneDepth = null;
	var curBigMenuBtn = null;
	var hideBtnCnt = 0;
		
	for(var m=0; m < bigMenus.length-1; m++)
	{		
		// 1Depth
		btnIdx = m+1;
		bMenu = bigMenus[m];
		
		if(!bMenu.info[0])
		{
			if(!noPush)
			{
				/*
				// bigMenuGrp : 왼쪽 메뉴
				this.bigMenuGrp[m+1].$ele.remove();
				this.bigMenuGrp.splice([m+1], 1);
				hideBtnCnt++;
				*/
			}
			continue;
		}
		else
		{
			if(!noPush)
			{
				/*
				this.bigMenuGrp[m+1-hideBtnCnt].setText(bMenu.name);
				*/
			}
		}
		
		/*
		oneDepth = $('<div class="LINE_007"><span class="LB_028_2 B" style="width:197px;">'+bMenu.name+'</span></div>');
		view.$ele.append(oneDepth);
		
		if(!noPush)
		{
			this.scrollEleArr.push(oneDepth);
			this.scrollArr.push(oneDepth.position().top);
		}
		*/
		
		// 2Depth
		subMenus = bigMenus[m].children;

		for(var subMenu = 0; subMenu < subMenus.length; subMenu++)
		{
			if(!subMenus[subMenu].info[0]) continue;
			
			//모든 증권사에 보여줄 메뉴 셋팅  > 미포함 증권사는 skip
			if(subMenus[subMenu].info[3]) {
				var temp = false;
				for(var key in subMenus[subMenu].info[3]) {
					if(theApp.systemInfo.fno == subMenus[subMenu].info[3][key]) {
						temp = true;
						break;
					}
				}
				if(!temp) continue;
			}
			
			//
			// 그룹 View 생성
			// 
			var groupView = new AView();

			groupView.init();
			groupView.addClass('ui-droppable');
			groupView.addClass('menu_group');
			groupView.setAttr('data-style', 'menu_group');
			groupView.setAttr('data-float', 'left');
			
			groupView.$ele.css(
			{
				width: '100%',
				height: 'auto',
				'background-color': 'rgb(255, 255, 255)',
				'position': 'relative',
				'border': '0px solid rgb(255, 255, 255)',
				'float': 'left'
			});
			
			//
			// 그룹 제목 추가
			//
			var groupLabel = new ALabel();
			
			groupLabel.init();
			groupLabel.$ele.css(
			{
				'position': 'relative',
				'float': 'left',
				width: '100%',
				height: '71px'
			});
			
			groupLabel.setText(subMenus[subMenu].name);
			groupLabel.setStyle('color', 'rgb(0, 0, 0)');
			groupLabel.addClass('menu_1depth');
			groupLabel.setAttr('data-style', 'menu_1depth');
			groupView.addComponent(groupLabel);
			
			view.addComponent(groupView);
			
			// 3Depth
			childMenus = subMenus[subMenu].children;

			for(var childMenu=0; childMenu < childMenus.length; childMenu++)
			{

				//메뉴버튼 추가
				if(childMenus[childMenu].info[0] > 1)
				{
					//모든 증권사에 보여줄 메뉴 셋팅  > 미포함 증권사는 skip
					if(childMenus[childMenu].info[3]) {
						var temp = false;
						for(var key in childMenus[childMenu].info[3]) {
							if(theApp.systemInfo.fno == childMenus[childMenu].info[3][key]) {
								temp = true;
								break;
							}
						}
						if(!temp) continue;
					}
					
					//
					// 메뉴 버튼 추가
					//
					groupView.addComponent(me.doMakeMenuBtn(
						{
							name : childMenus[childMenu].name,
							pid  : childMenus[childMenu].info[1]
						},
						{
							clsNm : 'btn_2depth'
						}
					), false);
				}
			}
		}
	}
};

FD0000_W02.prototype.doMakeMenuBtn = function(btnInfo, Opt)
{
	var btn = new AButton();
	
	btn.init();
	btn.setComponentId(btnInfo.pid);
	btn.setText(btnInfo.name);
	
	btn.setAttr('data-pid', btnInfo.pid); // 화면번호
	btn.setAttr('data-bgcolor', 'rgba(0, 0, 0, 0)||');
	btn.setAttr('data-style', 'btn_2depth|btn_2depth|btn_2depth');
	
	btn.setBtnStyle(['btn_2depth', 'btn_2depth', 'btn_2depth']);
	btn.changeBtnState(-1, AButton.NORMAL);
	btn.addEventListener('click', this, 'onMenuButtonClick');
	
	btn.$ele.css(
	{
		'background-color': 'rgba(0, 0, 0, 0)',
		'position': 'relative',
		'text-align': 'left',
		'float': 'left',
		width: '100%',
		height: '100%'
	});
			
	return btn;
};

//전체메뉴에서 클릭
FD0000_W02.prototype.onMenuButtonClick = function(comp, info)
{	
	info.preventDefault();
	info.stopPropagation();
	
	var compId = comp.getComponentId();

	theApp.goPageCheck(compId);

	this.doHide();
};

FD0000_W02.prototype.reCalcScrollArr = function()
{
	this.menuView.element.scrollTop = 0;
	this.scrollArr = [];
	for(var i = 0; i < this.scrollEleArr.length; i++)
	{
		this.scrollArr.push(this.scrollEleArr[i].position().top);
	}
	this.scrollArr.push(this.menuView.element.scrollHeight);
};


FD0000_W02.prototype.onButton1Click = function(comp, info)
{
	// 기본정보: FD0100_W01
	
	this.menuWin = AWindow.createWindow('FD/window/FD0100_W01.lay', 'FD010001');
	/*
	this.menuWin.setWindowOption({
		isModal:false,
		isAutoCenter: false,		//자동 중앙정렬 할지
		isFocusLostClose: false,	//모달인 경우 포커스를 잃을 때 창을 닫을지
		isFocusLostHide: false,		//모달인 경우 포커스를 잃을 때 창을 숨길지
		modalBgOption: 'none',		//none, light, dark 모달인 경우 배경을 어둡기 정도
		overflow:'hidden',			//hidden, auto, visible, scroll
	});
	*/
	//this.menuWin.open(this, 0, 0, this.getWidth(), this.getHeight());
	this.menuWin.open(this, 0, 0, '100%', '100%');
	
	var thisObj = this;
	setTimeout(function(){
		thisObj.hide();
	}, 100);
};

FD0000_W02.prototype.onButton2Click = function(comp, info)
{
	// 고객센터: FD0100_W02
	//
	if(this.menuSupportWin)
	{
		if(!this.menuSupportWin.isShow())
		{	
			this.menuSupportWin.doShow();
		}
		else
		{
			this.menuSupportWin.doHide();
		}
	}
	else
	{
		this.menuSupportWin = AWindow.createWindow('FD/window/FD0100_W02.lay','FD010002');
		this.menuSupportWin.setWindowOption({
			isModal:false,
			isAutoCenter: false,		//자동 중앙정렬 할지
			isFocusLostClose: false,	//모달인 경우 포커스를 잃을 때 창을 닫을지
			isFocusLostHide: false,		//모달인 경우 포커스를 잃을 때 창을 숨길지
			modalBgOption: 'none',		//none, light, dark 모달인 경우 배경을 어둡기 정도
			overflow:'hidden',			//hidden, auto, visible, scroll
		});
		
		this.menuSupportWin.open(this, 0, 0, this.getWidth(), this.getHeight());
	};

	var thisObj = this;
	setTimeout(function(){
		thisObj.hide();
	}, 100);
};

FD0000_W02.prototype.onButton5Click = function(comp, info)
{
	// 환경설정: FD0100_W03
	//
	var win = AWindow.createWindow('FD/window/FD0100_W03.lay','FD010003');	
	win.openAsDialog(this.opener, this.opener.getWidth(), this.opener.getHeight());
	
	var thisObj = this;
	setTimeout(function(){
		thisObj.hide();
	}, 100);
};


FD0000_W02.prototype.onButton3Click = function(comp, info)
{
	theApp.goPageCheck('FD1101', false, {title: '펀드선물'});
	
	var thisObj = this;
	setTimeout(function(){
		thisObj.hide();
	}, 100);
};

FD0000_W02.prototype.onButton4Click = function(comp, info)
{
	// 공지사항 FD1103
	//
	theApp.goPageCheck('FD1103');
	
	var thisObj = this;
	setTimeout(function(){
		thisObj.hide();
	}, 100);
};

FD0000_W02.prototype.onLogoutBtnClick = function(comp, info)
{
	var thisObj = this;
	if(theApp.userInfo.isLogin())
	{
		theApp.confirm('<span>로그아웃 하시겠습니까?</span>', function(result){
			if(result)
			{
				theApp.autoLogout();
				setTimeout(function(){
					thisObj.doHide();
				}, 100);
			}
		}, '로그아웃', ['예', '아니오']);
	}
};

FD0000_W02.prototype.onCloseBtnClick = function(comp, info)
{
	this.doHide();
};

FD0000_W02.prototype.onHomeBtnClick = function(comp, info)
{
	if(theApp.subNavi) theApp.subNavi.clearHistory();
	
	theApp.goPageCheck('FD0002');
	
	this.doHide();
};

FD0000_W02.prototype. showLastConnectTime = function()
{
	this.userNameLbl = this.findCompById('UserNameLbl');
	this.userNameLbl.setText(theApp.userInfo.userObj['D1사용자명'] + ' 님');
	
	this.lastConnectDateLbl = this.findCompById('LastConnectDateLbl');
	
	var sDateTime = theApp.userInfo.userObj['D1최종로그인일시'];
	sDateTime =	sDateTime.substr(0,4) + '/' + 
				sDateTime.substr(4,2) + '/' + 
				sDateTime.substr(6,2) + ' ' + 
				sDateTime.substr(8,2) + ':' +
				sDateTime.substr(10,2) + ':' +
				sDateTime.substr(12,2)
	
	this.lastConnectDateLbl.setText(sDateTime);
};

// 연금펀드 진입 팝업 호출...
FD0000_W02.prototype.onbtnPensionFundClick = function(comp, info)
{
	//TODO:edit here
	PensionCommon.moveToPensionMainPopup(this);
};

// 연금펀드 진입 팝업 callback
FD0000_W02.prototype.callbackPensionPopup = function(returnData, resultData) {
	if(theApp.subNavi) {
		theApp.subNavi.clearHistory();
	}

	theApp.navigator.goPage('FrmPage2');
	this.doHide();
}
