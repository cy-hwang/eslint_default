/**
 * @author cheol
 */

function ARadioGroup()
{
	AView.call(this);
	
	this.radioBtns = null;
	this.selectedBtn = null;
}
afc.extendsClass(ARadioGroup, AView);


ARadioGroup.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	//버튼 세팅
	this.radioBtns = this.findCompByClass(afc.ClassName.RADIOBUTTON);
	
	//이벤트 세팅
	for(var i=0;i<this.radioBtns.length;i++)
	{
		this.radioBtns[i].addEventListener('click', this, 'btnClickEvent');
	}
	
	var selectId = this.getAttr(afc.ATTR_DEFAULT);
	if(selectId) 
	{
		var selBtn = this.getRadioBtnById(selectId);
		if(selBtn)
		{
			this.selectedBtn = selBtn;
			this.selectedBtn.setSelect(true);
			this.selectedBtn.setReadOnly(true);
		}
	}
};

ARadioGroup.prototype.btnClickEvent = function(radioBtn, info)
{
	if(this.selectedBtn===radioBtn) return;
	this.setSelectBtn(radioBtn);
	this.reportEvent('change', info);
};

ARadioGroup.prototype.clearAll = function()
{
	//이벤트 세팅
	for(var i=0;i<this.radioBtns.length;i++)
	{
		this.radioBtns[i].setSelect(false);
	}
	this.selectedBtn = null;
};

ARadioGroup.prototype.setSelectBtn = function(radioBtn)
{
	if(this.selectedBtn===radioBtn) return;
	
	if(this.selectedBtn)
	{
		this.selectedBtn.setReadOnly(false);
		this.selectedBtn.setSelect(false);
	}
	
	this.selectedBtn = radioBtn;
	this.selectedBtn.setSelect(true);
	this.selectedBtn.setReadOnly(true);
};

ARadioGroup.prototype.getSelectBtn = function()
{
	return this.selectedBtn;	
};

ARadioGroup.prototype.getRadioBtns = function()
{
	return this.radioBtns;
};

ARadioGroup.prototype.getRadioBtnById = function(id)
{
	for(var i=0;i<this.radioBtns.length;i++)
	{
		if(this.radioBtns[i].getComponentId()==id) return this.radioBtns[i];
	}
	
	return null;
};


