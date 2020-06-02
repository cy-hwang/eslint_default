
/**
Constructor
Do not call Function in Constructor.
*/
function FD5007_T08()
{
	AView.call(this);
}
afc.extendsClass(FD5007_T08, AView);


FD5007_T08.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// Object
	this.cont = this.getContainer();
	this.contTab = this.cont.tvManager.getActiveView();
	
	// 계좌
	this.accView = this.cont.findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx; 			// 계좌드롭박스
	this.secureTxf = this.accView.secureTxf;	// 계좌비밀번호
	
	// 리스트 뷰
	this.listView = this.findCompById("ListView");
	this.listView.setDelegator(this);
	
	// Nodata 뷰
	this.nodata = this.findCompById('Nodata');
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5007_T08.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 서비스 조회
	this.sendSDPAQ075();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5007_T08.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5007_T08.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.$ele.scrollTop(0);
};


// 컴포넌트 초기화
FD5007_T08.prototype.onInitComponents = function()
{
	// 비밀번호 활성화 클래스 제거
	this.secureTxf.removeClass('active');
	
	// 리스트뷰 내의 모든 아이템 삭제
	this.listView.removeAllItems();
	
	// Nodata뷰 보이게 처리
	this.nodata.show(AComponent.VISIBLE);
};


// 조회 팝업
FD5007_T08.prototype.onInqryPeriodBtnClick = function()
{
	var win = AWindow.createWindow('FD/window/FD5007_W04.lay', 'FD5007W04');
	win.setWindowOption({ isAutoCenter: true });
	
	// 팝업으로 넘기는 파라미터
	win.w_inqryIndex 	= this.contTab.w_inqryIndex;
	win.w_inqryTypeCd 	= this.contTab.w_inqryTypeCd;
	win.w_trsfIndex 	= this.contTab.w_trsfIndex;
	win.w_trsfTypeCd 	= this.contTab.w_trsfTypeCd;
	win.w_startDate		= this.contTab.w_startDate;
	win.w_endDate		= this.contTab.w_endDate;
	
	// 팝업 오픈
	win.open(this, 0, 0, 580, 680);
};


// 팝업에서 넘긴 결과
FD5007_T08.prototype.onWindowResult = function(result, windowObj)
{
	var winId = windowObj.containerId;
	if(winId == 'FD5007W04')
	{
		if(result != 0) // 확인버튼을 클릭했을 시
		{
			// 팝업에서 넘긴 데이터로 셋팅
			this.contTab.w_inqryIndex 	= result.w_inqryIndex;
			this.contTab.w_inqryTypeCd 	= result.w_inqryTypeCd;
			this.contTab.w_trsfIndex 	= result.w_trsfIndex;
			this.contTab.w_trsfTypeCd 	= result.w_trsfTypeCd;
			this.contTab.w_startDate	= result.w_startDate;
			this.contTab.w_endDate		= result.w_endDate;
			
			// 조회기간버튼 텍스트 셋팅
			this.contTab.inqryPeriodBtn.setText(result.w_inqryText + " · " + result.w_trsfText);
			
			// 서비스 조회
			this.sendSDPAQ075();
		}
	}
};


// 서비스 조회
FD5007_T08.prototype.sendSDPAQ075 = function(contiKey)
{
	var thisObj = this;
	
	// 연속키가 없으면
	if(!contiKey)	
	{
		thisObj.listView.removeAllItems();	// 리스트뷰 내의 모든 아이템 삭제
	}
	
	// 계좌번호가 없으면
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	// 비밀번호가 없으면
	if(!afc.isSimulator)
	{	
		if(!this.secureTxf.getCipherData())
		{
			AToast.show('계좌 비밀번호를 입력하세요.');
			this.secureTxf.addClass('active');
			return;
		}
	}
	
	// 조회내역이 없습니다. Skip 처리
	theApp.accNetManager.addSkipErrorCode('SDPAQ075', '2679');
	
	// 조회
	this.cont.sendData('SDPAQ075',
		function(queryData, groupName)
		{
			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
			InBlock1['D1처리지점번호'] = ''; // 비대면: 002
			InBlock1['D1지급구분'] = thisObj.contTab.w_trsfTypeCd; // %%: 전체, 1: 지급, 2: 해지
			InBlock1['D1해지구분'] = '%%';	  // %%: 전체, 1: 일반중도해지, 2: 특별중도해지
			InBlock1['D1조회시작일'] = thisObj.contTab.w_startDate;
			InBlock1['D1조회종료일'] = thisObj.contTab.w_endDate;
			InBlock1['D1처리상태코드'] = '%%'; // %%: 전체
			
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
				thisObj.listView.addItem('FD/view/FD5007_L02.lay', OutBlock1);
				
				// Height 셋팅
				thisObj.contTab.onSetViewHeight( thisObj.listView.getHeight() );
			}
		}
	);
};


// 리스트뷰 데이터 바인딩
FD5007_T08.prototype.bindData = function(item, data, listview)
{
	if(item.view.setData)
	{
		item.view.setData(data);
	}
};


// 뷰를 하단으로 스크롤
FD5007_T08.prototype.onScrollBottom = function()
{
	if(this.contiKey) 
	{
		this.sendSDPAQ075(this.contiKey);
	}
};


