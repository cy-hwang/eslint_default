
/**
Constructor
Do not call Function in Constructor.
*/
function FD5004_W01(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5004_W01.lay';

	//TODO:edit here

}
afc.extendsClass(FD5004_W01, BaseWindow);


FD5004_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	
	//TODO:edit here

};


FD5004_W01.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	

	
	this.txtFundName = this.findCompById('txtFundName');                   //매도 펀드 
	this.txtFundPrdtDtlNm = this.findCompById('txtFundPrdtDtlNm');         //가입유형
	this.txtFundPayMthdNm = this.findCompById('txtFundPayMthdNm');	       //납입방법
	this.txtFundBalQty = this.findCompById('txtFundBalQty');		       //잔고좌수 
	this.txtFundMnyoutAbleAmt = this.findCompById('txtFundMnyoutAbleAmt'); //세전평가금액
	this.txtFundRpCmsnAmt = this.findCompById('txtFundRpCmsnAmt');		   //환매수수료
	
	
	this.txtFundSellMoeny = this.findCompById('txtFundSellMoeny');         //매도신청금액    
	this.txtFundSellQty = this.findCompById('txtFundSellQty');			   //매도신청좌수

	this.txtFundMgnqty = this.findCompById('txtFundMgnqty');               //매도가능좌수
	this.txtFundSellReqDate = this.findCompById('txtFundSellReqDate');     //매도신청일
	this.txtBasePriceDate = this.findCompById('txtBasePriceDate');         //기준가적용일
	this.txtPayDate = this.findCompById('txtPayDate');					   //지급예정일
	
	this.fundName = this.fundInfo["D1펀드명"];
	this.fundPrdtDtlNm = this.fundInfo["D1상품상세명"];
	this.fundPayMthdNm = this.fundInfo["D1납입방법명"];
	this.fundBalQty =this.fundInfo["D1펀드잔고수량"];
	
	// 2019.02.21 D1출금가능금액 -> D1평가금액
	this.fundMnyoutAbleAmt = this.fundInfo["D1평가금액"];
	this.fundRpCmsnAmt = this.fundInfo["D1환매수수료"];
	this.fundCd = this.fundInfo['D1투신펀드코드'];

	this.fundNum = this.fundInfo["D1계좌일련번호"];
	this.acc = this.lAcc; //연금 펀드 계좌번호 
	this.pw = this.lPw; //비밀번호 
	this.standard = this.fundInfo["D1기준가"];
	
	
	
	this.setBaseFundInfo();
};

FD5004_W01.prototype.oncloseBtnClick = function(comp, info)
{
	//TODO:edit here	
	this.close(0);

};

FD5004_W01.prototype.setBaseFundInfo = function(comp, info)
{
	//TODO:edit here
			
	var thisObj = this;
	var cont = thisObj.opener.getContainer();
	
	//2019.05.27 메리츠 요청사항 뮤추얼 펀드 시 매도금액클릭 불가
	if(this.fundGubun == '2')	//'1' 수익증권 '2' 무추얼펀드
		this.txtFundSellMoeny.enable(false);
	else
		this.txtFundSellMoeny.enable(true);

	this.txtFundName.setText(this.fundName);
	this.txtFundPrdtDtlNm.setText(this.fundPrdtDtlNm);
	this.txtFundPayMthdNm.setText(this.fundPayMthdNm);
	this.txtFundBalQty.setText( afc.intComma(this.fundBalQty));
	this.txtFundMnyoutAbleAmt.setText(this.fundMnyoutAbleAmt);
	this.txtFundRpCmsnAmt.setText(this.fundRpCmsnAmt);
		
	cont.nowTradeStateCheck(thisObj, function(){				
		if(cont.g_tradeState == 1){ // 일반펀드매도 정보로 Set		
			thisObj.setBaseBottomInfo();			
		}else if(cont.g_tradeState == 2){ // 펀드예약매도 정보로 Set
			thisObj.setBaseBottomBizNextInfo();
		}
	});
};

// 일반펀드매도 정보로 Set	
FD5004_W01.prototype.setBaseBottomInfo = function()
{
	var thisObj = this;
	var cont = thisObj.opener.getContainer();
	
	var accNo = thisObj.acc;
	var subAccNo = accNo + thisObj.fundNum;
	
	this.sendData('SOFFQ218',
		function(queryData, groupName)
		{
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
										
			InBlock1['D1처리구분'] = "1"; // 1:매도, 2:매수
			InBlock1['D1계좌번호'] = accNo;
			InBlock1['D1투신펀드코드'] = thisObj.fundCd;
			InBlock1['D1매수주문금액'] = "";
			InBlock1['D1매도계좌번호'] = subAccNo;
			InBlock1['D1매도투신펀드코드'] = thisObj.fundCd;
																						
		 },
		//afterOutBlockData
		function(queryData, groupName)
		{
		
			var errMsg = this.getLastError('errMsg');
			var errCode = this.getLastError('errCode');
																		
			if(queryData)
			{
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
				
				thisObj.txtFundMgnqty.setText(thisObj.fundBalQty - OutBlock1["D1펀드증거수량"]);
				
				thisObj.txtFundSellReqDate.setText(Utils.formatDotDate(OutBlock1["D1신청일"]));
				thisObj.txtBasePriceDate.setText(Utils.formatDotDate(OutBlock1["D1기준가적용일"]));
				thisObj.txtPayDate.setText(Utils.formatDotDate(OutBlock1["D1결제일"]));
				
				thisObj.sellCmsTp = OutBlock1["D1CMS처리구분"];
				
				queryData.printQueryData();
			}
		});
};

// 예약매도 정보 세팅
FD5004_W01.prototype.setBaseBottomBizNextInfo = function()
{
	var thisObj = this;
	var cont = thisObj.opener.getContainer();
	
	var accNo = thisObj.acc;
	var subAccNo = accNo + thisObj.fundNum;
	
	this.sendData('SOFFQ218',
		function(queryData, groupName)
		{		
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			
			InBlock1['D1처리구분'] = "1"; // 1:매도, 2:매수
			InBlock1['D1계좌번호'] = accNo;
			InBlock1['D1투신펀드코드'] = thisObj.fundInfo['D1투신펀드코드'];
			InBlock1['D1매수주문금액'] = "";
			InBlock1['D1매도계좌번호'] = subAccNo;
			InBlock1['D1매도투신펀드코드'] = thisObj.fundInfo['D1투신펀드코드'];
																						
		 },
		function(queryData, groupName)
		{
		
			var errMsg = this.getLastError('errMsg');
			var errCode = this.getLastError('errCode');							
											
			if(queryData)
			{
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];								
				
				cont.bizNextDayCheck(thisObj, function(oBlock){

					thisObj.onBizNextDayCheck(OutBlock1, oBlock);
				});
				
			}
		});
};

FD5004_W01.prototype.onBizNextDayCheck = function(data1, data2)
{
	var thisObj = this;
	var cont = thisObj.opener.getContainer();
	
	this.sendData('SOFFQ559',
		function(queryData, groupName)
		{		
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
										
			InBlock1['D1투신펀드코드'] = thisObj.fundInfo['D1투신펀드코드'];
			InBlock1['D1기준일'] = data2["D1주문일기준주문익일"];
																						
		 },
		function(queryData, groupName)
		{
		
			var errMsg = this.getLastError('errMsg');
			var errCode = this.getLastError('errCode');
																		
			if(queryData)
			{				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
				var OutBlock2 = queryData.getBlockData('OutBlock2')[0];
				
				thisObj.txtFundMgnqty.setText(thisObj.fundBalQty  - data1["D1펀드증거수량"]);
				thisObj.sellCmsTp = data1["D1CMS처리구분"]; //2: 자동이체 
//				thisObj.txtFundSellReqDate.setText(data2["D1출납일기준영업일"]); // 신청일 입력
				thisObj.txtFundSellReqDate.setText(Utils.formatDotDate(MetaInfo.fnGetToday('NUMDATE'))); // 신청일(당일) 입력
								
				thisObj.strBizNextDay = data2["D1주문일기준주문익일"];
				
				thisObj.txtBasePriceDate.setText(Utils.formatDotDate(OutBlock2["D1체결일"])); // 기준가적용일
				thisObj.txtPayDate.setText(Utils.formatDotDate(OutBlock2["D1결제일"])); // 지급예정일
			}
		});
};

//매도 버튼 클릭
FD5004_W01.prototype.onbtnFundSellClick = function(comp, info)
{
	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.opener.getContainer();
	
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
					
				}
				,''
			);
		}else if(cont.g_tradeState == 1 || cont.g_tradeState == 2){ // 일반펀드매수 또는 예약펀드매수 가능
			if(thisObj.txtFundSellMoeny.getText().length == 0 && thisObj.txtFundSellQty.getText() == 0){
				AToast.show("매도신청금액 또는 매도신청좌수를 입력해주세요");
				thisObj.txtFundSellQty.addClass('active');
				return;
			}

			if(thisObj.sellTypeTp == 1){
				theApp.confirm('금액매도시의 경우 결제전까지<br/>추가매도가 불가하오니 추가매도를<br/>원하시는 경우에는 좌수로<br/>매도해주시기 바랍니다.', function(result) {
					if(result == 1){							
						thisObj.fundSellMoneySubmit();
					}else {					

					}
				}, '', ['확인','취소']
							  )
			}else{							
				// 매도가능좌수와 매도신청좌수가 같으면 전액으로 본다.

				if( thisObj.txtFundMgnqty.getText() == thisObj.txtFundSellQty.getText() ){
					thisObj.sellTypeTp = "3";
					//thisObj.sellReqAmt = '';
				}

				if((thisObj.sellCmsTp == 1 || thisObj.sellCmsTp == 7) && (thisObj.sellTypeTp == 3)){

					if(thisObj.sellCmsTp == 1) //월 적립식 CMS 약정 체크
					{
						// 자동이체 등록이 되어 있다는 팝업
						// 확인버튼을 누르면 조회-적립식 매수현황화면으로 이동함
						theApp.alert(
										[	 
											'월적립식 계좌의 전액 환매는 ', '<br/>',
											'자동이체 해지 후에 가능합니다.'
											,' '
										].join('')
										,
										function(result)
										{
											if (result){
												thisObj.close(0);
												theApp.goPageCheck('FD5008', false, {tabId:'FD5008_T02'});
											}
										}
										,''
									);
					}
					else if(thisObj.sellCmsTp == 7) //일 적립식 자동대체 약정 체크
					{
						// 자동이체 등록이 되어 있다는 팝업
						// 확인버튼을 누르면 조회-적립식 매수현황화면으로 이동함
						theApp.alert(
										[	 
											'일적립식 계좌의 전액 환매는 ', '<br/>',
											'자동이체 해지 후에 가능합니다.'
											,' '
										].join('')
										,
										function(result)
										{
											if (result){
												thisObj.close(0);
												theApp.goPageCheck('FD5008', false, {tabId:'FD5008_T02'});
											}
										}
										,''
									);
					}

				}else{
					cont.nowTradeStateCheck(thisObj, function(){
						if(cont.g_tradeState == 2){ // 펀드예약매도
							thisObj.fundNextSellSendData();
						}else if(cont.g_tradeState == 1){ // 일반펀드매도
							thisObj.fundSellSendData();
						}
					});
				}
			}
		}
	});		
};

//팝업 후 팔기 
FD5004_W01.prototype.fundSellMoneySubmit = function()
{
	var thisObj = this;
	var cont = thisObj.opener.getContainer();
		
	//펀드매도 가능시간이 아닐 때 팝업 이후 처리
	// 매도가능좌수와 매도신청좌수가 같으면 전액으로 본다.
	
	
	if( thisObj.txtFundMgnqty.getText() == thisObj.txtFundSellQty.getText() ){
		thisObj.sellTypeTp = "3";
		//thisObj.sellReqAmt = '';
	}

	if((thisObj.sellCmsTp == 1 || thisObj.sellCmsTp == 7) && (thisObj.sellTypeTp == 3)){
	
		if(thisObj.sellCmsTp == 1) //월 적립식 CMS 약정 체크
		{
			// 자동이체 등록이 되어 있다는 팝업
			// 확인버튼을 누르면 조회-적립식 매수현황화면으로 이동함
			theApp.alert(
							[	 
								'월적립식 계좌의 전액 환매는 ', '<br/>',
								'자동이체 해지 후에 가능합니다.'
								,' '
							].join('')
							,
							function(result)
							{
								if (result){
									thisObj.close(0);
									theApp.goPageCheck('FD5008', false, {tabId:'FD5008_T02'});
								}
							}
							,''
						);
		}
		else if(thisObj.sellCmsTp == 7) //일 적립식 자동대체 약정 체크
		{
			// 자동이체 등록이 되어 있다는 팝업
			// 확인버튼을 누르면 조회-적립식 매수현황화면으로 이동함
			theApp.alert(
							[	 
								'일적립식 계좌의 전액 환매는 ', '<br/>',
								'자동이체 해지 후에 가능합니다.'
								,' '
							].join('')
							,
							function(result)
							{
								if (result){
									thisObj.close(0);
									theApp.goPageCheck('FD5008', false, {tabId:'FD5008_T02'});
								}
							}
							,''
						);
		}

	}else{
		cont.nowTradeStateCheck(thisObj, function(){
			if(cont.g_tradeState == 2){ // 펀드예약매도
				thisObj.fundNextSellSendData();
			}else if(cont.g_tradeState == 1){ // 일반펀드매도
				thisObj.fundSellSendData();
			}
		});
	}	
};




// 일반펀드매도
FD5004_W01.prototype.fundSellSendData = function()
{

	var thisObj = this
		,cont = thisObj.opener.getContainer() // 연결된 최상위 뷰
		,qrName = "SOFFT130"
		,cipherData = thisObj.pw; // 전 페이지에서 이미 getCipherData()를 사용해서 넘오옴
	
	var accNo = thisObj.acc;
	var subAccNo = accNo + thisObj.fundNum;
	
	var checkObj = {
		svcId : qrName,
		sAccNo : subAccNo
	};
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName,
			function(queryData, groupName){
				// 수정하기 위해 펑션키 수정
				queryData.setHeaderInfo(
					{FUNC_KEY_LST: '5'}
				);

				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				
				InBlock1["D1계좌번호"] = checkObj.sAccNo; // 
				InBlock1["D1비밀번호"] = afc.isSimulator ? '0423' : result; // 
 				InBlock1["D1환매신청유형구분"] = thisObj.sellTypeTp; // 1:일부금액매도, 2:일부좌수매도, 3:전체매도
				if(thisObj.sellTypeTp == '1'){
					InBlock1["D1매도주문금액"] = thisObj.sellReqAmtMoney; // 매도신청금액
				}else{
					InBlock1["D1매도주문금액"] = thisObj.sellReqAmtQty; // 매도신청좌수 
				}
				
				InBlock1["D1투신펀드코드"] = ""; 
				InBlock1["D1특별중도환매여부"] = "0"; 
				InBlock1["D1펀드매매처리구분"] = "0"; 
				InBlock1["D1상대계좌번호"] = ""; 
				InBlock1["D1권유구분"] = "0"; 						
				queryData.putPwInfo('InBlock1', 'D1비밀번호');
				
				queryData.printQueryData();

			},
			function(queryData, groupName) {			
				if(!queryData) return;

				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];

				if(!OutBlock1) return;
				
				queryData.printQueryData();
				
				var errMsg = this.getLastError('errMsg');
				var errCode = this.getLastError('errCode');
				
				if(errCode = '0000'){
					theApp.alert(
						[	 
							'매도신청에 성공하였습니다.'					
							,' '
						].join('')
						,
						function()
						{			
							thisObj.fundSellComplete();
						}
						,''
					);
				}
			
				
			}, checkObj.sAccNo.substring(0,11)
		);
	
	});

};

// 예약펀드매도->신청구분은 금액으로 하고 환매수량과 금액은 같게 
//금액과 수량은 둘 중 하나 바뀌는 값에 따라 바뀜 
FD5004_W01.prototype.fundNextSellSendData = function()
{

	var thisObj = this
		,cont = thisObj.opener.getContainer() // 연결된 최상위 뷰
		,qrName = "SOFFT115"
		,cipherData = thisObj.pw; // 전 페이지에서 이미 getCipherData()를 사용해서 넘오옴
	
	var accNo = thisObj.acc;
	var subAccNo = accNo + thisObj.fundNum;
	

	theApp.accNetManager.addSkipErrorCode('SOFFT115', '3735');

	
	cont.sendData(qrName,
		function(queryData, groupName){
			// 수정하기 위해 펑션키 수정
			queryData.setHeaderInfo(
				{FUNC_KEY_LST: '5'}
			);
			
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			var InBlock2 = queryData.getBlockData('InBlock2')[0];

			
			InBlock1["D1처리구분"] = '2'; //
			InBlock1["D1처리지점번호"] = ''; //
			InBlock1["D1신청일"] = Utils.yyyymmdd(thisObj.txtFundSellReqDate.getText()); // 영업일(영업일 혹은 영업익일);
			InBlock1["D1일련번호"] = '0'; //
			InBlock2["D1처리지점번호"] = ''; 
			InBlock2["D1신청일"] = ' '; // 
			InBlock2["D1일련번호"] = '0'; // 
			InBlock2["D1이용사번호"] = ''; //
			InBlock2["D1예약환매구분"] = '1'; // 
			InBlock2["D1예약주문일"] = thisObj.strBizNextDay; // 익영업일
			InBlock2["D1목표수익률"] = '0'; // 
			InBlock2["D1목표금액"] = '0'; // 
			InBlock2["D1계좌번호"] = subAccNo; // 서브계좌번호
			InBlock2["D1환매신청유형구분"] = thisObj.sellTypeTp; // 1.금액 2.좌수 3.전액
			InBlock2["D1환매수량"] = thisObj.sellReqAmtQty;
			InBlock2["D1환매금액"] = thisObj.sellReqAmtMoney;
			InBlock2["D1주문일"] = ''; //
			InBlock2["D1주문처리여부"] = ''; // 
			InBlock2["D1주문번호"] = '0'; // 
			InBlock2["D1주문처리지점번호"] = ''; // 
			InBlock2["D1취소여부"] = ''; // 
			InBlock2["D1취소시각"] = ''; // 
			InBlock2["D1취소단말번호"] = ''; // 
			InBlock2["D1취소사용자ID"] = ''; // 
			InBlock2["D1처리시각"] = ''; // 
			InBlock2["D1단말번호"] = ''; // 
			InBlock2["D1사용자ID"] = ''; // 
			
			queryData.printQueryData();

		},
		function(queryData, groupName) {			
			
			
			var errMsg = this.getLastError('errMsg');
			var errCode = this.getLastError('errCode');


			theApp.accNetManager.removeSkipErrorCode('SOFFT115', '3735');
			if (errCode == '3735') {
				var msg = ['동일한 예약주문건이 있습니다.'
						   ,'<br>','추가매도를 원하시는 경우,'
						   ,'<br>','[오늘의 주문내역]-시간외주문에서 해당 내역을 취소하신 후에 매도금액을 변경하여 신청해주시기 바랍니다.'
						   ,'<br>'].join('');
				theApp.alert(msg, null, '메시지');
				return;
			}

			
			if(!queryData) return;
			
			if(errCode = '0000'){
				theApp.alert(
						[	 
							'매도신청에 성공하였습니다.'					
							,' '
						].join('')
						,
						function()
						{			
							thisObj.fundSellComplete();
						}
						,''
					);
			}
			
			
		}, subAccNo.substring(0,11)
	);
};


//매도 성공 후 

FD5004_W01.prototype.fundSellComplete = function()
{
	
	var thisObj = this;
	var cont = thisObj.opener.getContainer();
	
	thisObj.close(1);
	cont.changeTab();
};

//금액 변경
FD5004_W01.prototype.ontxtFundSellMoenyChange = function(comp, info)
{

	//TODO:edit here
	// 금액 컴포넌트
//	this.txtFundSellMoeny = 
	
	var fundOrdMoney = this.txtFundSellMoeny.getText();
	var fundBasePrice = this.standard;
	
	var fundOrdQry = parseInt(fundOrdMoney/(fundBasePrice)*1000); // 금액 / (기준가/1000)
		
	this.txtFundSellQty.setText(fundOrdQry);
	
	//2019.05.20 업무적 오류 발생, 히스토리 없으므로 우선 삭제
	/*if(fundOrdQry == fundOrdMoney){
		this.sellTypeTp = "1";//일부금액
	}else{
		this.sellTypeTp = "2";//일부수량
	}*/
	
	this.sellTypeTp = "1";//일부금액
	
	this.sellReqAmtMoney = this.txtFundSellMoeny.getText();
	this.sellReqAmtQty = this.txtFundSellQty.getText();
	
	
	// 좌수 컴포넌트
//	this.txtFundSellQty = 
	
};

//수량 변경
FD5004_W01.prototype.ontxtFundSellQtyChange = function(comp, info)
{

	//TODO:edit here	
	var fundOrdQry = this.txtFundSellQty.getText();
	var fundBasePrice = this.standard;
	
	var fundOrdMoney = parseInt((fundOrdQry * fundBasePrice)/1000);
	
	this.txtFundSellMoeny.setText(fundOrdMoney);
	
	//2019.05.20 업무적 오류 발생, 히스토리 없으므로 우선 삭제
	/*if(fundOrdQry == fundOrdMoney){
		this.sellTypeTp = "2";//일부수량
	}else{
		this.sellTypeTp = "1";//일부금액	
	}*/
	
	this.sellTypeTp = "2";//일부수량
	
	this.sellReqAmtQty = this.txtFundSellQty.getText();
	this.sellReqAmtMoney = this.txtFundSellMoeny.getText();

};

FD5004_W01.prototype.ontxtFundSellMoenyBlur = function(comp, info)
{

	//TODO:edit here
	
	this.txtFundSellQty.removeClass('active'); // 하이라이트 제거
	
	
	
	//this.sellReqAmt = this.txtFundSellMoeny.getText();
	
/*	var fundOrdMoney = this.txtFundSellMoeny.getText();
	var fundBasePrice = this.fundInfo["D1기준가"];
	
	var fundOrdQry = parseInt(fundOrdMoney/(fundBasePrice)*1000); // 금액 / (기준가/1000)
		
	this.txtFundSellQty.setText(fundOrdQry);*/
		
};

FD5004_W01.prototype.ontxtFundSellQtyBlur = function(comp, info)
{

	//TODO:edit here
	
	this.txtFundSellQty.removeClass('active'); // 하이라이트 제거
	
	
	//this.sellReqAmt = this.txtFundSellQty.getText();
		
/*	var fundOrdQry = this.txtFundSellQty.getText();
	var fundBasePrice = this.fundInfo["D1기준가"];
	
	var fundOrdMoney = parseInt((fundOrdQry * fundBasePrice)/1000);
		
	this.txtFundSellMoeny.setText(fundOrdMoney);*/
	
};

FD5004_W01.prototype.ontxtFundSellMoenyFocus = function(comp, info)
{
	this.txtFundSellQty.removeClass('active'); // 하이라이트 제거
	this.txtFundSellQty.setText("");
};

FD5004_W01.prototype.ontxtFundSellQtyFocus = function(comp, info)
{

	//TODO:edit here
	
	
	this.txtFundSellMoeny.setText("");
	
};

//2019.05.27 메리츠 요청사항 뮤추얼 펀드 시 매도금액클릭 불가
FD5004_W01.prototype.onView23ActionUp = function(comp, info)
{
	if(this.fundGubun == '2')	//무추얼펀드
	{
		theApp.alert(
			[	 
				'뮤추얼펀드의 경우 ', '<br/>',
				'매도신청좌수로 매도신청해주시기 바랍니다', '<br/>',
				' '
			].join('')
			,
			function()
			{

			}
			,''
		);
	}
};
