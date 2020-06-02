
/**
Constructor
Do not call Function in Constructor.
*/
//출금 tab
function FD5005_T02()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5005_T02, AView);


FD5005_T02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	this.tabView1 = this.findCompById('TabView1');
	
	this.tbvManager = new TabViewManager();	
	this.tbvManager.initManager(this.tabView1, new RadioBtnManager(this));	
	this.tbvManager.addTab({url:'FD/view/FD5005_V04.lay', tabId:'FD5005_V04', name:'출금1'});	
	this.tbvManager.addTab({url:'FD/view/FD5005_V05.lay', tabId:'FD5005_V05', name:'출금2'});	
	this.tbvManager.addTab({url:'FD/view/FD5005_V06.lay', tabId:'FD5005_V06', name:'출금3'});

};


FD5005_T02.prototype.onActiveDone = function(reload)
{	
	
	AView.prototype.onActiveDone.call(this, reload);
	
	this.tbvManager.changeTab('FD5005_V04');
};
