
/**
Constructor
Do not call Function in Constructor.
*/
function FD0000_W14(containerId)
{
	AWindow.call(this, containerId);
	//TODO:edit here

}
afc.extendsClass(FD0000_W14, AWindow);


FD0000_W14.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);
	//TODO:edit here

};

FD0000_W14.prototype.onButton1Click = function(comp, info)
{
	//TODO:edit here
	this.close(0);
};

FD0000_W14.prototype.onBtnWeekClick = function(comp, info)
{
	//TODO:edit here
	var now = new Date();
	var now2 = null;

	now.setDate(now.getDate()+6);
	now2 = now.format('yyyyMMdd');
	
	theApp.prefInfo.set('EventDate3', now2);

	this.close(0);

};
