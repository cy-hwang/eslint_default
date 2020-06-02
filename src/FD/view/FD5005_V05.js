
/**
Constructor
Do not call Function in Constructor.
*/
function FD5005_V05()
{	
	AView.call(this);
	
};

afc.extendsClass(FD5005_V05, AView);

FD5005_V05.prototype.init = function(context, evtListener)
{	
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	
	this.grid = this.findCompById("Grid1");
	
	
	
	//예금주
	this.depositAccNm = this.findCompById("Label8");
};



FD5005_V05.prototype.onActiveDone = function(reload)
{	
	AView.prototype.onActiveDone.call(this, reload);
		
	this.depositAcc = this.viewData.depositAcc //받는 계좌 (투신 계좌)
	this.name = this.viewData.name //예금주
	this.drawAcc =  this.viewData.drawAcc //보내는 계좌(연금 펀드 계좌)
	this.drawMoney = this.viewData.money //보내는 돈 
	this.pw = this.viewData.pw;
	
	this.grid.setCellText(0,1, PensionCommon.addAccBar(this.drawAcc)); //출금 계좌
	this.grid.setCellText(1,1, this.name); //예금주명
	this.grid.setCellText(2,1, afc.addComma(this.drawMoney) + '원'); //보내는 금액 (연금 펀드 계좌)
	
	this.depositAccNm.setText(this.name+'님');
	
	
};



FD5005_V05.prototype.onnextBtnClick = function(comp, info)
{

	//TODO:edit here
	
	this.SendData_SDPDT068(function(outBlock){
		
		
		
		var param = {
			"depositAcc" : this.depositAcc, //받는 계좌 (투신 계좌)
			"name" : this.name, //예금주
			"drawAcc" :  this.drawAcc, //보내는 계좌(연금 펀드 계좌)
			"drawMoney" : this.drawMoney, //보내는 돈 
			"totalMoney" : outBlock['D1출금예수금금잔'] //이체 후 잔액
 		}
		
		
		//다음단계로 탭변경
		this.getContainer().tbvManager.getActiveView().tbvManager.changeTab('FD5005_V06', param);
	});

};


FD5005_V05.prototype.SendData_SDPDT068 = function(callback)
{
	var thisObj = this,
		cont = thisObj.getContainer(),
		cipherData = thisObj.pw;


	
	var checkObj = {
		svcId : 'SDPDT068',
		accNo : this.drawAcc
	};


	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(checkObj.svcId,
			function(queryData, groupName){
				
				var inBlock1 = queryData.getBlockData('InBlock1')[0];
				
				inBlock1['D1계좌번호'] = thisObj.drawAcc
				inBlock1['D1비밀번호'] = cipherData
				inBlock1['D1대체금액'] = thisObj.drawMoney
				inBlock1['D1출금유형'] = '4'
				inBlock1['D1출금유형코드'] = '30'
				inBlock1['D1입금계좌번호'] = thisObj.depositAcc
				
				queryData.putPwInfo('InBlock1', 'D1비밀번호');
			},
			function(queryData, groupName) {
				if(!queryData) return;
				
				if(queryData)
				{
					queryData.printQueryData();	
					var outBlock = queryData.getBlockData('OutBlock1')[0];
					callback.call(thisObj, outBlock)

				}
				
				
			},
			checkObj.accNo
		);
	});
}


FD5005_V05.prototype.onbeforeBtnClick = function(comp, info)
{

	//TODO:edit here
	this.getContainer().tbvManager.getActiveView().tbvManager.changeTab('FD5005_V04', false);

};
