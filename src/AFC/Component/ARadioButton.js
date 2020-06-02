/**
 * @author cheol
 */
function ARadioButton()
{
	AComponent.call(this);

	this.selectClass = 'radiobtn-check';
	this.noSelectClass = 'radiobtn-normal';
	this.isReadOnly = false;
	this.isSelected = false;
	this.isSafeClick = false; //라디오 버튼은 빠르게 터치되도록 열어놓음
}
afc.extendsClass(ARadioButton, AComponent);

ARadioButton.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	this.setSelectStyle(
		this.getAttr('data-style-normal'),
		this.getAttr('data-style-check')
	);
	
};

ARadioButton.prototype.setSelectStyle = function(ncClass, cClass)
{
	if(ncClass) this.noSelectClass = ncClass;
	if(cClass) this.selectClass = cClass;
	if(this.isSelected) this.setSelect(true);
};

ARadioButton.prototype.setSelect = function(check)
{
	this.isSelected = check;
	if(this.selectClass) {
		this.removeClass(this.selectClass);	
		if(this.isSelected) {
			this.addClass(this.selectClass);
		}
	}
	if(this.noSelectClass) {
		this.removeClass(this.noSelectClass);
		if(!this.isSelected) {
			this.addClass(this.noSelectClass);
		}
	}
};

ARadioButton.prototype.getSelect = function()
{
	return this.isSelected;
};

ARadioButton.prototype.setReadOnly = function(isReadOnly)
{
	this.isReadOnly = isReadOnly;
};


ARadioButton.prototype.getText = function()
{
	var ret = this.$ele.text();
	return ret;
};

ARadioButton.prototype.setText = function(text)
{
	this.$ele.text(text);
	return this;
};