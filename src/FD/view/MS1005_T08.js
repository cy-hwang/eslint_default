/**

	SBPGQ193 기존 ID 보유여부 조회
	1) 기존 ID 선택 시 > SACAT409: 전자금융 복수계좌 등록 및 해지
	2) 신규 ID 선택 또는 기존 ID 미보유시 > SBPGT175

*/
function MS1005_T08()
{
	AView.call(this);
}
afc.extendsClass(MS1005_T08, AView);


MS1005_T08.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.accountTxf = this.findCompById("AccountTxf");
	this.accountPw = this.findCompById('XSecureTextField1');	//실제 보안키패드는 아님 > 보여주기용
	this.accountName = this.findCompById('NameTxf');
	this.htsID = this.findCompById('IDTxf');	//IDTxf와 IDTxf2 중 최종본으로 매핑
	this.htsIDTxf = this.findCompById('IDTxf');
	this.htsIDLbl = this.findCompById('IDTxf2');
	this.htsIDLbl.show(AComponent.GONE);
	
	this.securityPw = this.findCompById('XSecureTextField3');
	this.securityPwCheck = this.findCompById('XSecureTextField4');

	//복수 E2E 가능하므로 RSA 암호화로 수정 2018.07.04 KJK
	//이어하기가 아닌 경우에만
/*	if(!theApp.ifContinued) {
		this.securityPw.padOption.encryptMethod='seed';
		this.securityPwCheck.padOption.encryptMethod='seed';
	}*/
	
	this.clearBtn3 = this.findCompById('Button6');
	this.clearBtn4 = this.findCompById('Button7');
	this.clearBtn5 = this.findCompById('Button8');
	
	this.pwView = this.findCompById("View37");
	this.pwGuideView = this.findCompById("View8");
	
	this.clearBtn3.$ele.hide();
	this.clearBtn4.$ele.hide();
	this.clearBtn5.$ele.hide();
	
	//보유 ID 리스트
	this.existingID = [];
	this.havingID = false;
	//이어하기>계좌비번 입력 오류 시 자동 buttonGoNext 단계 진행 위해
	this.selectBtnGoNext = false;
};

//계좌개설 단계에서 넘어온 경우 계좌번호, 계좌비밀번호, 성명 입력
MS1005_T08.prototype.onActive = function(reload)
{
	AView.prototype.onActive.call(this, reload)
	
	var thisObj = this;
	theApp.checkCreateDatetime(function() {
		thisObj.checkAccountPW();	
	});
};

//기존 ID 존재여부 확인
MS1005_T08.prototype.checkAccountPW = function() {

	//2. 저장된 계좌비밀번호가 없을 시
	if( !theApp.userInfo.getUserData('D1계좌비밀번호') ) {
		var win = AWindow.createWindow('FD/window/MS1005_W06.lay', 'MS1005_W06');
		win.openAsDialog(this);
	} else {
		this.accountTxf.setText(theApp.userInfo.getUserData('D1종합계좌번호'));
		this.accountPw.setText("****");
		this.accountName.setText(theApp.userInfo.getUserData('D1고객명'));
		//1. 일반 프로세스
		this.checkExistingID();	
	}
};

//기존 ID 존재여부 확인
MS1005_T08.prototype.checkExistingID = function() {

	//테스트진행중 - SACAT409 서비스 사용 시 진위확인 불가로 인해 임시로 기존ID에 매핑 기능 제거 > 임시해제
	//return;
	var thisObj = this;
	this.existingID = [];
	
	QryRequest.request('SBPGQ193',
		function(queryData){
		
			var inBlock1 = queryData.getBlockData('InBlock1');
			inBlock1[0] ={
					"D1처리구분":"1",		//1: 실명확인번호 조회
					"D1실명확인번호": theApp.userInfo.getUserData('D1실명확인번호암호화')
				};
			queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
		},
		function(queryData)
		{
			//var errCode = this.getLastError('errCode');
			//2679: 조회내역이 없습니다
			//0136: 조회가 완료되었습니다.
			if(queryData) {
				var outBlock1 = queryData.getBlockData('OutBlock1');
				
				//기존 ID 존재하는 사용자
				if(outBlock1.length > 0) {
					thisObj.existingID.push(["", outBlock1[0]["D1사용자ID"]]);
					thisObj.havingID = true;
					
					thisObj.htsIDTxf.show(AComponent.GONE);
					thisObj.htsIDLbl.show(AComponent.VISIBLE);
					thisObj.htsID = thisObj.htsIDLbl;
					
				}else {
					thisObj.htsIDTxf.show(AComponent.VISIBLE);
					thisObj.htsIDLbl.show(AComponent.GONE);
					thisObj.htsID = thisObj.htsIDTxf;									
				}
			} else {
				theApp.getErrMsg(thisobj,this);
			}
		}
	);	
};

MS1005_T08.prototype.onWindowResult = function( result, awindow)
{
	var thisObj = this;
	if( awindow.getContainerId() == 'MS1005_W08') {
		if(result) {
		
			this.htsID.setText(result[1]);
			//기존 ID 선택한 순간 pw 입력창 및 가이드 숨김처리
			this.pwView.show(AComponent.INVISIBLE);
			this.pwGuideView.show(AComponent.INVISIBLE);
			this.clearBtn4.$ele.hide();
			this.clearBtn5.$ele.hide();
		}
	//2-1) 이어하기 시 계좌 비번 입력팝업
	} else if( awindow.getContainerId() == 'MS1005_W06') {
		if(result) {
			theApp.userInfo.setUserData('D1계좌비밀번호', result);
			
			this.accountTxf.setText(theApp.userInfo.getUserData('D1종합계좌번호'));
			this.accountPw.setText("****");
			this.accountName.setText(theApp.userInfo.getUserData('D1고객명'));
			
			//2-4) 계좌비번 오류에서 넘어온 경우
			if(this.selectBtnGoNext) {
				this.onButtonGoNext();
			//2-2)이어하기 > 계좌 비번 입력 후
			} else {
				this.checkExistingID();				
			}
		} else {
			AToast.show('계좌비밀번호입력에 실패하였습니다. App 종료 후 다시 이용하여 주시기 바랍니다.');
		}
	//2-3) 이어하기 수행하였을 때, 계좌 비번 오류 창
	} else if( awindow.getContainerId() == 'MS1005_W05') {
		if(awindow.flag == 1) {
			var win = AWindow.createWindow('FD/window/MS1005_W06.lay', 'MS1005_W06');
			win.openAsDialog(this);	
		}
	}
};

//가상 계좌번호 조회서비스
MS1005_T08.prototype.sendSACAQ501 = function(callback) {

	var thisObj = this;

	QryRequest.request('SACAQ501',
		function(queryData, groupName){
			var inBlock1 = queryData.getBlockData('InBlock1');

			inBlock1[0] = {'D1계좌구분':'1',		//1: 종합계좌 2: 개별계좌 3: 서브계좌
						   'D1계좌번호':theApp.userInfo.getUserData('D1종합계좌번호'),
						   'D1입력비밀번호':theApp.userInfo.getUserData('D1계좌비밀번호'),
						   'D1서비스종류코드': "1410"
						  };								
			//계좌개설 전 이어하기: RSA, 계좌개설 후 이어하기: RSA, 처음부터진행: SEED 2018.02.28 HCY -> 처음부터 진행 시 계좌비밀번호 RSA로 변경함 2018.07.03 KJK
			queryData.putPwInfo('InBlock1', 'D1입력비밀번호', false, AQuery.RSA);
			
			//queryData.printQueryData();
		},
		function(queryData, groupName)
		{			
			var errCode = this.getLastError('errCode');
			if( errCode >= 1000) {				
				//비밀번호 오류 5회중 n회 남았습니다.
				if(errCode == "3669") {
					var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');
					win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">' + this.getLastError('errMsg') + '<br>(' + this.getLastError('trName') + ')' + ' (' + this.getLastError('errCode') + ')</span>';
					win.flag = 1;
					win.openAsDialog(thisObj);
					
				//오류 한도 초과
				} else if(errCode == "3346") {
					var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');
					win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">오류 허용횟수 초과하였습니다.<br>좌측 상단 "계좌개설"초기화면 이동 버튼을 통해 진행중인 내역을 삭제하고 다시 한번 계좌개설을 진행해 주시기 바랍니다.<br>(' + this.getLastError('trName') + ')' + ' (' + this.getLastError('errCode') + ')</span>';
					win.openAsDialog(thisObj);	
					
				} else {
					theApp.getErrMsg(thisObj,this);
				}
			} else if(queryData) {
				var outBlock1 = queryData.getBlockData('OutBlock2');
				theApp.userInfo.setUserData("D1가상기관명", outBlock1[0]["D1거래기관명"]);
				theApp.userInfo.setUserData("D1가상계좌번호", outBlock1[0]["D1상대기관계좌번호"]);
				if(callback) callback.call(thisObj);
			}
		}
	);	
}


//선택한 ID로 복수계좌 연동 process 진행
MS1005_T08.prototype.sendSACAT409 = function() {
	var thisObj = this;

	QryRequest.request('SACAT409',
		function(queryData, groupName){
			var inBlock1 = queryData.getBlockData('InBlock1');

			inBlock1[0] = {'D1처리구분':'1',
						   'D1계좌번호':theApp.userInfo.getUserData('D1계좌번호'),
						   'D1전자금융사용자ID':thisObj.htsID.getText()
						  };								

			//queryData.printQueryData();						   
		},
		function(queryData, groupName)
		{			
			var errCode = this.getLastError('errCode');
			if( errCode >= 1000) {
				theApp.getErrMsg(thisObj,this);
			} else if(queryData) {
 				//queryData.printQueryData();
				
				thisObj.lastStep(thisObj.htsID.getText());
			}
		}
	);	

};

MS1005_T08.prototype.onButtonGoNext = function(comp, info)
{	
	var thisObj = this;
	//이어하기>계좌비번 입력 오류 시 자동 buttonGoNext 단계 진행 위해
	this.selectBtnGoNext = true;
	if(thisObj.checkVaild()) {
		//가상계좌번호 조회 > 계좌 ID 등록 / 복수계좌 ID 등록
		this.sendSACAQ501(function() {
			if(thisObj.havingID) {
				thisObj.sendSACAT409();
			} else {
				thisObj.sendSBPGT175();
			}
		});
	}
};

MS1005_T08.prototype.checkVaild = function()
{
	if(!this.htsID.getText())
	{
		AToast.show('ID를 입력하여주세요.');
		return false;		
	}
		
	// 2017/07/11 Android 에서 ID등록을 8자리로 제한하지 못하므로 버튼 클릭시 제어			
	if(this.htsID.getText().length > 16 || this.htsID.getText().length < 4)
	{
		AToast.show('ID는 4~16자리로 입력해주세요.');
		return false
	}
	
	if(!this.havingID){
		if( !this.securityPw.getText())
		{
			AToast.show('패스워드를 입력해주세요.');
			return false;
		}

		if( !this.securityPwCheck.getText() )
		{
			AToast.show('패스워드 확인을 입력해주세요.');
			return false;
		}
	}
	
	if(this.htsID.getText().replace(/[^A-Z]/g, "").length > 0) {
		AToast.show('사용자 ID는 영문(소문자) 숫자 조합으로 입력해주세요.');
		return false;
	}
	return true;
};
	
//비대면 계좌 HTS ID 등록
MS1005_T08.prototype.sendSBPGT175 = function() {

	var pw = theApp.userInfo.getUserData('D1계좌비밀번호');
	var tempPw = this.securityPw.getCipherData();
	var tempPwCheck = this.securityPwCheck.getCipherData();
	var thisObj = this;
	
	QryRequest.request('SBPGT175',
		function(queryData){
			var inBlock1 = queryData.getBlockData('InBlock1');
			inBlock1[0] ={
				"D1입력구분":'0',
				"D1처리구분": '1',
				"D1본인확인매체상태구분":'0',
				"D1본인확인구분": '0',
				"D1계좌번호": thisObj.accountTxf.getText(),
				"D1비밀번호": pw,
				"D1사용자ID": thisObj.htsID.getText(),
				"D1중복로그인가능여부":'0',
				"D1전자금융거래매체비밀번호":tempPw,
				"D1확인로그인비밀번호":tempPwCheck
			};
			
			//계좌개설 전 이어하기: RSA, 계좌개설 후 이어하기: RSA, 처음부터진행: SEED 2018.02.28 HCY -> 처음부터 진행 시 계좌비밀번호 RSA로 변경함 2018.07.03 KJK
			queryData.putPwInfo('InBlock1', 'D1비밀번호', false, AQuery.RSA);
			queryData.putPwInfo('InBlock1', 'D1전자금융거래매체비밀번호', false, AQuery.RSA);
			queryData.putPwInfo('InBlock1', 'D1확인로그인비밀번호', false, AQuery.RSA);
			//queryData.printQueryData();
		},
		function(queryData) {
			var errCode = this.getLastError('errCode');
			//ID 중복 존재
			if( errCode == 2419) {
				var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');			
				win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">사용중인 ID 입니다.<br>다른 ID로 신청해주시기 바랍니다.</span>';
				win.openAsDialog(thisObj);
			}else if ( errCode >= 1000 ) {
				theApp.getErrMsg(thisObj,this);
			}
			else if(queryData){
				//queryData.printQueryData();
				thisObj.lastStep(thisObj.htsID.getText());
			}
		}
	);
};

//최종단계 저장(99) -> 다음페이지 이동
MS1005_T08.prototype.lastStep = function(ID) {
	
	//사용자 ID 저장
	theApp.userInfo.setUserData('D1사용자ID', ID);
	
	var thisObj = this;
	//최종단계 저장 99
	theApp.saveStep('99', function(){
	
		thisObj.getContainer().nextView();
	});
};

MS1005_T08.prototype.onButton6Click = function(comp, info)
{
	this.htsID.setText("");
	this.clearBtn3.$ele.hide();
};

MS1005_T08.prototype.onIDTxfChange = function(comp, info)
{
	var srchTxt = comp.getText();
	srchTxt = Utils.validEnglish(srchTxt);
	comp.setText(srchTxt);
	
	if(srchTxt.length == 0) {
		this.clearBtn3.$ele.hide();
	}
	else {
		this.clearBtn3.$ele.show();
	}
};

MS1005_T08.prototype.onIDTxfBlur = function(comp, info)
{
	if(comp.getText().length < 4 || comp.getText().length > 16)
		AToast.show('ID는 4~16자리로 입력해주세요.');
};

MS1005_T08.prototype.onButton7Click = function(comp, info)
{
	this.securityPw.setText('');
	this.clearBtn4.show(AComponent.GONE);
};

MS1005_T08.prototype.onButton8Click = function(comp, info)
{
	this.securityPwCheck.setText('');
	this.clearBtn5.show(AComponent.GONE);
};

MS1005_T08.prototype.onXSecureTextField3Change = function(comp, info)
{
	var srchTxt = comp.getText();
	
	if(srchTxt.length == 0) {
		this.clearBtn4.show(AComponent.GONE);
	} else {
		this.clearBtn4.show(AComponent.VISIBLE);
	}
};

MS1005_T08.prototype.onXSecureTextField4Change = function(comp, info)
{
	var srchTxt = comp.getText();
	
	if(srchTxt.length == 0) {
		this.clearBtn5.show(AComponent.GONE);
	} else {
		this.clearBtn5.show(AComponent.VISIBLE);
	}
};

//기존 ID 보유 고객은 ID선택 팝업 호출
MS1005_T08.prototype.onIDTxf2ActionDown = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/MS1005_W08.lay','MS1005_W08');
	win.setData(this.existingID);
	win.openAsDialog(this)
};
