
/**
Constructor
Do not call Function in Constructor.
*/
function FrmPage()
{
	BasePage.call(this);
	
	this.oriHeight 		= null;
	this.certTimer 		= null;
	this.qMenuView 		= null;	//퀵메뉴 버튼영역 뷰
	this.menuWin 		= null;	//전체메뉴 윈도우
	
	//스마트뷰
	this.dragData = 
	{
		'lastTransform': {'dx':0,'dy':0}
	};
	this.enableSmartViewDrag = false;
	this.smartViewHide = true;
	this.smartViewWindow = null;
	/*
	this.notUpdateMap = 
	{
		'MS0201': true
	};
	*/   
	
}
afc.extendsClass(FrmPage, BasePage);


FrmPage.prototype.onReady = function()
{
	BasePage.prototype.onReady.call(this);
	
};

FrmPage.prototype.onWillActive = function()
{
	BasePage.prototype.onWillActive.call(this);
		
	theApp.frmPage = this;
	
	this.capture = this.findCompById('Capture');
	this.testLine = this.findCompById('TestLine');
	
	$('body').append(this.capture.element);
	$('body').append(this.testLine.element);
	
	zTmp = theApp.systemInfo.isTest();
	if(zTmp == 'T') 
	{
		this.testLine.$ele.show();
	}
	else if(zTmp == 'RT') 
	{		
		this.testLine.setText('RT Check');
		this.testLine.$ele.show();
	}
	else this.testLine.$ele.hide();
	
	this.menuBtn = this.findCompById('MenuBtn');
	
	this.btmAreaView = this.findCompById('BtmAreaView');
	
	var thisObj = this;
	
	//퀵메뉴 버튼 영역
	this.qMenuView = this.findCompById('QMenuView');

	this.pageTabView = this.findCompById('PageTabView');
	
	theApp.subNavi = new ANavigator(this);
    theApp.subNavi.initWithTabview(this.pageTabView);
    this.pageTabView.setDelegator(theApp.subNavi);
    this.pageTabView.setNavigator(theApp.subNavi);
	theApp.menuInfo.registerSubPage(theApp.subNavi);

	//첫번째 화면 불러오기
	this.goFirstPageProcess();

	//asoocool
	//공인인증 타임아웃 체크...터치시 리셋
	$('body').bind('touchstart', function()
	{
		thisObj.checkCertLogoutTimer();
	});
	
};

FrmPage.prototype.goFirstPageProcess = function()
{
	var firstPageInfo = null;
	var thisObj = this;	

	/*
	//패스워드 저장이 안된경우 초기 사용자 로그인으로 설정
	if(!theApp.prefInfo.get('User')[2]) theApp.prefInfo.get('User')[1] = 0;
	
	theApp.goPageCheck('FD0001');
	*/
	
	if(theApp.userInfo.isLogin()) {
		theApp.goPageCheck('FD0002');
	}
	else {
		theApp.prefInfo.get('User')[1] = 0;
		theApp.goPageCheck('FD0001');
	}

	AppManager.hidePatchView();
	thisObj.checkExtraCallPage();
};

//외부에서 호출한 페이지가 있는지 체크
FrmPage.prototype.checkExtraCallPage = function()
{
	if(!afc.isSimulator)
	{
		var thisObj = this;
		AppManager.getPref('PREF_NAVERCODE', function(result)
		{
			if(result) theApp.menuInfo.goPageByItem([result, '', ''], 2);
			AppManager.setPref('PREF_NAVERCODE', '');
		});
	}
};

FrmPage.prototype.getFirstPage = function()
{
	var basicScr = theApp.configInfo.get('BASIC_SCR');
	var interSrc = theApp.configInfo.get('INTER_SCR');
	
	var firstPageId	= '';	// 로그인 화면
	var tabId		= '';	// 탭 화면 ex: FD0001_T00
	
	if(basicScr == 'TOT')
	{
		firstPageId = 'FD0001';
	}
	
	return [firstPageId, tabId];
};

FrmPage.prototype.checkCertLogoutTimer = function()
{
	var thisObj = this;

	theApp.certLogoutTime = (new Date()).getTime() + theApp.configInfo.get('CERT_TIMEOUT')*60000;
	
	if(this.certTimer) clearTimeout(this.certTimer);
	
	if(theApp.userInfo.getUserLoginState() > 1)
	{
		var thisObj = this;
		this.certTimer = setTimeout(function(){
		
			thisObj.certTimer = null;
			theApp.isCertTimeout = true;
			if(theApp.userInfo.getUserLoginState() > 1) theApp.certLogout();
			
		}, theApp.configInfo.get('CERT_TIMEOUT')*60000);
	}
};

FrmPage.prototype.checkPageTabViewHeight = function()
{
	this.pageTabView.setHeight(this.getHeight() -this.btmAreaView.getHeight());
	this.pageTabView.updatePosition();
};

//updateposition 적용하지 말아야할 페이지 체크
FrmPage.prototype.checkNotUpdatePage = function()
{
	if(theApp.subNavi && theApp.subNavi.getActivePage())
	{
		return this.notUpdateMap[theApp.subNavi.getActivePage().getId()];
	}
	else return false;
};

/*
FrmPage.prototype.onActionDown = function(comp, info)
{
	//asoocool ----
	//this.checkTimer();
};
*/

FrmPage.prototype.onMenuBtnClick = function(comp, info)
{
	if(this.menuWin)
	{
		if(!this.menuWin.isShow())
		{	
			if(this.menuWin.menuSupportWin)
			{
				this.menuWin.menuSupportWin.doHide();
			}
			
			this.menuWin.doShow();
		}
		else
		{
			this.menuWin.doHide();
		}
	}
	else
	{
		this.menuWin = AWindow.createWindow('FD/window/FD0000_W02.lay','FD000002');	
		this.menuWin.setWindowOption({
			isModal:false,
			isAutoCenter: false,		//자동 중앙정렬 할지
			isFocusLostClose: false,	//모달인 경우 포커스를 잃을 때 창을 닫을지
			isFocusLostHide: false,		//모달인 경우 포커스를 잃을 때 창을 숨길지
			modalBgOption: 'none',		//none, light, dark 모달인 경우 배경을 어둡기 정도
			overflow:'hidden',			//hidden, auto, visible, scroll
		});
		
		this.menuWin.open(this, 0, 0, this.getWidth(), this.getHeight() -this.btmAreaView.getHeight());
	}
};

FrmPage.prototype.settingBtmMenuByLoginState = function()
{
	if(theApp.userInfo.isLogin())
	{
		this.showBtmMenu();
	}
	else
	{
		this.hideBtmMenu();
	}
};

FrmPage.prototype.hideBtmMenu = function()
{
	this.qMenuView.$ele.hide();
	this.checkPageTabViewHeight();
};

FrmPage.prototype.showBtmMenu = function()
{
	this.qMenuView.$ele.show();
	this.checkPageTabViewHeight();
};

FrmPage.prototype.onWindowResult = function(result, awindow)
{
	/*
	var winId = awindow.getId();
	*/
};

FrmPage.prototype.onCaptureClick = function(comp, info)
{
	this.capture.show(AComponent.GONE);
	
	var thisObj = this;
	var win = AWindow.getTopWindow();
	if(win && win.isShow()) fileName = win.getId();
	else fileName = theApp.subNavi.getActivePage().getId();
	
	setTimeout(function(){
		AppManager.screenShoot(function(imgUrl)
		{
			AToast.show('메뉴 ID : ' + fileName +'저장');
			thisObj.capture.show(AComponent.VISIBLE);
		}, fileName);
	}, 200);
};


FrmPage.prototype.onSimpleChoiceBtnClick = function(comp, info)
{
	theApp.goPageCheck('FD3202');
	
	if (this.menuWin){
		if(this.menuWin.isShow()) this.menuWin.doHide();
		if(this.menuWin.menuSupportWin) this.menuWin.menuSupportWin.doHide();
	}
};

FrmPage.prototype.onSearchAccBtnClick = function(comp, info)
{
	theApp.goPageCheck('FD2201');
	
	if (this.menuWin){
		if(this.menuWin.isShow()) this.menuWin.doHide();
		if(this.menuWin.menuSupportWin) this.menuWin.menuSupportWin.doHide();
	}
};

FrmPage.prototype.onMyAssetBtnClick = function(comp, info)
{
	theApp.goPageCheck('FD4102');
	
	if (this.menuWin){
		if(this.menuWin.isShow()) this.menuWin.doHide();
		if(this.menuWin.menuSupportWin) this.menuWin.menuSupportWin.doHide();
	}
};

FrmPage.prototype.onButton12Click = function(comp, info)
{
	SNSManager.kakaoChannelChat();
	//AppManager.goUrl("https://pf.kakao.com/_epRUj/chat");
};
