
/**
 * @author asoocool
 */

function ASwitchButtonEvent(acomp)
{
	AEvent.call(this, acomp);
	
}
afc.extendsClass(ASwitchButtonEvent, AEvent);


ASwitchButtonEvent.prototype.actionUpState = function()
{
	this.acomp.setValue(!this.acomp.getValue());
};

ASwitchButtonEvent.prototype.defaultAction = function()
{
	this._click('change');
};


//---------------------------------------------------------------------------------------------------
//	Component Event Functions


