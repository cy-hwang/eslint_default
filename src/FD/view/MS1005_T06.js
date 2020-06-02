
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_T06()
{
	AView.call(this);

}
afc.extendsClass(MS1005_T06, AView);


MS1005_T06.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.btnView = this.findCompById('BtnView');	
	this.nameLbl = this.findCompById('NameLbl');	
	this.emailTxt = this.findCompById('Email1Txf');
	this.email2Txt = this.findCompById('Email2Txf');
	this.phoneTxt = this.findCompById('PhoneTxf');	
	this.nextBtn = this.findCompById('NextBtn');
	
	// 주소지(자택)
	this.postalTxt = this.findCompById('PostalTxf');	
	this.addr1Txt = this.findCompById('Addr1Txf');	
	this.addr2Txt = this.findCompById('Addr2Txf');
	this.addr2Txt.$ele.attr('maxlength', 50);
	this.tel1Txt = this.findCompById('TelTxf');	
	
	this.postalFind = this.findCompById('PostalFindBtn');
	
	this.cancelBtn = this.findCompById('CancelBtn');
	this.cancelBtn2 = this.findCompById('CancelBtn2');
	this.cancelBtn.$ele.hide();
	this.cancelBtn2.$ele.hide();
	
	this.validPostal = true;
	this.validAddr1 = true;
	this.validAddr2 = true;
	this.validTel = true;
	this.validEmail = true;
	this.validPhone = true;
	
};

MS1005_T06.prototype.onActive = function(reload)
{
	AView.prototype.onActive.call(this, reload);
	
	if(reload)
	{
		var thisObj = this;
		theApp.checkCreateDatetime( function(){
		thisObj.fillSavedData();
		});	
	}
	
};

MS1005_T06.prototype.fillSavedData = function()
{
	var usrData = theApp.userInfo.getUserData();
	
	this.nameLbl.setText(usrData['D1고객명']);	
		
	if( usrData['D1이메일주소']) {
		var temp = usrData['D1이메일주소'].split("@");
		this.emailTxt.setText(temp[0]);
		this.email2Txt.setText(temp[1]);
	}
	
	this.phoneTxt.setText(Utils.makePhoneForm(usrData['D1이동전화식별번호']+usrData['D1이동전화국번호']+usrData['D1이동전화일련번호']));
	this.phoneTxt.setReadOnly(true);
	
	// 자택
	this.postalTxt.setText(usrData['D1자택우편번호']);
	this.addr1Txt.setText(usrData['D1자택동이상주소']);
	this.addr2Txt.setText(usrData['D1자택동이하주소2']);
	if( usrData['D1자택전화지역번호'])
		this.tel1Txt.setText(usrData['D1자택전화지역번호']+'-'+usrData['D1자택전화국번호']+'-'+usrData['D1자택전화일련번호']);
	
	if( !usrData['D1자택우편번호'])
	{
		if( '1' == theApp.userInfo.getUserData('D1기존고객여부'))
		{
			this.send_SACMQ108();
			return;
		}
	}
};


MS1005_T06.prototype.onBeforeBtnClick = function(comp, info)
{
	this.getContainer().beforeView();

};

//다음버튼클릭
MS1005_T06.prototype.onNextBtnClick = function(comp, info)
{
	//페이지들의 유효성 체크
	var resultVal = this.CheckValidPage();
	if(resultVal)
	{
		AToast.show(resultVal);
		this.ExpressInvalid();
		return;
	}
	
	var thisObj = this;
	setTimeout(function() {
				thisObj.saveInfoQry();
	}, 100);

};

MS1005_T06.prototype.onPostalFindBtnClick = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/MS1005_W15.lay','postalWindow');
	win.openAsDialog(this, '100%', '100%');
};

MS1005_T06.prototype.onWindowResult = function(result, windowObj)
{
	if(windowObj.containerId == 'postalWindow'){
		if(!result) return;

		this.postalTxt.setText(result[0]);
		this.addr1Txt.setText(result[1]);
		this.addr2Txt.setText(result[2]);
	}
};

MS1005_T06.prototype.CheckValidPage = function()
{
	if(!this.postalTxt.getText()) {
		this.validPostal = false;
		return '우편번호를 입력해주세요.';
	}
	if(!this.addr1Txt.getText()) {
		this.validAddr1 = false;
		return '기본주소를 입력해주세요.';
	}
	if(!this.addr2Txt.getText()) {
		this.validAddr2 = false;
		return '상세주소를 입력해주세요.';
	}
	//fourierx
	/*if(!this.tel1Txt.getText())
	{
		this.validTel = false;
		return '전화번호를 입력해주세요.';
	}*/
	if(this.tel1Txt.getText() && !Utils.validPhone(this.tel1Txt.getText())){
		this.validTel = false;
		return '전화번호 형식이 잘못되었습니다.';

	}
	/*
	if(!Utils.validPhone(this.tel1Txt.getText())) {
		this.validTel = false;
		return '전화번호 형식이 잘못되었습니다.';
	}*/
	//fourierx
	/*
	if(!this.emailTxt.getText() || !this.email2Txt.getText()) {
		this.validEmail = false;
		return '이메일을 입력해주세요.';
	}*/
	
	if((this.emailTxt.getText() && !this.email2Txt.getText()) ||
		(this.emailTxt.getText() && !this.email2Txt.getText())){
		this.validEmail = false;
		return '이메일을 입력해주세요.';
	}
	if(this.emailTxt.getText() && this.email2Txt.getText()){
		if(!Utils.validEmail(this.emailTxt.getText()+'@'+this.email2Txt.getText())) {
			this.validEmail = false;
			return '이메일 형식이 잘못되었습니다.';
		}
	}

	if(!this.phoneTxt.getText()) {
		this.validPhone = false;
		this.phoneTxt.setReadOnly(false);
		return '핸드폰 번호를 입력해주세요.';
	}
	if(!Utils.validPhone(this.phoneTxt.getText())) {
		this.validPhone = false;
		this.phoneTxt.setReadOnly(false);
		return '핸드폰 번호 형식이 잘못되었습니다.';	
	}
};




MS1005_T06.prototype.ExpressInvalid = function() {
	if(!this.validPostal) {
		this.postalTxt.removeClass('TF_01');
		this.postalTxt.addClass('TF_03');
	}

	if(!this.validAddr1) {
		//기본주소는 우편번호 입력 시 자동 입력
	}

	if(!this.validAddr2) {
		this.addr2Txt.removeClass('TF_02');
		this.addr2Txt.addClass('TF_03');
	}

	if(!this.validTel) {
		this.tel1Txt.removeClass('TF_02');
		this.tel1Txt.addClass('TF_03');
	}

	if(!this.validEmail) {
		this.emailTxt.removeClass('TF_02');
		this.email2Txt.removeClass('TF_02');
		this.emailTxt.addClass('TF_03');
		this.email2Txt.addClass('TF_03');
	}

	if(!this.validPhone) {
		this.phoneTxt.removeClass('TF_02');
		this.phoneTxt.addClass('TF_03');
	}
};

MS1005_T06.prototype.saveInfoQry = function()
{
	var thisobj = this;
	
	var arr = this.tel1Txt.getText().split('-');			// 주소지
	var arr2 = this.phoneTxt.getText().split('-');			// 이동전화
	
	QryRequest.request('SACMT632',
		function(queryData)
		{
			var inBlock1 = queryData.getBlockData('InBlock1');
			inBlock1[0] =
			{
				"D1처리구분" : 4,
				"D1실명확인번호" : theApp.userInfo.getUserData('D1실명확인번호암호화'),
				"D1고객명" : theApp.userInfo.getUserData('D1고객명'),
				"D1자택우편번호" : thisobj.postalTxt.getText(),
				"D1자택동이상주소" : thisobj.addr1Txt.getText().replace(/[\n\r]/g, ' '),
				"D1자택동이하주소2" : thisobj.addr2Txt.getText().replace(/[\n\r]/g, ' '),
				"D1자택전화지역번호" : arr[0],
				"D1자택전화국번호" : arr[1],
				"D1자택전화일련번호" : arr[2],
				"D1이메일주소" : thisobj.emailTxt.getText()+'@'+thisobj.email2Txt.getText(),
				"D1이동전화식별번호" : arr2[0],
				"D1이동전화국번호" : arr2[1],
				"D1이동전화일련번호" : arr2[2],
				"D1휴대폰지역번호" : arr2[0],
				"D1휴대폰국번호" : arr2[1],
				"D1휴대폰일련번호" : arr2[2]	
							
			};
			queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
		},
		function(queryData)
		{
			var errCode = this.getLastError('errCode');
			if( errCode >= 1000)
			{	
				theApp.getErrMsg(thisobj,this);
			}
			else if(queryData)
			{				
				theApp.userInfo.setUserData("D1자택우편번호", thisobj.postalTxt.getText());
				theApp.userInfo.setUserData("D1자택동이상주소", thisobj.addr1Txt.getText().replace(/[\n\r]/g, ' '));
				theApp.userInfo.setUserData("D1자택동이하주소2", thisobj.addr2Txt.getText().replace(/[\n\r]/g, ' '));
				theApp.userInfo.setUserData("D1자택전화지역번호", arr[0]);
				theApp.userInfo.setUserData("D1자택전화국번호", arr[1]);
				theApp.userInfo.setUserData("D1자택전화일련번호", arr[2]);
				
				theApp.userInfo.setUserData("D1이메일주소", thisobj.emailTxt.getText()+'@'+thisobj.email2Txt.getText());
				theApp.userInfo.setUserData("D1이동전화식별번호", arr2[0]);
				theApp.userInfo.setUserData("D1이동전화국번호", arr2[1]);
				theApp.userInfo.setUserData("D1이동전화일련번호", arr2[2]);				
				
				theApp.userInfo.setUserData("D1휴대폰지역번호", arr2[0]);
				theApp.userInfo.setUserData("D1휴대폰국번호", arr2[1]);
				theApp.userInfo.setUserData("D1휴대폰일련번호", arr2[2]);				
				
				//queryData.printQueryData();
				thisobj.getContainer().nextView();
			}
	});
};

MS1005_T06.prototype.onTel1TxtChange = function(comp, info)
{
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
	var telTxt = comp.getText();
	
	//삭제 버튼 기능
	if(telTxt.length == 0) {
		this.cancelBtn.$ele.hide();
	}
	else if(telTxt.length>0) {
		this.cancelBtn.$ele.show();	
	}
};

MS1005_T06.prototype.onPhoneTxtChange = function(comp, info)
{
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
	
	var phoneTxt = comp.getText();
};

//기존 고객 호출
MS1005_T06.prototype.send_SACMQ108 = function()
{	
	var thisObj = this;
	
	QryRequest.request('SACMQ108',
		function(queryData)
		{
			var inBlock1 = queryData.getBlockData('InBlock1')[0];		
			inBlock1['D1고객번호'] = theApp.userInfo.getUserData('D1고객번호');
		},
		
		function(queryData)
		{		
			var errCode = this.getLastError('errCode');
			if( errCode >= 1000 )
			{
				theApp.getErrMsg(thisObj,this);
				//alert(this.printLastError());
			}
			else if( queryData)
			{
				//queryData.printQueryData();				
				
				
				var outBlock = queryData.getBlockData('OutBlock2')[0];	//자택		
				var outBlock2 = queryData.getBlockData('OutBlock2')[2];	//email
				var outBlock3 = queryData.getBlockData('OutBlock2')[3];	//기타(전자매체등)
	
			
				// 자택주소로 저장되어 있는 경우
				if( outBlock['D1우편번호'])	
				{
					thisObj.postalTxt.setText(outBlock['D1우편번호']);
					thisObj.addr1Txt.setText(outBlock['D1동이상주소']);
					thisObj.addr2Txt.setText(outBlock['D1동이하주소']);
					thisObj.tel1Txt.setText(outBlock['D1전화지역번호']+'-'+outBlock['D1전화국번호']+'-'+outBlock['D1전화일련번호']);
                   
				   	//fourierx
                    if(thisObj.tel1Txt.getText() == "--")
                        thisObj.tel1Txt.setText("");
				}
						
				//email 주소
				if( outBlock2['D1동이상주소']) {
					var temp = outBlock2['D1동이상주소'].split("@");
					thisObj.emailTxt.setText(temp[0]);
					thisObj.email2Txt.setText(temp[1]);
				}
				//전화번호
				if( outBlock2['D1전화지역번호'])
					thisObj.phoneTxt.setText(Utils.makePhoneForm(outBlock2['D1전화지역번호']+outBlock2['D1전화국번호']+outBlock2['D1전화일련번호']));
			}
		});
};

//전화번호 validation 검증
MS1005_T06.prototype.onTextField8Blur = function(comp, info)
{
	comp.setText(Utils.makePhoneForm(comp.getText()));
	if(!Utils.validPhone(this.tel1Txt.getText())) return AToast.show('전화번호 형식이 잘못되었습니다.');
	this.emailTxt.$ele.focus();
};

MS1005_T06.prototype.onPhoneTxfBlur = function(comp, info)
{
	comp.setText(Utils.makePhoneForm(comp.getText()));
	if(!Utils.validPhone(this.phoneTxt.getText())) return '핸드폰 번호 형식이 잘못되었습니다.';	
};

MS1005_T06.prototype.onCancelBtn2Click = function(comp, info)
{
	this.phoneTxt.setText("");
	this.cancelBtn2.$ele.hide();
};

MS1005_T06.prototype.onCancelBtn1Click = function(comp, info)
{
	this.tel1Txt.setText("");
	this.cancelBtn.$ele.hide();
};

MS1005_T06.prototype.oncomp_PostalTxfActionDown = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/MS1005_W15.lay','postalWindow');
	win.openAsDialog(this, '100%', '100%');
};

MS1005_T06.prototype.onPostalTxfActionDown = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/MS1005_W15.lay','postalWindow');
	win.openAsDialog(this, '100%', '100%');
	
	if(!this.validPostal) {
		this.postalTxt.addClass('TF_01');
		this.postalTxt.removeClass('TF_03');
		this.validPostal = true;
	}
};

MS1005_T06.prototype.onAddr2TxfActionDown = function(comp, info)
{
	if(!this.validAddr2) {
		this.addr2Txt.addClass('TF_02');
		this.addr2Txt.removeClass('TF_03');
		this.validAddr2 = true;
	}
};

MS1005_T06.prototype.onTelTxfActionDown = function(comp, info)
{
	if(!this.validTel ) {
		this.tel1Txt.addClass('TF_02');
		this.tel1Txt.removeClass('TF_03');
		this.validTel = true;
	}
};

MS1005_T06.prototype.onEmail1TxfActionDown = function(comp, info)
{
	if(!this.validEmail ) {
	this.emailTxt.addClass('TF_02');
	this.emailTxt.removeClass('TF_03');
	this.email2Txt.addClass('TF_02');
	this.email2Txt.removeClass('TF_03');		
	this.validEmail = true;
	}
};

MS1005_T06.prototype.onPhoneTxfActionDown = function(comp, info)
{
	if(!this.validPhone ) {
		this.phoneTxt.addClass('TF_02');
		this.phoneTxt.removeClass('TF_03');
		this.validPhone = true;
	}
};
