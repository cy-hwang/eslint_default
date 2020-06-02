
/**
Constructor
Do not call Function in Constructor.
*/
function FD5001_T02()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5001_T02, AView);


FD5001_T02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	
	this.tabView1 = this.findCompById('TabView1');
	
	this.tbvManager = new TabViewManager();	
	this.tbvManager.initManager(this.tabView1, new RadioBtnManager(this));	
	this.tbvManager.addTab({url:'FD/view/FD5001_V05.lay', tabId:'FD5001_V05', name:'약관 및 주요사항 확인'});
	this.tbvManager.addTab({url:'FD/view/FD5001_V06.lay', tabId:'FD5001_V06', name:'개설'});
	
};


FD5001_T02.prototype.onActiveDone = function(reload)
{	
	
	AView.prototype.onActiveDone.call(this, reload);
	
	this.tbvManager.changeTab('FD5001_V05');
};
