
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_W11(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD3202_W11.lay';

	//TODO:edit here

}
afc.extendsClass(FD3202_W11, BaseWindow);


FD3202_W11.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here

};

FD3202_W11.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	this.close(0);

};

FD3202_W11.prototype.onButton2Click = function(comp, info)
{
	//TODO:edit here
	this.close(1);
};
