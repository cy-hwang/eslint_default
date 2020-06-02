
/**
Constructor
Do not call Function in Constructor.
*/
function FD0200_W02(containerId)
{
	BaseWindow.call(this, containerId);
	
	//this.rManager = null;
}
afc.extendsClass(FD0200_W02, BaseWindow);


FD0200_W02.prototype.onReady = function()
{

	
	this.title = this.findCompById('Title');
	this.rbManager = new RadioBtnManager();
	this.skt = this.findCompById("SKT");
	this.kt = this.findCompById("KT");
	this.lgu = this.findCompById("LGU");
	
	
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

FD0200_W02.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
};

FD0200_W02.prototype.onDocReady = function(awebview, contentDocument)
{
	awebview.zoom(0.7);
};

FD0200_W02.prototype.onImage1ActionDown = function(comp, info)
{
	this.close(0);
};

FD0200_W02.prototype.onSKTActionUp = function(comp, info)
{
	this.skt.addClass('on');
	this.kt.removeClass('on');
	this.lgu.removeClass('on');
	this.rbManager.selectButton(comp);	
	this.webGroup[0].$ele.show();
	this.webGroup[1].$ele.hide();
	this.webGroup[2].$ele.hide();
};

FD0200_W02.prototype.onKTActionUp = function(comp, info)
{

	this.skt.removeClass('on');
	this.kt.addClass('on');
	this.lgu.removeClass('on');
	this.rbManager.selectButton(comp);
	this.webGroup[1].$ele.show();
	this.webGroup[0].$ele.hide();
	this.webGroup[2].$ele.hide();
};

FD0200_W02.prototype.onLGUActionUp = function(comp, info)
{
	this.skt.removeClass('on');
	this.kt.removeClass('on');
	this.lgu.addClass('on');
	this.rbManager.selectButton(comp);
	this.webGroup[2].$ele.show();
	this.webGroup[1].$ele.hide();
	this.webGroup[0].$ele.hide();
};
FD0200_W02.prototype.onCancelBtnClick = function(comp, info)
{


	this.close(0);

};
