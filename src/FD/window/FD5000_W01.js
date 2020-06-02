
/**
Constructor
Do not call Function in Constructor.
*/
function FD5000_W01(containerId)
{
	BaseWindow.call(this, containerId);

	this.menuSupportWin = null; 
	this.menuView = null;
	
	this.scrollEleArr = [];
	this.scrollArr = [0];
}
afc.extendsClass(FD5000_W01, BaseWindow);


FD5000_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	this.menuView = this.findCompById('MenuView');

	this.showLastConnectTime();
	
	var thisObj = this;
	this.openerObj = this.opener;
	
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
	//theApp.frmPage.showBtmMenu();
	this.doChangeMode();

	this.doShow();

	this.btnPensionFund = this.findCompById('btnPensionFund');
	
	this.btnPensionFund.enable(false);
};

//모드 변경 함수
FD5000_W01.prototype.doChangeMode = function(mode)
{
	//모드에 따라 윈도우 크기 변경
	this.doChangeWinHeightInMode(mode);
};

/*
** 모드에 따라 윈도우크기 변경
*@mode 현재 윈도우 모드
*/
FD5000_W01.prototype.doChangeWinHeightInMode = function(mode)
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

FD5000_W01.prototype.doLoadMenuIni = function()
{
	var bigMenus = theApp.menuInfo.getMenuInfo();
	
	this.doSetHomeMenuBtnsTabSubView(this.menuView, bigMenus);
};

//윈도우 보일때
FD5000_W01.prototype.doShow = function()
{
	this.showLastConnectTime();
	
	this.frame.css('z-index', (AWindow.BASE_ZINDEX + AWindow.wndList.length*100));
	this.show();
	this.reCalcScrollArr();
	this.view.setHeight($(document).height() - theApp.frmPage.btmAreaView.getHeight());
	this.view.updatePosition();
};

//메뉴윈도우 닫힐때 
FD5000_W01.prototype.doHide = function()
{
	var thisObj = this;
	setTimeout(function(){
		thisObj.hide();
	}, 100);
}; 



//메뉴윈도우 닫힐때 
FD5000_W01.prototype.onClose = function(){
	this.doHide();
	
	return false;
}; 

/*
**홈메뉴(전체메뉴)뷰 내용 생성
@view 탭의 홈서브뷰, 편집모드 전체메뉴 뷰
*/
FD5000_W01.prototype.doSetHomeMenuBtnsTabSubView = function(view, bigMenus, noPush)
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

	for(var m=0; m<bigMenus.length-1; m++)
	{		
		// 1Depth
		btnIdx = m + 1;
		//bMenu = bigMenus[m];
		
		// 2Depth
		subMenus = bigMenus[m].children;

		for(var subMenu = 0; subMenu < subMenus.length; subMenu++)
		{
			if(!subMenus[subMenu].info[0]) continue;
			if(m < 6) continue;
			
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

FD5000_W01.prototype.doMakeMenuBtn = function(btnInfo, Opt)
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
FD5000_W01.prototype.onMenuButtonClick = function(comp, info)
{	
	info.preventDefault();
	info.stopPropagation();
	
	var compId = comp.getComponentId();
	
	/*// 2차 개발 예정인 메뉴에 대해 안내 팝업으로 유도함...
	var arrComingSoon = new Array("FD5006_T02", "FD5006_T03","FD5004","FD5005_T02");
	var compCheck = false;
	
	for(var i=0; i<arrComingSoon.length; i++) {
		if(compId == arrComingSoon[i]) {
			compCheck = true;
			break;
		}
	}
	
	if(compCheck) {
		PensionCommon.comingSoonPopup(this);
	}
	else {
	
		var accList = theApp.accInfo.filterAccList(5)
	
		if(accList.length == 0){
			this.goOpenAccount()
			return;
		}
		
		if(compId == 'FD5005'){
			var result = 0;
			result = PensionCommon.sendSDPAQ070(this,null); //입금 - 납입 한도 계산 
			
		}else{
			theApp.goPageCheck(compId);
			this.doHide();
		}
	}*/
	
	
	var accList = theApp.accInfo.filterAccList(5)
	
	if(accList.length == 0){
		this.goOpenAccount()
		return;
	}
	
	if(compId == 'FD5005'){
		var result = 0;
		result = PensionCommon.sendSDPAQ070(this,null); //입금 - 납입 한도 계산 
		
	}else{
		theApp.goPageCheck(compId);
		this.doHide();
	}
};



//입금 - 납입 한도 계산 callback
FD5000_W01.prototype.callback070Data = function(money)
{
	
	if(money*1 <= 0){
		var contents = "고객님의 <span style='color :rgb(226, 26, 34)'>연간 납입한도</span>를<br>" + 
						'초과하였습니다.'
		var param = {
			"title" : "",
			"contents" : contents,
			"btnText" : "확인",
			"returnType" : "0",
			"returnData" : ""
		};
		PensionCommon.oneBtnPopup(this,param);	
		this.isSDPAQ070 = false;
	}else{
		this.isSDPAQ070 = true;
	}
	
	
	//입금하기 이동
	this.openFD5005();	
			
}

FD5000_W01.prototype.openFD5005 = function(){

	if(this.isSDPAQ070 == true){
		theApp.goPageCheck('FD5005');
		this.doHide();
	}
	this.isSDPAQ070 = false;
	
}

FD5000_W01.prototype.reCalcScrollArr = function()
{
	this.menuView.element.scrollTop = 0;
	this.scrollArr = [];
	
	for(var i = 0; i < this.scrollEleArr.length; i++)
	{
		this.scrollArr.push(this.scrollEleArr[i].position().top);
	}

	this.scrollArr.push(this.menuView.element.scrollHeight);
};

FD5000_W01.prototype.onLogoutBtnClick = function(comp, info)
{
	var thisObj = this;
	
	if(theApp.subNavi) {
		theApp.subNavi.clearHistory();
	}

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

FD5000_W01.prototype.onCloseBtnClick = function(comp, info)
{
	this.doHide();
};

FD5000_W01.prototype.onHomeBtnClick = function(comp, info)
{
	if(theApp.subNavi) theApp.subNavi.clearHistory();
	
	theApp.goPageCheck('FD0005');
	
	this.doHide();
};

FD5000_W01.prototype. showLastConnectTime = function()
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
FD5000_W01.prototype.onbtnFundClick = function(comp, info)
{
	//TODO:edit here
	var param = {
		"title" : "메리츠연금펀드",
		"contents" : "<span>[메리츠연금펀드]에서<br>나가시겠습니까?</span>",
		"btnArray" : ['예', '아니오'], // 순서에 주의...
		"returnType" : "1",
		"returnData" : "fundClick"
	};

	PensionCommon.twoBtnPopup(this, param);
};

// 연금펀드 진입 팝업 callback
FD5000_W01.prototype.callbackPensionPopup = function(returnData, resultData) {

	
	if(returnData == 'fundClick'){
		if(theApp.subNavi) {
			theApp.subNavi.clearHistory();
		}

		theApp.navigator.goPage('FrmPage');
		
	}else if(returnData == 'openAccount'){
		theApp.goPageCheck('FD5001', false, {tabId:'FD5001_T01'});
	}
	
	this.doHide();
}

// 연금저축 계좌개설 버튼 클릭...
FD5000_W01.prototype.onbtnAccOpenClick = function(comp, info)
{
	
	if(theApp.pensionAccLen == theApp.pensionTotalAccLen) {
		var contents = "이미 개설된 메리츠자산운용<br />" +
					   "연금저축계좌가 있습니다.<br /><br />" +
					   "추가 개설을 원하시는 경우<br />" +
					   "[메리츠자산운용 비대면계좌개설]<br />" +
					   "어플에서 종합계좌개설 후에<br />" +
					   "진행해주시기 바랍니다.";
		//TODO:edit here
		var param = {
			"title" : "연금저축계좌 개설",
			"contents" : contents,
			"btnText" : "확인",
			"returnType" : "0",
			"returnData" : ""
		};

		PensionCommon.oneBtnPopup(this, param);
	}
	else {
		theApp.goPageCheck('FD5001');
		this.doHide();
	}
};

// 계약이전(계좌이체) 버튼 클릭...
FD5000_W01.prototype.onbtnTransferClick = function(comp, info)
{
	var accList = theApp.accInfo.filterAccList(5)
	
	if(accList.length == 0){
		this.goOpenAccount()
		return;
	}
	theApp.goPageCheck('FD5002');
	this.doHide();
};


// 연금펀드 안내 버튼 클릭...
FD5000_W01.prototype.onbtnInfoClick = function(comp, info)
{
	
	theApp.goPageCheck('FD5000');
	this.doHide();
};


// 연금저축 계좌관리 버튼 클릭...
FD5000_W01.prototype.onbtnAccMngClick = function(comp, info)
{
	//PensionCommon.comingSoonPopup(this);
	var accList = theApp.accInfo.filterAccList(5)
	
	if(accList.length == 0){
		this.goOpenAccount()
		return;
	}
	theApp.goPageCheck('FD5007');
	this.doHide();
};


FD5000_W01.prototype.onButton1Click = function(comp, info)
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

FD5000_W01.prototype.goOpenAccount = function()
{
	var param = {
		"title" : "연금저축계좌 개설",
		"contents" : "연금펀드 가입을 위해서는<br />별도의 연금저축계좌를<br />개설하셔야 합니다.",
		"btnText" : "개설하기",
		"returnType" : "1",
		"returnData" : "openAccount"
	};

	PensionCommon.oneBtnPopup(this, param);
}



