
/**
Constructor
Do not call Function in Constructor.
*/
function FD3203_L01()
{
	AView.call(this);

	//TODO:edit here
	
	this.sellFundInfo = null;

}
afc.extendsClass(FD3203_L01, AView);


FD3203_L01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.cont = this.getContainer();
	
	this.lblFundOtpName = this.findCompByGroup('listViewGrp')[0];
	this.lblFundCancel = this.findCompByGroup('listViewGrp')[1];
	this.lblFundKorName = this.findCompByGroup('listViewGrp')[2];
	
	this.lblFundCancel.show(AComponent.GONE);
	/*
	if(this.getContainer().containerId == "FD1201") {
		this.lblFundCancel.show(AComponent.VISIBLE);
	} else {
		this.lblFundCancel.show(AComponent.GONE);
	}
	*/
};


FD3203_L01.prototype.setData = function(data)
{		
	
	this.lblFundOtpName.setText(data.a2);
	this.lblFundKorName.setText(data.a3);
		
	this.sellFundInfo = (data.a4);
	
	this.txtPw = (data.a5);
	this.ifReserved = data.a6;
	
	if(this.getContainer().containerId == "FD1201") {
		if(this.sellFundInfo["D1취소여부"] == "1") {
			this.lblFundCancel.setText("취소완료");
		} else {
			this.lblFundCancel.setText("정상");
		}
		
	}

};


FD3203_L01.prototype.onnextBtnClick = function(comp, info)
{

	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	cont.fundSellInfo = thisObj.sellFundInfo;
	
	//오늘의 주문내역
	if(cont.containerId == "FD1201") {
		var win = AWindow.createWindow('FD/window/FD1201_W02.lay', 'FD1201W02');		

		win.fundInfo = thisObj.sellFundInfo;
		win.txtPw = thisObj.txtPw;
		win.ifReserved = thisObj.ifReserved;
		win.openAsDialog(this, '100%', '100%');	
	//매도내역
	} else {
		var callback = function(fundGubun){
			var win = AWindow.createWindow('FD/window/FD3203_W01.lay','FD3203W1');		

			win.fundInfo = thisObj.sellFundInfo;
			win.txtPw = thisObj.txtPw;
			win.fundGubun = fundGubun;
			win.openAsDialog(thisObj, '100%', '100%');	
		}
		this.sendSOFFQ242(callback);
	}
};

FD3203_L01.prototype.onWindowResult = function(result, windowObj)
{
	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
			
	if(windowObj.containerId == 'FD3203W1'){
		if(result == "1"){
			theApp.goPageCheck('FD0002');
		}
	}
};

//2019.05.17 펀드유형 수익증권/무추얼펀드 체크를 위해 사용
FD3203_L01.prototype.sendSOFFQ242 = function(callback)
{
	var thisObj = this;
	
	// 조회
	this.cont.sendData("SOFFQ242",
	function(queryData, groupName){	
	
		var InBlock1 = queryData.getBlockData('InBlock1')[0];				
		InBlock1['D1투신펀드코드'] = thisObj.sellFundInfo['D1투신펀드코드'];
	
		if(afc.isSimulator) queryData.printQueryData();
	},
					   function(queryData, groupName) 
					   {						
		var errMsg = this.getLastError('errMsg');
		var errCode = this.getLastError('errCode');

		if(!queryData)
		{
			return;
		}
		else // 성공
		{
			if(afc.isSimulator) queryData.printQueryData();

			var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
			if(!OutBlock1) return;
						
			callback(OutBlock1['D1투신펀드유형구분']); //1 수익증권 2 무추얼펀드
		}
	});
}