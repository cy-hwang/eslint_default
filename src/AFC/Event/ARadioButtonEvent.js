
/**
 * @author asoocool
 */

function ARadioButtonEvent(acomp)
{
	AEvent.call(this, acomp);
	
}
afc.extendsClass(ARadioButtonEvent, AEvent);



//	overloading functions

ARadioButtonEvent.prototype.actionUpState = function()
{
	this.acomp.setSelect(true);
};

ARadioButtonEvent.prototype.defaultAction = function()
{
	this._click();
};



//---------------------------------------------------------------------------------------------------
//	Component Event Functions





//---------------------------------------------------------------------------------------------------