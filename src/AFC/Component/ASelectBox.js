/**
 * @author asoocool
 */
//ASelectBox 컴포넌트에서 Item은 option태그를 사용

function ASelectBox()
{
	AComponent.call(this);
}
afc.extendsClass(ASelectBox, AComponent);


ASelectBox.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
};

ASelectBox.prototype.addItem = function(text, value)
{
	var newIndex = this.element.options.length;
	this.element.options[newIndex] = new Option(text, value);
	this.element.options[newIndex].data = value;
};

ASelectBox.prototype.removeItem = function(index)
{
	this.element.remove(index);	
};

ASelectBox.prototype.removeAll = function()
{
	$(this.element).children().remove();	
};

ASelectBox.prototype.setItemData = function(index, data)
{
	this.element.options[index].data = data;
};

ASelectBox.prototype.getItemData = function(index)
{
	return this.element.options[index].data;
};

ASelectBox.prototype.getItem = function(index)
{
	return this.element.options[index];
};

ASelectBox.prototype.selectItem = function(index)
{
	this.element.selectedIndex = index;
};

ASelectBox.prototype.getSelectedItem = function()
{
	return this.getItem(this.element.selectedIndex);
};

ASelectBox.prototype.getSelectedItemData = function()
{
	return this.getItemData(this.element.selectedIndex);
};

ASelectBox.prototype.indexOfData = function(data)
{
	for(var i=0; i<this.element.options.length; i++)
	{
		if(this.element.options[i].data==data) return i;
	}
	
	return -1;
};

ASelectBox.prototype.selectItemByData = function(data)
{
	this.selectItem(this.indexOfData(data));
};


ASelectBox.prototype.setTextAlign = function(align)
{
	this.setStyle('textAlign', align);
};

ASelectBox.prototype.getTextAlign = function()
{
	return this.getStyle('textAlign');
};

ASelectBox.prototype.setPadding = function(padding)
{
	this.setStyle('padding', parseInt(padding, 10)+'px');
};

ASelectBox.prototype.getPadding = function()
{
	return this.getStyle('padding');
};

