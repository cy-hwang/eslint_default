/**
Constructor
Do not call Function in Constructor.
*/
function FD5007_T06()
{
	AView.call(this);
	
	this.tbvManager = null;
	
}
afc.extendsClass(FD5007_T06, AView);


FD5007_T06.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	// Object
	this.cont = this.getContainer();
	
	// 계좌
	this.accView = this.cont.findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx; 			// 계좌드롭박스
	this.secureTxf = this.accView.secureTxf;	// 계좌비밀번호
	
	// 개시신청
	this.applyDt = this.findCompById('TextField1');	// 연금개시예정일
	this.btnApply = this.findCompById('BtnApply');	// 신청하기
	
	// 조회기간버튼
	this.inqryView = this.findCompById('InqryView');
	this.inqryPeriodBtn = this.findCompById('InqryPeriodBtn');
	
	// 뷰
	this.view1 = this.findCompById('View1');
	this.view2 = this.findCompById('View2');
	this.view3 = this.findCompById('View3');
	this.view6 = this.findCompById('View6');
	
	// 서브탭
	this.button1 = this.findCompById('Button1');	// 신청내역
	this.button2 = this.findCompById('Button2');	// 지급내역
	this.subTabBtns = [
		{ btnComp : this.button1, btnVal : '0', tabId : 'FD5007_T07' },
		{ btnComp : this.button2, btnVal : '1', tabId : 'FD5007_T08' }
	];
	
	// 서브탭 뷰
	this.tabView = this.findCompById('TabView1');	
	
	this.tbvManager = new TabViewManager();	
	this.tbvManager.initManager(this.tabView, new RadioBtnManager(this));		

	this.tbvManager.addTab({url:'FD/view/FD5007_T07.lay', tabId:'FD5007_T07', name:'신청내역'});
	this.tbvManager.addTab({url:'FD/view/FD5007_T08.lay', tabId:'FD5007_T08', name:'지급내역'});
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5007_T06.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 컴포넌트 초기화
	this.onInitComponents();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5007_T06.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	// 서브탭 초기화
	this.onInitSubTabData();
	
	// 검색조건 초기화
	this.onInitSearchData();
	
	this.fnDoSendDataManage();
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5007_T06.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.$ele.scrollTop(0);
};


// 서브탭 초기화
FD5007_T06.prototype.onInitSubTabData = function()
{
	// 서브탭 셋팅
	this.selectTabId = 'FD5007_T07'; 
	
	// 서브탭 활성화
	this.onSubTabEnable(0);
	
	// Height 셋팅
	this.onSetViewHeight(0);
};


// 검색조건 초기화
FD5007_T06.prototype.onInitSearchData = function()
{
	// 날짜
	var d = new Date();
	d.setMonth(d.getMonth() - 1); // 1개월
	
	// 팝업으로 넘기는 파라미터 
	this.w_inqryIndex 	= 1;	// 조회기간 인덱스
	this.w_inqryTypeCd 	= '1'; 	// 조회기간 타입코드 (1:1개월)
	this.w_trsfIndex 	= 0;	// 거래구분 인덱스
	this.w_trsfTypeCd 	= '%%';	// 거래구분 타입코드 (%%:전체)
	this.w_startDate 	= Utils.yyyymmdd(d);			// 시작일
	this.w_endDate 		= Utils.yyyymmdd(new Date());	// 종료일
	
	// 조회기간버튼 텍스트 셋팅
	this.inqryPeriodBtn.setText('1개월 · 전체');
};


// 컴포넌트 초기화
FD5007_T06.prototype.onInitComponents = function()
{	
	// 신청하기 버튼 비활성화
	this.btnApply.enable(false);
};


// 계좌번호 변경 시 이벤트
FD5007_T06.prototype.fnDoSendDataManage = function()
{
	// 계좌번호 저장
	PensionCommon.setFundAcc(this);
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 서비스 조회
	this.sendSDPAQ070();
};


// 서비스 조회
FD5007_T06.prototype.sendSDPAQ070 = function()
{
	var thisObj = this;
	
	// 계좌번호가 없으면
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	// 조회
	theApp.accNetManager.sendProcessByName('SDPAQ070', null, null,
		function(queryData)
		{
			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
			InBlock1['D1비밀번호'] = '';
			InBlock1['D1금액'] = '0';
			InBlock1['D1세금징수구분'] = '';
			InBlock1['D1출금유형코드'] = '30'; // 30: 출금
			InBlock1['D1해지구분'] = '0'; // 0: 해당없음
			
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{
			if(!queryData)
			{
				
			}
			else if(queryData) // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
				
				if(!OutBlock1) return;
				
				// 연금개시예정일 셋팅
				var dt = OutBlock1['D1연금개시예정일'];
				var dtYear 	= dt.substring(0,4);
				var dtMonth = dt.substring(4,6);
				var dtDay 	= dt.substring(6,8);
				
				thisObj.applyDt.setText(dtYear + '-' + dtMonth + '-' + dtDay);
				
				// 연금개시예정일 이후의 영업일이면 신청하기 버튼 활성화
				var today = MetaInfo.fnGetToday('NUMDATE');
				if( Number(today) > Number(dt) )
				{
					thisObj.btnApply.enable(true); 
				}
			}
			
			// 서브탭 이동
			thisObj.onSubTabChange();
		}
	);
};


// 서브탭 클릭
FD5007_T06.prototype.onButtonClick = function(comp, info)
{
	// 서브탭 활성화
	if(comp == this.button1) // 신청내역
	{
		this.onSubTabEnable(0);
	}
	else if(comp == this.button2) // 지급내역
	{
		this.onSubTabEnable(1);
	}
	
	// Height 셋팅
	this.onSetViewHeight(0);
	
	// 서브탭 이동
	this.onSubTabChange();
};


// 서브탭 활성화
FD5007_T06.prototype.onSubTabEnable = function(selectVal)
{
	var tabs = this.subTabBtns;

	// 조회기간버튼 숨김/보임 처리
	if(selectVal == 0)
	{
		this.inqryView.show(AComponent.GONE);
	}
	else
	{
		this.inqryView.show(AComponent.VISIBLE);
	}

	// 탭 활성화
	for(var i = 0; i < tabs.length; i++)
	{
		tabs[i].btnComp.enable(true);
		
		if(selectVal == tabs[i].btnVal)
		{
			// 서브탭 활성화
			tabs[i].btnComp.enable(false);
			
			// 선택된 서브탭 셋팅
			this.selectTabId = tabs[i].tabId ;	
		}
	}
};


// 서브탭 이동
FD5007_T06.prototype.onSubTabChange = function()
{
	this.tbvManager.changeTab(this.selectTabId, false);
};


// 서브탭에서 높이 셋팅
FD5007_T06.prototype.onSetViewHeight = function(height)
{
	if(height == 0) // 데이터가 없을 시
	{
		var baseHeight = 460;
		
		var thisH = this.getHeight();
		var v6H = this.view6.getHeight();
		var v2H = this.view2.getHeight();
		var vIqryH = this.inqryView.getHeight();
		var mgnBtm = 30;
		var subHeight = thisH - v6H - v2H - vIqryH - mgnBtm;
		
		if(this.selectTabId == 'FD5007_T07')
		{
			subHeight = subHeight;
			baseHeight = baseHeight;
		}
		else if(this.selectTabId == 'FD5007_T08')
		{
			subHeight = subHeight - 80;
			baseHeight = baseHeight - 80;
		}
		
		height = baseHeight;
		
		if(subHeight > baseHeight)
		{
			height = subHeight
		}
	}
	
	this.view3.setHeight( height );
};


// 서브탭에서 뷰를 하단으로 스크롤
FD5007_T06.prototype.onScrollBottom = function(comp, info)
{
	var subView = this.tbvManager.getActiveView(); // 선택 서브 뷰
	if(subView && subView.onScrollBottom)
	{
		subView.onScrollBottom();
	}
};


// 서브탭 조회 팝업
FD5007_T06.prototype.onInqryPeriodBtnClick = function(comp, info)
{
	var subView = this.tbvManager.getActiveView(); // 선택 서브 뷰
	if(subView && subView.onInqryPeriodBtnClick)
	{
		subView.onInqryPeriodBtnClick();
	}
};





//----------------------------------------------------//
//----------------- START 신청하기 ---------------------//
//----------------------------------------------------//
// 연금펀드계좌에 맞는 투신계좌 선택
FD5007_T06.prototype.getAccNo = function(selectedAcc)
{
	var returnAccNo = null;
	var accList =  theApp.accInfo.filterAccList(4); // 투신계좌번호
	
	for(var i=0; i<accList.length; i++)
	{ 
		var acc46 = accList[i]["D1계좌번호"].substr(5,6);
		var acc47 = selectedAcc.substr(5,6);
		
		if(acc46 == acc47)
		{
			returnAccNo = accList[i]["D1계좌번호"]; // 투신계좌 
		}	
	}
	
	return returnAccNo;
};


// 신청하기 버튼 클릭
FD5007_T06.prototype.onBtnApplyClick = function(comp, info)
{
	// 서비스 조회
	this.sendSACMT297('C');
};


// 서비스 조회
FD5007_T06.prototype.sendSACMT297 = function(funcKey)
{
	var thisObj = this;
	var cont = this.getContainer();
	
	var cipherData = thisObj.secureTxf.getCipherData();
	
	// 계좌번호가 없으면
	if(!thisObj.accDbx.getSelectedItemData() || !thisObj.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	// 비밀번호가 없으면
	if(!afc.isSimulator)
	{	
		if(!cipherData)
		{
			AToast.show('계좌 비밀번호를 입력하세요.');
			thisObj.secureTxf.addClass('active');
			return;
		}
	}
	
	// checkObj
	var checkObj = {
		svcId : 'SACMT297',
		accNo : thisObj.accDbx.getSelectedItemData()['D1계좌번호']
	};
	
	// 날짜
	var d = new Date(); // 오늘
	d.setDate(d.getDate() + 1); // 내일
	var nextDay =[
			MetaInfo.leadingZeros(d.getFullYear(), 4),
			MetaInfo.leadingZeros(d.getMonth()+1, 2),
			MetaInfo.leadingZeros(d.getDate(), 2)
	].join('');
	
	// 조회
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData('SACMT297', 
			function(queryData)
			{
				queryData.setHeaderInfo({
					FUNC_KEY_LST: funcKey
				});

				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				InBlock1['D1처리구분'] = '1'; // 1: 수령신청
				InBlock1['D1계좌번호'] = checkObj.accNo;
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : cipherData;
				InBlock1['D1연금지급주기구분'] = '1'; // 1: 1개월
				InBlock1['D1일'] = '05'; // 05일, 10일, 15일, 20일, 25일
				InBlock1['D1지급계좌번호'] = thisObj.getAccNo(checkObj.accNo); // 투신계좌번호
				InBlock1['D1지급구분'] = '2'; // 1: 수동, 2: 자동지급(고객희망금액내), 3: 자동지급(연간수령한도내)
				InBlock1['D1연금수령개시일'] = nextDay;
				InBlock1['D1수령액'] = '10000';

				queryData.putPwInfo('InBlock1', 'D1비밀번호');
				
				if(afc.isSimulator) queryData.printQueryData();
			},
			function(queryData, groupName) 
			{
				var errMsg = this.getLastError('errMsg');
				var errCode = this.getLastError('errCode');

				if(funcKey == 'C') // 조회
				{
					if(errCode == '136') // 조회가 완료되었습니다.
					{
						// 서비스 조회
						thisObj.sendSACMT297('5');
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

						// 신청 완료 팝업
						thisObj.onApplyFinish();
					}
				}
			}
		);
	});	
};


// 연금수령신청완료 팝업
FD5007_T06.prototype.onApplyFinish = function()
{
	var paramData = {
		"title" 	 : "알림",
		"contents" 	 : "연금수령 개시신청이 접수</br>"
						+ "되었습니다. [신청내역]을 통해<br/>"
						+ "확인하시기 바랍니다",
		"btnText" 	 : "확인",
		"returnType" : "2",
		"returnData" : ""	
	};
	PensionCommon.oneBtnPopup(this, paramData);
};


// 연금수령신청완료 팝업 콜백함수
FD5007_T06.prototype.callbackPensionPopup = function(returnData, resultData)
{
	this.onButtonClick(this.button1);
};
//----------------------------------------------------//
//------------------- END 매수하기 ---------------------//
//----------------------------------------------------//




