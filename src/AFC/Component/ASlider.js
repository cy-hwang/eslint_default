/**
 * @author cheol
 */
/*
function ASlider()
{
	AComponent.call(this);
	
}
afc.extendsClass(ASlider, AComponent);

ASlider.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

};

ASlider.prototype.getValue = function() { return this.element.value; };
ASlider.prototype.getMax = function() { return this.getAttr('max'); };
ASlider.prototype.getMin = function() { return this.getAttr('min'); };
ASlider.prototype.getStep = function() { return this.getAttr('step'); };

ASlider.prototype.setValue = function(value) { this.element.value = value; };
ASlider.prototype.setMax = function(max) { this.setAttr('max', max); };
ASlider.prototype.setMin = function(min) { this.setAttr('min', min); };
ASlider.prototype.setStep = function(step) { this.setAttr('step', step); };
*/


if(!window.ASlider)
{
	
ASlider = function()
{
	AComponent.call(this);
		
};
afc.extendsClass(ASlider, AComponent);

ASlider.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
};
	
ASlider.prototype.getValue = function() { return this.element.value; };
ASlider.prototype.getMax = function() { return this.getAttr('max'); };
ASlider.prototype.getMin = function() { return this.getAttr('min'); };
ASlider.prototype.getStep = function() { return this.getAttr('step'); };
	
ASlider.prototype.setValue = function(value) { this.element.value = value; };
ASlider.prototype.setMax = function(max) { this.setAttr('max', max); };
ASlider.prototype.setMin = function(min) { this.setAttr('min', min); };
ASlider.prototype.setStep = function(step) { this.setAttr('step', step); };

}
