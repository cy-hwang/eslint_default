
/**
Constructor
Do not call Function in Constructor.
*/
function FD5001_T01()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5001_T01, AView);


FD5001_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	
	this.tabView1 = this.findCompById('TabView1');
	
	this.tbvManager = new TabViewManager();	
	this.tbvManager.initManager(this.tabView1, new RadioBtnManager(this));	
	this.tbvManager.addTab({url:'FD/view/FD5001_V01.lay', tabId:'FD5001_V01', name:'계좌구분'});	
	this.tbvManager.addTab({url:'FD/view/FD5001_V02.lay', tabId:'FD5001_V02', name:'계약정보'});	
	this.tbvManager.addTab({url:'FD/view/FD5001_V03.lay', tabId:'FD5001_V03', name:'약관 및 주요사항 확인'});
	this.tbvManager.addTab({url:'FD/view/FD5001_V04.lay', tabId:'FD5001_V04', name:'개설'});
	

};


FD5001_T01.prototype.onActiveDone = function(reload)
{	
	
	AView.prototype.onActiveDone.call(this, reload);
	
	this.tbvManager.changeTab('FD5001_V01');
};
