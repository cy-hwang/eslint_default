
/**
Constructor
Do not call Function in Constructor.
*/

function FD3202_V06()
{
	AView.call(this);

	//TODO:edit here
	
	// 현재 선택된 펀드계좌로 선택한 펀드를 임의식으로 선택했을 때 이미 가입되어 있다면 리스트에 넣음
	this.arrSubAccNo = [];	
}
afc.extendsClass(FD3202_V06, AView);


FD3202_V06.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
			
	this.lblStep = this.findCompById('lblStep');
	
	// 공통영역 뷰
	this.dropAccInfo = this.findCompById('dropAccInfo');
	this.txtPassword = this.findCompById('txtPassword');
	// this.dropPayKind = this.findCompById('dropPayKind'); // 2020.05.13  셀렉트박스->라디오로 교체
		
	// this.dropPayKind.addItem('적립식', '03');		// 2020.05.13  셀렉트박스->라디오로 교체
	// this.dropPayKind.addItem('임의식', '01');		// 2020.05.13  셀렉트박스->라디오로 교체
	
	// this.dropPayKind.selectItem(0);				// 2020.05.13  셀렉트박스->라디오로 교체
		
	// 적립식 뷰
	this.savingPartView = this.findCompById('savingPartView');
	this.txtSavingMoney = this.findCompById('txtSavingMoney');
	this.txtSavingTerm = this.findCompById('txtSavingTerm');
	
	this.txtDaySavingMoney = this.findCompById('txtDaySavingMoney');
	
	// 펀드이름
	this.lblFundName = this.findCompById('lblFundName');
	this.lblFundName2 = this.findCompById('lblFundName2'); // 클래스상세 전체명 추가 2019.09.19
		
	this.btnNext6 = this.findCompById('btnNext6');
	
	this.lblFundName.setShrinkInfo({maxChar:20, fontSize:24}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.lblFundName2.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
	
	
	// 매월과 매일 선택 시 보여줄 컴포넌트
	this.view13 = this.findCompById('View13'); // 매월 월납입금액
	this.view12 = this.findCompById('View12'); // 매월 월 납일일
	
	this.view19 = this.findCompById('View19'); // 매일 일 납입금액
	
	
	// 라디오그룹 생성(적립일식일때만 해당)
	this.rdoManager = new RadioBtnManager(this);
	this.RadioSelDayrGrp = this.findCompByGroup('RadioSelDayrGrp');
	
	//라디오그룹 생성(적립식일때만 해당) 매월, 매일 선택
	this.rdoManager2 = new RadioBtnManager(this);
	this.RadioSelMDGrp = this.findCompByGroup('RadioSelMDGrp');
	
	//라디오그룹 생성 (2020.05.13 셀렉트박스->라디오 교체)
	this.rdoManager3 = new RadioBtnManager(this);
	this.RadioPayWay = this.findCompByGroup('RadioPayWay');

	//////////////////////////////////////////////////////
	
};

FD3202_V06.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
			
};


FD3202_V06.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	var thisObj = this;
	var cont = thisObj.getContainer();

	thisObj.View1 = thisObj.findCompById('View1');
		
	cont.view2.scrollTo(0);
	
	// 페이지 중간에 들어올 가능성이 있으므로 페이지 진입했을 경우에는 상단 Simple Choice, 펀드 더보기 숨김처리
	cont.scrToolView.show(AComponent.GONE); // 상단 Simple Choice, 펀드 더보기 숨김처리
	
	cont.titleLbl.setText('펀드매수');
	
	// 2020.05.13  셀렉트박스->라디오로 교체
	/*thisObj.dropPayKind.removeAll();
		
	thisObj.dropPayKind.addItem('적립식', '03');
	thisObj.dropPayKind.addItem('임의식', '01');*/
	
	// 2020.05.13 셀렉트박스->라디오로 교체
	thisObj.rdoManager3.selectButton(thisObj.RadioPayWay[0]); // 첫번째(적립식) 선택
	thisObj.payWayGubn = '03';	// '01':임의식, '03':적립식    2020.05.13  셀렉트박스->라디오로 교체
	
	
	//계좌번호 비밀번호 로드뷰
	thisObj.accView = thisObj.findCompById('AccView');
	thisObj.accView.viewLoad('FD/view/FD0000_V01.lay');
	
	//계좌드롭박스
	thisObj.accDbx = thisObj.accView.getLoadView().accDbx;
	thisObj.secureTxf = thisObj.accView.getLoadView().secureTxf;
	
	// 다음 단계 화면 로드시 비활성화
	// 시뮬레이터 화면이 아닐 경우에만 비활성화
	if(!afc.isSimulator){
		thisObj.btnNext6.enable(false);
	}

	// 선택한 펀드 네임 세팅
	thisObj.lblFundName.setText(cont.selectFundInfo["D1한글투신펀드명"]);
	thisObj.lblFundName2.setText(cont.selectFundInfo["D1클래스상세 전체명"]); // 클래스상세 전체명 추가 2019.09.19
	
	var lblStepText =[];
	
	lblStepText.push("<span class='fc_red3'>" + cont.fundNowBuyStep + "</span><span class='step'>/" + cont.fundAllBuyStep + "단계</span>");
				
	thisObj.lblStep.$ele.children().eq(0).html(lblStepText);
	//thisObj.lblStep.setText( cont.fundNowBuyStep + "/" +cont.fundAllBuyStep + " 단계");
		
	// 계좌세팅(투신상품만 조회)
	thisObj.accView.getLoadView().doInitAccInfo(4);
	
	// 계좌번호 선택 변경하지 못하도록 
	thisObj.accDbx.enable(false);
	thisObj.accDbx.addClass('combo_dis');
	
	// 2018.11.02 초기에는 적립식으로 세팅하는걸로 변경
	thisObj.savingFundSelect();
	
	// 시작할 때 모든 값 초기화
	thisObj.setDataInit();
	
	cont.nowTradeStateCheck(thisObj, function(){		
		// 일반펀드매수, 예약펀드매수 모두 불가상태
		if(cont.g_tradeState == 3){
			theApp.alert(
				[	 
					//'펀드매매가능시간이 아닙니다.'					
					'펀드매매 이용시간은 ', '<br/>',
					'오전 7시~오후23시까지', '<br/>',
					'(한국시간 기준)입니다.', '<br/>',
					,' '
				].join('')
				,
				function()
				{			
					cont.fundTradePopoup();
				}
				,''
			);
		}else if(cont.g_tradeState == 1 || cont.g_tradeState == 2 || cont.g_tradeState == 4){ // 일반펀드매수 또는 예약펀드매수 가능
		}
	});
	
	// 2018/05/31 스크롤 관련하여 높이 조절하는 부분 추가
	thisObj.fundActiveH = theApp.prefInfo.get('fundScroll2');
	
	if(!thisObj.fundActiveH){		
	
	}else{
		thisObj.fundActiveH = theApp.prefInfo.get('fundScroll2');
		
		cont.view5.setHeight(thisObj.fundActiveH + cont.scrToolView.getHeight());
	}
				
};

FD3202_V06.prototype.fundTradePopoup = function()
{
	theApp.goPrevPageCheck(false);
};

FD3202_V06.prototype.optFundSelect = function()
{
	//this.dropPayKind.selectItem(0);   // 2020.05.13 셀렉트박스->라디오로 교체
		
	//적립식 뷰 히든
	this.savingPartView.show(AComponent.GONE); // 숨김처리	
//	this.savingPartView.show(AComponent.VISIBLE); // 보임처리
};

FD3202_V06.prototype.savingFundSelect = function()
{
	// 2018.11.02 임의식과 적립식 순서가 변경됨
	//this.dropPayKind.selectItem(0); // 2020.05.13 셀렉트박스->라디오로 교체
	
	//적립식 뷰 보임
//	this.savingPartView.show(AComponent.GONE); // 숨김처리	
	this.savingPartView.show(AComponent.VISIBLE); // 보임처리
};

// 다음 버튼
FD3202_V06.prototype.onbtnNext6Click = function(comp, info)
{
	// 임의식인지 적립식인지에 따라서 구분	
	//if(this.dropPayKind.getSelectedItemData() == '01'){ // 임의식일 경우 이미 가입된 펀드인지 체크     2020.05.13  셀렉트박스->라디오로 교체
	
	//if(this.payWayGubn == '01'){ // 임의식일 경우 이미 가입된 펀드인지 체크
	var selectedRadio1 = this.rdoManager3.getSelectButton();
	if(selectedRadio1.compId == 'BtnTemp'){		// 임의식
		this.isFundJoinCheck();
	}else{
		this.isFundDangerCheck();				// 적립식일 경우 위험도 체크		
	}
};

FD3202_V06.prototype.isFundDangerCheck = function()
{
	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();		
	
	var fundDangerInfo = cont.selectFundInfo["D1위험도코드"]; //
			
	if(!thisObj.accDbx.getSelectedItemData() || !thisObj.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator)
	{
		if(!thisObj.secureTxf.getCipherData())
		{
			AToast.show('계좌 비밀번호를 입력하세요.');
			thisObj.secureTxf.addClass('active');
			return;
		}
	}
	
	// 적립식 뷰에 들어갈 값 체크
	if(thisObj.valueCheck()){		
		//부적합 금융투자상품거래 확인서 작성 다시 확인(잔고화면 혹은 중간단계에서 올수도 있으므로)
		if(cont.g_UserGrade >= fundDangerInfo){
			thisObj.confirmNextStep();			
		}else{
			thisObj.nonReportChk();
		}
	}
};

// 부적합금융투자상품거래확인서 필요 조회 함수
FD3202_V06.prototype.nonReportChk = function()
{
	var thisObj = this;
	var cont = thisObj.getContainer();
		
	thisObj.accNo = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];		
	thisObj.fundCode= cont.selectFundInfo["D1투신펀드코드"];
	
	thisObj.TrxTp = '3'; // 1:등록, 3:조회
	
	// 해당계좌에 해당펀드에 대한 부적합금융투자상품거래확인서 등록여부 조회
	cont.nonReportRegChk(thisObj, function(oBlock){			
		if(oBlock == "0136"){			
			thisObj.confirmNextStep();
		}else if(oBlock == "3956"){
			// 부적정으로 부적합보고서 작성 가능 페이지로 변동
			theApp.confirm('이 펀드를 매수하기 위해서는<br/>부적합금융투자상품거래서 작성이<br/>필요합니다. 계속 진행하시겠습니까?',
				function(result){
					if(result){
						thisObj.onInvestInfoPopup();
					}else{

					}					
				}
				,'', ['예','아니오']
			);
		}
	});		
};

// 부적합금융투자상품거래확인서 필요 조회 함수
FD3202_V06.prototype.nonReportReg = function()
{
	var thisObj = this;
	var cont = thisObj.getContainer();
		
	thisObj.accNo = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];	
	thisObj.fundCode= cont.selectFundInfo["D1투신펀드코드"];
	
	thisObj.TrxTp = '1'; // 1:등록, 3:조회
	
	// 해당계좌에 해당펀드에 대한 부적합거래확인서 등록
	cont.nonReportRegChk(thisObj, function(oBlock){		
		if(oBlock){
			
			// 팝업창에서 토스트창으로 변경			
			AToast.show("부적합 금융투자상품 거래 확인서 작성이 완료되었습니다.");
			thisObj.confirmNextStep();
			
		}else
		{
			// 부적합금융투자상품 거래 확인서 작성이 실패하였을 경우에는 팝업
			theApp.alert(
				[	 
					'부적합 금융투자상품 거래 확인서', '<br/>',
					'작성에 실패하였습니다..'					
					,' '
				].join('')
				,
				function()
				{
					// 팝업창이 닫힌 이후에 사용될 함수
				}
				,''
			);
		}
	});		
};

FD3202_V06.prototype.onInvestInfoPopup = function()
{
	var win = AWindow.createWindow('FD/window/FD3202_W02.lay','MS3202W2');		
		
	win.openAsDialog(this);
};


FD3202_V06.prototype.onWindowResult = function(result, windowObj)
{
	//TODO:edit here	
	if(windowObj.containerId == 'MS3202W2'){
	
		if(result == 1){
			var thisObj = this;		
			thisObj.nonReportReg();			
		}
	}
};

// 부적합거래상품서 체크 혹은 고객등급보다 펀드위험도 등급이 낮으면 다음 Step 진행
FD3202_V06.prototype.confirmNextStep = function()
{		
		this.joinFund();	// 적립식일 경우 신규가입
};

// 임의식일 경우 이미 가입된 펀드인지 확인
FD3202_V06.prototype.isFundJoinCheck = function()
{		
	var thisObj = this
		,cont = thisObj.getContainer() // 연결된 최상위 뷰
		,qrName = "SOFFQ365"
		,accNo = thisObj.accDbx.getSelectedItemData()['D1계좌번호']
		,cipherData = thisObj.secureTxf.getCipherData()
		,isOptFundResult = 0; // 이미 가입된 펀드가 있는지 체크 0:없음, 1:가입된 펀드 있음		
		
	if(!thisObj.accDbx.getSelectedItemData() || !thisObj.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
			
	cont.sendData(qrName, 
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];

			InBlock1['D1계좌번호'] = accNo;
			InBlock1['D1비밀번호'] = '1'; // 비밀번호의 길이가 0이면 비밀번호 체크하는 부분에서 걸리므로 1 세팅
			InBlock1['D1잔고유무여부'] = '';			
						
		},
		function(queryData, groupName)
		{				
			var errMsg = this.getLastError('errMsg');
			var errCode = this.getLastError('errCode');
			
			var arrCnt = 0;

			if(queryData)
			{								
				var OutBlock2 = queryData.getBlockData('OutBlock2');

				for(var i=0; i < OutBlock2.length; i++){
					if(OutBlock2[i]["D1납입방법명"] == "임의식"){						
						if(OutBlock2[i]["D1투신펀드코드"] == cont.selectFundInfo["D1투신펀드코드"]){
							// 임의식으로 가입되어있는 모든 서브계좌번호 저장
							thisObj.arrSubAccNo[arrCnt] = accNo + OutBlock2[i]["D1계좌일련번호"];
							arrCnt++;
							isOptFundResult = 1; // 선택한 펀드계좌로 선택한 펀드를 가입한 내용이 있다고 체크
						}
					}
				}
								
				// 현재 선택한 펀드가 이미 가입되어 있는 펀드라면 신규가입이 아닌 추가매수를 하도록 함.
				if(isOptFundResult == '1'){
					if(cont.selectFundInfo["D1투신펀드코드"] == "4074"){
						thisObj.subAccNo = thisObj.arrSubAccNo[0]; // 여러개 있는 경우 첫번째 계좌만 사용
						thisObj.txtAccPw = cipherData;
						thisObj.fundCode = cont.selectFundInfo["D1투신펀드코드"];
						thisObj.txtReqMoney = 0;
						
						cont.monthRequestCheck(thisObj, function(oBlock){
							//oBlock 값이 에러코드임
							thisObj.fundOrderData1 ={ 'accNo':thisObj.arrSubAccNo,
													 'accPw':afc.isSimulator ? '0423' : cipherData,
													 'monthPayYn': oBlock,
													 'moAccNo': accNo
													};
							cont.fundNowBuyStep = cont.fundNowBuyStep + 1; // 다음스텝 넘어가기 전 세팅(6단계)
							cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V07', thisObj.fundOrderData1);

						});	
					}else{
						thisObj.fundOrderData1 ={ 'accNo':thisObj.arrSubAccNo,
												 'accPw':afc.isSimulator ? '0423' : cipherData,
												 'moAccNo': accNo
												};
						cont.fundNowBuyStep = cont.fundNowBuyStep + 1; // 다음스텝 넘어가기 전 세팅(6단계)
						cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V07', thisObj.fundOrderData1);
					}
				}else{
					thisObj.isFundDangerCheck();
				}
			}
		}
	);					
};

// 펀드가입
FD3202_V06.prototype.joinFund = function()
{

	var thisObj = this
		,cont = thisObj.getContainer() // 연결된 최상위 뷰
		,qrName = "SACMT203"
		,cipherData = thisObj.secureTxf.getCipherData()
		,payMethod; // 펀드납입방법
		
	if(!thisObj.accDbx.getSelectedItemData() || !thisObj.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator)
	{
		if(!cipherData)
		{
			AToast.show('계좌 비밀번호를 입력하세요.');
			return;
		}
	}
	
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.accDbx.getSelectedItemData()['D1계좌번호']
	};

	//payMethod = thisObj.dropPayKind.getSelectedItemData(); // 납입방법 체크
	payMethod = thisObj.payWayGubn; // 납입방법 체크('01':임의식, '03':적립식)

	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
			
				// 임의식인 경우는 기존에 가입된 펀드라면 무조건 추가매수로 처리
				InBlock1['D1처리구분'] = '1';
				InBlock1['D1상위계좌번호'] = checkObj.accNo;
				InBlock1['D1계좌비밀번호'] = afc.isSimulator ? '0423' : result;
				InBlock1['D1계좌한글부기명'] = '';
				InBlock1['D1계좌영문부기명'] = '';
				InBlock1['D1관리사원번호'] = '';
				InBlock1['D1권유자사원번호'] = '';

				var InBlock2 = queryData.getBlockData('InBlock2')[0];

				//공통
				InBlock2['D1상품상세코드'] = cont.selectFundInfo['D1투신상세코드'];
				InBlock2['D1투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드'];
				InBlock2['D1납입방법코드'] = payMethod;

				// 임의식 계좌일때 
				if(payMethod == '01'){				
					InBlock2['D1계약기간월수'] = '';
					InBlock2['D1월납입일'] = '';
					InBlock2['D1납입단위금액'] = '';
					InBlock2['D1과세유형코드'] = '01'; // 일반펀드 과세유형
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
				}else if(payMethod == '03'){ // 적립식 계좌일때
					InBlock2['D1계약기간월수'] = thisObj.txtSavingTerm.getText();
					if(thisObj.MonthlyDaily == "M"){
						InBlock2['D1월납입일'] = thisObj.monthSelDay;
						InBlock2['D1납입단위금액'] = thisObj.txtSavingMoney.getText();
					}else if(thisObj.MonthlyDaily == "D"){
						InBlock2['D1납입방법코드'] = "04";
						InBlock2['D1월납입일'] = "";
						InBlock2['D1납입단위금액'] = "999999999999";
					}
					
					InBlock2['D1과세유형코드'] = '01'; // 일반펀드 과세유형
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
				}
				
				//queryData.printQueryData();

				queryData.putPwInfo('InBlock1','D1계좌비밀번호');
				
			},//--end inblock			
			function(queryData, groupName)
			{				
				var errMsg = this.getLastError('errMsg');
				var errCode = this.getLastError('errCode');

				if(queryData)
				{								
					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];	
					
					//queryData.printQueryData();
				}

				if(errCode == '0015'){
					if(payMethod == '01'){ // 임의식일 경우
					
						// 이미 가입되어 있는 펀드계좌와 같은 형식으로 전달하기 위함
						thisObj.arrSubAccNo[0] = OutBlock1["D1서브계좌번호"]; 
						
						// 임의식, 거치식일 경우 데이터
						thisObj.fundOrderData1 ={ 'accNo':thisObj.arrSubAccNo,
								'accPw': afc.isSimulator ? '0423' : cipherData
							};
						cont.fundNowBuyStep = cont.fundNowBuyStep + 1; // 다음스텝 넘어가기 전 세팅(6단계)	
						cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V07', thisObj.fundOrderData1);
					}else if(payMethod == '03'){
						// 적립식인데 매월 자동이체할 경우
						if(thisObj.MonthlyDaily == "M"){
							// 적립식일 경우 데이터 채우고 자동이체 팝업화면						
							thisObj.fundOrderData2 = { 'accBank':'',
									'accNo':OutBlock1["D1서브계좌번호"],
									'accPw': afc.isSimulator ? '0423' : cipherData,
									'monthPayMoney':thisObj.txtSavingMoney.getText(),
									'monthPayDate':thisObj.monthSelDay,
									'transPeriod':thisObj.txtSavingTerm.getText(),
									'transAccNm':thisObj.accDbx.getSelectedItemData()['D1계좌명'],
									'moAccNo':checkObj.accNo
								};
							cont.fundNowBuyStep = cont.fundNowBuyStep + 1; // 다음스텝 넘어가기 전 세팅(6단계)
							cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V08', thisObj.fundOrderData2);
						}
						else if(thisObj.MonthlyDaily == "D"){
							// 적립식인데 매일 자동이체할 경우										
							thisObj.fundOrderData2 = { 'accBank':'',
									'highRankAccNo' : checkObj.accNo,
									'accNo':OutBlock1["D1서브계좌번호"],
									'accPw': afc.isSimulator ? '0423' : cipherData,
									'dailyPayMoney':thisObj.txtDaySavingMoney.getText(),
									'monthPayDate':thisObj.dailyPayMoney,
									'transPeriod':thisObj.txtSavingTerm.getText(),
									'transAccNm':thisObj.accDbx.getSelectedItemData()['D1계좌명'],
									'moAccNo':checkObj.accNo
								 };

							cont.fundNowBuyStep = cont.fundNowBuyStep + 1; // 다음스텝 넘어가기 전 세팅(6단계)
							cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V10', thisObj.fundOrderData2);
						}
					}
				}
			}	
		);
	});		
};


FD3202_V06.prototype.valueCheck = function(comp, info)
{

	// 2020.05.13  셀렉트박스->라디오로 교체
	/*if(this.dropPayKind.getSelectedItemData() == '01'){
								
	}else if(this.dropPayKind.getSelectedItemData() == '03'){*/
	var selectedRadio1 = this.rdoManager3.getSelectButton();
	
	if(selectedRadio1.compId == 'BtnTemp'){		// 임의식
								
	}else if(this.payWayGubn == '03'){	// 적립식

		if(this.MonthlyDaily == "M"){		// 월 적립식
		
			if(!this.txtSavingMoney.getText()){
				AToast.show("월납임금액을 입력하세요");
				this.txtSavingMoney.addClass('active');

				return false;
			}

			if(this.txtSavingMoney.getText() < 50000){
				AToast.show("월납입금액은 최소 5만원 이상입니다.");
				this.txtSavingMoney.addClass('active');

				return false;
			}			
		}else if(this.MonthlyDaily == "D"){	// 일 적립식

			if(!this.txtDaySavingMoney.getText()){
				AToast.show("일납임금액을 입력하세요");
				this.txtDaySavingMoney.addClass('active');

				return false;
			}

			if(this.txtDaySavingMoney.getText() < 5000){
				AToast.show("일납입금액은 최소 5천원 이상입니다.");
				this.txtDaySavingMoney.addClass('active');

				return false;
			}
		}
		
		// this.dropSavingDay // 월납입일 선택 컴포넌트
		if(!this.txtSavingTerm.getText()){
			AToast.show("납입기간을 선택하세요");
			this.txtSavingTerm.addClass('active');
			return false;
		}else if(this.txtSavingTerm.getText() < 12){
			AToast.show("납입기간이 12개월 이상이어야 합니다.");
			this.txtSavingTerm.addClass('active');

			return false;
		}
		
	}
	
	return true;
};

// 비밀번호 넣은 후 동작하는 함수
FD3202_V06.prototype.sendDataManage = function()
{

	if(!afc.isSimulator)
	{
		if(!this.secureTxf.getCipherData())
		{
			
			return;
		}
		else{
			this.secureTxf.removeClass('active');
			this.btnNext6.enable(true);
		}
	}
};

// 컴포넌트 모두 초기화
FD3202_V06.prototype.setDataInit = function()
{
								
	// 적립식 뷰	
	this.txtSavingMoney.setText(""); // 월납입금액
	
	this.txtDaySavingMoney.setText(""); // 일납입금액	
	
	this.rdoManager.selectButton(this.RadioSelDayrGrp[0]); // 첫번째(5일) 선택
	this.rdoManager2.selectButton(this.RadioSelMDGrp[0]); // 첫번째(매일) 선택
	
	
	// 2018.11.02 적립식 매수 중 매일이 앞으로 변경
	this.view13.show(AComponent.GONE); // 매월 월납입금액 히든
	this.view12.show(AComponent.GONE); // 매월 월 납일일 히든
	
	this.view19.show(AComponent.VISIBLE); // 매일 일 납입금액 히든
	
	//this.view13.show(AComponent.VISIBLE); // 매월 월납입금액 보임
	//this.view12.show(AComponent.VISIBLE); // 매월 월 납일일 보임
	
	//this.view19.show(AComponent.GONE); // 매일 일 납입금액 히든
	
	this.MonthlyDaily = "D"; // 매월:M, 매일:D
	this.monthSelDay = '5'; // 기본값 세팅
	
	
	this.txtSavingTerm.setText(""); // 납입기간		
	
};

FD3202_V06.prototype.onbtnMonthDayClick = function(comp, info)
{
	//TODO:edit here
	var RadioSelBtn = comp.getComponentId();
	
	this.rdoManager.selectButton(comp);
	
	if(RadioSelBtn == 'btnMonthDay5'){
		this.monthSelDay = '5';
	}else if(RadioSelBtn == 'btnMonthDay20'){
		this.monthSelDay = '20';
	}else if(RadioSelBtn == 'btnMonthDay25'){
		this.monthSelDay = '25';
	}
	
};

FD3202_V06.prototype.onBtnMonthlyDailyClick = function(comp, info)
{

	//TODO:edit here
	var RadioSelBtn = comp.getComponentId();
	
	this.rdoManager2.selectButton(comp);
	
	if(RadioSelBtn == 'BtnMonthly'){
		
		this.MonthlyDaily = "M";
		
		this.view13.show(AComponent.VISIBLE); // 매월 월납입금액
		this.view12.show(AComponent.VISIBLE); // 매월 월 납일일
	
		this.view19.show(AComponent.GONE); // 매일 일 납입금액
						
		this.txtSavingTerm.setText("");
		this.txtDaySavingMoney.setText("");
		
		
	}else if(RadioSelBtn == 'BtnDaily'){
		
		this.MonthlyDaily = "D";
		
		this.view13.show(AComponent.GONE); // 매월 월납입금액
		this.view12.show(AComponent.GONE); // 매월 월 납일일
	
		this.view19.show(AComponent.VISIBLE); // 매일 일 납입금액
		
		this.txtSavingTerm.setText("");
		this.txtSavingMoney.setText("");
		
	}

};

FD3202_V06.prototype.onBtnPayWayClick = function(comp, info)
{
	var thisObj = this;
	var RadioSelectedBtn = comp.getComponentId();

	this.rdoManager3.selectButton(comp);

	thisObj.setDataInit();
	
	if(RadioSelectedBtn == 'BtnAcc'){			// 적립식
	
		if(this.payWayGubn == '01'){			// 기존에 selected 된 것과 다른 버튼을 클릭했을 때
			this.payWayGubn = '03';
			thisObj.savingFundSelect();
		}

	}else if(RadioSelectedBtn == 'BtnTemp'){	// 임의식
	
		if(this.payWayGubn == '03'){			// 기존에 selected 된 것과 다른 버튼을 클릭했을 때
			this.payWayGubn = '01';
			thisObj.optFundSelect();
		}
	}

};

FD3202_V06.prototype.ontxtSavingMoneyBlur = function(comp, info)
{

	//TODO:edit here
	this.txtSavingMoney.removeClass('active');

};

FD3202_V06.prototype.ontxtSavingTermBlur = function(comp, info)
{

	//TODO:edit here
	this.txtSavingTerm.removeClass('active');
};

FD3202_V06.prototype.ontxtDaySavingMoneyBlur = function(comp, info)
{	
	
	//TODO:edit here
	this.txtDaySavingMoney.removeClass('active');

};
