
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_W05(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	this.url = 'FD/window/MS1005_W05.lay';
	this.infoMsg = null;   //가운데 글자
	this.btnText = '확인'; //버튼 글자
}
afc.extendsClass(MS1005_W05, BaseWindow);


MS1005_W05.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	this.msgLbl = this.findCompById('MsgLbl');
	this.btn = this.findCompById('Button2');
	
	this.msgLbl.$ele.html(this.infoMsg);
	this.btn.setText(this.btnText);
};

MS1005_W05.prototype.onButton2Click = function(comp, info)
{
	this.close(1);
};