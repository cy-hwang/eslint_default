
/**
Constructor
Do not call Function in Constructor.
*/
function FD0000_L01()
{
	AView.call(this);

	this.label = null;
	this.contentView = false;
}
afc.extendsClass(FD0000_L01, AView);


FD0000_L01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.label = this.findCompByGroup('NoticeGrp')[0];
	//this.contentView = this.findCompByGroup('NoticeGrp')[0];
};
