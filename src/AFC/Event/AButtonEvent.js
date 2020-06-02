
/**
 * @author asoocool
 */

function AButtonEvent(acomp)
{
	AEvent.call(this, acomp);
	
}
afc.extendsClass(AButtonEvent, AEvent);


//	overloading functions

AButtonEvent.prototype.actionDownState = function()
{
	this.acomp.changeBtnState(AButton.NORMAL, AButton.TOUCH);
};

AButtonEvent.prototype.actionMoveState = function()
{
	this.acomp.changeBtnState(AButton.TOUCH, AButton.NORMAL);
};

AButtonEvent.prototype.actionUpState = function()
{
	this.acomp.changeBtnState(AButton.TOUCH, AButton.NORMAL);
};

AButtonEvent.prototype.actionCancelState = function()
{
	this.acomp.changeBtnState(AButton.TOUCH, AButton.NORMAL);
};

AButtonEvent.prototype.defaultAction = function()
{
	this._click();
};

//---------------------------------------------------------------------------------------------------
//	Component Event Functions

/*
// click 을 defaultAction 으로 구현했으므로 click 이벤트 함수를 구현하지 않는다. -> 구현시 이벤트 중복 발생
AButtonEvent.prototype.click = function()
{
	this._click();
};
*/
//'drop', 'dragStart', 'dragEnd'


AButtonEvent.prototype.longtab = function()
{
	this._longtab();
};

//---------------------------------------------------------------------------------------------------