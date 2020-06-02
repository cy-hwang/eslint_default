
/**
Constructor
Do not call Function in Constructor.
*/
function FD5007_L03()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5007_L03, AView);


FD5007_L03.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	this.grid1 = this.findCompByGroup('GridGrup')[0];
};

FD5007_L03.prototype.setData = function(data)
{
	
	this.grid1.setHeaderCellText(0,1, data.a1+"년");
	this.grid1.setCellText(0,1, afc.addComma(data.a2));
	this.grid1.setCellText(1,1, afc.addComma(data.a3));
	this.grid1.setCellText(2,1, afc.addComma(data.a4));
	this.grid1.setCellText(3,1, afc.addComma(data.a5));
	this.grid1.setCellText(4,1, afc.addComma(data.a6));
	
};
