
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_W04(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD3202_W04.lay';

	//TODO:edit here

}
afc.extendsClass(FD3202_W04, BaseWindow);


FD3202_W04.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here

	

};

FD3202_W04.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
		
	this.btnConfirm = this.findCompById('btnConfirm');
	
	this.CheckBox1 = this.findCompById('CheckBox1');
	this.CheckBox2 = this.findCompById('CheckBox2');
	
	// 화면을 띄울때마다 초기화
	this.btnConfirm.enable(false);
	
	this.CheckBox1.setCheck(false);
	this.CheckBox2.setCheck(false);
	
};


FD3202_W04.prototype.onbtnCloseClick = function(comp, info)
{
	//TODO:edit here
	this.close(0);
};

FD3202_W04.prototype.onCheckBoxClick = function(comp, info)
{
	//TODO:edit here
	
	if(this.CheckBox1.getCheck() && this.CheckBox2.getCheck()){
		this.btnConfirm.enable(true);
	}else{
		this.btnConfirm.enable(false);
	}

};

FD3202_W04.prototype.onbtnConfirmClick = function(comp, info)
{

	//TODO:edit here
	this.close(1);
};
