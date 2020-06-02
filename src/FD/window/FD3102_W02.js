
/**
Constructor
Do not call Function in Constructor.
*/
function FD3102_W02(containerId)
{
	BaseWindow.call(this, containerId);

	//TODO:edit here
	//20180316
	this.webView = null;
}

//afc.extendsClass(FD3102_W02, AWindow);
afc.extendsClass(FD3102_W02, BaseWindow);


FD3102_W02.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	//20180316
	this.webView = this.findCompById('WebView1');
	//this.webView.setUrl(this.viewLink);
	this.webView.loadWebView(this.viewLink);
};


FD3102_W02.prototype.onWillActive = function(reload)
{
	BaseWindow.prototype.onWillActive.call(this, reload);
};




FD3102_W02.prototype.onbtnCloseClick = function(comp, info)
{

	//TODO:edit here
	this.close();
};

FD3102_W02.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	this.close();
};

