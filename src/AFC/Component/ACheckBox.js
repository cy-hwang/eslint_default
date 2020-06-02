
function ACheckBox()
{
	AComponent.call(this);

	this.CheckedBg = 'checkbox-check';
	this.noCheckedBg = 'checkbox-normal';
	this.isReadOnly = false;
	this.isChecked = false;
	this.isSafeClick = false; //체크박스는 빠르게 터치되도록 열어놓음
}
afc.extendsClass(ACheckBox, AComponent);

ACheckBox.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	this.setCheckStyle(
		this.getAttr('data-style-check'),
		this.getAttr('data-style-normal')
	);
	
	this.setCheck(false);
};

ACheckBox.prototype.setCheckStyle = function(cBg, ncBg)
{
	if(cBg) this.CheckedBg = cBg;
	if(ncBg) this.noCheckedBg= ncBg;
	
	if(this.isChecked) this.setCheck(true);
};

ACheckBox.prototype.setCheck = function(check)
{
	if(this.isReadOnly) return;
	
	this.isChecked = check;
	
    if(this.CheckedBg && this.noCheckedBg)
    {
        if(this.isChecked)
        {
            this.removeClass(this.noCheckedBg);
            this.addClass(this.CheckedBg);
        }
        else
        {
            this.removeClass(this.CheckedBg);
            this.addClass(this.noCheckedBg);  
        } 
    }
};

ACheckBox.prototype.getCheck = function()
{
	return this.isChecked;
};

ACheckBox.prototype.setReadOnly = function(isReadOnly)
{
	this.isReadOnly = isReadOnly;
};

ACheckBox.prototype.setText = function(text)
{
	this.$ele.text(text);
};