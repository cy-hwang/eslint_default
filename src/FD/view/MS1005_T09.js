
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_T09()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(MS1005_T09, AView);

MS1005_T09.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.titleLbl = this.findCompById('TitleLbl');
	this.nameLbl = this.findCompById('NameLbl');
	this.accountLbl = this.findCompById('AccountLbl');
	this.accountLbl2 = this.findCompById('AccountLbl2');
	this.iDLbl = this.findCompById('IDLbl');
};

MS1005_T09.prototype.onActive = function(reload)
{
	AView.prototype.onActive.call(this, reload);
	
	if( reload)
	{
		AppManager.endOltp();
		//완료 안내 SMS 발송
		this.sendSACAT730();
	}
	this.setTexts();
};

//SMS 발송
MS1005_T09.prototype.sendSACAT730 = function() {

	var thisObj = this;
	QryRequest.request('SACAT730',
		function(queryData){
			var inBlock1 = queryData.getBlockData('InBlock1');
			inBlock1[0] ={
				"D1처리구분": '3',	//처리구분 1: 고객번호, 2: 계좌번호, 3: 실명확인번호
				"D1계좌번호": theApp.userInfo.getUserData('D1실명확인번호암호화'),
				//"D1SMS메시지자체": '[메리츠자산운용(주)]계좌개설신청이 접수되었으며, 접수 순서대로 승인해드리고 있습니다. 최종 승인되면 완료 문자가 전달됩니다.',
				"D1SMS메시지자체": '[메리츠자산운용(주)]신청이 접수되었으며, 최종 승인되면 완료 문자가 전달됩니다.',
				"D1SMS여부": "0"	//0: 발신, 1: 미발신
			};
			queryData.putPwInfo('InBlock1', 'D1계좌번호', false, theApp.encryptType);
			//queryData.printQueryData();
		},
		function(queryData) {
			var errCode = this.getLastError('errCode');
			if( errCode >= 1000 ) {
				AppManager.endOltp();
				theApp.getErrMsg(thisObj,this);
			}
			else if(queryData){
				AppManager.endOltp();
				//queryData.printQueryData();
			}
		}
	);
};

MS1005_T09.prototype.onOkBtnClick = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/MS1005_W21.lay', 'MS1005_W21');			
	win.openAsDialog(this);	
};

MS1005_T09.prototype.setTexts = function()
{
	//this.label0.$ele.html('<span class="SB" style="color:#eb6f57; font-size:35px; line-height:134%">계좌개설 신청이 완료되었습니다</span>');
	this.nameLbl.setText(theApp.userInfo.getUserData('D1고객명'));
	this.accountLbl.setText( this.makeAccountNumber(theApp.userInfo.getUserData('D1계좌번호')) );
	this.accountLbl2.$ele.html('<span class="LINE_03" style="padding-left:25px; font-size:24px; color:#555; letter-spacing:-2px;">' + theApp.userInfo.getUserData('D1가상기관명') + '<br>' +  + theApp.userInfo.getUserData('D1가상계좌번호') + '</span>');
	this.iDLbl.setText(theApp.userInfo.getUserData('D1사용자ID'));
};

//계좌번호 '-' 추가
MS1005_T09.prototype.makeAccountNumber = function(number) {
	
	return number.substr(0,3) + "-" + number.substr(3,2) + "-" + number.substring(5,number.length);
}

MS1005_T09.prototype.onWindowResult = function(result, awindow){

	if(awindow.getContainerId() == 'MS1005_W21'){
		if(result){
			//로그인화면으로 이동
			theApp.isNFTFProgress = false;
			theApp.navigator.goPage('FrmPage');
			theApp.frmPage.goFirstPageProcess();
		}
	}
	
}