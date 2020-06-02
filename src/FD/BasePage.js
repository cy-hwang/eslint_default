
/**
Constructor
Do not call Function in Constructor.
*/
function BasePage()
{
	APage.call(this);
	
	this.tabViewManager = null;
	
	this.queryMap = {};
	
	this.tabViewArr = new Array();
	this.lifeCycleListener = new Array();
	this.chartViewList = new Array();
	this.webViewList = new Array();
	
	this.useNative = false;
	
	this.state = null;
}
afc.extendsClass(BasePage, APage);


BasePage.prototype.onReady = function()
{
	APage.prototype.onReady.call(this);
	
	/*
	if(!afc.isSimulator) ChartManager.destroyAll();
	*/
	
	this.state = 0;
	
	var thisObj = this;
	//로드뷰가 있으면 lifeCycleListener에 등록
	this.lifeCycleListener = new Array();
	this.view.$ele.find("[data-load-url]").each(function(index){
		thisObj.lifeCycleListener.push(this.acomp.loadView);
	});
	//탭뷰가 있으면 lifeCycleListener에 등록
	this.tabViewArr = new Array();
	this.view.$ele.find("[data-base='ATabView']").each(function(index){
		thisObj.tabViewArr.push(this.acomp);
	});
};

//화면이 활성화되기 전 이벤트
BasePage.prototype.onWillActive = function(reload)
{
	this.state++;
	this.triggerLifeCycle('onWillActive', reload);
};

//화면이 활성화되는 중 이벤트
BasePage.prototype.onActive = function(reload)
{
	this.state++;
	if(theApp.menuInfo.isLoginCheckPage(this.getContainerId()))
	{
		
		theApp.frmPage.settingBtmMenuByLoginState();
		
		theApp.frmPage.checkPageTabViewHeight();
	}
	
	this.triggerLifeCycle('onActive', reload);
};

//화면이 활성화된 후 이벤트
BasePage.prototype.onActiveDone = function(reload)
{
	this.state++;
	this.sendDataAuto();
	this.triggerLifeCycle('onActiveDone', reload);
};

//화면이 소멸되기 전 이벤트
BasePage.prototype.onWillDeactive = function()
{
	/*
	if(theApp.screenMode == AppManager.SCREEN_ORIENTATION_LANDSCAPE)
	{
		AppManager.setPortrait(AppManager.SCREEN_ORIENTATION_PORTRAIT);
	}
	*/
	
	for(var i = 0; i<this.chartViewList.length; i++)
	{
		this.chartViewList[i].destroyChart();
	};
	
	for(var i = 0; i<this.webViewList.length; i++)
	{
		this.webViewList[i].destroyWebView();
	};
	
	this.triggerLifeCycle('onWillDeactive');
	this.state--;
};

//화면이 소멸되는 중 이벤트
BasePage.prototype.onDeactive = function()
{
	this.triggerLifeCycle('onDeactive');
	this.state--;
	
	var tabViewLen = this.tabViewArr.length;
	if(tabViewLen > 0)
	{
		var tabView = null;
		
		for(var i = 0; i<tabViewLen; i++)
		{
			if(!this.tabViewArr[i].selectedTab) continue;
			$(this.tabViewArr[i].selectedTab.content).hide();
		}
	}
};

//화면이 소멸된 후 이벤트
BasePage.prototype.onDeactiveDone = function()
{
	this.triggerLifeCycle('onDeactiveDone');
	//현재화면으로 다시 돌아왔을때 이전 탭 선택 클리어
	var tabViewLen = this.tabViewArr.length;
	if(tabViewLen > 0)
	{
		var tabView = null;
		
		for(var i = 0; i<tabViewLen; i++)
			this.tabViewArr[i].clearSelectTab();
	}
	this.state--;
	
};

//라이프 사이클을 trigger시켜주는 함수
BasePage.prototype.triggerLifeCycle = function(funcName, reload)
{
	var funcRow = null;
	var funcThis = null;
	for(var i = 0; i<this.lifeCycleListener.length; i++)
	{
		funcThis = this.lifeCycleListener[i];
		funcRow = funcThis[funcName];
		if(funcRow) funcRow.call(funcThis, reload);
	}

	var tabViewLen = this.tabViewArr.length;
	if(tabViewLen > 0)
	{
		var tabView = null, active = null;
		for(var i = 0; i<tabViewLen; i++)
		{
			tabView = this.tabViewArr[i];
			var active = tabView.getSelectedView();
			if(active && active[funcName])
			{
				active[funcName].call(active, reload);
				if(this.tabViewManager && this.tabViewManager.loadDoneCallback)
				{
					this.tabViewManager.loadDoneCallback(reload);
					this.tabViewManager.loadDoneCallback = null;
				}
			}
		}
	}
};

//탭뷰와 라디오버튼을 연결해주는 탭뷰매니져 생성 함수
BasePage.prototype.makeTabViewManager = function(tabview, container)
{
	var tabViewManager = new TabViewManager();
	tabViewManager.initManager(tabview, new RadioBtnManager(container));
	
	if(!this.tabViewManager) this.tabViewManager = tabViewManager;
	return tabViewManager;
};

//화면 라이프사이클을 받아야하는 컴포넌트 등록
BasePage.prototype.addLifeCycleListener = function(listener)
{
	this.lifeCycleListener.push(listener);
};

//정보계 쿼리인지 체크
BasePage.prototype.isInfoQuery = function(queryName)
{
	var prefix = queryName.substring(0,2);
	return ( prefix == 'QR' || prefix == 'DB' || prefix == 'CP' || prefix == 'MC' );
};

//서버로 네트웍을 전송하는 함수
BasePage.prototype.sendData = function(queryName, inFunc, outFunc, accNoIn, groupId)
{
	var rowQuery = this.queryMap[queryName];
	if(rowQuery)
	{
		if(!inFunc && rowQuery.inFunc) inFunc = rowQuery.inFunc;
		if(!outFunc && rowQuery.outFunc) outFunc = rowQuery.outFunc;
		if(!groupId && rowQuery.groupId) groupId = rowQuery.groupId;
	}
	
	if(this.isInfoQuery(queryName))
	{
		//정보계 전송
		theApp.infoNetManager.sendProcessByName(queryName, this.getContainerId(), groupId, inFunc, outFunc);
	}
	else 
	{
		//계정계 전송
		var thisObj = this;
		
		if (accNoIn)
		{
			// SMS 인증요청
			theApp.smsCertManager.openSmsCertWindow(accNoIn, false, null, function(result)
			{
				if(result)
				{
					theApp.accNetManager.sendProcessByName(queryName, thisObj.getContainerId(), groupId, inFunc, outFunc);
				}
				return result;
			});
			return;
		}
		
		theApp.accNetManager.sendProcessByName(queryName, thisObj.getContainerId(), groupId, inFunc, outFunc);
	}
};

//특정 컴포넌트의 setQueryData를 재정의하는 공통함수
BasePage.prototype.initSetQuery = function()
{
	
};

//화면이 실행될때 자동으로 쿼리를 날리는 공통함수 
BasePage.prototype.sendDataAuto = function()
{
	/*
	var rowQuery = null;
	for(var queryName in this.queryMap)
	{
		var rowQuery = this.queryMap[queryName];
		if(rowQuery && rowQuery.autoSend)
			this.sendData(queryName, rowQuery.inFunc, rowQuery.outFunc, rowQuery.groupId);
	}
	*/
};

/*
//화면에서 쿼리를 날리는 공통함수
BasePage.prototype.sendDataManage = function()
{
};
*/

//화면에서 리얼을 전체 해제하는 공통함수
BasePage.prototype.unregisterRealAll = function()
{
	afc.log(this.getId()+' -> BasePage:unregisterRealAll() 함수가 구현되어 있지 않습니다.');	
};

//데이터 갱신
BasePage.prototype.refreshData = function()
{
	afc.log(this.getId()+' -> BasePage:refreshData() 함수가 구현되어 있지 않습니다.');
};


