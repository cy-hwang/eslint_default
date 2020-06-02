
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_L02()
{
	AView.call(this);

}
afc.extendsClass(FD3202_L02, AView);


FD3202_L02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.label = this.findCompByGroup('Gp')[0];
};

FD3202_L02.prototype.setData = function(data)
{
	this.data = data;
	this.label.setText(data[1]);
};


FD3202_L02.prototype.onBankRowClick = function(comp, info)
{
	this.getContainer().close(this.data);
};
