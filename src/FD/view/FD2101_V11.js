/**
Constructor
Do not call Function in Constructor.
*/
function FD2101_V11()
{
	AView.call(this);

	//TODO:edit here
	
	//계좌뷰
	this.accDbx = null; 
	//this.accPwdNo = null; 
	this.accDropView = null;
	
	//출금계좌
	this.drawAllAmt = null; 	//출금가능금액
	this.drawAmt = null; 		//출금금액
	this.drawAccNum = null;
	this.drawBankNm = null;
	this.drawBankNum = null;
	this.drawAccPwdNum = null;
	this.drawAccNm = null;
	
	//출금지정계좌
	this.depositAccNm = null;
	this.depositBankNm = null;
	this.depositAccNum = null;
	this.depositBankCd = null;
	
	//비동기 글로벌 콜백설정	
	this.afterCallback = null;	
	this.timeOutFunc = null;
	
	this.tmpDrawAllAmt = null;
	this.tmpDepositBankNm = null;
	this.tmpDepositAccNm = null;
	this.tmpDepositAccNum = null;
}

afc.extendsClass(FD2101_V11, AView);

FD2101_V11.prototype.init = function(context, evtListener)
{	
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here 
	this.cnt =  this.getContainer();
	
	//계좌뷰
	this.accView = this.findCompById('AccView').loadView;   //출금계좌뷰

	this.accDbx = this.accView.accDbx; //계좌select
	this.secureTxf = this.accView.secureTxf; //계좌비밀번호
	
	//출금계좌
	this.drawAllAmt = this.findCompById('drawAllAmtTxt');   //출금가능금액
	this.drawAmt = this.findCompById('drawAmtTxt'); 		//출금금액
	this.drawAccNm = this.findCompById('lblDrawAccNm'); 
	
	
	//출금지정계좌 계좌명, 은행, 계좌번호
	this.depositAccNm = this.findCompById('depositAccNm');	
	//this.depositAccNm.enable(false);
	this.depositBankNm = this.findCompById('depositBankNm');	
	//this.depositBankNm.enable(false);
	this.depositAccNum = this.findCompById('depositAccNum');	
	//this.depositAccNum.enable(false);
	
};

//비동기 응답 설정
FD2101_V11.prototype.onWillActive = function(reload)
{	
	theApp.accNetManager.addQueryListener(this);
	
	//출금가능계좌 불러오기
	this.accView.doInitAccInfo(4);	
	
	this.fnDoSendDataManage();
};

FD2101_V11.prototype.onDeactiveDone = function()
{
    AView.prototype.onDeactiveDone.call(this);	
	this.resetData();	
};

//화면 초기화
FD2101_V11.prototype.resetData = function()
{	
	this.drawAllAmt.setText('');
	this.drawAmt.setText('');
	this.depositBankCd = null;
	this.depositAccNm.setText('');
	this.depositBankNm.setText('');
	this.depositAccNum.setText('');
};

//화면이 활성화된 후 이벤트
FD2101_V11.prototype.onActiveDone = function(reload)
{	
	AView.prototype.onActiveDone.call(this, reload);		
};

//화면이 소멸되기 전 이벤트
FD2101_V11.prototype.onWillDeactive = function(reload)
{	
	AView.prototype.onWillDeactive.call(this, reload);		
	this.resetData();
	theApp.accNetManager.removeQueryListener(this);
	
	//남아 있을 비동기 타임아웃 이벤트 삭제
	if(this.timeOutFunc) clearTimeout(this.timeOutFunc);
};

//AccView 로드뷰에서 호출하는 함수
FD2101_V11.prototype.fnDoSendDataManage = function()
{	
	this.accDbx.removeClass('active');
	this.secureTxf.removeClass('active');
	this.resetData();
	//출금계좌, 출금지정은행 세팅
	this.activeSendDataManage();
};

FD2101_V11.prototype.activeSendDataManage = function()
{	
	var thisObj = this;
	this.callback = function(){
		//출금지정은행, 출금지정계좌번호세팅
		thisObj.doDepositAccSet();
	}
	
	//출금계좌세팅(출금가능금액)
	this.doDrawAccSet(this.callback);
	this.accData = this.accView.accDbx.getSelectedItemData();
	this.drawAccNm.setText(this.accData['D1계좌명']);
};


//출금지정계좌세팅
FD2101_V11.prototype.doDepositAccSet = function()
{	
	var thisObj = this,
		cont = thisObj.getContainer(),
		cipherData = this.secureTxf.getCipherData();
	
	var tmpAccNo = this.accDbx.getSelectedItemData()['D1계좌번호']; 
	var tmpDrawAmt = this.drawAmt.getText();
	
	//계좌가 없을 경우
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		
		this.accDbx.addClass('active');
		return;
	} 
	
	//비번이 없을 경우
	if(!afc.isSimulator)
	{	
		if(!cipherData)
		{
			AToast.show('계좌 비밀번호를 입력하세요.');
			this.secureTxf.addClass('active');
			return;
		}
	}
		
	theApp.accNetManager.addSkipErrorCode('SDPNQ031', '2679');
	cont.sendData('SDPNQ031', function(queryData, groupName)
		{	
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1은행코드'] = '';
			InBlock1['D1계좌번호'] = tmpAccNo;
			InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : cipherData;
			queryData.putPwInfo('InBlock1', 'D1비밀번호');
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{	if(afc.isSimulator) queryData.printQueryData();
			var errcode = this.getLastError('errCode');
			
			if(errcode== '2679'){
				AToast.show('출금지정계좌 정보가 없습니다.');
				return;
			}
			
			if(!queryData)
			{	
				if(afc.isSimulator) afc.log('queryData null!');
				return;
			}
			else
			{	
				var OutBlock1 = queryData.getBlockData('OutBlock1');
				
				if(!OutBlock1)
				{	
					thisObj.drawAllAmt.setText('');
					thisObj.depositAccNm.setText('');
					thisObj.depositAccNum.setText('');
					thisObj.depositAccNum.setText('');
					
					thisObj.depositBankInfos = null;
				} 
				else
				{	
					thisObj.depositBankInfos = OutBlock1;	//출금지정은행(입금은행) 정보
					
					if(thisObj.depositBankInfos.length < 1)
					{	
						thisObj.drawAllAmt.setText('');
						thisObj.depositAccNm.setText('');
						thisObj.depositBankNm.setText('');
						thisObj.depositAccNum.setText('');
						thisObj.depositBankInfos = null;
					}
					else
					{
						thisObj.doDepositAccInfoSet(thisObj.depositBankInfos[0]);	
					}
				}
				
				if(afc.isSimulator) queryData.printQueryData();
			}
		});
};	

//출금가능금액조회
FD2101_V11.prototype.doDrawAccSet = function(callback)
{	
	//SDPNQ184 종합계좌 출금 가능금액 조회
	var  thisObj = this
		,qrName = 'SDPNQ184'
		,cont = thisObj.getContainer() //this, //!this.getContainer() ? this : this.getContainer()
		,cipherData = this.secureTxf.getCipherData();
	
	var fundCd = ''; 							
	var tmpAccNo = this.accDbx.getSelectedItemData()['D1계좌번호']; 
	var tmpAccPwdNo = this.secureTxf; 	//비밀번호
	
	var checkObj = {
		svcId : qrName,
		accNo : this.accDbx.getSelectedItemData()['D1계좌번호']
	};
	
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		this.accDbx.addClass('active');
		callback(null);
		return;
	}
	
	if(!afc.isSimulator)
	{
		if(!cipherData)
		{
			AToast.show('계좌 비밀번호를 입력하세요.');
			this.secureTxf.addClass('active');
			callback(null);
			return;
		}
	}
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				var inBlock1 = queryData.getBlockData('InBlock1');
				inBlock1[0] = {'D1출금계좌번호': tmpAccNo,
							'D1출금유형': '1',
							'D1투신펀드코드': fundCd,
							'D1비밀번호': afc.isSimulator ? '0423' : result};
				
				queryData.putPwInfo('InBlock1', 'D1비밀번호');
				queryData.printQueryData();			
			},//*******END inblock
			
			function(queryData, groupName)
			{
				if(!queryData){
					thisObj.resetData();
					return;
				}
				
				queryData.printQueryData();			
				
				var OutBlock1 = queryData.getBlockData('OutBlock1');
				if(!OutBlock1) return;
			
				var totAccAmt = OutBlock1[0]['D1출금가능금액'];			
				
				thisObj.tmpDrawAllAmt = totAccAmt;
				thisObj.drawAmt.setText('');
				
				if(totAccAmt>0){
					callback.call();
				}else{
					AToast.show('출금가능 금액을 확인해주세요.');
					callback(null);
					return;
				}
				
				//queryData.printQueryData();				
			}//*******END outblock
					
		);
	});
};

//출금지정계좌세팅
FD2101_V11.prototype.doDepositAccInfoSet = function(infos)
{	var  thisObj = this;
	//TODO:edit here
	if(!infos) return;
	this.tmpDepositBankNm = infos['D1은행명'];
	this.tmpDepositAccNum = infos['D1은행계좌번호'];
	this.depositBankCd = infos['D1은행코드'];
	
	//예금주명 세팅
	this.doSendData_SDPKT360(infos,function(oBlock){
		if(!oBlock){ 
			thisObj.drawAllAmt.setText(thisObj.tmpDrawAllAmt);
			return;		
		}
		else{
			this.depositAccNm.setText(oBlock['D1수취인명']);
			this.drawAllAmt.setText(this.tmpDrawAllAmt);
			this.depositBankNm.setText(this.tmpDepositBankNm);
			this.depositAccNum.setText(this.tmpDepositAccNum);
		}
	});
};
	
FD2101_V11.prototype.doSendData_SDPKT360 = function(infos,callback){
	
	var thisObj = this,
		cont = thisObj.getContainer(),
		cipherData = thisObj.secureTxf.getCipherData();
	
	//20180130
	var checkObj = {
		svcId : 'SDPKT360',
		accNo : thisObj.accDbx.getSelectedItemData()['D1계좌번호']
	};
	
	/************************************/	
	//비동기콜백 글로벌에 저장
	thisObj.afterCallback = callback;
	/************************************/
	
	//보안키패드 설정, 오류코드 설정 추후 확인 필요
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
	theApp.accNetManager.addSkipErrorCode('SDPKT360', '3130');
		cont.sendData('SDPKT360', function(queryData, groupName){
		queryData.setHeaderInfo({
			FUNC_KEY_LST: 'C'
		});
		
		var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1카드회사번호'] = '';
			InBlock1['D1카드계좌번호'] = '';
			//InBlock1['D1카드유형코드'] = cont.doMakeOtpGubun2Option(cont.otpId, cont.gubun2); 
			//앞자리 1Byte : 보안매체구분(S.보안카드, O.OTP, 그외.SPACE), 뒷자리 1Byte : 사기예방인증구분(1.단말기지정, 2.SMS통보, 3.SMS인증, 4.2ch인증, 그외,SPACE)
			InBlock1['D1카드유형코드'] = '';
			InBlock1['D1카드발급건수'] = '';
			InBlock1['D1책임자카드회사번호'] = '';
			InBlock1['D1책임자카드계좌번호'] = '';
			InBlock1['D1책임자카드유형코드'] = ''; //30:책임자카드, 60:승인카드
			InBlock1['D1책임자카드발급횟수'] = '';
			InBlock1['D1승인요청일'] = '';	//MetaInfo.fnGetToday('NUMDATE');
			InBlock1['D1승인처리ID'] = '';
			InBlock1['D1최종승인자ID'] = '';
			InBlock1['D1승인사용자명'] = '';
			InBlock1['D1승인자추가메시지'] = '';
			InBlock1['D1중계은행코드'] = ''; //앞을 '0'으로 채움, 예) 국민은행 '004'
			InBlock1['D1출금계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];	
			InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;
			InBlock1['D1출금금액'] = '1';
			InBlock1['D1입금은행코드'] = infos['D1은행코드'];
			InBlock1['D1은행계좌번호'] = infos['D1은행계좌번호'];
			InBlock1['D1수취인명'] = thisObj.accDbx.getSelectedItemData()['D1계좌명'];	
			InBlock1['D1은행이체비밀번호'] = '';
			InBlock1['D1출금유형'] = '1'; //1:예수금출금, 2:금액매도출금, 3:좌수매도출금, 4:전액출금, 5:환매전액출금, 6:채권원리금출금, 7:정산차금출금, 8:현금증거금출금
			InBlock1['D1투신펀드코드'] = '';
			InBlock1['D1의뢰인명'] = ''; //thisObj.htsUserInfo['D1고객명']; //출금인명
			InBlock1['D1전화국번호'] = '';
			InBlock1['D1전화지역번호'] = '';
			InBlock1['D1전화일련번호'] = '';
			InBlock1['D1수수료구분'] = '';
			//InBlock1['D1지연이체구분'] = thisObj.gyechInfo['D1지연이체구분']; //지연이체정보 //11.지연이체약정(지연이체), 12.지연이체약정 즉시이체(동일인대체), 13.지연이체약정 즉시이체(약정금액이하), 14.지연이체약정 즉시이체(즉시이체지정계좌), 그 외 : 디폴트 : 00 or SPACE
			InBlock1['D1지연이체구분'] = '';
			InBlock1['D1지연이체시간'] = ''; //HHMM (현재 미사용.디폴트 : 0000 or SPACE)
			InBlock1['D1지연이체구분코드'] = '';
			InBlock1['D1필러200'] = '';
			queryData.putPwInfo('InBlock1', 'D1비밀번호');	
			//	theApp.setBriefSign(queryData);	
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName) {
			
			var errcode = this.getLastError('errCode'),
				errMsg = this.getLastError('errMsg');
			
			//if(afc.isSimulator) queryData.printQueryData();
			
			if(errcode>=1000)
			{
				if(errcode == 3130) {
					if(!queryData)
					{	
						var errorData = this.getLastError();
						var msg = errorData.errMsg.replace('콜센터', '고객지원센터') + '(' + errorData.trName + ', ' + errorData.errCode + ')';
						theApp.alert(msg, null, '메시지');		
					} else {
						
						var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
						var msg = OutBlock1['D1은행메시지내용'] + '(' + 'SDPKT360' + ', ' + OutBlock1['D1은행응답코드'] + ')';
						theApp.alert(msg, null, '메시지');	
					}
				}
				//if(afc.isSimulator) alert([this.getLastError('errMsg'), ':', qrName ,'-', errcode].join(''));
				callback(null);
			}				
			
			if(!queryData)
			{	
				thisObj.resetData();
				if(afc.isSimulator) afc.log('queryData null!');
				callback(null);
			}else{
		
				if(afc.isSimulator) queryData.printQueryData();
				var oBlock = queryData.getBlockData('OutBlock1')[0];	
			}
			
		});
	});
};

//비동기 응답 데이터 수신부 override
FD2101_V11.prototype.afterOutBlockData = function(queryData, groupName, trName, manager)
{	
	
	var thisObj = this,
		errCode = '1000',
		packetType = manager.rcvBuf.getByte(OS_CH_TG_TP);		
	
	//에러처리확인
	
	//계정계 지연처리 TR응답
	if(packetType==PACKET_TYPE.E)
	{
		if(trName=='SDPKT360')
		{
			//코드저장
			errCode = manager.errorData.errCode;
		
			//비정상(오류)
			if(errCode>=1000)
			{	
				//if(afc.isSimulator) afc.log([manager.errorData.errMsg, ' : ',  errCode].join(''));
				//AToast.show(this.getLastError('errMsg'));
			}			
			
			//queryData.printQueryData();	
			
			if(!queryData)
			{
				thisObj.afterCallback(null);
			}
			else
			{
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
			
				//queryData.printQueryData();		
				thisObj.afterCallback(OutBlock1, errCode);
					
				/*if(Utils.leadingZeros(OutBlock1['D1은행응답코드'],4) != 0000){
					//은행메세지 처리
					theApp.commMsgBox.addItem('['+OutBlock1['D1은행응답코드']+']'+OutBlock1['D1은행메시지내용'],OutBlock1['D1은행응답코드']);
					indx = theApp.commMsgBox.element.options.length;
					theApp.commMsgBox.selectItem(indx-1);									
					thisObj.nextBtn.enable(false);

				}	*/
					
			}
		}
	}
};

//다음버튼클릭
FD2101_V11.prototype.onButton3Click = function(comp, info)
{
	//TODO:edit here
	//var thisObj = this;
	var cipherData = this.secureTxf.getCipherData();
	var fundCd = ''; 				    //투신펀드코드	
	var tmpAccNo = this.accDbx.getSelectedItemData()['D1계좌번호']; 
	var tmpAccPwdNo = this.secureTxf; 	//비밀번호
	
	if(!afc.isSimulator)
	{
		if(!cipherData)
		{
			AToast.show('계좌 비밀번호를 입력하세요.');
			this.secureTxf.addClass('active');
			return;	
		}
	}

	if(!this.drawAllAmt.getText())
	{
		AToast.show('계좌번호를 다시 선택해주세요.');
		this.accDbx.addClass('active');
		return;	
	}
	
	if(this.drawAllAmt.getText()==0)
	{
		AToast.show('출금가능금액을 확인해주세요.');
		return;	
	}
	
	if(this.drawAllAmt.getText().trim().length < 1)
	{
		AToast.show('출금가능금액이 없습니다.');
		return;	
	}
	
	if(!this.drawAmt.getText()||this.drawAmt.getText().trim().length < 1)
	{
		AToast.show('보내실 금액을 입력해주세요.');
		this.drawAmt.addClass('active');
		return;	
	}	
	
	if(this.drawAmt.getText()==0 )
	{
		AToast.show('보내실 금액을 확인해주세요.');
		this.drawAmt.addClass('active');
		return;	
	}
	
	this.cnt = this.getContainer();
	
	//출금은행 세팅
	this.cnt.drawAmt1 = this.drawAmt.getText(); 		   //출금금액
	this.cnt.drawAccNum1 = tmpAccNo; //출금계좌번호
	this.cnt.drawAccPwdNum1 = tmpAccPwdNo; //출금계좌비밀번호
	
	//출금지정계좌
	this.cnt.depositAccNm1 = this.depositAccNm.getText();       //입금계좌명(입금주) or 상대통장표시내용
	this.cnt.depositBankNm1 = this.depositBankNm.getText();   //입금계좌은행명
	this.cnt.depositAccNum1 = this.depositAccNum.getText(); //입금계좌번호
	//this.cnt.depositSignName1 = this.depositSignName.getText();   //상대통장표시내용
	this.cnt.depositBankCd1 = this.depositBankCd;
	
	//다음단계로 탭변경
	this.cnt.tbvManager.getActiveView().tvManager.changeTab('TabBtn2');
};

FD2101_V11.prototype.ondrawAmtTxtBlur = function(comp, info)
{

	//TODO:edit here
	this.drawAmt.removeClass('active');
};
