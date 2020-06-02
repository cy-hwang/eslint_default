
/**
Constructor
Do not call Function in Constructor.
*/
function FD1403_W02(containerId)
{
	BaseWindow.call(this, containerId);
	
}
afc.extendsClass(FD1403_W02, BaseWindow);


FD1403_W02.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
};

FD1403_W02.prototype.onWillActive = function(reload)
{
	BaseWindow.prototype.onWillActive.call(this, reload);		
	
};


FD1403_W02.prototype.onbtnCloseClick = function(comp, info)
{	
	this.close(0);
};


FD1403_W02.prototype.onBTN_CONFIRMClick = function(comp, info)
{

	//TODO:edit here
	this.close(1);
};

FD1403_W02.prototype.onBTN_CANCELClick = function(comp, info)
{

	//TODO:edit here
	this.close(0);
};
