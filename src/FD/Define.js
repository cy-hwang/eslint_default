
var Define = 
{
	RELEASE : true,
	RT	: false,									//Real Test 여부 > 본가동 및 내부테스트일경우엔 false
	
	//phone develop - TEST: 앱(false), 시뮬(true) / EVER_SAFE: 앱(true), 시뮬(false) / LOG: afc.log on(true), off(false) / EVER_3rd: 3세대(true), 1세대(false)
	//CIPHER2CHAR: 보안키패드 복호화 방식 > if(true && Android) `char[]` else `String`
	TEST : false, EVER_SAFE: true, LOG: false, SAVE_LOG: false, EVER_3rd: true, CIPHER2CHAR: true,
	
	//simulator	
	//TEST : true, EVER_SAFE: false, LOG: true, EVER_3rd: false, CIPHER2CHAR: false,
	
	//프로젝트타입(1:MTSPhone, 2:MTSCheck, 3:MTSTablet)
	PRJ_TYPE:1, FD:1,
		
	VERSION: '1.48.0/0',
	TEMP_ID: 'koscommts!@',
	
	//10초안에 소켓이 다시 붙을시 공인인증 자동로그인 허용
	PERMITTIME: 10*1000,
	
	//버전 체크 타임(30분)
	VERCHECKTIME : 30*60*1000,
	
	//통신상태불량 회수 체크
	QUERY_FAIL_CNT : 2,
	
	//앱이 내려간뒤 10분 후 소켓 클로즈
	DISCONNECTTIME: 10*60*1000,
	
	QUERY_TIMEOUT: 30, //Second
	POLLING_TIME: 1000*30,
	
	MAP_KEY: 'AIzaSyAAWIp4C8tmZ7_btjeKyBO5olFccirR-PA',	//구글맵키
	WHOIS_API_KEY : '2016072517001174161525', 			//▶ WHOIS OpenAPI 사용 Key(해외IP 조회)
	
	CONN_CLSS_CODE: '13',			//접속분류코드
	TERM_CLSS_CODE : '@MTSA',		//단말분류코드 -> 하단에서 운영체제에 따라 값을 변경한다.
	
	ENC_PREFIX : 'PAD.V02',
	
	NOTICE_URL : 'http://webmts.koscom.co.kr',
	
	
	//테스트 분배 서버
	DIST_SERVER_IP :	'mtstest.koscom.co.kr',	//분배 서버 IP
	DIST_SERVER_PORT :	8060,				//분배 서버 Port
	DIST_SERVER_IP_SCD :	'mtstest.koscom.co.kr',	//두번째 분배 서버 IP
	DIST_SERVER_PORT_SCD :	15000,				//두번째 분배 서버 Port
	
	VERSION_SERVER : 'http://testvermts.koscom.co.kr',
	PUSH_URL: 'https://testpush.koscom.co.kr',	//push test url
	
	ACC_SERVER_IP :		'mtstest.koscom.co.kr',	//업무계 서버 IP
	ACC_SERVER_PORT :	8090,				//업무계 서버 Port
	
	NFTF_SERVER_IP :    'mtstest.koscom.co.kr',	//업무계 서버 IP
	NFTF_SERVER_IP_2 :  'mtstest.koscom.co.kr',	//업무계 서버 IP 2
	NFTF_SERVER_PORT :	8090,				//업무계 서버 Port
	
	/*
	//본가동 분배 서버
	//210.108.26.248	: first
	//210.108.26.247	: second
	//15000
	DIST_SERVER_IP :	'mtsdist01.koscom.co.kr',	//분배 서버 IP
	DIST_SERVER_PORT :	15000,				//분배 서버 Port
	DIST_SERVER_IP_SCD :	'mtsdist02.koscom.co.kr',	//두번째 분배 서버 IP
	DIST_SERVER_PORT_SCD :	15000,				//두번째 분배 서버 Port
	
	VERSION_SERVER : 'http://vermts.koscom.co.kr',
	PUSH_URL: 'https://push.koscom.co.kr',	//push real url
	
	ACC_SERVER_IP :		'mtsacp01.koscom.co.kr',	//업무계 서버 IP
	ACC_SERVER_IP_2 :		'mtsacp02.koscom.co.kr',	//업무계 서버 IP
	ACC_SERVER_PORT :	8090,				//업무계 서버 Port
	
	NFTF_SERVER_IP :		'mtsacp01.koscom.co.kr',	//업무계 서버 IP
	NFTF_SERVER_IP_2 :		'mtsacp02.koscom.co.kr',	//업무계 서버 IP
	NFTF_SERVER_PORT :	8090,				//업무계 서버 Port
	*/
	
	
	FILE_SERVER_IP :	'211.255.203.51',	//파일 서버 IP
	FILE_SERVER_PORT :	15309,				//파일 서버 Port
	
	
	INFO_SERVER_IP :	'211.255.203.58',	//정보계 서버 IP
	INFO_SERVER_PORT :	8080,				//정보계 서버 Port
	
	LOGIN_SNS : 0,
	LOGIN_ID : 1,
	LOGIN_CERT : 2,
	
	SUCCESS : '1',
	FAIL : '2',
	CANCEL : '3',
	
	NEWS_SCALE: 1.4,
	NOTI_SCALE: 1.8,
	
	RETRY_COUNT: 5,
	
	//SNS
	SNS_SERVER_URL : 			'http://webmts.koscom.co.kr',
	SNS_REDIRECT_PATH_KT : 		'/sns/redirectkt.html',			//카카오톡 리다이렉트 페이지
	SNS_REDIRECT_PATH_FB : 		'/sns/redirectfb.html',			//페이스북 리다이렉트 페이지
	SNS_REDIRECT_PATH_TW : 		'/sns/redirecttw.html',			//트위터 리다이렉트 페이지
	
};

Define.IMG_PACKET_SIZE = 8192;

if(afc.isIos)
{
	Define.NEWS_SCALE = 1.0;
	Define.NOTI_SCALE = 1.0;
}
