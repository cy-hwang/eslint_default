
/**
Constructor
Do not call Function in Constructor.
*/
function FD5007_T03()
{
	AView.call(this);
}
afc.extendsClass(FD5007_T03, AView);


FD5007_T03.prototype.init = function(context, evtListener)
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
FD5007_T03.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 서비스 조회
	//
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5007_T03.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5007_T03.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.$ele.scrollTop(0);
};


// 컴포넌트 초기화
FD5007_T03.prototype.onInitComponents = function()
{
	// 그리드뷰 초기화
	for(var i=0; i<7; i++)
	{
		this.grid.setCellText(i, 1, "");
	}
};


// 서비스 조회
FD5007_T03.prototype.send = function()
{

};


// 그리드 셋팅
FD5007_T03.prototype.setGrid = function(data)
{
	this.grid.setCellText(0, 1, Utils.formatDotDate(data[0]));	// 계약일자
	this.grid.setCellText(1, 1, afc.addComma(data[1]) + '원');	// 납입원금
	this.grid.setCellText(2, 1, afc.addComma(data[2]) + '원');	// 적립금평가액
	
	this.grid.setCellText(3, 1, data[3] + '%');	// 누적수익률
	this.grid.setCellText(4, 1, data[4] + '%');	// 연평균수익률
	this.grid.setCellText(5, 1, Utils.formatDotDate(data[5]));	// 연금수령개시예정일
	this.grid.setCellText(6, 1, Utils.formatDotDate(data[6]));	// 연금수령개시가능일
};


