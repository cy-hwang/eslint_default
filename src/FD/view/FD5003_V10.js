
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_V10()
{
	AView.call(this);
}
afc.extendsClass(FD5003_V10, AView);


FD5003_V10.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// Object
	this.cont = this.getContainer();
	this.contTab = this.cont.tvManager.getActiveView();
	
	// 스크롤 관련 영역
	this.view3 = this.findCompById('View3');
	
	// 계좌
	this.accView = this.findCompById('AccView').loadView;
	
	// 자동이체매수 약정등록
	this.lblStep = this.findCompById('lblStep'); // 단계
	this.lblFundName = this.findCompById('lblFundName'); // 펀드명
	this.lblFundName2 = this.findCompById('lblFundName2'); // 클래스상세 전체명 추가 2019.09.24
	
	// 자동이체매수 정보
	this.txtOrderAbleAmt	= this.findCompById('txtOrderAbleAmt'); // 매수가능금액
	this.txtPayMoney 		= this.findCompById('txtPayMoney'); 	// 일납입금액
	this.txtTransPeriod 	= this.findCompById('txtTransPeriod'); 	// 이체기간
	
	// 등록하기 버튼
	this.btnAutoTransReg = this.findCompById('btnAutoTransReg');
	
	this.lblFundName.setShrinkInfo({maxChar:20, fontSize:24}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.lblFundName2.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
};

// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V10.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 계좌 초기화
	this.initAccView();
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 매수단계 및 펀드명 셋팅
	this.setFundStepInfo();
	
	// 서비스 조회 (매수가능금액조회)
	this.sendSOFFQ218();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5003_V10.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V10.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.view3.scrollTo(0);
};


// 계좌 초기화
FD5003_V10.prototype.initAccView = function()
{	
	// 이전 화면에서 넘긴 파라미터 
	this.fundAccNo = this.viewData.accNo; // 서브계좌번호
	this.fundAccPw = this.viewData.accPw; // 계좌비밀번호
	this.fundAccNm = this.viewData.accNm; // 계좌명
	this.fundOrgAccNo = this.viewData.orgAccNo; // 계좌번호 
	
	// 계좌
	this.accDbx = this.accView.accDbx; 	// 계좌드롭박스
	this.arrSubAccNo = []; 				// 서브계좌번호
	
	// 계좌 선택불가 처리
	this.accDbx.enable(false);	
	this.accDbx.addClass('combo_dis');
	
	// 서브 계좌 셋팅
	this.accDbx.removeAll();
	for(var i=0; i < this.fundAccNo.length; i++)
	{
		this.accDbx.addItem(this.expressAccList(this.fundAccNo[i]), this.fundAccNo[i]);
	}
	this.accDbx.selectItem(0);
};

// 컴포넌트 초기화
FD5003_V10.prototype.onInitComponents = function()
{
	// 자동이체매수 정보 초기화
	this.txtOrderAbleAmt.setText("");	// 매수가능금액
	this.txtPayMoney.setText("");		// 일납입금액
	this.txtTransPeriod.setText("");	// 이체기간
	this.transStart = null; 			// 이체시작일
	this.transEnd 	= null;				// 이체종료일
	
	// 시간상태값
	this.timeSt_init 	= 0; // 화면 진입시
	this.timeSt_click 	= 0; // 약정등록 클릭시
	
	// 등록하기 버튼 비활성화
	this.btnAutoTransReg.enable(false);
};


// 서브 계좌 표기
FD5003_V10.prototype.expressAccList = function(accInfo)
{
	var returnAcc = accInfo.substring(0,3) + "-" + accInfo.substring(3,5) + "-" 
					+ accInfo.substring(5,11) + "-" + accInfo.substring(11, accInfo.length);
	
	return returnAcc;	
};


// 매수단계 및 펀드명 셋팅
FD5003_V10.prototype.setFundStepInfo = function()
{
	// 펀드매수단계 셋팅
	var txtStep = "<span class='fc_red3'>" + this.cont.fundStepNow + "</span>"
					+ "<span class='step'>/" + this.cont.fundStepAll + "단계</span>";
	this.lblStep.$ele.children().eq(0).html(txtStep);
	
	
	// 펀드명 셋팅
	var fundNm = this.cont.selectFundInfo["D1한글투신펀드명"];
	this.lblFundName.setText(fundNm);
	this.lblFundName.setText(this.cont.selectFundInfo["D1클래스상세 전체명"]); // 클래스상세 전체명 추가 2019.09.24
};


// 서비스 조회 (매수가능금액조회)
FD5003_V10.prototype.sendSOFFQ218 = function()
{
	var thisObj = this;
	var cont = this.getContainer();
	
	// 조회
	cont.sendData('SOFFQ218',
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];							
			InBlock1['D1처리구분'] = "2"; // 1: 매도, 2: 매수
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData();
			InBlock1['D1투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드'];
			InBlock1['D1매수주문금액'] = "";
			InBlock1['D1매도계좌번호'] = "";
			InBlock1['D1매도투신펀드코드'] = "";
			
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{
			if(!queryData)
			{
				
			}
			else // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
				
				if(!OutBlock1) return;
				
				// 매수정보 셋팅
				var odrAbleAmt 	= OutBlock1["D1주문가능금액"];
				thisObj.txtOrderAbleAmt.setText(odrAbleAmt); // 매수가능금액
				
				// 매수가능금액이 없다면
				if( OutBlock1["D1주문가능금액"] == 0 )
				{
					// 팝업
					theApp.alert(
						'매수가능금액이 없습니다. 펀드<br/>' 
							// + '매수를 위해 우리은행 가상계좌로<br/>' // 18.12.04 문구변경
							+ '매수를 위해 연금저축계좌로<br/>'
							+ '입금해주시기 바랍니다.', 
						function(result)
						{
							// 가상계좌정보 팝업 // 18.12.04 주석처리
							// if(result) thisObj.virtualAccInfoPopup();
						}, '알림'
					);					
				}
			}
			
			// 자동이체매수 정보 셋팅
			thisObj.setAutoTransferInfo();
		}
	);
};


// 가상계좌정보 팝업
FD5003_V10.prototype.virtualAccInfoPopup = function()
{
	// 팝업
	var win = AWindow.createWindow('FD/window/FD3202_W12.lay', 'FD3202W12');						
	win.openAsDialog(this, 584, 660);
};


// 자동이체매수 정보 셋팅
FD5003_V10.prototype.setAutoTransferInfo = function()
{
	// 이전 화면에서 넘긴 파라미터 
	this.D_money = this.viewData.D_money; 	// 일납입금액
	this.D_period = this.viewData.D_period; // 납입기간
	
	// 일납입금액
	this.txtPayMoney.setText(this.D_money);
	
	// 이체기간 계산 
	this.autoTransDateCalc('FD5003V10_INIT');
};


// 이체기간 계산 함수
FD5003_V10.prototype.autoTransDateCalc = function(stType)
{
	this.checkTradeState(stType);	
};


// 자동이체상태 조회
FD5003_V10.prototype.checkTradeState = function(stType)
{
	this.contTab.checkTradeState(this, this.contTab, stType);
};


// checkTradeState 콜백함수
FD5003_V10.prototype.callbackCheckTradeState = function(param)
{
	var stType = param['처리구분코드']; // FD5003V10_INIT, FD5003V10_CLICK
	var timeSt = param['자동이체상태']; // 0: +1영업일, 1: +2영업일
	
	if(stType == 'FD5003V10_INIT') // 화면 진입시
	{
		this.timeSt_init = timeSt;
	}
	else if(stType == 'FD5003V10_CLICK') // 약정등록 클릭시
	{
		this.timeSt_click = timeSt; 
	}
	
	// 서비스 조회 (당일일자정보조회)
	this.sendSCMAQ048(stType);
};


// 서비스 조회 (당일일자정보조회)
FD5003_V10.prototype.sendSCMAQ048 = function(stType)
{
	var thisObj = this;
	var cont = this.getContainer();
	
	// 조회
	cont.sendData('SCMAQ048',
	    function(queryData, groupName)
		{
			queryData.setHeaderInfo({
				FUNC_KEY_LST:  'C' 
			});
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1일자공통그룹코드'] = '010';
			InBlock1['D1출납일기준영업전전일'] = '';
			InBlock1['D1출납일기준영업전일'] = '';
			InBlock1['D1출납일기준영업일'] = '';
			InBlock1['D1출납일기준영업익일'] = '';
			InBlock1['D1출납일기준영업익익일'] = '';
			InBlock1['D1주문일기준결제전일'] = '';
			InBlock1['D1주문일기준주문전일'] = '';
			InBlock1['D1주문일'] = '';
			InBlock1['D1결제일'] = '';
			InBlock1['D1주문일기준주문익일'] = '';
			InBlock1['D1주문일기준결제익일'] = '';
			InBlock1['D130만기일'] = '';
			InBlock1['D160만기일'] = '';
			InBlock1['D190만기일'] = '';
			InBlock1['D1120만기일'] = '';
			InBlock1['D1150만기일'] = '';
			InBlock1['D1180만기일'] = '';
			InBlock1['D1210만기일'] = '';
			InBlock1['D1270만기일'] = '';
			InBlock1['D1365만기일'] = '';
			InBlock1['D1주문가능일여부'] = '';
			InBlock1['D1요일구분'] = '';
			
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
				
				// 이체기간 셋팅
				thisObj.setAutoTransDate(stType, OutBlock1);
			}
		}
	);
};


// 이체기간 셋팅
FD5003_V10.prototype.setAutoTransDate = function(stType, OutBlock1)
{
	var thisObj = this;
	
	if(stType == 'FD5003V10_INIT') // 화면 진입시
	{
		thisObj.transStart 	= null; // 이체시작일
		thisObj.transEnd 	= null;	// 이체종료일
		
		if(thisObj.timeSt_init == 0)	// 0: +1영업일
		{
			thisObj.transStart = OutBlock1['D1출납일기준영업익일']; // 시작일	
		}
		else if(thisObj.timeSt_init == 1) // 1: +2영업일
		{
			thisObj.transStart = OutBlock1['D1출납일기준영업익익일']; // 시작일		
		}
		
		// 종료일 계산
		var transStart = thisObj.transStart.toString();
		var startYY = transStart.substring(0,4);
		var startMM = transStart.substring(4,6);
		var startDD = transStart.substring(6,8);
		var nowEnd = new Date(startYY, Number(startMM) + Number(thisObj.D_period)-1, startDD);
		
		// 종료일
		thisObj.transEnd = nowEnd.format('yyyyMMdd');
		
		// 이체기간 셋팅
		var formatStart = Utils.formatDotDate(thisObj.transStart);
		var formatEnd = Utils.formatDotDate(thisObj.transEnd);
		thisObj.txtTransPeriod.setText(formatStart + " - " + formatEnd);
	}
	else if(stType == 'FD5003V10_CLICK') // 약정등록 클릭시
	{
		if(thisObj.timeSt_init == thisObj.timeSt_click)
		{
			// 서비스 조회 (자동이체 약정등록)
			thisObj.sendSACAT502();
		}
		else
		{
			theApp.alert(
				'업무처리시간(15시 30분)이 경과<br/>'
				+ '하여 이체기간 확인 후 자동이체<br/>'
				+ '약정등록을 진행해주세요.',
				function()
				{
					// 이체기간 변경
					// 15시 30분 이전에 펀드가입후, 15시 30분 이후에 약정등록하는 경우
					thisObj.autoTransDateCalc('FD5003V10_INIT');
				},''
			);
		}
	}
	
	// 등록하기 버튼 활성화
	thisObj.btnAutoTransReg.enable(true);
};


// 등록하기 버튼 클릭
FD5003_V10.prototype.onbtnAutoTransRegClick = function(comp, info)
{
	// 이체기간 계산 
	this.autoTransDateCalc('FD5003V10_CLICK');
};


// 등록
FD5003_V10.prototype.sendSACAT502 = function()
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
		svcId : 'SACAT502',
		accNo : thisObj.fundAccNo
	};
	
	// 조회
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){				
		cont.sendData('SACAT502', 
			function(queryData, groupName)
			{
				// 수정하기 위해 펑션키 수정
				queryData.setHeaderInfo({
					FUNC_KEY_LST: '5'
				});
				
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				InBlock1['D1처리구분'] = '1';
				InBlock1['D1계좌번호'] = thisObj.fundOrgAccNo;
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result; 
				InBlock1['D1서비스종류코드'] = '3206';
				InBlock1['D1매도투신펀드코드'] = '';
				InBlock1['D1대체상대계좌번호'] = checkObj.accNo;
				InBlock1['D1매수투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드'];
				InBlock1['D1환불금은행이체여부'] = '';
				InBlock1['D1자동대체일'] = '00';
				InBlock1['D1은행자동이체금액'] = thisObj.D_money;
				InBlock1['D1약정만료일'] = thisObj.transEnd;
				InBlock1['D1은행이체비밀번호'] = '';
				InBlock1['D1약정시작일'] = thisObj.transStart;
				InBlock1['D1자동이체입금일'] = '';
				
				queryData.putPwInfo('InBlock1', 'D1비밀번호');
				
				if(afc.isSimulator) queryData.printQueryData();
			},
			function(queryData, groupName)
			{				
				var errMsg = this.getLastError('errMsg');
				var errCode = this.getLastError('errCode');
				
				if(queryData)
				{
					if(afc.isSimulator) queryData.printQueryData();
				
					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];

					if(!OutBlock1) return;
					
					// 자동이체매수 신청 완료 페이지로 이동
					cont.tvManager.getActiveView().tbvManager.changeTab('FD5003_V09');
				}
			}
		);
	});
};


