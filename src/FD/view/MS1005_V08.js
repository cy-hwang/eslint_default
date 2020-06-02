
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_V08()
{
	AView.call(this);

}
afc.extendsClass(MS1005_V08, AView);


MS1005_V08.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
};


MS1005_V08.prototype.startShowRP = function()
{
	this.vrView = this.findCompById('View2');
	VRManager.showRP(this.vrView.$ele);
};

MS1005_V08.prototype.startEndRP = function()
{
	VRManager.endRP();
};

MS1005_V08.prototype.onPhotoBtnClick = function(comp, info)
{
	this.startEndRP();
	comp.parent.parent.parent.owner.parent.parent.startVR();
};
