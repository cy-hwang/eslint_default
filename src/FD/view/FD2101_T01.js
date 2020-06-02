
/**
Constructor
Do not call Function in Constructor.
*/
function FD2101_T01()
{
	AView.call(this);	

	this.tvManager = null;
}

afc.extendsClass(FD2101_T01, AView);

//초기화
FD2101_T01.prototype.onArrInit = function()
{	

};

FD2101_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);	
	//tabView
	this.tvManager = new TabViewManager();
	this.tvManager.initManager(this.findCompById('CenterView'), new RadioBtnManager(this));
	
	//탭뷰매니저 초기화
	this.tvManager.addTab({name:'Tab01', url:'FD/view/FD2101_V11.lay', tabId:'TabBtn1'});
	this.tvManager.addTab({name:'Tab02', url:'FD/view/FD2101_V12.lay', tabId:'TabBtn2'});
	this.tvManager.addTab({name:'Tab03', url:'FD/view/FD2101_V13.lay', tabId:'TabBtn3'});
};

//화면이 활성화된 후 이벤트
FD2101_T01.prototype.onActiveDone = function(reload)
{	AView.prototype.onActiveDone.call(this, reload);		
	this.tvManager.changeTab('TabBtn1');
};

//화면이 소멸되기 전 이벤트
FD2101_T01.prototype.onWillDeactive = function(reload)
{	
	this.onArrInit();
};
