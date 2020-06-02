
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_V07()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD3202_V07, AView);


FD3202_V07.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	this.txtPw 				= null;
	this.txtOrderAbleAmt 	= this.findCompById('txtOrderAbleAmt'); // 매수가능금액	
	this.txtOrderAmt 		= this.findCompById('txtOrderAmt'); //매수금액
	this.txtReportDate 		= this.findCompById('txtReportDate'); // 신청일
	this.txtBasePriceDate 	= this.findCompById('txtBasePriceDate'); // 기준가적용일
	this.txtBuyDate 		= this.findCompById('txtBuyDate'); // 매수일
	
	this.lblStep = this.findCompById('lblStep');
	
	this.lblFundName = this.findCompById('lblFundName');
	this.lblFundName2 = this.findCompById('lblFundName2'); // 클래스상세 전체명 추가 2019.09.19
	
	this.lblFundName.setShrinkInfo({maxChar:20, fontSize:24}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.lblFundName2.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
	
	// 월지급 약정 선택 화면 뷰
	this.view14 = this.findCompById('View14');
	
	this.rdoManager = new RadioBtnManager(this);
	this.chkMonthReqGrp = this.findCompByGroup('chkMonthReqGrp');
	
	
	//계좌번호 로드뷰
	this.accView = this.findCompById('AccView');
	this.accView.viewLoad('FD/view/FD0000_V02.lay');
	
	//계좌드롭박스
	this.accDbx = this.accView.getLoadView().accDbx;
	
	this.btnNext6 = this.findCompById('btnNext6');
	
};

FD3202_V07.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);			

};

FD3202_V07.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);			
		
//	this.fundBuyInfoInit();

	var thisObj = this;
	var cont = thisObj.getContainer();
		
	cont.view2.scrollTo(0);
	
	// 선택한 펀드 이름 세팅
	thisObj.lblFundName.setText(cont.selectFundInfo["D1한글투신펀드명"]);
	thisObj.lblFundName2.setText(cont.selectFundInfo["D1클래스상세 전체명"]); // 클래스상세 전체명 추가 2019.09.19
	
	var lblStepText =[];
	
	lblStepText.push("<span class='fc_red3'>" + cont.fundNowBuyStep + "</span><span class='step'>/" + cont.fundAllBuyStep + "단계</span>");
				
	thisObj.lblStep.$ele.children().eq(0).html(lblStepText);
	
	//thisObj.lblStep.setText( cont.fundNowBuyStep + "/" +cont.fundAllBuyStep + " 단계"); // 마지막단계임	
	
	thisObj.rsvDt = ''; // 예약주문일 초기화
		
	// 월지급 약정 뷰 숨김		
	// 시니어 펀드일 경우 월지급 약정 뷰 보임(시니어펀드코드 - 4074)	
	if(cont.selectFundInfo["D1투신펀드코드"] == "4074"){
		if(thisObj.viewData.monthPayYn == undefined){
			thisObj.view14.show(AComponent.VISIBLE);
			
			thisObj.chkMonthReqGrp[0].show(AComponent.VISIBLE); // 신규매수일 때 보임처리
			thisObj.chkMonthReqGrp[1].show(AComponent.VISIBLE); // 신규매수일 때 보임처리
			
			thisObj.rdoManager.selectButton(thisObj.chkMonthReqGrp[0]); // 신청안함 Default						
		}else if(thisObj.viewData.monthPayYn == "2678"){
			thisObj.rdoManager.selectButton(thisObj.chkMonthReqGrp[0]); // 신청함 Check Set			
			thisObj.chkMonthReqGrp[1].isEnable = false;
			
			thisObj.chkMonthReqGrp[0].show(AComponent.VISIBLE); // 선택 된 값 보임처리
			thisObj.chkMonthReqGrp[1].show(AComponent.GONE); // 선택 안된 값 히든 처리
		}else if(thisObj.viewData.monthPayYn == "3459"){
			thisObj.rdoManager.selectButton(thisObj.chkMonthReqGrp[1]); // 신청함 Check Set			
			thisObj.chkMonthReqGrp[0].isEnable = false;
			
			thisObj.chkMonthReqGrp[0].show(AComponent.GONE); // 선택 안된 값 히든 처리
			thisObj.chkMonthReqGrp[1].show(AComponent.VISIBLE); // 선택 된 값 보임처리
			
		}
	}else{
		thisObj.view14.show(AComponent.GONE);
	}
	
	// 기본정보 세팅
	thisObj.fundBuyInfoSet();
				
};

FD3202_V07.prototype.fundBuyInfoSet = function()
{

	var thisObj = this;
	var cont = thisObj.getContainer();
	
	// 현재 저장되어 있는 계좌를 전부 제거하고 서브계좌만 저장
	thisObj.accDbx.removeAll();
	
	for(var i=0; i < thisObj.viewData.accNo.length; i++){
		thisObj.accDbx.addItem(thisObj.onAccListExpress(thisObj.viewData.accNo[i]), thisObj.viewData.accNo[i]);
	}
	
	// 선택한 계좌에 대한 서브계좌는 전부 갖고 있지만 첫번째 계좌로 세팅 후 변경못하도록 함
	thisObj.accDbx.selectItem(0);
	thisObj.accDbx.enable(false);
	thisObj.accDbx.addClass('combo_dis');
	
	thisObj.txtPw = thisObj.viewData.accPw;
	thisObj.txtOrderAmt.setText('');
	
	cont.nowTradeStateCheck(thisObj, function(){		
		if(cont.g_tradeState == 2 || cont.g_tradeState == 4){ // 펀드예약매수
			thisObj.bizNextDayCheck();
		}else if(cont.g_tradeState == 1){ // 일반펀드매수
			thisObj.getBasePriceDateBuyDate(MetaInfo.fnGetToday('NUMDATE'));
		}
	});	
};

// 매수가능금액 조회
FD3202_V07.prototype.checkOrderMoney = function(fundBuyRegDate, basePriceDate, buyPayDate)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	
	// 2018.11.14 기준가 입력전에는 SOFFQ218 서비스 조회불가로 SOFFQ218 -> SDPAQ066 변경
	// SDPAQ066 서비스 변경 시작
	if(cont.g_tradeState == 4){
		// 당일 오전(08~09시 사이) 예약주문인 경우
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

					queryData.printQueryData();
				},
				function(queryData, groupName)
				{				
					if(queryData)
					{	
						//next키 저장


						queryData.printQueryData();

						var outBlock1 = queryData.getBlockData('OutBlock1')[0];
						var outBlock2 = queryData.getBlockData('OutBlock5')[0];					

						// 데이터를 모두 조회한 후에 한번에 세팅
						thisObj.txtBasePriceDate.setText(Utils.formatDotDate(basePriceDate));
						thisObj.txtBuyDate.setText(Utils.formatDotDate(buyPayDate));

						//2018/03/14 신청일은 매수/예약매수 모두 오늘로 변경
		//				thisObj.txtReportDate.setText(fundBuyRegDate);
						thisObj.txtReportDate.setText(Utils.formatDotDate(MetaInfo.fnGetToday('NUMDATE')));

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
	}else{
		// 당일 오전(08~09시 사이) 예약주문이 아닌 경우
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

					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];

					// 데이터를 모두 조회한 후에 한번에 세팅
					thisObj.txtBasePriceDate.setText(Utils.formatDotDate(basePriceDate));
					thisObj.txtBuyDate.setText(Utils.formatDotDate(buyPayDate));

					//2018/03/14 신청일은 매수/예약매수 모두 오늘로 변경
	//				thisObj.txtReportDate.setText(fundBuyRegDate);
					thisObj.txtReportDate.setText(Utils.formatDotDate(MetaInfo.fnGetToday('NUMDATE')));

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
	}
	
};

FD3202_V07.prototype.buyFundNotMoneyPopup = function()
{
	var win = AWindow.createWindow('FD/window/FD3202_W12.lay','FD320212');
									
	win.openAsDialog(this, 584, 660);
};

FD3202_V07.prototype.getBizNtBasePriceBuyDate = function(fundByRegDate)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	cont.sendData('SOFFQ559',
		function(queryData, groupName)
		{		
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			
			InBlock1['D1투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드'];
			InBlock1['D1기준일'] = fundByRegDate;
																						
		 },
		function(queryData, groupName)
		{
		
			var errMsg = this.getLastError('errMsg');
			var errCode = this.getLastError('errCode');
				
//			AToast.show(this.getLastError('errMsg')+'('+this.getLastError('errCode')+')');
											
			if(queryData)
			{				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
				var OutBlock2 = queryData.getBlockData('OutBlock2')[0];
				
				// 매수가능금액 조회
				thisObj.checkOrderMoney(fundByRegDate, OutBlock2["D1체결일"], OutBlock2["D1결제일"]);
			}
		});
};


FD3202_V07.prototype.getBasePriceDateBuyDate = function(fundByRegDate)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	cont.sendData('SOFFQ446',
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
										
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData();
			InBlock1['D1투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드'];
			InBlock1['D1매수금액'] = '100000'; // 매수금액은 선취수수료에만 영향을 주는 입력값이므로 100000 기본세팅
			InBlock1['D1신청일'] = fundByRegDate;										
		 },
		//afterOutBlockData
		function(queryData, groupName)
		{
		
			var errMsg = this.getLastError('errMsg');
			var errCode = this.getLastError('errCode');
				
//			AToast.show(this.getLastError('errMsg')+'('+this.getLastError('errCode')+')');
											
			if(queryData)
			{				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];				
																				
				// 매수가능금액 조회
				thisObj.checkOrderMoney(fundByRegDate, OutBlock1['D1기준가적용일'], OutBlock1['D1매수결제일'] );
								
			}
		});
	
};


FD3202_V07.prototype.onbtnFundBuyClick = function(comp, info)
{
	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	if(!thisObj.txtOrderAmt.getText()){
		AToast.show("매수금액을 입력하세요");
		thisObj.txtOrderAmt.addClass('active');
		
		return;
	}
		
	cont.nowTradeStateCheck(thisObj, function(){	
		if(cont.g_tradeState == 1){ // 펀드일반매수
			thisObj.onbtnFundBuy();
		}else if(cont.g_tradeState == 2 || cont.g_tradeState == 4){ // 펀드예약매수
			thisObj.onbtnFundNextDayBuy();
		}
	});
};


FD3202_V07.prototype.onbtnFundBuy = function()
{
	var thisObj = this
		,cont = thisObj.getContainer() // 연결된 최상위 뷰
		,qrName = "SOFFT133"
		,cipherData = thisObj.txtPw; // 전 페이지에서 이미 getCipherData()를 사용해서 넘오옴
		
	var orderAmtGubun = 0;
	
	// SOFFT133 주문금액구분 값 구하기
	if(thisObj.txtOrderAmt.getText() == thisObj.txtOrderAbleAmt.getText()){		
		orderAmtGubun = 1;
	}else{
		orderAmtGubun = 0;	
	}
		
	if(thisObj.accDbx.getEditText().length == 0){
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
		accNo : thisObj.accDbx.getSelectedItemData()
	};		
		
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){				
		cont.sendData(qrName, 
			function(queryData, groupName)
			{												
				// 수정하기 위해 펑션키 수정
				queryData.setHeaderInfo(
					{FUNC_KEY_LST: '5'}
				);

				var InBlock1 = queryData.getBlockData('InBlock1')[0];

				InBlock1['D1계좌번호'] = checkObj.accNo;
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;
				InBlock1['D1투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드'];
				InBlock1['D1주문금액구분'] = orderAmtGubun;	// 0:일부금액, 1:전액
				InBlock1['D1매수주문금액'] = thisObj.txtOrderAmt.getText();
				InBlock1['D1투자설명여부'] = '1';
				InBlock1['D1펀드매매처리구분'] = '';
				InBlock1['D1출납번호'] = '';
				InBlock1['D1상대계좌번호'] = '';
				InBlock1['D1권유구분'] = '';
				
				queryData.putPwInfo('InBlock1','D1비밀번호');
				
			},
			function(queryData, groupName)
			{				
				var errMsg = this.getLastError('errMsg');
				var errCode = this.getLastError('errCode');

				if(queryData)
				{
					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
					if(OutBlock1){						
						cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V09', {finishGubun:'1'});
					}
				}
				// 투신펀드 서브계좌이므로 투신펀드로 변경 
			}//, checkObj.accNo.substring(0,11) // 2018.07.27 펀드매수 시 SMS 절차 생략
		);
	});
};


///////////////// 펀드예약주문 부분은 밑부분

//당일일자정보조회
FD3202_V07.prototype. bizNextDayCheck = function()
{
	var thisObj = this;	
	var cont = thisObj.getContainer();
		
	cont.sendData('SCMAQ048',
	    function(queryData, groupName){
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			
			queryData.setHeaderInfo({
				FUNC_KEY_LST:  'C' 
			});			
						
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
						
		},
		function(queryData, groupName) {
			
			if(!queryData) return;
						
			var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
			if(!OutBlock1) return;						
			
			
			// 영업익일은 출납일 기준이 아닌 주문일기준이 맞지 않는가?
			// 매수 기준가적용일과 매수일은 SOFFQ446이 맞을 것으로 보임
			if(cont.g_tradeState == 2){ // 17시 이후 예약매수
				thisObj.rsvDt = OutBlock1['D1주문일기준주문익일'];
				thisObj.getBasePriceDateBuyDate(OutBlock1['D1주문일기준주문익일']);
			}else if(cont.g_tradeState == 4){ // 오전8~오전9 사이 예약매수
				thisObj.rsvDt = MetaInfo.fnGetToday('NUMDATE'); // 예약일을 당일로 변경
				// 오전8~9시 사이 예약매수는 당일 주문되므로 펀드매매정보조회는 당일기준으로 조회
				thisObj.getBasePriceDateBuyDate(MetaInfo.fnGetToday('NUMDATE'));
			}
		}
	);
};

//펀드예약매수
FD3202_V07.prototype. onbtnFundNextDayBuy = function()
{
	var thisObj = this
		,cont = thisObj.getContainer() // 연결된 최상위 뷰
		,qrName = "SOFFT223"
		,cipherData = thisObj.txtPw; // 전 페이지에서 이미 getCipherData()를 사용해서 넘오옴
							
	if(thisObj.accDbx.getEditText().length == 0){
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
		accNo : thisObj.accDbx.getSelectedItemData()
	};	
	

	theApp.accNetManager.addSkipErrorCode('SOFFT223', '3735');

	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){				
		cont.sendData(qrName, 	
			function(queryData, groupName){
				queryData.setHeaderInfo({
					FUNC_KEY_LST:  '5' 
				});
				
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
															
				InBlock1['D1예약구분'] = '2';
				InBlock1['D1계좌번호'] = checkObj.accNo;
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;;
				InBlock1['D1투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드'];
				InBlock1['D1매수금액'] = thisObj.txtOrderAmt.getText();
				InBlock1['D1예약일'] = thisObj.rsvDt;
				InBlock1['D1납입방법코드'] = ''; //01:임의식,02: 거치식,03:정액적립 04: 자유적립
				InBlock1['D1계약기간'] = '0';
				InBlock1['D1계약금액'] = '0';
				InBlock1['D1전화지역번호'] = '0'; // 길이체크문제로 넣음
				InBlock1['D1전화국번호'] = '0'; // 길이체크문제로 넣음
				InBlock1['D1전화일련번호'] = '0'; // 길이체크문제로 넣음
				InBlock1['D1월납입일'] = '';
				
				queryData.putPwInfo('InBlock1', 'D1비밀번호');						

			},
			function(queryData, groupName) {			
				
				var errMsg = this.getLastError('errMsg');
				var errCode = this.getLastError('errCode');
				

				theApp.accNetManager.removeSkipErrorCode('SOFFT223', '3735');
				if (errCode == '3735') {
					var msg = ['동일한 예약주문건이 있습니다.'
							  ,'<br>','추가매수를 원하시는 경우,'
							  ,'<br>','[오늘의 주문내역]-시간외주문에서 해당 내역을 취소하신 후에 매수금액을 변경하여 신청해주시기 바랍니다.'
							  ,'<br>'].join('');
					theApp.alert(msg, null, '메시지');
					return;
				}

				
				if(queryData){
					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
					if(!OutBlock1) return;

					if(OutBlock1){
						cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V09', {finishGubun:'1'});
					}
				}
				// 투신펀드 서브계좌이므로 투신펀드로 변경 
			}//, checkObj.accNo.substring(0,11) // 2018.07.27 펀드매수 시 SMS 절차 생략
		);
	});
};


FD3202_V07.prototype.ontxtOrderAmtBlur = function(comp, info)
{

	//TODO:edit here
	this.txtOrderAmt.removeClass('active');
};

FD3202_V07.prototype.onAccListExpress = function(accInfoData)
{
	var accExpress = accInfoData;	
	var reAccExpress;
	
	reAccExpress = accExpress.substring(0,3) + "-" + accExpress.substring(3,5) + "-" + accExpress.substring(5,11) + "-" +  accExpress.substring(11,accExpress.length);
	
	return reAccExpress;	
};



FD3202_V07.prototype.onchkYRequestClick = function(comp, info)
{

	//TODO:edit here
	
	
};

FD3202_V07.prototype.onchkRequestClick = function(comp, info)
{

	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	var RadioSelBtn = comp.getComponentId();
	
	thisObj.rdoManager.selectButton(comp);
	
	if(RadioSelBtn == 'chkYRequest'){		
			var win = AWindow.createWindow('FD/window/FD3202_W10.lay','FD320210');
			
			win.subAccNo = thisObj.accDbx.getSelectedItemData(); //서브계좌번호
			win.txtAccPw = thisObj.txtPw; // 계좌비밀번호
			win.fundCode = cont.selectFundInfo['D1투신펀드코드']; // 투신펀드코드
						
			win.openAsDialog(this, '100%', '100%');
	}		
};

FD3202_V07.prototype.onWindowResult = function(result, windowObj)
{
	var thisObj = this;
	
	if(windowObj.containerId == 'FD320210'){
		if(result == 1){			
			thisObj.rdoManager.selectButton(thisObj.chkMonthReqGrp[1]); // 신청함 Check Set			
			thisObj.chkMonthReqGrp[0].isEnable = false;		
			
		}else{
			thisObj.rdoManager.selectButton(thisObj.chkMonthReqGrp[0]); // 신청안함 Check Set
		}		
	}
}
