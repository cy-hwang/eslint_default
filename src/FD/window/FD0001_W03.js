
/**
Constructor
Do not call Function in Constructor.
** ID비밀번호 변경 **
*/
function FD0001_W03(containerId)
{
	AWindow.call(this);

	this.header = {
		FIRM_NO			: theApp.systemInfo.fno,			//이용사 번호
		USER_ID			: '@NFTF_MTS',					//사용자 ID
		PRVT_IP			: theApp.prvtIP,			//사설IP
		CONN_CLSS_CODE	: Define.CONN_CLSS_CODE,	//접속분류코드
		TERM_CLSS_CODE	: '@NFTF',	//단말분류코드
		FUNC_KEY_LST	: 'C'
	};
}
afc.extendsClass(FD0001_W03, AWindow);

FD0001_W03.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);

	this.fundID = this.findCompById('TextField1');
	this.rno = this.findCompById('XSecureTextField1');
	//this.accountNum = this.findCompById('TextField3');
	//this.accountPw = this.findCompById('XSecureTextField2');
	this.securityPw = this.findCompById('XSecureTextField3');
	this.securityPwCheck = this.findCompById('XSecureTextField4');
	this.okBtn = this.findCompById('Button2');
	
	this.rno2 = null; // 복호화된(Plain Text) 실명번호
	this.qryType = '1'; //조회구분: 0.고객번호 1.실명번호 2.계좌번호
};

FD0001_W03.prototype.onDeactiveDone = function()
{
	AWindow.prototype.onDeactiveDone.call(this);	
	this.resetData();		
};

//화면 초기화
FD0001_W03.prototype.resetData = function()
{	
	this.fundID.setText('');
	this.rno.setText('');
	//this.accountNum.setText('');
	//this.accountPw.setText('');
	this.securityPw.setText('');
	this.securityPwCheck.setText('');
};



//텍스트필드 값 체크
FD0001_W03.prototype.checkVaild = function()
{
	if(!this.fundID.getText())
	{
		AToast.show('사용자ID를 입력해주세요.');
		this.fundID.addClass('active');
		return false;
	}
	if(!this.rno.getText())
	{
		AToast.show('주민등록번호를 입력해주세요.');
		this.rno.addClass('active');
		return false;
	}
	/*
	if(!this.accountNum.getText() || this.accountNum.getText() == '')
	{
		AToast.show('계좌번호를 입력해주세요.');
		this.accountNum.addClass('active');
		return false;
	}
	if(!this.accountPw.getText())
	{
		AToast.show('계좌비밀번호를 입력해주세요.');
		this.accountPw.addClass('active');
		return false;
	}
	*/
	if( !this.securityPw.getText())
	{
		AToast.show('ID비밀번호를 입력해주세요.');
		this.securityPw.addClass('active');
		return false;
	}
	if( !this.securityPwCheck.getText() )
	{
		AToast.show('ID비밀번호 확인을 입력해주세요.');
		this.securityPwCheck.addClass('active');
		return false;
	}
	return true;
};

//뒤로가기 버튼
FD0001_W03.prototype.onBackBtnClick = function(comp, info)
{
	this.close();
};

//확인 버튼
FD0001_W03.prototype.onOkBtnClick = function(comp, info)
{
	var thisObj = this;
	//var accNoIn = this.accountNum.getText().replace(/-/gi,'');
	
	//var accNoIn = this.rno.getText(); // 실명확번호로 변경
	//var accNoIn = this.rno.getCipherData(); //실명확번호로 변경
	
	if(thisObj.checkVaild()){
		comp.enable(false);
		thisObj.sendSBPGQ391(function() {
			//thisObj.sendSACMQ901(function() { // 계좌번호, 입력비밀번호 제거로 계좌비밀번호검증 불필요(호출중단)
				thisObj.sendSBPGQ312(function(){
					thisObj.initConnection(function(result, text){
						if(result){
							theApp.smsCertManager.openSmsCertWindow(thisObj.rno2,true,"",function(result){
							//theApp.smsCertManager.openSmsCertWindow(accNoIn,true,"",function(result){
								thisObj.stopConnection();
								if(result){
									thisObj.sendSBPGT478(function(){
										AToast.show("ID비밀번호 변경이 완료되었습니다.");
										thisObj.resetData();
										comp.enable(true);
										thisObj.close();
									});
								}else{
									comp.enable(true);	
								}
							}, null, thisObj.qryType); // 마지막 조회구분 argument 추가
						}
					});
				});
			//});
		});
	}
	
};

//ID 확인 서비스(인증기본정보조회)
FD0001_W03.prototype.sendSBPGQ391 = function(callback) {
	var thisObj =	this;
	var rno		=	thisObj.rno.getCipherData();
	
	this.initConnection(function(result, text){
		if(result == Define.SUCCESS) 
		{
			theApp.accNetManager.sendProcessByName('SBPGQ391', null, null, function(queryData, groupName) {
				var inBlock1 = queryData.getBlockData('InBlock1');
				inBlock1[0] = {
					"D1처리구분": 'D',
					"D1사용자ID": thisObj.fundID.getText(),
					"D1실명확인번호": rno
				};
				queryData.putPwInfo('InBlock1', 'D1실명확인번호');
			}, function(queryData, groupName) {
				thisObj.stopConnection();
				var errCode = this.getLastError('errCode');
				if( errCode >= 1000 )
				{
					AppManager.endOltp();
					this.printLastError();
					thisObj.okBtn.enable(true);
				}
				else if(queryData){
					var outBlock1 = queryData.getBlockData('OutBlock1')[0];
					thisObj.rno2 = outBlock1['D1실명확인번호']; // SMS에서 복호화된 실명번호 사용
					AppManager.endOltp();
					if(callback) {
						callback();
					}
				}
			});
		}
	});
};

/*
//계좌 비밀번호 검증 서비스(호출중단)
FD0001_W03.prototype.sendSACMQ901 = function(callback) {
	var thisObj = this;
	var accNo 	=	thisObj.accountNum.getText().replace(/-/gi,'');
	var accPW	=	thisObj.accountPw.getCipherData();
	
	this.initConnection(function(result, text){
		if(result == Define.SUCCESS) 
		{
			theApp.accNetManager.sendProcessByName('SACMQ901', null, null, function(queryData, groupName) {
				var inBlock1 = queryData.getBlockData('InBlock1');
				inBlock1[0] = {
					"D1계좌번호": accNo,
					"D1입력비밀번호": accPW,
					"D1비밀번호처리코드": ''
				};
				queryData.putPwInfo('InBlock1', 'D1입력비밀번호');	
				queryData.printQueryData();
			}, function(queryData, groupName) {
				thisObj.stopConnection();
				var errCode = this.getLastError('errCode');
				if( errCode >= 1000 )
				{
					AppManager.endOltp();
					this.printLastError();
					thisObj.okBtn.enable(true);
				}
				else if(queryData){
					queryData.printQueryData();
					var outBlock1 = queryData.getBlockData('OutBlock1')[0];
					AppManager.endOltp();
					if(callback) {
						callback();
					}
				}
			});
		}
	});
};
*/

//ID 비밀번호 검증 서비스
FD0001_W03.prototype.sendSBPGQ312 = function(callback) {
	var thisObj = this;
	var tempPw = this.securityPw.getCipherData();
	var tempPwCheck = this.securityPwCheck.getCipherData();

	this.initConnection(function(result, text){
		if(result == Define.SUCCESS) 
		{
			theApp.accNetManager.sendProcessByName('SBPGQ312', null, null, function(queryData, groupName) {
				var inBlock1 = queryData.getBlockData('InBlock1');
				inBlock1[0] = {
					"D1사용자ID": thisObj.fundID.getText(),
					"D1변경로그인비밀번호": tempPw,
					"D1확인로그인비밀번호": tempPwCheck
				};
				queryData.putPwInfo('InBlock1', 'D1변경로그인비밀번호', true);
				queryData.putPwInfo('InBlock1', 'D1확인로그인비밀번호', true);
			}, function(queryData, groupName) {
				thisObj.stopConnection();
				var errCode = this.getLastError('errCode');
				if( errCode >= 1000 )
				{
					AppManager.endOltp();
					this.printLastError();
					thisObj.okBtn.enable(true);
				}
				else if(queryData){
					AppManager.endOltp();
					if(callback) {
						callback();
					}
				}
			});
		}
	});
};

/*
//접속 비밀번호 재설정 서비스
FD0001_W03.prototype.sendSBPGT145 = function(callback){
	var thisObj	=	this;
	var accNo 	=	thisObj.accountNum.getText().replace(/-/gi,'');
	var accPW	=	thisObj.accountPw.getCipherData();
	var rno		=	thisObj.rno.getCipherData();
	var secuPw	=	thisObj.securityPw.getCipherData();

	this.initConnection(function(result, text){
		if(result == Define.SUCCESS) 
		{
			theApp.accNetManager.sendProcessByName('SBPGT145', null, null, function(queryData, groupName) {
				this.setHeaderInfo(
					{USER_ID : thisObj.fundID.getText()}
				);
				var inBlock1 = queryData.getBlockData('InBlock1');
				inBlock1[0] = {
					"D1상품유형코드": '04',	//투자신탁
					"D1계좌번호": accNo,
					"D1비밀번호": accPW,
					"D1실명확인번호": rno,
					"D1변경로그인비밀번호": secuPw
				};
				queryData.putPwInfo('InBlock1', 'D1비밀번호');
				queryData.putPwInfo('InBlock1', 'D1실명확인번호');
				queryData.putPwInfo('InBlock1', 'D1변경로그인비밀번호');
				queryData.printQueryData();
			}, function(queryData, groupName) {
				thisObj.stopConnection();
				var errCode = this.getLastError('errCode');
				if( errCode >= 1000 )
				{
					AppManager.endOltp();
					this.printLastError();
					thisObj.okBtn.enable(true);
				}
				else if(queryData){
					queryData.printQueryData();
					AppManager.endOltp();
					if(callback) {
						callback();
					}
				}
			});
		}
	});
};
*/

//접속 비밀번호 재설정 서비스(계좌번호, 입력비밀번호 제거)
FD0001_W03.prototype.sendSBPGT478 = function(callback){
	var thisObj	=	this;
	var rno		=	thisObj.rno.getCipherData();
	var secuPw	=	thisObj.securityPw.getCipherData();
	var secuPwCheck = thisObj.securityPwCheck.getCipherData();

	this.initConnection(function(result, text){
		if(result == Define.SUCCESS) 
		{
			theApp.accNetManager.sendProcessByName('SBPGT478', null, null, function(queryData, groupName) {
				this.setHeaderInfo(
					{USER_ID : thisObj.fundID.getText()}
				);
				var inBlock1 = queryData.getBlockData('InBlock1');
				inBlock1[0] = {
					"D1변경로그인비밀번호": secuPw,
					"D1확인로그인비밀번호": secuPwCheck
				};
				queryData.putPwInfo('InBlock1', 'D1변경로그인비밀번호');
				queryData.putPwInfo('InBlock1', 'D1확인로그인비밀번호');
			}, function(queryData, groupName) {
				thisObj.stopConnection();
				var errCode = this.getLastError('errCode');
				if( errCode >= 1000 )
				{
					AppManager.endOltp();
					this.printLastError();
					thisObj.okBtn.enable(true);
				}
				else if(queryData){
					AppManager.endOltp();
					if(callback) {
						callback();
					}
				}
			});
		}
	});
};

//커넥션 정보 초기화 및 커넥션 시작
FD0001_W03.prototype.initConnection = function(callback)
{
	if(Define)
	theApp.connectManager.idRegConnection('@NFTF_MTS', 'MT', Define.NFTF_SERVER_IP, 8090, this.header, callback);
};

FD0001_W03.prototype.stopConnection = function()
{
	if(theApp.accNetManager)
	{
		theApp.accNetManager.stopManager();
		theApp.accNetManager = null;
	}
};

FD0001_W03.prototype.onTextField3Change = function(comp, info)
{
	var oldSelect = comp.element.selectionStart;
	var newSelect = oldSelect;
	var tempInfo = info.replace(/-/gi,'');
	
	if(tempInfo.length == info.length) {
		if(tempInfo.length > 3) {
			newSelect++;
		}
	} else if(tempInfo.length + 1 == info.length){
			if(oldSelect > 6) {
				newSelect++;
			} else if(oldSelect > 3) {
				
			}
	} else if(tempInfo.lenght + 2 == info.length) {
	}
	
	this.onHighLightTextField(comp);
	
	comp.element.value = theApp.systemInfo.makeAccNumber(info);
	comp.element.selectionStart = newSelect;
	comp.element.selectionEnd = newSelect;
};

FD0001_W03.prototype.onLabel23ActionUp = function(comp, info)
{
	afc.phoneCall('1588-5533');
};

FD0001_W03.prototype.onHighLightTextField = function(comp, info)
{
	var srchTxt = comp.getText();
	if(srchTxt.length == 0)
	{
	}
	else 
	{
		comp.removeClass('active');
	}

};


