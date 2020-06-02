
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_W02(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	this.url = 'FD/window/MS1005_W02.lay';

	this.infoView = null;
	this.infoMsg = null; // 가운데글자
	this.btnGroupId = null;
	this.btnType = 0;
	this.btnText = null; //버튼글자
}
afc.extendsClass(MS1005_W02, BaseWindow);


MS1005_W02.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	this.label = this.findCompById('Label2');
	this.btn = this.findCompById('Button2');
	
	this.label.$ele.html(this.infoMsg);
	if( 1 == this.btnType )
	{
		this.btn.setText('동의');
	}
	if(this.btnText)
	{
		this.btn.setText(this.btnText);
	}
};


MS1005_W02.prototype.onButton2Click = function(comp, info)
{
	this.close(1);
};

MS1005_W02.prototype.onButtonCancel = function(comp, info)
{
	this.close(0);
};

