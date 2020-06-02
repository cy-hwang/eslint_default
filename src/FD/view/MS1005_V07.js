
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_V07()
{
	AView.call(this);

}
afc.extendsClass(MS1005_V07, AView);


MS1005_V07.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
};

MS1005_V07.prototype.onPhotoBtnClick = function(comp, info)
{
	comp.parent.parent.parent.owner.parent.parent.startVR();
};
