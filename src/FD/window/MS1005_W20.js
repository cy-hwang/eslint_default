
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_W20(containerId)
{
	AWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/MS1005_W20.lay';

	//TODO:edit here

}
afc.extendsClass(MS1005_W20, AWindow);


MS1005_W20.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);

	//TODO:edit here

};



MS1005_W20.prototype.onOkBtnClick = function(comp, info)
{
	this.close(0);
	//TODO:edit here

};
