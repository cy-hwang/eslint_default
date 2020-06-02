
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_V08()
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
	this.virtAcc = null;//가상연결계좌번호
	this.moAccNo = null;//모계좌번호
}
afc.extendsClass(FD3202_V08, AView);


FD3202_V08.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	this.btnAutoTransReg = this.findCompById('btnAutoTransReg');
	
	this.CheckBox1 = this.findCompById('CheckBox1');
	this.CheckBox2 = this.findCompById('CheckBox2');
	this.CheckBox3 = this.findCompById('CheckBox3');
	
	this.lblFundName = this.findCompById('lblFundName');
	this.lblFundName2 = this.findCompById('lblFundName2'); // 클래스상세 전체명 추가 2019.09.19
	
	this.autoTransBankAcc = this.findCompById('txtAutoTransBankAcc'); // 은행계좌번호 컴포넌트
	
	this.bankDropBox = this.findCompById('bankDropBox'); // 은행선택	
	this.bankAccName = this.findCompById('bankAccName'); // 은행계좌명
		
	this.txtMonthPayMoney = this.findCompById('txtMonthPayMoney'); // 월납입금액
	this.txtMonthPayDay = this.findCompById('txtMonthPayDay'); // 월납입일
	this.txtTransPeriod = this.findCompById('txtTransPeriod'); // 월납입기간
	
	this.lblStep = this.findCompById('lblStep');
	
	this.view1 = this.findCompById('View1');
	
	// 다음 버튼 활성화 flag
	this.btnNextFlag1 = null; //명의조회를 했는지 안했는지

	this.lblFundName.setShrinkInfo({maxChar:20, fontSize:24}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.lblFundName2.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
};

FD3202_V08.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);			
				
};

FD3202_V08.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);			
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	cont.view2.scrollTo(0);
	thisObj.view1.scrollTo(0);
	
	thisObj.bankInfo = BankInfo();
				
	thisObj.btnNextFlag1=0;
		
	thisObj.btnAutoTransReg.enable(false);
	
	thisObj.bankDropBox.setEditText(''); // 출금은행 초기화
	thisObj.autoTransBankAcc.setText(''); // 출금계좌번호 초기화
	thisObj.bankAccName.setText(''); // 예금주명 클리어
	
	thisObj.CheckBox1.setCheck(false); // 1번 체크박스 해제
	thisObj.CheckBox2.setCheck(false); // 2번 체크박스 해제
	thisObj.CheckBox3.setCheck(false); // 3번 체크박스 해제
	
	
	// 선택한 펀드 이름 세팅
	thisObj.lblFundName.setText(cont.selectFundInfo["D1한글투신펀드명"]);
	thisObj.lblFundName2.setText(cont.selectFundInfo["D1클래스상세 전체명"]); // 클래스상세 전체명 추가 2019.09.19
	
	thisObj.fundBuyAcc = thisObj.viewData.accNo; // 직전 페이지에 있는 펀드매수계좌 세팅
	thisObj.txtPw = thisObj.viewData.accPw; // 직전 페이지에 있는 비밀번호 세팅
	
	thisObj.autoTransMoney = thisObj.viewData.monthPayMoney; // 월납입금액
	thisObj.autoTransPayDay = thisObj.viewData.monthPayDate; // 월납입일
	if(Number(thisObj.autoTransPayDay) < 10){
		thisObj.autoTransPayDay = '0' + thisObj.autoTransPayDay; // 월납입일
	}
	thisObj.transPeriod = thisObj.viewData.transPeriod; // 납입기간
	
	thisObj.txtMonthPayMoney.setText(thisObj.autoTransMoney);
	thisObj.txtMonthPayDay.setText(thisObj.autoTransPayDay);
	
	thisObj.transAccNm = thisObj.viewData.transAccNm;
	
	var tempAcc = thisObj.viewData.moAccNo;
	this.moAccNo = tempAcc.substr(0,3) + '91' + tempAcc.substr(5,6);
	
	var lblStepText =[];
	
	lblStepText.push("<span class='fc_red3'>" + cont.fundNowBuyStep + "</span><span class='step'>/" + cont.fundAllBuyStep + "단계</span>");
				
	thisObj.lblStep.$ele.children().eq(0).html(lblStepText);
	
	//thisObj.lblStep.setText( cont.fundNowBuyStep + "/" +cont.fundAllBuyStep + " 단계"); // 현재단계 세팅	
	
	thisObj.autoTransDateCalc(); // 이체기간을 계산하여 세팅	
	
	thisObj.getVirtualAcc();
	
	setTimeout(function(){ $("#FD3202_V08--View3").forceRedraw();}, 700);
				
};

//비동기 응답 설정
FD3202_V08.prototype.doAddQueryListener = function()
{
	theApp.accNetManager.addQueryListener(this);
};

//비동기 응답 설정 해지
FD3202_V08.prototype.doRemoveQueryListener = function()
{
	theApp.accNetManager.removeQueryListener(this);
};

//화면소멸 전 이벤트
FD3202_V08.prototype.onWillDeactive = function(reload)
{
	AView.prototype.onWillDeactive.call(this, reload);		
		
};

FD3202_V08.prototype.onCheckBoxClick = function(comp, info)
{
	//TODO:edit here
	
	var chk1, chk2, chk3;
	
	chk1 = this.CheckBox1.getCheck();
	chk2 = this.CheckBox2.getCheck();
	chk3 = this.CheckBox3.getCheck();
	
	if(comp){
		if(comp.getComponentId() == 'CheckBox1'){
			if(chk1){
				this.onButton4Click();
			}
		}else if(comp.getComponentId() == 'CheckBox2'){
			if(chk2){
				this.onButton2Click();
			}
		}else if(comp.getComponentId() == 'CheckBox3'){
			if(chk3){
				this.onButton3Click();
			}
		}
	}

	if(chk1 && chk2 && chk3 && this.btnNextFlag1){
		this.btnAutoTransReg.enable(true);
	}else{
		this.btnAutoTransReg.enable(false);
	}
	

};

// 이체기간 계산함수
FD3202_V08.prototype.autoTransDateCalc = function()
{
	var nowDate = MetaInfo.fnGetToday('NUMDATE'); // 오늘 날짜
	
	var nowDateYear = nowDate.substring(0,4); // 현재 년	
	var nowDateMonth = nowDate.substring(4,6); // 현재 월
	var nowDateDay = nowDate.substring(6,8); // 현재 일
	
	var autoTransStartYear, autoTransStartMonth, autoTransStartDay; // 자동이체시작일 조합 변수
	var autoTransEndYear, autoTransEndMonth, autoEndStartDay; // 자동이체종료일 조합 변수
	
	var autoTransStart; // 자동이체시작일 조합
	var autoTransEnd; // 자동이체종료일 조합
		
	// 이체시작일 계산
	autoTransStartYear = nowDateYear;
	autoTransStartMonth = nowDateMonth;
	autoTransStartDay = nowDateDay;
			
	if(Number(nowDateDay) > Number(this.autoTransPayDay)){ // 월납입일이 현재 날짜보다 앞인지 체크
		if(Number(nowDateMonth) == 12){ // 현재 월이 12월인지 체크				
			autoTransStartYear = Number(autoTransStartYear) + 1; // 년도증가
			autoTransStartMonth = 1; // 1월로 변경
		}else{
			autoTransStartMonth = Number(nowDateMonth) + 1; // 월 증가
		}						
	}
		
	// 월입력을 데이터 형식에 맞게 입력해줌
	if(autoTransStartMonth.toString().length == 1){
		autoTransStartMonth = "0" + autoTransStartMonth;
	}
	
	autoTransStartDay = this.autoTransPayDay;
	
			
	autoTransStart = autoTransStartYear.toString() + autoTransStartMonth.toString() + autoTransStartDay.toString();
	
	
	// 이체종료일 계산
	autoTransEndYear = nowDateYear;
	autoTransEndMonth = nowDateMonth;
	autoEndStartDay = nowDateDay;
	
	// 펀드납입기간을 추가하여 계산
	var autoTransEndResult = Number(autoTransEndMonth) + Number(this.transPeriod); 
	
	// 해당 년도, 월 계산
	if(autoTransEndResult > 12){
		autoTransEndYear = Number(autoTransEndYear) + Number(parseInt(autoTransEndResult/12));
		
		if( Number(autoTransEndResult % 12) == 0){
			autoTransEndYear = autoTransEndYear - 1; // 나누어떨어졌을경우 해당년도 넘어가지 않음
			autoTransEndMonth = 12; // 나누어떨어졌을 경우 12월로 변경
		}else{
			autoTransEndMonth = Number(autoTransEndResult % 12);
		}
		
	}else{
		autoTransEndMonth = autoTransEndResult;
	}
	
	// 현재 월부터 납입시작했을 시에 계산
	if(nowDateDay <= Number(this.autoTransPayDay)){
		autoTransEndMonth = Number(autoTransEndMonth - 1);
		
		//00월을 피하기 위해
		if(autoTransEndMonth == 0)
		{
			autoTransEndMonth = 12;
			autoTransEndYear = autoTransEndYear - 1;
		}
	
	}
	
	// 월입력을 데이터 형식에 맞게 입력해줌
	if(autoTransEndMonth.toString().length == 1){
		autoTransEndMonth = "0" + autoTransEndMonth;
	}
	
	autoEndStartDay = this.autoTransPayDay;
	
		
	autoTransEnd = autoTransEndYear.toString() + autoTransEndMonth.toString() + autoEndStartDay.toString();
			
	this.autoTransStart = autoTransStart;
	this.autoTransEnd = autoTransEnd;	
	
	this.txtTransPeriod.setText(Utils.formatDotDate(this.autoTransStart) + " - " + Utils.formatDotDate(this.autoTransEnd));
	
};

// GET VIRTUAL ACCOUNT

FD3202_V08.prototype.getVirtualAcc = function()
{
	var thisObj = this
		,cont = thisObj.getContainer()
		,qrName = "SACMQ201"
		,cipherData = thisObj.txtPw;
		
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.fundBuyAcc
	};
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){				
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				// 수정하기 위해 펑션키 수정
				queryData.setHeaderInfo(
					{FUNC_KEY_LST: 'C'}
				);
		
				var InBlock1 = queryData.getBlockData('InBlock1')[0];			

				InBlock1['D1계좌번호'] = thisObj.moAccNo;
				InBlock1['D1입력비밀번호'] = afc.isSimulator ? '0423' : result; 
						
				queryData.putPwInfo('InBlock1', 'D1입력비밀번호');

			},
			function(queryData, groupName)
			{				
				var errMsg = this.getLastError('errMsg');
				var errCode = this.getLastError('errCode');
				
				if(queryData)
				{
					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
					if(OutBlock1){						
						thisObj.virtAcc = OutBlock1['D1은행대표연결계좌번호'];
					}
				}else { 
						thisObj.virtAcc = null;
				}
			}
		);
	});
}

// 자동이체 약정등록
FD3202_V08.prototype.onbtnAutoTransRegClick = function(comp, info)
{
	
	var thisObj = this
		,cont = thisObj.getContainer() // 연결된 최상위 뷰
		,qrName = "SACAT516"
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
	theApp.accNetManager.addSkipErrorCode('SACAT516', '3691');
	
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
				InBlock1['D1서브계좌번호'] = checkObj.accNo;
				InBlock1['D1투신펀드코드'] = cont.selectFundInfo['D1투신펀드코드']; 
				InBlock1['D1입력비밀번호'] = afc.isSimulator ? '0423' : result; 
				InBlock1['D1은행코드'] = thisObj.autoBankCode; 
				InBlock1['D1은행계좌번호'] = thisObj.autoTransBankAcc.getText(); 
				InBlock1['D1은행계좌명'] = thisObj.bankAccName.getText(); //SDPKT120 에서 얻어온 계좌명 
				InBlock1['D1실명확인번호'] = ''; 
				InBlock1['D1자동대체일'] = thisObj.autoTransPayDay; 
				InBlock1['D1이체종료일'] = thisObj.autoTransEnd; 
				InBlock1['D1이체시작일'] = thisObj.autoTransStart;
				InBlock1['D1은행자동이체금액'] = thisObj.autoTransMoney; 
				InBlock1['D1은행본인계좌여부'] = '1'; 
				InBlock1['D1통장사용여부'] = ''; 
				InBlock1['D1증빙구분'] = '4';

				queryData.putPwInfo('InBlock1', 'D1입력비밀번호');

			},
			function(queryData, groupName)
			{				
				var errMsg = this.getLastError('errMsg');
				var errCode = this.getLastError('errCode');
				if(errCode == '3691'){
					// 부적합금융투자상품 거래 확인서 작성이 실패하였을 경우에는 팝업	
					
					thisObj.autoTransDelayCalc();
					
					var Msg = [	'희망하신 월납입일과 ','<br/>','자동이체기간을 ', '<br/>',
								'확인해주시기 바랍니다.', '<br/>',
								'자동이체 약정등록을 ','</br>','진행하시겠습니까?','</br>',
								'-월납입일 : ',thisObj.autoTransStart.toString().substring(6,8),'일 ','<br/>',
								'-자동이체기간 : ','</br>',
								thisObj.autoTransStart.toString().substring(0,4),' 년 ',
								thisObj.autoTransStart.toString().substring(4,6),' 월 ',
								thisObj.autoTransStart.toString().substring(6,8),' 일 ~ ','</br>',
								thisObj.autoTransEnd.toString().substring(0,4),' 년 ',
								thisObj.autoTransEnd.toString().substring(4,6),' 월 ',
								thisObj.autoTransEnd.toString().substring(6,8),' 일 ', '</br>'].join('');
							
					theApp.alert(Msg,null,"알림");
					
				}else{
					if(queryData)
					{
						var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
						if(OutBlock1){
							// finishGubun(1:임의식, 2:적립식)   monthGubun(21:월적립식, 22:일적립식)
							cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V09', {finishGubun:'2', monthGubun:'21'});
						}
					}
				}
				// 투신펀드 서브계좌이므로 투신펀드로 변경 
			}//, checkObj.accNo.substring(0,11) // 2018.07.27 자동이체약정 시 SMS 절차 생략
		);
	});
};

// 이체시작일이 약정등록일(영업일) + 4일보다 전일자인 경우 이체시작일, 이체종료일 한달씩 순연
FD3202_V08.prototype.autoTransDelayCalc = function()
{
	if(this.autoTransStart.toString().substring(4,6) == '12'){
		this.autoTransStart = Number(this.autoTransStart) + Number(8900); // 
	}else{
		this.autoTransStart = Number(this.autoTransStart) + Number(100); // 한달 더함		
	}
	if(this.autoTransEnd.toString().substring(4,6) == '12'){
		this.autoTransEnd = Number(this.autoTransEnd) + Number(8900); // 한달 더함
	}else{
		this.autoTransEnd = Number(this.autoTransEnd) + Number(100); // 한달 더함		
	}	
	
	this.txtTransPeriod.setText(Utils.formatDotDate(this.autoTransStart) + " - " + Utils.formatDotDate(this.autoTransEnd));
};

FD3202_V08.prototype.onbankDropBoxActionUp = function(comp, info)
{
	//TODO:edit here	
	var win = AWindow.createWindow('FD/window/FD3202_W07.lay','FD3202W7');
	
	win.bankInfo = this.bankInfo;
	win.openAsDialog(this);
		
};

FD3202_V08.prototype.onWindowResult = function(result, windowObj)
{
	//TODO:edit here	
	if(windowObj.containerId == 'FD3202W7'){						
		if(result !== 0){
			this.autoBankCode = result[0];
			this.autoBankName = result[1];	
			this.bankDropBox.setEditText(this.autoBankName);
			
			this.bankDropBox.removeClass('active');
		}
	}else if(windowObj.containerId == 'FD3202W9'){
		if(result == 3){
			this.CheckBox1.setCheck(true);
			this.onCheckBoxClick();
		}else if(result == 4){
			this.CheckBox2.setCheck(true);
			this.onCheckBoxClick();
		}else if(result == 5){
			this.CheckBox3.setCheck(true);
			this.onCheckBoxClick();
		}
	}else if(windowObj.containerId == 'FD3202W8'){
		this.CheckBox3.setCheck(true);
		this.onCheckBoxClick();
	}
};

// 은행 예금주 조회
FD3202_V08.prototype.onbtnBankAccNameClick = function(comp, info)
{

	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	var infos = [thisObj.bankDropBox.getEditText(), thisObj.autoTransBankAcc.getText()];
				
	if(thisObj.bankDropBox.getEditText().length == 0){
		AToast.show('출금은행을 선택하세요.');
		thisObj.bankDropBox.addClass('active');
		
		return;
	}
	
	if(thisObj.autoTransBankAcc.getText().length == 0){
		AToast.show('출금은행 계좌번호를 입력하세요');
		thisObj.autoTransBankAcc.addClass('active');
		
		return;
	}
	
	if(thisObj.virtAcc && thisObj.autoTransBankAcc.getText() == thisObj.virtAcc)
	{
		theApp.alert('가상 계좌번호를 제외한 <br/>본인 명의계좌로 <br/>입력해주시기 바랍니다');

		thisObj.autoTransBankAcc.addClass('active');
		
		return;
	}
	
	//예금주명 세팅
	thisObj.doSendData_SDPKT120(infos,function(oBlock){
	/*
		if(!oBlock){
			thisObj.bankAccName.setText('');
			thisObj.btnNextFlag1 = 0;
			
			thisObj.onCheckBoxClick();
			return;
		}else{
			thisObj.bankAccName.setText(oBlock["D1예금주명"]);
			thisObj.btnNextFlag1 = 1;
			
			thisObj.onCheckBoxClick();
		}
	*/	
		if(oBlock){
			if(oBlock["D1예금주명"] == thisObj.transAccNm){
				thisObj.bankAccName.setText(oBlock["D1예금주명"]);
				thisObj.btnNextFlag1 = 1;

				thisObj.onCheckBoxClick();
			}else{
				theApp.alert(
					[	 
						'본인명의의 타금융기관 계좌로', '<br/>',
						'자동이체 신청이 가능합니다.', '<br/>',					
						,' '
					].join('')
					,
					function()
					{
						thisObj.autoTransNmFail();
					}
					,''
				);
			}
		}else{
			thisObj.bankAccName.setText('');
			thisObj.btnNextFlag1 = 0;
			
			thisObj.onCheckBoxClick();
		}
	});
			
};

// 동일명의인 확인 실패
FD3202_V08.prototype.autoTransNmFail = function(infos,callback){
	var thisObj = this;
	
	thisObj.bankAccName.setText('');
	thisObj.btnNextFlag1 = 0;
			
	thisObj.onCheckBoxClick();
};

// 은행계좌 본인명의 확인
FD3202_V08.prototype.doSendData_SDPKT120 = function(infos,callback){
	
	var thisObj = this,
		cont = thisObj.getContainer();		
		
	//비동기 응답설정
	thisObj.doAddQueryListener();
			
	/************************************/	
	//비동기콜백 글로벌에 저장
	thisObj.afterCallback = callback;
	/************************************/	
										
	cont.sendData('SDPKT120', 
		function(queryData, groupName){
				
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			
			InBlock1['D1은행코드'] = thisObj.autoBankCode; 
			InBlock1['D1은행계좌번호'] = thisObj.autoTransBankAcc.getText();

			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName) {
			var errcode = this.getLastError('errCode'),
				errMsg = this.getLastError('errMsg');
								
			if(afc.isSimulator) queryData.printQueryData();
			
			//에러처리필요
			if(!queryData)
			{					
				if(afc.isSimulator) afc.log('queryData null!');
				//callback(null);
			}else{
				if(afc.isSimulator) queryData.printQueryData();
				var oBlock = queryData.getBlockData('OutBlock1')[0];	
			}
		});	
};

//비동기 응답 데이터 수신부 override
FD3202_V08.prototype.afterOutBlockData = function(queryData, groupName, trName, manager)
{
	var thisObj = this,
		cont = thisObj.getContainer(),	
		errCode = '1000',
		packetType = manager.rcvBuf.getByte(OS_CH_TG_TP);
			
	//계정계 지연처리 TR응답
	if(packetType==PACKET_TYPE.E)
	{
	
		//afc.log('$$$$$$$$$$$$$$$$$지연이체 응답 수신$$$$$$$$$$$$$$$$$');
	
		if(trName=='SDPKT120')
		{								
			//코드저장
			errCode = manager.errorData.errCode;
											
			//비정상(오류)
			if(errCode>=1000)
			{
				
				AToast.show([manager.errorData.errMsg, ' : ',  errCode].join(''));
				if(thisObj.afterCallback) thisObj.afterCallback(null);
				return;
			}			
			
			
			if(!queryData)
			{
				//afc.log('$$$$$$$$$$$$$$$$$ 2 $$$$$$$$$$$$$$$$');
				
				if(afc.isSimulator) afc.log('queryData null!');
				if(thisObj.afterCallback) thisObj.afterCallback(null);
				
			}
			else
			{			
				//afc.log('$$$$$$$$$$$$$$$$$ 3 $$$$$$$$$$$$$$$$');
				// 정상처리되었을 경우 비동기방식 처리 해제
			 	thisObj.doRemoveQueryListener();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];								
				
				if(thisObj.afterCallback) thisObj.afterCallback(OutBlock1, errCode);
				
				if(afc.isSimulator) queryData.printQueryData();
			}			
		}		
	}
};

FD3202_V08.prototype.onButton4Click = function(comp, info)
{

	//TODO:edit here
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	var win = AWindow.createWindow('FD/window/FD3202_W06.lay', 'FD3202W9');
		
//	win.loadviewUrlAddr = 'http://webmts.koscom.co.kr/notice/mts/Event/winEvent40Hy1.html';
//	win.loadviewUrlAddr = 'http://www.meritzam.com/fund_pro/메리츠차이나증권투자신탁주식';

	win.loadviewUrlAddr = 'http://www.meritzam.com/marketings/terms03.html';
	
	win.loadTitle = "약관동의";
		
	win.openAsDialog(this, '100%', '100%');

};

FD3202_V08.prototype.onButton2Click = function(comp, info)
{

	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	var win = AWindow.createWindow('FD/window/FD3202_W06.lay', 'FD3202W9');
		
//	win.loadviewUrlAddr = 'http://webmts.koscom.co.kr/notice/mts/Event/winEvent40Hy1.html';
//	win.loadviewUrlAddr = 'http://www.meritzam.com/fund_pro/메리츠차이나증권투자신탁주식';

	win.loadviewUrlAddr = 'http://www.meritzam.com/marketings/terms18.html';
	
	win.loadTitle = "개인정보 수집 및 이용동의";
		
	win.openAsDialog(this, '100%', '100%');

};

FD3202_V08.prototype.onButton3Click = function(comp, info)
{

	//TODO:edit here
	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	var win = AWindow.createWindow('FD/window/FD3202_W08.lay', 'FD3202W8');

		
//	win.loadviewUrlAddr = 'http://webmts.koscom.co.kr/notice/mts/Event/winEvent40Hy1.html';
//	win.loadviewUrlAddr = 'http://www.meritzam.com/fund_pro/메리츠차이나증권투자신탁주식';

	win.loadviewUrlAddr = '';
	
	win.loadTitle = "개인정보 제 3자 제공동의";
		
	win.openAsDialog(this, '100%', '100%');

};

FD3202_V08.prototype.onbankDropBoxChange = function(comp, info)
{

	//TODO:edit here
	
};

FD3202_V08.prototype.ontxtAutoTransBankAccBlur = function(comp, info)
{

	//TODO:edit here
	this.autoTransBankAcc.removeClass('active');
};
