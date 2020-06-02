
/**
Constructor
Do not call Function in Constructor.
*/
function FD5002_T03()
{
	AView.call(this);
}
afc.extendsClass(FD5002_T03, AView);


FD5002_T03.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	// Object
	this.cont = this.getContainer();

	// 계좌
	this.accView = this.findCompById('AccView').loadView;
	this.accView.setDelegator(this);
	this.cont.onAccViewControl(this.accView);
	
	// 조회기간버튼
	this.inqryPeriodBtn = this.findCompById('InqryPeriodBtn');
	
	// 리스트 뷰
	this.listView = this.findCompById('ListView');
	this.listView.setDelegator(this);
	
	// Nodata 뷰
	this.nodata = this.findCompById('Nodata');
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5002_T03.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 검색조건 초기화
	this.onInitSearchData();
	
	// 계좌 초기화
	this.initAccView();
	
	// doInitAccInfo에서 계좌가 없을 시 아래 이벤트 실행
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		this.fnDoSendDataManage();
	}
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5002_T03.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5002_T03.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.$ele.scrollTop(0);
};


// 계좌 초기화
FD5002_T03.prototype.initAccView = function()
{	
	// 계좌드롭박스
	this.accDbx = this.accView.accDbx;
	
	// 계좌 // doInitAccInfo에서 계좌가 있을 시 fnDoSendDataManage 함수실행
	this.accView.doInitAccInfo(this.cont.accTypeCd);
};


// 검색조건 초기화
FD5002_T03.prototype.onInitSearchData = function()
{
	// 날짜
	var d = new Date();
	d.setMonth(d.getMonth() - 1); // 1개월
	
	// 팝업으로 넘기는 파라미터 
	this.w_inqryIndex 	= 1;	// 조회기간 인덱스
	this.w_inqryTypeCd 	= '1'; 	// 조회기간 타입코드 (1:1개월)
	this.w_trsfIndex 	= 0;	// 거래구분 인덱스
	this.w_trsfTypeCd 	= '0';	// 거래구분 타입코드 (0:전체)
	this.w_startDate 	= Utils.yyyymmdd(d);			// 시작일
	this.w_endDate 		= Utils.yyyymmdd(new Date());	// 종료일
	
	// 조회기간버튼 텍스트 셋팅
	this.inqryPeriodBtn.setText('1개월 · 전체');
};


// 컴포넌트 초기화
FD5002_T03.prototype.onInitComponents = function()
{
	// 리스트뷰 내의 모든 아이템 삭제
	this.listView.removeAllItems();	
	
	// Nodata뷰 보이게 처리
	this.nodata.show(AComponent.VISIBLE);
};


// 계좌번호 변경 시 이벤트
FD5002_T03.prototype.fnDoSendDataManage = function() 
{
	// 계좌번호 저장
	PensionCommon.setFundAcc(this);
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 서비스 조회
	this.sendSOFFQ555();
};


// 조회 팝업
FD5002_T03.prototype.onInqryPeriodBtnClick = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/FD5002_W03.lay', 'FD5002W03');
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
FD5002_T03.prototype.onWindowResult = function(result, windowObj)
{
	var winId = windowObj.containerId;
	if(winId == 'FD5002W03')
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
			this.sendSOFFQ555();
		}
	}
};


// 서비스 조회
FD5002_T03.prototype.sendSOFFQ555 = function(contiKey)
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
		
		// Nodata뷰 보이게 처리
		this.nodata.show(AComponent.VISIBLE);
	}

	// 등록된 내용이 없습니다. Skip 처리
	theApp.accNetManager.addSkipErrorCode('SOFFQ555', '2679');
	
	// 조회
	this.cont.sendData('SOFFQ555',
		function(queryData, groupName)
		{	
			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1지점번호'] = '';
			InBlock1['D1시작일'] = thisObj.w_startDate;
			InBlock1['D1종료일'] = thisObj.w_endDate;
			InBlock1['D1이수관구분'] = thisObj.w_trsfTypeCd;	// 0: 전체, 1: 이관, 2: 수관
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
			InBlock1['D1취소구분'] = '0';	// 0: 전체, 1: 정상, 2: 취소
			InBlock1['D1조회구분'] = '1';	// 1: 접수일, 2: 송금예정일
			
			if(afc.isSimulator) queryData.printQueryData();
			
			if(contiKey) // 연속키가 있으면 
			{
				queryData.setContiKey(contiKey); // 연속키 저장	
			}
		},
		function(queryData, groupName)
		{
			var errMsg = this.getLastError('errMsg');
			var errCode = this.getLastError('errCode');
			
			if(!queryData)
			{
				thisObj.nodata.show(AComponent.VISIBLE);
				return;
			}
			else // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1');
				
				if(!OutBlock1 || OutBlock1.length == 0)
				{
					thisObj.nodata.show(AComponent.VISIBLE);
					AToast.show('조회내역이 없습니다.');
				}
				else
				{
					thisObj.nodata.show(AComponent.GONE);
				}
				
				// 연속키 저장
				thisObj.contiKey = queryData.getContiKey();
				
				// 리스트뷰에 데이터 추가
				thisObj.listView.addItem('FD/view/FD5002_L01.lay', OutBlock1);
			}
		}
	);
};


// 리스트뷰 데이터 바인딩
FD5002_T03.prototype.bindData = function(item, data, listview)
{
	if(item.view.setData)
	{
		item.view.setData(data);
	}
};


// 뷰를 하단으로 스크롤
FD5002_T03.prototype.onScrollBottom = function(comp, info)
{
	if(this.contiKey) 
	{
		this.sendSOFFQ555(this.contiKey);
	}
};


