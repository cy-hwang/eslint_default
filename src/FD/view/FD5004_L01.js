
/**
Constructor
Do not call Function in Constructor.
*/
function FD5004_L01()
{
	AView.call(this);

	//TODO:edit here
	
	this.sellFundInfo = null;

}
afc.extendsClass(FD5004_L01, AView);


FD5004_L01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// Object
	this.cont = this.getContainer();

	this.lblFundOtpName = this.findCompByGroup('listViewGrp')[0];
	this.lblFundCancel = this.findCompByGroup('listViewGrp')[1];
	this.lblFundKorName = this.findCompByGroup('listViewGrp')[2];
	this.lblFundCancel.show(AComponent.GONE);
	
};


FD5004_L01.prototype.setData = function(data)
{		
	this.lblFundKorName.setText(data.a1);//펀드명
	this.lblFundOtpName.setText(data.a2);//납입방법명

	this.fundInfo = data.a6; //연금 펀드 정보  
	this.acc = data.a4 //계좌번호
	this.pw = data.a5//비밀번호 
	
};


FD5004_L01.prototype.onnextBtnClick = function(comp, info)
{
	var thisObj = this;
	//TODO:edit here
	var callback = function(fundGubun){
		var win = AWindow.createWindow('FD/window/FD5004_W01.lay', 'FD5004W01');		
		win.fundInfo = thisObj.fundInfo;
		win.lAcc = thisObj.acc;
		win.lPw = thisObj.pw;
		win.fundGubun = fundGubun;
		win.openAsDialog(thisObj, '100%', '100%');	
	}
	
	this.sendSOFFQ242(callback);
};

//2019.05.17 펀드유형 수익증권/무추얼펀드 체크를 위해 사용
FD5004_L01.prototype.sendSOFFQ242 = function(callback)
{
	var thisObj = this;
	
	// 조회
	this.cont.sendData("SOFFQ242",
	function(queryData, groupName){	
	
		var InBlock1 = queryData.getBlockData('InBlock1')[0];				
		InBlock1['D1투신펀드코드'] = thisObj.fundInfo['D1투신펀드코드'];
	
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