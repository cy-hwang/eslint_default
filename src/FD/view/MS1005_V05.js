
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_V05()
{
	AView.call(this);

}
afc.extendsClass(MS1005_V05, AView);


MS1005_V05.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
};

MS1005_V05.prototype.onPhotoBtnClick = function(comp, info)
{
	comp.parent.parent.parent.owner.parent.parent.OpenOCR();
};
