
/**
Constructor
Do not call Function in Constructor.
*/
function FD4102_V02()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD4102_V02, AView);


FD4102_V02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.date = this.findCompByGroup('A')[0];
	this.name = this.findCompByGroup('A')[1];
	this.amount = this.findCompByGroup('A')[2];
	this.won = this.findCompByGroup('A')[3];
	this.fund = this.findCompByGroup('A')[4];
	this.total = this.findCompByGroup('A')[5];
	this.fund.show(AComponent.GONE);
};

FD4102_V02.prototype.setData = function(data)
{
	this.data = data;
	
	var dateString = [data['D1거래일자'].substring(0, 4), data['D1거래일자'].substring(4, 6), data['D1거래일자'].substring(6)].join('.');
	this.date.setText(dateString);
	this.name.setText(data['D1적요명']);
	this.amount.setText(afc.addComma(data['D1거래금액']));
	this.total.setText(afc.addComma(data['D1예수금금잔금액']));
	this.fund.setText(data['D1종목명']);
	
	if(new String(data['D1적요명']).indexOf('취소', 0) !== -1) {
		this.name.addClass('detail black');
		this.amount.addClass('sum black');
	} else if(new String(data['D1적요명']).indexOf('매수', 0) !== -1 || new String(data['D1적요명']).indexOf('입금', 0) !== -1) {
		this.name.addClass('detail red');
		this.amount.addClass('sum red');
	} else if(new String(data['D1적요명']).indexOf('매도', 0) !== -1 || new String(data['D1적요명']).indexOf('출금', 0) !== -1) {
		this.name.addClass('detail blue');
		this.amount.addClass('sum blue');
	} else {
		this.name.addClass('detail black');
		this.amount.addClass('sum black');	
	}
	
	if(new String(data['D1적요명']).indexOf('환매', 0) !== -1 && data['D1거래금액'] == 0 && data['D1거래좌수'] != 0) {
		this.amount.setText(afc.addComma(data['D1거래좌수']));
		this.won.setText('좌');
	}
	
	if(data['D1종목명'] != '') {
		this.fund.show(AComponent.VISIBLE);
	}
// 	'detail blue' 'sum blue' 'detail red' 'sum red' 'detail black' 'sum black'
// 	if(data['D1'])
};