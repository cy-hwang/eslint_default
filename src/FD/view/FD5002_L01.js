
/**
Constructor
Do not call Function in Constructor.
*/
function FD5002_L01()
{
	AView.call(this);
}
afc.extendsClass(FD5002_L01, AView);


FD5002_L01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.name = this.findCompByGroup('ListGrp')[0];
	this.grid = this.findCompByGroup('ListGrp')[1];
};


// 데이터 셋팅
FD5002_L01.prototype.setData = function(data)
{
	// 리스트 데이터
	this.listData = data;

	// 계좌번호 + 계좌명
	this.name.setText(Utils.makeAccForm(data['D1계좌번호']) + " " +  data['D1계좌명']);

	// 이체금액
	var trsfAmt = afc.addComma(data['D1이체금액']) + '원';

	// 이수관구분
	var trsfTp = data['D1구분값'];

	// 처리상태
	var trsfStTp = data['D1이수관상태'];

	// 접수일
	var rcptDt = Utils.formatDotDate(data['D1접수일']);
	
	// 접수번호
	var rcptNo = data['D1접수번호'];
	
	// 타사명
	var otcoNm = data['D1타사명'];
	
	// 그리드 셋팅
	var gridCellItems = [ trsfAmt, trsfTp, trsfStTp, rcptDt, rcptNo, otcoNm ];
	for(var i=0; i<gridCellItems.length; i++)
	{
		this.grid.setCellText(i, 1, gridCellItems[i]);
	}
};


