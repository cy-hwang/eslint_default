
/**
Constructor
Do not call Function in Constructor.
*/
function MS0000_W10(containerId)
{
	BaseWindow.call(this, containerId);

}
afc.extendsClass(MS0000_W10, BaseWindow);

MS0000_W10.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here

};


MS0000_W10.prototype.onBtnCloseClick = function(comp, info)
{

	//TODO:edit here
	this.close(0);

};

MS0000_W10.prototype.onBtnTodayClick = function(comp, info)
{

	var now = new Date();
	var now2 = null;

	now.setDate(now.getDate());
	now2 = now.format('yyyyMMdd');								

	//theApp.prefInfo.set('NoticeEvent', now2);
	AppManager.setPref('NoticeEvent2', now2);
	//TODO:edit here
	this.close(0);

};
