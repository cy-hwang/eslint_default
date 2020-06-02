
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_L01()
{
	AView.call(this);

}
afc.extendsClass(MS1005_L01, AView);


MS1005_L01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.label = this.findCompByGroup('Gp')[0];
};

MS1005_L01.prototype.setData = function(data)
{
	this.data = data;
	this.label.setText(data[1]);
};


MS1005_L01.prototype.onBankRowClick = function(comp, info)
{
	this.getContainer().close(this.data);
};
