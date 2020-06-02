
/**
Constructor
Do not call Function in Constructor.
*/
function FD5001_W06(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5001_W06.lay';

	//TODO:edit here

}
afc.extendsClass(FD5001_W06, BaseWindow);


FD5001_W06.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here

};


FD5001_W06.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.check = this.findCompById('CheckBox1');
	this.button = this.findCompById('Button1');
	this.button.enable(false);
	
};


FD5001_W06.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	this.close(0);
	
};

FD5001_W06.prototype.onCheckBox1Click = function(comp, info)
{

	//TODO:edit here
	
	if(this.check.getCheck() == true){
		this.button.enable(true);
	}else{
		this.button.enable(false);
	}

};
