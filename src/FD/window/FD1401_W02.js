
/**
Constructor
Do not call Function in Constructor.
*/
function FD1401_W02(containerId)
{
	BaseWindow.call(this, containerId);
	//TODO:edit here

}
afc.extendsClass(FD1401_W02, BaseWindow);


FD1401_W02.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);			
};

FD1401_W02.prototype.onWillActive = function(reload)
{
	BaseWindow.prototype.onWillActive.call(this, reload);
			
	this.webView = this.findCompById('WebView');
};



FD1401_W02.prototype.onActiveDone = function(reload){
	
	BaseWindow.prototype.onActiveDone.call(this, reload);
			
};


FD1401_W02.prototype.onbtnCloseClick = function(comp, info)
{

	//TODO:edit here
	this.close(0);
};
