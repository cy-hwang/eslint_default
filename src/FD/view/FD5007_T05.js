
/**
Constructor
Do not call Function in Constructor.
*/
function FD5007_T05()
{
	AView.call(this);
}
afc.extendsClass(FD5007_T05, AView);


FD5007_T05.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	// Object
	this.cont = this.getContainer();
	this.contTab = this.cont.tvManager.getActiveView();
	
	// 계좌
	this.accView = this.cont.findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx; 			// 계좌드롭박스
	this.secureTxf = this.accView.secureTxf;	// 계좌비밀번호
	
	// 그리드
	this.grid = this.findCompById('Grid1');
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5007_T05.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 서비스 조회
	//
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5007_T05.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5007_T05.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.$ele.scrollTop(0);
};


// 컴포넌트 초기화
FD5007_T05.prototype.onInitComponents = function()
{
	// 그리드뷰 초기화
	for(var i=0; i<7; i++)
	{
		this.grid.setCellText(i, 1, "");
	}
};


// 서비스 조회
FD5007_T05.prototype.send = function()
{

};


// 그리드 셋팅
FD5007_T05.prototype.setGrid = function(data)
{
	this.grid.setCellText(0, 1, afc.addComma(data[0]) + '원');	// 적립금
	this.grid.setCellText(1, 1, afc.addComma(data[1]) + '원');	// 예상기타소득세
	this.grid.setCellText(2, 1, afc.addComma(data[2]) + '원');	// 예상퇴직소득세
	this.grid.setCellText(3, 1, afc.addComma(data[3]) + '원');	// 예상연금소득세
	this.grid.setCellText(4, 1, afc.addComma(data[4]) + '원');	// 합계
	this.grid.setCellText(5, 1, afc.addComma(data[5]) + '원');	// 예상해지가산세
	this.grid.setCellText(6, 1, afc.addComma(data[6]) + '원');	// 실수령액
};


