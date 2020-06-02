
/**
 * @author asoocool
 */

function ATextFieldEvent(acomp)
{
	AEvent.call(this, acomp);
	
	this.chkInterval = null;
	this.oldText = '';
}
afc.extendsClass(ATextFieldEvent, AEvent);


ATextFieldEvent.prototype.defaultAction = function()
{
	var atextfield = this.acomp;
	
	//상위로 이벤트를 전달할 필요가 없다.
    this.acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
    {
    	e.stopPropagation();
    });
	
    this._focus();
    this._change();
};

//---------------------------------------------------------------------------------------------------
//	Component Event Functions
//	events: ['change', 'focus', 'blur']

ATextFieldEvent.prototype.blur = function()
{
	this._blur();
};

//---------------------------------------------------------------------------------------------------

ATextFieldEvent.prototype._focus = function()
{
	var thisObj = this;
	var atextfield = this.acomp;
	
	atextfield.$ele.focus(function(e) 
	{
		//텍스트 수정시 포커스가 중간에 있으면 키패드로 삭제 안되는 버그 대응(안드로이드)
		/*
		//4.3 안드로이드 버그 대응
		if(afc.andVer < 4.4)
		{
			setTimeout(function(){ atextfield.setText(atextfield.getText()); }, 1);	
		}
		*/
		
		//if(!afc.isPC) KeyboardManager.inputScrollToCenter(this);
		if(PROJECT_OPTION.bridgeName!='none') KeyboardManager.inputScrollToCenter(this);
		
		
		//타이머로 change 이벤트 처리
		if(atextfield.isTimerChange)
		{
			if(thisObj.chkInterval) clearInterval(thisObj.chkInterval);
			
			thisObj.chkInterval = setInterval(function()
			{
				//화면이 소멸되어 더이상 ATextField 가 유효한 컴포넌트가 아닌 경우
				if(!atextfield.element)
				{
					clearInterval(thisObj.chkInterval);
					thisObj.chkInterval = null;
					return;
				}
				
				thisObj.changeProc();

			}, ATextField.DELAY_TIME);
		}
		
		atextfield.reportEvent('focus', e);
	});
};

ATextFieldEvent.prototype._blur = function()
{
	var thisObj = this;
	var atextfield = this.acomp;
	
	atextfield.$ele.blur(function(e) 
	{
		if(thisObj.chkInterval) 
		{
			clearInterval(thisObj.chkInterval);
			thisObj.chkInterval = null;
		}
		
		atextfield.reportEvent('blur', e);
	});
};

ATextFieldEvent.prototype._change = function()
{
	var thisObj = this;
	
	this.acomp.$ele.bind('keyup', function(e) 
	{
		thisObj.changeProc();
	});
};

ATextFieldEvent.prototype.changeProc = function()
{
	var atextfield = this.acomp;
	//var strText = atextfield.getText();
	var strText = atextfield.element.value;
	
	if(this.oldText != strText)
	{
		if(atextfield.maskVal == afc.MASK_FLOAT)
		{
			strText = strText.replace(/[^0-9\.]/g, '');
			if(strText.length>0)
			{
				var strNumber = strText.split('.');
				if(!strNumber[0]) strNumber[0] = 0;
				strText = parseInt(strNumber[0]).toString();
				if(afc.isAndroid) strText = afc.addComma(strText);
				
				if(strNumber.length > 1)
					strText += ('.'+strNumber[1].slice(0, atextfield.floatLenth));
			}
			
			if(atextfield.maxLen)
			{
				if(strText.length > atextfield.maxLen) 
				{
					strText = strText.substring(0, atextfield.maxLen);
				}
			}
			
			//atextfield.setText(strText);
			atextfield.element.value = strText;
		}
		
		else if(atextfield.maskVal == afc.MASK_MONEY)
		{
			strText = strText.replace(/[^0-9]/g, '');
			if(strText.length>0)
			{
				strText = afc.addComma(parseInt(strText));
			}
			
			if(atextfield.maxLen)
			{
				if(strText.length > atextfield.maxLen) 
				{
					strText = strText.substring(0, atextfield.maxLen);
				}
			}
			
			//atextfield.setText(strText);
			atextfield.element.value = strText;
		}
		
		//else if(atextfield.getDataType() == 'number')
		else
		{
			if(atextfield.maxLen)
			{
				if(strText.length > atextfield.maxLen) 
				{
					strText = strText.substring(0, atextfield.maxLen);
					atextfield.element.value = strText;
				}
			}
		}
		
		this.oldText = strText;
		atextfield.reportEvent('change', strText);
	}
};

