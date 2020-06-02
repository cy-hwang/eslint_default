
/**
Constructor
Do not call Function in Constructor.
*/
function FD4102_W02(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD4102_W02.lay';

	//TODO:edit here

}
afc.extendsClass(FD4102_W02, BaseWindow);


FD4102_W02.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here

};

FD4102_W02.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	// 윈도우 창 그냥 닫기
	this.close(0);

};

FD4102_W02.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.checkBox1 = this.findCompById('CheckBox1');
	
	this.btnCancel = this.findCompById('BtnCancel'); // 월지급 약정 취소 버튼
	this.btnChgSubmit = this.findCompById('BtnChgSubmit'); // 월지급 약정 신청 및 변경 버튼	
	this.accPassEXSecureTxt = this.findCompById('accPassEXSecureTxt');			
	this.txtRequestMoney = this.findCompById('txtRequestMoney');	
	
	this.cancelFalg = 0; // 약정취소 구분 Falg
		
	this.btnCancel.enable(false); // // 취소버튼 비활성화
	this.btnChgSubmit.enable(false); // // 신청 및 변경 버튼 비활성화
	
	this.monthRequestCheck();
	
}

FD4102_W02.prototype.onCheckBox1Click = function(comp, info)
{
	//TODO:edit here
	
	// 체크박스가 체크될 경우에만 내용팝업 올림
	if(this.checkBox1.getCheck()){
		var win = AWindow.createWindow('FD/window/FD3202_W11.lay','FD320211');

		win.openAsDialog(this);
	}else{
		this.btnChgSubmit.enable(false); // // 신청 및 변경 버튼 비활성화
	}

};

FD4102_W02.prototype.onWindowResult = function(result, windowObj)
{	
	if(windowObj.containerId == 'FD320211'){
		
		var pwLength = this.accPassEXSecureTxt.getPwLength(); //비번길이
		
/*		if(result == 1){
			this.checkBox1.setCheck(true);
		}else{
			this.checkBox1.setCheck(false);
		}
		
		// 비번길이가 0보다 길고 내용확인이 체크되어 있을 경우에만 활성화
		if(pwLength > 0){
			if(result == 1){				
				this.btnChgSubmit.enable(true); // // 신청 및 변경 버튼 활성화
			}
			
			this.btnCancel.enable(true); // 취소버튼 활성화
			
		}else{
			this.btnCancel.enable(false); // 취소버튼 비활성화
			this.btnChgSubmit.enable(false); // 신청 및 변경 버튼 비활성화	
		}*/
		
		if(!afc.isSimulator){
			if(result == 1){
				this.checkBox1.setCheck(true);
			}else{
				this.checkBox1.setCheck(false);
			}

			// 비번길이가 0보다 길고 내용확인이 체크되어 있을 경우에만 활성화
			if(pwLength > 0){
				if(result == 1){				
					this.btnChgSubmit.enable(true); // // 신청 및 변경 버튼 활성화
				}
			}else{
				this.btnCancel.enable(false); // 취소버튼 비활성화
				this.btnChgSubmit.enable(false); // 신청 및 변경 버튼 비활성화	
			}
		}else{
			if(result == 1){
				this.checkBox1.setCheck(true);
				this.btnChgSubmit.enable(true);
			}else{
				this.checkBox1.setCheck(false);
			}
		}
		
	}
};

// 월지급 약정취소
FD4102_W02.prototype.onBtnCancelClick = function(comp, info)
{
	//TODO:edit here	
	this.monthRequestJoinChange(2);
};

//월지급 약정 신청 및 변경(신청:1, 변경:3)
FD4102_W02.prototype.onBtnChgSubmitClick = function(comp, info)
{
	//TODO:edit here
	
	var thisObj = this;
	
	if(thisObj.validCheck()){	
		thisObj.txtReqMoney = thisObj.txtRequestMoney.getText();	
		thisObj.monthRequestCheck(thisObj, function(requestTrxTp){
			thisObj.monthRequestJoinChange(requestTrxTp);
		});		
	}
};

FD4102_W02.prototype.validCheck = function()
{

	//TODO:edit here
	if(!this.txtRequestMoney.getText()){
		AToast.show("신청금액을 입력하세요");
		this.txtRequestMoney.addClass('active');
		return false;
	}
	
	return true;

};

FD4102_W02.prototype.ontxtRequestMoneyBlur = function(comp, info)
{

	//TODO:edit here
	this.txtRequestMoney.removeClass('active');
};


// 시니어펀드 월지급 약정 신청, 취소
FD4102_W02.prototype.monthRequestJoinChange = function(TrxTp)
{
						
	// 현재 페이지에 대한 데이터	
	var thisObj = this;	
	var cont = thisObj.opener.getContainer();
	
	// 호출한 데이터
	var qrName = "SACAT562"
		,cipherData = thisObj.accPassEXSecureTxt.getCipherData(); //
								
	
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.subAccNo
	};
		
	var nowDate = MetaInfo.fnGetToday('NUMDATE'); // 오늘 날짜
	
	var nowDateYear = nowDate.substring(0,4); // 현재 년	
	var nowDateMonth = Number(nowDate.substring(4,6)) + 1; // 현재 월
	var nowDateDay = nowDate.substring(6,8); // 현재 일
		
	if(Number(nowDateMonth) == 13){ // 현재 월이 12월인지 체크				
		nowDateYear = Number(nowDateYear) + 1; // 년도증가
		nowDateMonth = 1; // 1월로 변경
	}						
	
	if(nowDateMonth < 10){
		nowDateMonth = '0' + nowDateMonth;
	}
			
	thisObj.ctrctSrtDt = nowDateYear + nowDateMonth;		
			
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){				
		thisObj.sendData(qrName, 
			function(queryData, groupName)
			{												
				queryData.setHeaderInfo({
					FUNC_KEY_LST: "5"
				});
		
				var InBlock1 = queryData.getBlockData('InBlock1')[0];

				InBlock1['D1처리구분'] = TrxTp; // 1.등록 2.해지 3.정정
				InBlock1['D1서비스종류코드'] = '3084';
				InBlock1['D1계좌번호'] = checkObj.accNo;
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;
				InBlock1['D1투신펀드코드'] = thisObj.fundCode;
				InBlock1['D1대체계좌번호'] = '';
				InBlock1['D1은행코드'] = '';
				InBlock1['D1은행계좌번호'] = '';
				InBlock1['D1은행계좌명'] = '';
				InBlock1['D1일괄대체코드'] = '02';
				InBlock1['D1자동이체대체금액'] = thisObj.txtReqMoney;
				InBlock1['D1타사대체구분'] = '1';
				InBlock1['D1약정시작일'] = thisObj.ctrctSrtDt;
				InBlock1['D1자동대체일'] = '20';
				InBlock1['D1대출만기일'] = '9999';
				InBlock1['D1월지급펀드여부'] = '1';

				queryData.putPwInfo('InBlock1', 'D1비밀번호');
				
			},
			function(queryData, groupName)
			{				
			
				var errMsg = this.getLastError('errMsg');
				var errCode = this.getLastError('errCode');
											
				if(queryData != null){
								
					var OutBlock1 = queryData.getBlockData('OutBlock1');
					if(!OutBlock1) return;
					
					if(errCode == "0210" || errCode == "0211" || errCode == "0212"){
						theApp.alert(
							[	 
								errMsg
								,' '
							].join('')
							,
							function()
							{								
								thisObj.monthPayRequsetChgSucc();
							}
							,''
						);
					}

					queryData.printQueryData();
				}
			
			}, checkObj.accNo.substring(0,11)
		);
	});		
};

// 성공후 창 닫기
FD4102_W02.prototype.monthPayRequsetChgSucc = function()
{
	this.close(0);
};

// 시니어펀드 월지급 약정 조회
FD4102_W02.prototype.monthRequestCheck = function(caller)
{
						
	// 현재 페이지에 대한 데이터	
	var thisObj = this;	
	var cont = thisObj.opener.getContainer();		
		
	// 호출한 데이터
	var thisObj2 = caller		
		,callback = arguments[1]	
		,qrName = "SACAT562";	
	
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.subAccNo
	};
						
	theApp.accNetManager.addSkipErrorCode('SACAT562', '3113'); // 약정내역이 존재하지 않습니다.
	thisObj.sendData(qrName, 
		function(queryData, groupName)
		{												
			queryData.setHeaderInfo({
				FUNC_KEY_LST: "C"
			});

			var InBlock1 = queryData.getBlockData('InBlock1')[0];

			InBlock1['D1처리구분'] = '3'; // 1.등록 2.해지 3.정정
			InBlock1['D1서비스종류코드'] = '3084';
			InBlock1['D1계좌번호'] = checkObj.accNo;
			InBlock1['D1비밀번호'] = '1'
			InBlock1['D1투신펀드코드'] = '';
			InBlock1['D1대체계좌번호'] = '';
			InBlock1['D1은행코드'] = '';
			InBlock1['D1은행계좌번호'] = '';
			InBlock1['D1은행계좌명'] = '';
			InBlock1['D1일괄대체코드'] = '02';
			InBlock1['D1자동이체대체금액'] = '';
			InBlock1['D1타사대체구분'] = '1';
			InBlock1['D1약정시작일'] = '';
			InBlock1['D1자동대체일'] = '20';
			InBlock1['D1대출만기일'] = '9999';
			InBlock1['D1월지급펀드여부'] = '1';

			queryData.printQueryData();	

		},
		function(queryData, groupName)
		{				

			var errMsg = this.getLastError('errMsg');
			var errCode = this.getLastError('errCode');
			
			var requestTrxTp = 1; // 신청, 정정 구분값
						
			// errCode 0217(등록된 내역 있음), errCode(3113)(약정내역이 존재하지 않습니다.)
			
			if(errCode == "3113"){
				thisObj.cancelFalg = 0
			}else if(errCode == "0217"){
				thisObj.cancelFalg = 1
				
				// 시뮬레이터일 경우에 취소버튼 활성화
				if(afc.isSimulator){
					thisObj.btnCancel.enable(true);
				}
			}
			
			// 에러스킵코드 해제
			theApp.accNetManager.removeSkipErrorCode('SACAT562', '3113'); // 약정내역이 존재하지 않습니다.
			
			// callback 함수 있으면 실행(신청 및 변경할 때 현재 월지급약정 여부 상태를 다시 조회함)
			if(callback){
				if(errCode == "0217"){
					requestTrxTp = 3; // 변경
				}else{
					requestTrxTp = 1; // 신청
				}
				callback(requestTrxTp);
			}else{			
				if(queryData != null){

					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
					if(!OutBlock1) return;				

					thisObj.txtRequestMoney.setText(OutBlock1["D1자동이체대체금액"]);

					queryData.printQueryData();									
				}
			}
		}
	);
		
};

FD4102_W02.prototype.onaccPassEXSecureTxtChange = function(comp, info)
{

	//TODO:edit here	
	var pwLength = this.accPassEXSecureTxt.getPwLength(); //비번길이
	
	// 비번길이가 0보다 길고 내용확인이 체크되어 있을 경우에만 활성화
	if(pwLength > 0){
		if(this.checkBox1.getCheck()){			
			this.btnChgSubmit.enable(true); // 신청 및 변경 버튼 활성화	
		}else{
			this.btnChgSubmit.enable(false); // 신청 및 변경 버튼 비활성화	
		}
		if(this.cancelFalg){
			this.btnCancel.enable(true); // 취소버튼 활성화
		}else{
			this.btnCancel.enable(false); // 취소버튼 비활성화
		}
		
	}else{
		this.btnCancel.enable(false); // 취소버튼 비활성화
		this.btnChgSubmit.enable(false); // 신청 및 변경 버튼 비활성화	
	}
};
