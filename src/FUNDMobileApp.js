
/**
Constructor
Do not call Function in Constructor.
*/
function FUNDMobileApp()
{
	Application.call(this);
	
	this.appFullHeight = null;	//앱 화면 Height 크기

	this.loginManager = null;
	this.connectManager = null;	
	this.accNetManager = null;
	this.smsCertManager = null;

	this.userInfo = null;
	this.prefInfo = null;
	this.menuInfo = null;
	this.configInfo = null;
	
	this.uId = '';
		
	this.screenMode = AppManager.SCREEN_ORIENTATION_PORTRAIT;
	
	this.timeInfo = null;
	
	//jQuery 화면 refresh용 함수
	jQuery.fn.forceRedraw = function() {
        return this.hide( 0, function() {
                $( this ).show();
            	});
    };
	
	//2018.01.22 HCY 1차 오픈에서는 수익증권만 제공
	this.tempProductId = {'수익증권' : true};
	
	//펀드 계좌개설
	this.ifContinued = false;		//이어하기 여부
	this.isNFTFProgress = false;
	this.encryptType = null;		//AQuery.OCR  or   AQuery.RSA
}
afc.extendsClass(FUNDMobileApp, Application);


FUNDMobileApp.prototype.onReady = function()
{
	Application.prototype.onReady.call(this);
	
	var thisObj = this;
	
	if(!Define.LOG) afc.disableLog();
	
	AQueryData.enableFidValueMap(true);

	document.addEventListener("deviceready", function()
	{
		thisObj.onDeviceReady();
		
        document.addEventListener("backbutton", function() { thisObj.onBackKeyManage();	}, false);
		document.addEventListener("pause",      function() { thisObj.onAppPause();      }, false);
    	document.addEventListener("resume",     function() { thisObj.onAppResume(1);    }, false);
		
	}, false);
};

FUNDMobileApp.prototype.onBackKeyManage = function()
{
	//백키 이벤트를 DISABLE_TIME안에 재요청 하거나 프로그레스바가 떠있을시 리턴
	if(((new Date().getTime() - AEvent.TOUCHTIME) < afc.DISABLE_TIME) || AppManager.isShowProgress) return;
	
	//가로모드일때 백키 리턴
	/*
	if(theApp.screenMode == AppManager.SCREEN_ORIENTATION_LANDSCAPE) return;
	*/
	var thisObj = this;
	var curWin = AWindow.getTopWindow();
	if(curWin)
	{
		// 환경설정은 Hide
		if(curWin.getId() == 'FD010003')
		{
			curWin.doHide();
		}
		else
		{
			// 인증서 발급/재발급, 타기관인증서 등록
			/*
			if(curWin.url=='MS/window/MS0720.html' || curWin.url=='MS/window/MS0722.html')
			{
				thisObj.logoutProcess(true);
			}
			*/
			curWin.close();
		}
	}
	else
	{
		if(!theApp.subNavi) return;
		if(theApp.subNavi.canGoPrev())
		{
			theApp.goPrevPageCheck();
		}
		else
		{
			theApp.confirm('<span>종료 하시겠습니까?</span>', function(result){
				if(result)
				{
					thisObj.exitApp();
				}
			}, '종료', ['예', '아니오']);
		}
	}
	
	AEvent.TOUCHTIME = new Date().getTime();
};

FUNDMobileApp.prototype.onAppResume = function(isWebEvent)
{
	this.isPause = false;
	
	if(this.offLifeCycle)
	{
		this.offLifeCycle = false;
		return;
	}
	
	//패치화면일 경우 리턴
	if(!AppManager.isHidePatchView) return;
	
	//강제 종료하는 팝업이 떠있을 경우 리턴
	if(this.isOpenExitAlert()) return;
	
	if(!isWebEvent) return;
	
	this.requestVersionInfo();
	
	//버전체크 시간이 지났으면 앱 실행시 체크
	if(this.isVersionCheck)
	{
		//this.requestVersionInfo();
		this.checkVersion();
	}
	
	if(theApp.certLogoutTime < (new Date()).getTime()) {
		theApp.certLogout();
	}
	else{		//로그아웃 시간 지나기 전에 background에서 올라올 시 certLogout time 리셋 필요.
		theApp.frmPage.checkCertLogoutTimer();
	}
	
	if(theApp.userInfo.isLogin())
	{
		if( !theApp.accNetManager ||  !theApp.accNetManager.isStart())
		{
			this.autoLoginProcess('재접속중입니다...');
		}
		/*
		else
		{
			this.currentRefresh();
		}
		*/
	}
};

FUNDMobileApp.prototype.onAppPause = function()
{
	this.isPause = true;
	
	if(!AppManager.isHidePatchView) return;
	
	if(this.offLifeCycle) return;
	
	AppManager.endOltp();
	
	this.saveAllInfo();
	
	//현재 액티브된 윈도우 리얼해제
	var tmpWnd = null;
	for(var i=AWindow.wndList.length-1; i>-1; i--)
	{
		tmpWnd = AWindow.wndList[i];
		if(tmpWnd.unregisterRealAll) tmpWnd.unregisterRealAll();
	}
	/*
	//현재 액티브된 페이지 리얼해제
	if(!theApp.subNavi) return;
	var activePage = theApp.subNavi.getActivePage();
	if(activePage && activePage.unregisterRealAll) activePage.unregisterRealAll();
	*/
};

//디바이스가 준비되면 버전 및 공지 로직 실행
FUNDMobileApp.prototype.onDeviceReady = function() 
{
	$.ajaxSetup(
	{
		cache:false
	});
	
	this.initMemberClass();
};

FUNDMobileApp.prototype.initMemberClass = function()
{

	this.accInfo = new AccInfo();
/*
	this.certInfo = new CertInfo();
	this.masterInfo = new MasterInfo();
	this.valid = new Valid();
	this.interestInfo = new InterestInfo();
	
	this.stockMemoInfo = new StockMemoInfo();
	this.memoInfo = new MemoInfo();
	this.historyInfo = new HistoryInfo();
	this.smartViewInfo = new SmartViewInfo();
	this.pushApi = new PushApi();
*/	
	this.systemInfo = new SystemInfo();
	this.connectManager = new ConnectManager();
	this.loginManager = new LoginManager();
	this.smsCertManager = new SmsCertManager();
	
	this.userInfo = new UserInfo();
	this.prefInfo = new PrefInfo();
	this.menuInfo = new MenuInfo();
	this.configInfo = new ConfigInfo();
	
	var thisObj = this;
	
	//
	//	load done 
	//	로드를 시작하기 전에 CallbackDone.waitAll 을 먼저 호출해 줘야 함.
	//
	CallbackDone.waitAll(function()
	{
		if(afc.isSimulator)
		{
			DeviceManager.getDeviceUniqueId(function(uid)
			{
				thisObj.prvtIP = uid.replace(/-/g, '').substring(0,12);

				thisObj.initApp();
				/*
				theApp.masterInfo.initMaster(function()
				{
					thisObj.initApp();
					thisObj.interestInfo.makeCheckMap();
				});
				*/
			});
		}
		else 
		{
			DeviceManager.getDeviceUniqueId(function(uid)
			{
				if(!uid) uid = '000000000000';
				//thisObj.pushApi.uid = uid;

				//deviceUniqueId 의 12 자리를 사설아이피로 사용한다.
				thisObj.prvtIP = uid.substring(0,12);

				thisObj.initApp();
				/*
				theApp.masterInfo.initMaster(function()
				{
					thisObj.initApp();
				});
				*/
			});
		}
	
	});
	
	//
	//load start	
	//
	if(!afc.isSimulator)
	{
		this.systemInfo.loadInfo();
	}
	else
	{
		theApp.menuInfo.setFNOList();
	}

	this.menuInfo.loadInfo();
	this.prefInfo.loadInfo();
	this.configInfo.loadInfo();
	
	this.accInfo.loadInfo();
	/*
	this.interestInfo.loadInfo();
	
	this.stockMemoInfo.loadInfo();
	this.memoInfo.loadInfo();
	this.historyInfo.loadInfo();
	this.smartViewInfo.loadInfo();
	*/
};

FUNDMobileApp.prototype.initApp = function() 
{
	var thisObj = this;

	thisObj.checkFontFace();
	thisObj.checkFontBold();
	thisObj.checkTheme();
	thisObj.checkVersion();

	thisObj.menuInfo.registerCommonPage(thisObj.navigator);
	thisObj.navigator.registerPage('FD/FrmPage.lay', 'FrmPage');
	thisObj.navigator.registerPage('FD/FrmPage2.lay', 'FrmPage2');
	thisObj.navigator.goPage('FrmPage');
	thisObj.initNotice();

	thisObj.appFullHeight = window.innerHeight;
	
	DeviceManager.getDeviceUniqueId(function(ret)
	{
		theApp.uId = ret; 		
	}, true);
	
	
	/*
	var now = new Date();			
	var now2 = null;			
	now2 = now.format('yyyyMMdd');

	var popupEvtDate = theApp.prefInfo.get('EventDate3');

	if(popupEvtDate < now2){
		var win = AWindow.createWindow('FD/window/FD0000_W14.lay', 'FD000W14');
		win.open(thisObj, 0, 0, '100%', '100%');
	}		
	*/
	
	// kakaoPop
	var now = new Date();			
	var now2 = null;			
	now2 = now.format('yyyyMMdd');

	var popupEvtDate = theApp.prefInfo.get('KakaoPopDate');

	if(popupEvtDate < now2){
		var win = AWindow.createWindow('FD/window/FD0000_W16.lay', 'FD000W16');
		win.open(thisObj, 0, 0, '100%', '100%');
	}	
	
	
};

FUNDMobileApp.prototype.checkFontFace = function()
{	
	/*
	afc.beginTimeCheck('TEST');
	$('#_font').remove();
	$('<link rel="stylesheet" id="_font" type="text/css" href="./Assets/'+this.configInfo.get('FONT_STYLE')+'.css">').appendTo('head');	
	*/
};

FUNDMobileApp.prototype.checkFontBold = function()
{
	var fontWeight = this.configInfo.get('FONT_WEIGHT');
	$('body, input, textarea, button').css('font-family', fontWeight=='BOL' ? 'KoPub_B' : 'KoPub_M');
};

FUNDMobileApp.prototype.checkTheme = function()
{
	this.themeMode = this.configInfo.get('THEME_MODE');
	
	var themeList = [
		'BG',
		'BT',
		'COMMON',
		'CR',
		'DR',
		'GR',
		'LB',
		'TF'
	];
	
	for(var i = 0; i<themeList.length; i++)
	{
		$('<link rel="stylesheet" id="_FD_'+this.themeMode+'_'+themeList[i]+'" type="text/css" href="./Assets/Style/'+themeList[i]+'.css">').appendTo('head');
	}
};

FUNDMobileApp.prototype.checkVersion = function()
{
	if(this.versionTimer) clearInterval(this.versionTimer);
	
	var thisObj = this;
	this.versionTimer = setInterval(function(){
		thisObj.requestVersionInfo();
	}, Define.VERCHECKTIME);
};

FUNDMobileApp.prototype.requestVersionInfo = function()
{
	if(this.isPause)
	{
		this.isVersionCheck = true;
		return;
	}
	else this.isVersionCheck = false;
	
	var thisObj = this;
	
	$.ajax({
		url:Define.VERSION_SERVER+"/VersionControl.do?AppNo="+theApp.systemInfo.appVer+"&OSgubun="+theApp.systemInfo.osGubun+"&secuno="+theApp.systemInfo.fno+"&verNo="+theApp.systemInfo.verNo,
		type:"POST",
		dataType:"text",
		async: true,
		beforeSend: function(xhr)
		{
			xhr.setRequestHeader("Accept", "application/json");
			xhr.setRequestHeader("Content-Type", "application/json");
		}
	})
	.done(function(versionList)
	{
		if(versionList)
		{
			versionList = versionList.trim();

			versionList = versionList.replace(/\\r/g, "");
			versionList = versionList.replace(/\\n/g, "");

			//1.0.0|1|2|3|4/201606280722
			var versInfo = versionList.split("/");

			var vers = versInfo[0].split("|");
			var newVerStr = vers[0];

			var curVer = theApp.systemInfo.appVer.split(".");
			var newVer = vers[0].split(".");
/*

			if(vers.length-1 > 0 && versInfo.length > 1 && isMasterCheck && theApp.systemInfo.masterNo != versInfo[1])
			{
				if(thisObj.versionTimer) clearInterval(thisObj.versionTimer);
				theApp.exitAppAlert('종목 마스터 및 화면 업데이트가 있습니다.</br>앱을 재실행해 주세요.');
				return;
			}

			if(vers.length-1 > 0)
			{
				if(thisObj.versionTimer) clearInterval(thisObj.versionTimer);
				theApp.exitAppAlert('화면 업데이트된 내역이 존재합니다.</br>앱을 재실행해 주세요.');
				return;
			}
*/
			/*
			if(versInfo.length > 1)
			{
				if(isMasterCheck)
				{
					if(theApp.systemInfo.masterNo != versInfo[1])
					{
						if(thisObj.versionTimer) clearInterval(thisObj.versionTimer);
						theApp.confirm('종목 마스터가 변경되었습니다.</br>앱을 재실행해 주세요.', function(result) {
							if(result == 0) {
								thisObj.exitApp();
							}
						}, '종료', ['취소', '종료']);
						return;
					}
				}
			}
			*/
			if(parseInt(curVer[0]) < parseInt(newVer[0]))
			{
				if(thisObj.versionTimer) clearInterval(thisObj.versionTimer);
				theApp.exitAppAlert('앱(플렛폼) 업데이트가 있습니다.</br>앱을 재실행해 주세요.');
				return;
			}
			else if((parseInt(curVer[0]) == parseInt(newVer[0])) && (parseInt(curVer[1]) < parseInt(newVer[1])))
			{
				if(thisObj.versionTimer) clearInterval(thisObj.versionTimer);
				theApp.exitAppAlert('앱(플렛폼) 업데이트가 있습니다..</br>앱을 재실행해 주세요.');
				return;
			}
		}
	})
	.fail(function(data){

	});
};

FUNDMobileApp.prototype.initNotice = function()
{
	var thisObj = this;
	var noticeArr = theApp.prefInfo.get('NoticeNumber');
	var weburl = '';

	if (!Define.NOTICE_URL )
	{
		// Fund용 url 필요 2017.12.26
		weburl = 'http://testwebmts.koscom.co.kr';
	} else {
		weburl = Define.NOTICE_URL;
	}
	
	
	$.ajax({
		url : weburl + '/notice/mts/' + theApp.systemInfo.fno + '.html',
		success : function(result){
		
			var win = AWindow.createWindow('FD/window/FD0000_W05.lay', 'FD0000W5');
			
			win.setWindowOption({
				isAutoCenter: true,
				isFocusLostClose: false, 
				modalBgOption:'dark'
			});	
			win.dataList = [];
			
			var results = result.trim().split(';');
			if(results.length < 2) {
				return;
			}
			for(var i = 1; i<results.length-1; i++) {
				
				win.dataList.push(results[i].trim());
			}
			
			win.noticeNumber = Number(results[0]);
			
			if(!noticeArr || win.noticeNumber > Number(noticeArr[0])) {
				win.results = results;
				win.open(thisObj, 0, 0, '100%', '100%');
			} else {
				if(noticeArr.length < 2 || !noticeArr[1]) {
					win.results = results;
					win.open(thisObj, 0, 0, '100%', '100%');
				} else {
					var now = new Date();
					var until = new Date(noticeArr[1]);
					
					if(now >= until) {
						win.results = results;
						win.open(thisObj, 0, 0, '100%', '100%');
					}
				}
			}
		},
		error : function(error) {
		}
	});
	
};

FUNDMobileApp.prototype.exitAppAlert = function(text, isPauseOpen)
{
	if(!isPauseOpen && this.isPause) return;
	
	var thisObj = this;
	
	if(AppManager.isHidePatchView)
	{
		var win = theApp.alert(text, null, '종료');
		if(win)
		{
			win.isExitAlert = true;
			win.close = function(result)
			{
				thisObj.exitApp();
			};
		}
	}
	else
	{
		theApp.alert(text, function(result){
			thisObj.exitApp();
		}, '종료');
	}
	
};

FUNDMobileApp.prototype.exitApp = function()
{
	this.saveAllInfo();
	
	theApp.loginManager.requestLogout(function()
	{
		/*
		if(theApp.infoNetManager) theApp.infoNetManager.stopManager();
		*/
		if(theApp.accNetManager) theApp.accNetManager.stopManager();
	
		if (afc.isAndroid)
			navigator.app.exitApp();
		else if (afc.isIos)
			AppManager.exitApp();	
	});
};

FUNDMobileApp.prototype.goPageCheck = function(page, isAni, pageData)
{
	
	if(!theApp.menuInfo.isRegPage(page))
	{
		AToast.show('등록되지 않은 페이지입니다.');
		return;
	}
	
	if(theApp.checkPassPage(page))
	{
		/*
		if(theApp.userInfo.isLogin()) {
			theApp.prefInfo.set('LastPage', page);
		};
		*/
		
		var tabId;
		
		// 나의 자산현황 - 탭별로 전체메뉴에 존재
		if (page == 'FD4102')
		{
			tabId = 'FD4102_T01';
			
			if (!pageData){
				pageData = {tabId: tabId};
			}
		}
		else if (page == 'FD4102_T02')
		{
			if (!pageData){
				pageData = {tabId: page};
			}

			tabId = page;
			page = 'FD4102';
		}
		else if (page == 'FD4102_T03')
		{
			if (!pageData){
				pageData = {tabId: page};
			}

			tabId = page;
			page = 'FD4102';
		}
		
		// 조회 - 탭별로 전체메뉴에 존재
		if (page == 'FD1201')
		{
			tabId = 'FD1201_T01';
			
			if (!pageData){
				pageData = {tabId: tabId};
			}
		}
		else if (page == 'FD1201_T02')
		{
			if (!pageData){
				pageData = {tabId: page};
			}

			tabId = page;
			page = 'FD1201';
		}
		
		
		// [연금펀드] 입출금 - 탭별로 전체메뉴에 존재
		if (page == 'FD5005')
		{
			tabId = 'FD5005_T01';
			
			if (!pageData){
				pageData = {tabId: tabId};
			}
		}
		else if (page == 'FD5005_T02')
		{
			if (!pageData){
				pageData = {tabId: page};
			}

			tabId = page;
			page = 'FD5005';
		}
		
		// [연금펀드] 나의 연금 자산현황 - 탭별로 전체메뉴에 존재
		if (page == 'FD5006')
		{
			tabId = 'FD5006_T01';
			
			if (!pageData){
				pageData = {tabId: tabId};
			}
		}
		else if (page == 'FD5006_T02')
		{
			if (!pageData){
				pageData = {tabId: page};
			}

			tabId = page;
			page = 'FD5006';
		}
		else if (page == 'FD5006_T03')
		{
			if (!pageData){
				pageData = {tabId: page};
			}

			tabId = page;
			page = 'FD5006';
		}
		
		// [연금펀드] 조회 - 탭별로 전체메뉴에 존재
		if (page == 'FD5008')
		{
			tabId = 'FD5008_T01';
			
			if (!pageData){
				pageData = {tabId: tabId};
			}
		}
		else if (page == 'FD5008_T02')
		{
			if (!pageData){
				pageData = {tabId: page};
			}

			tabId = page;
			page = 'FD5008';
		}
		
		// [연금펀드] 계약이전(계좌이체)  
		if(page == 'FD5002')
		{
			tabId = 'FD5002_T01';
			
			if (!pageData){
				pageData = {tabId: tabId};
			}
		}
		
		// [연금펀드] 연금저축 계좌관리
		if(page == 'FD5007')
		{
			tabId = 'FD5007_T01';
			
			if (!pageData){
				pageData = {tabId: tabId};
			}
		}
		
		// [연금펀드] 연금저축(신규가입)
		if(page == 'FD5001')
		{
			tabId = 'FD5001_T01';
			
			if (!pageData){
				pageData = {tabId: tabId};
			}
		}
		
		// 화면으로 이동할 페이지
		var activePage = this.subNavi.getActivePage();

		if (activePage && activePage.containerId == page)
		{
			if (page == 'FD4102' || page == 'FD1201' || page == 'FD5006' 
				|| page == 'FD5008' || page == 'FD5005' || page == 'FD5002' || page == 'FD5007' || page =='FD5001') 
			{
				activePage.pageData.tabId = tabId;
				activePage.initByPageData();
			}
			else if (page == 'FD3202')
			{
				activePage.pageData = {tabId: 'FD3202_T01'};
				activePage.initByPageData();
			}
			else if (page == 'FD5003')
			{
				activePage.pageData = {tabId: 'FD5003_T01'}; // 연금펀드 - 펀드목록
				activePage.initByPageData();
			}
		}
		else
		{
			this.subNavi.goPage(page, isAni, pageData);
		}
	}
};

FUNDMobileApp.prototype.checkPassPage = function(pageId)
{
	return (theApp.userInfo.getUserLoginState() >= theApp.menuInfo.getPageState(pageId));
};

//지원 사양 이하의 OS 사용시 alert 표시 창
FUNDMobileApp.prototype.versionAlert = function(callback, title)
{
	var strDate = afc.dateToString(new Date());

	//1차 > 회원사 LIG만 작동
	/*
	if (theApp.systemInfo.fno == '086' || theApp.systemInfo.fno == '072') 
	{
		var res = theApp.systemInfo.osVer.split(".");
		var versionCheck = null;
		for(var key in res) versionCheck += res[key]*Math.pow(10, 4-key*2);

		//저사양 폰인지 체크
		if(theApp.systemInfo.osType	!= 'Android' || versionCheck >= 40400) return;

		//오늘 하루 더 보지 않기 체크 확인
		if(theApp.prefInfo.get('LowVersionDate') == strDate) return;

		var win = AWindow.createWindow('MS/window/MS0000_W13.lay', 'MS000000');	//공통모달

		win.setWindowOption(
		{
			isFocusLostClose:true,
			modalBgOption:'dark'
		});
		if(title) win.title = title;
		if(callback) win.callback = callback;
		win.open(this, 0, 0, 500, 0);
	}
	*/
};

FUNDMobileApp.prototype.goPrevPageCheck = function(data)
{
	// iOS에서 Back버튼이 실행되지 않는 현상 발생 (curHisIndex 가 0으로 됨)
	if (theApp.userInfo.getUserLoginState() > 0 && theApp.subNavi.curHisIndex == 0)
	{
		theApp.subNavi.clearHistory();
		theApp.goPageCheck('FD0002');
	}
	else
	{
		this.subNavi.goPrevPage(false, data);
	};
};

FUNDMobileApp.prototype.isOpenExitAlert = function()
{
	
	var tmpWnd = null, isOpenExit = false;
	for(var i=AWindow.wndList.length-1; i>-1; i--)
	{
		tmpWnd = AWindow.wndList[i];
		//리얼이 달린 윈도우가 떠 있을경우 재조회
		if(tmpWnd.isExitAlert) return true;
	}
	return false;
};

FUNDMobileApp.prototype.saveAllInfo = function()
{
	this.configInfo.saveInfo();
	this.prefInfo.saveInfo();
	this.menuInfo.saveInfo();
	
	this.accInfo.saveInfo();
	/*
	this.historyInfo.saveInfo();
	this.stockMemoInfo.saveInfo();
	this.interestInfo.saveInfo();
	this.smartViewInfo.saveHistoryInfo();
	*/
};

FUNDMobileApp.prototype.confirm = function(text, callback, title, btnTextArr)
{
	
	//패치뷰가 떠있으면
	if(!AppManager.isHidePatchView)
	{
		if(!title) title = '안내';
        if(!btnTextArr) btnTextArr = ['확인', '취소'];
		AppManager.appAlert([title, text.replace(/\<br\/\>/g, '\n').replace(/(<([^>]+)>)/gi, ""), btnTextArr], function(result){
			callback(result);
		});
	}
	//패치뷰가 사라졌으면
	else
	{
		var win = AWindow.createWindow('FD/window/FD0000_W00.lay', 'FD000000');	//공통모달

		win.setWindowOption({
			isAutoCenter: true,
			isFocusLostClose: false, 
			modalBgOption:'dark'
		});	
		win.isConfirm = true;
		win.title = title;
		win.text = text;
		win.callback = callback;
		win.btnTextArr = btnTextArr;
		win.open(this, 0, 0, 430, 0);
	}
};

FUNDMobileApp.prototype.autoLogout = function(notNoti)
{
	var thisObj = this;
	if(theApp.userInfo.getUserLoginState() > 0)
	{
		theApp.loginManager.requestLogout(function(){
			theApp.logoutProcess(notNoti);
		});
	}
	else theApp.logoutProcess(notNoti);
	
};

FUNDMobileApp.prototype.logoutProcess = function(notNoti)
{
	//유저 권한등급을 최하(-1)로 낮춤
	theApp.userInfo.setUserLoginState(-1);
	
	//임시저장공간의 값들을 초기화
	theApp.prefInfo.get('User')[1] = 0;
	theApp.prefInfo.get('User')[2] = '';
	theApp.prefInfo.get('User')[3] = 0;
	theApp.prefInfo.saveInfo();
	
	//계정계-정보계 해더에 임시 아이디로 셋팅
	/*
	if(theApp.infoNetManager) theApp.infoNetManager.setHeaderInfo({USER_ID: Define.TEMP_ID });
	*/
	if(theApp.accNetManager) theApp.accNetManager.setHeaderInfo({USER_ID: Define.TEMP_ID });
	
	//푸시 로그아웃
	/*
	PushManager.pushLogout();
	*/
	//화면 히스토리 클리어
	if(theApp.subNavi) theApp.subNavi.clearHistory();
	
	// 접속 해제
	if(theApp.accNetManager) theApp.accNetManager.stopManager();
	
	// 로그인 화면으로 이동
	//theApp.goPageCheck('FD0001');
// 	theApp.subNavi.goPage('FD0001');
	
 	theApp.navigator.goPage('FrmPage');
	theApp.frmPage.goFirstPageProcess();
	/*
	if(theApp.frmPage && theApp.subNavi)
	{
		var actPage = theApp.subNavi.getActivePage();
		if(actPage && actPage.getId() == 'MS0416')
		{
			if(actPage.onChangeLoginState) actPage.onChangeLoginState();
		}
		else theApp.goPageCheck('MS0416');
		
		
		theApp.frmPage.settingBtmMenuByLoginState();
		
		theApp.frmPage.checkPageTabViewHeight();
	}
	*/
	if(!notNoti) AToast.show('로그아웃 되었습니다.');
};

FUNDMobileApp.prototype.onWindowResult = function(result, awindow)
{
	var thisObj = this;
	var winId = awindow.getId();
	/*
	if(winId == 'MS0101' || winId == 'MS010101')
	{
		if(awindow.onlyCheck)
		{
			if(result == 1) this.currentRefresh();
			else theApp.goPageCheck(theApp.frmPage.getFirstPage()[0]);
		}
	}
	*/
	if(winId == 'FD000000')
	{
		if(awindow.callback) awindow.callback(result);
	}
};

//재접속 프로세스
FUNDMobileApp.prototype.reconnectionProcess = function(isTimeout)
{
	var thisObj = this;
	
	// user id 전달  
	this.connectManager.initConnection(theApp.prefInfo.get('User')[0], null, function(result, text)
	{
		if(result == Define.SUCCESS)
		{
			//SNS로그인이 아닐경우
			if(this.orgCode == 'MT')
			{
				var curLoginState = theApp.userInfo.getUserLoginState();
				/*
				var win = AWindow.findWindow('FD010105');
				var curLoginState = theApp.userInfo.getUserLoginState();
				
				if(theApp.isCertTimeout)
				{
					if(win) win.changeCertLogoutAlert();
					else
					{
						win = AWindow.createWindow('FD/window/FD0101_W05.lay', 'FD010105');
						win.text = '<span>공인인증서 로그인 상태에서 일정 시간이<br/>경과되어 자동 로그아웃 합니다.</span>';
						win.setWindowOption({
							isAutoCenter: true,
							isFocusLostClose: false, 
							modalBgOption:'dark'
						});	
						win.open(thisObj, 0, 0, 500, 0);
					}
				}

				//현재 상태로 자동 로그인을 진행한다.
				else
				{
					if(!win)
					{
					*/
						thisObj.loginManager.autoLogin(curLoginState, function(code, text)
						{
							thisObj.callbackLogin(curLoginState, code, text, isTimeout);
						});
					/*
					}
				}
				*/
			}
			
		}
		else
		{
			// Connection 실패인 경우 실행 (앱 종료)
			thisObj.exitAppAlert(text);
		}
		
	});
};

FUNDMobileApp.prototype.callbackLogin = function(curLoginState, code, text, isTimeout)
{
	var thisObj = this;
	theApp.isCertTimeout = false;
	
	var isCertPage = false;
	if(theApp.subNavi && theApp.subNavi.getActivePage())
	{
		if(theApp.menuInfo.getPageState(theApp.subNavi.getActivePage().getId()) > 1) isCertPage = true;
	}

	if(code == Define.SUCCESS)
	{
		theApp.userInfo.setUserLoginState(curLoginState, true);

		/*
		if(!afc.isSimulator)
		{
			PushManager.pushLogin(theApp.prefInfo.get('User')[0]);
		}
		*/

		if((curLoginState == Define.LOGIN_ID) && isCertPage)
		{
			theApp.goPageCheck(theApp.frmPage.getFirstPage()[0]);
		}
		else
		{
			if(!isTimeout)
			{
				theApp.queryFail = 0;
			}
			else 
			{
				theApp.queryFail++;
				if(theApp.queryFail>=Define.QUERY_FAIL_CNT)
				{
					thisObj.exitAppAlert('서버에 접속할 수 없습니다.<br/>고객지원센터로 문의하여 주십시오.<br/><br/>고객지원센터 : '+theApp.systemInfo.get('FirmCall')+'</span>');
					return;
				}
			}
			/*
			thisObj.currentRefresh();
			*/
		}
	}
	else
	{
		theApp.logoutProcess(true);
	}
};

FUNDMobileApp.prototype.certLogout = function()
{
	//공인인증서 정보 클리어
	this.certInfo.certObj = new Object();
	if(theApp.userInfo.getUserLoginState() > 1)
	{
		theApp.subNavi.clearHistory();
		theApp.isCertTimeout = true;
	}
	/*
	if(!afc.isSimulator) PushManager.pushLogout();
	if(theApp.infoNetManager) theApp.infoNetManager.stopManager();
	*/
	if(theApp.accNetManager) theApp.accNetManager.stopManager();
	
	if(!this.isPause) this.autoLoginProcess('공인인증 로그아웃');
};

FUNDMobileApp.prototype.alert = function(text, callback, title, btnTextArr)
{
	//패치뷰가 떠있으면
	if(!AppManager.isHidePatchView)
	{
		if(!title) title = '안내';
		if(!btnTextArr) btnTextArr = '';
		AppManager.appAlert([title, text.replace(/\<br\/\>/g, '\n').replace(/(<([^>]+)>)/gi, ""), btnTextArr], function(result){
			if(callback) callback(0);
		});
		return null;
	}
	//패치뷰가 사라졌으면
	else
	{
		
		var win = AWindow.createWindow('FD/window/FD0000_W00.lay', 'FD000000');	//공통모달
	
		win.setWindowOption({
			isAutoCenter: true,
			isFocusLostClose: false, 
			modalBgOption:'dark'
		});	

		win.title = title;
		win.text = text;
		win.callback = callback;
		win.btnTextArr = btnTextArr;
		win.open(this, 0, 0, 430, 0);
		
		return win;
	}
};

/*
// 리얼이 없기 때문에 재조회 하지 않음.
FUNDMobileApp.prototype.currentRefresh = function()
{
	if(this.isPause) return;
	
	var curWin = AWindow.getTopWindow();
	if(curWin && curWin.isShow())
	{
		//리얼이 달린 윈도우가 최상단에 있을경우 재조회
		if(curWin.winType == 'real')
		{
			if(curWin.refreshData) curWin.refreshData();
		}
		else
		{
			var tmpWnd = null, isExistRealWin = false;
			for(var i=AWindow.wndList.length-1; i>-1; i--)
			{
				tmpWnd = AWindow.wndList[i];
				//리얼이 달린 윈도우가 떠 있을경우 재조회
				if(tmpWnd.winType == 'real')
				{
					isExistRealWin = true;
					if(tmpWnd.refreshData) tmpWnd.refreshData();
					break;
				}
			}
			
			//리얼이 달린 윈도우가 하나도 존재하지 않을경우 해당페이지 재조회
			if(!isExistRealWin)
			{
				if(!theApp.subNavi) return;
				
				var activePage = theApp.subNavi.getActivePage();
				if(activePage && activePage.refreshData) activePage.refreshData();
			}
		}
	}
	else
	{
		//티커 ON 일떄 재조회
		if(theApp.frmPage)
		{
			if(theApp.configInfo.get('TIKER_ONOFF') == 'ON')
			{
				theApp.frmPage.refreshTickerView();
			}
		}
		
		if(!theApp.subNavi) return;
		var activePage = theApp.subNavi.getActivePage();
		if(activePage && activePage.refreshData) activePage.refreshData();
	}
};
*/

FUNDMobileApp.prototype.autoLoginProcess = function(msg, isTimeout)
{    
	var thisObj = this;
	
	// 강제 종료하는 팝업이 떠있을 경우 리턴
	if(this.isOpenExitAlert()) return;
    
    AToast.show(msg);
    thisObj.reconnectionProcess(isTimeout); 
}

FUNDMobileApp.prototype.setTimeInfo = function(time){this.timeInfo = time;}
FUNDMobileApp.prototype.getTimeInfo = function(){return this.timeInfo;}



//------------------- NFTF 단독 함수(하단부터) ------------------//



//비대면 계좌개설 진행단계 저장 SACMT635 > 각 화면에서 호출
FUNDMobileApp.prototype.saveStep = function(nStep, callback)
{
	if( nStep <= theApp.userInfo.getUserData('D1처리상태코드'))
	{
		if(callback) callback();
		return;
	}
	
	var thisObj = this;
	if(theApp.userInfo.getUserData('D1실명확인번호암호화') == '' || theApp.userInfo.getUserData('D1실명확인번호암호화') == 'undefined' )
	{
		if(callback) callback();
	} else {
		QryRequest.request('SACMT635',
		function(queryData)
		{
			var inBlock1 = queryData.getBlockData('InBlock1')[0];

			inBlock1["D1처리구분"] = '1';
			inBlock1["D1실명확인번호"] = theApp.userInfo.getUserData('D1실명확인번호암호화');
			inBlock1["D1디바이스고유번호"] = theApp.uId;
			inBlock1["D1처리상태코드"] = nStep;//+'';
			queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
		},

		function(queryData)
		{
			var errCode = this.getLastError('errCode');
			if( errCode >= 1000)
			{
				theApp.getErrMsg(thisObj,this);
			}		
			else if(queryData)
			{
 				//queryData.printQueryData();
				if(callback) callback();
			}
		});
	}
};

FUNDMobileApp.prototype.getUserInfo = function(rmnno, callback)
{
	var thisObj = this;
	QryRequest.request('SACMQ633',
	function(queryData)
	{
		var inBlock1 = queryData.getBlockData('InBlock1')[0];
		
		inBlock1["D1고객확인구분"] = '1';
		inBlock1["D1고객확인번호"] = rmnno;
		inBlock1["D1조회구분"] = '4';
		queryData.putPwInfo('InBlock1', 'D1고객확인번호', false, theApp.encryptType);
	},
	
	function(queryData)
	{
		var errCode = this.getLastError('errCode');
		if( errCode >= 1000)
		{
			theApp.getErrMsg(thisObj,this);
			callback.call(theApp, false);
		}
		else if(queryData)
		{
 			//queryData.printQueryData();
			theApp.userInfo.setQueryData(queryData);
			theApp.userInfo.setUserData('D1실명확인번호암호화', rmnno);
			
			callback.call(theApp, true);
		}
	});
	
};


FUNDMobileApp.prototype.initUserInfo = function()
{
	var aquery = AQuery.getSafeQuery('SACMQ633');
	var qryData = new AQueryData(aquery);
	var obj = new Object();

	obj["D1실명확인번호"] = '';
	obj["D1등록일"] = '';
	obj["D1일련번호"] = 0;	
	obj["D1고객번호"] = '';
	obj["D1고객명"] = '';
	obj["D1본인확인구분"] = '';
	obj["D1신분증진위확인여부"] = '';
	obj["D1기존고객여부"] = '';
	obj["D1계좌번호"] = '';
	obj["D1관리지점번호"] = '';	
	obj["D1IC Card 발급구분"] = '';
	obj["D1OTP발급구분"] = '';
	obj["D1보안카드 발급구분"] = '';
	obj["D1거래매체수령주소유형코드"] = '';
	obj["D1영상통화일련번호"] = 0;
	obj["D1당타사여부"] = '1';
	obj["D1은행코드"] = '';
	obj["D1기관계좌번호"] = '';
	obj["D1이체금액"] = 0;
	obj["D1타기관활용계좌상태구분"] = '';
	obj["D1상대기관코드"] = '';
	obj["D1상대계좌번호"] = '';
	obj["D1상대계좌명"] = '';
	obj["D1은행이체약정계좌상태구분"] = '';
	obj["D1자택우편번호"] = '';
	obj["D1자택동이상주소"] = '';
	obj["D1자택동이하주소2"] = '';
	obj["D1자택전화지역번호"] = '';
	obj["D1자택전화국번호"] = '';
	obj["D1자택전화일련번호"] = '';
	obj["D1직장우편번호"] = '';
	obj["D1직장동이상주소"] = '';
	obj["D1직장동이하주소"] = '';
	obj["D1직장전화지역번호"] = '';
	obj["D1직장전화국번호"] = '';
	obj["D1직장전화일련번호"] = '';
	obj["D1이메일주소"] = '';
	obj["D1이동전화식별번호"] = '';
	obj["D1이동전화국번호"] = '';
	obj["D1이동전화일련번호"] = '';
	obj["D1휴대폰지역번호"] = '';
	obj["D1휴대폰국번호"] = '';
	obj["D1휴대폰일련번호"] = '';
	obj["D1디바이스고유번호"] = '';
	obj["D1처리상태코드"] = '';
	obj["D1처리일시"] = '';
	obj["D1변경지점번호"] = '';
	obj["D1변경사용자ID"] = '';
	obj["D1변경일시"] = '';
	
	
	qryData.queryData = {};
	var blockData = qryData.queryData['OutBlock1'] = [];
	blockData.push(obj);
	
	this.userInfo.setQueryData(qryData);
};



FUNDMobileApp.prototype.checkPageAccount = function() {

	var thisObj = this;
	QryRequest.request('SACMT635',
	function(queryData)
	{
		var inBlock1 = queryData.getBlockData('InBlock1');
		inBlock1[0] =
		{
			"D1처리구분" : 2,
			"D1실명확인번호" : '',
			"D1디바이스고유번호" : theApp.uId
		};
	},
	function(queryData)
	{	
		var errCode = this.getLastError('errCode');
		//3초간 Intro화면 표기 위해
		var ddd = new Date();
		var GAP = ddd.getTime() - thisObj.sDate;
		if( errCode >= 1000 )
		{
			//이미 개설 완료 상태인데, 조회 오류 떠서 계좌개설 진행중 단계로 이동할 수 있음
			//1002 -> 1006으로 변경
			if(GAP < thisObj.waitingTime) { 
				setTimeout(function(){ 
					theApp.checkCreateDatetime( function(){
						//theApp.navigator.goPage('MS1006');
						theApp.navigator.goPage('MS1005',false);	
					});
				}, (thisObj.waitingTime-GAP));
			} else {
				theApp.checkCreateDatetime( function(){
					//theApp.navigator.goPage('MS1006');
					theApp.navigator.goPage('MS1005',false);	
				});
			}
		}
		else if(queryData)
		{
			//queryData.printQueryData();
			var outBlock = queryData.getBlockData('OutBlock1')[0];
			//계좌개설 완료 > 진위확인 이전단계
			if(outBlock['D1처리상태코드'] == '99' || outBlock['D1처리상태코드'] == '0A' || outBlock['D1처리상태코드'] == '0B') {
				if(outBlock['D1비대면업무구분'] == 'A') {
					if(GAP < thisObj.waitingTime) { 
						(function(param) {setTimeout(function(){ theApp.navigator.goPage('MS1001', false, [param]); }, (thisObj.waitingTime-GAP)); })(outBlock['D1등록일']);
					} else {
						theApp.navigator.goPage('MS1001', false, [ outBlock['D1등록일'] ]);	
					}
				} else {
					AToast("오류발생 재시작해주시기 바랍니다.");
					//theApp.showErrorMsg(0);
				}
			//신규 계좌개설
			} else if(outBlock['D1처리상태코드'] == '0Z') {
				if(GAP < thisObj.waitingTime) { 
					setTimeout(function(){ 
						theApp.checkCreateDatetime( function(){
							//theApp.navigator.goPage('MS1006');
							theApp.navigator.goPage('MS1005',false);	
						});
					}, (thisObj.waitingTime-GAP));
				} else {
					theApp.checkCreateDatetime( function(){
						//theApp.navigator.goPage('MS1006');	
						theApp.navigator.goPage('MS1005',false);	
					});
				}
			//계좌개설 진행 중
			} else {
				if(outBlock['D1비대면업무구분'] == 'A') {
					if(GAP < thisObj.waitingTime) { 
						setTimeout(function(){ 
							theApp.checkCreateDatetime( function(){
								theApp.navigator.goPage('MS1002');
							});
						}, (thisObj.waitingTime-GAP));
					} else {
						theApp.checkCreateDatetime( function(){
							theApp.navigator.goPage('MS1002');	
						});				
					}
				} else {
					if(GAP < thisObj.waitingTime) { 
						setTimeout(function(){ 
							theApp.checkCreateDatetime( function(){
								//theApp.navigator.goPage('MS1006');	
								theApp.navigator.goPage('MS1005',false);	
							});
						}, (thisObj.waitingTime-GAP));
					} else {
						theApp.checkCreateDatetime( function(){
							//theApp.navigator.goPage('MS1006');	
							theApp.navigator.goPage('MS1005',false);
						});
					}
				}
			}
		}
	});
};

//계좌개설 가능시간 조회
FUNDMobileApp.prototype.checkCreateDatetime = function(callback)
{
	var thisObj = this;
	QryRequest.request('SACMT635',
	function(queryData)
	{		
		var inBlock1 = queryData.getBlockData('InBlock1');
		inBlock1[0] =
		{
			"D1처리구분" : 3,
			"D1실명확인번호" : '',
			"D1디바이스고유번호" : thisObj.uId
		};
	},
	function(queryData)
	{
		var errCode = this.getLastError('errCode');
		
		if( errCode >= 1000 )
		{	
			if( 3643 == errCode)	// 실패
			{
				theApp.isNFTFProgress = false;
				AppManager.hidePatchView();
				var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');
				win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">서비스 이용시간이 아닙니다.<br/>'
				+'*메리츠스마트지점 이용 가능시간 :<br/>&nbsp;&nbsp;오전8시 ~ 오후11시<br/>'
				+'서비스 가능시간에 다시 이용해주시기<br/>바랍니다.</span>';
				win.openAsDialog(thisObj);
			}
		}
		else if( 147 == errCode || 136 == errCode ) //성공
		{
			if(callback) callback();
		}			
	});
};

FUNDMobileApp.prototype.getProductId = function(productName)
{
	if(productName) {
		return this.tempProductId[productName];
	}
	return this.tempProductId;
};

//서비스 조회 후 에러메시지 팝업
FUNDMobileApp.prototype.getErrMsg = function(parent, manager)
{
	var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');
	win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">' + manager.getLastError('errMsg') + '<br>(' + manager.getLastError('trName') + ')' + ' (' + manager.getLastError('errCode') + ')</span>';
	win.openAsDialog(parent);
};

FUNDMobileApp.prototype.getPrdtInfo = function()
{	
	return null;
};

var theApp = null;

$(document).ready(function()
{
	var urlParams = location.search.split(/[?&]/).slice(1).map(function(paramPair) {
		return paramPair.split(/=(.+)?/).slice(0, 2);
	}).reduce(function (obj, pairArray) {
		obj[pairArray[0]] = pairArray[1];
		return obj;
	}, {});
	if(urlParams.qryTest != 'true') {
    	theApp = new FUNDMobileApp();
		//theApp.projectOption = { autoInc: @auto-inc@, dynamicInc: @dynamic-inc@, autoScale: @auto-scale@, docWidth: @doc-width@, scaleVal: @scale-val@ };
		theApp.onReady();
	}
});
