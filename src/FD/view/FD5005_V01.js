
/**
Constructor
Do not call Function in Constructor.
*/
function FD5005_V01()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5005_V01, AView);


FD5005_V01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.moneyView = this.findCompById('TextField3');//예수금잔고
	this.depositView = this.findCompById('TextField4');//입금하실금액
	
	this.accView =  this.findCompById('accView').viewLoad('FD/view/FD0000_V01.lay'); 
	this.accName = this.accView.title1;
	this.accDbx = this.accView.accDbx;
	this.secureTxf = this.accView.secureTxf;
	this.accName.$ele.html('연계계좌<br>(투자신탁계좌)');
	this.accView.setDelegator(this);
	this.accDbx.enable(false);
	this.accDbx.addClass('combo_dis');

	//--------------------------------------------------------------------------------------//투신계좌(보내는계좌)
	this.fundAccView = this.findCompById('fundAccView').viewLoad('FD/view/FD0000_V02.lay'); 
	this.fundAccDbx = this.fundAccView.accDbx;
	
	//----------------------------------------------------------------------------------------//연금펀드계좌(받는계좌)
	
	this.moneyView.$ele.context.style.background = "#f5f5f5";
	
};


//화면이 활성화된 후 이벤트
FD5005_V01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	this.SACAQ517ContiKey = null;//우리은행 가상계좌 정보 
	this.SDPAQ070ContiKey = null;//년간 납입 금액
	this.bankInfo = [];//우리은행 가상계좌 배열
	
	this.accView.doInitAccInfo(4);	
	this.fundAccView.doInitAccInfo(5);
	
	this.selectAccData();//투신계좌에 맞는 연금펀드계좌 setting

};

//화면이 나타나는 중 
FD5005_V01.prototype.onWillDeactive = function(reload)
{
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.$ele.parent().scrollTop(0);
	this.onArrInit();
};

//입력 정보 초기화 
FD5005_V01.prototype.onArrInit = function()
{	

	this.moneyView.setText("");
	this.depositView.setText('');
};


//투신계좌 변경 -> delegator : FD5005_V01
FD5005_V01.prototype.fnDoSendDataManage = function()
{
	
	
	if(this.secureTxf.getPwLength() != 0 ){
		//우리은행 가상 계좌 납입 가능 금액 확인
		this.sendSDPAQ066()
		
	}
}

//연금펀드계좌 변경 -> delegator : FD5005_T01
FD5005_V01.prototype.changeAccManager = function()
{
	var cont = this.getContainer();
	this.secureTxf.clear();
	AToast.show("계좌비밀번호를 입력해주세요.");
	this.moneyView.setText("");
	this.depositView.setText('');
	//투신계좌에 맞는 연금펀드계좌 setting
	this.selectAccData();
	//입금화면 진입 시 납입 한도 초과 팝업 계좌 정보 setting
	theApp.fundAcc = this.fundAccDbx.getSelectedItemData()['D1계좌번호'];
	PensionCommon.sendSDPAQ070(cont, null);
	if(afc.isSimulator){
		this.sendSDPAQ066();
	}
	
}

FD5005_V01.prototype.onButton1Click = function(comp, info)
{

	this.bankInfo = [];
	this.SACAQ517ContiKey = null;
	this.sendSACAQ517();//우리은행 가상 계좌 정보
	
};

//우리은행 가상 계좌 납입 가능 금액 확인
FD5005_V01.prototype.sendSDPAQ066 = function()
{
	
	var thisObj = this		
		,qrName = "SDPAQ066"
		,cont = thisObj.getContainer()
		,cipherData = thisObj.secureTxf.getCipherData();
	
	
	if(!thisObj.accDbx.getSelectedItemData() || !thisObj.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator && !cipherData) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		thisObj.secureTxf.addClass('active');
		return;
	}
	thisObj.secureTxf.removeClass('active');

	
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.accDbx.getSelectedItemData()['D1계좌번호']
	};
	
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				InBlock1['D1계좌번호'] = checkObj.accNo
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;
				
				if(!afc.isSimulator){
					queryData.putPwInfo('InBlock1', 'D1비밀번호');
				}
			},
			function(queryData, groupName)
			{				
				if(queryData)
				{	
					//next키 저장
					
					queryData.printQueryData();
					
					var outBlock1 = queryData.getBlockData('OutBlock1')[0];
					var outBlock2 = queryData.getBlockData('OutBlock5')[0];
					thisObj.moneyView.setText(outBlock2['D1인출가능금액']);
					thisObj.ableDeposit = outBlock2['D1인출가능금액'];
					thisObj.inputName = outBlock1['D1계좌명'];
					if(outBlock2['D1인출가능금액'] == '0'){
						var contents = '이체가능금액이 없습니다. <br>'+
							'우리은행 가상계좌로 입금 후 <br>'+
							'이체해주시기 바랍니다.'
						var param = {
							"title" : "",
							"contents" : contents,
							"btnText" : "확인",
							"returnType" : "0",
							"returnData" : ""
						};
						PensionCommon.oneBtnPopup(this,param);
					}
				}
			}
			
		);
	});
}
//우리은행 가상계좌 정보 
FD5005_V01.prototype.sendSACAQ517 = function()
{
	var thisObj = this		
		,qrName = "SACAQ517"
		,cont = thisObj.getContainer()
		,cipherData = thisObj.secureTxf.getCipherData();
		
	if(!thisObj.accDbx.getSelectedItemData() || !thisObj.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator && !cipherData) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		thisObj.secureTxf.addClass('active');
		return;
	}
	thisObj.secureTxf.removeClass('active');

	//종합계좌
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.totalAccInfo
	};
	
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{

			
				queryData.setContiKey(thisObj.SACAQ517ContiKey);
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				InBlock1['D1계좌구분'] ='1'
				InBlock1['D1계좌번호'] = checkObj.accNo
				InBlock1['D1입력비밀번호'] = afc.isSimulator ? '0423' : result;
				InBlock1['D1서비스종류코드']='1410'
				
				if(!afc.isSimulator){
					queryData.putPwInfo('InBlock1', 'D1입력비밀번호');
				}
			},
			function(queryData, groupName)
			{				
				if(queryData)
				{	
					//next키 저장
					
					thisObj.SACAQ517ContiKey = queryData.getContiKey();
					queryData.printQueryData();
					var outBlock1 = queryData.getBlockData('OutBlock1')[0];
					var outBlock2 = queryData.getBlockData('OutBlock2');
					for(var i =0 ; i<outBlock2.length;i++){
						thisObj.bankInfo.push({"D1계좌명" : outBlock1['D1계좌명'], "D1상대기관계좌번호":outBlock2[i]['D1상대기관계좌번호'],
						"D1은행대표연결계좌번호" :outBlock2[i]['D1은행대표연결계좌번호']});
					}
					
					
					if(thisObj.SACAQ517ContiKey != null){
						thisObj.sendSACAQ517();
					}else{
						thisObj.selectWooriBank(thisObj.bankInfo);
					}
				}
			}
			
		);
	});
};

//년간 납입 금액 
FD5005_V01.prototype.sendSDPAQ070 = function()
{
	
	var thisObj = this		
		,qrName = "SDPAQ070"
		,cont = thisObj.getContainer()
		,cipherData = thisObj.secureTxf.getCipherData();
		
	if(!thisObj.accDbx.getSelectedItemData() || !thisObj.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator && !cipherData) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		thisObj.secureTxf.addClass('active');
		return;
	}
	thisObj.secureTxf.removeClass('active');

	
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.fundAccDbx.getSelectedItemData()['D1계좌번호']
	};
	
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				queryData.setContiKey(thisObj.SDPAQ070ContiKey);
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				InBlock1['D1계좌번호'] = checkObj.accNo
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;
				
				if(!afc.isSimulator){
					queryData.putPwInfo('InBlock1', 'D1비밀번호');
				}
			},
			function(queryData, groupName)
			{				
				if(queryData)
				{	
					
					var now = new Date();
					var year = now.format('yyyy');
					thisObj.SDPAQ070ContiKey = queryData.getContiKey();
					queryData.printQueryData();
					var outBlock1 = queryData.getBlockData('OutBlock1')[0];
					var outBlock2 = queryData.getBlockData('OutBlock4');
					
					if(outBlock2.length > 0 ){
						for(var i =0 ; i<outBlock2.length;i++){
							
							if(outBlock2[i]['D1납입년도'] == year){
								var money = outBlock1['D1납입한도금액']*1-(outBlock2[i]['D1납입금액']*1 - outBlock2[i]['D1인출금액']*1);
								thisObj.tempGoFD5005V02(money);
								return;
							}
						}
					}else{
						var money = outBlock1['D1납입한도금액'];
						thisObj.tempGoFD5005V02(money);
						return;
					}
					
					
					if(thisObj.SDPAQ070ContiKey != null){
						thisObj.sendSDPAQ070();
					}else{
						var money = outBlock1['D1납입한도금액'];
						thisObj.tempGoFD5005V02(money);
						return;
					}
				}
			}
			
		);
	});
};



//연금펀드 계좌에 따른 투신 계좌 종합 계좌 
FD5005_V01.prototype.selectAccData = function()
{
	
	this.accList = theApp.accInfo.filterAccList(4);//투신계좌
	for(var i=0;i<this.accList.length;i++){
		if(this.accList[i]["D1계좌번호"].substr(5,6) == this.fundAccDbx.getSelectedItemData()['D1계좌번호'].substr(5,6) ){
			this.totalAccInfo = this.accList[i]["D1계좌번호"].substr(0,3) + '91' + this.accList[i]["D1계좌번호"].substr(5,6);//종합계좌
			this.accDbx.selectItem(i);	
		}	
	}
}

//우리은행정보
FD5005_V01.prototype.selectWooriBank = function(bankInfo)
{
	for(var i=0;i<bankInfo.length;i++){
		if(bankInfo[i]['D1은행대표연결계좌번호'].substr(5,6) == this.accDbx.getSelectedItemData()['D1계좌번호'].substr(5,6)){
			var win = AWindow.createWindow('FD/window/FD5005_W01.lay','FD5005_W01');
			win.accName = bankInfo[i]['D1계좌명']
			win.account = bankInfo[i]['D1상대기관계좌번호']
			win.openAsDialog(this);
		}
	}
}
FD5005_V01.prototype.onButton2Click = function(comp, info)
{
	if(this.accDbx.getSelectedItemData()['D1계좌번호'].substr(5,6) != this.fundAccDbx.getSelectedItemData()['D1계좌번호'].substr(5,6)){
		AToast.show('입금은 연계계좌로만 할 수 있습니다.')
		return;
	}
	
	this.SDPAQ070ContiKey = null;	
	this.sendSDPAQ070();
};

//다음 화면으로 가기전 조건 함수 
FD5005_V01.prototype.tempGoFD5005V02 = function(info)
{
	if(this.depositView.getText().length == 0){
		AToast.show('입금하실 금액을 입력하세요');
		return;
	}

	if(this.ableDeposit == '0' || this.ableDeposit*1 < this.depositView.getText()*1){
		var contents = '이체가능금액을 초과하셨습니다. <br>'+
			'우리은행 가상계좌로 입금 후 <br>'+
			'이체해주시기 바랍니다.'
		var param = {
			"title" : "",
			"contents" : contents,
			"btnText" : "확인",
			"returnType" : "0",
			"returnData" : ""
		};
		PensionCommon.oneBtnPopup(this,param);
		return;
	}


	if(info*1 <= 0 || info*1 < this.depositView.getText()*1){ // 이체 금액이 납입가능 금액 초과시 팝업 

		var param = {
			"name" :this.inputName,
			"limitPay" : info*1
		};


		var win = AWindow.createWindow('FD/window/FD5001_W03.lay', 'FD5001_W03');
		win.param = param;
		win.openAsDialog(this);

		this.isAbleDeposit = false;
	}else{
		this.isAbleDeposit = true;
	}

	this.goFD5005V02();	
};

//조건이 충족하면 다음화면으로...
FD5005_V01.prototype.goFD5005V02 = function()
{
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	if(this.isAbleDeposit == true){
		var param = {
			"deposit" : this.depositView.getText(),
			"acc" : this.accDbx.getSelectedItemData()['D1계좌번호'],
			"fundAcc" : this.fundAccDbx.getSelectedItemData()['D1계좌번호'],
			"name" : this.inputName,
			"pw" : afc.isSimulator ? '0423' : thisObj.secureTxf.getCipherData()

		}

		cont.tbvManager.getActiveView().tbvManager.changeTab('FD5005_V02', param);
	}
	
	this.isAbleDeposit = false; 
	
}

