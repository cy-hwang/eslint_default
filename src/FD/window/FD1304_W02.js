
/**
Constructor
Do not call Function in Constructor.
*/
function FD1304_W02(containerId)
{
	AWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD1304_W02.lay';

	//TODO:edit here

}
afc.extendsClass(FD1304_W02, AWindow);


FD1304_W02.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);

	//TODO:edit here

};

FD1304_W02.prototype.onCloseBtnClick = function(comp, info)
{

	//TODO:edit here
	this.close(0);
};
