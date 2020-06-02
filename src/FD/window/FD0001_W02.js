
/**
Constructor
Do not call Function in Constructor.
** ID 찾기 **
** 김재경 2018.03.15 **
*/
function FD0001_W02(containerId)
{
	AWindow.call(this, containerId);

	this.header = {
		FIRM_NO			: theApp.systemInfo.fno,			//이용사 번호
		USER_ID			: '@NFTF_MTS',					//사용자 ID
		PRVT_IP			: theApp.prvtIP,			//사설IP
		CONN_CLSS_CODE	: Define.CONN_CLSS_CODE,	//접속분류코드
		TERM_CLSS_CODE	: '@NFTF',	//단말분류코드
		FUNC_KEY_LST	: 'C'
	};
}
afc.extendsClass(FD0001_W02, AWindow);


FD0001_W02.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);

	this.centerView = this.findCompById('CenterView');
	this.outputView = this.findCompById('OutputView');
	
	//centerView
	//this.accountNum = this.findCompById('TextField3');
	//this.accountPw = this.findCompById('XSecureTextField2');
	this.rno = this.findCompById('XSecureTextField1');
	this.okBtn = this.findCompById('Button2');
	//outputView
	this.userIdLb = this.findCompById('Label9');
	
	this.centerView.show(AComponent.VISIBLE);
	this.outputView.show(AComponent.GONE);
	
	this.rno2 = null; // 복호화된(Plain Text) 실명번호
	this.qryType = '1'; //조회구분: 0.고객번호 1.실명번호 2.계좌번호
	
	// 공인인증서 Pad에 seed 옵션추가 2020.03.16
	if(Define.ENC_PREFIX == 'PAD.V02')
	{
		this.rno.padOption.encryptMethod = 'seed';
	}
};


//화면이 활성화된 후 이벤트
FD0001_W02.prototype.onActiveDone = function(reload)
{
	AWindow.prototype.onActiveDone.call(this, reload);	
};

FD0001_W02.prototype.onDeactiveDone = function()
{
	AWindow.prototype.onDeactiveDone.call(this);	
	this.resetData();		
};


//화면 초기화
FD0001_W02.prototype.resetData = function()
{	
	//this.accountNum.setText('');
	//this.accountPw.setText('');
	this.rno.setText('');
	this.rno2 = null;
	this.centerView.show(AComponent.VISIBLE);
	this.outputView.show(AComponent.GONE);
};

//확인 버튼
FD0001_W02.prototype.onOkBtnClick = function(comp, info)
{
	var thisObj = this;
	//var accNoIn = this.accountNum.getText().replace(/-/gi,'');
	var accNoIn = this.rno.getCipherData(); //보안키패드로부터 실명번호(Cypher Text) 추출(계좌번호에서 실명번호로 변경 2020.03.17)

	if(thisObj.checkVaild()){
		comp.enable(false);
		SecurePadManager.cipherToPlain(accNoIn, function(rno2){
			thisObj.rno2 = rno2; // 복호화되 실명번호 저장
			thisObj.sendSBPGQ195(function(userId){
				thisObj.initConnection(function(result, text){
					theApp.smsCertManager.openSmsCertWindow(thisObj.rno2,true,"",function(result){
						thisObj.stopConnection();
						if(result){
							thisObj.centerView.show(AComponent.GONE);
							thisObj.outputView.show(AComponent.VISIBLE);
							thisObj.userIdLb.setText('['+userId+']');
						}
						comp.enable(true);
					}, null, thisObj.qryType); // 마지막 조회구분 argument 추가
				});
			});
		});
	}
};

//텍스트필드 값 체크
FD0001_W02.prototype.checkVaild = function()
{
	/*
	if(!this.accountNum.getText() || this.accountNum.getText() == '')
	{
		AToast.show('계좌번호를 입력해주세요.');
		this.accountNum.addClass('active');
		return false;
	}
	if(!this.accountPw.getCipherData() || this.accountNum.getText() == '')
	{
		AToast.show('계좌비밀번호를 입력해주세요.');
		this.accountPw.addClass('active');
		return false;
	}
	*/
	if(!this.rno.getText() || this.rno.getText() == '')
	{
		AToast.show('주민등록번호를 입력해주세요.');
		this.rno.addClass('active');
		return false;
	}
	return true;
};

/*
//HTS 고객 ID 찾기 서비스
FD0001_W02.prototype.sendSBPGQ183 = function(callback) {
	var thisObj = this;
 	var accNo 	=	thisObj.accountNum.getText().replace(/-/gi,'');
	var accPW	=	thisObj.accountPw.getCipherData();
	var rno		=	thisObj.rno.getCipherData();

	this.initConnection(function(result, text){
		if(result == Define.SUCCESS) 
		{
			theApp.accNetManager.sendProcessByName('SBPGQ183', null, null, function(queryData, groupName) {
				var inBlock1 = queryData.getBlockData('InBlock1');
				inBlock1[0] = {
					"D1실명확인방법코드": '01', // '01' 주민등록번호
					"D1실명확인번호": rno,
					"D1계좌번호": accNo,
					"D1계좌비밀번호": accPW
				};
				if(!afc.isSimulator){
					queryData.putPwInfo('InBlock1', 'D1실명확인번호');				
					queryData.putPwInfo('InBlock1', 'D1계좌비밀번호');
				}
				queryData.printQueryData();
			}, function(queryData, groupName) {
				thisObj.stopConnection();
				var errCode = this.getLastError('errCode');
				if( errCode >= 1000 )
				{
					this.printLastError();
					thisObj.okBtn.enable(true);
				}
				else if(queryData){
					queryData.printQueryData();
					var outBlock1 = queryData.getBlockData('OutBlock1')[0];
					if(callback) {
						callback(outBlock1['D1전자금융사용자ID']);
					}
				}
			});
		}
	});
};
*/

//HTS 고객 ID 찾기 서비스(계좌번호, 계좌비밀번호 제거)
FD0001_W02.prototype.sendSBPGQ195 = function(callback) {
	var thisObj = this;
	//var rno = thisObj.rno.getCipherData();
	var rno = thisObj.rno2; // 복호화된 실명번호

	this.initConnection(function(result, text){
		if(result == Define.SUCCESS) 
		{
			theApp.accNetManager.sendProcessByName('SBPGQ195', null, null, function(queryData, groupName) {
				var inBlock1 = queryData.getBlockData('InBlock1');
				inBlock1[0] = {
					"D1실명확인방법코드": '01', // '01' 주민등록번호, '02' 사업자등록번호, '05' 외국인등록번호, '08' 여권
					"D1실명확인번호": rno
				};
				if(!afc.isSimulator){
					//queryData.putPwInfo('InBlock1', 'D1실명확인번호');
				}
				queryData.printQueryData();
			}, function(queryData, groupName) {
				thisObj.stopConnection();
				var errCode = this.getLastError('errCode');
				if( errCode >= 1000 )
				{
					this.printLastError();
					thisObj.okBtn.enable(true);
				}
				else if(queryData){
					queryData.printQueryData();
					var outBlock1 = queryData.getBlockData('OutBlock1')[0];
					if(callback) {
						callback(outBlock1['D1전자금융사용자ID']);
					}
				}
			});
		}
	});
};

//커넥션 정보 초기화 및 커넥션 시작
FD0001_W02.prototype.initConnection = function(callback)
{
	if(Define)
		theApp.connectManager.idRegConnection('@NFTF_MTS', 'MT', Define.NFTF_SERVER_IP, 8090, this.header, callback);
};

FD0001_W02.prototype.stopConnection = function()
{
	if(theApp.accNetManager)
	{
		theApp.accNetManager.stopManager();
		theApp.accNetManager = null;
	}
};

//뒤로가기 버튼
FD0001_W02.prototype.onBackBtnClick = function(comp, info)
{
	this.close();
};

//계좌번호 텍스트필드 '-' 자동 입력
FD0001_W02.prototype.onTextField3Change = function(comp, info)
{
	var oldSelect = comp.element.selectionStart;
	afc.log(comp.element.selectionEnd);
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

FD0001_W02.prototype.onHighLightTextField = function(comp, info)
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
