
/**
Constructor
Do not call Function in Constructor.
*/
function FD5002_T01()
{
	AView.call(this);

	this.tbvManager = null;

}
afc.extendsClass(FD5002_T01, AView);


FD5002_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.tabView = this.findCompById('CenterView');	
	
	this.tbvManager = new TabViewManager();	
	this.tbvManager.initManager(this.tabView, new RadioBtnManager(this));		

	this.tbvManager.addTab({url:'FD/view/FD5002_V01.lay', tabId:'FD5002_V01', name:'가져오기'});
	this.tbvManager.addTab({url:'FD/view/FD5002_V02.lay', tabId:'FD5002_V02', name:'가져오기 완료'});
};

//화면이 활성화된 후 이벤트
FD5002_T01.prototype.onActiveDone = function(reload)
{	
	AView.prototype.onActiveDone.call(this, reload);
		
	this.tbvManager.changeTab('FD5002_V01');
};


