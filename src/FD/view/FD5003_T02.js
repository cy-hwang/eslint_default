
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_T02()
{
	AView.call(this);
}
afc.extendsClass(FD5003_T02, AView);


FD5003_T02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// Object
	this.cont = this.getContainer();
	
	// 스크롤 관련 영역
	this.view1 = this.findCompById("View1");
	
	// 계좌
	this.accView = this.findCompById('AccView').loadView;
	this.accView.setDelegator(this);
	this.cont.onAccViewControl(this.accView);
	
	// 펀드명
	this.fundName = this.findCompById('fundName');
	this.fundName2 = this.findCompById('fundName2'); // 클래스상세 전체명 추가 2019.09.24
	
	// 펀드그리드
	this.fundGrid = this.findCompById('fundGrid');
	
	// 집합투자규약
	this.button4 = this.findCompById('Button4');
	
	this.fundName.setShrinkInfo({maxChar:20, fontSize:24}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.fundName2.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5003_T02.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 계좌 초기화
	this.initAccView();
	
	// doInitAccInfo에서 계좌가 없을 시 아래 이벤트 실행
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		this.fnDoSendDataManage();
	}
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5003_T02.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5003_T02.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.view1.$ele.scrollTop(0);
};


// 계좌 초기화
FD5003_T02.prototype.initAccView = function()
{	
	// 계좌드롭박스
	this.accDbx = this.accView.accDbx;
	
	// 계좌 // doInitAccInfo에서 계좌가 있을 시 fnDoSendDataManage 함수실행
	this.accView.doInitAccInfo(this.cont.accTypeCd);
};


// 컴포넌트 초기화
FD5003_T02.prototype.onInitComponents = function()
{
	// 펀드정보
	this.fundInfo = this.cont.selectFundInfo;
	this.fundCd = this.fundInfo["D1투신펀드코드"];	// 펀드코드
	this.fundNm = this.fundInfo['D1한글투신펀드명'];	// 펀드명
	this.fundCt = this.fundInfo['D1운용전략내용'] + ' ' + this.fundInfo['D1위험관리전략내용']; // 펀드내용
	
	// 펀드 가입 유무
	this.fundJoinYN = 'N'; // N: 없음, Y: 있음
	
	// 펀드명 셋팅
	this.fundName.setText(this.fundNm);
	this.fundName2.setText(this.fundInfo['D1클래스상세 전체명']); // 클래스상세 전체명 추가 2019.09.24
	
	// 그리드 마스크 셋팅
	this.fundGrid.setMaskInfo( this.getGridMaskInfo() );
	
	// 집합투자규약 버튼명 셋팅
	var fundUrl = this.cont.fundCdURL(this.fundCd);
	this.button4.setText('집합투자규약');
	
	if(fundUrl['판매사코드'] == '0200') // 메리츠더우먼
	{
		this.button4.setText('정관');
	}
};


// 계좌번호 변경 시 이벤트
FD5003_T02.prototype.fnDoSendDataManage = function() 
{
	// 계좌번호 저장
	PensionCommon.setFundAcc(this);
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 서비스 조회
	this.sendSOFFQ422();
};


// 서비스 조회
FD5003_T02.prototype.sendSOFFQ422 = function()
{
	var thisObj = this;
	
	// 조회
	this.cont.sendData('SOFFQ422',
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1투신펀드코드'] = thisObj.fundCd;
			
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{
			if(!queryData)
			{
				return;
			}
			else // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
				
				if(!OutBlock1) return;
				
				if(OutBlock1['D1허들레이트2'] == "0.00000000" || OutBlock1['D1성과보수율2'] == "0.00000000")
				{		
					OutBlock1['D1허들레이트2'] = "해당없음";
					OutBlock1['D1성과보수율2'] = "해당없음";
				}
			
				OutBlock1['D1매입기준일명1'] = thisObj.getBaseDtNm(OutBlock1['D1매입기준일명1']);
				OutBlock1['D1매입기준일명2'] = thisObj.getBaseDtNm(OutBlock1['D1매입기준일명2']);
				OutBlock1['D1환매기준일명1'] = thisObj.getBaseDtNm(OutBlock1['D1환매기준일명1']);
				OutBlock1['D1환매기준일명2'] = thisObj.getBaseDtNm(OutBlock1['D1환매기준일명2']);
				
				// 서비스 조회
				thisObj.sendSOFFT101();
			}
		}
	);
};


// 서비스 조회
FD5003_T02.prototype.sendSOFFT101 = function()
{
	var thisObj = this;
	
	// 조회
	this.cont.sendData('SOFFT101',
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1처리구분'] = '2';
			InBlock1['D1기준일'] = MetaInfo.fnGetToday('NUMDATE');
			InBlock1['D1투신펀드코드'] = thisObj.fundCd;
			InBlock1['D1매매기준가'] = '0';
			InBlock1['D1과표기준가'] = '0';
			InBlock1['D1소득구분'] = '2';
			InBlock1['D1모집매도시작일'] = '0';
			InBlock1['D1모집매도종료일'] = '0';
			InBlock1['D1세금우대과표기준가'] = '0';
			InBlock1['D1비거주과표기준가'] = '0';
			InBlock1['D1펀드설정원본'] = '0';
			InBlock1['D1펀드순자산총액'] = '0';
			InBlock1['D1적용법률구분'] = '1';
			InBlock1['D1수정과표기준가'] = '2';
			
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{
		
			//2019.01.24 HCY Chrome v71에서 하단 항목 안그려지는 증상 > 강제 redraw를 통해 대응
			setTimeout(function(){ $("#FD5003_T02--View7").forceRedraw();}, 700);
			if(!queryData)
			{
				return;
			}
			else // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
				
				if(!OutBlock1) return;
				
				var money = OutBlock1['D1펀드순자산총액'];
				OutBlock1['D1펀드순자산총액'] = afc.addComma(parseInt(money)) + "원";
			}
		}
	);
};


// 매입기준일, 환매기준일 변경
FD5003_T02.prototype.getBaseDtNm = function(dtNm)
{
	var returnDtNm = "";
	var returnCheck = false;
	
	// 매입기준일, 환매기준일 관련 수정 사항
	var baseData = [
		["3시30분이전", "3시30분"],
		["5시이전", 	 "5시"],
		["1시30분이전", "1시30분"],
		["3시이전", 	 "3시"],
		["2시30분이전", "2시30분"],
		["3시20분이전", "3시20분"],
		["1시이전", 	 "1시"],
		["2시이전", 	 "2시"]
	];
			
	for(var i=0; i < baseData.length; i++)
	{
		var baseDataA = baseData[i][0];
		var baseDataB = baseData[i][1];
		
		if(dtNm.indexOf(baseDataA) > -1)
		{
			returnDtNm = dtNm.replace(baseDataA, baseDataB);
			returnCheck = true;
		}
	}
	
	if(!returnCheck)
	{
		returnDtNm = dtNm;
	}
	
	return returnDtNm;
};


// 그리드 마스크 셋팅 정보
FD5003_T02.prototype.getGridMaskInfo = function()
{
	var maskArray = [];
	
	for(var r=0; r<20; r++)	// Row
	{
		for(var c=0; c<2; c++) // Cell
		{
			var val = 0;
			
			if(r == 3 && c == 1) // 설정일
			{
				val = Utils.formatDotDate;
			}
			
			maskArray.push(val);
		}
	}
	
	return maskArray;
};


// 펀드특징 버튼 클릭
FD5003_T02.prototype.onButton1Click = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/FD5003_W03.lay', 'FD5003W03');		
	
	// 팝업으로 넘기는 파라미터
	win.w_fundContent = this.fundCt;
	
	// 팝업 오픈
	win.openAsDialog(this, 580, 500);
};


// 기준가 수익률 버튼 클릭
FD5003_T02.prototype.onButton2Click = function(comp, info)
{
	var fundUrl = this.cont.fundCdURL(this.fundCd);
	
	// 팝업 오픈
	var param = {
		viewUrl : fundUrl['기준가수익률'],
		title 	: "",
		btnType : "0"
	}
	PensionCommon.fullSizePopup(this, param);
};


// 보유종목 TOP10 버튼 클릭
FD5003_T02.prototype.onButton3Click = function(comp, info)
{
	var fundUrl = this.cont.fundCdURL(this.fundCd);
	
	// 팝업 오픈
	var param = {
		viewUrl : fundUrl['보유종목TOP10'],
		title 	: "",
		btnType : "0"
	}
	PensionCommon.fullSizePopup(this, param);
};


// 집합투자규약 버튼 클릭
FD5003_T02.prototype.onButton4Click = function(comp, info)
{
	var fundUrl = this.cont.fundCdURL(this.fundCd);
	var title = '집합투자규약';
	
	if(fundUrl['판매사코드'] == '0200') // 메리츠더우먼
		title = '정관';
	
	// 팝업 오픈
	var param = {
		viewUrl : fundUrl['집합투자규약'],
		viewPdfUrl : fundUrl['집합투자규약_pdf'],
		title 	: title,
		btnType : "0"
	}
	PensionCommon.fullSizePdfPopup(this, param);
};


// 투자설명서 버튼 클릭
FD5003_T02.prototype.onButton5Click = function(comp, info)
{
	var fundUrl = this.cont.fundCdURL(this.fundCd);
	
	// 팝업 오픈
	var param = {
		viewUrl : fundUrl['투자설명서'],
		viewPdfUrl : fundUrl['투자설명서_pdf'],
		title 	: "투자설명서",
		btnType : "0"
	}
	PensionCommon.fullSizePdfPopup(this, param);
};


// 간이설명서 버튼 클릭
FD5003_T02.prototype.onButton6Click = function(comp, info)
{
	var fundUrl = this.cont.fundCdURL(this.fundCd);
	
	// 팝업 오픈
	var param = {
		viewUrl : fundUrl['간이투자설명서'],
		viewPdfUrl : fundUrl['간이투자설명서_pdf'],
		title 	: "간이설명서",
		btnType : "0"
	}
	PensionCommon.fullSizePdfPopup(this, param);
};





//----------------------------------------------------//
//----------------- START 매수하기 ---------------------//
//----------------------------------------------------//
// 펀드매수 버튼 클릭
// 2019.01.30 연금펀드 메리츠주니어증권자 추가에 따라 미성년자만 가입가능하도록 변경(0050:연금 메리츠주니어펀드)
// 하단 주석 함수 대체
FD5003_T02.prototype.onBtnFundBuyClick = function(comp, info)
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
FD5003_T02.prototype.callbackSOFFQ365 = function(InBlock1, OutBlock1, OutBlock2)
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
FD5003_T02.prototype.callbackSACMT110_003 = function()
{
	// 투자자정보확인서 체크
	var param = {
		'펀드가입유무' : this.fundJoinYN,
		'팝업' : 'F'
	};
	this.cont.checkUserGrd(this, this.cont, param);
};


// checkUserGrd 콜백함수 (아니오 클릭 => 투자권유 불원 팝업)
FD5003_T02.prototype.callbackCheckUserGrd = function()
{
	// 투자권유 불원 팝업
	var win = AWindow.createWindow('FD/window/FD3202_W04.lay', 'FD3202W04');
	win.openAsDialog(this, 580, 640);
};


// 팝업에서 넘긴 결과
FD5003_T02.prototype.onWindowResult = function(result, windowObj)
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
FD5003_T02.prototype.callbackSACMT110_001 = function()
{
	var param = {
		'펀드가입유무' : this.fundJoinYN
	};
	this.cont.fundChangeTab(this, this.cont, param); 
};		
//----------------------------------------------------//
//------------------- END 매수하기 ---------------------//
//----------------------------------------------------//




