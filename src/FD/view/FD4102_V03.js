
/**
Constructor
Do not call Function in Constructor.
*/
function FD4102_V03()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD4102_V03, AView);


FD4102_V03.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.color = this.findCompByGroup('B')[0];
	this.name = this.findCompByGroup('B')[1];
	this.amount = this.findCompByGroup('B')[2];
	//TODO:edit here

};

FD4102_V03.prototype.setData = function(data)
{
	this.data = data;
	
	this.color.setStyle('background-color', data['color']);
	this.name.setText(data['name']);
	
	if(data['data'] == 0) {
		this.amount.setText('0%');
	} else if(data['data'] == 100) {
		this.amount.setText('100%');
	} else {
		this.amount.setText(afc.floor2Per(data['data']));
	}
	this.$ele.height(this.name.$ele.height());
	this.$ele.css('margin-bottom', '26px');
};
