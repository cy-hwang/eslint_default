
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_V07()
{
	AView.call(this);
}
afc.extendsClass(FD5003_V07, AView);


FD5003_V07.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// Object
	this.cont = this.getContainer();
	this.contTab = this.cont.tvManager.getActiveView();
	
	// 스크롤 관련 영역
	this.view1 = this.findCompById('View1');
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V07.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5003_V07.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V07.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.view1.scrollTo(0);
};


// 확인버튼 클릭
FD5003_V07.prototype.onbtnNextClick = function(comp, info)
{
	// 오늘의 주문내역 페이지로 이동
	theApp.goPageCheck('FD5008', false, {tabId:'FD5008_T01'});
};


// 2018.11.06 자동이체매수버튼 화면에서 숨김처리
/*// 자동이체매수 신청 버튼 클릭()
FD5003_V07.prototype.onButton1Click = function(comp, info)
{
	// 이전 화면에서 넘긴 파라미터 
	var param = {
		'accNo': this.viewData.accNo,	// 서브계좌번호
		'accPw': this.viewData.accPw,	// 계좌비밀번호
		'accNm': this.viewData.accNm,	// 계좌명
		'orgAccNo': this.viewData.orgAccNo // 계좌번호 
	};
	
	// 자동이체매수 약정등록으로 이동
	this.contTab.tbvManager.changeTab('FD5003_V08', param);
};*/


