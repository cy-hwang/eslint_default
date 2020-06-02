
/**
Constructor
Do not call Function in Constructor.
*/
function FD1401_W01(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD1401_W01.lay';

	//TODO:edit here

}
afc.extendsClass(FD1401_W01, BaseWindow);


FD1401_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here		

};


FD1401_W01.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.lblTitle = this.findCompById('lblTitle');
	this.webView = this.findCompById('WebView');

	this.lblTitle.setText(this.loadTitle);
	this.webView.loadWebView(this.loadviewUrlAddr);
	
};
FD1401_W01.prototype.onbtnCloseClick = function(comp, info)
{

	this.close(0);
	
};
