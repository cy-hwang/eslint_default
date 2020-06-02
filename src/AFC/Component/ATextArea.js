/**
 * @author asoocool
 */

function ATextArea()
{
	AComponent.call(this);
	
	this.isTimerChange = false;
}
afc.extendsClass(ATextArea, AComponent);

ATextArea.DELAY_TIME = 200;

ATextArea.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	//this.$ele.attr('data-role', 'none');
	
	if(this.$ele.attr('disabled')) this.enable(false);
};

ATextArea.prototype.enable = function(isEnable)
{
	this.isEnable = isEnable;
	
	if(isEnable) 
	{
		var thisObj = this;
		setTimeout(function() { thisObj.$ele.css('pointer-events', 'auto'); }, afc.DISABLE_TIME-100);
	}
	else this.$ele.css('pointer-events', 'none');
};

ATextArea.prototype.enableTimerChange = function(enable)
{
	this.isTimerChange = enable;
};


ATextArea.prototype.setPlaceHolder = function(placeholder)
{
	this.setAttr('placeholder', placeholder);
};

ATextArea.prototype.getPlaceHolder = function()
{
	return this.getAttr('placeholder');
};
/*
ATextArea.prototype.setText = function(text)
{
	this.$ele.html(text);
};
*/
ATextArea.prototype.setText = function(text)
{
	this.$ele.val(text);
};
/*
ATextArea.prototype.getText = function()
{
	return this.$ele.text();
};
*/
ATextArea.prototype.getText = function()
{
	return this.$ele.val();
};

ATextArea.prototype.setTextAlign = function(align)
{
	this.setStyle('textAlign', align);
};

ATextArea.prototype.getTextAlign = function()
{
	return this.getStyle('textAlign');
};

ATextArea.prototype.setPadding = function(padding)
{
	this.setStyle('padding', parseInt(padding, 10)+'px');
};

ATextArea.prototype.getPadding = function()
{
	return this.getStyle('padding');
};

ATextArea.prototype.setReadOnly = function(isReadOnly)
{
    if(isReadOnly) this.$ele.attr('readonly', isReadOnly);
    else this.$ele.removeAttr('readonly');
};


ATextArea.prototype.setQueryData = function(dataArr, keyArr)
{
	if(!keyArr) return;
	
	var value = dataArr[0][keyArr[0]];
	
	if(value == undefined) return;
	
	this.setText(value);
};

ATextArea.prototype.getQueryData = function(dataArr, keyArr)
{
	if(!keyArr) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getText();
};

ATextArea.prototype.isScroll = function()
{
	return (this.element.offsetHeight < this.element.scrollHeight);
};
