/**
 * @author asoocool
 */

function ATextField()
{
	AComponent.call(this);
	
	this.maskVal = afc.MASK_NONE;
	this.maxLen = null;
	this.floatLenth = 2;
	this.isTimerChange = false;
	
}
afc.extendsClass(ATextField, AComponent);

ATextField.DELAY_TIME = 200;
//if(afc.andVer<4.1) ATextField.DELAY_TIME = 500;

ATextField.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	var mask = this.$ele.attr('data-maskdata');
	if(mask) this.maskVal = parseInt(mask, 10);
	
	this.maxLen = this.$ele.attr('max-length');
	if(this.maxLen) this.$ele.attr('maxlength', this.maxLen);
	
	if(this.$ele.attr('disabled')) this.enable(false);

	this.setPatternByType();
	
	//if(!this.element.preventEvent) ATextFieldEvent.implement(this);
};

ATextField.prototype.enableTimerChange = function(enable)
{
	this.isTimerChange = enable;
};

ATextField.prototype.setDataType = function(dataType)
{
	this.setAttr('type', dataType);
};

ATextField.prototype.getDataType = function()
{
	return this.getAttr('type');
};

ATextField.prototype.setPadOption = function(padOption)
{
	this.padOption = padOption;
};

ATextField.prototype.setMask = function(maskVal)
{
	this.maskVal = maskVal;
	this.setPatternByType();
};

ATextField.prototype.setPatternByType = function()
{
	if(this.maskVal == afc.MASK_MONEY)
	{
		this.setAttr('type', 'tel');
		this.setAttr('pattern', '[0-9]*');
	}
	else if(this.maskVal == afc.MASK_FLOAT)
	{
		this.setAttr('type', afc.isIos ? 'number' : 'tel');
		this.setAttr('pattern', '');
	}
	else
	{
		//안드로이드-아이폰 type 대응
		var type = this.getAttr('type');
		if(type == 'number') this.setAttr('pattern', '[0-9]*');
		else this.setAttr('pattern', '');
	}
};


ATextField.prototype.setText = function(value)
{
	if(this.maskVal==afc.MASK_MONEY) this.element.value = afc.addComma(value);
	else this.element.value = value;
	
	//4.3 안드로이드 버그 대응
	if(afc.andVer<4.4)
	{
		if(!value)
		{
			this.show(AComponent.INVISIBLE);
			this.show(AComponent.VISIBLE);
		}
	}	
};

ATextField.prototype.getText = function()
{
	if(this.maskVal==afc.MASK_MONEY) return afc.removeComma(this.element.value);
	else return this.element.value;
};

ATextField.prototype.setTextAlign = function(align)
{
	this.setStyle('textAlign', align);
};

ATextField.prototype.setReadOnly = function(isReadOnly)
{
    if(isReadOnly) this.$ele.attr('readonly', isReadOnly);
    else this.$ele.removeAttr('readonly');
};

ATextField.prototype.getTextAlign = function()
{
	return this.getStyle('textAlign');
};

ATextField.prototype.setPadding = function(padding)
{
	this.setStyle('padding', parseInt(padding, 10)+'px');
};

ATextField.prototype.getPadding = function()
{
	return this.getStyle('padding');
};

ATextField.prototype.enable = function(isEnable)
{
	this.isEnable = isEnable;
	
	if(this.isEnable) 
	{
		var thisObj = this;
		setTimeout(function() { thisObj.$ele.removeAttr('disabled'); }, afc.DISABLE_TIME-100);
	}
	else this.$ele.attr('disabled', 'disabled');
};

ATextField.prototype.setQueryData = function(dataArr, keyArr)
{
	if(!keyArr) return;
	
	var value = dataArr[0][keyArr[0]];
	
	if(value == undefined) return;
	
	this.setText(value);
	
};

ATextField.prototype.getQueryData = function(dataArr, keyArr)
{
	if(!keyArr) return;
	
	//생성되어져 있는 객체에 셋팅하는 구조
	var data = dataArr[0];
	data[keyArr[0]] = this.getText();
	
	/*
	//객체를 생성해 추가하는 구조
	var obj = {};
	obj[keyArr[0]] = this.getText();
	dataArr.push(obj);
	*/
};









