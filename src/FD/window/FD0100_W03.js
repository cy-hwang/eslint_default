
/**
Constructor
Do not call Function in Constructor.
*/
function FD0100_W03()
{
	BaseWindow.call(this);
	
	this.winType = 'full';
}
afc.extendsClass(FD0100_W03, BaseWindow);


FD0100_W03.prototype.onReady = function()
{
	this.baseW = this.view.$ele.width();
	
	this.view4 = this.findCompById('View4');
	
	this.titleLbl = this.findCompById('TitleLbl');
	this.closeBtn = this.findCompById('CloseBtn');
	
	this.titleLbl.setPos({left: (this.baseW / 2) - (this.titleLbl.getWidth() / 2), top:0});
	this.closeBtn.setPos({left: this.baseW - this.closeBtn.getWidth(), top:0});
	
	this.view4.viewLoad('FD/view/FD0100_T01.lay');
	
	BaseWindow.prototype.onReady.call(this);
	/*
	this.frame.anima({x:this.baseW, width:0});
	this.frame.anima({x:0, width:this.baseW}, 500);
	*/
};

FD0100_W03.prototype.onCloseBtnClick = function(comp, info)
{
	this.close();
};

