
/**
Constructor
Do not call Function in Constructor.
*/
//약관 팝업 
function FD5001_W05(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5001_W05.lay';

	//TODO:edit here

}
afc.extendsClass(FD5001_W05, BaseWindow);


FD5001_W05.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here		
};


FD5001_W05.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.lblTitle = this.findCompById('lblTitle');
	this.webView = this.findCompById('WebView');
	this.checkType = this.cType;
	this.lblTitle.setText(this.loadTitle);
	this.webView.loadWebView(this.loadViewUrlAddr);
};

FD5001_W05.prototype.onbtnCloseClick = function(comp, info)
{	
	if(this.checkType == '4'){
		this.close(1);
	}else{
		this.close(0);
	}
	
};
