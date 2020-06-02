
/**
Constructor
Do not call Function in Constructor.
*/

function FD5003_V05()
{
	AView.call(this);		
}
afc.extendsClass(FD5003_V05, AView);


FD5003_V05.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// Object
	this.cont = this.getContainer();
	this.contTab = this.cont.tvManager.getActiveView();
	
	// 스크롤 관련 영역
	this.view3 = this.findCompById('View3');
	
	// 계좌
	this.accView = this.findCompById('AccView').loadView;
	
	// 펀드납입정보입력
	this.lblStep = this.findCompById('lblStep'); // 단계
	this.btnNext6 = this.findCompById('btnNext6'); // 다음 버튼
	this.lblFundName = this.findCompById('lblFundName'); // 펀드명
	this.lblFundName2 = this.findCompById('lblFundName2'); // 클래스상세 전체명 추가 2019.09.24
	
	// 적립식 뷰
	this.savingPartView = this.findCompById('savingPartView');
	
	// 납입방법
	//this.dropPayKind = this.findCompById('dropPayKind');		// 03: 적립식, 01: 임의식    // 2020.05.13  셀렉트박스->라디오로 교체
	//this.dropPayKind.addItem('적립식', '03');				// 2020.05.13  셀렉트박스->라디오로 교체
	//this.dropPayKind.addItem('임의식', '01');				// 2020.05.13  셀렉트박스->라디오로 교체
	
	// 납입기간
	this.txtSavingTerm = this.findCompById('txtSavingTerm');
	
	// 납입주기 뷰
	this.view13 = this.findCompById('View13'); // 매월(월납입금액)
	this.view12 = this.findCompById('View12'); // 매월(월납입일)
	this.view19 = this.findCompById('View19'); // 매일(일납입금액)
	
	//라디오그룹 생성 (2020.05.13 셀렉트박스->라디오 교체)
	this.rdoManager3 = new RadioBtnManager(this);
	this.RadioPayWay = this.findCompByGroup('RadioPayWay');
	
	// 납입주기 (매월, 매일)
	this.rdoMngrPeriod = new RadioBtnManager(this);
	this.RdoPeriodGrp = this.findCompByGroup('RdoPeriodGrp');
	
	// 월납입금액
	this.txtSavingMoney = this.findCompById('txtSavingMoney');
	
	// 월납입일 (5일, 20일, 25일)
	this.rdoMngrDay = new RadioBtnManager(this);
	this.RdoDayGrp = this.findCompByGroup('RdoDayGrp');
	
	// 일납입금액
	this.txtDaySavingMoney = this.findCompById('txtDaySavingMoney');
	
	// 구분값
	//this.dropPayKindTypeCd; // 같은 펀드납입방법을 선택했을 시 팝업을 올리지 않기 위한 구분값  // 2020.05.13 셀렉트박스->라디오 교체
	this.PeriodTypeCd; 	// 납입주기 (매일: D, 매월: M)
	this.DayTypeCd;		// 월납입일 (5일: 5, 20일: 20, 25일: 25)
	
	// 2019.01.03. 연금펀드 매월 적립식 년단위로 문구 및 입력값 세팅 변경
	this.label16 = this.findCompById('Label16');
	this.label17 = this.findCompById('Label17');     
	
	this.lblFundName.setShrinkInfo({maxChar:20, fontSize:24}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.lblFundName2.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V05.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 계좌 초기화
	this.initAccView();
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 매수단계 및 펀드명 셋팅
	this.setFundStepInfo();
	
	// 매매가능상태 조회
	this.checkTradeState();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5003_V05.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V05.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.view3.scrollTo(0);
};


// 계좌 초기화
FD5003_V05.prototype.initAccView = function()
{	
	// 계좌
	this.accDbx = this.accView.accDbx; 			// 계좌드롭박스
	this.secureTxf = this.accView.secureTxf;	// 계좌비밀번호
	this.arrSubAccNo = []; 						// 서브계좌번호
	
	// (시뮬레이터가 아닐 경우) 다음 버튼 비활성화 
	if(!afc.isSimulator) this.btnNext6.enable(false);
	
	// 계좌 선택불가 처리
	this.accDbx.enable(false);	
	this.accDbx.addClass('combo_dis');
	
	// 계좌 셋팅
	this.accView.doInitAccInfo(this.cont.accTypeCd);
};


// 컴포넌트 초기화
FD5003_V05.prototype.onInitComponents = function()
{
	// 납입방법 적립식 선택
	//this.dropPayKind.selectItem(0);						// 2020.05.13 셀렉트박스->라디오로 교체
	this.rdoManager3.selectButton(this.RadioPayWay[0]);		// 납입방법을 첫번째(적립식)로 선택	// 2020.05.13 셀렉트박스->라디오로 교체
	this.onSetPayKindView('03');							// 적립식으로 초기화
	
	// 적립식 뷰 초기화
	this.onSavingViewInit(); 
	
};


// 비밀번호 넣은 후 동작하는 함수
FD5003_V05.prototype.sendDataManage = function()
{
	if(!afc.isSimulator)
	{
		if(!this.secureTxf.getCipherData())
		{
			return;
		}
		else
		{
			this.secureTxf.removeClass('active');
			this.btnNext6.enable(true);
		}
	}
};


// 매수단계 및 펀드명 셋팅
FD5003_V05.prototype.setFundStepInfo = function()
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


// 매매가능상태 조회
FD5003_V05.prototype.checkTradeState = function()
{
	this.contTab.checkTradeState(this, this.contTab);
};


// checkTradeState 콜백함수
FD5003_V05.prototype.callbackCheckTradeState = function(param)
{
	var trdSt = param['매매가능상태']; // 1: 일반펀드매수매도, 2: 예약펀드매수매도, 3: 펀드매수매도불가, 4:당일예약펀드매수매도
	
	if(trdSt == 3)
	{
		// 펀드매수매도불가안내팝업
		this.contTab.tradeDisablePopup();
	}
	else if(trdSt == 1 || trdSt == 2 || trdSt == 4)
	{
		
	}
};


// 다음단계 클릭
FD5003_V05.prototype.onbtnNext6Click = function(comp, info)
{
	if(this.cont.pageData.tabId)
	{
		//var selectCd = this.dropPayKind.getSelectedItemData();		2020.05.13  셀렉트박스->라디오로 교체
		//if(selectCd == '01') // 임의식 => 이미 가입된 펀드인지 체크		2020.05.13  셀렉트박스->라디오로 교체
		//if(this.payWayGubn == '01') 	// 임의식일 경우 이미 가입된 펀드인지 체크
		var selectedRadio1 = this.rdoManager3.getSelectButton();
		
		if(selectedRadio1.compId == 'BtnTemp')		// 임의식
		{
			var param = {
				'D1비밀번호' 	: '1', // 비밀번호의 길이가 0이면 비밀번호 체크하는 부분에서 걸리므로 1 세팅
				'D1잔고유무여부' : ''
			};
			this.cont.sendSOFFQ365(this, this.cont, param); // 펀드 가입 조회
		}
		else 							// 적립식 => 펀드위험도 체크	
		{
			this.checkFundDanger(); // 펀드위험도 조회
		}
		
		// 2018.11.06 주석처리
		/*// 1) 자산현황에서 추가매수 클릭 시(FD5006_W01) 진입
		if(this.cont.pageData.fundSubSeq) // 서브계좌개설 X
		{
			var accNo = this.accDbx.getSelectedItemData()['D1계좌번호'];
			var cipherData = this.secureTxf.getCipherData();
			
			// 서브계좌번호
			this.arrSubAccNo.push( accNo + this.cont.pageData.fundSubSeq ); 
			
			// 페이지 이동
			var param = {
				'accNo': this.arrSubAccNo,
				'accPw': afc.isSimulator ? '0423' : cipherData,
				'accNm': this.accDbx.getSelectedItemData()['D1계좌명']
			};
			this.goNextStep(param); 
		}
		// 1) 펀드매수 클릭 시 진입
		else // 서브계좌개설 O
		{
			// 펀드위험도 조회
			this.checkFundDanger(); 
		}*/
	}
};


// sendSOFFQ365 콜백함수
FD5003_V05.prototype.callbackSOFFQ365 = function(InBlock1, OutBlock1, OutBlock2)
{
	var accNo = this.accDbx.getSelectedItemData()['D1계좌번호'];
	var cipherData = this.secureTxf.getCipherData();
	
	var fundJoinYN = 'N'; // 펀드가입유무 (N: 없음, Y: 있음)
	
	// 임의식으로 가입된 모든 서브계좌번호 저장
	for(var i=0; i < OutBlock2.length; i++)
	{
		if(OutBlock2[i]["D1납입방법명"] == "임의식")
		{						
			if(OutBlock2[i]["D1투신펀드코드"] == this.cont.selectFundInfo["D1투신펀드코드"])
			{
				this.arrSubAccNo.push( accNo + OutBlock2[i]["D1계좌일련번호"] ); 
				fundJoinYN = 'Y';
			}
		}
	}
	
	// 펀드 가입 유무 체크
	if(fundJoinYN == 'Y') // 가입됨 => 추가매수
	{
		var param = {
			'accNo': this.arrSubAccNo,
			'accPw': afc.isSimulator ? '0423' : cipherData,
			'accNm': this.accDbx.getSelectedItemData()['D1계좌명']
		};
		this.goNextStep(param); // 페이지 이동
	}
	else // 가입되어있지않음 => 신규가입
	{
		this.checkFundDanger(); // 펀드위험도 조회
	}
};


// 펀드위험도 조회
FD5003_V05.prototype.checkFundDanger = function()
{
	// 고객정보
	var userGrd = theApp.userInfo.get('UserGrade');
	var userGrade = this.contTab.getUserGrade(userGrd['D1산출등급명']); // 고객등급
	
	// 펀드정보
	var fundDangerCd = this.cont.selectFundInfo["D1위험도코드"];
	
	// 계좌번호가 없으면
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	// 비밀번호가 없으면
	if(!afc.isSimulator)
	{	
		if(!this.secureTxf.getCipherData())
		{
			AToast.show('계좌 비밀번호를 입력하세요.');
			this.secureTxf.addClass('active');
			return;
		}
	}
	
	// 입력값 체크
	if( this.checkInputValue() )
	{
		// 고객등급과 펀드종류 위험등급 비교
		// 고객등급이 위험도코드등급보다 낮으면 부적합금융투자상품거래확인서 작성 필요 확인 조회
		if( userGrade >= Number(fundDangerCd) )
		{
			this.callbackCheckFundDanger(); // 펀드가입	
		}
		else
		{
			// 부적합금융투자상품거래확인서 등록여부 조회
			this.contTab.checkNonReport(this, this.contTab);
		}
	}
};


// 입력값 체크
FD5003_V05.prototype.checkInputValue = function()
{
	//var selectPayKindCd = this.dropPayKind.getSelectedItemData();		// 2020.05.13  셀렉트박스->라디오로 교체
	//if(selectPayKindCd == '01') // 임의식			// 2020.05.13  셀렉트박스->라디오로 교체
	var selectedRadio1 = this.rdoManager3.getSelectButton();
	
	if(selectedRadio1.compId == 'BtnTemp')			// 임의식
	{
	
	}
	else if(selectedRadio1.compId == 'BtnAcc')		// 적립식
	{
		if(this.PeriodTypeCd == 'M') // 매월
		{
			if( !this.txtSavingMoney.getText() )
			{
				AToast.show("월납입금액을 입력하세요.");
				this.txtSavingMoney.addClass('active');

				return false;
			}
			
			if( this.txtSavingMoney.getText() < 50000 )
			{
				AToast.show("월납입금액은 최소 5만원 이상입니다.");
				this.txtSavingMoney.addClass('active');

				return false;
			}
		}
		else if(this.PeriodTypeCd == 'D') // 매일
		{
			if( !this.txtDaySavingMoney.getText() )
			{
				AToast.show("일납입금액을 입력하세요.");
				this.txtDaySavingMoney.addClass('active');

				return false;
			}

			if( this.txtDaySavingMoney.getText() < 5000 )
			{
				AToast.show("일납입금액은 최소 5천원 이상입니다.");
				this.txtDaySavingMoney.addClass('active');

				return false;
			}
		}
		
		if( !this.txtSavingTerm.getText() )
		{
			AToast.show("납입기간을 입력하세요.");
			this.txtSavingTerm.addClass('active');
			
			return false;
		}
		
		// 2019.01.03 연금펀드 매월 적립식 년단위로 문구 및 입력값 세팅 변경 (매월은 년단위로 입력변경으로 체크제외)
		if(this.PeriodTypeCd == "D"){
			if( this.txtSavingTerm.getText() < 12 )
			{
				AToast.show("납입기간은 12개월 이상이어야 합니다.");
				this.txtSavingTerm.addClass('active');

				return false;
			}
		}
	}

	return true;
};


// 부적합금융투자상품거래확인서 팝업
FD5003_V05.prototype.investInfoPopup = function(comp, info)
{
	// 팝업
	var win = AWindow.createWindow('FD/window/FD3202_W02.lay', 'FD3202W02');		
	win.openAsDialog(this);
};


// 팝업에서 넘긴 결과
FD5003_V05.prototype.onWindowResult = function(result, windowObj)
{
	if(windowObj.containerId == 'FD3202W02')
	{
		if(result == 1)
		{
			// 부적합금융투자상품거래확인서 등록
			this.contTab.registNonReport(this, this.contTab);			
		}
	}
};


// checkNonReport, registNonReport 콜백함수
FD5003_V05.prototype.callbackCheckFundDanger = function()
{
	this.sendSACMT203();
};


// 서비스 조회 (펀드가입)
FD5003_V05.prototype.sendSACMT203 = function()
{
	var thisObj = this;
	var cont = this.getContainer();
	
	var cipherData = this.secureTxf.getCipherData();
	
	// 계좌번호가 없으면
	if(!thisObj.accDbx.getSelectedItemData() || !thisObj.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	// 비밀번호가 없으면
	if(!afc.isSimulator)
	{	
		if(!cipherData)
		{
			AToast.show('계좌 비밀번호를 입력하세요.');
			thisObj.secureTxf.addClass('active');
			return;
		}
	}
	
	// checkObj
	var checkObj = {
		svcId : 'SACMT203',
		accNo : thisObj.accDbx.getSelectedItemData()['D1계좌번호']
	};
	
	// 납입방법
	//var selectPayKindCd = thisObj.dropPayKind.getSelectedItemData();					// 2020.05.13 셀렉트박스->라디오로 교체
	var selectPayKindCd = thisObj.payWayGubn;	// 납입방법 ('01':임의식, '03':적립식)	// 2020.05.13 셀렉트박스->라디오로 교체
	
	// 조회 
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData('SACMT203', 
			function(queryData, groupName)
			{
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				InBlock1['D1처리구분'] = '1';
				InBlock1['D1상위계좌번호'] = checkObj.accNo;
				InBlock1['D1계좌비밀번호'] = afc.isSimulator ? '0423' : result;
				InBlock1['D1계좌한글부기명'] = '';
				InBlock1['D1계좌영문부기명'] = '';
				InBlock1['D1관리사원번호'] = '';
				InBlock1['D1권유자사원번호'] = '';
				
				var InBlock2 = queryData.getBlockData('InBlock2')[0];
				InBlock2['D1상품상세코드'] = cont.selectFundInfo['D1투신상세코드'];
				InBlock2['D1투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드'];
				InBlock2['D1납입방법코드'] = selectPayKindCd; // 01: 임의식, 03: 적립식, 04: 자유적립식
				
				if(selectPayKindCd == '01') // 임의식 => 기존에 가입된 펀드라면 무조건 추가매수로 처리
				{
					InBlock2['D1계약기간월수'] = '';
					InBlock2['D1월납입일'] = '';
					InBlock2['D1납입단위금액'] = '';
				}
				else if(selectPayKindCd == '03') // 적립식
				{
					if(thisObj.PeriodTypeCd == "M") // 매월
					{
						// 2019.01.03 연금펀드 매월 적립식 년단위로 입력값 세팅 변경(서버에는 개월로 들어가므로 *12)
						InBlock2['D1계약기간월수'] = thisObj.txtSavingTerm.getText()*12;
						InBlock2['D1월납입일'] = thisObj.DayTypeCd;
						InBlock2['D1납입단위금액'] = thisObj.txtSavingMoney.getText();
					}
					else if(thisObj.PeriodTypeCd == "D") // 매일
					{
						InBlock2['D1납입방법코드'] = '04';
						InBlock2['D1계약기간월수'] = '12'; // 12개월
						InBlock2['D1월납입일'] = '';
						InBlock2['D1납입단위금액'] = '999999999';
					}
				}
				
				//InBlock2['D1계약기간월수'] = '12';
				//InBlock2['D1월납입일'] = '01';
				//InBlock2['D1납입단위금액'] = '999999999';
				InBlock2['D1과세유형코드'] = '02'; // 02: 비과세
				InBlock2['D1분리과세여부'] = '0';
				InBlock2['D1결산처리구분'] = '1'; 
				InBlock2['D1운용사특수관계여부'] = '0';
				InBlock2['D1생계형가입코드'] = '';
				InBlock2['D1투자설명여부'] = '1';
				InBlock2['D1연금지급구분'] = '';
				InBlock2['D1연금지급기간값'] = '';
				InBlock2['D1연금지급시작일'] = '';
				InBlock2['D1연금지급주기구분'] = '';
				InBlock2['D1연기금코드'] = '';
				InBlock2['D1만기연장여부'] = '';
				
				queryData.putPwInfo('InBlock1', 'D1계좌비밀번호');
				
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
				}

				if(errCode == '0015')
				{
					// 이동할 페이지
					var movePage = null;
					
					// 서브계좌번호
					thisObj.arrSubAccNo[0] = OutBlock1["D1서브계좌번호"]; 
					
					// 다음 화면으로 넘겨줄 파라미터
					var param = {
						'accNo': thisObj.arrSubAccNo,
						'accPw': afc.isSimulator ? '0423' : cipherData,
						'accNm': thisObj.accDbx.getSelectedItemData()['D1계좌명'],
						'orgAccNo' : checkObj.accNo,
					};
					
					if(selectPayKindCd == '01') // 임의식
					{
						
					}
					else if(selectPayKindCd == '03') // 적립식
					{
						var selectedRadio2 = thisObj.rdoMngrPeriod.getSelectButton();
		
						// FD5003_V05 > FD5003_V09 로 페이지 이동시에만 쓰인다 -> cont['periodTypeCd'] (2020.05.21)
						if(selectedRadio2.compId == 'BtnMonthly')		// 매월
							cont['periodTypeCd'] = "M";	// periodTypeCd(D:일적립식, M:월적립식)
						else if(selectedRadio2.compId == 'BtnDaily')	// 매일
							cont['periodTypeCd'] = "D";	// periodTypeCd(D:일적립식, M:월적립식)
					
						if(thisObj.PeriodTypeCd == "M") // 매월
						{
						
							// 2019.01.03 연금펀드 매월 적립식 년단위로 입력값 세팅 변경(서버에는 개월로 들어가므로 *12)
							movePage = 'FD5003_V08';
							
							param['M_money'] = thisObj.txtSavingMoney.getText();	// 월납입금액
							param['M_date'] = thisObj.DayTypeCd;					// 월납입일
							param['M_period'] = thisObj.txtSavingTerm.getText()*12;	// 납입기간
						}
						else if(thisObj.PeriodTypeCd == "D") // 매일
						{
							movePage = 'FD5003_V10';
							
							param['D_money'] = thisObj.txtDaySavingMoney.getText();	// 일납입금액
							param['D_period'] = thisObj.txtSavingTerm.getText();	// 납입기간
						}
					}
					
					// 페이지 이동
					thisObj.goNextStep(param, movePage);
				}
			}	
		);
	});
}; 


// 다음단계로 페이지 이동
FD5003_V05.prototype.goNextStep = function(param, movePage)
{
	// 펀드매수단계 셋팅
	this.cont.fundStepNow = this.cont.fundStepNow + 1; // 6단계
	
	// 이동할 페이지 셋팅
	var basePage = 'FD5003_V06';
	if(movePage != null)
	{
		basePage = movePage;
	}
	
	// 펀드납입정보입력으로 이동
	this.contTab.tbvManager.changeTab(basePage, param);
};


//----------------------------------------------------//
//------------------ START 적립식 뷰 -------------------//
//----------------------------------------------------//
// 납입방법에 따른 뷰 숨김 처리
FD5003_V05.prototype.onSetPayKindView = function(type)
{
	if(type == '01') // 임의식
	{
		//this.dropPayKindTypeCd = '01';
		this.payWayGubn = '01';	// '01':임의식, '03':적립식    2020.05.13  셀렉트박스->라디오로 교체
		
		// 적립식 뷰 숨김처리
		this.savingPartView.show(AComponent.GONE);
	}
	else if(type == '03') // 적립식
	{
		//dropPayKindTypeCd = '03';
		this.payWayGubn = '03';	// '01':임의식, '03':적립식    2020.05.13  셀렉트박스->라디오로 교체
		
		// 적립식 뷰 보임처리
		this.savingPartView.show(AComponent.VISIBLE);
	}
};


// 적립식뷰 초기화
FD5003_V05.prototype.onSavingViewInit = function()
{
	// 납입주기 (매일, 매월)
	this.onBtnPeriodClick( this.RdoPeriodGrp[0] ); // 매일 선택
	
	// 월납입금액
	this.txtSavingMoney.setText("");
	
	// 월납입일 (5일, 20일, 25일)
	this.onBtnDayClick( this.RdoDayGrp[0] ); // 5일 선택
	
	// 일납입금액
	this.txtDaySavingMoney.setText("");
	
	// 납입기간
	this.txtSavingTerm.setText("");	
};


// 납입주기 클릭
FD5003_V05.prototype.onBtnPeriodClick = function(comp, info)
{
	var RadioSelBtn = comp.getComponentId();
	this.rdoMngrPeriod.selectButton(comp);
	
	if(RadioSelBtn == 'BtnMonthly') // 매월
	{
		this.PeriodTypeCd = "M";
		
		this.view13.show(AComponent.VISIBLE);	// 매월(월납입금액)
		this.view12.show(AComponent.VISIBLE);	// 매월(월납입일)
		this.view19.show(AComponent.GONE);		// 매일(일납입금액)
		
		// 2019.01.03. 연금펀드 매월 적립식 년단위로 문구 및 입력값 세팅 변경
		this.label16.$ele.html("<span class='ctit4'>납입기간<br>(1년 이상)</span>");		
		this.label17.setText('년');
	}
	else if(RadioSelBtn == 'BtnDaily') // 매일
	{
		this.PeriodTypeCd = "D";
		
		this.view13.show(AComponent.GONE);		// 매월(월납입금액)
		this.view12.show(AComponent.GONE);		// 매월(월납입일)
		this.view19.show(AComponent.VISIBLE);	// 매일(일납입금액)
		
		// 2019.01.03. 연금펀드 매월 적립식 년단위로 문구 및 입력값 세팅 변경
		this.label16.$ele.html("<span class='ctit4'>납입기간<br>(12개월 이상)</span>");		
		this.label17.setText('개월');
	}
	
	// 초기화
	this.txtSavingMoney.setText("");	// 월납입금액
	this.txtDaySavingMoney.setText("");	// 일납입금액
	this.txtSavingTerm.setText("");		// 납입기간
	this.onBtnDayClick( this.RdoDayGrp[0] ); // 월납입일
};


// 월납입일 클릭
FD5003_V05.prototype.onBtnDayClick = function(comp, info)
{
	var RadioSelBtn = comp.getComponentId();
	this.rdoMngrDay.selectButton(comp);
	
	if(RadioSelBtn == 'BtnMonthDay5') this.DayTypeCd = '5';
	else if(RadioSelBtn == 'BtnMonthDay20') this.DayTypeCd = '20';
	else if(RadioSelBtn == 'BtnMonthDay25') this.DayTypeCd = '25';
};


// 텍스트 필드의 Blur 이벤트
FD5003_V05.prototype.onTextFieldBlur = function(comp, info)
{
	// active 클래스 제거
	comp.removeClass('active');
};


// 텍스트 필드의 Focus 이벤트
FD5003_V05.prototype.onTextFieldFocus = function(comp, info)
{
	var textFields = [this.txtSavingMoney, this.txtDaySavingMoney, this.txtSavingTerm];
	
	for(var i=0; i<textFields.length; i++)
	{
		textFields[i].removeClass('active');
	}
	
	// active 클래스 추가
	comp.addClass('active');
};
//----------------------------------------------------//
//------------------- END 적립식 뷰 --------------------//
//----------------------------------------------------//


FD5003_V05.prototype.onBtnPayWayClick = function(comp, info)
{

	var thisObj = this;
	var RadioSelectedBtn = comp.getComponentId();

	this.rdoManager3.selectButton(comp);

	// 적립식 뷰 초기화
	thisObj.onSavingViewInit();

	if(RadioSelectedBtn == 'BtnAcc'){			// 적립식

		if(this.payWayGubn == '01'){			// 기존에 selected 된 것과 다른 버튼을 클릭했을 때
			this.payWayGubn = '03';
			thisObj.onSetPayKindView(this.payWayGubn);
		}

	}else if(RadioSelectedBtn == 'BtnTemp'){	// 임의식

		if(this.payWayGubn == '03'){			// 기존에 selected 된 것과 다른 버튼을 클릭했을 때
			this.payWayGubn = '01';
			thisObj.onSetPayKindView(this.payWayGubn);
		}
	}
	
};

