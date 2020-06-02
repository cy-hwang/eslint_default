
/**
Constructor
Do not call Function in Constructor.
*/
function FD5008_L02()
{
	AView.call(this);
}
afc.extendsClass(FD5008_L02, AView);


FD5008_L02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.lblFundOtpName = this.findCompByGroup('listViewGrp')[0];
	this.lblFundKorName = this.findCompByGroup('listViewGrp')[1];
	this.accPwd = null;
};


FD5008_L02.prototype.setData = function(data)
{
	this.lblFundOtpName.setText(data.a2);
	this.lblFundKorName.setText(data.a3);
	this.ifInBlockReserved = data.a4;
	this.ifOutBlock1Reserved = data.a5;
	this.ifOutBlock2Reserved = data.a6;
	this.accPwd = data.a7;
};

FD5008_L02.prototype.onnextBtnClick = function(comp, info)
{
	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	
	// 월정액적립식
	// 2019.06.04.적립식 매수현황 전문이 SOFFQ586에서 SACMQ619로 변경되며
	// 월정액적립식과 일정액적립식 구분변경('D1CMS약정여부==1'->'D1납입방법명=="월정액적립식"')
	
	if(this.ifOutBlock2Reserved['D1납입방법명'] == "월정액적립식"){
		var win = AWindow.createWindow('FD/window/FD5008_W03.lay', 'FD5008W03');
	}else{
	// 매일적립식(자유적립식)
		var win = AWindow.createWindow('FD/window/FD5008_W04.lay', 'FD5008W04');
	}		

	win.inParam = thisObj.ifInBlockReserved;
	win.out1Param = thisObj.ifOutBlock1Reserved;
	win.out2Param = thisObj.ifOutBlock2Reserved;
	win.accPwd = this.accPwd;
	
	win.setWindowOption(
	{
		isModal: true,
		modalBgOption: 'light'
	});

	// 월정액적립식
	// 2019.06.04.적립식 매수현황 전문이 SOFFQ586에서 SACMQ619로 변경되며
	// 월정액적립식과 일정액적립식 구분변경('D1CMS약정여부==1'->'D1납입방법명=="월정액적립식"')
	if(this.ifOutBlock2Reserved['D1납입방법명'] == "월정액적립식"){
		win.openAsDialog(this, '100%', '100%');	
	}else{
	// 매일적립식(자유적립식)
		win.openAsDialog(this);	
	}
};


FD5008_L02.prototype.onWindowResult = function(result, awindow)
{

		//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();		
	var winId = awindow.getId();
	
	if(winId == 'FD5008W04')
	{
		if(result) {
			cont.fnDoSendDataManage();
		}
	}
};
