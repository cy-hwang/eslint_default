
/**
Constructor
Do not call Function in Constructor.
*/
function FD5007_L01()
{
	AView.call(this);
}
afc.extendsClass(FD5007_L01, AView);


FD5007_L01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	// 리스트
	this.list1 	= this.findCompByGroup('M')[0];	// 신청일
	this.list2 	= this.findCompByGroup('M')[1];	// 지급계좌번호
	this.list3 	= this.findCompByGroup('M')[2];	// 최초연금지급일
	this.list4 	= this.findCompByGroup('M')[3];	// 지급주기
	this.list5 	= this.findCompByGroup('M')[4]; // 지급일
	this.list6 	= this.findCompByGroup('M')[5]; // 연금수령연차
	this.list7 	= this.findCompByGroup('M')[6]; // 연금개시 신청여부
};


// 데이터 셋팅
FD5007_L01.prototype.setData = function(data)
{
	// 리스트 데이터
	this.listData = data;
	
	// 신청일
	this.list1.setText( Utils.formatDotDate(data['D1연금개시신청일']) );
	
	// 지급계좌번호
	this.list2.setText( Utils.makeAccForm(data['D1연결계좌번호']) );
	
	// 최초연금지급일
	this.list3.setText( Utils.formatDotDate(data['D1최초연금지급일']) );
	
	// 지급주기
	this.list4.setText( data['D1지급주기명'] );
	
	// 지급일
	this.list5.setText( Number(data['D1월지급일']) + '일' );
	
	// 연금수령연차
	this.list6.setText( Number(data['D1당해년도연금수령연차']) + '연차' );
	
	// 연금개시 신청여부
	this.list7.setText( data['D1여부명'] );
};


