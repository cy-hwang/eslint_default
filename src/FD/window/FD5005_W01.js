
/**
Constructor
Do not call Function in Constructor.
*/
function FD5005_W01(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5005_W01.lay';

	//TODO:edit here

}
afc.extendsClass(FD5005_W01, BaseWindow);


FD5005_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here
	
};

FD5005_W01.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);	
	
	this.woriName = this.findCompById('Label2')//이름
	this.name = this.findCompById('Label6')//이름
	this.woori = this.findCompById('Label7')//우리은행
	this.acc = this.findCompById('Label9')//계좌

	this.woriName.setText(this.accName);
	this.name.setText(this.accName);
	this.woori.setText('우리은행');
	this.acc.setText(this.account);
}

FD5005_W01.prototype.onCloseBtnClick = function(comp, info)
{

	//TODO:edit here
	this.close(0);

};

FD5005_W01.prototype.onOkBtnClick = function(comp, info)
{

	//TODO:edit here
	this.close(0);

};
