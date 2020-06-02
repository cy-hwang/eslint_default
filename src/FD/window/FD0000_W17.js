
/**
Constructor
Do not call Function in Constructor.
*/
function FD0000_W17(containerId)
{
	AWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD0000_W17.lay';

	//TODO:edit here

}
afc.extendsClass(FD0000_W17, AWindow);


FD0000_W17.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);

};

FD0000_W17.prototype.onButtonGoNext = function(comp, info)
{
	//TODO:edit here
	this.close(0);
};

FD0000_W17.prototype.onCheckBox1Click = function(comp, info)
{
	//TODO:edit here
	var now = new Date();
	var now2 = null;

	now.setDate(now.getDate());
	now2 = now.format('yyyyMMdd');
	
	theApp.prefInfo.set('MonthBuyStepDate', now2);

	this.close(0);

};
