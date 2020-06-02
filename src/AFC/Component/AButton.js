/**
 * @author asoocool
 */

//-----------------------------------------------------------------------------------------
//  AButton class
//-----------------------------------------------------------------------------------------

/*	코딩으로 객체를 생성할 때 에러남...차후 수정하기
if(!window.AButton)
{

AButton = 
*/
function AButton()
{
	AComponent.call(this);

	this.txtColors = ['','',''];
	this.bgColors = ['','',''];
   	this.bgImages = ['','',''];
   	this.btnStyles = ['','',''];
   	
    //this.isStyleOver = true;
    this.isStyleOver = false;
    
    this.isSafeClick = true;
};
afc.extendsClass(AButton, AComponent);


AButton.NORMAL = 0;
AButton.TOUCH = 1;
AButton.DISABLE = 2;

AButton.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	//편집기에서 마지막으로 설정한 버튼 상태의 클래스를 제거하기 위함.
	var attrArr = this.getAttr(afc.ATTR_STYLE);
	if(attrArr) this.removeClass(attrArr.split('|')[this.getAttr('data-state')]);
	this.removeClass('AButton-'+afc.BTN_STATE[this.getAttr('data-state')]);
	
	//html 저장시, background-size 가 '100% 100%' 에서 '100%' 로 변하는 버그때문에...
	//if($.trim(this.getStyle('background-size'))=='100%') 
	//	this.setStyle('background-size', '100% 100%');
	
	attrArr = this.getAttr(afc.ATTR_COLOR);
	if(attrArr) this.setTextColor(attrArr.split('|'));
	
	attrArr = this.getAttr(afc.ATTR_BGCOLOR);
	if(attrArr) this.setBGColor(attrArr.split('|'));
	
	attrArr = this.getAttr(afc.ATTR_BGIMAGE);
	if(attrArr)
	{
		this.setBGImage(attrArr.split('|'));
		//comp.css로 옮김
		//this.setStyle('background-size', '100% 100%');
	}
	
	attrArr = this.getAttr(afc.ATTR_STYLE);
	if(attrArr) this.setBtnStyle(attrArr.split('|'));
	
	this.changeBtnState(-1, AButton.NORMAL);
	
	this.isSafeClick = !this.getAttr('data-speed-button');
};

AButton.prototype.setText = function(text)
{
	if(this.$ele)
	{
		this.$ele.text(text);
		if(this.shrinkInfo) this.autoShrink(this.shrinkInfo);
	}
};

AButton.prototype.getText = function()
{
	return this.$ele.text();
};

AButton.prototype.setTextColor = function(colors)
{
	this.txtColors = colors;
};

AButton.prototype.setBGColor = function(colors)
{
	this.bgColors = colors;
};

AButton.prototype.setBGImage = function(images)
{
	this.bgImages = images;
};

AButton.prototype.setBtnStyle = function(styles)
{
	if(this.btnStyles)
	{
		this.removeClass(this.btnStyles[0]);
		this.removeClass(this.btnStyles[1]);
		this.removeClass(this.btnStyles[2]);
	}
	
	this.btnStyles = styles;
};

AButton.prototype.changeBtnState = function(oldState, newState)
{
	this.setStyle('color', this.txtColors[newState]);
	this.setStyle('background-color', this.bgColors[newState]);
	this.setStyle('background-image', this.bgImages[newState]);
	
	/*
	if(this.txtColors[newState]) this.element.style.setProperty('color', this.txtColors[newState], 'important');
	if(this.bgColors[newState]) this.element.style.setProperty('background-color', this.bgColors[newState], 'important');
	
	if(this.bgImages[newState]) this.element.style.setProperty('background-image', this.bgImages[newState], 'important');
	else this.element.style.setProperty('background-image', '', 'important');
	*/
	
	//최초 초기화 하는 경우
	if(oldState<0)
	{
		if(this.btnStyles[newState]) this.addClass(this.btnStyles[newState]);
		this.addClass('AButton-'+afc.BTN_STATE[newState]);
	}
	else
	{
		if(this.isStyleOver)
		{
			if(oldState>AButton.NORMAL && this.btnStyles[oldState]) this.removeClass(this.btnStyles[oldState]);
			if(newState>AButton.NORMAL && this.btnStyles[newState]) this.addClass(this.btnStyles[newState]);
		}
		else
		{
			if(this.btnStyles[oldState]) this.removeClass(this.btnStyles[oldState]);
			if(this.btnStyles[newState]) this.addClass(this.btnStyles[newState]);
			
		}
		
		this.removeClass('AButton-'+afc.BTN_STATE[oldState]);
		this.addClass('AButton-'+afc.BTN_STATE[newState]);
	}
};

AButton.prototype.enable = function(isEnable)
{
	AComponent.prototype.enable.call(this, isEnable);
	
   	if(isEnable) this.changeBtnState(AButton.DISABLE, AButton.NORMAL);
   	else this.changeBtnState(AButton.NORMAL, AButton.DISABLE);
};

//}
/* old version
AButton.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	var inner = this.$ele.children();
	inner.width(this.getWidth());
	inner.height(this.getHeight());
};

AButton.prototype.setWidth = function(w)
{
	AComponent.prototype.setWidth.call(this, w);
	
	this.$ele.children().width(this.getWidth());
};

AButton.prototype.setHeight = function(h)
{
	AComponent.prototype.setHeight.call(this, h);
	
	this.$ele.children().height(this.getHeight());
};
*/
