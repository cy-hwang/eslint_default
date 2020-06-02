
/**
Constructor
Do not call Function in Constructor.
*/
function FD5006_T01()
{
	AView.call(this);	
}
afc.extendsClass(FD5006_T01, AView);


FD5006_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	// Object
	this.cont = this.getContainer();
	
	// 스크롤 관련 영역
	this.centerView = this.findCompById('CenterView');
	
	// 계좌
	this.accView = this.cont.findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx; 			// 계좌드롭박스
	this.secureTxf = this.accView.secureTxf;	// 계좌비밀번호
		
	// 그리드
	this.grid = this.findCompById('Grid'); 
		
	// 리스트 뷰
	this.listView = this.findCompById('ListView');
	this.listView.setDelegator(this);
	
	// Nodata 뷰
	this.nodata = this.findCompById('Nodata');
	
	// 2019.10.18. 조회표시 기준일자
	this.lblStandDate = this.findCompById('LblStandDate');
	
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5006_T01.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	this.fnDoSendDataManage();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5006_T01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	// 2020.04.21. 적립식매수절차 팝업 요청 (2020.04.30. 까지만 오픈하도록 요청)
	// 2020.05.04. 이미지 변경하여 적립식매수절차 팝업 요청(2020.05.11. 까지만 오픈하도록 요청)
	
	var now = new Date();			
	var now2 = null;			
	now2 = now.format('yyyyMMdd');	
	
	var popupEvtDate = theApp.prefInfo.get('MonthBuyStepDate');
	
//	if(now2 <= 20200430){
	if(now2 <= 20200511){
		if(popupEvtDate < now2){
			var win = AWindow.createWindow('FD/window/FD0000_W17.lay', 'FD000W17');
			win.open(this, 0, 0, '100%', '100%');
		}
	}
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5006_T01.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.centerView.scrollTo(0);
	
};


// 컴포넌트 초기화
FD5006_T01.prototype.onInitComponents = function()
{
	// 기준일
	this.ordDt = null;
	
	// 그리드 데이터
	this.money1 = 0;	// 현금 
	this.money2 = 0;	// 투자원금
	this.money3 = 0;	// 펀드평가액(세전)
	this.money4 = 0;	// 수익률(세전)
	
	
	// 계좌 컨트롤
	this.cont.onAccViewControl();

	// 그리드뷰 초기화
	for(var i=0; i<4; i++)
	{
		this.grid.setCellText(i, 1, "");
	}
	
	// 리스트뷰 내의 모든 아이템 삭제
	this.listView.removeAllItems();	
	
	// Nodata뷰 보이게 처리
	this.nodata.show(AComponent.VISIBLE);
	
	// 2019.10.18. 조회표시 기준일자
	this.lblStandDate.setText('');
	
};


// 계좌번호 변경 시 이벤트
FD5006_T01.prototype.fnDoSendDataManage = function() 
{	
	// 계좌번호 저장
	PensionCommon.setFundAcc(this);
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 서비스 조회
	this.sendSDPAQ001();	
};


// 서비스 조회
FD5006_T01.prototype.sendSDPAQ001 = function()
{
	var thisObj = this;
	
	// 계좌번호가 없으면
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	// 리스트뷰 내의 모든 아이템 삭제
	thisObj.listView.removeAllItems();
	
	// 조회
	this.cont.sendData('SDPAQ001', 
		function(queryData, groupName)
		{
			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
			InBlock1['D1비밀번호'] = '';
			
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{
			if(!queryData)
			{
				thisObj.sendSOFFQ447();
				return;
			}
			else // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock4 = queryData.getBlockData('OutBlock4')[0];
				
				if(!OutBlock4) return;
				
				thisObj.money1 = OutBlock4['D1예수금총액'];
				
				thisObj.sendSCMAQ048();
			}
		}
	);
};


// 서비스 조회
FD5006_T01.prototype.sendSCMAQ048 = function()
{
	/*var thisObj = this;
	
	// 조회
	theApp.accNetManager.sendProcessByName('SCMAQ048', null, null,
		function(queryData)
		{
			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1일자공통그룹코드'] = '010';
			
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{
			if(!queryData)
			{
				thisObj.sendSOFFQ447();
				return;
			}
			else // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
				
				if(!OutBlock1) return;
				
				thisObj.ordDt = OutBlock1['D1주문일'];
				
				// 2019.10.18. 조회표시 기준일자 
				thisObj.lblStandDate.setText("(" + thisObj.ordDt.substring(0,4) + "." + thisObj.ordDt.substring(4,6) + "." + thisObj.ordDt.substring(6,8) + " 기준)");
				
				thisObj.sendSOFFQ447();
			}
		}
	);	*/
	this.ordDt = theApp.userInfo.get('BizDt');
	this.lblStandDate.setText("(" + this.ordDt.substring(0,4) + "." + this.ordDt.substring(4,6) + "." + this.ordDt.substring(6,8) + " 기준)");
	this.sendSOFFQ447();
};


// 서비스 조회
FD5006_T01.prototype.sendSOFFQ447 = function(contiKey)
{
	var thisObj = this;

	// 계좌번호가 없으면
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		return;
	}

	// 연속키가 없으면
	if(!contiKey)	
	{
		// 리스트뷰 내의 모든 아이템 삭제
		thisObj.listView.removeAllItems();	
	}

	// 등록된 내용이 없습니다. Skip 처리
	theApp.accNetManager.addSkipErrorCode('SOFFQ447', '2679');
	// 펀드 기준가 오픈전입니다. 기준가 오픈후 조회 가능합니다.(SOFFQ447, 3742) Skip 처리
	theApp.accNetManager.addSkipErrorCode('SOFFQ447', '3742');
	
	// 조회
	this.cont.sendData('SOFFQ447',
		function(queryData, groupName)
		{
			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1조회구분'] = '1';	// Default
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
			InBlock1['D1비밀번호'] = '';
			InBlock1['D1실명확인번호'] = '';
			InBlock1['D1기준일'] = thisObj.ordDt;
			
			if(afc.isSimulator) queryData.printQueryData();
			
			if(contiKey) // 연속키가 있으면 
			{
				queryData.setContiKey(contiKey); // 연속키 저장	
			}
		},
		function(queryData, groupName)
		{
			theApp.accNetManager.removeSkipErrorCode('SOFFQ447', '3742');
			
			var errorData = this.getLastError();	
			
			if(errorData.errCode == '3742') {

				var Msg = ['오전 9시이후부터','<br/>','조회하실 수 있습니다.','<br/>','(한국시간기준)'].join('');

				theApp.alert(Msg,null,"알림");

			}
			
			if(!queryData)
			{
				thisObj.setGridList();	
				return;
			}
			else // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
				var OutBlock2 = queryData.getBlockData('OutBlock2');
		
				// 수익률 그리드
				thisObj.money2 = OutBlock1['D1원금합계금액'];
				thisObj.money3 = OutBlock1['D1평가금액합계'];
				thisObj.money4 = OutBlock1['D1평가수익률'];
				
				// 보유펀드 Nodata뷰
				if(!OutBlock2 || OutBlock2.length == 0)
				{
					thisObj.nodata.show(AComponent.VISIBLE);
				}
				else
				{
					thisObj.nodata.show(AComponent.GONE);
				}
				
				// 연속키 저장
				thisObj.contiKey = queryData.getContiKey();
				
				// 연속키가 있으면
				if(contiKey)
				{
					thisObj.setList(OutBlock2);
				}
				else // 연속키가 없으면
				{
					thisObj.setGridList(OutBlock2);
				}
			}
		}
	);	
};


// 그리드와 리스트 셋팅
FD5006_T01.prototype.setGridList = function(item)
{
	this.setGrid();
	this.setList(item);
};


// 수익률 그리드 셋팅
FD5006_T01.prototype.setGrid = function()
{
	this.grid.setCellText(0, 1, afc.addComma(this.money1) + '원');
	this.grid.setCellText(1, 1, afc.addComma(this.money2) + '원');
	this.grid.setCellText(2, 1, afc.addComma(this.money3) + '원');
	
	if($.isNumeric(this.money4))
	{
		this.grid.setCellText(3, 1, afc.floorPer(this.money4, 2));
	}
	else
	{
		this.grid.setCellText(3, 1, '0%');
	}
};


// 리스트 셋팅
FD5006_T01.prototype.setList = function(item)
{
	if(item)
	{
		this.listView.addItem('FD/view/FD5006_V01.lay', item);	
	}
};


// 리스트뷰 데이터 바인딩
FD5006_T01.prototype.bindData = function(item, data, listview)
{
	if(item.view.setData)
	{
		item.view.setData(data);
	}
};


// 뷰를 하단으로 스크롤
FD5006_T01.prototype.onCenterViewScrollBottom = function(comp, info)
{
	if(this.contiKey)
	{
		this.sendSOFFQ447(this.contiKey);
	}
};


