
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_W21(containerId)
{
	AWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/MS1005_W21.lay';

	//TODO:edit here

}
afc.extendsClass(MS1005_W21, AWindow);


MS1005_W21.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);

	//TODO:edit here

};



MS1005_W21.prototype.onOkBtnClick = function(comp, info)
{
	this.close(1);
	//TODO:edit here

};
