
/**
Constructor
Do not call Function in Constructor.
*/
function FD5007_T07()
{
	AView.call(this);
}
afc.extendsClass(FD5007_T07, AView);


FD5007_T07.prototype.init = function(context, evtListener)
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
FD5007_T07.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 서비스 조회
	this.sendSACAQ297();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5007_T07.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5007_T07.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.$ele.scrollTop(0);
};


// 컴포넌트 초기화
FD5007_T07.prototype.onInitComponents = function()
{
	// 비밀번호 활성화 클래스 제거
	this.secureTxf.removeClass('active');
	
	// 리스트뷰 내의 모든 아이템 삭제
	this.listView.removeAllItems();
	
	// Nodata뷰 보이게 처리
	this.nodata.show(AComponent.VISIBLE);
};


// 서비스 조회
FD5007_T07.prototype.sendSACAQ297 = function(contiKey)
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
	theApp.accNetManager.addSkipErrorCode('SACAQ297', '2679');
	
	// 조회
	this.cont.sendData('SACAQ297',
		function(queryData, groupName)
		{
			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
			InBlock1['D1시작일'] = thisObj.getStartDay(); // 전년동월첫날		
			InBlock1['D1종료일'] = Utils.yyyymmdd(new Date());
			
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
				thisObj.listView.addItem('FD/view/FD5007_L01.lay', OutBlock1);
				
				// Height 셋팅
				thisObj.contTab.onSetViewHeight( thisObj.listView.getHeight() );
			}
		}
	);
};


// 조회 시작일 구하기
FD5007_T07.prototype.getStartDay = function()
{
	var dt = Utils.yyyymmdd(new Date());
	var dtYear 	= dt.substring(0,4);
	var dtMonth = dt.substring(4,6);
	var dtDay 	= dt.substring(6,8);
	
	var lastYear = Number(dtYear) - 1;
	var lastMonth = dtMonth;
	var lastDay = '01';
			
	return lastYear + '' + lastMonth + '' + lastDay;
};


// 리스트뷰 데이터 바인딩
FD5007_T07.prototype.bindData = function(item, data, listview)
{
	if(item.view.setData)
	{
		item.view.setData(data);
	}
};


// 뷰를 하단으로 스크롤
FD5007_T07.prototype.onScrollBottom = function()
{
	if(this.contiKey) 
	{
		this.sendSACAQ297(this.contiKey);
	}
};


