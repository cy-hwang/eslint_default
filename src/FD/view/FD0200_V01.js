/**
Constructor
Do not call Function in Constructor.
*/
function FD0200_V01()
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
	
	this.accNo  = null; 
	this.confirmUserCallback = null; 
	this.birthdayTxt = null;
}
afc.extendsClass(FD0200_V01, AView);


FD0200_V01.prototype.init = function(context, evtListener)
{
			
	AView.prototype.init.call(this, context, evtListener);		
	var thisObj = this; 
	this.agreeCheckView = this.findCompById('AgreeCheckView');		
	
	
	this.agree1Cbx = this.findCompByGroup('AgreeCbxGr')[0];
	this.agree2Cbx = this.findCompByGroup('AgreeCbxGr')[1];
	this.agree3Cbx = this.findCompByGroup('AgreeCbxGr')[2];
	this.agree4Cbx = this.findCompByGroup('AgreeCbxGr')[3];
	this.checkBox = this.findCompById('CheckBox9');
	
	this.agreeallCbxGr = this.findCompByGroup('AgreeallCbxGr')[0];
	this.clientInfoView = this.findCompByGroup('ClientInfoView')[0];
	
	
	this.smsSendView =this.findCompById('smsSendView');		
	this.smsSendloadView = this.smsSendView.loadView; 
	

	
	var inputValidCheck = this.smsSendloadView.inputValidCheck ;
	this.smsSendloadView.additionalInputValidCheck = function ()
	{
		if( !thisObj.agreeallCbxGr.getCheck())
		{
			AToast.show('휴대폰 본인인증 전체 동의해주세요.');
			return false;
		}
		else
			return true; 
	}
	 
	
	

		
	this.validCode = true;
	
	
	
};


FD0200_V01.prototype.resetView = function()
{	
	this.smsSendloadView.accNo  = this.accNo ; 	
	this.smsSendloadView.birthdayTxtString  = this.birthdayTxt ; 	
	this.smsSendloadView.phoneInfo.phoneNm = this.phoneInfo.phoneNm; 
	this.smsSendloadView.phoneInfo.noCode = this.phoneInfo.noCode;	
	this.smsSendloadView.resetView();
};


FD0200_V01.prototype.onAgree1BtnClick = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/FD0200_W02.lay','agree1Window');
	win.data = ['http://cert.vno.co.kr/app/agree/app_agree_m_skm.jsp?gubun=01', 
				'http://cert.vno.co.kr/app/agree/app_agree_m_ktm.jsp?gubun=01',
				'http://cert.vno.co.kr/app/agree/app_agree_m_lgm.jsp?gubun=01'
				];
	win.titleText = '개인정보 수집/이용 동의';
	win.openAsDialog(this);
};

FD0200_V01.prototype.onAgree2BtnClick = function(comp, info)
{

	var win = AWindow.createWindow('FD/window/FD0200_W02.lay','agree2Window');
	win.data = ['http://cert.vno.co.kr/app/agree/app_agree_m_skm.jsp?gubun=02', 
				'http://cert.vno.co.kr/app/agree/app_agree_m_ktm.jsp?gubun=02',
				'http://cert.vno.co.kr/app/agree/app_agree_m_lgm.jsp?gubun=02'
				];
	win.titleText = '고유식별정보 처리 동의';
	win.openAsDialog(this);
};

FD0200_V01.prototype.onAgree3BtnClick = function(comp, info)
{

	var win = AWindow.createWindow('FD/window/FD0200_W02.lay','agree3Window');
	win.data = ['http://cert.vno.co.kr/app/agree/app_agree_m_skm.jsp?gubun=03', 
				'http://cert.vno.co.kr/app/agree/app_agree_m_ktm.jsp?gubun=03',
				'http://cert.vno.co.kr/app/agree/app_agree_m_lgm.jsp?gubun=03'
				];
	win.titleText = '통신사 이용약관 동의';
	win.openAsDialog(this);
};

FD0200_V01.prototype.onAgree4BtnClick = function(comp, info)
{

	var win = AWindow.createWindow('FD/window/FD0200_W02.lay','agree4Window');
	win.data = ['http://cert.vno.co.kr/app/agree/app_agree_m_skm.jsp?gubun=04', 
				'http://cert.vno.co.kr/app/agree/app_agree_m_ktm.jsp?gubun=04',
				'http://cert.vno.co.kr/app/agree/app_agree_m_lgm.jsp?gubun=04'
				];
	win.titleText = '서비스 이용약관 동의';
	win.openAsDialog(this);
};


FD0200_V01.prototype.onAgreeallCbxClick = function(comp, info)
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

FD0200_V01.prototype.onAgreeCbxClick = function(comp, info)
{
	if(this.agree1Cbx.getCheck()&this.agree2Cbx.getCheck()&this.agree3Cbx.getCheck()&this.agree4Cbx.getCheck()){
		this.agreeallCbxGr.setCheck(true);
	}else{
		this.agreeallCbxGr.setCheck(false);	
	}
	
};


//사용자 최종확인
FD0200_V01.prototype.confirmUser = function(callback)
{
	var mView = this.smsSendloadView; 
		//약관동의 완료시
	if(mView.agreeValidCheck() && mView.inputValidCheck() )
	{
	
		this.phoneInfo.phoneNm= mView.phoneInfo.phoneNm;				 
		this.phoneInfo.noCode= mView.phoneInfo.noCode ; 
		this.birthdayTxt = mView.birthdayTxtString ; 
	
		mView.confirmUser(callback);
	}
};






