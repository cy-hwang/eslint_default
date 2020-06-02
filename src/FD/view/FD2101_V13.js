/**
Constructor
Do not call Function in Constructor.
*/
function FD2101_V13()
{
	AView.call(this);
	//TODO:edit here
	//출금잔금세팅
	this.drawAccNum     = "";   
	this.depositAccAmt  = ""; 	
	this.grid = null;
}
afc.extendsClass(FD2101_V13, AView);

FD2101_V13.prototype.init = function(context, evtListener)
{	
	AView.prototype.init.call(this, context, evtListener);
	
	//TODO:edit here
	this.cnt = this.getContainer();
	
	this.drawAccNum = this.findCompById("Label8");		//종합계좌(출금계좌)
	this.depositAccAmt = this.findCompById('Label9'); 	//이체후잔액
	this.grid = this.findCompById("Grid1");
};

FD2101_V13.prototype.onWillActive = function(reload)
{	
	this.grid.setCellText(0,1,this.cnt.depositAccNum1);
	this.grid.setCellText(1,1,this.cnt.depositBankNm1);
	this.grid.setCellText(2,1,this.cnt.depositAccNm1);
	this.grid.setCellText(3,1,afc.addComma(this.cnt.drawAmt1)+' 원');
	
	//계좌번호 mask set
	var acc = theApp.systemInfo.makeAccNumber(this.cnt.drawAccNum1);
	
	//이체후잔액 mask set
	var accAmt = afc.addComma(this.cnt.depositAccAmt1)+' 원';
	
	this.drawAccNum.setText(acc);
	this.depositAccAmt.setText(accAmt);
}

FD2101_V13.prototype.onButton1Click = function(comp, info)
{	
	//TODO:edit here
	//처음단계로 탭변경
	//this.cnt.tbvManager.getActiveView().tvManager.changeTab('TabBtn1');
	//메인페이지로
	theApp.goPageCheck('FD0002');
};

