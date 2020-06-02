/**
Constructor
Do not call Function in Constructor.
*/
function FD5007_T01()
{
	AView.call(this);	
}
afc.extendsClass(FD5007_T01, AView);


FD5007_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	// Object
	this.cont = this.getContainer();
	
	// 스크롤 관련 영역
	this.view1 = this.findCompById('View1');
	
	// 계좌
	this.accView = this.cont.findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx; 			// 계좌드롭박스
	this.secureTxf = this.accView.secureTxf;	// 계좌비밀번호
	
	
	
	this.contractMoney =  this.findCompById('Money1'); //총계약금액
	this.yearLimit = this.findCompById('TextField1');//당해년도 수령한도 
	this.accOpenedDate = this.findCompById('date1'); //계좌개설일
	this.accLatelyOpenedDate = this.findCompById('date2');//최근개설일
	this.accDate = this.findCompById('date3');//기산일
	this.accDueDate = this.findCompById('date4');//만기일
	this.saveTerm = this.findCompById('TextField2')//저축기간
	this.accAnnual = this.findCompById('TextField3')//연금수령연차
	this.isAccOpened = this.findCompById('TextField4')//연금개시여부
	this.moneyBtn = this.findCompById('BtnModify1');//총계약금액 변경
	this.dayBtn = this.findCompById('BtnModify2'); //저축기간 변경
	
	this.check1 = this.findCompById('Check1');
	this.check2 =  this.findCompById('Check2');
	this.saveTerm.$ele.context.style.background = "#FFFFFF";
	this.contractMoney.$ele.context.style.background = "#FFFFFF";
	
	
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5007_T01.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	this.fnDoSendDataManage();
};



// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5007_T01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	this.SDPAQ070ContiKey = null;

	this.toggle = false;//변경버튼 toggle
	
	this.contractMoney.enable(false);//총계약금액 변경 버튼 클릭 전에는 비활성화
	this.saveTerm.enable(false);//저축기간 변경 버튼 클릭 전에는 비활성화 
	this.check1.setCheck(false);//총계약금액 변경
	this.check2.setCheck(false);//저축기간변경 
	
	
	// 컴포넌트 초기화
	this.onInitComponents();	
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5007_T01.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	// 스크롤 영역 변경	
	this.view1.scrollTo(0);
};


// 컴포넌트 초기화
FD5007_T01.prototype.onInitComponents = function()
{	
	this.contractMoney.setText('');//총계약금액
	this.yearLimit.setText('')//당해년도 수령한도 
	this.accDate.setText('')//기산일
	this.accAnnual.setText('')//연금수령연차
	this.isAccOpened.setText('')//연금개시여부
	this.accOpenedDate.setText('') //계좌개설일
	this.accDueDate.setText('')//만기일
	this.saveTerm.setText('')//저축기간
	this.accLatelyOpenedDate.setText('')//최근개설일
	
};


// 계좌번호 변경 시 이벤트
FD5007_T01.prototype.fnDoSendDataManage = function() 
{

	if(afc.isSimulator){
		this.sendSDPAQ070();
		this.sendSACMQ222();
		PensionCommon.checkLimitPaymentAmount(this);
		this.SDPAQ070ContiKey = null;
		
		this.toggle = false;
		this.check1.setCheck(false);
		this.check2.setCheck(false);
		this.contractMoney.enable(false);

		// 계좌번호 저장
		PensionCommon.setFundAcc(this);

		return;
	}

	if(this.secureTxf.getPwLength() == 0)
	{	
		AToast.show("계좌비밀번호를 입력해주세요.");
		this.secureTxf.addClass('active');
		this.SDPAQ070ContiKey = null;
	
		this.toggle = false;
		this.check1.setCheck(false);
		this.check2.setCheck(false);
		this.contractMoney.enable(false);
		// 컴포넌트 초기화
		this.onInitComponents();
		// 계좌번호 저장
		PensionCommon.setFundAcc(this);
		return;
	}
	this.secureTxf.removeClass('active');
		
	
	// 서비스 조회
	this.sendSDPAQ070();	
	this.sendSACMQ222();
	PensionCommon.checkLimitPaymentAmount(this)
};



// 팝업에서 넘긴 결과
FD5007_T01.prototype.onWindowResult = function(result, windowObj)
{
	if(windowObj.containerId == 'FD5007W01')//저축기간 팝업 
	{
			
		if(result == 1){
			this.toggle = false;
			this.check2.setCheck(false);
			this.saveTerm.enable(false);
			this.saveTerm.setText(5)
			this.sendSACMT296('select');
		}else if(result == 2){
			this.toggle = false;
			this.check2.setCheck(false);
			this.saveTerm.enable(false);
			this.saveTerm.setText(7)
			this.sendSACMT296('select');
		}else if(result == 3){
			this.toggle = false;
			this.check2.setCheck(false);
			this.saveTerm.enable(false);
			this.saveTerm.setText(10)
			this.sendSACMT296('select');
		}else if(result == 4){
			this.toggle = false;
			this.check2.setCheck(false);
			this.saveTerm.enable(false);
			this.saveTerm.setText(15)
			this.sendSACMT296('select');
		}else if(result == 5){
			this.toggle = false;
			this.check2.setCheck(false);
			this.saveTerm.enable(false);
			this.saveTerm.setText(20)
			this.sendSACMT296('select');
		}else if(result == 6){
			this.check2.setCheck(true);
			this.toggle = true;
			this.saveTerm.enable(true);
			this.saveTerm.setText('')
			var thisObj = this;
			setTimeout(function(){
				thisObj.saveTerm.$ele.trigger("focus");
			}, 500);
			
		}	
	}
};


//계좌정보 setting
FD5007_T01.prototype.sendSDPAQ070 = function()
{
	
	var thisObj = this,	
		qrName = "SDPAQ070",
		cont = thisObj.getContainer(),
		cipherData = thisObj.secureTxf.getCipherData();
		
	
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.accDbx.getSelectedItemData()['D1계좌번호']
	};
	
	if(!thisObj.accDbx.getSelectedItemData() || !thisObj.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator && !cipherData) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		thisObj.secureTxf.addClass('active');
		return;
	}
	thisObj.secureTxf.removeClass('active');

	cont.sendData(qrName, 
		function(queryData, groupName)
		{
		
			queryData.setContiKey(thisObj.SDPAQ070ContiKey);
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1계좌번호'] = checkObj.accNo
			InBlock1['D1비밀번호'] = '';

			
			queryData.printQueryData();

		},
		function(queryData, groupName)
		{				
			if(queryData)
			{	
				
				thisObj.SDPAQ070ContiKey = queryData.getContiKey();
				
				var outBlock1 = queryData.getBlockData('OutBlock1')[0];	
				thisObj.yearLimit.setText(outBlock1['D1당해년도연금수령한도금액'])//당해년도 수령한도 
				thisObj.accDate.setText(Utils.formatDotDate(outBlock1['D1계좌기산일']))//기산일
				thisObj.accAnnual.setText(outBlock1['D1당해년도연금수령연차'])//연금수령연차
				thisObj.isAccOpened.setText(outBlock1['D1구분명1'])//연금개시여부
					
				
				queryData.printQueryData();
			}
		});
};

//계좌정보 setting
FD5007_T01.prototype.sendSACMQ222 = function()
{
	
	var thisObj = this,	
		qrName = "SACMQ222",
		cont = thisObj.getContainer(),
		cipherData = thisObj.secureTxf.getCipherData();
		
		
	
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.accDbx.getSelectedItemData()['D1계좌번호']
	};
	
	
	if(!thisObj.accDbx.getSelectedItemData() || !thisObj.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator && !cipherData) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		thisObj.secureTxf.addClass('active');
		return;
	}
	thisObj.secureTxf.removeClass('active');
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
										
				InBlock1['D1계좌번호'] = checkObj.accNo;
				InBlock1['D1입력비밀번호'] = afc.isSimulator ? '0423' : result;
				
				
				if(!afc.isSimulator){
					queryData.putPwInfo('InBlock1', 'D1입력비밀번호');
				}
			},
			function(queryData, groupName)
			{				
				if(queryData)
				{	
				
					queryData.printQueryData();
					var outBlock = queryData.getBlockData('OutBlock1')[0];
					thisObj.contractMoney.setText(outBlock['D1계약금액']) //총계약금액
					thisObj.totalMoney = outBlock['D1계약금액'];//총계약금액
					thisObj.accOpenedDate.setText(Utils.formatDotDate(outBlock['D1계좌개설일'])) //계좌개설일
					thisObj.accDueDate.setText(Utils.formatDotDate(outBlock['D1만기일']))//만기일
					thisObj.saveTerm.setText(outBlock['D1계약기간월수']/12)//저축기간
					thisObj.accLatelyOpenedDate.setText(Utils.formatDotDate(outBlock['D1최종거래일']))//최근개설일
					
				}
			}		
		);
	});
};




//총계약금액 저축기간 변경
FD5007_T01.prototype.sendSACMT296 = function(info)
{
	
	var thisObj = this,	
		qrName = "SACMT296",
		cont = thisObj.getContainer(),
		cipherData = thisObj.secureTxf.getCipherData();
		
		
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.accDbx.getSelectedItemData()['D1계좌번호']
	};
	
	
	if(!thisObj.accDbx.getSelectedItemData() || !thisObj.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator && !cipherData) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		thisObj.secureTxf.addClass('active');
		return;
	}
	thisObj.secureTxf.removeClass('active');
	
	
	if(this.contractMoney.getText() == ''){
		AToast.show('총 계약금액을 입력하세요')
		return;
	}
	
	if(this.saveTerm.getText() == ''){
		AToast.show('저축기간을 입력하세요')
		return;
	}
	
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				var InBlock2 = queryData.getBlockData('InBlock2')[0];
				
				if(info == 'select'){//조회
					queryData.setHeaderInfo({
						FUNC_KEY_LST: 'C'
					});

					InBlock1['D1계좌번호'] = checkObj.accNo;
					InBlock1['D1입력비밀번호'] = afc.isSimulator ? '0423' : result;
					InBlock1['D1상품유형코드'] = '04'
					InBlock1['D1상품상세코드'] = '77'
					InBlock2['D1투자신탁투자자분류코드'] = ''
					InBlock2['D1납입단위금액'] = ''
					InBlock2['D1계약기간월수'] = ''
					InBlock2['D1연금지급시작일'] = ''
					InBlock2['D1최초매수일'] = ''
					InBlock2['D1원장통보주소유형코드'] = ''
					InBlock2['D1매매보고서통보코드'] = ''
					InBlock2['D1계좌기산일'] = ''
					InBlock2['D1가입일선택구분'] = ''
				}else{//수정
					queryData.setHeaderInfo({
						FUNC_KEY_LST: '5'
					});
					
					
					InBlock1['D1계좌번호'] = checkObj.accNo;
					InBlock1['D1입력비밀번호'] = afc.isSimulator ? '0423' : result;
					InBlock1['D1상품유형코드'] = '04'
					InBlock1['D1상품상세코드'] = '77'
					InBlock2['D1투자신탁투자자분류코드'] = info['D1투자신탁투자자분류코드']
					InBlock2['D1납입단위금액'] = thisObj.contractMoney.getText();
					InBlock2['D1계약기간월수'] = thisObj.saveTerm.getText()*12;
					InBlock2['D1연금지급시작일'] = info['D1연금지급시작일']
					InBlock2['D1최초매수일'] = info['D1최초매수일']
					InBlock2['D1원장통보주소유형코드'] = ''
					InBlock2['D1매매보고서통보코드'] = ''
					InBlock2['D1계좌기산일'] = ''
					InBlock2['D1가입일선택구분'] = ''
					
				}
				
				if(!afc.isSimulator){
					queryData.putPwInfo('InBlock1', 'D1입력비밀번호');
				}
				
			},
			function(queryData, groupName)
			{				
				if(queryData)
				{	
				
					queryData.printQueryData();
					var InBlock2 = queryData.getBlockData('InBlock2')[0];
					
					if(info == 'select'){
						
						thisObj.sendSACMT296(InBlock2);
					}else{
						AToast.show('변경이 완료되었습니다');
						
						thisObj.contractMoney.setText(thisObj.contractMoney.getText()) //총계약금액
						thisObj.saveTerm.setText(thisObj.saveTerm.getText())//저축기간
					}
					
				}
			}		
		);
	});
};


//저축기간 팝업
FD5007_T01.prototype.onCheck2Click = function(comp, info)
{
	
	if(!afc.isSimulator && !this.secureTxf.getCipherData()) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		this.check2.setCheck(false);
		this.secureTxf.addClass('active');
		return;
	}
	this.secureTxf.removeClass('active');
	
	
	if(this.toggle == false){// 저축기간 변경 클릭
		this.check2.setCheck(false);
		var win = AWindow.createWindow('FD/window/FD5007_W01.lay', 'FD5007W01');
		win.settingButton = this.saveTerm.getText();
		win.setWindowOption({ isAutoCenter: true });

		win.open(this, 0, 0, 520, 395);
		
	}else{//저축기간 직접입력 변경시 
		
		this.toggle = false;
		if(this.saveTerm.getText()*1 < 5){
			AToast.show('저축기간은 5년 이상입니다');
			return;
		}
		this.sendSACMT296('select');
		this.saveTerm.enable(false);
	}
	

};

// 총계약금액 변경 클릭
FD5007_T01.prototype.onCheck1Click = function(comp, info)
{

	if(!afc.isSimulator && !this.secureTxf.getCipherData()) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		this.check1.setCheck(false);
		this.secureTxf.addClass('active');
		return;
	}
	this.secureTxf.removeClass('active');
	
	
	if(this.check1.getCheck() == true){
		this.contractMoney.enable(true);
		this.contractMoney.setText('');
		var thisObj = this;
		setTimeout(function(){//총계약금액을 활성화 시킨 후 바로 아래 실행하면 키보드 올라오지 않음 0.5초 시간 조정 
			thisObj.contractMoney.$ele.trigger("focus");//키보드 올라옴 
		}, 500);
		
		
	}else{
		//납입가능금액과 바꾸기 전 총계약금액과 비교해야 함 
		if(PensionCommon.limitPay*1+this.totalMoney*1 < this.contractMoney.getText()*1){
			// 팝업
			var win = AWindow.createWindow('FD/window/FD5007_W03.lay', 'FD5007W03');
			win.setWindowOption({ isAutoCenter: true });

			// 팝업으로 넘기는 파라미터 
			win.w_userNm = theApp.userInfo.userObj['D1사용자명']; // 사용자명
			win.w_money	 = PensionCommon.limitPay;	// 납입가능금액
			win.contractMoney = this.totalMoney;


			// 팝업 오픈
			win.open(this, 0, 0, 430, 370);
		}else{

			this.sendSACMT296('select'); // 변경
		}
		this.contractMoney.enable(false);
		
		
		
	}


};
// 연도별 납입상세내역 보기 클릭
FD5007_T01.prototype.onbtnContentClick = function(comp, info)
{

	if(!afc.isSimulator && !this.secureTxf.getCipherData()) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		this.secureTxf.addClass('active');
		return;
	}
	this.secureTxf.removeClass('active');
	
	//TODO:edit here
	var win = AWindow.createWindow('FD/window/FD5007_W02.lay', 'FD5007W02');
	win.open(this, 0, 0, '100%', '100%');

};


//나의 연금저축한도는 ?
FD5007_T01.prototype.onLimitLabelActionUp = function(comp, info)
{
	if(!afc.isSimulator && !this.secureTxf.getCipherData()) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		this.secureTxf.addClass('active');
		return;
	}
	this.secureTxf.removeClass('active');
	
	
	
	var win = AWindow.createWindow('FD/window/FD5001_W04.lay', 'FD5001_W04');
	win.limitPay = PensionCommon.limitPay;
	win.name = PensionCommon.name;
	win.open(this,0,0,'100%','100%');
	
	

};
