
/**
Constructor
Do not call Function in Constructor.
*/
function FD5000_W02(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5000_W02.lay';

	//TODO:edit here

}
afc.extendsClass(FD5000_W02, BaseWindow);


FD5000_W02.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here		
};


FD5000_W02.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.lblTitle = this.findCompById('lblTitle');
	this.webView = this.findCompById('WebView');
	this.checkType = this.cType;
	this.lblTitle.setText(this.loadTitle);
	this.webView.loadWebView(this.loadViewUrlAddr);
};

FD5000_W02.prototype.onbtnCloseClick = function(comp, info)
{	
	if(this.checkType == '4'){
		this.close(1);
	}else{
		this.close(0);
	}
	
};
