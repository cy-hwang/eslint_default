
/**
Constructor
Do not call Function in Constructor.
*/
function FD2101_V12()
{	
	AView.call(this);
	this.grid = null;
	this.cnt = null;
	//TODO:edit here
	
	//이전단계에서 가져온 data
	this.drawAmt = null;
	this.cipherData = null;
	
	//예, 아니오  버튼
	this.nextBtn = null;
	this.beforeBtn = null;
	
	//출금계좌
	this.drawAccNum = null; 		   //출금계좌
	
	//비동기
	this.timeOutFunc = null;	//비동기 타임아웃설정
	this.afterCallback = null;	//비동기 글로벌 콜백설정
};

afc.extendsClass(FD2101_V12, AView);

FD2101_V12.prototype.init = function(context, evtListener)
{	
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	this.cnt = this.getContainer(); //FD2101
	this.grid = this.findCompById("Grid1");
	
	//예, 아니오  버튼
	this.nextBtn = this.findCompById("nextBtn");
	this.beforeBtn = this.findCompById("beforeBtn");
	
	//예금주
	this.depositAccNm = this.findCompById("Label8");
};


//비동기 응답 설정
FD2101_V12.prototype.onWillActive = function(reload)
{	
	AView.prototype.onWillActive.call(this, reload);	
	var thisObj = this;		
	theApp.accNetManager.addQueryListener(this);
	
	//그리드세팅
	var vDrawAmt = afc.addComma(this.cnt.drawAmt1)+' 원';
	var vDepositBankNm = this.cnt.depositBankNm1;
	var vDepositAccNum = this.cnt.depositAccNum1; 
	var vDrawAccNm = this.cnt.depositAccNm1;
	
	this.grid.setCellText(0,1,vDepositAccNum) ;  //출금지정계좌번호
	this.grid.setCellText(1,1,vDepositBankNm) ;  //출금지정은행명
	//this.grid.setCellText(2,1,vDepositSignName) ; 	//상대통장표시내용	
	this.grid.setCellText(2,1,vDrawAmt) ; 		 //보낼금액	
	this.depositAccNm.setText(vDrawAccNm);       //예금주
};

//비동기 응답 설정 해지
FD2101_V12.prototype.onWillDeactive = function(reload)
{
	AView.prototype.onWillDeactive.call(this, reload);	
	this.resetData();
	theApp.accNetManager.removeQueryListener(this);
	
	//남아 있을 비동기 타임아웃 이벤트 삭제
	if(this.timeOutFunc) clearTimeout(this.timeOutFunc);
};

FD2101_V12.prototype.resetData = function(){
	//theApp.commMsgBox.removeAll();	
	//this.gubun = '';
	
	//탭변경 후 버튼 활성화 
	this.nextBtn.enable(true);
	this.beforeBtn.enable(true);
}

FD2101_V12.prototype.onbeforeBtnClick = function(comp, info)
{
	//TODO:edit here
	//this.getContainer().tbvManager.changeTab('FD2101_V11');
	this.cnt = this.getContainer();
	//다음단계로 탭변경
	this.cnt.tbvManager.getActiveView().tvManager.changeTab('TabBtn1');
};

FD2101_V12.prototype.onnextBtnClick = function(comp, info)
{
	//TODO:edit here
	
	//휴대폰본인확인 프로세스 추가
	
	//이체실행
	this.doSendData_SDPKT360(function(oBlock){
		this.getContainer().depositAccAmt1 = oBlock['D1예수금금잔금액'];
		
		//다음단계로 탭변경
		this.cnt.tbvManager.getActiveView().tvManager.changeTab('TabBtn3');
	});
};

FD2101_V12.prototype.doSendData_SDPKT360 = function(callback){
	var thisObj = this,
		cont = thisObj.getContainer(),
		cipherData = this.cnt.drawAccPwdNum1.getCipherData();
	
	//SDPKT360 InBlock1 세팅	
	var tmpDrawAccNum = this.cnt.drawAccNum1;
	var tmpDrawAmt = this.cnt.drawAmt1; 
	var tmpDrawAccNm = this.cnt.depositAccNm1;
	var tmpDepositBankCd = this.cnt.depositBankCd1;
	var tmpDepositAccNum = this.cnt.depositAccNum1;
	
	//20180130
	var checkObj = {
		svcId : 'SDPKT360',
		accNo : tmpDrawAccNum
	};
	
	//이체처리전 false 
	this.nextBtn.enable(false);
	this.beforeBtn.enable(false);
	
	/************************************/	
	//비동기콜백 글로벌에 저장
	thisObj.afterCallback = callback;
	/************************************/
	
	//보안키패드 설정, 오류코드 설정 추후 확인 필요
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
	theApp.accNetManager.addSkipErrorCode('SDPKT360', '3130');
		if(!cont.sendData('SDPKT360', function(queryData, groupName){
		queryData.setHeaderInfo({
			FUNC_KEY_LST: '5'
		});
		
		var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1카드회사번호'] = '';
			InBlock1['D1카드계좌번호'] = '';
			InBlock1['D1카드유형코드'] = '';
			InBlock1['D1카드발급건수'] = '';
			InBlock1['D1책임자카드회사번호'] = '';
			InBlock1['D1책임자카드계좌번호'] = '';
			InBlock1['D1책임자카드유형코드'] = ''; 
			InBlock1['D1책임자카드발급횟수'] = '';
			InBlock1['D1승인요청일'] = '';	//MetaInfo.fnGetToday('NUMDATE');
			InBlock1['D1승인처리ID'] = '';
			InBlock1['D1최종승인자ID'] = '';
			InBlock1['D1승인사용자명'] = '';
			InBlock1['D1승인자추가메시지'] = '';
			InBlock1['D1중계은행코드'] = ''; //앞을 '0'으로 채움, 예) 국민은행 '004'
			InBlock1['D1출금계좌번호'] = tmpDrawAccNum;
			InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;
			InBlock1['D1출금금액'] = tmpDrawAmt;
			InBlock1['D1입금은행코드'] = tmpDepositBankCd;
			InBlock1['D1은행계좌번호'] = tmpDepositAccNum;
			InBlock1['D1수취인명'] = tmpDrawAccNm;
			InBlock1['D1은행이체비밀번호'] = '';
			InBlock1['D1출금유형'] = '1'; 
			//1:예수금출금, 2:금액매도출금, 3:좌수매도출금, 4:전액출금, 5:환매전액출금, 6:채권원리금출금, 7:정산차금출금, 8:현금증거금출금
			InBlock1['D1투신펀드코드'] = '';
			InBlock1['D1의뢰인명'] = ''; 
			InBlock1['D1전화국번호'] = '';
			InBlock1['D1전화지역번호'] = '';
			InBlock1['D1전화일련번호'] = '';
			InBlock1['D1수수료구분'] = '';
			InBlock1['D1지연이체구분'] = '';
			InBlock1['D1지연이체시간'] = ''; 
			InBlock1['D1지연이체구분코드'] = '';
			InBlock1['D1필러200'] = '';
			queryData.putPwInfo('InBlock1', 'D1비밀번호');	
			//	theApp.setBriefSign(queryData);	
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName) {
			var errorData = this.getLastError();	
			
			
			//에러처리필요
			if(!queryData){
				
				//if(afc.isSimulator) queryData.printQueryData();	
				//전단계로 탭변경
				thisObj.cnt.tbvManager.getActiveView().tvManager.changeTab('TabBtn1');
				
				//탭변경 후 버튼 활성화 
				thisObj.nextBtn.enable(true);
				thisObj.beforeBtn.enable(true);
				return;
			}
			
			var oBlock = queryData.getBlockData('OutBlock1')[0];
		},tmpDrawAccNum))
		{
			//취소 시 버튼 활성화
			thisObj.nextBtn.enable(true);
			thisObj.beforeBtn.enable(true);
			return;
		};
	});
};

//비동기 응답 데이터 수신부 override
FD2101_V12.prototype.afterOutBlockData = function(queryData, groupName, trName, manager)
{	
	var thisObj = this,
		errCode = '1000',
		packetType = manager.rcvBuf.getByte(OS_CH_TG_TP);		
	
	//계정계 지연처리 TR응답
	if(packetType==PACKET_TYPE.E)
	{
		if(trName=='SDPKT360')
		{
			//코드저장
			errCode = manager.errorData.errCode;
		
			//비정상(오류)
			if(errCode>=1000)
			{				
				if(afc.isSimulator) afc.log([manager.errorData.errMsg, ' : ',  errCode].join(''));
				if(errCode == 3130) {
					if(!queryData)
					{
						var msg = manager.errorData.errMsg.replace('콜센터', '고객지원센터') + '(' + manager.errorData.trName + ', ' + manager.errorData.errCode + ')';
						theApp.alert(msg, null, '메시지');		
					} else {
						var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
						var msg = OutBlock1['D1은행메시지내용'] + '(' + 'SDPKT360' + ', ' + OutBlock1['D1은행응답코드'] + ')';
						theApp.alert(msg, null, '메시지');	
					}
				}
				if(thisObj.afterCallback) thisObj.afterCallback(null);
				return;
			
			}			
			
			if(!queryData)
			{
			 	if(afc.isSimulator) afc.log('queryData null!');
				if(activeView.afterCallback) activeView.afterCallback(null);
			}
			else
			{

				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
				thisObj.afterCallback(OutBlock1, errCode);
				//if(activeView.afterCallback) activeView.afterCallback(OutBlock1, errCode);
				
				if(afc.isSimulator) queryData.printQueryData();
				
				//이체처리 후 true
				this.nextBtn.enable(true);
				this.beforeBtn.enable(true);
	
				/*if(Utils.leadingZeros(OutBlock1['D1은행응답코드'],4) != 0000){
					//은행메세지 처리
					theApp.commMsgBox.addItem('['+OutBlock1['D1은행응답코드']+']'+OutBlock1['D1은행메시지내용'],OutBlock1['D1은행응답코드']);
					indx = theApp.commMsgBox.element.options.length;
					theApp.commMsgBox.selectItem(indx-1);									
					thisObj.nextBtn.enable(false);

				}	*/				
			}
		}
	}
};