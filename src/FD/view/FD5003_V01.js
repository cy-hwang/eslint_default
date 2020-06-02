
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_V01()
{
	AView.call(this);
}
afc.extendsClass(FD5003_V01, AView);


FD5003_V01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// Object
	this.cont = this.getContainer();
	this.contTab = this.cont.tvManager.getActiveView();
	
	// 스크롤 관련 영역
	this.view3 = this.findCompById('View3');
	
	// 투자성향등급조회
	this.lblStep = this.findCompById('lblStep'); // 단계
	this.lblContent = this.findCompById("lblContent"); // 고객성향
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V01.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 매수단계 및 고객성향 셋팅
	this.setFundStepInfo();
		
	// 매매가능상태 조회
	this.checkTradeState();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5003_V01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V01.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.view3.scrollTo(0);
};


// 컴포넌트 초기화
FD5003_V01.prototype.onInitComponents = function()
{

};


// 매수단계 및 고객성향 셋팅
FD5003_V01.prototype.setFundStepInfo = function()
{
	// 펀드매수단계 셋팅
	var txtStep = "<span class='fc_red3'>" + this.cont.fundStepNow + "</span>"
					+ "<span class='step'>/" + this.cont.fundStepAll + "단계</span>";
	this.lblStep.$ele.children().eq(0).html(txtStep);
	
	
	// 고객성향 셋팅
	var userGrd = theApp.userInfo.get('UserGrade');
	var txtContent = "<span class='font30'>고객님의 투자성향은</span><br/>"
						+ "<span class='font30_3'>'" + userGrd['D1산출등급명'] + "'</span>" 
						+ "<span class='font30'>입니다.</span>";
	this.lblContent.$ele.children().eq(0).html(txtContent);
};


// 매매가능상태 조회
FD5003_V01.prototype.checkTradeState = function()
{
	this.contTab.checkTradeState(this, this.contTab);
};


// checkTradeState 콜백함수
FD5003_V01.prototype.callbackCheckTradeState = function(param)
{
	var trdSt = param['매매가능상태']; // 1: 일반펀드매수매도, 2: 예약펀드매수매도, 3: 펀드매수매도불가, 4:당일예약펀드매수매도
	
	if(trdSt == 3)
	{
		// 펀드매수매도불가안내팝업
		this.contTab.tradeDisablePopup();	
	}
	else if(trdSt == 1 || trdSt == 2 || trdSt == 4)
	{
		
	}
};


// 다음단계 클릭
FD5003_V01.prototype.onbtnNext2Click = function(comp, info)
{
	// 펀드매수단계 셋팅
	this.cont.fundStepNow = this.cont.fundStepNow + 1; // 2단계
	
	// 펀드등급조회로 이동
	this.contTab.tbvManager.changeTab('FD5003_V02');
};


