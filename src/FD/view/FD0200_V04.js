/**
Constructor
Do not call Function in Constructor.
*/
function FD0200_V04()
{
	AView.call(this);

	//TODO:edit here
	
	this.timer = null;
	this.phoneInfo =
	{
		noCode : '',		
		phoneNm : ''
	};
	
	this.bMode = true;
	this.checkedData = null; 
	this.accNo  = null; 
	this.confirmUserCallback = null; 
	
	this.additionalInputValidCheck = null; 
	
	this.agntNm = null;
	//this.menuId = "SMSCERTC"; 	
}
afc.extendsClass(FD0200_V04, AView);


FD0200_V04.prototype.init = function(context, evtListener)
{
	
	AView.prototype.init.call(this, context, evtListener);		
	//this.infoTextView = this.findCompById("infoTextView"); 
	//this.infoTextView.show(AComponent.GONE);
	this.TitleView = this.findCompById('TitleView');
	
	this.AgnNameTxt = this.findCompById('AgnNameTxt'); //대리인 이름
	this.AgnNameTxt.setReadOnly(true);
	
	this.rmnNoSecureTextField =  this.findCompById ('XSecureTextField1'); 
	
	this.TelecomView= this.findCompById('TelecomView');
	
	
	//AToast.show('Init');
	this.telDbx = this.findCompByGroup('TelDbx')[0];
	var telArr = [{text:'SKT',data:'1'},{text:'KT',data:'2'},{text:'LGU+',data:'3'},{text:'SKT알뜰폰',data:'5'},{text:'KT알뜰폰',data:'6'},{text:'LGU+알뜰폰',data:'7'}];
	
	for(var i=0;i<telArr.length;i++){
		this.telDbx.addItem(telArr[i].text,telArr[i].data);
	}	
	

	this.checkBox = this.findCompById('CheckBox9');
	
	
	this.clientInfoView = this.findCompByGroup('ClientInfoView')[0];
		

	this.telnumTxt = this.findCompById('TelnumTxt'); //대리인 전화 번호 

	
	this.telCodeTxt = this.findCompByGroup('TelcodeTxt')[0];
	
	this.timerLbl = this.findCompByGroup('TimerLbl')[0];
	
	this.telcodesendBtn = this.findCompByGroup('TelcodesendBtngr')[0];
	
	this.validCode = true;
	
	
	
};


//비동기 응답 설정
FD0200_V04.prototype.onWillActive = function(reload)
{	
	AView.prototype.onWillActive.call(this, reload);	
	
	theApp.accNetManager.addQueryListener(this);
	
};

FD0200_V04.prototype.setInitialData = function()
{
	this.countDownTimer = false;
	
	//AToast.show('처음부터하기로 들어옴');
	
	this.setPhoneInfo();	
	
	this.AgnNameTxt.setText(this.agntNm); 
		
	this.bMode = true;
	
}


FD0200_V04.prototype.resetView = function()
{			
	this.timerLbl.setText("3:00");
	this.telCodeTxt.setText("");
	this.telcodesendBtn.setText('인증요청');
	if(this.timer) clearInterval(this.timer);
	
	this.setInitialData();
};

FD0200_V04.prototype.setPhoneInfo = function()
{

	/*
	if ( this.phoneInfo.noCode)
	{
		this.telDbx.selectItemByData(this.phoneInfo.noCode);
	}
	*/
	
	
	if(this.phoneInfo.phoneNm)
	{
		if(this.phoneInfo.phoneNm.substring(0,1) == '+')
		{
			this.phoneInfo.phoneNm = ('0'+this.phoneInfo.phoneNm.replace('+82', ''));
		}
		var phoneLen = this.phoneInfo.phoneNm.length;
		this.telnumTxt.setText(this.phoneInfo.phoneNm.substring(0, 3)+'-'+this.phoneInfo.phoneNm.substring(3, phoneLen-4)+'-'+this.phoneInfo.phoneNm.substring(phoneLen - 4));
		
		this.telnumTxt.setReadOnly(true);	
	}

	else 
	{
		
	}
};

//인증번호받기버튼
FD0200_V04.prototype.onTelcodesendBtnClick = function(comp, info)
{
	this.telCodeTxt.setText('');
	var thisObj = this;
	if(!this.inputValidCheck()) return;
	
	
	
	//미성년자 대리인의 경우 인증 번호를 받기전에  SACMT722 를추가로 호출해야 함 (대리인이 고객이 아니기 때문)
	this.sendSACMT722();
	
	//인증번호 받기
	//this.sendSACMT723();
	
	if ( afc.isAndroid ){
		AppManager.receiveSMS('.*메리츠자산운용.*', function(number)
		{
			if(number != null) {
				thisObj.telCodeTxt.setText(number);
			}
		});
	}
};

//인증번호 타임 카운트
FD0200_V04.prototype.timeCountStart = function()
{

	this.countDownTimer = true;
	this.timerLbl.setText('3:00');
	
	this.sec = 180;
	var thisobj = this;
	this.temp = null;
	//Math.round((a+b)*T)/T);
	
	if(this.timer != null) clearInterval(this.timer);
	
	this.timer = setInterval(function(){
		thisobj.temp = ((Math.floor(thisobj.sec%60))+'').length == 1 ? '0' + Math.floor(thisobj.sec%60) : Math.floor(thisobj.sec%60);
		
		thisobj.timerLbl.setText(Math.floor(thisobj.sec/60)+':'+thisobj.temp);
		
		if(thisobj.sec == 0){
			thisobj.telCodeTxt.setText('');
			this.clearInterval(thisobj.timer);
			this.clearInterval(thisobj.timer);
			this.countDownTimer = false;
			this.countDownTimer = false;
		}
		thisobj.sec--;
	}, 1000);
};

//휴대폰 명의인본인인증 등록
FD0200_V04.prototype.sendSACMT722 = function()
{

	var thisObj = this;
		
			
	var telNumString  = this.telnumTxt.getText();
	
	
	/// *** 입력받은 실명 확인번호, 펀드 모바일의 경우 미성년자 대리인인 경우만 적용 (SACMT728) ***
	var rmnno = this.rmnNoSecureTextField.getCipherData(); //theApp.userInfo.getUserData('D1실명확인번호');
	
	thisObj.getContainer().sendData('SACMT722',
	
	function(queryData)
	{
		queryData.setHeaderInfo({FUNC_KEY_LST: '5'});
		
		
		var arr = thisObj.cutPhoneNumber(telNumString);
		
		
		var inBlock1 = queryData.getBlockData('InBlock1');
		var carrier = thisObj.telDbx.getSelectedItemData();
		if(thisObj.checkBox.getCheck()) {
			if(carrier>0 && carrier<4) {
				carrier += 4;
			}
		}
		
		
		// 폰번호, 통신사 정보 Update 
		thisObj.phoneInfo.noCode = carrier;		
		telNumString = telNumString.replace(/[^0-9]/g, ''); // '-' 제거 
		thisObj.phoneInfo.phoneNm = telNumString;	
		
		
		inBlock1[0] =
		{
			"D1실명확인번호" : rmnno, 
			"D1이동전화식별번호" : arr[0], 
			"D1이동전화국번호" : arr[1],
			"D1이동전화일련번호" : arr[2],
			"D1구분" : carrier,
			"D1고객명" : thisObj.agntNm
		};
		
		queryData.putPwInfo('InBlock1', 'D1실명확인번호', theApp.encryptType);
	},
	
	function(queryData)
	{
	
		var errCode = this.getLastError('errCode');		
		if(errCode>=1000)
		{
			if( 8000 == errCode )
			{
				
				theApp.alert("주민등록번호를 다시 확인하세요.",null, "알림");
				
			}			
			else if( 3582 == errCode || 3197 == errCode)			{
			
				
				theApp.alert("휴대폰 정보(통신사, 번호)를 다시 확인하세요.",null, "알림");
				
			}			
		}			
		
		else if( queryData)
		{	
			thisObj.sendSACMT723();	
		}
		
	});	//SACMT723 전송시 펑션키 5
	
};

//인증번호 받기
FD0200_V04.prototype.sendSACMT723 = function()
{

	var thisObj = this;
		
			
	var telNumString  = this.telnumTxt.getText();
	
	
	/// *** 입력받은 실명 확인번호, 펀드 모바일의 경우 미성년자 대리인인 경우만 적용 (SACMT728) ***
	var rmnno = this.rmnNoSecureTextField.getCipherData(); //theApp.userInfo.getUserData('D1실명확인번호');
	
	thisObj.getContainer().sendData('SACMT723',
	
	function(queryData)
	{
		queryData.setHeaderInfo({FUNC_KEY_LST: '5'});
		
		
		var arr = thisObj.cutPhoneNumber(telNumString);
		
		
		var inBlock1 = queryData.getBlockData('InBlock1');

		
		
		
		inBlock1[0] =
		{
			"D1실명확인번호" : rmnno, 
			"D1이동전화식별번호" : arr[0], 
			"D1이동전화국번호" : arr[1],
			"D1이동전화일련번호" : arr[2],
			"D1구분" : thisObj.phoneInfo.noCode
		};
		
		queryData.putPwInfo('InBlock1', 'D1실명확인번호', theApp.encryptType);
	},
	
	function(queryData)
	{
		var errCode = this.getLastError('errCode');		
		if(errCode>=1000)
		{
			if( 8000 == errCode )
			{
				
				theApp.alert("주민등록번호를 다시 확인하세요.",null, "알림");
				
			}			
			else if( 3582 == errCode || 3197 == errCode)			{
			
				
				theApp.alert("휴대폰 정보(통신사, 번호)를 다시 확인하세요.",null, "알림");
				
			}			
		}			
		else if( queryData)
		{
			//queryData.printQueryData();
		}
	});	//SACMT723 전송시 펑션키 5
	
};

FD0200_V04.prototype.getResult_SACMT723 = function(qData)
{
	var outBlock1 = qData.getBlockData('OutBlock1')[0];
	var resCode = outBlock1['D1응답코드'];
	
	if( 'P000' == resCode ) // 성공
	{
		this.timeCountStart();	
		AToast.show('인증번호가 발송되었습니다.');
		this.telcodesendBtn.setText('재인증요청');
		return true;
	}
	else
	{
		if( 'P001'== resCode )
		{
			AToast.show('주민번호 유효성 오류');			
		}
		else if( 'P005'== resCode )
		{
			AToast.show('참가기관ID 존재하지 않음');			
		}
		else if( 'P013'== resCode )
		{
			AToast.show('서비스 이용 권한 없음');			
		}
		else if( 'S101'== resCode )
		{
			AToast.show('이동통신사 구분 오류');			
		}
		else if( 'S102'== resCode )
		{
			AToast.show('이동통신사 통신오류 (이통사 타임아웃 및 연결오류)');			
		}
		else if( 'S602'== resCode )
		{
			AToast.show('메세지 요청이 없음');			
		}
		else if( 'S603'== resCode )
		{
			AToast.show('내부 DB오류');			
		}
		else if( 'S700'== resCode )
		{
			AToast.show('개인구분코드 입력되지 않음');			
		}
		else if( 'S733'== resCode )
		{
			AToast.show('명의도용차단 설정에 따른 본인인증 미대상');			
		}
		else if( 'L399'== resCode )
		{
			AToast.show('인증입력값 오류');			
		}
		else if( 'E998'== resCode )
		{
			AToast.show('기타권한오류');			
		}
		else if( 'E999'== resCode )
		{
			AToast.show('내부시스템오류');			
		}
		else
		{
			AToast.show(resCode + ' 기타시스템오류');
		}
		
		return false;
	}
}

//사용자 최종확인
FD0200_V04.prototype.confirmUser = function(callback)
{
	var thisObj = this;
	
	
	if(this.timer) clearInterval(this.timer); // Timer stop
	
	var arr = this.cutPhoneNumber(this.telnumTxt.getText());
	
	/// *** 입력받은 실명 확인번호, 펀드 모바일의 경우 미성년자 대리인인 경우만 적용 (SACMT728) ***
	var rmnno = this.rmnNoSecureTextField.getCipherData(); //theApp.userInfo.getUserData('D1실명확인번호');
	
	this.confirmUserCallback = callback; 
	
	
	thisObj.getContainer().sendData('SACMT728',	
	
	//inblock
	function(queryData)
	{
		queryData.setHeaderInfo({FUNC_KEY_LST: '5'});
		var inBlock1 = queryData.getBlockData('InBlock1');
		inBlock1[0] =
		{
			"D1실명확인번호" : rmnno,
			"D1계좌번호" : thisObj.telCodeTxt.getText(),	//인증번호
			"D1이동전화식별번호" : arr[0],
			"D1이동전화국번호" : arr[1],
			"D1이동전화일련번호" : arr[2]
		};
		
		queryData.putPwInfo('InBlock1', 'D1실명확인번호', theApp.encryptType);
	},
	
	//outblock
	function(queryData)
	{
	
	});	//SACMT728 전송시 펑션키 5
	
};

FD0200_V04.prototype.getResult_SACMT728 = function(qData)
{
	var outBlock1 = qData.getBlockData('OutBlock1')[0];
	
	var resCode = outBlock1['D1응답코드'];
	
	if( 'P000' != resCode)
	{
		if( 'P001'== resCode )
		{
			AToast.show('주민번호 유효성 오류');			
		}
		else if( 'P005'== resCode )
		{
			AToast.show('참가기관ID 존재하지 않음');			
		}
		else if( 'P013'== resCode )
		{
			AToast.show('서비스 이용 권한 없음');			
		}
		else if( 'S101'== resCode )
		{
			AToast.show('이동통신사 구분 오류');			
		}
		else if( 'S102'== resCode )
		{
			AToast.show('이동통신사 통신오류 (이통사 타임아웃 및 연결오류)');			
		}
		else if( 'S602'== resCode )
		{
			AToast.show('메세지 요청이 없음');			
		}
		else if( 'S603'== resCode )
		{
			AToast.show('내부 DB오류');			
		}
		else if( 'S700'== resCode )
		{
			AToast.show('개인구분코드 입력되지 않음');			
		}
		else if( 'S733'== resCode )
		{
			AToast.show('명의도용차단 설정에 따른 본인인증 미대상');			
		}
		else if( 'L399'== resCode )
		{
			AToast.show('인증입력값 오류');			
		}
		else if( 'E998'== resCode )
		{
			AToast.show('기타권한오류');			
		}
		else if( 'E999'== resCode )
		{
			AToast.show('내부시스템오류');			
		}
		else
		{
			AToast.show('기타시스템오류');
		}
		
		return false;
	}
	else
	{	
		return true;
	}
}

FD0200_V04.prototype.inputValidCheck = function()
{
	if(!this.telDbx.getSelectedItemData())
	{
		AToast.show('통신사를 선택해주세요.');
		return false;
	}
	
	if(!this.cutPhoneNumber(this.telnumTxt.getText())) 
	{
		AToast.show('정확한 핸드폰 번호를 입력해주세요.');
		this.telnumTxt.addClass('active');
		return false;
	}
	
	if(!Utils.validPhone(this.telnumTxt.getText()))
	{
		AToast.show('핸드폰 번호 형식이 잘못되었습니다.');
		this.telnumTxt.addClass('active');
		return false;
	}				

	if(!this.rmnNoSecureTextField.getText() || this.rmnNoSecureTextField.getText() == '')
	{
		AToast.show('주민등록번호를 입력해주세요.');
		this.rmnNoSecureTextField.addClass('active');
		return false;
	}
	
	if ( this.additionalInputValidCheck != null && !this.additionalInputValidCheck ())
	{
		return false; 
	}
	

	return true;
};

FD0200_V04.prototype.agreeValidCheck = function()
{
	if ( this.additionalInputValidCheck != null && !this.additionalInputValidCheck ())
	{
		return false; 
	}
	
	var telCodeLen = this.telCodeTxt.getText().length;
	if( telCodeLen == 0 )
	{
		AToast.show('인증번호를 입력해주세요.');
		this.telCodeTxt.addClass('active');
		this.validCode = false;
		return false;
	}
	else if( telCodeLen < 6 )
	{
		AToast.show('인증번호 형식이 잘못되었습니다.');
		this.telCodeTxt.addClass('active');
		this.validCode = false;
		return false;
	}

	if( "0:00" == this.timerLbl.getText())
	{
		AToast.show('인증번호 입력 시간을 초과하였습니다.');		
		this.validCode = false;
		return false;
	}

	return true;
	
};

FD0200_V04.prototype.cutPhoneNumber = function(number)
{
	number = number.replace(/-/g, '');
	var arr = [];
	
	if(number.length == 10){
		arr[0] = number.substr(0, 3)
		arr[1] = number.substr(3, 3)
		arr[2] = number.substr(6, 4)
	}else if(number.length == 11){
		arr[0] = number.substr(0, 3)
		arr[1] = number.substr(3, 4)
		arr[2] = number.substr(7, 4)
	}else{
		return false;
	}
	
	return arr;

};


FD0200_V04.prototype.onTelnumTxtChange = function(comp, info)
{
	if(afc.isAndroid || comp.getText().length == 0)
	{
		this.cancelBtn.$ele.hide();
	}else{
		this.cancelBtn.$ele.show();
	}
	if(info.substring(0,2) == '02')
	{
		comp.maxLen = 12;
		comp.$ele.attr('maxlength', comp.maxLen);
	}
	else
	{
		comp.maxLen = 13;
		comp.$ele.attr('maxlength', comp.maxLen);
	}
};

FD0200_V04.prototype.onBirthdayTxtChange = function(comp, info)
{
	
	var thisObj = this;
	
	var temp = this.birthdayBack.getCipherData();
		SecurePadManager.cipherToText(temp, function(result)
		{	
			thisObj.birthdayTxt.setText(thisObj.birthdayForward.getText()+'-'+result);
		});
	

	if(comp.getText().length == 6){
		this.birthdayBack.$ele.focus();
	}else{
		
	}
	
};



FD0200_V04.prototype.onCheckBox9Click = function(comp, info)
{
	var isChecked = comp.getCheck();
	var carrier = Number(this.telDbx.getSelectedItemData());
	if(isChecked) {
		if(carrier>0 && carrier<4) {
			carrier += 4;
			this.telDbx.selectItemByData(carrier);
		}
	} else {
		if(carrier > 4 && carrier < 8) {
			carrier -= 4;
		this.telDbx.selectItemByData(carrier);
		}
	}
};

FD0200_V04.prototype.onTelDbxSelect = function(comp, info)
{
	
	var carrier = Number(this.telDbx.getSelectedItemData());
	if(carrier > 4 && carrier < 8) {
		this.checkBox.setCheck(true);
	} else if(carrier >0 && carrier <4) {
		this.checkBox.setCheck(false);
	}
};

FD0200_V04.prototype.getTelDbx = function(){
	var carrier = this.telDbx.getSelectedItemData();
	if(this.checkBox.getCheck()) {
		if(carrier>0 && carrier<4) {
			carrier += 4;
		}
	}
	return carrier;
};


//비동기 응답 데이터 수신부 override
FD0200_V04.prototype.afterOutBlockData = function(queryData, groupName, trName, manager)
{


 	var thisObj = this; 
	
	//lazyFunc
	//계정계 지연처리 TR응답
	if ( trName == 'SACMT723' ) 
	{	
		
		var errCode =  manager.errorData.errCode;
		//비정상(오류)
		if(errCode>=1000)
		{
			/*
			if( 3582 != errCode && 3197 != errCode )
			{	
				///공통으로 대체 
				//theApp.getErrMsg(thisObj,this);				
			}
			*/
		}	
		else if(queryData) 
		{
			//queryData.printQueryData();
			thisObj.getResult_SACMT723(queryData);
		}
	
	}


	else if ( trName == 'SACMT728' ) {
		var errCode = manager.errorData.errCode;
			
			//비정상(오류)
			if(errCode>=1000)
			{		
				///공통으로 대체 
				//theApp.getErrMsg(thisObj,this);							
				
				thisObj.confirmUserCallback.call (thisObj, false);  // fail callback 
			}

			else if(queryData) 
			{
				//queryData.printQueryData();

				if( thisObj.getResult_SACMT728(queryData))
				{
				
					thisObj.confirmUserCallback.call (thisObj, true);  // success callback 
					
				}
			}
	}
}

FD0200_V04.prototype.onWillDeactive = function(){
	
	this.resetView(); 
	AView.prototype.onWillDeactive.call(this);	
	theApp.accNetManager.removeQueryListener(this);
	
};


FD0200_V04.prototype.onTelcodeTxtActionDown = function(comp, info)
{
	if(!this.validCode) {		
		this.validCode = true;
	}

};

FD0200_V04.prototype.onInfoViewButtonClick = function(comp, info)
{

	Notice.openNoticeMiniWindow(this,"FD0200V04" , 584, null,"대리인을 통해 계좌개설하신 경우 대리인 정보를 입력해주시기 바랍니다.",null,535);

};

FD0200_V04.prototype.onTextFieldChange = function(comp, info)
{
	//Hightlihgt 제거 
	var srchTxt = comp.getText();
	if(srchTxt.length > 0)
	{
		comp.removeClass('active');
	}

};
