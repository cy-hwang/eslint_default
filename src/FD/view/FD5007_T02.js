/**
Constructor
Do not call Function in Constructor.
*/
function FD5007_T02()
{
	AView.call(this);	
}
afc.extendsClass(FD5007_T02, AView);


FD5007_T02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	// Object
	this.cont = this.getContainer();
	
	// 계좌
	this.accView = this.cont.findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx; 			// 계좌드롭박스
	this.secureTxf = this.accView.secureTxf;	// 계좌비밀번호
	
	// 서브탭
	this.button1 = this.findCompById('Button1');	// 계좌현황
	this.button2 = this.findCompById('Button2');	// 예상연금액
	this.button3 = this.findCompById('Button3');	// 예상세금액
	this.subTabBtns = [
		{ btnComp : this.button1, btnVal : '0', tabId : 'FD5007_T03' },
		{ btnComp : this.button2, btnVal : '1', tabId : 'FD5007_T04' },
		{ btnComp : this.button3, btnVal : '2', tabId : 'FD5007_T05' }
	];
	
	// 서브탭 뷰
	this.tabView = this.findCompById('TabView1');	
	
	this.tbvManager = new TabViewManager();	
	this.tbvManager.initManager(this.tabView, new RadioBtnManager(this));		

	this.tbvManager.addTab({url:'FD/view/FD5007_T03.lay', tabId:'FD5007_T03', name:'계좌현황'});
	this.tbvManager.addTab({url:'FD/view/FD5007_T04.lay', tabId:'FD5007_T04', name:'예상연금액'});
	this.tbvManager.addTab({url:'FD/view/FD5007_T05.lay', tabId:'FD5007_T05', name:'예상세금액'});
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5007_T02.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 서브탭 초기화
	this.onInitSubTabData();
	
	this.fnDoSendDataManage();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5007_T02.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5007_T02.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
};


// 서브탭 초기화
FD5007_T02.prototype.onInitSubTabData = function()
{
	// 서브탭 셋팅
	this.selectTabId = 'FD5007_T03'; 
	
	// 서브탭 활성화
	this.onSubTabEnable(0);
};


// 컴포넌트 초기화
FD5007_T02.prototype.onInitComponents = function()
{	
	
};


// 계좌번호 변경 시 이벤트
FD5007_T02.prototype.fnDoSendDataManage = function()
{
	// 계좌번호 저장
	PensionCommon.setFundAcc(this);
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 서브탭 이동
	this.onSubTabChange();	
};


// 서브탭 클릭
FD5007_T02.prototype.onButtonClick = function(comp, info)
{
	// 서브탭 활성화
	if(comp == this.button1) // 계좌현황
	{
		this.onSubTabEnable(0);
	}
	else if(comp == this.button2) // 예상연금액
	{
		this.onSubTabEnable(1);
	}
	else if(comp == this.button3) // 예상세금액
	{
		this.onSubTabEnable(2);
	}
	
	// 서브탭 이동
	this.onSubTabChange();
};


// 서브탭 활성화
FD5007_T02.prototype.onSubTabEnable = function(selectVal)
{
	var tabs = this.subTabBtns;

	// 탭 활성화
	for(var i = 0; i < tabs.length; i++)
	{
		tabs[i].btnComp.enable(true);
		
		if(selectVal == tabs[i].btnVal)
		{
			// 서브탭 활성화
			tabs[i].btnComp.enable(false);
			
			// 선택된 서브탭 셋팅
			this.selectTabId = tabs[i].tabId ;	
		}
	}
};


// 서브탭 이동
FD5007_T02.prototype.onSubTabChange = function()
{
	this.tbvManager.changeTab(this.selectTabId, false);
};


