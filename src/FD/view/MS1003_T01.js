
/**
Constructor
Do not call Function in Constructor.
*/
function MS1003_T01()
{
	AView.call(this);

	//TODO:edit here
	
	this.timer = null;
	this.phoneInfo =
	{
		noCode : '',
		noName : '',
		phoneNm : ''
	};
}
afc.extendsClass(MS1003_T01, AView);


MS1003_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.telDbx = this.findCompByGroup('TelDbx')[0];
	var telArr = [{text:'SKT',data:'1'},{text:'KT',data:'2'},{text:'LGU+',data:'3'},{text:'SKT알뜰폰',data:'5'},{text:'KT알뜰폰',data:'6'},{text:'LGU+알뜰폰',data:'7'}];
	
	for(var i=0;i<telArr.length;i++){
		this.telDbx.addItem(telArr[i].text,telArr[i].data);
	}
	
	this.cancelBtn = this.findCompById('CancelBtn');
	this.cancelBtn.$ele.hide();
	
	this.agree1Cbx = this.findCompByGroup('AgreeCbxGr')[0];
	this.agree2Cbx = this.findCompByGroup('AgreeCbxGr')[1];
	this.agree3Cbx = this.findCompByGroup('AgreeCbxGr')[2];
	this.agree4Cbx = this.findCompByGroup('AgreeCbxGr')[3];
	
	this.agreeallCbxGr = this.findCompByGroup('AgreeallCbxGr')[0];
	this.clientInfoView = this.findCompByGroup('ClientInfoView')[0];
		
		
	//저장만을 위한 텍스트필드(항상 숨겨져있음)
	this.birthdayTxt = this.findCompByGroup('BirthdayLbl')[0];
	this.birthdayTxt.show(AComponent.INVISIBLE);
	
	//처음하기 눌렀을경우 직접화면에 보여지는 텍스트필드
	this.birthdayTxt2 = this.findCompByGroup('BirthdayLbl2')[0];
	
	//그리드의 이름 (주민등록번호 or 생년월일)
	this.birthdayTitle = this.findCompByGroup('BirthdayTitle')[0];
	
	this.birthdayTxt.setReadOnly(true);
	this.birthdayTxt2.setReadOnly(true);

	this.telnumTxt = this.findCompByGroup('TelnumTxt')[0];
	this.telCodeTxt = this.findCompByGroup('TelcodeTxt')[0];
	
	this.timerLbl = this.findCompByGroup('TimerLbl')[0];
	
	// 2020.03.12. 신분증촬영단계에서 촬영된 이름을 휴대폰본인확인단계에 보여주기 위해 세팅함.
	this.txtName = this.findCompById('TxtName');
	this.txtName.setReadOnly(true);
	
	this.telcodesendBtn = this.findCompByGroup('TelcodesendBtngr')[0];
	
	this.validCode = true;
	
	var thisObj = this;
	AppManager.getPhoneInfo(function(result){
		
		//Android 및 본가동 버전 전화번호 수정 불가 처리
		if(result && false) { //적용여부 고민중 - CAPE는 적용 안 되어 있음
		//if(result && Define.RELEASE) {
			thisObj.telnumTxt.setReadOnly(true);
			thisObj.telnumTxt.addClass('TF_01_disable');
		}
		thisObj.phoneInfo = result;
		thisObj.setPhoneInfo();
	});
	
};

MS1003_T01.prototype.setInitialData = function()
{
	this.countDownTimer = false;
	
	this.birthdayTitle.setText('생년월일');		
 	this.birthdayTxt2.setText(theApp.userInfo.getUserData('D1생년월일'));
	this.birthdayTxt2.show(AComponent.VISIBLE);
	
	// 2020.03.12. 신분증촬영단계에서 촬영된 이름을 휴대폰본인확인단계에 세팅함.
	this.txtName.setText(theApp.userInfo.getUserData('D1고객명'));
	
 	this.birthdayTxt.setText(theApp.userInfo.getUserData('D1실명확인번호암호화'));
	this.telcodesendBtn.setText('인증요청');
}


MS1003_T01.prototype.resetView = function()
{
	this.timerLbl.setText("3:00");
	this.telCodeTxt.setText("");
	this.telcodesendBtn.setText('인증요청');
	if(this.timer) clearInterval(this.timer);
	
	this.setInitialData();
};

MS1003_T01.prototype.setPhoneInfo = function()
{
	this.telDbx.selectItemByData(this.phoneInfo.noCode);
			
	if(this.phoneInfo.phoneNm)
	{
		if(this.phoneInfo.phoneNm.substring(0,1) == '+')
		{
			this.phoneInfo.phoneNm = ('0'+this.phoneInfo.phoneNm.replace('+82', ''));
		}
		var phoneLen = this.phoneInfo.phoneNm.length;
		this.telnumTxt.setText(this.phoneInfo.phoneNm.substring(0, 3)+'-'+this.phoneInfo.phoneNm.substring(3, phoneLen-4)+'-'+this.phoneInfo.phoneNm.substring(phoneLen - 4));
	}

	else this.telnumTxt.setText('');
};

MS1003_T01.prototype.onAgree1BtnClick = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/MS1005_W12.lay','agree1Window');
	win.data = ['http://cert.vno.co.kr/app/agree/app_agree_m_skm.jsp?gubun=01', 
				'http://cert.vno.co.kr/app/agree/app_agree_m_ktm.jsp?gubun=01',
				'http://cert.vno.co.kr/app/agree/app_agree_m_lgm.jsp?gubun=01'
				];
	win.titleText = '개인정보 수집/이용 동의';
	win.openAsDialog(this);
};

MS1003_T01.prototype.onAgree2BtnClick = function(comp, info)
{

	var win = AWindow.createWindow('FD/window/MS1005_W12.lay','agree2Window');
	win.data = ['http://cert.vno.co.kr/app/agree/app_agree_m_skm.jsp?gubun=02', 
				'http://cert.vno.co.kr/app/agree/app_agree_m_ktm.jsp?gubun=02',
				'http://cert.vno.co.kr/app/agree/app_agree_m_lgm.jsp?gubun=02'
				];
	win.titleText = '고유식별정보 처리 동의';
	win.openAsDialog(this);
};

MS1003_T01.prototype.onAgree3BtnClick = function(comp, info)
{

	var win = AWindow.createWindow('FD/window/MS1005_W12.lay','agree3Window');
	win.data = ['http://cert.vno.co.kr/app/agree/app_agree_m_skm.jsp?gubun=03', 
				'http://cert.vno.co.kr/app/agree/app_agree_m_ktm.jsp?gubun=03',
				'http://cert.vno.co.kr/app/agree/app_agree_m_lgm.jsp?gubun=03'
				];
	win.titleText = '통신사 이용약관 동의';
	win.openAsDialog(this);
};

MS1003_T01.prototype.onAgree4BtnClick = function(comp, info)
{

	var win = AWindow.createWindow('FD/window/MS1005_W12.lay','agree4Window');
	win.data = ['http://cert.vno.co.kr/app/agree/app_agree_m_skm.jsp?gubun=04', 
				'http://cert.vno.co.kr/app/agree/app_agree_m_ktm.jsp?gubun=04',
				'http://cert.vno.co.kr/app/agree/app_agree_m_lgm.jsp?gubun=04'
				];
	win.titleText = '서비스 이용약관 동의';
	win.openAsDialog(this);
};
//인증번호받기버튼
MS1003_T01.prototype.onTelcodesendBtnClick = function(comp, info)
{
	this.telCodeTxt.setText('');
	var thisObj = this;
 	if(!this.inputValidCheck()) return;
	
	//인증번호 받기
	this.sendSACMT723();
	AppManager.receiveSMS('.*메리츠자산운용.*', function(number)
	{
		if(number != null) {
			thisObj.telCodeTxt.setText(number);
		}
	});
};

//인증번호 타임 카운트
MS1003_T01.prototype.timeCountStart = function()
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



MS1003_T01.prototype.onAgreeallCbxClick = function(comp, info)
{
	if(comp.getCheck()){
		this.agree1Cbx.setCheck(true);
		this.agree2Cbx.setCheck(true);
		this.agree3Cbx.setCheck(true);
		this.agree4Cbx.setCheck(true);
	}else{
		this.agree1Cbx.setCheck(false);
		this.agree2Cbx.setCheck(false);
		this.agree3Cbx.setCheck(false);
		this.agree4Cbx.setCheck(false);
	}
};

MS1003_T01.prototype.onAgreeCbxClick = function(comp, info)
{
	if(this.agree1Cbx.getCheck()&this.agree2Cbx.getCheck()&this.agree3Cbx.getCheck()&this.agree4Cbx.getCheck()){
		this.agreeallCbxGr.setCheck(true);
	}else{
		this.agreeallCbxGr.setCheck(false);	
	}
	
};

//인증번호 받기
MS1003_T01.prototype.sendSACMT723 = function()
{
	var thisObj = this;
	
	var arr = this.cutPhoneNumber(this.telnumTxt.getText());
 	var tempId = theApp.userInfo.getUserData('D1실명확인번호암호화');

	
	QryRequest.request('SACMT723',
	
	function(queryData)
	{
		var inBlock1 = queryData.getBlockData('InBlock1');
		var carrier = thisObj.telDbx.getSelectedItemData();
		inBlock1[0] =
		{
			"D1실명확인번호" : tempId,
			"D1이동전화식별번호" : arr[0],
			"D1이동전화국번호" : arr[1],
			"D1이동전화일련번호" : arr[2],
			"D1구분" : carrier
		};
 		queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, AQuery.OCR);
	},
	
	function(queryData)
	{
		var errCode = this.getLastError('errCode');		
		if(errCode>=1000)
		{
			if( 8000 == errCode )
			{
				var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');			
				win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">주민등록번호를 다시 확인하세요.</span>';
				win.openAsDialog(thisObj);
			}			
			else if( 3582 == errCode || 3197 == errCode)
			{
			
				// 2020.03.12. 메리츠자산운용에서 에러메시지 내용 변경을 요청함.
				/*
				var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');			
				win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">휴대폰 정보(통신사, 번호)를 다시 확인하세요.</span>';
				win.openAsDialog(thisObj);
				*/
				/*var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');			
				win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">본인명의의 핸드폰으로만 인증이 가능합니다.</br></br>앞 단계에서 신분증 촬영하실 때 고객님의 이름과 생년월일이 정확하게 인식이 되지 않은 것으로 보입니다.</br></br>상단의 뒤로 가기 버튼을 클릭하여 다시 신분증 촬영을 진행해주시기 바랍니다.</span>';
				win.openAsDialog(thisObj);*/
				
				// MS1005_W05 화면은 지정된 사이즈(430,450)이므로 공통 팝업 알림함수를 사용함.
				theApp.alert("본인명의의 핸드폰으로만 인증이</br>가능합니다.</br></br>앞 단계에서 신분증 촬영하실 때 고객님의 이름과 생년월일이 정확하게 인식이 되지 않은 것으로 보입니다.</br></br>상단의 뒤로 가기 버튼을 클릭하여 다시 신분증 촬영을 진행해주시기 바랍니다.",null, "알림");
				
			}			
		}			
		else if( queryData)
		{
			//queryData.printQueryData();
		}
	}, 
	
	//lazyFunc
	//계정계 지연처리 TR응답
	function (queryData)
	{
		var errCode = this.getLastError('errCode');
		//비정상(오류)
		if(errCode>=1000)
		{
			if( 3582 != errCode && 3197 != errCode )
				theApp.getErrMsg(thisObj,this);
		}	
		else if(queryData) 
		{
			//queryData.printQueryData();
			thisObj.getResult_SACMT723(queryData);
		}
	
	}, '5');	//SACMT723 전송시 펑션키 5
	
};

MS1003_T01.prototype.getResult_SACMT723 = function(qData)
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
MS1003_T01.prototype.confirmUser = function(callback)
{
	var thisObj = this;
	
 	var rmnno = theApp.userInfo.getUserData('D1실명확인번호암호화');
	var arr = this.cutPhoneNumber(this.telnumTxt.getText());
	
	QryRequest.request('SACMT728',
	
	//inblock
	function(queryData)
	{
		var inBlock1 = queryData.getBlockData('InBlock1');
		inBlock1[0] =
		{
			"D1실명확인번호" : rmnno,
			"D1계좌번호" : thisObj.telCodeTxt.getText(),	//인증번호
			"D1이동전화식별번호" : arr[0],
			"D1이동전화국번호" : arr[1],
			"D1이동전화일련번호" : arr[2]
		};		
 		queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, AQuery.OCR);
	},
	
	//outblock
	function(queryData)
	{
	}, 
	
	//lazy callback
	function(queryData)
	{
		var errCode = this.getLastError('errCode');
		
		//비정상(오류)
		if(errCode>=1000)
		{
			theApp.getErrMsg(thisObj,this);
			callback.call(thisObj, false);			
		}
	
		else if(queryData) 
		{
			//queryData.printQueryData();
			
			if( thisObj.getResult_SACMT728(queryData))
			{
				theApp.getUserInfo(rmnno, function(success)
				{
					theApp.userInfo.setUserData("D1이동전화식별번호", arr[0]);
					theApp.userInfo.setUserData("D1이동전화국번호", arr[1]);
					theApp.userInfo.setUserData("D1이동전화일련번호", arr[2]);
					
					callback.call(thisObj, success);
				});
			}
		}
		
	}, '5');	//SACMT728 전송시 펑션키 5
	
};

MS1003_T01.prototype.getResult_SACMT728 = function(qData)
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

MS1003_T01.prototype.inputValidCheck = function()
{
	if(!this.telDbx.getSelectedItemData())
	{
		AToast.show('통신사를 선택해주세요.');
		return false;
	}
	
	if(!this.cutPhoneNumber(this.telnumTxt.getText())) 
	{
		AToast.show('정확한 핸드폰 번호를 입력해주세요.');
		return false;
	}
	
	if(!Utils.validPhone(this.telnumTxt.getText()))
	{
		AToast.show('핸드폰 번호 형식이 잘못되었습니다.');
		return false;
	}	
	
	if( !this.agreeallCbxGr.getCheck())
	{
		AToast.show('휴대폰 본인인증 전체 동의해주세요.');
		return false;
	}
	
	return true;
};

MS1003_T01.prototype.agreeValidCheck = function()
{
	if(this.agree1Cbx.getCheck() && this.agree2Cbx.getCheck() && 
		this.agree3Cbx.getCheck() && this.agree4Cbx.getCheck()) 
	{
		var telCodeLen = this.telCodeTxt.getText().length;
		if( telCodeLen == 0 )
		{
			AToast.show('인증번호를 입력해주세요.');
			this.telCodeTxt.removeClass('TF_02');
			this.telCodeTxt.addClass('TF_03');
			this.validCode = false;
			return false;
		}
		else if( telCodeLen < 6 )
		{
			AToast.show('인증번호 형식이 잘못되었습니다.');
			this.telCodeTxt.removeClass('TF_02');
			this.telCodeTxt.addClass('TF_03');
			this.validCode = false;
			return false;
		}
		
		if( "0:00" == this.timerLbl.getText())
		{
			AToast.show('제한시간이 지났습니다.\n다시 한번 인증요청 버튼을 눌러 재인증을 진행하여 주시기 바랍니다.');
			this.telCodeTxt.removeClass('TF_02');
			this.telCodeTxt.addClass('TF_03');
			this.validCode = false;
			return false;
		}
		
		return true;
	}
	else 
	{
		AToast.show('약관동의가 필요합니다.');
		return false;
	}
};

MS1003_T01.prototype.cutPhoneNumber = function(number)
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


MS1003_T01.prototype.onTelnumTxtChange = function(comp, info)
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

MS1003_T01.prototype.onBirthdayTxtChange = function(comp, info)
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

MS1003_T01.prototype.onBirthdayBackChange = function(comp, info)
{
	var thisObj = this;
	
	if(comp.getText().length == 7)
	{
		var temp = this.birthdayBack.getCipherData();
		SecurePadManager.cipherToText(temp, function(result)
		{	
			thisObj.birthdayTxt.setText(thisObj.birthdayForward.getText()+'-'+result);
		});
	}else{
		this.birthdayTxt.setText('');
	}

};

MS1003_T01.prototype.onTelnumTxtBlur = function(comp, info)
{
	comp.setText(Utils.makePhoneForm(comp.getText()));
};


MS1003_T01.prototype.onTelcodeTxtActionDown = function(comp, info)
{
	if(!this.validCode) {
		this.telCodeTxt.addClass('TF_02');
		this.telCodeTxt.removeClass('TF_03');
		this.validCode = true;
	}
};

MS1003_T01.prototype.onCancelBtn1Click = function(comp, info)
{
	this.telnumTxt.setText("");
	this.cancelBtn.$ele.hide();
};

MS1003_T01.prototype.getTelDbx = function(){
	var carrier = this.telDbx.getSelectedItemData();
	return carrier;
};