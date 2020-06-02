
/**
Constructor
Do not call Function in Constructor.
*/
function AccNetManager(name)
{
	QueryManager.call(this, name);

	//TODO:edit here
	
	//this.name = name;
	this.connectCallback = null;
	this.keyCallback = null;
	
	this.pollingTimer = null;
	this.permitTime = false;
	
	this.SBPGQ780Map = {};
}
afc.extendsClass(AccNetManager, QueryManager);

AccNetManager.CLOSETIME = 0;

AccNetManager.RMSACC = 
{
	'SDPAQ001': '계좌 예수금 상세조회',
	'SDPDT007': '계좌간 자금대체',
	'SDPKT300': '은행이체입금',
	'SDPKT360': '은행이체출금',
	'SONAQ109': '현물계좌잔고조회',
	'SONAQ200': '현물주문가능수량조회',//200, 201 인지 여부 확인
	'SONAQ216': '계좌별신용한도조회',
	'SONAT000': '현물주문',
	'SONAT001': '현물정정주문',
	'SONAT002': '현물취소주문',
	'SONAT040': '예약주문',
	'RMS72008': '연계신용거래담보'
};


AccNetManager.EXCPTRX = 
{
	'SACAT401': true,
	'SACAT727': true,
	'SBPGT315': true,
	'SBPGT361': true,
	'SBPGT370': true,
	'SBPGT377': true,
	'SDPDT007': true,
	'SDPDT071': true,
	'SDPKT300': true,
	'SDPKT360': true,
	'SDPNQ031': true,
	'SONAT000': true,
	'SONAT001': true,
	'SONAT002': true,
	'SONAT013': true,
	'SONAT040': true,
	'SONBT001': true,
	'SONBT002': true,
	'SONBT003': true,
	'SONBT004': true,
	'SONBT005': true
};



AccNetManager.prototype.setConnectCallback = function(connectCallback)
{
	this.connectCallback = connectCallback;
};

AccNetManager.prototype.onRetryConnected = function(success)
{
	if(success) 
	{
		if((new Date().getTime() - AccNetManager.CLOSETIME) < Define.PERMITTIME) this.permitTime = true;
		else this.permitTime = false;
	}
	
	if(this.connectCallback)
	{
		this.connectCallback(success);
		this.connectCallback = null;
	}
	
	if(success) 
	{
		
		this.addQueryListener(this);
		
		if(this.pollingTimer) 
		{
			clearInterval(this.pollingTimer);
			this.pollingTimer = null;
		}
		
		//!!!! 폴링 시작 !!!!
		var thisObj = this;		
		this.pollingTimer = setInterval(function()
		{
			if(Define.PRJ_TYPE==Define.MC) thisObj.sendChkPolling();
			else thisObj.sendPolling();
			
		}, Define.POLLING_TIME);
	}
};

/*
AccNetManager.prototype.onConnected = function(success)
{
};
*/

AccNetManager.prototype.onClosed = function()
{
	QueryManager.prototype.onClosed.call(this);
	AccNetManager.CLOSETIME = new Date().getTime();
	
	if(this.pollingTimer) 
	{
		clearInterval(this.pollingTimer);
		this.pollingTimer = null;
	}

	//AToast.show('AccNetManager closed.');
	//afc.log('AccNetManager closed.');
	this.removeQueryListener(this);
	
	if(!this.selfClose && !theApp.isPause)
		theApp.autoLoginProcess('onClosed 재접속중입니다...');
	//theApp.closeSocket(this.selfClose);
	
};

//수신버퍼에 데이터를 수신한 후 바로 호출된다.
AccNetManager.prototype.afterRecvBufferData = function(abuffer, packetSize, trName)
{
	//var packetType = abuffer.getByte(OS_CH_TG_TP);
	
	var errorData = this.getLastError();
	
	//에러 발생
	if(errorData.errCode>=1000)
	{
		AppManager.endOltp();
		
		//통신상태가 원활하지 않은 경우 바로 재접속 로직을 태운다.(query timeout)
		if(errorData.errCode==10001)
		{
			theApp.autoLoginProcess(errorData.errMsg, true);
			return;
		}
		
		if(trName == 'RMS72008' || this.isSkipErrorCode(trName, errorData.errCode)) return;
		
		//rms except error process
		if(errorData.errCode==9594)
		{
			//when fno is LIG and service is RMS
			if(theApp.systemInfo.fno=='072' && AccNetManager.RMSACC[errorData.trName]) 
			{
				errorData.errMsg = 'RMS 에러 메시지 추가';
				//AToast.show(errorData.errMsg);
				//return;
			}
		}
		
		//tmax 에러 발생, InfoNetManager 에 정의된 에러메시지 셋팅
		else if(errorData.errCode>9500 && errorData.errCode<9532)
			errorData.errMsg = InfoNetManager.infoErrMsg[errorData.errCode];
		
		var msg = errorData.errMsg.replace('콜센터', '고객지원센터') + '(' + errorData.trName + ', ' + errorData.errCode + ')';
		theApp.alert(msg, null, '메시지');
	}
	
	//정상
	else 
	{
		//if(errorData.errMsg) AToast.show(errorData.errMsg);
	}

};

//전송버퍼에 데이터를 채우기 전에 호출된다.
AccNetManager.prototype.beforeInBlockBuffer = function(queryData, groupName)
{
	//계정계 TR 은 무조건 암호화 함.
	queryData.enableFlag('encFlag');
	
	//sign test, 주석 풀기
// 	this.checkServiceToSign(queryData);
	
	//rms test
	//LIG 인 경우만 체크
	if(theApp.systemInfo.fno=='072') this.setRMSInfo(queryData);
	
	//header 예외처리 SV 셋팅
	if(AccNetManager.EXCPTRX[queryData.getQueryName()])
	{
		queryData.setHeaderInfo({'EXCP_TRX': 'SV'});
	}
};


/*
//수신된 데이터를 AQueryData 에 채운 후 호출된다.
AccNetManager.prototype.afterOutBlockData = function(queryData, groupName, trName)
{

};

//전송버퍼의 데이터를 전송하기 바로 전에 호출된다.
AccNetManager.prototype.beforeSendBufferData = function(abuffer, packetSize, trName)
{

};
*/


AccNetManager.prototype.setRMSInfo = function(queryData)
{
	//RMS 관련 서비스인지 
	if(AccNetManager.RMSACC[queryData.getQueryName()])
	{
		//계좌번호 > 입금계좌번호 or 출금계좌번호
	
		var blockData = queryData.getBlockData('InBlock1')[0];
		var accNo = blockData['D1계좌번호'];
		
		if(!accNo)
		{
			accNo = blockData['D1입금계좌번호'];
			if(!accNo) accNo = blockData['D1출금계좌번호'];
		}
		
		var accObj = theApp.accInfo.getAccData(accNo);
		
		//로그인 계좌조회 시점에 약정구분값이 있던 자리에 약정 코드 값을 셋팅함.
		var contCode = accObj['D1약정구분'];
		
		var setVal = '', CommdaCode = '';
		
		//약정 코드값이 셋팅된 계좌만....
		if(contCode=='0') return;

		//RMS 인 경우 암호화와 서명을 하지 않는다.
		queryData.pwInfoMap = null;
		queryData.signInfo = null;
		
		if(contCode=='2026' || contCode=='3093' || contCode=='3094' || contCode=='3096')
		{
			setVal = 'R';
			CommdaCode = 'VU';
		}
		else if(contCode=='3076' || contCode=='3077' || contCode=='3095')
		{
			setVal = 'H';
			CommdaCode = 'VV';
		}
		else if(contCode=='3126')
		{
			setVal = 'G';
			CommdaCode = 'VV';
		}
		else if(contCode=='1225')
		{
			setVal = 'G';
			CommdaCode = 'VW';
		}
		
		//SZ_TH_FILLER
		//14번째 항목 : Filler(공백)로 채워진 6자리(첫번째 바이트에 아래와 같이 세팅)
		
		//alert(CommdaCode + ': ' + setVal);
		
		//통신매체코드가 있는 쿼리만
		if(blockData['D1통신매체코드']!=undefined) blockData['D1통신매체코드'] = CommdaCode;
		
		queryData.setHeaderInfo({'TH_FILLER': setVal});
	}
};


AccNetManager.prototype.noticeDataManage = function(noticeTp, queryData)
{
	switch(noticeTp)
	{
		//알리미 공지
		case 0x4E: //N
		{
			/*
			if(queryData)
			{
				var blockData = queryData.getBlockData('OutBlock1')[0];
				AToast.show(blockData['D1공지내용']);
			}
			*/
		}
		break;
		
		//체결알림
		case 0x44:	//D
		{
			//NTCED001
			if(queryData)
			{
				var blockData = queryData.getBlockData('OutBlock1')[0];
				
				var goobun = '';
				if( blockData['D1매도수구분'] == "1") goobun = '매도';
				else if( blockData['D1매도수구분'] == "2") goobun = '매수';
				
				var sMsgCode = '';
				
				switch(blockData['D1체결구분'])
				{
					case '2':
					case '02':
					case '14':
					case '15':
					case '16':
						sMsgCode = '거부';
						break;
					case '03':
					case '3':
						if(blockData['D1정정취소구분'] == '1')
						{
							sMsgCode = '정정확인';
						}
						else if(blockData['D1정정취소구분'] == '2')
						{
							sMsgCode = '취소확인';
						}
						
						break;
					case '4':
					case '04':
						sMsgCode = '일부체결';
						break;
					case '5':
					case '05':
						sMsgCode = '전량체결';
						break;
					case '11':
						sMsgCode = '체결';
						break;
					case '12':
						sMsgCode = '정정';
						break;
					case '13':
						sMsgCode = '취소';
						break;
					case '33':
					case '35':
						sMsgCode = '잔량취소';
						break;
				}
				
				var jongmokNumber = blockData['D1종목번호'];
				
				var mid = jongmokNumber.substring(0, 1);
				var scode = jongmokNumber.substring(1, jongmokNumber.length);
				
				if(blockData['D1정정취소구분'] == '2')
				{
					var msg = goobun +' '+ sMsgCode + ' '+ theApp.masterInfo.getItemName(scode)+
						  ' <br>'+ afc.addComma(blockData['D1체결수량']) + '주 주문번호:'+parseInt(blockData['D1주문번호']);
				}
				else
				{
					var msg = goobun +' '+ sMsgCode + ' '+ theApp.masterInfo.getItemName(scode)+
						  ' <br>'+afc.addComma(blockData['D1체결가격'])+ '원 ' + afc.addComma(blockData['D1체결수량']) + '주 주문번호:'+parseInt(blockData['D1주문번호']);
				}
				
				theApp.receiveNoti();
				AToast.show(msg);
			
			}
		}
		break;
		
		//강제종료
		case 0x58:	//X
		{
			theApp.exitAppAlert('<span>다른 단말에서 동일한 ID로<br/>로그인 되었기 때문에 강제 종료합니다.</span>', true);
		}
		break;
	}
};

AccNetManager.prototype.loginProcess = function(dataSize)
{

	var svcId = this.rcvBuf.getOriString(OS_TH_SVC_ID, SZ_TH_SVC_ID);
	
	
//-------------------------------------------------------------------------------------------------------
//	for debug

//console.log('[' + svcId + '] 받았다!! Buffer <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
//this.rcvBuf.printBuffer(0, dataSize);
//-----------------------------------------------------------------------------------------------------
	
	
	if(svcId=='SCSFINL1')
	{
		//시스템 시간	x(17)
		//공개키 길이	9(4)
		//공개키		binary(가변)
		var keySize = this.rcvBuf.nextParseInt(4);
		var finalKey = this.rcvBuf.getBase64String(this.rcvBuf.getOffset(), keySize);
		
		//alert('첫 키 사이즈 : ' + keySize);
		
		//임시 주석
		
		var thisObj = this;
		
		//공개키를 세팅하여 암호화 준비 완료
		this.keyFinal(finalKey, function(result)
		{
			//alert('첫번째 키 파이널 : ' + result);
			if(result == -100)
			{
				thisObj.keyHandShake();
			}
			else
			{
				thisObj.keyCallback(Define.FAIL);
				thisObj.keyCallback = null;
			}
			
		});
	}
	else if(svcId=='SCSFINL2')
	{
		//시스템 시간	x(17)
		//공개키 길이	9(4)
		//공개키		binary(가변)
		var keySize = this.rcvBuf.nextParseInt(4);
		var finalKey = this.rcvBuf.getBase64String(this.rcvBuf.getOffset(), keySize);
		
		//alert('다시온 키 사이즈 : ' + keySize);
		
		//임시 주석
		
		var thisObj = this;
		
		//공개키를 세팅하여 암호화 준비 완료
		this.keyFinal(finalKey, function(result)
		{
			//alert('두번째 키 파이널 : ' + result);
			if(result > 0)
			{
				thisObj.keyCallback(Define.SUCCESS);
				thisObj.keyCallback = null;
			}
			else
			{
				thisObj.keyCallback(Define.FAIL);
				thisObj.keyCallback = null;
			}
			
		});
	}
};


AccNetManager.prototype.keyHandShake = function(keyCallback)
{
	var svc_id = 'SCSINIT1';
	
	if(keyCallback)
		this.keyCallback = keyCallback;
		
	else svc_id = 'SCSINIT2';

	var thisObj = this;
	
	this.keyInit(function(initKey)//Base64String
	{
		//console.log('세션키 : ' + initKey);
		
		//--------------------------------------------------
		//Base64String -> Uint8Array
		initKey = Base64.atobArray(initKey);
		
		//--------------------------------------------------
		//	공개키 요청 패킷 전송
		var abuf = thisObj.sndBuf;
		var sendLen = 0;

		//abuf.setNumString(OS_CH_TG_LEN, SZ_CH_TG_LEN, sendLen-SZ_CH_TG_LEN); //전문길이 필드를 제외한 길이(6)
		abuf.setChar(OS_CH_TG_TP, 'L'); //전문구분 -> L : 로그인 관련
		abuf.setByte(OS_CH_CMPR_TP, 0x30); //압축여부
		abuf.setByte(OS_CH_ENCR_TP, 0x30); //암호화여부
		abuf.setOriString(OS_CH_FILLER, SZ_CH_FILLER, ''); //데이터 옵셋, 사용 안함
		
		abuf.setOriString(OS_TH_SVC_ID, SZ_TH_SVC_ID, svc_id);	//서비스코드 -> TR 코드
		abuf.addNumString(4, initKey.length);					//key length
		sendLen = abuf.getOffset();
		abuf.copyBuffer(initKey, sendLen);				//initKey, binary
		
		sendLen += initKey.length;
		abuf.setNumString(OS_CH_TG_LEN, SZ_CH_TG_LEN, sendLen-SZ_CH_TG_LEN); //전문길이 필드를 제외한 길이(6)

		thisObj.sendBufferData(abuf, sendLen);
	});
};

//시뮬레이터 키교환스킵
AccNetManager.prototype.keySkip = function()
{
	//--------------------------------------------------
	//	공개키 요청 패킷 전송
	var abuf = this.sndBuf;
	var sendLen = SZ_COMMON_HEADER+SZ_TH_SVC_ID;

	abuf.setChar(OS_CH_TG_TP, 'L'); //전문구분 -> L : 로그인 관련
	abuf.setByte(OS_CH_CMPR_TP, 0x30); //압축여부
	abuf.setByte(OS_CH_ENCR_TP, 0x30); //암호화여부
	abuf.setOriString(OS_CH_FILLER, SZ_CH_FILLER, ''); //데이터 옵셋, 사용 안함

	abuf.setOriString(OS_TH_SVC_ID, SZ_TH_SVC_ID, '99999999');	//서비스코드 -> TR 코드
	abuf.setNumString(OS_CH_TG_LEN, SZ_CH_TG_LEN, sendLen-SZ_CH_TG_LEN); //전문길이 필드를 제외한 길이(6)

	this.sendBufferData(abuf, sendLen);
};


AccNetManager.prototype.reportSessionKey = function()
{
	/*
	var thisObj = this;

	this.encrypt(this.sessionKey, function(encString)
	{
		afc.log('encrypt sessionKey : ' + encString);
	
	
	
		//--------------------------------------------------
		//	session 키 전송
		var abuf = thisObj.sndBuf;
		var sendLen = SZ_COMMON_HEADER + SZ_TH_SVC_ID;
		
		//body
		var size = Base64.atobArray(encString, abuf.subArray(sendLen) );
		sendLen += size;

		abuf.setNumString(OS_CH_TG_LEN, SZ_CH_TG_LEN, sendLen-SZ_CH_TG_LEN); //전문길이 필드를 제외한 길이(6)
		abuf.setChar(OS_CH_TG_TP, 'L'); //전문구분 -> L : 로그인 관련
		abuf.setByte(OS_CH_CMPR_TP, 0x30); //압축여부
		abuf.setByte(OS_CH_ENCR_TP, 0x30); //암호화여부
		abuf.setString(OS_CH_FILLER, SZ_CH_FILLER, ''); //데이터 옵셋, 사용 안함
		//abuf.setString(OS_TH_SVC_ID, SZ_TH_SVC_ID, 'SCS00002');	//서비스코드 -> TR 코드
		//임시 테스트
		abuf.setString(OS_TH_SVC_ID, SZ_TH_SVC_ID, '99999999');	//서비스코드 -> TR 코드
		

		thisObj.sendBufferData(abuf, sendLen);
	});
	*/
	
	var thisObj = this;
	
	//임시 작업
		//--------------------------------------------------
		//	session 키 전송
		var abuf = thisObj.sndBuf;
		var sendLen = SZ_COMMON_HEADER + SZ_TH_SVC_ID;

		abuf.setNumString(OS_CH_TG_LEN, SZ_CH_TG_LEN, sendLen-SZ_CH_TG_LEN); //전문길이 필드를 제외한 길이(6)
		abuf.setChar(OS_CH_TG_TP, 'L'); //전문구분 -> L : 로그인 관련
		abuf.setByte(OS_CH_CMPR_TP, 0x30); //압축여부
		abuf.setByte(OS_CH_ENCR_TP, 0x30); //암호화여부
		abuf.setOriString(OS_CH_FILLER, SZ_CH_FILLER, ''); //데이터 옵셋, 사용 안함
		//abuf.setString(OS_TH_SVC_ID, SZ_TH_SVC_ID, 'SCS00002');	//서비스코드 -> TR 코드
		//임시 테스트
		abuf.setOriString(OS_TH_SVC_ID, SZ_TH_SVC_ID, '99999999');	//서비스코드 -> TR 코드

		thisObj.sendBufferData(abuf, sendLen);
		
		

		
//alert(afc.log('reportSessionKey'));

};


//계정계 폴링 전송
AccNetManager.prototype.sendPolling = function()
{
	//--------------------------------------------------
	//	공개키 요청 패킷 전송
	var abuf = this.sndBuf;
	var sendLen = 20;

	abuf.setChar(OS_CH_TG_TP, 'P'); //전문구분
	abuf.setByte(OS_CH_CMPR_TP, 0x30); //압축여부
	abuf.setByte(OS_CH_ENCR_TP, 0x30); //암호화여부
	abuf.setOriString(OS_CH_FILLER, 11, '012SCS00003'); //폴링

	abuf.setNumString(OS_CH_TG_LEN, SZ_CH_TG_LEN, sendLen-SZ_CH_TG_LEN); //전문길이 필드를 제외한 길이(6)

	this.sendBufferData(abuf, sendLen);
	
	//afc.log('AccNetManager:sendPolling');	
};

AccNetManager.prototype.sendChkPolling = function()
{
	return;
	
	this.sendProcessByName('ACT00014', null, null,
	function(queryData, groupName)
	{
		var blockData = queryData.getBlockData('InBlock1')[0];
		blockData['D1클라이언트구분'] = theApp.systemInfo.osGubun+'';
		blockData['D1세션키'] = '77777777777777777777777777777777777777777777';
		
		queryData.printQueryData();
		
	},
	function(queryData, groupName)
	{
		this.printLastError();
		
		if(!queryData) return;
		var outData = queryData.getBlockData('OutBlock1')[0];
		if(outData) afc.log(outData['D1로그인구분']);
	});
	
};


AccNetManager.prototype.checkMsg = function(queryData, blockName)
{
	if(!blockName) blockName = 'OutBlock1';
	var outBlock = queryData.getBlockData(blockName);
	/*if(outBlock && outBlock.length > 0)
	{
		if(!queryData.getContiKey()) AToast.show('조회가 완료되었습니다.');
	}
	else AToast.show('조회내역이 없습니다.');*/
	if(!outBlock || outBlock.length == 0) AToast.show(Message.NoneList);
};

//전자서명 및 본인확인 대상서비스 목록 셋팅
AccNetManager.prototype.setSBPGQ780 = function(queryData)
{
	var blockData = queryData.getBlockData('OutBlock1');
	
	var blockOne = null;
	
	for(var i=0; i<blockData.length; i++)
	{
		blockOne = blockData[i];
		this.SBPGQ780Map[blockOne['D1서비스ID']] = blockOne;
	}
	
};

AccNetManager.prototype.getSBPGQ780 = function(serviceName)
{
	return this.SBPGQ780Map[serviceName];
};

AccNetManager.prototype.checkServiceToSign = function(queryData)
{
	var info = this.SBPGQ780Map[queryData.getQueryName()];
	if(info)
	{
		var signType = parseInt(info['D1전자서명구분'], 10);
		
		//afc.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ : ' + signType + ' ' + queryData.getQueryName());
		queryData.setSignInfo(signType, theApp.certInfo.getCertDn(), theApp.certInfo.getCertPw());
	}
	else 
	{
		//afc.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ : info null ' + queryData.getQueryName());
		queryData.setSignInfo(null);
	}
};

AccNetManager.prototype.getIdentityAuthType = function(svcId)
{
	var info = this.SBPGQ780Map[svcId];
	
	if(info) return info['D1본인확인유형구분'];
	else return null;
};








