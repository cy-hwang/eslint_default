
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_W18(containerId)
{
	AWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/MS1005_W18.lay';

	//TODO:edit here

}
afc.extendsClass(MS1005_W18, AWindow);


MS1005_W18.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);

	//TODO:edit here

};

MS1005_W18.prototype.onButtonCancel = function(comp, info)
{
	//TODO:edit here
	this.close(1);
};

MS1005_W18.prototype.onButton2Click = function(comp, info)
{

	//TODO:edit here
	this.close(2);

};
