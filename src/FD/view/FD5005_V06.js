
/**
Constructor
Do not call Function in Constructor.
*/
function FD5005_V06()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5005_V06, AView);


FD5005_V06.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.fundAcc = this.findCompById('Label9'); //연금 계좌
	this.bankBalance = this.findCompById('Label11')//이체 후 잔액
	this.grid = this.findCompById('Grid1');

	//TODO:edit here

};


FD5005_V06.prototype.onActiveDone = function(reload)
{	
	AView.prototype.onActiveDone.call(this, reload);
	
	
	this.depositAcc = this.viewData.depositAcc //받는 계좌 (투신 계좌)
	this.name = this.viewData.name //예금주
	this.drawAcc =  this.viewData.drawAcc //보내는 계좌(연금 펀드 계좌)
	this.drawMoney = this.viewData.drawMoney //보내는 돈 
	this.totalMoney = this.viewData.totalMoney; //이체 후 잔액
	
	this.fundAcc.setText( PensionCommon.addAccBar(this.drawAcc)) //보내는 계좌 (연금펀드 계좌)
	this.bankBalance.setText(afc.addComma(this.totalMoney)+'원'); //이체 후 잔액 
	this.grid.setCellText(0,1, PensionCommon.addAccBar(this.depositAcc)); //받는 계좌 (투신 계좌)
	this.grid.setCellText(1,1, this.name ); //예금주명
	this.grid.setCellText(2,1, afc.addComma(this.drawMoney)+'원'); //보내는 금액

	
	
};
FD5005_V06.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	
	//메인화면으로 이동 
	theApp.goPageCheck('FD0005', false);

};
