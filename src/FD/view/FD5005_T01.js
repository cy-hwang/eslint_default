
/**
Constructor
Do not call Function in Constructor.
*/
//입금 tab
function FD5005_T01()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5005_T01, AView);


FD5005_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	
	this.tabView1 = this.findCompById('TabView1');
	
	this.tbvManager = new TabViewManager();	
	this.tbvManager.initManager(this.tabView1, new RadioBtnManager(this));	
	this.tbvManager.addTab({url:'FD/view/FD5005_V01.lay', tabId:'FD5005_V01', name:'입금1'});	
	this.tbvManager.addTab({url:'FD/view/FD5005_V02.lay', tabId:'FD5005_V02', name:'입금2'});	
	this.tbvManager.addTab({url:'FD/view/FD5005_V03.lay', tabId:'FD5005_V03', name:'입금3'});

	

};

FD5005_T01.prototype.onActiveDone = function(reload)
{	
	
	AView.prototype.onActiveDone.call(this, reload);
	this.tbvManager.changeTab('FD5005_V01');
};
