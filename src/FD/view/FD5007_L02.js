
/**
Constructor
Do not call Function in Constructor.
*/
function FD5007_L02()
{
	AView.call(this);
	
	// 지급구분
	this.givTpCd = {
		'1' : '지급',
		'2' : '해지'
	};
	
	// 취소여부
	this.cancleCd = {
		'1' : '취소',
		'0' : '완료'
	};
	
	// 처리상태코드
	this.trxStCd = {
		'01' : '예정',
		'02' : '환매신청',
		'03' : '환매완료',
		'13' : '환매시오류',
		'14' : '지급시오류',
		'99' : '지급완료'
	};
}
afc.extendsClass(FD5007_L02, AView);


FD5007_L02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// 리스트
	this.list1		= this.findCompByGroup('M')[0];		// 지급/해지구분
	this.list2		= this.findCompByGroup('M')[1];		// 연금지급일
	this.list3		= this.findCompByGroup('M')[2];		// 당해기수령금액
	this.list4		= this.findCompByGroup('M')[3];		// 연금수령출금액
	this.list5		= this.findCompByGroup('M')[4];		// 환매주문금액
	this.list6		= this.findCompByGroup('M')[5];		// 취소여부
	this.list7		= this.findCompByGroup('M')[6];		// 세전지급금액
	this.list8		= this.findCompByGroup('M')[7];		// 연금수령한도금액
	this.list9		= this.findCompByGroup('M')[8];		// 과세제외금액출금액
	this.list10		= this.findCompByGroup('M')[9];		// 환매결제금액
	this.list11 	= this.findCompByGroup('M')[10];	// 실지급금액
	this.list12 	= this.findCompByGroup('M')[11];	// 처리상태
	this.list13 	= this.findCompByGroup('M')[12];	// 총평가금액
	this.list14 	= this.findCompByGroup('M')[13];	// 과세대상출금액
	this.list15 	= this.findCompByGroup('M')[14];	// 환매특별중도해지여부
};


// 데이터 셋팅
FD5007_L02.prototype.setData = function(data)
{
	// 리스트 데이터
	this.listData = data;
	
	// 지급/해지구분
	var data1 	= data['D1지급구분'];
	var dataCd1 = this.givTpCd[data1];
	this.list1.setText( dataCd1 != null ? dataCd1 : data1 );
	
	// 연금지급일
	this.list2.setText( Utils.formatDotDate(data['D1연금지급일']) );
	
	// 당해기수령금액
	this.list3.setText( afc.addComma(data['D1당해년도기수령금액']) + '원' );
	
	// 연금수령출금액
	this.list4.setText( afc.addComma(data['D1연금수령출금액']) + '원' );
	
	// 환매주문금액
	this.list5.setText( afc.addComma(data['D1환매주문금액']) + '원' );
	
	// 취소여부
	var data6 	= data['D1취소여부'];
	var dataCd6 = this.cancleCd[data6];
	this.list6.setText( dataCd6 != null ? dataCd6 : data6 );
	
	// 세전지급금액
	this.list7.setText( afc.addComma(data['D1지급금액(세전금액)']) + '원' );
	
	// 연금수령한도금액
	this.list8.setText( afc.addComma(data['D1연금수령한도금액']) + '원' );
	
	// 과세제외금액출금액
	this.list9.setText( afc.addComma(data['D1과세제외금액출금']) + '원' );
	
	// 환매결제금액
	this.list10.setText( afc.addComma(data['D1환매결제금액']) + '원' );
	
	// 실지급금액
	this.list11.setText( afc.addComma(data['D1실지급금액(세후)']) + '원' );
	
	// 처리상태
	var data12 	 = data['D1처리상태코드'];
	var dataCd12 = this.trxStCd[data12];
	this.list12.setText( dataCd12 != null ? dataCd12 : data12 );
	
	// 총평가금액
	this.list13.setText( afc.addComma(data['D1총평가금액']) + '원' );
	
	// 과세대상출금액
	this.list14.setText( afc.addComma(data['D1과세대상출금액']) + '원' );
	
	// 환매특별중도해지여부
	this.list15.setText( data['D1환매특별중도해지여부'] );
};


