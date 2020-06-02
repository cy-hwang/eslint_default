/**
 * @author lee
 */

function ASwitchButton()
{
	AComponent.call(this);

	this.backOnStyle = 'switch-back-on';
	this.backOffStyle = 'switch-back-off';
	this.barOnStyle = 'switch-bar-on';
	this.barOffStyle = 'switch-bar-off';
	
	this.barEl = null;     //바 버튼 돔객체
	
	this.textArr = null;
	this.isOn = false;
}

afc.extendsClass(ASwitchButton, AComponent);

ASwitchButton.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	this.barEl = this.$ele.children().eq(0);

	this.setSwitchStyle(
		this.getAttr('data-back-on'),
		this.getAttr('data-back-off'),
		this.getAttr('data-bar-on'),
        this.getAttr('data-bar-off')
	);
	
	if(this.getAttr('data-bar-text'))
		this.textArr = this.getAttr('data-bar-text').split('|');	
};

ASwitchButton.prototype.setSwitchStyle = function(backOnStyle, backOffStyle, barOnStyle, barOffStyle)
{
	if(backOnStyle) this.backOnStyle = backOnStyle;
	if(backOffStyle) this.backOffStyle = backOffStyle;
	if(barOnStyle) this.barOnStyle = barOnStyle;
	if(barOffStyle) this.barOffStyle = barOffStyle;
	
	if(this.isOn) this.setOn(true);
};

ASwitchButton.prototype.getValue = function()
{
	return this.isOn;
};

ASwitchButton.prototype.setValue = function(isOn)
{
	this.isOn = isOn;
	
    if(this.isOn)
    {
        this.removeClass(this.backOffStyle);
        this.barEl.removeClass(this.barOffStyle);
        
        this.addClass(this.backOnStyle);
        this.barEl.addClass(this.barOnStyle);
        
        if(this.textArr) this.barEl.text(this.textArr[1]);
    }
    else
    {
        this.removeClass(this.backOnStyle);
        this.barEl.removeClass(this.barOnStyle);
        
        this.addClass(this.backOffStyle);
        this.barEl.addClass(this.barOffStyle);
        
        if(this.textArr) this.barEl.text(this.textArr[0]);  
    } 
};

