
/**
Constructor
Do not call Function in Constructor.
*/
function FD5002_V03()
{
	AView.call(this);
}
afc.extendsClass(FD5002_V03, AView);


FD5002_V03.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	// Object
	this.cont = this.getContainer();

	// 계좌
	this.accView = this.findCompById('AccView').loadView;
	this.accView.setDelegator(this);
	this.cont.onAccViewControl(this.accView);
		
	// 고객정보
	this.userAddr = this.findCompById("TextField2");	// 주소
	this.userTelNum = this.findCompById("TextField3"); 	// 연락처
	
	// 타금융정보
	this.otherBankNm = this.findCompById("TextField4");		// 타금융기관명
	this.otherBranchNm = this.findCompById("TextField5");	// 타금융기관지점명
	this.otherBankAccNum = this.findCompById("TextField6");	// 타금융기관계좌번호
	
	// 가입일
	this.rdoRegistBtn01 = this.findCompById("RdoRegistBtn01");	// 기존가입일
	this.rdoRegistBtn02 = this.findCompById("RdoRegistBtn02");	// 신규가입일
	
	// 확인 버튼
	this.btnCheck = this.findCompById("BtnCheck");
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5002_V03.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 고객정보 셋팅
	this.initUserInfo();
	
	// 계좌 초기화
	this.initAccView();
	
	// doInitAccInfo에서 계좌가 없을 시 아래 이벤트 실행
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		this.fnDoSendDataManage();
	
		// 연금저축계좌보유 체크
		this.cont.onCheckAccInfo(this.cont.accTypeCd);
	}
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5002_V03.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5002_V03.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.$ele.parent().scrollTop(0);
};


// 고객정보 셋팅
FD5002_V03.prototype.initUserInfo = function()
{
	// 고객정보 조회
	this.cont.sendSACMT901(this, this.cont);
};


// sendSACMT901 콜백함수
FD5002_V03.prototype.callbackSACMT901 = function(param)
{
	// TextField 셋팅
	this.userAddr.setText(param.addr);		// 주소
	this.userTelNum.setText(param.cellPh); 	// 연락처
	
	if(param.userAddr != '') this.userAddr.setReadOnly(true);
	if(param.userTelNum != '') this.userTelNum.setReadOnly(true);
};


// 계좌 초기화
FD5002_V03.prototype.initAccView = function()
{	
	// 계좌드롭박스
	this.accDbx = this.accView.accDbx;
	
	// 계좌 // doInitAccInfo에서 계좌가 있을 시 fnDoSendDataManage 함수실행
	this.accView.doInitAccInfo(this.cont.accTypeCd);
};


// 컴포넌트 초기화
FD5002_V03.prototype.onInitComponents = function()
{
	// TextField 초기화
	var textFields = [this.userAddr, this.userTelNum, 
			this.otherBankNm, this.otherBranchNm, this.otherBankAccNum];
	
	for(var i=0; i<textFields.length; i++)
	{
		if( textFields[i].$ele.attr('readonly') == undefined )
		{
			textFields[i].setText("");
			textFields[i].removeClass('active');
		}
	}
	
	// 가입일 (Default : 신규가입일)
	this.rdoRegistBtn01.setSelect(false);	// 기존가입일 : 2
	this.rdoRegistBtn02.setSelect(true);	// 신규가입일 : 1
	this.rdoRegistSelect = "1"; 			// 기본값 셋팅
};


// 계좌번호 변경 시 이벤트
FD5002_V03.prototype.fnDoSendDataManage = function() 
{
	// 계좌번호 저장
	PensionCommon.setFundAcc(this);
	
	// 컴포넌트 초기화
	this.onInitComponents();
};


// 가입일 선택
FD5002_V03.prototype.onRdoRegistBtnClick = function(comp, info)
{
	var selectBtnId = comp.getComponentId();
	var btn01 = {"rdoBtn" : this.rdoRegistBtn01, "rdoVal" : "2"};
	var btn02 = {"rdoBtn" : this.rdoRegistBtn02, "rdoVal" : "1"};
	
	this.rdoRegistSelect = this.cont.onRdoRegistBtnClick(selectBtnId, btn01, btn02);
};


// 가입일 비교표 (전체 팝업)
FD5002_V03.prototype.onInfoRegistDateBtnClick = function(comp, info)
{
	this.cont.onInfoRegistDateBtnClick(this);
};


// 신청하기 버튼 클릭
FD5002_V03.prototype.onBtnCheckClick = function(comp, info)
{
	// 필드값체크
	if(!this.validForm())
	{
		return;
	}
	
	// 서비스 조회
	this.sendSOFFT316('C');
};


// 서비스 조회 (조회 후 UPDATE)
FD5002_V03.prototype.sendSOFFT316 = function(funcKey)
{
	var thisObj = this;

	// 계좌번호가 없으면
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	// 조회
	this.cont.sendData("SOFFT316",
		function(queryData, groupName)
		{	
			queryData.setHeaderInfo({
				FUNC_KEY_LST: funcKey
			});

			var InBlock1 = queryData.getBlockData('InBlock1')[0];				
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
			InBlock1['D1접수일'] = Utils.yyyymmdd(new Date());
			InBlock1['D1접수번호'] = '0';	// Default
			InBlock1['D1접수구분'] = '1';	// 1: 접수, 2: 정정, 3: 취소, 4: 거절
			InBlock1['D1비고200'] = thisObj.userAddr.getText();	// 주소
			InBlock1['D1비고'] = thisObj.userTelNum.getText();	// 연락처
			InBlock1['D1가입일선택구분'] = thisObj.rdoRegistSelect; // 1: 신규가입일, 2: 기존가입일
			InBlock1['D1은행코드'] = '';
			InBlock1['D1은행계좌번호'] = '';
			InBlock1['D1은행계좌명'] = '';
			InBlock1['D1이체수수료'] = '';
			InBlock1['D1상대기관명'] = thisObj.otherBankNm.getText();
			InBlock1['D1상대지점명'] = thisObj.otherBranchNm.getText();
			InBlock1['D1상대계좌번호'] = thisObj.otherBankAccNum.getText();
			InBlock1['D1사유구분'] = '';
			InBlock1['D1취소사유'] = '';
			InBlock1['D1접수거부사유'] = '';
			InBlock1['D1상대기관코드'] = '';
			InBlock1['D1연금계좌코드'] = '';
			InBlock1['D1제도가입일'] = '';
			InBlock1['D1개인부담금납입여부'] = '';
			
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName) 
		{
			var errMsg = this.getLastError('errMsg');
			var errCode = this.getLastError('errCode');
			
			if(funcKey == 'C') // 조회
			{
				if(errCode == '36') // 등록된 내역이 없습니다. 입력 후 확인버튼을 누르십시오.
				{
					// 서비스 조회
					thisObj.sendSOFFT316('5');
				}
			}
			else if(funcKey == '5') // UPDATE
			{
				if(!queryData)
				{
					return;
				}
				else // 성공
				{
					if(afc.isSimulator) queryData.printQueryData();
				
					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];

					if(!OutBlock1) return;
					
					// 내보내기 완료로 이동
					thisObj.cont.tvManager.getActiveView().tbvManager.changeTab('FD5002_V04');
				}
			}
	    }
	);
};


// 텍스트 필드의 Blur 이벤트
FD5002_V03.prototype.onTextFieldBlur = function(comp, info)
{
	// active 클래스 제거
	comp.removeClass('active');
};


// 텍스트 필드의 Focus 이벤트
FD5002_V03.prototype.onTextFieldFocus = function(comp, info)
{
	var textFields = [this.userAddr, this.userTelNum, 
			this.otherBankNm, this.otherBranchNm, this.otherBankAccNum];
	
	for(var i=0; i<textFields.length; i++)
	{
		textFields[i].removeClass('active');
	}
	
	// active 클래스 추가
	comp.addClass('active');
};


// 필드값체크
FD5002_V03.prototype.validForm = function()
{
	// 주소
	if(!this.userAddr.getText().trim())
	{
		AToast.show("주소를 입력해주십시오.");
		this.userAddr.addClass('active');
		return false;
	}
	
	// 연락처
	if(!this.userTelNum.getText().trim())
	{
		AToast.show("연락처를 입력해주십시오.");
		this.userTelNum.addClass('active');
		return false;
	}
	
	// 타금융기관명
	if(!this.otherBankNm.getText().trim())
	{
		AToast.show("상대기관명을 입력해주십시오.");
		this.otherBankNm.addClass('active');
		return false;
	}

	// 타금융기관지점명
	if(!this.otherBranchNm.getText().trim())
	{
		AToast.show("상대기관지점명을 입력해주십시오.");
		this.otherBranchNm.addClass('active');
		return false;
	}

	// 타금융기관계좌번호
	if(!this.otherBankAccNum.getText().trim())
	{
		AToast.show("계좌번호를 입력해주십시오.");
		this.otherBankAccNum.addClass('active');
		return false;
	}
	
	return true;
};


