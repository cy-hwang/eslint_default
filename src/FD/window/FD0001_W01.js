
/**
Constructor
Do not call Function in Constructor.
*/
function FD0001_W01(containerId)
{
	BaseWindow.call(this, containerId);

	this.topView = null;
}
afc.extendsClass(FD0001_W01, BaseWindow);


FD0001_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	
	this.topView = this.findCompById('View62');
};

FD0001_W01.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
// 	window.test = this;
	this.webView = this.findCompById('WebView');
	this.webView.$ele.html('<embed src="http://www.meritzasset.com/home/video.php" width="100%" height="100%">');
	this.view62 = this.findCompById('View62');
// 	this.webView.loadWebView("http://www.meritzasset.com/home/video.php");	
}

FD0001_W01.prototype.onCloseBtnClick = function(comp, info)
{
	this.close();
};


FD0001_W01.prototype.onButton8Click = function(comp, info)
{
	//가로모드로 전환
	if(theApp.screenMode == AppManager.SCREEN_ORIENTATION_PORTRAIT)
	{
		theApp.screenMode = AppManager.SCREEN_ORIENTATION_LANDSCAPE;
		this.webView.removeClass('webview');
		this.webView.addClass('webview2');
		this.view62.removeClass('header');
		this.view62.addClass('header2');
	}
	else
	{
		theApp.screenMode = AppManager.SCREEN_ORIENTATION_PORTRAIT;
		this.webView.addClass('webview');
		this.webView.removeClass('webview2');
		this.view62.addClass('header');
		this.view62.removeClass('header2');
	}
	
	AppManager.setPortrait(theApp.screenMode);
	
/*
	this.versionTimer = setInterval(function()
	{
	}, 500);
*/
};
