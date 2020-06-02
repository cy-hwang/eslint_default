
/**
Constructor
Do not call Function in Constructor.
*/
function FD5005_V03()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5005_V03, AView);


FD5005_V03.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.money = this.findCompById('Label5');
	this.grid = this.findCompById('Grid1');


	//TODO:edit here

};


FD5005_V03.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	var thisObj = this;
	var cont = thisObj.getContainer();
	this.fundAcc = this.viewData.fundAcc;
	this.deposit = this.viewData.deposit;
	this.name = this.viewData.name;
	
	this.grid.setCellText(0,1,Utils.makeAccForm(thisObj.fundAcc))
	this.grid.setCellText(1,1,thisObj.name)
	this.grid.setCellText(2,1,afc.addComma(thisObj.deposit)+'원')
	this.sendSDPAQ070();
}

FD5005_V03.prototype.sendSDPAQ070 = function()
{
	
	var thisObj = this		
		,qrName = "SDPAQ070"
		,cont = thisObj.getContainer();
		
		
	
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.fundAcc
	};
	
	theApp.accNetManager.addSkipErrorCode('SDPAQ070', '13'); 
	cont.sendData(qrName, 
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1계좌번호'] = checkObj.accNo
			InBlock1['D1비밀번호'] = '';

		},
		function(queryData, groupName)
		{				
			if(queryData)
			{	
				queryData.printQueryData();
				var outBlock1 = queryData.getBlockData('OutBlock1')[0];
				thisObj.money.setText(afc.addComma(outBlock1['D1예수금']) + '원');

			}
		}
	);

};
FD5005_V03.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	
	//펀드 상품 리스트로 가기 
	theApp.goPageCheck('FD5003', false, {tabId:'FD5003_T01'});
	

};
