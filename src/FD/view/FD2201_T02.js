
/**
Constructor
Do not call Function in Constructor.
*/
function FD2201_T02()
{
	AView.call(this);
	this.tvManager = null;
}
afc.extendsClass(FD2201_T02, AView);


//초기화
FD2201_T02.prototype.onArrInit = function()
{
};


FD2201_T02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);	
	
	// 약정계좌(계좌명, 은행코드, 은행계좌번호, 사용자명, 종합계좌번호)
	this.acntInfo = {
		"accNm": "",
		"bankNm": "",
		"bankAccNo": "",
		"userNm": "",
		"accNo": ""
	}
	
	this.tvManager = new TabViewManager();
	this.tvManager.initManager(this.findCompById('LoadView'), new RadioBtnManager(this));
	
	//탭뷰매니저 초기화
	this.tvManager.addTab({name:'Tab01', url:'FD/view/FD2201_V01.lay', tabId:'TabBtn1'});
	this.tvManager.addTab({name:'Tab02', url:'FD/view/FD2201_V02.lay', tabId:'TabBtn2'});
};


//화면이 활성화된 후 이벤트
FD2201_T02.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	this.setAcntInfo();
	this.tvManager.changeTab('TabBtn1');
};

FD2201_T02.prototype.setAcntInfo = function(accNm, bankNm, bankAccNo, userNm, accNo) {
	this.acntInfo.accNm = accNm;
	this.acntInfo.bankNm = bankNm;
	this.acntInfo.bankAccNo = bankAccNo;
	this.acntInfo.userNm = userNm;
	this.acntInfo.accNo = accNo;
}

FD2201_T02.prototype.fnDoSendDataManage = function()
{
	if(this.tvManager.getActiveView() && this.tvManager.getActiveView().fnDoSendDataManage){
		this.tvManager.getActiveView().fnDoSendDataManage();
	}	
};