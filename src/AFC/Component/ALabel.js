/**
 * @author asoocool
 */


function ALabel()
{
	AComponent.call(this);

	//mask, color 관련 정보 배열
	this.mask = afc.returnAsIt;
	this.maskArg = null;
	
	this.data = '';
}
afc.extendsClass(ALabel, AComponent);

ALabel.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	var mask = this.$ele.attr('data-maskdata');
	if(mask) this.mask = AComponent.MASK[parseInt(mask, 10)];
	
	//this.loadMaskInfo();
};

ALabel.prototype.loadMaskInfo = function()
{
	var maskInfo = this.getAttr(afc.ATTR_MASK);
	if(maskInfo) this.setMaskInfo([maskInfo]);
};

//AComponent - setStyle Override
ALabel.prototype.setStyle = function(key, value)
{
	if(this.element.children[0]) this.element.children[0].style[key] = value;
};

ALabel.prototype.autoShrink = function(info) 
{
	this.$ele.children().autoShrink(info);
};

ALabel.prototype.setText = function(text)
{	
	this.data = text;
	text = this.mask(text);
	
   	this.$ele.children().text(text);
	
	if(this.shrinkInfo) this.autoShrink(this.shrinkInfo);
	
	//4.3 안드로이드 버그 대응
	if(afc.andVer<4.4)
	{
		if(!text)
		{
			this.show(AComponent.INVISIBLE);
			this.show(AComponent.VISIBLE);
		}
	}
};

ALabel.prototype.getText = function()
{
	var ret = this.$ele.children().text();
	return ret;
};

ALabel.prototype.getOriginText = function()
{
	return this.data;
};

ALabel.prototype.setTextColor = function(color)
{
	this.setStyle('color', color);
};

ALabel.prototype.getTextColor = function()
{
	return this.getStyle('color');
};

ALabel.prototype.setTextSize = function(size)
{
	this.setStyle('fontSize', parseInt(size, 10)+'px');
};

ALabel.prototype.getTextSize = function()
{
	return this.getStyle('fontSize');
};

ALabel.prototype.setTextAlign = function(align)
{
	this.setStyle('textAlign', align);
};

ALabel.prototype.getTextAlign = function()
{
	return this.getStyle('textAlign');
};

ALabel.prototype.setLineHeight = function(lineHeight)
{
	this.setStyle('lineHeight', lineHeight);
};

ALabel.prototype.getLineHeight = function()
{
	return this.getStyle('lineHeight');
};

ALabel.prototype.addClass = function(className)
{
	this.$ele.children().addClass(className);
};

ALabel.prototype.removeClass = function(className)
{
	this.$ele.children().removeClass(className);
};

// [ "0|D1기준가" ]
ALabel.prototype.setMaskInfo = function(arr)
{
	if(typeof(arr[0]) == 'function') this.mask = arr[0];
	else
	{
		//arr = arr[0].toString().split('|');
		if(AComponent.MASK[arr[0]]) this.mask = AComponent.MASK[arr[0]];
		else this.mask = eval(arr[0]);
		//this.maskArg = arr[1];
	}
	
};

ALabel.prototype.resetMaskInfo = function()
{
	this.mask = afc.returnAsIt;
};


ALabel.prototype.setQueryData = function(dataArr, keyArr)
{
	if(!keyArr) return;
	if(dataArr.length==0) return;
	
	//리얼컴포넌트로 등록되면 
	//리얼데이터 수신 시 매핑되지 않은 데이터도 들어온다.	
	var value = dataArr[0][keyArr[0]];
	if(value==undefined) return;
	
	this.setText(value);
};

ALabel.prototype.getQueryData = function(dataArr, keyArr)
{
	if(!keyArr) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getText();
};

/*
ALabel.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	var inner = this.$ele.children();
	inner.width(this.getWidth());
	inner.height(this.getHeight());
};

ALabel.prototype.setWidth = function(w)
{
	AComponent.prototype.setWidth.call(this, w);
	
	this.$ele.children().width(this.getWidth());
};

ALabel.prototype.setHeight = function(h)
{
	AComponent.prototype.setHeight.call(this, h);
	
	this.$ele.children().height(this.getHeight());
};
*/




