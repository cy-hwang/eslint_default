/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_T10()
{
	AView.call(this);

	this.bankInfo = [];
}
afc.extendsClass(MS1005_T10, AView);

MS1005_T10.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.accountNum = this.findCompById('TextField4');				// 계좌번호
	this.chkBox = this.findCompById('CheckBox1');					// 약정신청 체크박스
	this.dpBtn = this.findCompById('DropBox1');						// 금융기관드랍박스 // 팝업버튼 
	this.dpBtn.setUseDropBox(false);
	this.name = this.findCompById('NameTxf');
	this.validAcc = false;
	
	this.btnView = this.findCompById('View6');		
	this.nextButton = this.findCompById('NextBtn');
	this.chkBox.setCheck(true);
	this.cancelbtn = this.findCompById('CancelBtn');
	this.cancelbtn.$ele.hide();
	
	//기존 ID에 연결 또는 신규 ID 생성 둘 중 하나 선택 여부
	this.processSelected = false;
	
	//약정계좌 검증 끝난 계좌
	this.validAccount = "";
};

MS1005_T10.prototype.onActive = function(reload)
{
	AView.prototype.onActive.call(this, reload);
	
	if(reload)
	{
		this.bankInfo = BankInfo();
		
		//개설가능시간여부 체크
		theApp.checkCreateDatetime();
		
		//저장된 계좌비밀번호가 없을 시
		if( !theApp.userInfo.getUserData('D1계좌비밀번호') ) {
			var win = AWindow.createWindow('FD/window/MS1005_W06.lay', 'MS1005_W06');
			win.openAsDialog(this);
		}
	}
};


MS1005_T10.prototype.onDeactiveDone = function()
{
	this.dpBtn.clearSelectItem();
	this.accountNum.setText("");
	this.cancelbtn.$ele.hide();
};

//조회 버튼 클릭
MS1005_T10.prototype.BankSearchBtn = function(comp, info)
{
	if(this.dpBtn.getItem(0)) {
		this.sendSDPKT120();
	} else {
		AToast.show("금융기관을 선택해 주시기 바랍니다.");
	}
};

//은행계좌명 조회
MS1005_T10.prototype.sendSDPKT120 = function() {

	var thisObj = this;
	
	thisObj.validAcc = false;
	//계좌명 항목 초기화
	thisObj.name.setText("");
	thisObj.validAccount = "";
	
	QryRequest.request('SDPKT120',
		function(queryData){
		
		var inBlock1 = queryData.getBlockData('InBlock1');
		inBlock1[0] ={
				"D1은행코드":thisObj.dpBtn.getItem(0)['data'],
				"D1은행계좌번호": thisObj.accountNum.getText().replace(/[^0-9]/g, '')
			};
		},
		function(queryData)
		{		
			var errCode = this.getLastError('errCode');	
			//2018.04.24 황청유. 항상 지연응답으로만 에러코드가 내려오는 것이 아님 ex. 지역농축협과 같이 서버측에서 조건을 필터링 할 때도 있음
			//정상인 경우 0181 처리중입니다.   메세지 고정 > PB 화면에 '화면에 처리중입니다' 문구를 보여줘야해서 1차 응답값을 해당 문구로 보냄. 프레임웍에서 처리 불가
			if(errCode>=1000) {
 				AppManager.endOltp();
				theApp.getErrMsg(thisObj,this);
			}else if( queryData) {
			//queryData.printQueryData();
			}
		}, 		
		
		//lazyFunc
		//계정계 지연처리 TR응답		
		function(queryData)
		{
			var errCode = this.getLastError('errCode');
			AppManager.endOltp();
			if( errCode >= 1000 )
			{
				theApp.getErrMsg(thisObj,this);
			} else if( queryData){
				var outBlock = queryData.getBlockData('OutBlock1')[0];
				if(outBlock["D1예금주명"]) {
					thisObj.name.setText(outBlock["D1예금주명"]);
				} else {
					AToast.show('계좌번호를 다시 한번 확인해 주시기 바랍니다.');
				}
				
				//본가동
				if(Define.RELEASE) {
					//고객명 일치 확인
					if(outBlock["D1예금주명"] == theApp.userInfo.getUserData('D1고객명')) {
						thisObj.validAccount = thisObj.accountNum.getText().replace(/[^0-9]/g, '');
						thisObj.validAcc = true;
					//고객명 불일치 시
					}else {
						AToast.show('입력하신 계좌번호의 계좌명과 고객명이 일치하지 않습니다');
						thisObj.validAcc = false;
					}
				//테스트
				} else {
					if(outBlock["D1예금주명"]) {
						thisObj.validAccount = thisObj.accountNum.getText().replace(/[^0-9]/g, '');
						thisObj.validAcc = true;
					//고객명 불일치 시
					}else {
						AToast.show('입력하신 계좌번호의 계좌명과 고객명이 일치하지 않습니다');
						thisObj.validAcc = false;
					}
				}
			} else {
				AToast.show('계좌번호를 다시 한번 확인해 주시기 바랍니다.');
			}
		}
	);
};

// 다음버튼 클릭
MS1005_T10.prototype.onNextBtnClick = function(comp, info)
{
	var acc = this.accountNum.getText();
	if(!this.validAcc) {
		AToast.show('계좌명의 조회를 진행하여 주시기 바랍니다');
		return;
	}
	
	if( false === this.chkBox.getCheck()) {
		AToast.show('이체약정을 해야합니다.');
		return;
	}
	this.processSelected = true;
	//은행이체약정 등록
	this.sendSACAT504();
};

//은행이체약정 등록
MS1005_T10.prototype.sendSACAT504 = function() {

	var thisObj = this;

	QryRequest.request('SACAT504',						
	function(queryData){		
	
		var inBlock1 = queryData.getBlockData('InBlock1')[0];
		
		//약정계좌 등록을 위한 신규 항목
		inBlock1['D1처리구분'] = '1'
		inBlock1['D1종합계좌번호'] = theApp.userInfo.getUserData('D1종합계좌번호');
		inBlock1['D1비밀번호'] = theApp.userInfo.getUserData('D1계좌비밀번호');
		
		inBlock1['D1은행본인계좌여부'] = '1';
		
		inBlock1['D1은행코드'] = thisObj.dpBtn.getItem(0)['data'];
		inBlock1['D1은행계좌번호'] = thisObj.validAccount;
		inBlock1['D1은행계좌명'] = theApp.userInfo.getUserData('D1고객명');
		
		//queryData.printQueryData();
		//계좌개설 전 이어하기: RSA, 계좌개설 후 이어하기: RSA, 처음부터진행: SEED 2018.02.28 HCY -> 처음부터 진행 시 계좌비밀번호 RSA로 변경함 2018.07.03 KJK
		queryData.putPwInfo('InBlock1', 'D1비밀번호', false, AQuery.RSA);
	},
	
	function(queryData)
	{	
		var errCode = this.getLastError('errCode');
		if( errCode >= 1000) {
			AppManager.endOltp();
			//비밀번호 오류 5회중 n회 남았습니다.
			if(errCode == "3669") {
				var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');
				win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">' + this.getLastError('errMsg') + '<br>(' + this.getLastError('trName') + ')' + ' (' + this.getLastError('errCode') + ')</span>';
				win.flag = 1;
				win.openAsDialog(thisObj);
				
			//오류 한도 초과
			} else if(errCode == "1796") {
				var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');
				win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">오류 허용횟수 초과하였습니다.<br>좌측 상단 "계좌개설"초기화면 이동 버튼을 통해 진행중인 내역을 삭제하고 다시 한번 계좌개설을 진행해 주시기 바랍니다.<br>(' + this.getLastError('trName') + ')' + ' (' + this.getLastError('errCode') + ')</span>';
				win.openAsDialog(thisObj);			
				
			} else {
				theApp.getErrMsg(thisObj,this);
			}
		} else if(queryData) {
 			//queryData.printQueryData();
			theApp.saveStep('8', function(){
				thisObj.getContainer().nextView();
			});		
		} else {
			AppManager.endOltp();
			this.printLastError();
			
			AToast.show('통신 상태가 원활하지 않습니다.\n다시 시도해 주십시오');
		}
	});
};

// 금융기관선택 클릭시
MS1005_T10.prototype.onDropBox1Click = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/MS1005_W01.lay','MS1005_W01');
	
	win.bankInfo = this.bankInfo;
	win.openAsDialog(this);
};

// 체크박스 체크 / 언체크
MS1005_T10.prototype.onCheckBox1Click = function(comp, info)
{
	if( false === this.chkBox.getCheck())
	{		
		var win = AWindow.createWindow('FD/window/MS1005_W02.lay','MS1005_W02');
			
		win.infoMsg = '<div style="float:left; width: 100%; height:100%"><span class="R" style="color:#555; font-size:24px; line-height:141%">펀드 자금 출금 시,<br/>자금을 이체할 계좌번호를<br/>입력하여 주시기 바랍니다.<br></span><span class="SB" style="color:#555; font-size:24px; line-height:141%; font-weight:700; margin-top:10px;">출금이체약정은 필수<br/>항목입니다.</span></div>';
		win.openAsDialog(this);
	}
};

MS1005_T10.prototype.onWindowResult = function( result, awindow)
{
	var thisObj = this;
	if( awindow.getContainerId() == 'MS1005_W01') {
		if(result) {
			this.dpBtn.setEditText(result[1]);
			this.dpBtn.setItem( 0, result[1], result[0]);
			//수정시 처리
			this.validAcc = false;
		} else {
		}
	} else if(  awindow.getContainerId() == 'MS1005_W02') {
		//1이면
		if(result == 1) {
			this.chkBox.setCheck(true);
		}
	} else if("MS1005_W06" == awindow.getContainerId()) {
		if(result) {
			theApp.userInfo.setUserData('D1계좌비밀번호', result);
			//계좌비번 오류에서 넘어온 경우
			if(thisObj.processSelected) {
				//nextBtn과 동일함
				//은행이체약정 등록
				this.sendSACAT504();
			}
		} else {
			AToast.show('계좌비밀번호입력에 실패하였습니다. App 종료 후 다시 이용하여 주시기 바랍니다.');
		}
	//오류 메시지
	}  else if ("MS1005_W05" == awindow.getContainerId()) {
		//계좌비번 오류
		if(awindow.flag == 1) {
			//비밀번호 재 입력
			var win = AWindow.createWindow('FD/window/MS1005_W06.lay', 'MS1005_W06');
			win.openAsDialog(this);
		}
	}
}

//계좌번호 항목 변경
MS1005_T10.prototype.onTextField4Change = function(comp, info)
{
	var accountTxt = comp.getText();
	if(accountTxt.length == 0) {
		
		this.cancelbtn.$ele.hide();
	}
	else if(accountTxt.length>0) {
	
		this.cancelbtn.$ele.show();		
	}
	
	this.validAcc = false;
};

//계좌번호 삭제 수행
MS1005_T10.prototype.onCancelBtn1Click = function(comp, info)
{
	this.accountNum.setText("");
	this.cancelbtn.$ele.hide();
	
	this.validAcc = false;
};