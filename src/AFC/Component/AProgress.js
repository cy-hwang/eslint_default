/**
 * @author cheol
 */

function AProgress()
{
	AComponent.call(this);

    this.value = 0;
   	this.bar = null;
}

afc.extendsClass(AProgress, AComponent);

AProgress.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	this.bar = this.$ele.children();
	this.setValue(0);
};

AProgress.prototype.setValue = function(value)
{
	var prgWidth = this.getWidth();
	value = parseInt(prgWidth*(value/100), 10);
	
	if(value>prgWidth) value = prgWidth;
	else if(value<0) value = 0;
	
	this.bar.css('width', value + 'px');
	this.value = value;
};

AProgress.prototype.getValue = function()
{
	return this.value;
};

