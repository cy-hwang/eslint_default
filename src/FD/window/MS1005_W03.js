
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_W03(containerId)
{
	BaseWindow.call(this, containerId);

	this.urlType = null;
	this.titleText = null;
	this.enableZoom = null;
	this.lbl1 = null;
}
afc.extendsClass(MS1005_W03, BaseWindow);


MS1005_W03.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	this.webView = this.findCompById('WebView1');
	this.iOSwebView = this.findCompById('WebView2');
	
	if(afc.isIos)
		this.webView.show(AComponent.INVISIBLE);
	else if(afc.isAndroid)
		this.iOSwebView.show(AComponent.INVISIBLE);
		
	this.lbl1 = this.findCompById('Label1');
	this.lbl1.show(AComponent.VISIBLE);
	this.webView.show(AComponent.INVISIBLE);
	
	var pdfURL = 'http://docs.google.com/gview?embedded=true&url=';
	
	//넘어온 데이터에 따라 url세팅하기.
	if(this.data != null && typeof this.data != 'undefined') {
		if(afc.isIos){
			this.iOSwebView.show(AComponent.VISIBLE);
			this.iOSwebView.loadWebView(this.data);
		}
		else if(afc.isAndroid){
			this.webView.setDelegator(this);
			this.webView.setUrl(pdfURL + this.data);
			this.webView.enableZoom(true);
		}
	} else {
		this.close(0);
		
	}
	
};

MS1005_W03.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.lblTitle = this.findCompById('lblTitle');
	this.lblTitle.setText(this.loadTitle);
};

MS1005_W03.prototype.onDocReady = function(comp, info)
{
	this.lbl1.show(AComponent.GONE);
	this.webView.show(AComponent.VISIBLE);
	if(this.enableZoom === undefined || this.enableZoom != false) {
		comp.zoom(0.5);
	}
};

MS1005_W03.prototype.onbtnCloseClick = function(comp, info)
{
	this.close(0);
};
