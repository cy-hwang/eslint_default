
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_V10()
{
	AView.call(this);

	//TODO:edit here
	
	this.bankInfo = [];
	
	this.autoBankCode = null; // 은행코드
	this.autoBankName = null; // 은행이름
	
	this.fundBuyAcc = null;	// 펀드계좌
	this.txtPw = null; 
	
	this.autoTransStart = null;	// 자동이체시작일
	this.autoTransEnd = null; // 자동이체종료일
}
afc.extendsClass(FD3202_V10, AView);


FD3202_V10.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	this.lblFundName = this.findCompById('lblFundName'); // 펀드네임
	this.lblFundName2 = this.findCompById('lblFundName2'); // 클래스상세 전체명 추가 2019.09.19
	
	this.lblStep = this.findCompById('lblStep'); // 펀드단계
	
	this.lblFundName.setShrinkInfo({maxChar:20, fontSize:24}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.lblFundName2.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
	
	//계좌번호 로드뷰
	this.accView = this.findCompById('AccView');
	this.accView.viewLoad('FD/view/FD0000_V02.lay');
	
	//계좌드롭박스
	this.accDbx = this.accView.getLoadView().accDbx;
	
	this.txtOrderAbleAmt = this.findCompById('txtOrderAbleAmt'); // 매수가능금액
	this.txtDailyPayMoney = this.findCompById('txtDailyPayMoney'); // 일납입금액
	this.txtTransPeriod = this.findCompById('txtTransPeriod'); // 이체기간
	
	this.initTimeState = 0; // 화면진입 시작 전 시간에 따른 상태값 0-15시 30분 이전, 1-15:30분 이후
	this.btnTimeState = 0; // 자동이체 약정등록 버튼 눌렀을 경우 상태값 0-15시 30분 이전, 1-15:30분 이후
	
	this.transStartDate = null;
	this.transEndDate = null;

};

FD3202_V10.prototype.fundBuyInfoSet = function()
{

	var thisObj = this;
	var cont = thisObj.getContainer();
	
	// 현재 저장되어 있는 계좌를 전부 제거 앞에만 온 계좌와 계좌명만 세팅
	thisObj.accDbx.removeAll();
	
	//for(var i=0; i < thisObj.viewData.accNo.length; i++){
		// 서브계좌를 계좌 컴포넌트에 세팅
		thisObj.accDbx.addItem(thisObj.onAccListExpress(thisObj.viewData.accNo) + " " + this.transAccNm, thisObj.viewData.accNo);
	//}
	
	// 선택한 계좌에 대한 서브계좌는 전부 갖고 있지만 첫번째 계좌로 세팅 후 변경못하도록 함
	thisObj.accDbx.selectItem(0);
	thisObj.accDbx.enable(false);
	thisObj.accDbx.addClass('combo_dis');
	
	thisObj.txtPw = thisObj.viewData.accPw;
	
	//MetaInfo.fnGetToday('NUMDATE')		
	
};

FD3202_V10.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);			
				
};

FD3202_V10.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	cont.view2.scrollTo(0);
	//thisObj.view1.scrollTo(0);
	
	thisObj.txtOrderAbleAmt.setText(''); // 매수가능금액 초기화		
	
	// 선택한 펀드 이름 세팅
	thisObj.lblFundName.setText(cont.selectFundInfo["D1한글투신펀드명"]);		
	thisObj.lblFundName2.setText(cont.selectFundInfo["D1클래스상세 전체명"]); // 클래스상세 전체명 추가 2019.09.19
	
	thisObj.highRankAccNo = thisObj.viewData.highRankAccNo;
	thisObj.fundBuyAcc = thisObj.viewData.accNo;	
	thisObj.accPw = thisObj.viewData.accPw;
	thisObj.dailyPayMoney = thisObj.viewData.dailyPayMoney;
	thisObj.transPeriod = thisObj.viewData.transPeriod;
	thisObj.transAccNm = thisObj.viewData.transAccNm;			
		
	thisObj.txtDailyPayMoney.setText(thisObj.dailyPayMoney); // 일납입금액 Setting
	
	thisObj.txtTransPeriod.setText(''); // 이체기간 계산 초기화 
									
	var lblStepText =[];
	
	lblStepText.push("<span class='fc_red3'>" + cont.fundNowBuyStep + "</span><span class='step'>/" + cont.fundAllBuyStep + "단계</span>");
				
	thisObj.lblStep.$ele.children().eq(0).html(lblStepText);
	
	thisObj.fundBuyInfoSet(); // 계좌번호 세팅
	
	thisObj.checkOrderMoney(); // 매수가능금액 세팅
	
	thisObj.autoTransDateCalc2(0); // 매일 이체기간을 계산하여 세팅
};


//화면소멸 전 이벤트
FD3202_V10.prototype.onWillDeactive = function(reload)
{
	AView.prototype.onWillDeactive.call(this, reload);		
		
};

// 매일 이체기간 계산함수
FD3202_V10.prototype.autoTransDateCalc2 = function(timeState)
{
	var thisObj = this;
	var cont = thisObj.getContainer();	
		
	thisObj.timeCheck(thisObj, function(result){
		
		// result 0:15시 30분 이전, 1:공휴일 or 15시 30분 이후								
		// timeState: 0-화면로딩시 조회, 1-자동이체 약정등록 버튼 클릭시 조회
		if(timeState == 0){
			thisObj.initTimeState = result;
		}else if(timeState == 1){
			thisObj.btnTimeState = result;
		}
		
		cont.bizNextDayCheck(thisObj, function(result){						
			if(timeState == 0){
				thisObj.transStartDate = null; // 이체시작일(표기상, 입력은 Today)
				thisObj.transEndDate = null; // 이체종료일(표기, 입력모두)				

				if(thisObj.initTimeState == 0){										
					thisObj.transStartDate = result["D1출납일기준영업익일"];
					
					var nowEnd = new Date(thisObj.transStartDate.substring(0,4), Number(thisObj.transStartDate.substring(4,6)) + Number(thisObj.transPeriod)-1, thisObj.transStartDate.substring(6,8));
					
					thisObj.transEndDate = nowEnd.format('yyyyMMdd');					
					
				}else if(thisObj.initTimeState == 1){
					thisObj.transStartDate = result["D1출납일기준영업익익일"];
					
					var nowEnd = new Date(thisObj.transStartDate.substring(0,4), Number(thisObj.transStartDate.substring(4,6)) + Number(thisObj.transPeriod)-1, thisObj.transStartDate.substring(6,8));
					
					thisObj.transEndDate = nowEnd.format('yyyyMMdd');					
				}								
				
				thisObj.txtTransPeriod.setText(Utils.formatDotDate(thisObj.transStartDate) + " - " + Utils.formatDotDate(thisObj.transEndDate));
			}else if(timeState == 1){
				if(thisObj.initTimeState == thisObj.btnTimeState){
					thisObj.onbtnAutoTransRegClick(); // 계좌이체등록실행
				}else{
					theApp.alert(
						[	 
							'업무처리시간(15시 30분)이 경과', '<br/>',
							'하여 이체기간 확인 후 자동이체', '<br/>',
							'약정등록을 진행해주세요.', '<br/>',
							,' '
						].join('')
						,
						function()
						{
							thisObj.autoTransDelayCalc();
						}
						,''
					);
				}
			}
		});
	
	});				
};

// 자동이체 약정등록
FD3202_V10.prototype.onbtnAutoTransRegClick = function(comp, info)
{

	var thisObj = this
		,cont = thisObj.getContainer() // 연결된 최상위 뷰
		,qrName = "SACAT502"
		,cipherData = thisObj.txtPw; // 전 페이지에서 이미 getCipherData()를 사용해서 넘오옴
		
	if(!thisObj.fundBuyAcc){
		AToast.show('매수하실 계좌번호가 없습니다.');
		return;
	}
	
	if(!afc.isSimulator)
	{
		if(!cipherData)
		{
			AToast.show('계좌 비밀번호를 확인하세요');
			return;
		}
	}
			
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.fundBuyAcc
	};
	
	// 이체시작일이 약정등록일(영업일) + 4보다 전일자입니다. 메시지 스킵
	//theApp.accNetManager.addSkipErrorCode('SACAT516', '3691');
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){				
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				// 수정하기 위해 펑션키 수정
				queryData.setHeaderInfo(
					{FUNC_KEY_LST: '5'}
				);
		
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				
				InBlock1['D1처리구분'] = '1';
				InBlock1['D1계좌번호'] = thisObj.highRankAccNo;
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;
				InBlock1['D1서비스종류코드'] = '3206';
				InBlock1['D1매도투신펀드코드'] = '';
				InBlock1['D1대체상대계좌번호'] = checkObj.accNo;
				InBlock1['D1매수투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드'];
				InBlock1['D1환불금은행이체여부'] = '';
				InBlock1['D1자동대체일'] = '00';
				InBlock1['D1은행자동이체금액'] = thisObj.dailyPayMoney;
				InBlock1['D1약정만료일'] = thisObj.transEndDate; // 이체종료일
				InBlock1['D1은행이체비밀번호'] = '';
				InBlock1['D1약정시작일'] = thisObj.transStartDate // 이체시작일
				InBlock1['D1자동이체입금일'] = '';
				
				queryData.putPwInfo('InBlock1', 'D1비밀번호');
				
				//queryData.printQueryData();

			},
			function(queryData, groupName)
			{				
				var errMsg = this.getLastError('errMsg');
				var errCode = this.getLastError('errCode');				
				
				// errCode:0210, errMsg:계정대체약정 등록이 완료되었습니다.								
								
				if(queryData)
				{
					//queryData.printQueryData();
					
					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
					if(OutBlock1){
						// finishGubun(1:임의식, 2:적립식)   monthGubun(21:월적립식, 22:일적립식)
						cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V09', {finishGubun:'2', monthGubun:'22'});
					}
				}				
				// 투신펀드 서브계좌이므로 투신펀드로 변경 
			}//, checkObj.accNo.substring(0,11) // 2018.07.27 자동이체약정 시 SMS 절차 생략
		);
	});
};

// 매수가능금액 조회
FD3202_V10.prototype.checkOrderMoney = function(fundBuyRegDate, basePriceDate, buyPayDate)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
//	var accNo = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];

	var qrName = "SDPAQ066"		
	,cipherData = thisObj.txtPw;			


	var checkObj = {
		svcId : qrName,
		accNo : thisObj.accDbx.getSelectedItemData()
	};


	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{

				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				InBlock1['D1계좌번호'] = checkObj.accNo
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;

				if(!afc.isSimulator){
					queryData.putPwInfo('InBlock1', 'D1비밀번호');
				}

				//queryData.printQueryData();
			},
			function(queryData, groupName)
			{				
				if(queryData)
				{						
					//queryData.printQueryData();

					var outBlock1 = queryData.getBlockData('OutBlock1')[0];
					var outBlock2 = queryData.getBlockData('OutBlock5')[0];
					
					thisObj.txtOrderAbleAmt.setText(outBlock2["D1인출가능금액"]);

					if( outBlock2["D1인출가능금액"] == 0){										

						// 확인버튼만 있는 알림창
						theApp.alert('매수가능금액이 없습니다. 펀드<br/>매수를위해 우리은행 가상계좌로<br/>입금해주시기 바랍니다.', function(result){
							if(result){
								thisObj.buyFundNotMoneyPopup();
							}
						}, '알림');					
					}

				}
			}

		);
	});	
	
	// 2018.11.14 SOFFQ218 ->SDPAQ066 주문가능금액 조회 서비스 변경
	/*
	cont.sendData('SOFFQ218',
		function(queryData, groupName)
		{
		
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
										
			InBlock1['D1처리구분'] = "2"; // 1:매도, 2:매수
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData();
			InBlock1['D1투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드'];
			InBlock1['D1매수주문금액'] = "";
			InBlock1['D1매도계좌번호'] = "";
			InBlock1['D1매도투신펀드코드'] = "";															
										
		 },
		function(queryData, groupName)
		{
		
			var errMsg = this.getLastError('errMsg');
			var errCode = this.getLastError('errCode');
															
			if(queryData)
			{
				//queryData.printQueryData();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];								
								
				thisObj.txtOrderAbleAmt.setText(OutBlock1["D1주문가능금액"]);
				
				if( OutBlock1["D1주문가능금액"] == 0){
															
					// 확인버튼만 있는 알림창
					theApp.alert('매수가능금액이 없습니다. 펀드<br/>매수를위해 우리은행 가상계좌로<br/>입금해주시기 바랍니다.', function(result){
						if(result){
							thisObj.buyFundNotMoneyPopup();
						}
					}, '알림');					
				}
			}
		});
	*/	
};

FD3202_V10.prototype.buyFundNotMoneyPopup = function()
{
	var win = AWindow.createWindow('FD/window/FD3202_W12.lay','FD320212');
									
	win.openAsDialog(this, 584, 660);
};

// 이체시작일과 종료일을 변경(15시 30분 이전 펀드가입 이후, 15시 30분 이후 자동이체 약정등록 버튼 클릭일 경우 다시 계산)
FD3202_V10.prototype.autoTransDelayCalc = function()
{	
	// 이체시작일과 종료일 다시 조회
	this.autoTransDateCalc2(0);
};

FD3202_V10.prototype.onAccListExpress = function(accInfoData)
{
	var accExpress = accInfoData;	
	var reAccExpress;
	
	reAccExpress = accExpress.substring(0,3) + "-" + accExpress.substring(3,5) + "-" + accExpress.substring(5,11) + "-" +  accExpress.substring(11,accExpress.length);
	
	return reAccExpress;	
};

FD3202_V10.prototype.timeCheck = function(caller){

	var thisObj= this;
	var cont = thisObj.getContainer();
	
	var thisObj2 = caller
		,callback = arguments[1];
		
	var timeState = 0; //

	cont.bizNextDayCheck1(thisObj, function(){ // 영업일인지 아닌지 체크
		cont.nowTimeCheck(thisObj, function(){ // 현재 시간 체크
		
			// 0-영업일 15:30분 이전은 +1영업일부터 자동이체, 1-공휴일인경우와 영업일 15:30분 이후는 +2영업일부터 자동이체
			if(cont.g_bizDateCheck == 0){ // 영업일이 아닌 경우
				timeState = 1;
			}else if(cont.g_bizDateCheck == 1){ // 영업일인 경우				
				if(cont.g_nowTime <= 153000){					
					timeState = 0;
				}else if(cont.g_nowTime > 153000){
					timeState = 1;
				}
			}
			
			callback(timeState); // 현재펀드매수매도 가능상태 체크한 후 콜백
		});
	});
}


FD3202_V10.prototype.onbtnAutoTransReg = function(comp, info)
{

	//TODO:edit here
	this.autoTransDateCalc2(1); // 이체시간 계산하여 자동이체등록

};
