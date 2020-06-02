
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_V02()
{
	AView.call(this);		
}
afc.extendsClass(FD5003_V02, AView);


FD5003_V02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// Object
	this.cont = this.getContainer();
	this.contTab = this.cont.tvManager.getActiveView();
	
	// 스크롤 관련 영역
	this.view3 = this.findCompById('View3');
	
	// 계좌
	this.accView = this.findCompById('AccView').loadView;
	this.accView.show(AComponent.GONE); // 계좌컨트롤 숨김
	
	// 투자성향등급조회
	this.lblStep = this.findCompById('lblStep'); // 단계
	this.lblFundRiskNm = this.findCompById("lblFundRiskNm"); // 펀드등급		
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V02.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 계좌 초기화
	this.initAccView();
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 매수단계 및 펀드등급 셋팅
	this.setFundStepInfo();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5003_V02.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V02.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.view3.scrollTo(0);
};


// 계좌 초기화
FD5003_V02.prototype.initAccView = function()
{	
	// 계좌드롭박스
	this.accDbx = this.accView.accDbx;
	
	// 계좌
	this.accView.doInitAccInfo(this.cont.accTypeCd);
};


// 컴포넌트 초기화
FD5003_V02.prototype.onInitComponents = function()
{

};


// 매수단계 및 펀드등급 셋팅
FD5003_V02.prototype.setFundStepInfo = function()
{
	// 펀드매수단계 셋팅
	var txtStep = "<span class='fc_red3'>" + this.cont.fundStepNow + "</span>"
					+ "<span class='step'>/" + this.cont.fundStepAll + "단계</span>";
	this.lblStep.$ele.children().eq(0).html(txtStep);
	
	
	// 펀드등급 셋팅
	var fundInfo = this.cont.selectFundInfo;
	var txtContent = "<span class='font30'>선택하신 펀드의 위험등급은</span><br/>"
						+ "<span class='font30_3'>'" + fundInfo['D1위험구분'] + "'</span>" 
						+ "<span class='font30'>입니다.</span>";
	this.lblFundRiskNm.$ele.children().eq(0).html(txtContent);
};


// 다음단계 클릭
FD5003_V02.prototype.onbtnNext3Click = function(comp, info)
{
	// 펀드위험도 조회
	this.contTab.checkFundDanger(this, this.contTab);
};


// checkFundDanger 콜백함수
FD5003_V02.prototype.callbackCheckFundDanger = function()
{
	// 펀드매수단계 셋팅
	this.cont.fundStepNow = this.cont.fundStepNow + 1; // 3단계
	
	// 펀드등급조회로 이동
	this.contTab.tbvManager.changeTab('FD5003_V03');
};


// 부적합금융투자상품거래확인서 팝업
FD5003_V02.prototype.investInfoPopup = function(comp, info)
{
	// 팝업
	var win = AWindow.createWindow('FD/window/FD3202_W02.lay', 'FD3202W02');		
	win.openAsDialog(this);
};


// 팝업에서 넘긴 결과
FD5003_V02.prototype.onWindowResult = function(result, windowObj)
{
	if(windowObj.containerId == 'FD3202W02')
	{
		if(result == 1)
		{
			// 부적합금융투자상품거래확인서 등록
			this.contTab.registNonReport(this, this.contTab);			
		}
	}
};


