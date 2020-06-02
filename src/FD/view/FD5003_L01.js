
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_L01()
{
	AView.call(this);
}
afc.extendsClass(FD5003_L01, AView);


FD5003_L01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
			
	// Object
	this.cont = this.getContainer();
	
	// 펀드
	this.title = this.findCompByGroup('listViewGrp')[0];	// 펀드명
	this.title2 = this.findCompByGroup('listViewGrp')[1];	// 클래스상세 전체명 추가 2019.09.24
	this.content = this.findCompByGroup('listViewGrp')[2];	// 펀드내용
	
	//this.title.setShrinkInfo({maxChar:19, fontSize:26}); // 펀드명 자동폰트 셋팅 2019.09.26 -> 가장 긴 펀드명(23자리) 크기로 CSS에서 고정 처리함 2020.03.05 
	//this.title2.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
};


// 데이터 셋팅
FD5003_L01.prototype.setData = function(data)
{		
	// 리스트 데이터
	this.listData = data;
	
	// 펀드명
	this.title.setText(data['D1한글투신펀드명']);	
	this.title2.setText(data['D1클래스상세 전체명']); // 클래스상세 전체명 추가 2019.09.24
	
	// 펀드내용
	this.content.setText(data['D1펀드내용']);	
};


// 펀드 상세설명 팝업
FD5003_L01.prototype.onFundBtnClick = function(comp, info)
{
	// 선택한 펀드의 정보 셋팅
	this.cont.selectFundInfo = this.listData;
	
	// 팝업
	var win = AWindow.createWindow('FD/window/FD5003_W01.lay', 'FD5003W01');
	win.setWindowOption({ isAutoCenter: true });
	
	// 팝업 오픈
	win.open(this, 0, 0, 580, 500);
};


// 팝업에서 넘긴 결과
FD5003_L01.prototype.onWindowResult = function(result, windowObj)
{
	var winId = windowObj.containerId;
	if(winId == 'FD5003W01')
	{
		if(result == 1) // 매수하기 버튼을 클릭했을 시
		{
			// 팝업
			var win = AWindow.createWindow('FD/window/FD5003_W02.lay', 'FD5003W02');
			win.setWindowOption({isFocusLostClose: false, overflow: 'scroll'});

			// 팝업 오픈
			win.open(this, 30, 259, 580);
		}
	}
	else if(winId == 'FD5003W02')
	{
		if(result != 0) // 상세보기 버튼을 클릭했을 시
		{
			if(result == 1)
			{	
				// 상세보기로 이동
				this.cont.tvManager.changeTab('FD5003_T02');
			}
		}
	}
};



