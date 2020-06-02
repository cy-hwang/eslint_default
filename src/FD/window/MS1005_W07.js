
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_W07(containerId)
{
	BaseWindow.call(this, containerId);

	this.titleText = '안내';
	this.isAppClose = false;
	this.infoMsg = null;
	this.btnText = '확인';
	this.processType = '0';
}
afc.extendsClass(MS1005_W07, BaseWindow);


MS1005_W07.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	
	this.msgLbl = this.findCompById('MsgLbl');
	this.btn = this.findCompById('Button2');
	this.label2 = this.findCompById('Label2');
	this.view4 = this.findCompById('View4');
	
	this.label2.setText(DEFINE_VERSION);
	
	if(this.isAppClose) this.label2.show(AComponent.VISIBLE);
	else this.label2.show(AComponent.INVISIBLE);
	
	this.msgLbl.$ele.html(this.infoMsg);
	this.btn.setText(this.btnText);
		
	this.moveToCenter();
};


MS1005_W07.prototype.onButton2Click = function(comp, info)
{
	this.close(1);
};

MS1005_W07.prototype.onButtonCancel = function(comp, info)
{
	this.close(0);
};
