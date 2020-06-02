
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_V06()
{
	AView.call(this);
}
afc.extendsClass(FD5003_V06, AView);


FD5003_V06.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// Object
	this.cont = this.getContainer();
	this.contTab = this.cont.tvManager.getActiveView();
	
	// 스크롤 관련 영역
	this.view3 = this.findCompById('View3');
	
	// 계좌
	this.accView = this.findCompById('AccView').loadView;
	this.txtPw = null;
	
	// 펀드매수정보입력
	this.lblStep = this.findCompById('lblStep'); // 단계
	this.lblFundName = this.findCompById('lblFundName'); // 펀드명
	this.lblFundName2 = this.findCompById('lblFundName2'); // 클래스상세 전체명 추가 2019.09.24
	
	// 매수정보
	this.txtOrderAbleAmt 	= this.findCompById('txtOrderAbleAmt'); 	// 매수가능금액
	this.txtOrderAmt 		= this.findCompById('txtOrderAmt'); 		// 매수금액
	this.txtReportDate 		= this.findCompById('txtReportDate'); 		// 신청일
	this.txtBasePriceDate 	= this.findCompById('txtBasePriceDate'); 	// 기준가적용일
	this.txtBuyDate 		= this.findCompById('txtBuyDate'); 			// 매수일
	
	this.lblFundName.setShrinkInfo({maxChar:20, fontSize:24}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.lblFundName2.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V06.prototype.onWillActive = function(reload)
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
FD5003_V06.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	this.txtPw = this.viewData.accPw;
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V06.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.view3.scrollTo(0);
};


// 계좌 초기화
FD5003_V06.prototype.initAccView = function()
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
FD5003_V06.prototype.onInitComponents = function()
{
	// 예약주문일 초기화
	this.rsvDt = '';
	
	// 매수정보 초기화
	this.txtOrderAbleAmt.setText(""); 	// 매수가능금액
	this.txtOrderAmt.setText("");		// 매수금액
	this.txtReportDate.setText("");		// 신청일
	this.txtBasePriceDate.setText("");	// 기준가적용일
	this.txtBuyDate.setText("");		// 매수일
};


// 서브 계좌 표기
FD5003_V06.prototype.expressAccList = function(accInfo)
{
	var returnAcc = accInfo.substring(0,3) + "-" + accInfo.substring(3,5) + "-" 
					+ accInfo.substring(5,11) + "-" + accInfo.substring(11, accInfo.length);
	
	return returnAcc;	
};


// 매수단계 및 펀드명 셋팅
FD5003_V06.prototype.setFundStepInfo = function()
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


// 매매가능상태 조회
FD5003_V06.prototype.checkTradeState = function()
{
	this.contTab.checkTradeState(this, this.contTab);
};


// checkTradeState 콜백함수
FD5003_V06.prototype.callbackCheckTradeState = function(param)
{
	var returnParam = param['처리구분코드'];
	var trdSt = param['매매가능상태']; // 1: 일반펀드매수매도, 2: 예약펀드매수매도, 3: 펀드매수매도불가, 4:당일예약펀드매수매도
	
	if(returnParam == 'BUY') // 펀드매수버튼 클릭 시
	{
		// 펀드매수
		this.buyFund(param);
	}
	else
	{
		if(trdSt == 2) // 펀드예약매수
		{
			// 서비스 조회 (당일일자정보조회)
			this.sendSCMAQ048(param);
		}
		else if(trdSt == 1) // 일반펀드매수
		{
			// 서비스 조회 (펀드매매정보조회)
			this.sendSOFFQ446( MetaInfo.fnGetToday('NUMDATE'), param );
		}
		else if(trdSt == 4) // 당일예약펀드매수매도
		{
			this.rsvDt = MetaInfo.fnGetToday('NUMDATE'); // 예약일을 당일로 변경
			this.sendSCMAQ048(param);
		}

	}
};


// 서비스 조회 (당일일자정보조회)
FD5003_V06.prototype.sendSCMAQ048 = function(param)
{
	var trdSt = param['매매가능상태']; // 1: 일반펀드매수매도, 2: 예약펀드매수매도, 3: 펀드매수매도불가, 4:당일예약펀드매수매도
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
				
				// 영업익일은 출납일 기준이 아닌 주문일기준이 맞지 않는가?
				// 매수 기준가적용일과 매수일은 SOFFQ446이 맞을 것으로 보임
				if (4 == trdSt) {
					thisObj.rsvDt = MetaInfo.fnGetToday('NUMDATE'); // 예약일을 당일로 변경;
				} else {
					thisObj.rsvDt = OutBlock1['D1주문일기준주문익일'];
				}
				thisObj.sendSOFFQ446( thisObj.rsvDt, param );
			}
		}
	);
};


// 서비스 조회 (펀드매매정보조회)
FD5003_V06.prototype.sendSOFFQ446 = function(fundRegDt, param)
{
	var thisObj = this;
	var cont = this.getContainer();
	
	// 조회
	cont.sendData('SOFFQ446',
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];				
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData();
			InBlock1['D1투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드'];
			InBlock1['D1매수금액'] = '100000'; // 선취수수료에만 영향을 주는 값이므로 100000 기본세팅
			InBlock1['D1신청일'] = fundRegDt;
			
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
				
				// 서비스 조회 (매수가능금액조회)
				var basePrcDt = OutBlock1['D1기준가적용일'];
				var buyPayDt  = OutBlock1['D1매수결제일'];
				thisObj.sendSOFFQ218(fundRegDt, basePrcDt, buyPayDt, param);		
			}
		}
	);
};



// 서비스 조회 (매수가능금액조회)
FD5003_V06.prototype.sendSOFFQ218 = function(fundRegDt, basePrcDt, buyPayDt, param)
{
	var trdSt = param['매매가능상태']; // 1: 일반펀드매수매도, 2: 예약펀드매수매도, 3: 펀드매수매도불가, 4:당일예약펀드매수매도
	var thisObj = this;
	var cont = this.getContainer();
	
	// 당일예약매수매도 (영업일 오전07시~09시 당일예약매수 건)
	if (4 == trdSt) {
	
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

						if(afc.isSimulator) queryData.printQueryData();

						var outBlock1 = queryData.getBlockData('OutBlock1')[0];
						var outBlock2 = queryData.getBlockData('OutBlock5')[0];					

						thisObj.txtReportDate.setText(Utils.formatDotDate(MetaInfo.fnGetToday('NUMDATE')));		// 신청일
						thisObj.txtBasePriceDate.setText(Utils.formatDotDate(basePrcDt)); 	// 기준가적용일
						thisObj.txtBuyDate.setText(Utils.formatDotDate(buyPayDt));		// 매수일

						thisObj.txtOrderAbleAmt.setText(outBlock2["D1인출가능금액"]);

						if( outBlock2["D1인출가능금액"] == 0){										

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
				}

			);
		});
	
	
	} else {
	
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
					return;
				}
				else // 성공
				{
					if(afc.isSimulator) queryData.printQueryData();

					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];

					if(!OutBlock1) return;

					// 매수정보 셋팅
					var odrAbleAmt 	= OutBlock1["D1주문가능금액"];
					var repDt 		= Utils.formatDotDate(MetaInfo.fnGetToday('NUMDATE'));
					var baseDt		= Utils.formatDotDate(basePrcDt);
					var buyDt 		= Utils.formatDotDate(buyPayDt);

					thisObj.txtOrderAbleAmt.setText(odrAbleAmt);	// 매수가능금액
					thisObj.txtReportDate.setText(repDt); 			// 신청일
					thisObj.txtBasePriceDate.setText(baseDt); 		// 기준가적용일
					thisObj.txtBuyDate.setText(buyDt);				// 매수일


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
			}
		);
	
	} // end else
	
};


// 가상계좌정보 팝업
FD5003_V06.prototype.virtualAccInfoPopup = function()
{
	// 팝업
	var win = AWindow.createWindow('FD/window/FD3202_W12.lay', 'FD3202W12');						
	win.openAsDialog(this, 584, 660);
};


// 텍스트 필드의 Blur 이벤트
FD5003_V06.prototype.onTextFieldBlur = function(comp, info)
{
	// active 클래스 제거
	comp.removeClass('active');
};


// 텍스트 필드의 Focus 이벤트
FD5003_V06.prototype.onTextFieldFocus = function(comp, info)
{
	var textFields = [this.txtOrderAmt];
	
	for(var i=0; i<textFields.length; i++)
	{
		textFields[i].removeClass('active');
	}
	
	// active 클래스 추가
	comp.addClass('active');
};


// 펀드매수 버튼 클릭
FD5003_V06.prototype.onbtnFundBuyClick = function(comp, info)
{
	// 입력값 체크
	if(!this.txtOrderAmt.getText())
	{
		AToast.show("매수금액을 입력하세요");
		this.txtOrderAmt.addClass('active');
		return;
	}
	
	// 매매가능상태 조회
	this.contTab.checkTradeState(this, this.contTab, 'BUY');
};


// 펀드매수
FD5003_V06.prototype.buyFund = function(param)
{
	var trdSt = param['매매가능상태']; // 1: 일반펀드매수매도, 2: 예약펀드매수매도, 3: 펀드매수매도불가, 4:당일예약펀드매수매도
	
	if(trdSt == 2) // 펀드예약매수
	{
		// 서비스 조회 (펀드예약매수)
		this.sendSOFFT223();
	}
	else if(trdSt == 1) // 일반펀드매수
	{
		// 서비스 조회 (펀드일반매수)
		this.sendSOFFT133();
	}
	else if(trdSt == 4) // 당일예약펀드매수매도
	{
		this.rsvDt = MetaInfo.fnGetToday('NUMDATE'); // 예약일을 당일로 변경
		this.sendSOFFT223();
	}
};


// 서비스 조회 (펀드예약매수)
FD5003_V06.prototype.sendSOFFT223 = function()
{
	var thisObj = this;
	var cont = this.getContainer();
	
	var cipherData = this.fundAccPw;
	
	// 계좌번호가 없으면
	if(thisObj.accDbx.getEditText().length == 0)
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
		svcId : 'SOFFT223',
		accNo : thisObj.accDbx.getSelectedItemData()
	};
	

	theApp.accNetManager.addSkipErrorCode('SOFFT223', '3735');

	
	// 조회
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){				
		cont.sendData('SOFFT223', 	
			function(queryData, groupName)
			{
				queryData.setHeaderInfo({
					FUNC_KEY_LST:  '5' 
				});
				
				var InBlock1 = queryData.getBlockData('InBlock1')[0];			
				InBlock1['D1예약구분'] = '2';
				InBlock1['D1계좌번호'] = checkObj.accNo;
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;
				InBlock1['D1투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드'];
				InBlock1['D1매수금액'] = thisObj.txtOrderAmt.getText();
				InBlock1['D1예약일'] = thisObj.rsvDt;
				InBlock1['D1납입방법코드'] = ''; // 01: 임의식, 02: 거치식, 03: 정액적립 04: 자유적립
				InBlock1['D1계약기간'] = '0';
				InBlock1['D1계약금액'] = '0';
				InBlock1['D1전화지역번호'] = '0'; // 길이체크문제로 넣음
				InBlock1['D1전화국번호'] = '0'; // 길이체크문제로 넣음
				InBlock1['D1전화일련번호'] = '0'; // 길이체크문제로 넣음
				InBlock1['D1월납입일'] = '';
				
				queryData.putPwInfo('InBlock1', 'D1비밀번호');
				
				if(afc.isSimulator) queryData.printQueryData();
			},
			function(queryData, groupName)
			{

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

				
				if(!queryData)
				{
					return;
				}
				else // 성공
				{
					if(afc.isSimulator) queryData.printQueryData();
					
					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
					
					if(!OutBlock1) return;

					// 페이지 이동
					var param = {
						'accNo': checkObj.accNo,
						'accPw': afc.isSimulator ? '0423' : cipherData,
						'accNm': thisObj.fundAccNm,
						'orgAccNo': thisObj.fundOrgAccNo
					};
					thisObj.goNextStep(param);
				}
			}
		);
	});
};


// 서비스 조회 (펀드일반매수)
FD5003_V06.prototype.sendSOFFT133 = function()
{
	var thisObj = this;
	var cont = this.getContainer();
	
	var cipherData = this.fundAccPw;
	
	// 주문금액구분 (0: 일부금액, 1: 전액)
	var odrAmtTyp = 0;
	var odrAbleAmt = thisObj.txtOrderAbleAmt.getText(); // 매수가능금액
	var odrAmt = thisObj.txtOrderAmt.getText(); 		// 매수금액
	
	if(odrAmt == odrAbleAmt) odrAmtTyp = 1; // 전액
	else odrAmtTyp = 0; // 일부금액
	
	// 계좌번호가 없으면
	if(thisObj.accDbx.getEditText().length == 0)
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
		svcId : 'SOFFT133',
		accNo : thisObj.accDbx.getSelectedItemData()
	};		
	
	// 조회
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){				
		cont.sendData('SOFFT133', 
			function(queryData, groupName)
			{												
				queryData.setHeaderInfo({
					FUNC_KEY_LST: '5'
				});

				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				InBlock1['D1계좌번호'] = checkObj.accNo;
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;
				InBlock1['D1투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드'];
				InBlock1['D1주문금액구분'] = odrAmtTyp;
				InBlock1['D1매수주문금액'] = thisObj.txtOrderAmt.getText();
				InBlock1['D1투자설명여부'] = '1';
				InBlock1['D1펀드매매처리구분'] = '';
				InBlock1['D1출납번호'] = '';
				InBlock1['D1상대계좌번호'] = '';
				InBlock1['D1권유구분'] = '';
				
				queryData.putPwInfo('InBlock1', 'D1비밀번호');
				
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
					
					// 페이지 이동
					var param = {
						'accNo': checkObj.accNo,
						'accPw': afc.isSimulator ? '0423' : cipherData,
						'accNm': thisObj.fundAccNm,
						'orgAccNo': thisObj.fundOrgAccNo
					};
					thisObj.goNextStep(param);
				}
			}
		);
	});
};


// 다음단계로 페이지 이동
FD5003_V06.prototype.goNextStep = function(param)
{
	// 펀드매수 완료 페이지로 이동
	this.contTab.tbvManager.changeTab('FD5003_V07', param);
}


