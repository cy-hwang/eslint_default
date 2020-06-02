/**
Constructor
Do not call Function in Constructor.
*/
function FD2201_V02()
{
	AView.call(this);

	this.bankInfo = [];
}
afc.extendsClass(FD2201_V02, AView);

FD2201_V02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	this.accView = this.findCompById('AccView').viewLoad('FD/view/FD0000_V00.lay');
	this.accountNum = this.findCompById('TextField4');				// 계좌번호
	this.chkBox = this.findCompById('CheckBox1');					// 약정신청 체크박스
	this.dpBtn = this.findCompById('DropBox1');						// 금융기관드랍박스 // 팝업버튼 
	this.dpBtn.setUseDropBox(false);
	this.name = this.findCompById('NameTxf');
	this.userName = "";
	
	//계좌드롭박스
	this.accDbx = this.accView.accDbx;
	this.secureTxf = this.accView.secureTxf;
	
	this.btnView = this.findCompById('View6');		
	this.nextButton = this.findCompById('NextBtn');
	this.chkBox.setCheck(true);
	this.cancelbtn = this.findCompById('CancelBtn');
	this.cancelbtn.$ele.hide();
	
	//약정계좌 검증 끝난 계좌
	this.validAccount = "";
	this.nextButton.enable(false);
	
	this.accView.doInitAccInfo(0);	//0: 종합계좌번호, 4: 투신상품계좌번호
};

FD2201_V02.prototype.onActive = function(reload)
{
	AView.prototype.onActive.call(this, reload);
	this.setUserInfo();
	this.scrollToTop();
	if(reload) {
		this.bankInfo = BankInfo();
	}
};


FD2201_V02.prototype.onDeactiveDone = function() {
	this.dpBtn.clearSelectItem();
	this.accountNum.setText("");
	this.name.setText("");
	this.cancelbtn.$ele.hide();
	this.validAccount = "";
	this.nextButton.enable(false);
};

FD2201_V02.prototype.setUserInfo = function() {

	var cont = this.getContainer().tbvManager.getActiveView();
	var dbxIndex = 0;
	this.userName = cont.acntInfo.userNm;
	this.acntInfo = cont.acntInfo;
	
	for(var i=0; i<this.accDbx.items.length; i++) {
		if(this.accDbx.items[i].data["D1계좌번호"]==cont.acntInfo.accNo) {
			this.accDbx.selectItem(i);
			break;
		}
	}
	this.accDbx.enable(false);
	this.accDbx.addClass('combo2_dis');
	this.accDbx.addClass('combo2');
}

FD2201_V02.prototype.fnDoSendDataManage = function() {

}

//조회 버튼 클릭
FD2201_V02.prototype.BankSearchBtn = function(comp, info)
{
	if(this.dpBtn.getItem(0)) {
		this.sendSDPKT120();
	} else {
		AToast.show("금융기관을 선택해 주시기 바랍니다.");
	}
};

//은행계좌명 조회
FD2201_V02.prototype.sendSDPKT120 = function() {

	var thisObj = this,
		cont = thisObj.getContainer();		
		
	//비동기 응답설정
	theApp.accNetManager.addQueryListener(this);
			
	/************************************/	
	//비동기콜백 글로벌에 저장
	//thisObj.afterCallback = callback;
	/************************************/	
										
	cont.sendData('SDPKT120', 
		function(queryData, groupName){
				
			var inBlock1 = queryData.getBlockData('InBlock1');
			inBlock1[0] ={
					"D1은행코드":thisObj.dpBtn.getItem(0)['data'],
					"D1은행계좌번호": thisObj.accountNum.getText().replace(/[^0-9]/g, '')
			};

			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName) {
			var errcode = this.getLastError('errCode'),
				errMsg = this.getLastError('errMsg');
								
			if(afc.isSimulator) queryData.printQueryData();
			
			//에러처리필요
			if(!queryData)
			{					
				if(afc.isSimulator) afc.log('queryData null!');
				//callback(null);
			}else{
				if(afc.isSimulator) queryData.printQueryData();
				var oBlock = queryData.getBlockData('OutBlock1')[0];	
			}
		});	
}

//비동기 응답 데이터 수신부 override
FD2201_V02.prototype.afterOutBlockData = function(queryData, groupName, trName, manager)
{
	var thisObj = this,
		cont = thisObj.getContainer(),	
		errCode = '1000',
		packetType = manager.rcvBuf.getByte(OS_CH_TG_TP);
			
	//계정계 지연처리 TR응답
	if(packetType==PACKET_TYPE.E) {
		//afc.log('$$$$$$$$$$$$$$$$$지연이체 응답 수신$$$$$$$$$$$$$$$$$');
		if(trName=='SDPKT120') {								
			//코드저장
			errCode = manager.errorData.errCode;
											
			//비정상(오류)
			if(errCode>=1000) {
				return;
			}	
			if(!queryData) {
				AToast.show('계좌번호를 다시 한번 확인해 주시기 바랍니다.');
			} else {			
				// 정상처리되었을 경우 비동기방식 처리 해제
				if(afc.isSimulator) queryData.printQueryData();
				theApp.accNetManager.removeQueryListener(thisObj);
				
				var outBlock = queryData.getBlockData('OutBlock1')[0];
				if(outBlock["D1예금주명"]) {
					thisObj.name.setText(outBlock["D1예금주명"]);
				} else {
					AToast.show('계좌번호를 다시 한번 확인해 주시기 바랍니다.');
				}
				
				//본가동
				if(Define.RELEASE) {
					//고객명 일치 확인
					if(outBlock["D1예금주명"] == thisObj.userName) {
						thisObj.validAccount = thisObj.accountNum.getText().replace(/[^0-9]/g, '');
						this.nextButton.enable(true);
					//고객명 불일치 시
					}else {
						AToast.show('입력하신 계좌번호의 계좌명과 고객명이 일치하지 않습니다');
						this.nextButton.enable(false);
					}
				//테스트
				} else {
					if(outBlock["D1예금주명"]) {
						thisObj.validAccount = thisObj.accountNum.getText().replace(/[^0-9]/g, '');
						this.nextButton.enable(true);
					//고객명 불일치 시
					}else {
						AToast.show('입력하신 계좌번호의 계좌명과 고객명이 일치하지 않습니다');
						this.nextButton.enable(false);
					}
				}
			}			
		}		
	}
};

// 다음버튼 클릭
FD2201_V02.prototype.onNextBtnClick = function(comp, info)
{
	var acc = this.accountNum.getText();
	
	if( false === this.chkBox.getCheck()) {
		AToast.show('이체약정을 해야합니다.');
		return;
	}
	
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator && !this.secureTxf.getCipherData()) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		return;
	}	
	
	//은행이체약정 등록
	if(this.acntInfo.bankNm == "") {
		this.sendSACAT504(true);
	// 은행이체약정 수정
	} else {
		this.sendSACAT504_terminate();
	}
};

//은행이체약정 등록
// isSNS: 휴대폰본인인증 필요여부
FD2201_V02.prototype.sendSACAT504_terminate = function() {

	var thisObj = this;
	var	cont = thisObj.getContainer();
	var acntNo = this.accDbx.getSelectedItemData()['D1계좌번호'];
	
	if(!cont.sendData('SACAT504', function(queryData, groupName){
	
		var inBlock1 = queryData.getBlockData('InBlock1')[0];

			//약정계좌 해지
			inBlock1['D1처리구분'] = '2'
			inBlock1['D1종합계좌번호'] = acntNo;
			inBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : thisObj.secureTxf.getCipherData();

			inBlock1['D1은행본인계좌여부'] = '1';

			inBlock1['D1은행코드'] = thisObj.acntInfo.bankNm;
			inBlock1['D1은행계좌번호'] = thisObj.acntInfo.bankAccNo;
			inBlock1['D1은행계좌명'] = thisObj.acntInfo.accNm;

			if(afc.isSimulator) queryData.printQueryData();
			queryData.putPwInfo('InBlock1', 'D1비밀번호');
		},

		function(queryData)
		{	
			if(queryData) {
				if(afc.isSimulator) queryData.printQueryData();
				thisObj.sendSACAT504(false);
			} else {
				AppManager.endOltp();
				this.printLastError();

				AToast.show('통신 상태가 원활하지 않습니다.\n다시 시도해 주십시오');
			}
		},acntNo)) {
	// 휴대폰본인인증 fail 처리
	};
};

//은행이체약정 등록
// isSNS: 휴대폰본인인증 필요여부
FD2201_V02.prototype.sendSACAT504 = function(isSNS) {

	var thisObj = this;
	var	cont = thisObj.getContainer();
	var acntNo = this.accDbx.getSelectedItemData()['D1계좌번호'];
	
	if(!cont.sendData('SACAT504', function(queryData, groupName){
	
		var inBlock1 = queryData.getBlockData('InBlock1')[0];

			//약정계좌 등록을 위한 신규 항목
			inBlock1['D1처리구분'] = '1'
			inBlock1['D1종합계좌번호'] = acntNo;
			inBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : thisObj.secureTxf.getCipherData();

			inBlock1['D1은행본인계좌여부'] = '1';

			inBlock1['D1은행코드'] = thisObj.dpBtn.getItem(0)['data'];
			inBlock1['D1은행계좌번호'] = thisObj.validAccount;
			inBlock1['D1은행계좌명'] = thisObj.name.getText();

			if(afc.isSimulator) queryData.printQueryData();
			queryData.putPwInfo('InBlock1', 'D1비밀번호');
		},

		function(queryData)
		{	
			if(queryData) {
				if(afc.isSimulator) queryData.printQueryData();
				var win = AWindow.createWindow('FD/window/MS1005_W00.lay', 'MS1005_W05');
				if(isSNS) {
					win.text = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">출금계좌 등록이 완료되었습니다</span>';
				} else {
					win.text = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">출금계좌 변경이 완료되었습니다</span>';
				}
				win.openAsDialog(thisObj);
			} else {
				AppManager.endOltp();
				this.printLastError();

				AToast.show('통신 상태가 원활하지 않습니다.\n다시 시도해 주십시오');
			}
		},isSNS ? acntNo : "")) {
	// 휴대폰본인인증 fail 처리
	};
};

// 금융기관선택 클릭시
FD2201_V02.prototype.onDropBox1Click = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/MS1005_W01.lay','MS1005_W01');
	
	win.bankInfo = this.bankInfo;
	win.openAsDialog(this);
};

// 체크박스 체크 / 언체크
FD2201_V02.prototype.onCheckBox1Click = function(comp, info)
{
	if( false === this.chkBox.getCheck())
	{		
		var win = AWindow.createWindow('FD/window/MS1005_W02.lay','MS1005_W02');
			
		win.infoMsg = '<div style="float:left; width: 100%; height:100%"><span class="R" style="color:#555; font-size:24px; line-height:141%">펀드 자금 출금 시,<br/>자금을 이체할 계좌번호를<br/>입력하여 주시기 바랍니다.<br></span><span class="SB" style="color:#555; font-size:24px; line-height:141%; font-weight:700; margin-top:10px;">출금이체약정은 필수<br/>항목입니다.</span></div>';
		win.openAsDialog(this);
	}
};

FD2201_V02.prototype.onWindowResult = function( result, awindow)
{
	var thisObj = this;
	if( awindow.getContainerId() == 'MS1005_W01') {
		if(result) {
			this.dpBtn.setEditText(result[1]);
			this.dpBtn.setItem( 0, result[1], result[0]);
			//수정시 처리
			this.nextButton.enable(false);
		}
	} else if(  awindow.getContainerId() == 'MS1005_W02') {
		//1이면
		if(result == 1) {
			this.chkBox.setCheck(true);
		}
	//오류 메시지
	}  else if ("MS1005_W05" == awindow.getContainerId()) {
		thisObj.getContainer().tbvManager.getActiveView().tvManager.changeTab('TabBtn1');
	}
}

//계좌번호 항목 변경
FD2201_V02.prototype.onTextField4Change = function(comp, info)
{
	var accountTxt = comp.getText();
	if(accountTxt.length == 0) {
		
		this.cancelbtn.$ele.hide();
	}
	else if(accountTxt.length>0) {
	
		this.cancelbtn.$ele.show();		
	}
	this.nextButton.enable(false);
};

//계좌번호 삭제 수행
FD2201_V02.prototype.onCancelBtn1Click = function(comp, info)
{
	this.accountNum.setText("");
	this.cancelbtn.$ele.hide();
	this.nextButton.enable(false);
};