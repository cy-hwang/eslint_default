
/**
Constructor
Do not call Function in Constructor.
*/
function FD1402_W01(containerId)
{
	BaseWindow.call(this, containerId);
	//TODO:edit here

}
afc.extendsClass(FD1402_W01, BaseWindow);


FD1402_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);			
};

FD1402_W01.prototype.onWillActive = function(reload)
{
	BaseWindow.prototype.onWillActive.call(this, reload);
			
};



FD1402_W01.prototype.onActiveDone = function(reload){
	
	BaseWindow.prototype.onActiveDone.call(this, reload);
			
};


FD1402_W01.prototype.onbtnCloseClick = function(comp, info)
{

	//TODO:edit here
	this.close(0);
};
