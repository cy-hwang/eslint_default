
/**
Constructor
Do not call Function in Constructor.
*/
function FD3203_L03()
{
	AView.call(this);
}
afc.extendsClass(FD3203_L03, AView);


FD3203_L03.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.lblFundOtpName = this.findCompByGroup('listViewGrp')[0];
	this.lblFundKorName = this.findCompByGroup('listViewGrp')[1];
};


FD3203_L03.prototype.setData = function(data)
{
	this.lblFundOtpName.setText(data.a2);
	this.lblFundKorName.setText(data.a3);
	this.ifInBlockReserved = data.a4;
	this.ifOutBlock1Reserved = data.a5;
	this.ifOutBlock2Reserved = data.a6;
};

FD3203_L03.prototype.onnextBtnClick = function(comp, info)
{
	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	//이체내역 상세 윈도우 화면 팝업
	var win = AWindow.createWindow('FD/window/FD1201_W03.lay', 'FD1201W03');		

	win.inParam = thisObj.ifInBlockReserved;
	win.out1Param = thisObj.ifOutBlock1Reserved;
	win.out2Param = thisObj.ifOutBlock2Reserved;
	
	win.setWindowOption(
	{
		isModal: true,
		modalBgOption: 'light'
	});

	win.openAsDialog(this, '100%', '100%');	
};
