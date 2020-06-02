/**
Constructor
Do not call Function in Constructor.
*/
function FD5005_V04()
{
	AView.call(this);

	//TODO:edit here
}

afc.extendsClass(FD5005_V04, AView);

FD5005_V04.prototype.init = function(context, evtListener)
{	
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here 

	
	//계좌뷰
	this.accView = this.findCompById('AccView').loadView;   //출금계좌뷰
	this.accDbx = this.accView.accDbx; //계좌select
	this.secureTxf = this.accView.secureTxf; //계좌비밀번호
	
	//출금계좌
	this.drawAllAmt = this.findCompById('drawAllAmtTxt');   //출금가능금액
	this.drawExceptAtm = this.findCompById('drawExceptAtmTxt'); 		//과세제외 출금 가능금액
	this.drawAmt = this.findCompById('drawAmtTxt'); 		//출금금액
	this.drawAccNm = this.findCompById('lblDrawAccNm'); //이름
	
	
	//출금지정계좌 계좌명, 계좌번호
	this.depositAccNm = this.findCompById('depositAccNm');	//이름
	this.depositAccNum = this.findCompById('depositAccNum'); //계좌번호
	
};



//화면 초기화
FD5005_V04.prototype.resetData = function()
{	
	this.drawAllAmt.setText('');
	this.drawAmt.setText('');
	this.drawExceptAtm.setText('');
	
};

//화면이 활성화된 후 이벤트
FD5005_V04.prototype.onActiveDone = function(reload)
{	
	AView.prototype.onActiveDone.call(this, reload);
	this.accView.doInitAccInfo(5);	
	//스크롤 
	this.$ele.parent().scrollTop(0);
	this.resetData();
	this.setUserInfo();
	
	
};



//계좌변경 혹은 비밀번호 호출 
FD5005_V04.prototype.fnDoSendDataManage = function()
{	

	if(afc.isSimulator){
		this.sendSDPAQ070();
	}
	
	PensionCommon.setFundAcc(this);
	
	
	
	if(this.secureTxf.getPwLength() == 0)
	{	
		AToast.show("계좌비밀번호를 입력해주세요.");
		this.secureTxf.addClass('active');
		this.setUserInfo();
		return;
	}
	this.secureTxf.removeClass('active');
	
	
	
	this.sendSDPAQ070();
};

FD5005_V04.prototype.setUserInfo = function()
{
	var accList =  theApp.accInfo.filterAccList(4)//투신계좌번호
	for(var i=0;i<accList.length;i++){ //연금펀드계좌에 맞는 투신계좌 선택 
		if(accList[i]["D1계좌번호"].substr(5,6) == this.accDbx.getSelectedItemData()['D1계좌번호'].substr(5,6)){
			this.drawAccNm.setText(accList[i]["D1계좌명"])
			this.depositAccNum.setText(PensionCommon.addAccBar(accList[i]["D1계좌번호"])); //투신계좌
			this.depositAccNm.setText(accList[i]["D1계좌명"]);	
			this.resetData();
			
		}	
	}
}

FD5005_V04.prototype.onButton3Click = function(comp, info)
{
	
	if(!afc.isSimulator && !this.secureTxf.getCipherData()) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		this.secureTxf.addClass('active');
		return;
	}
	this.secureTxf.removeClass('active');
	
	
	if(this.drawAmt.getText() == ''){
		AToast.show('보내실 금액을 입력하세요');
		return;
	}
	
	
	if(this.drawAmt.getText()*1 > this.drawAllAmt.getText()){
		AToast.show('출금 가능 금액을 초과하셨습니다');
		return;
	}
	
	

	if(this.drawAmt.getText()*1 > this.drawExceptAtm.getText()*1){
		var contents = "‘과세제외 출금가능금액’을 <br/>" + 
			"초과하여 인출하실 경우 <br/>" +
			"과세상 불이익이 <br/>" +  
			"발생할 수 있습니다. <br/>" +
			"계속 진행하시겠습니까?"
		var param = {
			"title" : "안내",
			"contents" : contents,
			"btnArray" : ['예', '아니오'],
			"returnType" : "1",
			"returnData" : ""
		};

		PensionCommon.twoBtnPopup(this, param);
		
		return;
		
	}
	
	var param = {
		"money" : this.drawAmt.getText(), //보내는 금액
		"depositAcc" : PensionCommon.removeAccBar(this.depositAccNum.getText()), //받는 계좌
		"drawAcc" : this.accDbx.getSelectedItemData()['D1계좌번호'], // 보내는 계좌
		"name" : this.depositAccNm.getText(), //계좌명
		"pw" : afc.isSimulator ? '0423' : this.secureTxf.getCipherData()
	}
	
	
	this.getContainer().tbvManager.getActiveView().tbvManager.changeTab('FD5005_V05', param);
};

FD5005_V04.prototype.callbackPensionPopup = function(returnData, resultData) 
{
	if(resultData == '1'){
		var param = {
			"money" : this.drawAmt.getText(), //보내는 금액
			"depositAcc" : PensionCommon.removeAccBar(this.depositAccNum.getText()), //받는 계좌
			"drawAcc" : this.accDbx.getSelectedItemData()['D1계좌번호'], // 보내는 계좌
			"name" : this.depositAccNm.getText(), //계좌명
			"pw" : afc.isSimulator ? '0423' : this.secureTxf.getCipherData()
		}


		this.getContainer().tbvManager.getActiveView().tbvManager.changeTab('FD5005_V05', param);
	}
}
//출금 가능 금액 
FD5005_V04.prototype.sendSDPAQ070 = function()
{
	
	var thisObj = this		
		,qrName = "SDPAQ070"
		,cont = thisObj.getContainer()
		,cipherData = this.secureTxf.getCipherData();
		
	
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
	
	theApp.accNetManager.addSkipErrorCode('SDPAQ070', '13'); 
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
				queryData.printQueryData();

			},
			function(queryData, groupName)
			{				
				if(queryData)
				{	
					queryData.printQueryData();
					var outBlock1 = queryData.getBlockData('OutBlock1')[0];
					
					thisObj.setDraw(outBlock1);
					
				}
			}
		);
	});

};

FD5005_V04.prototype.setDraw = function(outBlock1)
{
	this.drawAble = outBlock1['D1출금가능금액']*1;
	this.drawExcept = outBlock1['D1금액22']*1;//과세제외출금가능금액
	
	this.drawAllAmt.setText(afc.addComma(this.drawAble));
	if(this.drawAble < this.drawExcept){
		this.drawExceptAtm.setText(afc.addComma(this.drawAble));
	}else if(this.drawAble >= this.drawExcept){
		this.drawExceptAtm.setText(afc.addComma(this.drawExcept));
	}
	
	
}

