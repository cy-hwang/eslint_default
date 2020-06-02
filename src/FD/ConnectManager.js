
/**
Constructor
Do not call Function in Constructor.
*/
function ConnectManager()
{
	this.connectCallback = null;
	this.connectCallbackQueue = new Array();
	this.orgCode = 'MT';
	this.userId = Define.TEMP_ID;
	this.closeTimer = null;
	this.closeTime = 10000;
	
	this.isNFTF = false;
}

ConnectManager.prototype.idRegConnection = function(userId, orgCode, ip, port, headerInfo, callback)
{
	var thisObj = this;
	
	Define.ACC_SERVER_IP = ip;
	Define.ACC_SERVER_PORT = port;
	
	setTimeout(function()
	{		
		if(thisObj.isNFTF) thisObj.headerInit_NFTF(userId, orgCode, callback, headerInfo);				
		else thisObj.headerInit(userId, orgCode, callback, headerInfo);				
		thisObj.connectAccNetServer();
		
	}, 1);
};

// 단발성 계정계 TR 호출시에 사용 initConnection 호출하기 이전 ( 로그인 이전)에만 사용!
// SendProcess 에 callback에서 꼭 stopAccForOneTimeQuery 호출!
ConnectManager.prototype.connectAccForOneTimeQuery = function(callback)
{
	var thisObj = this;
	
	this.connectCallbackQueue.push(callback);
	
	this.connectAccForOneTime();
	
};

ConnectManager.prototype.connectAccForOneTime = function()
{
	var thisObj = this;
	
	var headerTemp = {
		FIRM_NO			: theApp.systemInfo.fno,		//이용사 번호
		USER_ID			: '@NFTF_MTS',				//사용자 ID
		PRVT_IP			: theApp.prvtIP,			//사설IP
		CONN_CLSS_CODE	: Define.CONN_CLSS_CODE,	//접속분류코드
		TERM_CLSS_CODE	: '@NFTF',	//단말분류코드
		FUNC_KEY_LST	: 'C'
	};

	if(!this.netManager && this.connectCallbackQueue.length != 0){
		this.isNFTF = true;
		var callback = this.connectCallbackQueue.shift();
		this.idRegConnection('@NFTF_MTS', 'MT', Define.NFTF_SERVER_IP, Define.NFTF_SERVER_PORT, headerTemp, callback); 
	}

};

ConnectManager.prototype.stopAccForOneTimeQuery  = function()
{
	if(this.netManager)
	{
		this.netManager.stopManager(true);
		this.netManager = null;
		this.isNFTF = false;
	}
};

//커넥션 정보 초기화 및 커넥션 시작
ConnectManager.prototype.initConnection = function(userId, orgCode, callback)
{
	var thisObj = this;
	
	setTimeout(function()
	{
		thisObj.headerInit(userId, orgCode, callback);
		//1.분배서버에 접속
		thisObj.connectDistributionServer();
	
	}, 1);
};

ConnectManager.prototype.headerInit = function(userId, orgCode, callback, headerInfo)
{
	AppManager.beginOltp();
	//AIndicator.show();
	
	if(!headerInfo) AWindow.closeAll('MS000000');
	
	var thisObj = this;
	if(userId) this.userId = theApp.systemInfo.makeFirmUserId(userId);
	if(orgCode) this.orgCode = orgCode;
	
	//setTimeout이 있으면 초기화
	//this.clearCloseTimer();
	
	
	//syl 2018.03.29 재접속시에 addQueryListener 정보 유지
	var accnetQueryListener = null;
	
	//기존 계정계 커넥션 정보가 있으면 close	
	if(theApp.accNetManager)
	{
	
		//syl 2018.03.29 재접속시에 addQueryListener 정보 유지
		accnetQueryListener = theApp.accNetManager.queryListeners; 
		theApp.accNetManager.stopManager();
		theApp.accNetManager = null;
		
	}
	
	
	if(Define.PRJ_TYPE == Define.MT)
	{
		if(afc.isIos)
		{
			Define.TERM_CLSS_CODE = '@MTSI';
			Define.CONN_CLSS_CODE = '13';
		}
		else if(afc.isAndroid)
		{
			Define.TERM_CLSS_CODE = '@MTSA';
			Define.CONN_CLSS_CODE = '13';
		}
	}
	else if(Define.PRJ_TYPE == Define.MC)
	{
		
		if(afc.isIos)
		{
			Define.TERM_CLSS_CODE = 'IPH2';
			Define.CONN_CLSS_CODE = 'VT';
		}
		else if(afc.isAndroid)
		{
			Define.TERM_CLSS_CODE = 'AND2';
			Define.CONN_CLSS_CODE = 'VS';
		}
	}
	else
	{
		if(afc.isIos)
		{
			Define.TERM_CLSS_CODE = '@MTSI';
			Define.CONN_CLSS_CODE = '13';
		}
		else if(afc.isAndroid)
		{
			Define.TERM_CLSS_CODE = '@MTSA';
			Define.CONN_CLSS_CODE = '13';
		}
	}
	
	
	theApp.accNetManager = new AccNetManager('acc');
	theApp.accNetManager.setQueryBuffer(1024*128, 1024*128, "euc-kr");
	theApp.accNetManager.setTimeout(Define.QUERY_TIMEOUT);
	
	if(headerInfo) theApp.accNetManager.setHeaderInfo(headerInfo);
	else
	{
		theApp.accNetManager.setHeaderInfo(
		{
			FIRM_NO			: theApp.systemInfo.fno,			//이용사 번호
			USER_ID			: thisObj.userId,					//사용자 ID
			PRVT_IP			: theApp.prvtIP,			//사설IP
			CONN_CLSS_CODE	: Define.CONN_CLSS_CODE,	//접속분류코드
			TERM_CLSS_CODE	: Define.TERM_CLSS_CODE,	//단말분류코드
			FUNC_KEY_LST	: 'C'
		});
	}
	
	//syl 2018.03.29 재접속시에 addQueryListener 정보 유지
	if ( accnetQueryListener != null )
		theApp.accNetManager.queryListeners = accnetQueryListener;
		
		
	this.connectCallback = callback;
	
};


ConnectManager.prototype.headerInit_NFTF = function(userId, orgCode, callback, headerInfo)
{
	//AIndicator.show();
	
	if(!headerInfo) AWindow.closeAll('MS000000');
	
	var thisObj = this;

	this.netManager = new NetManager();
	this.netManager.setQueryBuffer(1024*128, 1024*128, "euc-kr");
	this.netManager.setTimeout(Define.QUERY_TIMEOUT); //15초

	if(headerInfo) this.netManager.setHeaderInfo(headerInfo);
	else
	{
		this.netManager.setHeaderInfo(
			{
				FIRM_NO		: theApp.systemInfo.fno,		//이용사 번호
				USER_ID			: '@NFTF_MTS',				//사용자 ID
				PRVT_IP			: theApp.prvtIP,			//사설IP
				CONN_CLSS_CODE	: Define.CONN_CLSS_CODE,	//접속분류코드
				TERM_CLSS_CODE	: '@NFTF',	//단말분류코드
				FUNC_KEY_LST	: 'C'
			});
	}
	
	this.connectCallback = callback;
};

//1.분배서버에 접속
ConnectManager.prototype.connectDistributionServer = function()
{
// 	afc.log ( "***syl:1.분배 서버에 접속"); 
	var thisObj = this;
	var distManager = new DistNetManager();
	distManager.getDistAddress(Define.DIST_SERVER_IP, Define.DIST_SERVER_PORT, function(ret, info)
	{
		if(ret==0)
		{
			distManager = new DistNetManager();
			//afc.log('fail msg : '+info);
			//첫번째 분배서버 접속 실패시 두번째 분배 아이피로 접속 시도
			distManager.getDistAddress(Define.DIST_SERVER_IP_SCD, Define.DIST_SERVER_PORT_SCD, function(ret, info)
			{
				if(ret==0)
				{		
					//afc.log('fail msg : '+info);
					//AIndicator.hide();
					AppManager.endOltp();
					
					if(thisObj.connectCallback) thisObj.connectCallback(Define.FAIL, '서버에 접속할 수 없습니다.<br/>고객지원센터로 문의하여 주십시오.<br/><br/>고객지원센터 : '+theApp.systemInfo.get('FirmCall')+'</span>');
					return;
				}
				_successDistServer(info);			
			});
		}
		else _successDistServer(info);
	
	}); 
	
	function _successDistServer(info)
	{
		//alert('Dist success : '+afc.log(info));
		
		Define.FILE_SERVER_IP = info[0];
		Define.FILE_SERVER_PORT = info[1];

		Define.ACC_SERVER_IP = info[2];
		Define.ACC_SERVER_PORT = info[3];

		Define.INFO_SERVER_IP = info[4];
		Define.INFO_SERVER_PORT = info[5];

		
		//2.계정계 서버에 접속
		
// 		afc.log ( "***syl:2.계정계 서버에 접속"); 
		thisObj.connectAccNetServer();
		
	}
	
};


/*
// ( 사용 안함)정보계서버에 접속 
ConnectManager.prototype.connectInfoNetServer = function()
{
	var thisObj = this;

	//2017.08 syl 수정 :  재시도 없음
	theApp.infoNetManager.enableRetry(Define.RETRY_COUNT);
	theApp.infoNetManager.startManager(Define.INFO_SERVER_IP, Define.INFO_SERVER_PORT);
	theApp.infoNetManager.setConnectCallback(function(result)
	{
		//2017.08 syl 수정 : 계정계 서버 우선 접속으로 변경 
		//afc.log ( "***syl:5.EverSafeManager");
		if(result)		
			EverSafeManager.getSessionIdAndTokenTask(thisObj);
		else
		{
			var infoErrMsg = '정보계 통신 문제로 시세 정보를 받을 수 없습니다.계좌 관련 업무는 정상적으로 사용 가능합니다.';
			afc.log(infoErrMsg);
			
			
			if(AppManager.isHidePatchView)
			{
				var win = theApp.alert(infoErrMsg, null, '종료');
				afc.log(win);
			}			
			else
				theApp.alert(infoErrMsg, null, '종료');
			
			EverSafeManager.getSessionIdAndTokenTask(thisObj);					
		}
	

	});
};
*/

//2.계정계 서버에 접속
ConnectManager.prototype.connectAccNetServer = function()
{
	var thisObj = this;
	
	var netManager = theApp.accNetManager;
	if(this.isNFTF){
		netManager = this.netManager;
		netManager.isShowProgress = false;
	}
	
	netManager.startManager(Define.ACC_SERVER_IP, Define.ACC_SERVER_PORT);
	netManager.setConnectCallback(function(result)
									   {

// 		afc.log ( "***syl:3.serverHandShake"); 
		if(result) thisObj.serverHandShake();
		else
		{
			//AIndicator.hide();
			AppManager.endOltp();

			if(thisObj.connectCallback){ 
				thisObj.connectCallback(Define.FAIL, '서버에 접속할 수 없습니다.<br/>고객지원센터로 문의하여 주십시오.<br/><br/>고객지원센터 : '+theApp.systemInfo.get('FirmCall')+'</span>');
				thisObj.connectCallback = null;
			}
		}
	});
};


//3.서버와 암호화키 교환
ConnectManager.prototype.serverHandShake = function()
{
	var thisObj = this;
	
	var netManager = theApp.accNetManager;
	if(this.isNFTF)
		netManager = this.netManager;
		
	if(Define.TEST)
	{
		netManager.keySkip();
		
		setTimeout(function()
		{
			handShakeCallback(true);
		}, 500);
		
	}
	else
	{
		netManager.keyHandShake(handShakeCallback);
	}
	
	function handShakeCallback(result)
	{
		if(result)
		{
// 			afc.log ( "***syl:4.EverSafeManager Get Session Id & Token"); 
			EverSafeManager.getSessionIdAndTokenTask(thisObj);			
		}
		else
		{
			//AIndicator.hide();
			AppManager.endOltp();
			
			if(thisObj.connectCallback){
				thisObj.connectCallback(Define.FAIL, '키 교환에 실패하였습니다.<br/>앱을 재시작해 주세요.');
				thisObj.connectCallback = null;
			}
		}
	
	}
	
};

//------------------------------------
//	앱 위변조 토큰 콜백 
//	EverSafeManager.getSessionIdAndTokenDone 에서 호출해 준다.
ConnectManager.prototype.everSafeCallback = function(sessionId, token, deviceId)
{
	var thisObj = this;
	
	var menuNo = null;
	var netManager = theApp.accNetManager;
	
	if(this.isNFTF){
		netManager = this.netManager;
		menuNo = 'nftf001';
	}
	//afc.log(sessionId + '-' + token + '-' + deviceId);
	
	if(!this.connectCallback)
	{
		//alert('everSafeCallback : Error, ' + sessionId + '-' + token + '-' + deviceId);
		return;
	}

// 	afc.log ( "***syl:5.EverSafeManager callback"); 
	//----------------------------------------------
	//에버세이프 3세대
	if(Define.EVER_3rd) {
	
		netManager.sendProcessByName('EVESF002', menuNo, null, 

		function(queryData)	{
			var inBlock1 = queryData.getBlockData('InBlock1');

			if(!token || token=='null') token = '';
			var tLength = token.length;
			
			if(tLength > 999) {
				tLength = "" + tLength;
			} else if(tLength > 99) {
				tLength = "0" + tLength;
			} else if(tLength > 9) {
				tLength = "00" + tLength;
			} else if(tLength == 0){
				tLength = "0000";
			} else {
				tLength = "000" + tLength;
			}

			inBlock1[0] = {
				"D1타입": "1",
 				"D1토큰길이": tLength,
				"D1토큰": token,
			};
			//queryData.enableFlag('encFlag');
		}, 

		function(queryData) {

			if(queryData) {
				var outBlock1 = queryData.getBlockData('OutBlock1')[0];

				//성공
				//2019.03.18 웹메일 > internal error 또한 정상처리 응답 < 장성호 실장
				if(outBlock1['D1타입'] == EverSafeManager.REQUEST_SUCCESS_TYPE3 || outBlock1['D1타입'] == EverSafeManager.REQUEST_INTERNAL_ERROR_TYPE3) {
					if(thisObj.connectCallback)	{
						thisObj.connectCallback(Define.SUCCESS);
						thisObj.connectCallback = null;
					}
				}

				//실패
				else {
					AppManager.endOltp();
					//EverSafeManager.relaunch();
					if(thisObj.connectCallback)	{
						thisObj.connectCallback(Define.FAIL, '통신 상태가 원활하지 않습니다.<br/>다시 시도해 주십시오(E3)');
						thisObj.connectCallback = null;
					}
				}
			}
		});
		
	} else {
		netManager.sendProcessByName('EVESF001', menuNo, null, 

		function(queryData) {
			var inBlock1 = queryData.getBlockData('InBlock1');

			if(!sessionId || sessionId=='null') sessionId = '';
			if(!token || token=='null') token = '';

			inBlock1[0] = {
				'D1세션ID': sessionId,
				'D1세션TOKEN': token,
				'D1디바이스ID': deviceId
			};
		}, 

		function(queryData) {

			if(queryData) {
				var outBlock1 = queryData.getBlockData('OutBlock1')[0];

	// 			afc.log('★'+outBlock1['D1결과코드'] + ':' + outBlock1['D1통신결과코드']+'★');

				//성공
				if(outBlock1['D1결과코드'] == EverSafeManager.REQUEST_SUCCESS) {
	// 				afc.log ( "***syl:6.EverSafeManager callback success");
					if(thisObj.connectCallback)	{
						thisObj.connectCallback(Define.SUCCESS);
						thisObj.connectCallback = null;
					}
				}

				//실패
				else {
					AppManager.endOltp();
					//EverSafeManager.relaunch();
					if(thisObj.connectCallback)	{
						thisObj.connectCallback(Define.FAIL, '통신 상태가 원활하지 않습니다.<br/>다시 시도해 주십시오(E)');
						thisObj.connectCallback = null;
					}

					//alert('앱 위변조 감지(EverSafe:' + token + ')');
					//theApp.alert( '통신 상태가 원활하지 않습니다.<br>다시 시도해 주십시오(EverSafe:' + token + ')' );

					//var win = AWindow.createWindow('MS/window/MS1005_W05.lay', 'EVER_W05');
					//win.infoMsg = '통신 상태가 원활하지 않습니다.<br>다시 시도해 주십시오(' + token + ')';
					//win.openAsDialog(thisObj);
				}
			}
		});
	}
};



/*
//(사용 안함) 오늘의 증시 화면 - 로그인 전 접속 Connection이 유지 되는 Case 
//------------------------------------
//오늘의증시 화면일 경우 클로즈 타이머를 셋팅해야함
ConnectManager.prototype.setCloseTimer = function(closeTime)
{
	this.clearCloseTimer();
	
	this.closeTimer = setTimeout(function(){
//*******DB 점검 시에 필요한 부분 -- 없으면 무한 루프 돔 ***********
		AppManager.prgRefCount=1;
		AppManager.hideProgress();
//*************************************************************
		if(theApp.infoNetManager) theApp.infoNetManager.stopManager();
		if(theApp.accNetManager) theApp.accNetManager.stopManager();
	}, (closeTime) ? closeTime : this.closeTime);
	
};


//------------------------------------
//로그인 성공시 클로즈타이머가 남아있을수 있으니 해제해야함
ConnectManager.prototype.clearCloseTimer = function()
{
	if(this.closeTimer)
	{
		clearTimeout(this.closeTimer);
		this.closeTimer = null;
	}
};
*/