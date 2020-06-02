/**
Constructor
Do not call Function in Constructor.
*/
function FD0200_V02()
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
	this.birthdayTxtString = null; 
	this.additionalInputValidCheck = null; 	
}
afc.extendsClass(FD0200_V02, AView);


FD0200_V02.prototype.init = function(context, evtListener)
{
	
	AView.prototype.init.call(this, context, evtListener);		
	
	this.TitleView = this.findCompById('TitleView');
	//this.BirthDatView = this.findCompById('BirthDatView'); //r 
	this.TelecomView= this.findCompById('TelecomView');
	
	//AToast.show('Init');
	this.telDbx = this.findCompByGroup('TelDbx')[0];
	var telArr = [{text:'SKT',data:'1'},{text:'KT',data:'2'},{text:'LGU+',data:'3'},{text:'SKT알뜰폰',data:'5'},{text:'KT알뜰폰',data:'6'},{text:'LGU+알뜰폰',data:'7'}];
	
	for(var i=0;i<telArr.length;i++){
		this.telDbx.addItem(telArr[i].text,telArr[i].data);
	}	
	
	
	this.cancelBtn = this.findCompById('CancelBtn');
	this.cancelBtn.$ele.hide();
	
	
	

	this.checkBox = this.findCompById('CheckBox9');
	
	
	this.clientInfoView = this.findCompByGroup('ClientInfoView')[0];
	
	
	
	/*
		
	//저장만을 위한 텍스트필드(항상 숨겨져있음)
	this.birthdayTxt = this.findCompByGroup('BirthdayLbl')[0];
	this.birthdayTxt.show(AComponent.INVISIBLE);
	
	//처음하기 눌렀을경우 직접화면에 보여지는 텍스트필드
	this.birthdayTxt2 = this.findCompByGroup('BirthdayLbl2')[0];
	
	//그리드의 이름 (주민등록번호 or 생년월일)
	this.birthdayTitle = this.findCompByGroup('BirthdayTitle')[0];
	
	this.birthdayTxt.setReadOnly(true);
	this.birthdayTxt2.setReadOnly(true);
	*/
	this.telnumTxt = this.findCompByGroup('TelnumTxt')[0];

	
	this.telCodeTxt = this.findCompByGroup('TelcodeTxt')[0];
	
	this.timerLbl = this.findCompByGroup('TimerLbl')[0];
	
	this.telcodesendBtn = this.findCompByGroup('TelcodesendBtngr')[0];
	
	this.validCode = true;
	
	
	
};

//비동기 응답 설정
FD0200_V02.prototype.onWillActive = function(reload)
{	
	AView.prototype.onWillActive.call(this, reload);	
	
	theApp.accNetManager.addQueryListener(this);
	
};

FD0200_V02.prototype.setInitialData = function()
{
	this.countDownTimer = false;
	
	//AToast.show('처음부터하기로 들어옴');
	
	this.setPhoneInfo();
	
	
	/* //기획 변경으로 제거 
	
	if (this.birthdayTxtString)
	{
		this.birthdayTxt2.setText(this.birthdayTxtString);
		this.birthdayTxt2.setReadOnly(true);	
		
	}
	else
		this.birthdayTxt2.setReadOnly(false);
	
	
	this.birthdayTitle.setText('생년월일');		
	this.birthdayTxt2.show(AComponent.VISIBLE);
	*/	
	this.bMode = true;
	
}


FD0200_V02.prototype.resetView = function()
{			
	this.timerLbl.setText("3:00");
	this.telCodeTxt.setText("");
	this.telcodesendBtn.setText('인증요청');
	if(this.timer) clearInterval(this.timer);
	
	this.setInitialData();
};

FD0200_V02.prototype.setPhoneInfo = function()
{
	if ( this.phoneInfo.noCode)
	{
		this.telDbx.selectItemByData(this.phoneInfo.noCode);
	}
			
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
		this.telnumTxt.setReadOnly(false);	
		this.telnumTxt.setText('');
	}
};

//인증번호받기버튼
FD0200_V02.prototype.onTelcodesendBtnClick = function(comp, info)
{
	this.telCodeTxt.setText('');
	var thisObj = this;
	if(!this.inputValidCheck()) return;
	
	//인증번호 받기
	this.sendSACMT723();
	
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
FD0200_V02.prototype.timeCountStart = function()
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



//인증번호 받기
FD0200_V02.prototype.sendSACMT723 = function()
{

	var thisObj = this;
	
	//this.birthdayTxtString = this.birthdayTxt2.getText(); 
			
	var telNumString  = this.telnumTxt.getText();
	
	
	var tempId = this.accNo; 
	thisObj.getContainer().sendData('SACMT723',
	
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
			"D1실명확인번호" : tempId, // 펀드앱의 경우 계좌번호
			"D1이동전화식별번호" : arr[0], 
			"D1이동전화국번호" : arr[1],
			"D1이동전화일련번호" : arr[2],
			"D1구분" : carrier
		};
		
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
			else if( 3582 == errCode || 3197 == errCode)
			{
			
				
				theApp.alert("휴대폰 정보(통신사, 번호)를 다시 확인하세요.",null, "알림");				
			}			
		}			
		else if( queryData)
		{
			//queryData.printQueryData();
		}
	});	//SACMT723 전송시 펑션키 5
	
};

FD0200_V02.prototype.getResult_SACMT723 = function(qData)
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
FD0200_V02.prototype.confirmUser = function(callback)
{
	var thisObj = this;
	
	
	if(this.timer) clearInterval(this.timer); // Timer stop
	
	var arr = this.cutPhoneNumber(this.telnumTxt.getText());
	
	/// *** 실명 확인번호를 계좌번호로 대체 >> 펀드 모바일앱만 적용 (SACMT728) ***
	var rmnno = this.accNo; //theApp.userInfo.getUserData('D1실명확인번호');
	
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
		
	},
	
	//outblock
	function(queryData)
	{
		afc.log("syl SACMT728");
		afc.log(queryData);
	});	//SACMT728 전송시 펑션키 5
	
};

FD0200_V02.prototype.getResult_SACMT728 = function(qData)
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

FD0200_V02.prototype.inputValidCheck = function()
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
	
	
	if ( this.additionalInputValidCheck != null && !this.additionalInputValidCheck ())
	{
		return false; 
	}
	

	return true;
};

FD0200_V02.prototype.agreeValidCheck = function()
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

FD0200_V02.prototype.cutPhoneNumber = function(number)
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


FD0200_V02.prototype.onTelnumTxtChange = function(comp, info)
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
	
//Hightlihgt 제거 
	var srchTxt = comp.getText();
	if(srchTxt.length > 0)
	{
		comp.removeClass('active');
	}
};


FD0200_V02.prototype.onTelnumTxtBlur = function(comp, info)
{
	comp.setText(Utils.makePhoneForm(comp.getText()));
};


FD0200_V02.prototype.onTelcodeTxtActionDown = function(comp, info)
{
	if(!this.validCode) {
		//this.telCodeTxt.addClass('TF_02');
		//this.telCodeTxt.removeClass('TF_05');
		this.validCode = true;
	}
};

FD0200_V02.prototype.onCancelBtn1Click = function(comp, info)
{
	this.telnumTxt.setText("");
	this.cancelBtn.$ele.hide();
};

FD0200_V02.prototype.onCheckBox9Click = function(comp, info)
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

FD0200_V02.prototype.onTelDbxSelect = function(comp, info)
{
	var carrier = Number(this.telDbx.getSelectedItemData());
	if(carrier > 4 && carrier < 8) {
		this.checkBox.setCheck(true);
	} else if(carrier >0 && carrier <4) {
		this.checkBox.setCheck(false);
	}
};

FD0200_V02.prototype.getTelDbx = function(){
	var carrier = this.telDbx.getSelectedItemData();
	if(this.checkBox.getCheck()) {
		if(carrier>0 && carrier<4) {
			carrier += 4;
		}
	}
	return carrier;
};


//비동기 응답 데이터 수신부 override
FD0200_V02.prototype.afterOutBlockData = function(queryData, groupName, trName, manager)
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
			if( 3582 != errCode && 3197 != errCode )
			{	
				///TODO: Error Message Alert 추가 필요 
				//theApp.getErrMsg(thisObj,this);	
				
			}
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
				///TODO: Error Message Alert 추가 필요 
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

FD0200_V02.prototype.onWillDeactive = function()
{
	this.resetView(); 
	AView.prototype.onWillDeactive.call(this);
	
	theApp.accNetManager.removeQueryListener(this);
	
};

FD0200_V02.prototype.onTelcodeTxtChange = function(comp, info)
{

	//Hightlihgt 제거 
	var srchTxt = comp.getText();
	if(srchTxt.length > 0)
	{
		comp.removeClass('active');
	}

};
