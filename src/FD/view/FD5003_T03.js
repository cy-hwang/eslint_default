
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_T03()
{
	AView.call(this);
	
	this.tbvManager = null;
	
}
afc.extendsClass(FD5003_T03, AView);


FD5003_T03.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.tabView = this.findCompById('CenterView');	
	
	this.tbvManager = new TabViewManager();	
	this.tbvManager.initManager(this.tabView, new RadioBtnManager(this));		

	this.tbvManager.addTab({url:'FD/view/FD5003_V01.lay', tabId:'FD5003_V01', name:'투자성향조회'});
	this.tbvManager.addTab({url:'FD/view/FD5003_V02.lay', tabId:'FD5003_V02', name:'펀드등급조회'});
	this.tbvManager.addTab({url:'FD/view/FD5003_V03.lay', tabId:'FD5003_V03', name:'펀드약관확인'});
	this.tbvManager.addTab({url:'FD/view/FD5003_V04.lay', tabId:'FD5003_V04', name:'투자자 체크리스트'});
	this.tbvManager.addTab({url:'FD/view/FD5003_V05.lay', tabId:'FD5003_V05', name:'펀드납입정보 입력'});
	this.tbvManager.addTab({url:'FD/view/FD5003_V06.lay', tabId:'FD5003_V06', name:'펀드매수정보 입력'});
	this.tbvManager.addTab({url:'FD/view/FD5003_V07.lay', tabId:'FD5003_V07', name:'펀드매수 완료'});
	
	this.tbvManager.addTab({url:'FD/view/FD5003_V08.lay', tabId:'FD5003_V08', name:'자동이체매수 약정등록'});
	this.tbvManager.addTab({url:'FD/view/FD5003_V09.lay', tabId:'FD5003_V09', name:'자동이체매수 완료'});
	this.tbvManager.addTab({url:'FD/view/FD5003_V10.lay', tabId:'FD5003_V10', name:'자동이체매수 약정등록'});
};

//화면이 활성화된 후 이벤트
FD5003_T03.prototype.onActiveDone = function(reload)
{	
	AView.prototype.onActiveDone.call(this, reload);
	
	// Object
	var cont = this.getContainer();	
	
	// 서브탭
	var subTabId = this.viewData.subTabId;
	if(subTabId)
	{
		this.tbvManager.changeTab(subTabId, false);
	}
};





//----------------------------------------------------//
//-------------- START 매매가능상태 조회 ----------------//
//----------------------------------------------------//
// 매매가능상태 조회
FD5003_T03.prototype.checkTradeState = function(obj, upperObj, returnParam)
{
	var thisObj = obj;
	var contTab = upperObj;
	var cont = upperObj.getContainer();
	
	// 영업일인지 아닌지 체크
	var param = {
		'현재서버시간' : null,
		'영업일자상태' : null, // 0: 영업일X, 1: 영업일O
		'매매가능상태' : null, // 1: 일반펀드매수매도, 2: 예약펀드매수매도, 3: 펀드매수불가
		'자동이체상태' : null, // 2018.11.06 추가 // 0: +1영업일, 1: +2영업일
		'처리구분코드' : returnParam
	};
	contTab.checkBizNextDay(thisObj, contTab, param);
};


// 영업일자상태 조회
FD5003_T03.prototype.checkBizNextDay = function(obj, upperObj, param)
{
	var thisObj = obj;
	var contTab = upperObj;
	var cont = upperObj.getContainer();
	
	var bizDate = theApp.userInfo.get('BizDt'); // 영업일자
	var localNowDate = MetaInfo.fnGetToday('NUMDATE'); // 현재일자
	
	if(bizDate == localNowDate) // 영업일O
	{
		param['영업일자상태'] = 1;
	}
	else // 영업일X
	{
		param['영업일자상태'] = 0;
	}
	contTab.checkNowTime(obj, upperObj, param);
};


// 현재서버시간 조회
FD5003_T03.prototype.checkNowTime = function(obj, upperObj, param)
{
	var thisObj = obj;
	var contTab = upperObj;
	var cont = upperObj.getContainer();
	
	// 조회
	cont.sendData('SSSSQ903',
		function(queryData, groupName)
		{
		
		},
		function(queryData, groupName)
		{
			var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
			var serverTime = OutBlock1['D1서버시간'];
			
			param['현재서버시간'] = serverTime.substring(8,14);
			theApp.setTimeInfo( param['현재서버시간'] );		
			
			contTab.returnNowTradeState(obj, upperObj, param);
		}
	);
};


// 매매가능상태 리턴
FD5003_T03.prototype.returnNowTradeState = function(obj, upperObj, param)
{
	var thisObj = obj;
	var contTab = upperObj;
	var cont = upperObj.getContainer();

	var nowTime = param['현재서버시간'];
	var bizDtSt = param['영업일자상태']; // 0: 영업일X, 1: 영업일O
	var trdSt 	= param['매매가능상태']; // 1: 일반펀드매수매도, 2: 예약펀드매수매도, 3: 펀드매수매도불가
	var timeSt	= param['자동이체상태']; // 2018.11.06 추가 // 0: +1영업일, 1: +2영업일
	
	// 2018.11.06 추가(적립식-매일: 자동이체매수 약정등록)
	if(param['처리구분코드'] == 'FD5003V10_INIT' || param['처리구분코드'] == 'FD5003V10_CLICK') 
	{
		// timeSt ==> 자동이체상태 
		// 0: 영업일 15:30분 이전은 +1영업일부터 자동이체
		// 1: 공휴일인 경우와 영업일 15:30분 이후는 +2영업일부터 자동이체
		
		if(bizDtSt == 0) // 영업일X
		{
			timeSt = 1;
		}
		else if(bizDtSt == 1) // 영업일O
		{
			if(nowTime <= 153000)
			{					
				timeSt = 0;
			}
			else if(nowTime > 153000)
			{
				timeSt = 1;
			}
		}
	}
	else
	{
		// trdSt ==> 매매가능상태 
		// 1: 일반펀드매수매도 
		// 2: 예약펀드매수매도 
		// 3: 펀드매수매도불가
		// 4: 당일예약펀드매수매도
		
		if(bizDtSt == 0) // 영업일X
		{
			if(nowTime >= 230000 || nowTime <= 070000) // 펀드매수매도불가
			{
				trdSt = 3; 
			}
			else // 예약펀드매수매도
			{ 
				trdSt = 2;   
			}
		}
		else if(bizDtSt == 1) // 영업일O
		{
			if(nowTime > 230000 || nowTime < 070000) // 펀드매수매도불가
			{
				trdSt = 3; 
			}
			else if(nowTime >= 090000 && nowTime <= 170000) // 일반펀드매수매도
			{
 				trdSt = 1;
			}
			else if(nowTime > 170000 && nowTime <= 230000) // 예약펀드매수매도
			{
				trdSt = 2;
			}
			else if(nowTime >= 070000 && nowTime < 090000) // 2020.03.31 06:00~09:00 당일예약펀드매수매도 추가
			{
				trdSt = 4;
			}
		}
	}
	
	param['매매가능상태'] = trdSt;
	param['자동이체상태'] = timeSt;
	
	// 콜백함수실행
	thisObj.callbackCheckTradeState(param);
};


// 펀드매수매도불가안내팝업
FD5003_T03.prototype.tradeDisablePopup = function()
{
	// 팝업
	theApp.alert(
		'펀드매매 이용시간은<br/>'
			+ '오전 7시~오후23시까지<br/>'
			+ '(한국시간 기준)입니다.', 
		function()
		{
			// 뒤로가기
			theApp.goPrevPageCheck(false);
		}, ''
	);
};
//----------------------------------------------------//
//--------------- END 매매가능상태 조회 -----------------//
//----------------------------------------------------//





//----------------------------------------------------//
//-- START 부적합금융투자상품거래확인서 작성 필요 확인 조회 ---//
//----------------------------------------------------//
// 최종 고객 성향 및 등급
FD5003_T03.prototype.getUserGrade = function(gNm) // gNm: D1산출등급명
{
	var grade = {
		"안정형" 	 : 1,
		"안정추구형" : 2,
		"위험중립형" : 3,
		"적극투자형" : 4,
		"공격투자형" : 5
	};
	
	return grade[gNm];
};


// 펀드위험도 조회
FD5003_T03.prototype.checkFundDanger = function(obj, upperObj)
{
	var thisObj = obj;
	var contTab = upperObj;
	var cont = upperObj.getContainer();
	
	// 현재일자
	var nowDay = MetaInfo.fnGetToday('DATENUM');
	
	// 고객정보
	var userGrd = theApp.userInfo.get('UserGrade');
	var userBirth = userGrd['D1생년월일'];
	var userDrvtInvstTerm = userGrd['D1파생상품투자기간'];
	var userGrade = contTab.getUserGrade(userGrd['D1산출등급명']); // 고객등급
	
	// 펀드정보
	var fundKindCd = cont.selectFundInfo["D1펀드종류코드"];
	var fundDangerCd = cont.selectFundInfo["D1위험도코드"];
	
	
	// 고객 만 나이 구하기
	var userAge = 0;
	var userAgeYear = Number(nowDay.substring(0,4)) - Number(userBirth.substring(0,4));
	var userAgeMonth = Number(nowDay.substring(4,8)) - Number(userBirth.substring(4,8));
	
	userAge = userAgeYear;
	if(userAgeMonth < 0) userAge = userAgeYear - 1;
	
	
	// 고객등급과 펀드종류 위험등급 비교
	// 고객등급이 위험도코드등급보다 낮으면 부적합금융투자상품거래확인서 작성 필요 확인 조회
	if( userGrade >= Number(fundDangerCd) )
	{
		if( fundKindCd == '02' || fundKindCd == '04' || fundKindCd == '06' 
			|| fundKindCd == '08' || fundKindCd == '10' || fundKindCd == '12' 
			|| fundKindCd == '14' || fundKindCd == '16' || fundKindCd == '18' )
		{
			if( userAge >= 65 )
			{
				if( drvtInvstTerm >= 36 ) // 투자기간이 3년이상 => 가입가능
				{
					// 콜백함수실행
					thisObj.callbackCheckFundDanger();
				}
				else // 부적정 => 부적합보고서 작성 후 펀드가입 가능
				{
					contTab.checkNonReport(thisObj, contTab);
				}
			}
			else
			{
				if(drvtInvstTerm >= 12) // 투자기간이 1년이상 => 가입가능
				{
					// 콜백함수실행
					thisObj.callbackCheckFundDanger();
				}
				else // 부적정 => 부적합보고서 작성 후 펀드가입 가능
				{
					contTab.checkNonReport(thisObj, contTab);	
				}
			}
		}
		else
		{
			// 콜백함수실행
			thisObj.callbackCheckFundDanger();
		}
	}
	else // 부적정 => 부적합보고서 작성 후 펀드가입 가능
	{
		contTab.checkNonReport(thisObj, contTab);
	}
};


// 부적합금융투자상품거래확인서 등록여부 조회
FD5003_T03.prototype.checkNonReport = function(obj, upperObj)
{
	var thisObj = obj;
	var contTab = upperObj;
	var cont = upperObj.getContainer();
	
	var param = {
		'D1처리구분' : '3', // 조회
		'D1계좌번호' : thisObj.accDbx.getSelectedItemData()['D1계좌번호'],
		'D1종목번호' : cont.selectFundInfo['D1투신펀드코드']
	};
	contTab.sendSACMT111(thisObj, contTab, param);
};


// 서비스 조회 (부적합금융투자상품거래확인서 등록 및 조회)
FD5003_T03.prototype.sendSACMT111 = function(obj, upperObj, param)
{
	var thisObj = obj;
	var contTab = upperObj;
	var cont = upperObj.getContainer();

	// 조회일시 투자자확인서 등록내역이 없다는 에러메시지 스킵처리
	if(param['D1처리구분'] == '3')
	{		
		theApp.accNetManager.addSkipErrorCode('SACMT111', '3956');
	}

	// 조회
	cont.sendData('SACMT111',
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			
			// D1처리구분 (1: 등록, 2: 정정, 3: 조회)
			if(param['D1처리구분'] == '1')
			{
				queryData.setHeaderInfo({
					FUNC_KEY_LST: '5'
				});
				
				InBlock1['D1처리일'] = MetaInfo.fnGetToday('NUMDATE');
			}
			else if(param['D1처리구분'] == '2')
			{
				
			}
			else if(param['D1처리구분'] == '3')
			{
				queryData.setHeaderInfo({
					FUNC_KEY_LST: 'C'
				});
				
				InBlock1['D1처리일'] = '';
			}
			
			InBlock1['D1처리구분'] = param['D1처리구분'];
			InBlock1['D1확인구분'] = '';
			InBlock1['D1실명확인번호'] = '';
			InBlock1['D1계좌번호'] = param['D1계좌번호'];
			InBlock1['D1비밀번호'] = '';
			InBlock1['D1종목번호'] = param['D1종목번호'];
			InBlock1['D1처리일련번호'] = '0';
			
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{			
			var errCode = this.getLastError('errCode'); 		
			var errMsg = this.getLastError('errMsg');
			
			var returnval = null;
			
			if(param['D1처리구분'] == '3')
			{
				returnval = errCode;
			}
			else
			{
				if(queryData != null)
				{
					if(afc.isSimulator) queryData.printQueryData();
					
					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];			
					
					if(!OutBlock1) returnval = null;
					else returnval = OutBlock1;
				}
				else
				{
					returnval = null;
				}
			}
			
			// 콜백함수실행
			if(param['D1처리구분'] == '1') contTab.callbackSACMT111_001(thisObj, contTab, returnval);
			else if(param['D1처리구분'] == '2') contTab.callbackSACMT111_002(thisObj, contTab, returnval);
			else if(param['D1처리구분'] == '3') contTab.callbackSACMT111_003(thisObj, contTab, returnval);
		}
	);
};


// sendSACMT111 콜백함수
FD5003_T03.prototype.callbackSACMT111_003 = function(obj, upperObj, errCode)
{
	var thisObj = obj;
	var contTab = upperObj;
	var cont = upperObj.getContainer();
	
	if(errCode == "0136")
	{
		// 콜백함수실행
		thisObj.callbackCheckFundDanger();
	}
	else if(errCode == "3956")
	{
		// 팝업
		theApp.confirm(
			'이 펀드를 매수하기 위해서는<br/>부적합금융투자상품거래서 작성이' 
				+ '<br/>필요합니다. 계속 진행하시겠습니까?',
			function(result)
			{
				if(result) // 예 클릭 => 부적합보고서 작성
				{
					thisObj.investInfoPopup();
				}
				else
				{

				}					
			}, '', ['예','아니오']
		);
	}
};


// 부적합금융투자상품거래확인서 등록
FD5003_T03.prototype.registNonReport = function(obj, upperObj)
{
	var thisObj = obj;
	var contTab = upperObj;
	var cont = upperObj.getContainer();
	
	var param = {
		'D1처리구분' : '1', // 등록
		'D1계좌번호' : thisObj.accDbx.getSelectedItemData()['D1계좌번호'],
		'D1종목번호' : cont.selectFundInfo['D1투신펀드코드']
	};
	contTab.sendSACMT111(thisObj, contTab, param);
};


// sendSACMT111 콜백함수
FD5003_T03.prototype.callbackSACMT111_001 = function(obj, upperObj, OutBlock1)
{
	var thisObj = obj;
	var contTab = upperObj;
	var cont = upperObj.getContainer();
	
	if(OutBlock1) // 성공
	{
		AToast.show("부적합 금융투자상품 거래 확인서 작성이 완료되었습니다.");
		thisObj.callbackCheckFundDanger();	
	}
	else // 실패
	{
		// 팝업
		theApp.alert(
			'부적합 금융투자상품 거래 확인서<br/>'
				+ '작성이 실패하였습니다.', 
			function()
			{
				
			}, ''
		);
	}
};
//----------------------------------------------------//
//--- END 부적합금융투자상품거래확인서 작성 필요 확인 조회 ----//
//----------------------------------------------------//




