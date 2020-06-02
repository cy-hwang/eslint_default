
/**
Constructor
Do not call Function in Constructor.
*/
function FD3102_W01(containerId)
{
	BaseWindow.call(this, containerId);

	//TODO:edit here
	//this.paraFundInfo = null;

	
	this.contiKey = null; //next 키	
	this.pivotView = null;
	
	//20180316
	this.webView = null;
	this.title = '';
}

//afc.extendsClass(FD3102_W01, AWindow);
afc.extendsClass(FD3102_W01, BaseWindow);


FD3102_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//20180316
	this.webView = this.findCompById('WebView1');
	//this.webView.setUrl(this.viewLink);
	this.webView.loadWebView(this.viewLink);
};

FD3102_W01.prototype.onWillActive = function(reload)
{
	BaseWindow.prototype.onWillActive.call(this, reload);
};

FD3102_W01.prototype.onbtnCloseClick = function(comp, info)
{
	//TODO:edit here
	this.close();
};

FD3102_W01.prototype.onButton3Click = function(comp, info)
{

	//TODO:edit here
	this.close();

};