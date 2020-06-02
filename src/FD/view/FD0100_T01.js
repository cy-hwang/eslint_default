
/**
Constructor
Do not call Function in Constructor.
*/
function FD0100_T01()
{
	AView.call(this);
	
	this.verInfo = null;
	this.infoGrd = null;
	this.saveId = null;
	this.hideId = null;
	this.savePw = null;
}
afc.extendsClass(FD0100_T01, AView);


FD0100_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.verInfo = this.findCompById('VER_INFO_Lbl');
	this.infoGrd = this.findCompById('InfoGrd');
	this.saveId  = this.findCompByGroup('CheckGrp')[0];
	this.hideId  = this.findCompByGroup('CheckGrp')[1];
	this.savePw  = this.findCompByGroup('CheckGrp')[2];
	
	this.setAppSystemInfo(); //단말기 시스템 정보 조회 저장
	this.setAppInfos(); 

	this.initAttr();
};

//액티브 로딩중 이벤트
FD0100_T01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);

};

//단말기 시스템 정보 조회 저장
FD0100_T01.prototype.setAppSystemInfo = function()
{
	
	var sInfo = theApp.systemInfo;
	
	if (afc.isSimulator) afc.log(sInfo);
	
	//단말기 종류
	this.infoGrd.setCellText(2, 1, sInfo.osType);	//setCellText(rowIdx, colIdx, txt)
	//모델번호
	this.infoGrd.setCellText(3, 1, sInfo.modelName);
	//OS 버전
	this.infoGrd.setCellText(4, 1, sInfo.osVer);
	//APP 버전
	this.infoGrd.setCellText(5, 1, sInfo.appVer);
	//Webview 버전_IOS 없음
	if(afc.isIos)
	{
		document.getElementById('webview-version').style.display='none';
	}
	else
	{
		this.infoGrd.setCellText(6, 1, afc.ChromeVer);
	}
	//APP 이름
	this.infoGrd.setCellText(8, 1, sInfo.appName);
	
	this.verInfo.setText(DEFINE_VERSION);
};

//각 컴포넌트의 속성값 초기화
FD0100_T01.prototype.initAttr = function()
{
	this.verInfo.setAttr('data-confKey', 'VER_INFO');
	
	/*
	this.autoClsBtn.setAttr('data-confKey', 'ATCLS_ONOFF');
	
	this.tikerBtn.setAttr('data-confKey', 'TIKER_ONOFF');

	this.popUpBtn.setAttr('data-confKey', 'PRE_POPUP_ONOFF');
	
	this.popUpBtn2.setAttr('data-confKey', 'FUT_POPUP_ONOFF');
	
	this.pushBtn.setAttr('data-confKey', 'PUSH_ONOFF');
	
	this.newsalBtn.setAttr('data-confKey', 'NEWSAL_ONOFF'); // skj 170628 채권속보 스위치버튼
	
	//버튼 속성값 설정
	this.infoAlarmBtns.N.setAttr('data-confValue','N');
	this.infoAlarmBtns.S.setAttr('data-confValue','S');
	this.infoAlarmBtns.V.setAttr('data-confValue','V');
	this.infoAlarmBtns.SV.setAttr('data-confValue','SV');
	
	//버튼 속성값 설정
	this.infoInterBtns.MTS.setAttr('data-confValue', 'MTS');
	this.infoInterBtns.STM.setAttr('data-confValue', 'STM');
	*/
	var result = theApp.configInfo.get('IDSAVE_ONOFF');
	if (result == 'ON')	this.saveId.setCheck(true);
	else				this.saveId.setCheck(false);
		
	var result = theApp.configInfo.get('IDHIDE_ONOFF');
	if (result == 'ON')	this.hideId.setCheck(true);
	else				this.hideId.setCheck(false);
	
	var result = theApp.configInfo.get('PWSAVE_ONOFF');
	if (result == 'ON')	this.savePw.setCheck(true);
	else				this.savePw.setCheck(false);
};

//단말기 정보 조회
FD0100_T01.prototype.setAppInfos = function()
{
	this.arrLoginText;
	
	var txtAppInfo = '';	
	var loginInfo = theApp.userInfo,
		loginTime = loginInfo.get('D1최종로그인일시'),
		txtLoginTime = !loginTime ? '' :
					   [
						[loginTime.substr(0,4),'/',loginTime.substr(4,2),'/',loginTime.substr(6,2)].join(''),
						'(',
							[loginTime.substr(8,2),':',loginTime.substr(10,2),':',loginTime.substr(12,2)].join(''),
						')'
					   ].join('');

	//접속아이디
	this.infoGrd.setCellText(0, 1, theApp.accNetManager.getHeaderInfo('USER_ID'));
	
	var loginState = loginInfo.getUserLoginState();
	
	if(loginState==-1)
	{
		//접속상태
		this.infoGrd.setCellText(1, 1, '비로그인');
	}
	else if(loginState==0)
	{
		this.infoGrd.setCellText(1, 1, 'SNS로그인');
	}
	else if(loginState==1)
	{
		this.infoGrd.setCellText(1, 1, '로그인');
	}
	else if(loginState==2)
	{
		this.infoGrd.setCellText(1, 1, '로그인(공인인증)');
	}

	//최근접속정보
	this.infoGrd.setCellText(7, 1, txtLoginTime);
};

FD0100_T01.prototype.onGroup11ChkClick = function(comp, info)
{
	// 누른 후 결과에 대한 값 리턴
	var result = this.saveId.getCheck();
	
	if (result == true)		theApp.configInfo.set('IDSAVE_ONOFF', 'ON');
	else					theApp.configInfo.set('IDSAVE_ONOFF', 'OFF');
	
	theApp.configInfo.saveInfo();
};

FD0100_T01.prototype.onGroupChk2Click = function(comp, info)
{
	// 누른 후 결과에 대한 값 리턴
	var result = this.hideId.getCheck();
	
	if (result == true)		theApp.configInfo.set('IDHIDE_ONOFF', 'ON');
	else					theApp.configInfo.set('IDHIDE_ONOFF', 'OFF');
	
	theApp.configInfo.saveInfo();
};

FD0100_T01.prototype.onGroupChk3Click = function(comp, info)
{
	// 누른 후 결과에 대한 값 리턴
	var result = this.savePw.getCheck();
	
	if (result == true)		theApp.configInfo.set('PWSAVE_ONOFF', 'ON');
	else					theApp.configInfo.set('PWSAVE_ONOFF', 'OFF');
	
	theApp.configInfo.saveInfo();
};

FD0100_T01.prototype.onButton10Click = function(comp, info)
{
	var thisObj = this;
	if(theApp.userInfo.isLogin())
	{
		theApp.confirm('<span>로그아웃 하시겠습니까?</span>', function(result){
			if(result)
			{
				theApp.autoLogout();
				setTimeout(function(){
					thisObj.getContainer().close();
				}, 100);
			}
		}, '로그아웃', ['예', '아니오']);
	}
};
