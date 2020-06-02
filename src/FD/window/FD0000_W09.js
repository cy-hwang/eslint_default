
/**
Constructor
Do not call Function in Constructor.
*/
function FD0000_W09(containerId)
{
	BaseWindow.call(this, containerId);

}
afc.extendsClass(FD0000_W09, BaseWindow);


FD0000_W09.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here

};


FD0000_W09.prototype.onBtnCloseClick = function(comp, info)
{

	//TODO:edit here
	this.close(0);

};

FD0000_W09.prototype.onBtnTodayClick = function(comp, info)
{

	var now = new Date();
	var now2 = null;

	now.setDate(now.getDate());
	now2 = now.format('yyyyMMdd');								

	theApp.prefInfo.set('EventDate2', now2);

	//TODO:edit here
	this.close(0);

};
