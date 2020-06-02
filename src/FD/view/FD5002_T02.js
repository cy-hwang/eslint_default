
/**
Constructor
Do not call Function in Constructor.
*/
function FD5002_T02()
{
	AView.call(this);

	this.tbvManager = null;

}
afc.extendsClass(FD5002_T02, AView);


FD5002_T02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.tabView = this.findCompById('CenterView');	
	
	this.tbvManager = new TabViewManager();	
	this.tbvManager.initManager(this.tabView, new RadioBtnManager(this));		

	this.tbvManager.addTab({url:'FD/view/FD5002_V03.lay', tabId:'FD5002_V03', name:'내보내기'});
	this.tbvManager.addTab({url:'FD/view/FD5002_V04.lay', tabId:'FD5002_V04', name:'내보내기 완료'});	
};

//화면이 활성화된 후 이벤트
FD5002_T02.prototype.onActiveDone = function(reload)
{	
	AView.prototype.onActiveDone.call(this, reload);
		
	this.tbvManager.changeTab('FD5002_V03');
};


