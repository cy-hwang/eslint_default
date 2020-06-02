
/**
Constructor
Do not call Function in Constructor.
*/
function FD5005_V02()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5005_V02, AView);


FD5005_V02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	
	this.sendAcc = this.findCompById('Grid1');
	this.receiveAcc = this.findCompById('Grid2');
	this.userName = this.findCompById('Label5');


};

FD5005_V02.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);	
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	this.pw = this.viewData.pw;
	this.fundAcc = this.viewData.fundAcc;//연금펀드계좌
	this.acc =this.viewData.acc;//투신계좌
	this.deposit = this.viewData.deposit;//금액
	this.name = this.viewData.name;//계좌명

	this.sendAcc.setCellText(0,1,Utils.makeAccForm(this.acc))
	this.sendAcc.setCellText(1,1,this.name)
	this.sendAcc.setCellText(2,1,afc.addComma(this.deposit)+'원')
	
	
	
	this.receiveAcc.setCellText(0,1,Utils.makeAccForm(this.fundAcc))
	this.receiveAcc.setCellText(1,1,this.name)
	this.receiveAcc.setCellText(2,1,afc.addComma(this.deposit)+'원')
	this.userName.setText(this.name);
};


FD5005_V02.prototype.onWillDeactive = function(reload)
{
	AView.prototype.onWillDeactive.call(this, reload);		
};


	
	
FD5005_V02.prototype.onButton2Click = function(comp, info)
{

	//TODO:edit here
	this.sendSDPDT007();

};



//투신 -> 연금 입금
FD5005_V02.prototype.sendSDPDT007 = function()
{
	var thisObj = this		
		,qrName = "SDPDT007"
		,cont = thisObj.getContainer()
		,cipherData = thisObj.pw;
	
	
	var checkObj = {
		svcId : qrName,
		accNo : this.acc
	};
	
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				InBlock1['D1계좌번호'] = checkObj.accNo
				InBlock1['D1비밀번호'] = cipherData
				InBlock1['D1대체금액'] =  thisObj.deposit
				InBlock1['D1입금계좌번호'] = thisObj.fundAcc
				InBlock1['D1출금유형'] = '4'  //예수금 출금 
				
				if(!afc.isSimulator){
					queryData.putPwInfo('InBlock1', 'D1비밀번호');
				}
			},
			function(queryData, groupName)
			{				
				if(queryData)
				{	
					queryData.printQueryData();
					var param = {
						"deposit" : thisObj.deposit,
						"fundAcc" :  thisObj.fundAcc,
						"name" : thisObj.name

					}
					cont.tbvManager.getActiveView().tbvManager.changeTab('FD5005_V03', param);
				
				}
			}
			
		);
	});
};


FD5005_V02.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	cont.tbvManager.getActiveView().tbvManager.changeTab('FD5005_V01', false);

};
