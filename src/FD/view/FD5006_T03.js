
/**
Constructor
Do not call Function in Constructor.
*/
function FD5006_T03()
{
	AView.call(this);	
}
afc.extendsClass(FD5006_T03, AView);


FD5006_T03.prototype.init = function(context, evtListener)
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
	
	// 총 건수
	this.txtCount = this.findCompById('TxtCount');		
	
	// 조회기간버튼
	this.inqryPeriodBtn = this.findCompById('InqryPeriodBtn'); 
	
	// 리스트 뷰
	this.listView = this.findCompById('ListView');
	this.listView.setDelegator(this);
	
	// Nodata 뷰
	this.nodata = this.findCompById('Nodata');
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5006_T03.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 검색조건 초기화
	this.onInitSearchData();
	
	this.fnDoSendDataManage();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5006_T03.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5006_T03.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.centerView.scrollTo(0);
};


// 검색조건 초기화
FD5006_T03.prototype.onInitSearchData = function()
{
	// 팝업으로 넘기는 파라미터 
	this.w_inqryIndex 	= 0;	// 조회기간 인덱스
	this.w_inqryTypeCd 	= '0'; 	// 조회기간 타입코드 (0:당일)
	this.w_trsfIndex 	= 0;	// 거래구분 인덱스
	this.w_trsfTypeCd 	= '0';	// 거래구분 타입코드 (0:전체) 
	this.w_startDate	= Utils.yyyymmdd(new Date());	// 시작일
	this.w_endDate		= Utils.yyyymmdd(new Date());	// 종료일
	
	// 조회기간버튼 텍스트 셋팅
	this.inqryPeriodBtn.setText('당일 · 전체');
};


// 컴포넌트 초기화
FD5006_T03.prototype.onInitComponents = function()
{	
	// 계좌 컨트롤
	this.cont.onAccViewControl(true);
	
	// 총 건수
	this.listCount = 0;
	
	// 총 건수 셋팅
	this.txtCount.setText('총 ' + this.listCount + '건');
	
	// 리스트뷰 내의 모든 아이템 삭제
	this.listView.removeAllItems();	
	
	// Nodata뷰 보이게 처리
	this.nodata.show(AComponent.VISIBLE);
};


// 계좌번호 변경 시 이벤트
FD5006_T03.prototype.fnDoSendDataManage = function() 
{
	// 계좌번호 저장
	PensionCommon.setFundAcc(this);
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 서비스 조회
	this.sendSDPBQ001();	
};


// 조회 팝업
FD5006_T03.prototype.onInqryPeriodBtnClick = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/FD5006_W02.lay', 'FD5006W02');
	win.setWindowOption({ isAutoCenter: true });
	
	// 팝업으로 넘기는 파라미터
	win.w_inqryIndex 	= this.w_inqryIndex;
	win.w_inqryTypeCd 	= this.w_inqryTypeCd;
	win.w_trsfIndex 	= this.w_trsfIndex;
	win.w_trsfTypeCd 	= this.w_trsfTypeCd;
	win.w_startDate		= this.w_startDate;
	win.w_endDate		= this.w_endDate;
	
	// 팝업 오픈
	win.open(this, 0, 0, 580, 680);
};


// 팝업에서 넘긴 결과
FD5006_T03.prototype.onWindowResult = function(result, windowObj)
{
	var winId = windowObj.containerId;
	if(winId == 'FD5006W02')
	{
		if(result != 0) // 확인버튼을 클릭했을 시
		{
			// 팝업에서 넘긴 데이터로 셋팅
			this.w_inqryIndex 	= result.w_inqryIndex;
			this.w_inqryTypeCd 	= result.w_inqryTypeCd;
			this.w_trsfIndex 	= result.w_trsfIndex;
			this.w_trsfTypeCd 	= result.w_trsfTypeCd;
			this.w_startDate	= result.w_startDate;
			this.w_endDate		= result.w_endDate;
			
			// 조회기간버튼 텍스트 셋팅
			this.inqryPeriodBtn.setText(result.w_inqryText + " · " + result.w_trsfText);

			// 서비스 조회
			this.sendSDPBQ001();
		}
	}
};


// 서비스 조회
FD5006_T03.prototype.sendSDPBQ001 = function(contiKey)
{
	var thisObj = this;
	
	// 계좌번호가 없으면
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	// 비밀번호가 없으면
	if(!afc.isSimulator)
	{	
		this.secureTxf.removeClass('active');
		
		if(!thisObj.secureTxf.getCipherData())
		{
			AToast.show('계좌 비밀번호를 입력하세요.');
			thisObj.secureTxf.addClass('active');
			return;
		}
	}
	
	// 연속키가 없으면
	if(!contiKey)	
	{
		// 리스트뷰 내의 모든 아이템 삭제
		thisObj.listView.removeAllItems();
		
		// 총 건수 0
		this.listCount = 0;
	}
	
	// 조회
	this.cont.sendData('SDPBQ001',
		function(queryData, groupName)
		{	
			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1조회구분'] = thisObj.w_trsfTypeCd;	// 0: 전체, 3: 매매, 7: 신청(주문), 1: 입출금
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
			InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : thisObj.secureTxf.getCipherData();
			InBlock1['D1조회시작일'] = thisObj.w_startDate;
			InBlock1['D1조회종료일'] = thisObj.w_endDate;
			InBlock1['D1시작번호'] = '0';		 // Default
			InBlock1['D1상품유형코드'] = '04';	// 04: 투자신탁계좌
			InBlock1['D1종목번호'] = '';
			InBlock1['D1정렬순서구분'] = '2';		// 1: 순차, 2: 역순(최신거래순)
			
			queryData.putPwInfo('InBlock1', 'D1비밀번호');
			
			if(afc.isSimulator) queryData.printQueryData();
			
			if(contiKey) // 연속키가 있으면 
			{
				queryData.setContiKey(contiKey); // 연속키 저장	
			}
		},
		function(queryData, groupName)
		{
			if(!queryData)
			{
				return;
			}
			else // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock2 = queryData.getBlockData('OutBlock2');
				
				if(!OutBlock2 || OutBlock2.length == 0)
				{
					thisObj.nodata.show(AComponent.VISIBLE);
					AToast.show('조회내역이 없습니다.');
				}
				else
				{
					thisObj.nodata.show(AComponent.GONE);
				}
				
				// 총 건수
				thisObj.listCount += OutBlock2.length;
				thisObj.txtCount.setText('총 ' + thisObj.listCount + '건');
				
				// 연속키 저장
				thisObj.contiKey = queryData.getContiKey();
				
				// 리스트뷰에 데이터 추가
				thisObj.listView.addItem('FD/view/FD5006_V02.lay', OutBlock2);
			}
		}
	);
};


// 리스트뷰 데이터 바인딩
FD5006_T03.prototype.bindData = function(item, data, listview)
{
	if(item.view.setData)
	{
		item.view.setData(data);
	}
};


// 뷰를 하단으로 스크롤
FD5006_T03.prototype.onListViewScrollBottom = function(comp, info)
{
	if(this.contiKey) 
	{
		this.sendSDPBQ001(this.contiKey);
	}
};


