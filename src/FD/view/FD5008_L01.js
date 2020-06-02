/**
Constructor
Do not call Function in Constructor.

오늘의 주문내역에서만 사용
*/
function FD5008_L01()
{
	AView.call(this);

	this.sellFundInfo = null;

}
afc.extendsClass(FD5008_L01, AView);


FD5008_L01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.lblFundOtpName = this.findCompByGroup('listViewGrp')[0];
	this.lblFundCancel = this.findCompByGroup('listViewGrp')[1];
	this.lblFundKorName = this.findCompByGroup('listViewGrp')[2];
	
	this.lblFundCancel.show(AComponent.VISIBLE);
};


FD5008_L01.prototype.setData = function(data)
{		
	this.lblFundOtpName.setText(data.a2);
	this.lblFundKorName.setText(data.a3);
	
	this.sellFundInfo = (data.a4);
	
	this.txtPw = (data.a5);
	this.ifReserved = data.a6;
	
	
	if(this.sellFundInfo["D1취소여부"] == "1") {
		this.lblFundCancel.setText("취소완료");
	} else {
		this.lblFundCancel.setText("정상");
	}

};


FD5008_L01.prototype.onnextBtnClick = function(comp, info)
{

	//TODO:edit here
	
	/*var thisObj = this;
	var cont = thisObj.getContainer();
	
	cont.fundSellInfo = thisObj.sellFundInfo;*/
	
	
	var win = AWindow.createWindow('FD/window/FD5008_W02.lay', 'FD5008W02');		

	win.fundInfo = this.sellFundInfo;
	win.txtPw = this.txtPw;
	win.ifReserved = this.ifReserved;
	win.openAsDialog(this, '100%', '100%');	
	
};

FD5008_L01.prototype.onWindowResult = function(result, windowObj)
{
	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
			
	if(windowObj.containerId == 'FD5008W02')
	{
		if(result)
		{
			cont.fnDoSendDataManage();
		}
	}
};