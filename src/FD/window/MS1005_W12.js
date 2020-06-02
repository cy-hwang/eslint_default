
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_W12(containerId)
{
	BaseWindow.call(this, containerId);
	
	//this.rManager = null;
}
afc.extendsClass(MS1005_W12, BaseWindow);


MS1005_W12.prototype.onReady = function()
{
	
	this.title = this.findCompById('Title');
	this.rbManager = new RadioBtnManager();
	this.skt = this.findCompById("SKT");
	
	this.title.setText(this.titleText);
	
	this.webView = this.findCompById('WebView');
	this.webGroup = this.findCompByGroup('WebGroup');
	if(this.data != null && typeof this.data != 'undefined') {
		this.webGroup[0].setDelegator(this);
		this.webGroup[1].setDelegator(this);
		this.webGroup[2].setDelegator(this);
		this.webGroup[0].enableZoom(true);
		this.webGroup[1].enableZoom(true);
		this.webGroup[2].enableZoom(true);
		this.webGroup[0].setUrl(this.data[0]);
		this.webGroup[1].setUrl(this.data[1]);
		this.webGroup[2].setUrl(this.data[2]);
		this.onSKTActionUp(this.skt);
	} else {
		this.close(0);
	}
	
	BaseWindow.prototype.onReady.call(this);
};

MS1005_W12.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
};

MS1005_W12.prototype.onDocReady = function(awebview, contentDocument)
{
	awebview.zoom(0.7);
};

MS1005_W12.prototype.onImage1ActionDown = function(comp, info)
{
	this.close(0);
};

MS1005_W12.prototype.onSKTActionUp = function(comp, info)
{
	this.rbManager.selectButton(comp);
	this.webGroup[0].$ele.show();
	this.webGroup[1].$ele.hide();
	this.webGroup[2].$ele.hide();
};

MS1005_W12.prototype.onKTActionUp = function(comp, info)
{
	this.rbManager.selectButton(comp);
	this.webGroup[1].$ele.show();
	this.webGroup[0].$ele.hide();
	this.webGroup[2].$ele.hide();
};

MS1005_W12.prototype.onLGUActionUp = function(comp, info)
{
	this.rbManager.selectButton(comp);
	this.webGroup[2].$ele.show();
	this.webGroup[1].$ele.hide();
	this.webGroup[0].$ele.hide();
};