
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_W08(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD3202_W08.lay';

}
afc.extendsClass(FD3202_W08, BaseWindow);

FD3202_W08.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	
	var thisObj = this;

};

FD3202_W08.prototype.onButton1Click = function(comp, info)
{

	this.close(0);

};

FD3202_W08.prototype.onButton2Click = function(comp, info)
{

	this.close(1);

};
