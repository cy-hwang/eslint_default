
/**
 * @author asoocool
 */

function ACheckBoxEvent(acomp)
{
	AEvent.call(this, acomp);
	
}
afc.extendsClass(ACheckBoxEvent, AEvent);



ACheckBoxEvent.prototype.actionUpState = function()
{
	this.acomp.setCheck(!this.acomp.getCheck());
};

ACheckBoxEvent.prototype.defaultAction = function()
{
	this._click();
};




//---------------------------------------------------------------------------------------------------
//	Component Event Functions





//---------------------------------------------------------------------------------------------------