
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_V08()
{
	AView.call(this);
}
afc.extendsClass(FD5003_V08, AView);


FD5003_V08.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// Object
	this.cont = this.getContainer();
	this.contTab = this.cont.tvManager.getActiveView();
	
	// 스크롤 관련 영역
	this.view3 = this.findCompById('View3');
	
	// 자동이체매수 약정등록
	this.lblStep = this.findCompById('lblStep'); // 단계
	this.lblFundName = this.findCompById('lblFundName'); // 펀드명
	this.lblFundName2 = this.findCompById('lblFundName2'); // 클래스상세 전체명 추가 2019.09.24
	
	// 은행정보
	this.bankDropBox 	= this.findCompById('bankDropBox'); 	// 출금은행
	this.transBankAcc 	= this.findCompById('transBankAcc'); 	// 계좌번호
	this.bankAccName 	= this.findCompById('bankAccName'); 	// 예금주
	
	// 자동이체매수 정보
	this.txtPayMoney 	= this.findCompById('txtPayMoney'); 	// 월납입금액
	this.txtPayDay 		= this.findCompById('txtPayDay');		// 월납입일
	this.txtTransPeriod = this.findCompById('txtTransPeriod'); 	// 이체기간
	
	// 약관 체크박스
	this.CheckBox1 = this.findCompById('CheckBox1'); 	// 약관동의
	this.CheckBox2 = this.findCompById('CheckBox2'); 	// 개인정보 수집 및 이용동의
	this.CheckBox3 = this.findCompById('CheckBox3'); 	// 개인정보 제 3자 제공동의
	
	// 등록하기 버튼
	this.btnAutoTransReg = this.findCompById('btnAutoTransReg');
	
	this.lblFundName.setShrinkInfo({maxChar:20, fontSize:24}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.lblFundName2.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V08.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 은행정보 초기화
	this.initBankView();
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 매수단계 및 펀드명 셋팅
	this.setFundStepInfo();
	
	// 자동이체매수 정보 셋팅
	this.setAutoTransferInfo();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5003_V08.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V08.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.view3.scrollTo(0);
};


// 은행정보 초기화
FD5003_V08.prototype.initBankView = function()
{	
	// 이전 화면에서 넘긴 파라미터 
	this.fundAccNo = this.viewData.accNo; // 서브계좌번호
	this.fundAccPw = this.viewData.accPw; // 계좌비밀번호
	this.fundAccNm = this.viewData.accNm; // 계좌명
	this.fundOrgAccNo = this.viewData.orgAccNo; // 계좌번호 
	
	// 은행
	this.bankInfo = []; // 은행정보
	this.bankInfo = BankInfo();
	
	// 선택한 은행 정보
	this.autoBankCode = null; // 은행코드
	this.autoBankName = null; // 은행이름
	
	// 명의 조회 여부
	this.selectAccNmYN = 'N'; // N: 하지않음, Y: 했음
	
	// 초기화
	this.bankDropBox.setEditText(""); 	// 출금은행
	this.transBankAcc.setText("");		// 계좌번호
	this.bankAccName.setText(""); 		// 예금주	
};


// 컴포넌트 초기화
FD5003_V08.prototype.onInitComponents = function()
{
	// 자동이체매수 정보 초기화
	this.txtPayMoney.setText("");		// 월납입금액
	this.txtPayDay.setText("");			// 월납입일
	this.txtTransPeriod.setText("");	// 이체기간
	this.transStart = null; 			// 이체시작일
	this.transEnd = null;				// 이체종료일
	
	// 약관 체크박스 체크 해제
	this.CheckBox1.setCheck(false); 
	this.CheckBox2.setCheck(false); 
	this.CheckBox3.setCheck(false);
	
	// 등록하기 버튼 비활성화
	this.btnAutoTransReg.enable(false);
	
	// 자동이체기간팝업 확인 여부 // 18.12.11 추가
	this.confirmYN = 'N'; // N: 하지않음, Y: 했음, N3691: errCode가 3691일때 확인 클릭
};


// 매수단계 및 펀드명 셋팅
FD5003_V08.prototype.setFundStepInfo = function()
{
	// 펀드매수단계 셋팅
	var txtStep = "<span class='fc_red3'>" + this.cont.fundStepNow + "</span>"
					+ "<span class='step'>/" + this.cont.fundStepAll + "단계</span>";
	this.lblStep.$ele.children().eq(0).html(txtStep);
	
	
	// 펀드명 셋팅
	var fundNm = this.cont.selectFundInfo["D1한글투신펀드명"];
	this.lblFundName.setText(fundNm);
	this.lblFundName2.setText(this.cont.selectFundInfo["D1클래스상세 전체명"]); // 클래스상세 전체명 추가 2019.09.24
};


// 자동이체매수 정보 셋팅
FD5003_V08.prototype.setAutoTransferInfo = function()
{
	// 이전 화면에서 넘긴 파라미터 
	this.M_money = this.viewData.M_money; 	// 월납입금액
	this.M_date = this.viewData.M_date; 	// 월납입일
	this.M_period = this.viewData.M_period; // 납입기간
	
	// 월납입금액
	this.txtPayMoney.setText(this.M_money);
	
	// 월납입일
	if(this.M_date.length == 1) this.M_date = "0" + this.M_date;
	this.txtPayDay.setText(this.M_date);	
	
	// 이체기간 계산 - 2019.01.03 날짜계산 신규소스로 변경 
	this.autoTransDateCalc2();
};


// 이체기간 계산 함수 - 2019.01.03 이전소스로 사용하지 않는 함수이나 예전 소스 체크 위해 남김
FD5003_V08.prototype.autoTransDateCalc = function()
{
	var nowDate = MetaInfo.fnGetToday('NUMDATE'); // 오늘 날짜
	
	var nowDateYear 	= nowDate.substring(0,4); // 현재 년	
	var nowDateMonth 	= nowDate.substring(4,6); // 현재 월
	var nowDateDay		= nowDate.substring(6,8); // 현재 일
	
	// 자동이체시작일 조합 변수
	var autoTransStartYear, autoTransStartMonth, autoTransStartDay, autoTransStart;
	
	// 자동이체종료일 조합 변수
	var autoTransEndYear, autoTransEndMonth, autoEndStartDay, autoTransEnd; 
		
	
	// 이체시작일 계산
	autoTransStartYear 	= nowDateYear;
	autoTransStartMonth = nowDateMonth;
	autoTransStartDay 	= nowDateDay;
	
	// 월납입일이 현재 날짜보다 앞인지 체크
	if( Number(nowDateDay) > Number(this.M_date))
	{ 
		if( Number(nowDateMonth) == 12 ) // 현재 12월인지 체크
		{ 		
			autoTransStartYear = Number(autoTransStartYear) + 1; // 년도증가
			autoTransStartMonth = 1; // 1월로 변경
		}
		else
		{
			autoTransStartMonth = Number(nowDateMonth) + 1; // 월 증가
		}						
	}
		
	// 월입력을 데이터 형식에 맞게 입력해줌
	if(autoTransStartMonth.toString().length == 1)
	{
		autoTransStartMonth = "0" + autoTransStartMonth;
	}
	
	autoTransStartDay = this.M_date;
	autoTransStart = autoTransStartYear.toString() 
					+ autoTransStartMonth.toString() + autoTransStartDay.toString();
	
	
	// 이체종료일 계산
	autoTransEndYear	= nowDateYear;
	autoTransEndMonth 	= nowDateMonth;
	autoEndStartDay 	= nowDateDay;
	
	// 펀드납입기간을 추가하여 계산
	var autoTransEndResult = Number(autoTransEndMonth) + Number(this.M_period);
	
	// 해당 년도, 월 계산
	if(autoTransEndResult > 12)
	{
		autoTransEndYear = Number(autoTransEndYear) + Number(parseInt(autoTransEndResult/12));
		
		if( Number(autoTransEndResult % 12) == 0)
		{
			autoTransEndYear = autoTransEndYear - 1; // 나누어떨어졌을경우 해당년도 넘어가지 않음
			autoTransEndMonth = 12; // 나누어떨어졌을 경우 12월로 변경
		}
		else
		{
			autoTransEndMonth = Number(autoTransEndResult % 12);
		}
	}
	else
	{
		autoTransEndMonth = autoTransEndResult;
	}
	
	// 현재 월부터 납입시작했을 시에 계산
	if( nowDateDay <= Number(this.M_date) )
	{
		autoTransEndMonth = Number(autoTransEndMonth - 1);
	}
	
	// 월입력을 데이터 형식에 맞게 입력해줌
	if(autoTransEndMonth.toString().length == 1)
	{
		autoTransEndMonth = "0" + autoTransEndMonth;
		
		//00월을 피하기 위해
		if(autoTransEndMonth == 0)
		{
			autoTransEndMonth = 12;
			autoTransEndYear = autoTransEndYear - 1;
		}
	}
	
	autoEndStartDay = this.M_date;
	autoTransEnd = autoTransEndYear.toString() 
					+ autoTransEndMonth.toString() + autoEndStartDay.toString();
	
	
	// 이체시작일, 이체종료일 셋팅
	this.transStart = autoTransStart;
	this.transEnd 	= autoTransEnd;
	
	// 이체기간 셋팅
	this.setAutoTransDate();
};

// 2018.01.03. 신규 이체기간 계산 함수로 변경
FD5003_V08.prototype.autoTransDateCalc2 = function()
{

	var nowDate2 = MetaInfo.fnGetToday('NUMDATE'); // 오늘 날짜			
	
	// 이체시작일과 이체종료일 계산 중간 월(Month)부분은 0~11(1월~12월) 자리로 계산되므로 -1 해줌	
	var calcStartDate = new Date(nowDate2.substring(0,4), Number(nowDate2.substring(4,6))-1, this.M_date);
		
	// 이체종료일 계산 시 이체기간을 더하게 되면 1개월 더 자동이체되므로 개월 계산시 -1 더해줌
	// 예) 이체시작일:2019.01.05, 이체기간:12개월, 이체종료일(2019.01.05) 가 되므로 이체종료일을(2018.12.05)로 변경	
	var calcEndDate = new Date(nowDate2.substring(0,4), Number(nowDate2.substring(4,6)) + Number(this.M_period)-2, this.M_date);
	
	// 'yyyyMMdd' 형태로 날짜를 변경
	var fomatStartDay = calcStartDate.format('yyyyMMdd');
	var fomatEndDay = calcEndDate.format('yyyyMMdd');
	
	// 계산값을 잠시 담기 위한 임시 변수
	var tempStartDate;
	var tempEndDate;	
		
	// 월납입일이 현재 날짜보다 앞인지 체크
	if(Number(nowDate2.substring(6,8)) > Number(this.M_date)){
		// 월납일일이 현재 날짜보다 앞이면 1개월씩 순연으로 월단위 입력에서 -1을 안함
		tempStartDate = new Date(fomatStartDay.substring(0,4), Number(fomatStartDay.substring(4,6)), fomatStartDay.substring(6,8));
		tempEndDate = new Date(fomatEndDay.substring(0,4), Number(fomatEndDay.substring(4,6)), fomatEndDay.substring(6,8));
	}else{
		// 월납일일이 현재 날짜보다 뒤이면 현재 월부터 이체되어야 하므로 월단위 입력에서 -1을 함
		tempStartDate = new Date(fomatStartDay.substring(0,4), Number(fomatStartDay.substring(4,6))-1, fomatStartDay.substring(6,8));
		tempEndDate = new Date(fomatEndDay.substring(0,4), Number(fomatEndDay.substring(4,6))-1, fomatEndDay.substring(6,8));	
	}
				
	// 계산이 완료된 값을 'yyyyMMdd' 형식으로 변환해서 담는 변수(최종)
	var compStartDate = tempStartDate.format('yyyyMMdd');
	var compEndDate = tempEndDate.format('yyyyMMdd');			
	
	// 이체시작일, 이체종료일 셋팅
	this.transStart = compStartDate;
	this.transEnd 	= compEndDate;	
	
	// 이체기간 셋팅
	this.setAutoTransDate();
				
};


// 이체기간 셋팅
FD5003_V08.prototype.setAutoTransDate = function()
{
	var formatStart = Utils.formatDotDate(this.transStart);
	var formatEnd = Utils.formatDotDate(this.transEnd);
	
	// 18.12.04 이체기간을 날짜에서 개월로 변경
	// this.txtTransPeriod.setText(formatStart + " - " + formatEnd);
	
	// 2019.01.03 연금펀드 매월 적립식 년단위로 입력값 세팅 변경(서버에는 개월로 들어감, 전페이지에서 개월 단위로 가져옴)
	this.txtTransPeriod.setText(this.M_period/12);
};


// 출금은행 팝업
FD5003_V08.prototype.onbankDropBoxActionUp = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/FD3202_W07.lay', 'FD3202W07');		
	
	// 팝업으로 넘기는 파라미터
	win.bankInfo = this.bankInfo;
	
	// 팝업 오픈
	win.openAsDialog(this);
};


// 팝업에서 넘긴 결과
FD5003_V08.prototype.onWindowResult = function(result, windowObj)
{
	var winId = windowObj.containerId;
	if(winId == 'FD3202W07')
	{
		if(result != 0)
		{
			// 팝업에서 넘긴 데이터로 셋팅
			this.autoBankCode = result[0];
			this.autoBankName = result[1];	
			
			this.bankDropBox.setEditText(this.autoBankName);
			this.bankDropBox.removeClass('active');
		}
	}
	/*else if(winId == 'FD3202W08')
	{
		if(result != 0)
		{
			// 체크박스 클릭
			this.CheckBox3.setCheck(true);
			this.onCheckBoxClick();
		}	
	}*/
};


// 텍스트 필드의 Blur 이벤트
FD5003_V08.prototype.onTextFieldBlur = function(comp, info)
{
	// active 클래스 제거
	comp.removeClass('active');
};


// 텍스트 필드의 Focus 이벤트
FD5003_V08.prototype.onTextFieldFocus = function(comp, info)
{
	var textFields = [this.transBankAcc];
	
	for(var i=0; i<textFields.length; i++)
	{
		textFields[i].removeClass('active');
	}
	
	// active 클래스 추가
	comp.addClass('active');
};


// 체크박스 클릭
FD5003_V08.prototype.onCheckBoxClick = function(comp, info)
{
	var chk1, chk2, chk3;
	
	chk1 = this.CheckBox1.getCheck();
	chk2 = this.CheckBox2.getCheck();
	chk3 = this.CheckBox3.getCheck();
	
	if(comp)
	{
		if(comp.getComponentId() == 'CheckBox1')
		{
			if(chk1) this.onButton4Click();
		}
		else if(comp.getComponentId() == 'CheckBox2')
		{
			if(chk2) this.onButton2Click();
		}
		else if(comp.getComponentId() == 'CheckBox3')
		{
			if(chk3) this.onButton3Click();
		}
	}
	
	if(chk1 && chk2 && chk3 && this.selectAccNmYN == 'Y')
	{
		this.btnAutoTransReg.enable(true);
	}
	else
	{
		this.btnAutoTransReg.enable(false);
	}
};


// 약관동의 클릭
FD5003_V08.prototype.onButton4Click = function(comp, info)
{
	// 팝업 오픈
	var param = {
		viewUrl : "http://www.meritzam.com/marketings/terms03.html",
		title 	: "약관동의",
		btnType : "0"
	}
	PensionCommon.fullSizePopup(this, param);
	
	// 체크박스 클릭
	this.CheckBox1.setCheck(true);
	this.onCheckBoxClick();
};


// 개인정보 수집 및 이용동의 클릭
FD5003_V08.prototype.onButton2Click = function(comp, info)
{
	// 팝업 오픈
	var param = {
		viewUrl : "http://www.meritzam.com/marketings/terms18.html",
		title 	: "개인정보 수집 및 이용동의",
		btnType : "0"
	}
	PensionCommon.fullSizePopup(this, param);
	
	// 체크박스 클릭
	this.CheckBox2.setCheck(true);
	this.onCheckBoxClick();
};


// 개인정보 제 3자 제공동의 클릭
FD5003_V08.prototype.onButton3Click = function(comp, info)
{
	// 팝업 오픈
	var win = AWindow.createWindow('FD/window/FD3202_W08.lay', 'FD3202W08');
	win.openAsDialog(this, '100%', '100%');
	
	// 체크박스 클릭
	this.CheckBox3.setCheck(true);
	this.onCheckBoxClick();
};





//----------------------------------------------------//
//-------------- START 은행 예금주 조회 -----------------//
//----------------------------------------------------//
// 동일명의인 확인 클릭
FD5003_V08.prototype.onbtnBankAccNameClick = function(comp, info)
{
	var thisObj = this;
	var cont = this.getContainer();
	
	var infos = [this.bankDropBox.getEditText(), this.transBankAcc.getText()];
	
	// 출금은행이 없으면
	if(this.bankDropBox.getEditText().length == 0)
	{
		AToast.show('출금은행을 선택하세요.');
		this.bankDropBox.addClass('active');
		return;
	}
	
	// 계좌번호가 없으면
	if(this.transBankAcc.getText().length == 0)
	{
		AToast.show('출금은행 계좌번호를 입력하세요');
		this.transBankAcc.addClass('active');
		return;
	}
	
	// 예금주명 세팅
	thisObj.sendSDPKT120(infos, function(oBlock){
		if(oBlock)
		{
			if(afc.isSimulator)
			{
				if(oBlock["D1예금주명"]) // 테스트
				{
					thisObj.bankAccName.setText( thisObj.fundAccNm );
					thisObj.selectAccNmYN = 'Y';
					thisObj.onCheckBoxClick();
				}
			}
			else
			{
				if(oBlock["D1예금주명"] == thisObj.fundAccNm)
				{
					thisObj.bankAccName.setText(oBlock["D1예금주명"]);
					thisObj.selectAccNmYN = 'Y';
					thisObj.onCheckBoxClick();
				}
				else
				{
					// 팝업
					theApp.alert(
						'본인명의의 타금융기관 계좌로<br/>자동이체 신청이 가능합니다.',
						function()
						{
							thisObj.autoTransNmFail();
						}, ''
					);
				}	
			}
		}
		else
		{
			thisObj.bankAccName.setText('');
			thisObj.selectAccNmYN = 'N';
			thisObj.onCheckBoxClick();
		}
	});
};


// 동일명의인 확인 실패
FD5003_V08.prototype.autoTransNmFail = function(infos, callback)
{
	this.bankAccName.setText('');
	this.selectAccNmYN = 'N';
	this.onCheckBoxClick();
};


// 은행계좌 본인명의 확인
FD5003_V08.prototype.sendSDPKT120 = function(infos, callback)
{
	var thisObj = this;
	var cont = this.getContainer();		
		
	//비동기 응답설정
	thisObj.doAddQueryListener();
			
	// 비동기콜백 글로벌에 저장
	thisObj.afterCallback = callback;
	
	// 조회
	cont.sendData('SDPKT120', 
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1은행코드'] = thisObj.autoBankCode; 
			InBlock1['D1은행계좌번호'] = thisObj.transBankAcc.getText();

			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName) 
		{
			if(afc.isSimulator) queryData.printQueryData();
			
			var errcode = this.getLastError('errCode');
			var errMsg = this.getLastError('errMsg');
								
			if(!queryData) //에러처리필요
			{
				if(afc.isSimulator) afc.log('queryData null!');
			}
			else // 성공
			{
				var oBlock = queryData.getBlockData('OutBlock1')[0];
			}
		}
	);	
};


// 비동기 응답 설정
FD5003_V08.prototype.doAddQueryListener = function()
{
	theApp.accNetManager.addQueryListener(this);
};


// 비동기 응답 설정 해지
FD5003_V08.prototype.doRemoveQueryListener = function()
{
	theApp.accNetManager.removeQueryListener(this);
};


// 비동기 응답 데이터 수신부 override
FD5003_V08.prototype.afterOutBlockData = function(queryData, groupName, trName, manager)
{
	var thisObj = this;
	var cont = this.getContainer();
	
	var errCode = '1000';
	var packetType = manager.rcvBuf.getByte(OS_CH_TG_TP);
	
	
	// 계정계 지연처리 TR응답
	// 지연이체 응답 수신
	if(packetType == PACKET_TYPE.E)
	{
		if(trName == 'SDPKT120')
		{								
			// 코드저장
			errCode = manager.errorData.errCode;
											
			// 비정상(오류)
			if(errCode>=1000)
			{
				AToast.show([manager.errorData.errMsg, ' : ',  errCode].join(''));
				if(thisObj.afterCallback) thisObj.afterCallback(null);
				return;
			}
			
			if(!queryData)
			{
				if(afc.isSimulator) afc.log('queryData null!');
				if(thisObj.afterCallback) thisObj.afterCallback(null);
			}
			else
			{			
				// 정상처리되었을 경우 비동기 응답 설정 해지
			 	thisObj.doRemoveQueryListener();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];								
				
				if(thisObj.afterCallback) thisObj.afterCallback(OutBlock1, errCode);
				
				if(afc.isSimulator) queryData.printQueryData();
			}
		}		
	}
};
//----------------------------------------------------//
//---------------- END 은행 예금주 조회 -----------------//
//----------------------------------------------------//





//----------------------------------------------------//
//------------------ START 등록하기 --------------------//
//----------------------------------------------------//
// 등록하기 버튼 클릭
FD5003_V08.prototype.onbtnAutoTransRegClick = function(comp, info)
{
	// 18.12.11 추가
	this.sendSACAT516();
};


// 이체시작일이 약정등록일(영업일) + 4일보다 전일자인 경우 이체시작일, 이체종료일 한달씩 순연
FD5003_V08.prototype.autoTransDelayCalc = function()
{
	// 2019.01.03. 해당경우에 1달씩 순연 계산식 변경
	// 이체시작일과 이체종료일이 한달씩 순연되어야 하므로 날짜 입력때 월기준에 -1을 안함	
	// 이체 시작일(년,월,일 입력)
	var calcStartDate = new Date(this.transStart.substring(0,4), Number(this.transStart.substring(4,6)), this.transStart.substring(6,8));
	this.transStart = calcStartDate.format('yyyyMMdd');

	// 이체 종료일(년,월,일 입력)
	var calcEndDate = new Date(this.transEnd.substring(0,4), Number(this.transEnd.substring(4,6)), this.transEnd.substring(6,8));
	this.transEnd = calcEndDate.format('yyyyMMdd');
		
	// 2018.01.03 이전 소스 주식 처리
	/*
	// 이체시작일
	if(this.transStart.toString().substring(4,6) == '12')
	{
		this.transStart = Number(this.transStart) + Number(8900); // 한달 더함
	}
	else
	{
		this.transStart = Number(this.transStart) + Number(100); // 한달 더함		
	}
	
	// 이체종료일
	if(this.transEnd.toString().substring(4,6) == '12')
	{
		this.transEnd = Number(this.transEnd) + Number(8900); // 한달 더함
	}
	else
	{
		this.transEnd = Number(this.transEnd) + Number(100); // 한달 더함		
	}
	*/
	
	this.sendSACAT516();
};


// 서비스 조회 (자동이체 약정등록)
FD5003_V08.prototype.sendSACAT516 = function()
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	var cipherData = this.fundAccPw;
	
	// 계좌번호가 없으면
	if(!this.fundAccNo)
	{
		AToast.show('매수하실 계좌번호가 없습니다.');
		return;
	}
	
	// 비밀번호가 없으면
	if(!afc.isSimulator)
	{
		if(!cipherData)
		{
			AToast.show('계좌 비밀번호를 확인하세요');
			return;
		}
	}
	
	// checkObj
	var checkObj = {
		svcId : 'SACAT516',
		accNo : thisObj.fundAccNo
	};
	
	// 이체시작일이 약정등록일(영업일) + 4보다 전일자입니다. Skip 처리
	theApp.accNetManager.addSkipErrorCode('SACAT516', '3691');
	
	// 조회
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){				
		cont.sendData('SACAT516', 
			function(queryData, groupName)
			{
				// 수정하기 위해 펑션키 수정
				queryData.setHeaderInfo({
					FUNC_KEY_LST: '5'
				});
				
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				InBlock1['D1처리구분'] = '1';
				InBlock1['D1서브계좌번호'] = checkObj.accNo;
				InBlock1['D1투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드']; 
				InBlock1['D1입력비밀번호'] = afc.isSimulator ? '0423' : result; 
				InBlock1['D1은행코드'] = thisObj.autoBankCode;
				InBlock1['D1은행계좌번호'] = thisObj.transBankAcc.getText(); 
				InBlock1['D1은행계좌명'] = thisObj.bankAccName.getText(); // SDPKT120 에서 얻어온 계좌명 
				InBlock1['D1실명확인번호'] = '';
				InBlock1['D1자동대체일'] = thisObj.M_date;
				InBlock1['D1이체종료일'] = thisObj.transEnd; 
				InBlock1['D1이체시작일'] = thisObj.transStart;
				InBlock1['D1은행자동이체금액'] = thisObj.M_money;
				InBlock1['D1은행본인계좌여부'] = '1'; 
				InBlock1['D1통장사용여부'] = ''; 
				InBlock1['D1증빙구분'] = '4';

				queryData.putPwInfo('InBlock1', 'D1입력비밀번호');
				
				if(afc.isSimulator) queryData.printQueryData();
			},
			function(queryData, groupName)
			{				
				var errMsg = this.getLastError('errMsg');
				var errCode = this.getLastError('errCode');
				
				if(errCode == '3691')
				{
					// 약정등록일 계산
					thisObj.autoTransDelayCalc();
				}
				else
				{
					if(queryData)
					{
						if(afc.isSimulator) queryData.printQueryData();
					
						var OutBlock1 = queryData.getBlockData('OutBlock1')[0];

						if(!OutBlock1) return;
						
						thisObj.openConfirmPopup();
					}
				}
			}
		);
	});
};

// 팝업 (자동이체기간 확인) // 18.12.11 추가
FD5003_V08.prototype.openConfirmPopup = function()
{
	var thisObj = this;
	
	// 시작일
	var transStart = thisObj.transStart.toString();
	var transStartYY = transStart.substring(0,4);
	var transStartMM = transStart.substring(4,6);
	var transStartDD = transStart.substring(6,8);
	
	// 종료일
	var transEnd = thisObj.transEnd.toString();
	var transEndYY = transEnd.substring(0,4);
	var transEndMM = transEnd.substring(4,6);
	var transEndDD = transEnd.substring(6,8);
	
	// 메시지
	var Msg =
		'희망하신 월납입일과<br/>자동이체기간을<br/>확인해주시기 바랍니다.<br/>'
		+ '- 월납입일 : ' + transStartDD + '일' + '<br/>'
		+ '- 자동이체기간 : </br>'
		+ transStartYY + ' 년 ' + transStartMM + ' 월 ' + transStartDD + ' 일 ~ </br>'  
		+ transEndYY + ' 년 ' + transEndMM + ' 월 ' + transEndDD + ' 일 </br></br>';
		
	// 팝업
	theApp.alert(
		Msg, 
		function()
		{
			// 자동이체기간팝업 확인 여부
			thisObj.getContainer().tvManager.getActiveView().tbvManager.changeTab('FD5003_V09');
		}, '알림'
	);
};
//----------------------------------------------------//
//-------------------- END 등록하기 --------------------//
//----------------------------------------------------//




