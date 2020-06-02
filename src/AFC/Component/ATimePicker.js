/**
 * @author asoocool
 */

function ATimePicker()
{
	AComponent.call(this);
}

afc.extendsClass(ATimePicker, AComponent);

ATimePicker.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	ATimePickerEvent.implement(this);
};

ATimePicker.prototype.setDataType = function(dataType)
{
	this.setAttr('type', dataType);
};

ATimePicker.prototype.getDataType = function()
{
	return this.getAttr('type');
};

ATimePicker.prototype.setValue = function(value)
{
	this.element.value = value;
};

ATimePicker.prototype.getValue = function()
{
	return this.element.value;
};

ATimePicker.prototype.setTextAlign = function(align)
{
	this.setStyle('textAlign', align);
};

ATimePicker.prototype.getTextAlign = function()
{
	return this.getStyle('textAlign');
};

ATimePicker.prototype.setPadding = function(padding)
{
	this.setStyle('padding', parseInt(padding, 10)+'px');
};

ATimePicker.prototype.getPadding = function()
{
	return this.getStyle('padding');
};
