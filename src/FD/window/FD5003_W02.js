
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_W02(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5003_W02.lay';

	//TODO:edit here

}
afc.extendsClass(FD5003_W02, BaseWindow);


FD5003_W02.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5003_W02.prototype.onWillActive = function(reload)
{
	BaseWindow.prototype.onWillActive.call(this, reload);
	
	// Object
	this.cont = this.opener.getContainer();
	
	// 계좌
	this.accView = this.findCompById('AccView').loadView;
	this.accView.setDelegator(this);
	this.cont.onAccViewControl(this.accView);
	
	// 펀드 기본 설명
	this.fundTitle	= this.findCompById('lblFundTitle');	// 펀드명
	this.fundTitle2	= this.findCompById('lblFundTitle2');	// 클래스상세 전체명 추가 2019.09.24
	this.fundContent = this.findCompById('lblFundContent');	// 펀드내용
	
	this.fundTitle.setShrinkInfo({maxChar:17, fontSize:30}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.fundTitle2.setShrinkInfo({maxChar:20, fontSize:26}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5003_W02.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	// 계좌 초기화
	this.initAccView();
	
	// doInitAccInfo에서 계좌가 없을 시 아래 이벤트 실행
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		this.fnDoSendDataManage();
	}
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5003_W02.prototype.onWillDeactive = function(reload)
{		
	BaseWindow.prototype.onWillDeactive.call(this, reload);
};


// 계좌 초기화
FD5003_W02.prototype.initAccView = function()
{	
	// 계좌드롭박스
	this.accDbx = this.accView.accDbx;
	
	// 계좌 선택불가 처리
	this.accView.enable(false);	 
	//this.accDbx.addClass('combo_dis');
	
	// 계좌 // doInitAccInfo에서 계좌가 있을 시 fnDoSendDataManage 함수실행
	this.accView.doInitAccInfo(this.cont.accTypeCd);
};


// 컴포넌트 초기화
FD5003_W02.prototype.onInitComponents = function()
{	
	// 펀드정보
	this.fundInfo = this.cont.selectFundInfo;
	this.fundCd = this.fundInfo["D1투신펀드코드"];	// 펀드코드
	this.fundNm = this.fundInfo['D1한글투신펀드명'];	// 펀드명
	this.fundCt = this.fundInfo['D1운용전략내용'] + ' ' + this.fundInfo['D1위험관리전략내용']; // 펀드내용
	
	// 펀드 가입 유무
	this.fundJoinYN = 'N'; // N: 없음, Y: 있음
	
	// 펀드 기본 설명 셋팅
	this.fundTitle.setText(this.fundNm);
	this.fundTitle2.setText(this.fundInfo['D1클래스상세 전체명']); // 클래스상세 전체명 추가 2019.09.24
	this.fundContent.setText(this.fundCt);
};


// 계좌번호 변경 시 이벤트
FD5003_W02.prototype.fnDoSendDataManage = function() 
{
	// 계좌번호 저장
	PensionCommon.setFundAcc(this);
	
	// 컴포넌트 초기화
	this.onInitComponents();
};


// X 버튼 클릭
FD5003_W02.prototype.onBtnCloseClick = function(comp, info)
{
	this.close(0);
};


// 상세보기 버튼 클릭
FD5003_W02.prototype.onBtnFundDatailClick = function(comp, info)
{
	this.close(1);
};





//----------------------------------------------------//
//----------------- START 매수하기 ---------------------//
//----------------------------------------------------//
// 매수하기 버튼 클릭
// 2019.01.30 연금펀드 메리츠주니어증권자 추가에 따라 미성년자만 가입가능하도록 변경(0050:연금 메리츠주니어펀드)
// 하단 주석 함수 대체
FD5003_W02.prototype.onBtnFundBuyClick = function(comp, info)
{
	var thisObj = this;
	
	var param = {
		'D1비밀번호' 	: '1', // 비밀번호의 길이가 0이면 비밀번호 체크하는 부분에서 걸리므로 1 세팅
		'D1잔고유무여부' : ''
	};
				
	if(thisObj.cont.selectFundInfo["D1투신펀드코드"] == '0050'){		
		thisObj.cont.juniorSelAccNo = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
		
		thisObj.cont.userAgeCheck(thisObj, function(oBlock){
			if(oBlock){
				if(oBlock["D1미성년계좌여부"] == "0"){
					theApp.alert(
						[	 
							'메리츠주니어펀드는 가입당시','<br>',
							'20세 이하 투자자가 가입가능합니다.','<br>',
							,' '
						].join('')
						,
						function()
						{			
							// 확인 누른 후 실행할 내용
						}
						,''
					);				
				}else{
					// 서비스 조회 (펀드 가입 조회)	
					thisObj.cont.sendSOFFQ365(thisObj, thisObj.cont, param);		
				}
			}
		});
	}else{	
		// 서비스 조회 (펀드 가입 조회)	
		thisObj.cont.sendSOFFQ365(thisObj, thisObj.cont, param);
	}
};


// sendSOFFQ365 콜백함수
FD5003_W02.prototype.callbackSOFFQ365 = function(InBlock1, OutBlock1, OutBlock2)
{
	// 펀드 가입 유무 체크
	for(var i=0; i < OutBlock2.length; i++)
	{
		if(OutBlock2[i]["D1투신펀드코드"] == this.cont.selectFundInfo["D1투신펀드코드"])
		{
			this.fundJoinYN = "Y"; 
			break;
		}											
	}
	
	// 서비스 조회 (고객 성향 및 등급)
	var param = {
		'D1처리구분' : '3' // 조회
	};
	this.cont.sendSACMT110(this, this.cont, param);
};


// sendSACMT110 콜백함수
FD5003_W02.prototype.callbackSACMT110_003 = function()
{
	// 투자자정보확인서 체크
	var param = {
		'펀드가입유무' : this.fundJoinYN,
		'팝업' : 'T'
	};
	this.cont.checkUserGrd(this, this.cont, param);
};


// checkUserGrd 콜백함수 (아니오 클릭 => 투자권유 불원 팝업)
FD5003_W02.prototype.callbackCheckUserGrd = function()
{
	// 투자권유 불원 팝업
	var win = AWindow.createWindow('FD/window/FD3202_W04.lay', 'FD3202W04');
	win.openAsDialog(this, 580, 640);
};


// 팝업에서 넘긴 결과
FD5003_W02.prototype.onWindowResult = function(result, windowObj)
{
	var winId = windowObj.containerId;
	if(winId == 'FD3202W04')
	{
		if(result == 1) // 확인 클릭 
		{
			// 투자자정보 등록: O =>(투자권유구분: 불원 or 정보제공구분: 미제공)
			var param = {
				'D1처리구분' : '1' // 등록
			};
			this.cont.sendSACMT110(this, this.cont, param); 
		} 
	}
};	
	
	
// sendSACMT110 콜백함수
FD5003_W02.prototype.callbackSACMT110_001 = function()
{
	var param = {
		'펀드가입유무' : this.fundJoinYN
	};
	this.cont.fundChangeTab(this, this.cont, param); 
};		
//----------------------------------------------------//
//------------------- END 매수하기 ---------------------//
//----------------------------------------------------//	
	
	
	

