
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_V09()
{
	AView.call(this);		
}
afc.extendsClass(FD5003_V09, AView);


FD5003_V09.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// Object
	this.cont = this.getContainer();
	this.contTab = this.cont.tvManager.getActiveView();
	
	this.lblFundBuyWord = this.findCompById('lblFundBuyWord');
	
	// 스크롤 관련 영역
	this.view1 = this.findCompById('View1');
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V09.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5003_V09.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	var thisObj	= this;
	var cont	= thisObj.getContainer();
	
	// 완료 문구 수정
	var lblStepText =[];
	
	// FD5003_V05 > FD5003_V09 로 페이지 이동시에만 쓰인다 -> cont['periodTypeCd'] (2020.05.21)
	if(cont.periodTypeCd == "D"){				// 일적립식 펀드가입 완료인 경우, monthGubun(21:월적립식, 22:일적립식)
	
		lblStepText.push("<span class='font30_3'>일적립식 가입</span><span class='font30'>이 완료되었습니다.</span>");
		
	}else if(cont.periodTypeCd == "M"){			// 월적립식 펀드가입 완료인 경우, monthGubun(21:월적립식, 22:일적립식)
	
		lblStepText.push("<span class='font30_3'>월적립식 가입</span><span class='font30'>이 완료되었습니다.</span>");
	
	}
	
	thisObj.lblFundBuyWord.$ele.children().eq(0).html(lblStepText);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V09.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.view1.scrollTo(0);
};


// 확인버튼 클릭
FD5003_V09.prototype.onbtnNextClick = function(comp, info)
{
	// 적립식 매수현황 페이지로 이동
	theApp.goPageCheck('FD5008', false, {tabId:'FD5008_T02'});
};


