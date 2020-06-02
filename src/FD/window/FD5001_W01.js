
/**
Constructor
Do not call Function in Constructor.
*/
function FD5001_W01(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5001_W01.lay';

	//TODO:edit here

}
afc.extendsClass(FD5001_W01, BaseWindow);


FD5001_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here
	

};
FD5001_W01.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);

	//TODO:edit here
	
	this.textField1 = this.findCompById('TextField1');

}
FD5001_W01.prototype.onCancelWindowBtnClick = function(comp, info)
{

	//TODO:edit here
	
	this.close(0);

};

FD5001_W01.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	
	if(this.textField1.getText() >= 5){
		this.close({"key" : "1", "data" : this.textField1.getText()});
	}else{
		AToast.show('저축기간은 최소 5년 이상 입력해주십시오');
	}

};
