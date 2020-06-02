
/**
Constructor
Do not call Function in Constructor.
*/
function FD1501_W01(containerId)
{
	BaseWindow.call(this, containerId);

	this.urlType = null;
	this.titleText = null;
	this.enableZoom = null;
	this.lbl1 = null;
}
afc.extendsClass(FD1501_W01, BaseWindow);


FD1501_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	thisObj = this;
	this.webView = this.findCompById('WebView1');
	this.lbl1 = this.findCompById('Label1');
	this.lbl1.show(AComponent.VISIBLE);
	this.webView.show(AComponent.INVISIBLE);
	
	//넘어온 데이터에 따라 url세팅하기.
	if(this.data != null && typeof this.data != 'undefined') {
			this.webView.setDelegator(this);
			this.webView.setUrl(this.data);
			this.webView.enableZoom(true);
	} else {
		this.close(0);
	}
	
}; 

FD1501_W01.prototype.onButtonApply = function(comp, info)
{
	this.close(1);
};

FD1501_W01.prototype.onDocReady = function(comp, info)
{
	this.lbl1.show(AComponent.GONE);
	this.webView.show(AComponent.VISIBLE);
	if(this.enableZoom === undefined || this.enableZoom != false) {
		comp.zoom(0.5);
	}
};
