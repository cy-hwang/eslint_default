
/**
Constructor
Do not call Function in Constructor.
*/
function FD5006_V02()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5006_V02, AView);


FD5006_V02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// 리스트
	this.list1 	= this.findCompByGroup('A')[0];	// 거래일자 
	this.list2 	= this.findCompByGroup('A')[1];	// 거래구분
	this.list3 	= this.findCompByGroup('A')[2];	// 거래금액
	
	this.lblWon = this.findCompByGroup('A')[3]; // 단위
	
	this.list4 	= this.findCompByGroup('A')[4];	// 종목명
	this.list5 	= this.findCompByGroup('A')[5]; // 예수금 
	
	// 원
	
};


// 데이터 셋팅
FD5006_V02.prototype.setData = function(data)
{
	// 리스트 데이터
	this.listData = data;

	// 거래일자
	this.list1.setText( Utils.formatDotDate(data['D1거래일자']) );

	// 거래구분
	this.list2.setText( data['D1적요명'] );
	
	// 거래금액
	this.list3.setText( afc.addComma(data['D1거래금액']) );
	
	// 종목명
	var fundNm = data['D1종목명'];
	this.list4.setText( fundNm );
	if(fundNm == "")
	{
		this.list4.show(AComponent.GONE);
	}
	
	// 예수금
	this.list5.setText( afc.addComma(data['D1예수금금잔금액']) );
	
	// 스타일 셋팅
	this.setStyle();
};


// 스타일 셋팅
FD5006_V02.prototype.setStyle = function()
{

	var trsfTyp = new String(this.listData['D1적요명']);
	var style1 = 'detail black';
	var style2 = 'sum black';
	
	if(trsfTyp.indexOf('취소', 0) !== -1) 
	{
		style1 = 'detail black';
		style2 = 'sum black';
	}
	else if(trsfTyp.indexOf('매수', 0) !== -1 || trsfTyp.indexOf('입금', 0) !== -1) 
	{
		style1 = 'detail red';
		style2 = 'sum red';
	}
	else if(trsfTyp.indexOf('매도', 0) !== -1 || trsfTyp.indexOf('출금', 0) !== -1)
	{
		style1 = 'detail blue';
		style2 = 'sum blue';
	}
	
	this.list2.addClass(style1);
	this.list3.addClass(style2);
	
	// 거래좌수
	var trsfAmount = this.listData['D1거래금액'];
	var trsfUnit = this.listData['D1거래좌수'];
	if(trsfTyp.indexOf('환매', 0) !== -1 && trsfAmount == 0 && trsfUnit != 0) 
	{
		this.list3.setText( afc.addComma(trsfUnit) );
		this.lblWon.setText('좌');
	}
};


