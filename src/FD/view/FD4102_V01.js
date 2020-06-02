
/**
Constructor
Do not call Function in Constructor.
*/
function FD4102_V01()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD4102_V01, AView);


FD4102_V01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.name = this.findCompByGroup('M')[0];
	this.label1 = this.findCompByGroup('M')[1];
	this.label2 = this.findCompByGroup('M')[2];
	this.label3 = this.findCompByGroup('M')[3];
	this.label4 = this.findCompByGroup('M')[4];
	this.label5 = this.findCompByGroup('M')[5];
	this.label6 = this.findCompByGroup('M')[6];
	
	this.butView1 = this.findCompByGroup('btnViewGrp')[0];
	this.butView2 = this.findCompByGroup('btnViewGrp')[1];
};

FD4102_V01.prototype.setData = function(data)
{
	this.data = data;
	var thisObj = this;
	this.name.setText(data['name']);
	
	if($.isNumeric(data['수익률'])) {
		this.label1.setText(afc.floorPer(data['수익률'], 2));
	} else {
		this.label1.setText('0%');
	}
	
	afc.log("yjhan1 Data ->[" + afc.log(data) + "]");
	
	//cont.scrToolView.show(AComponent.GONE);
	
	
	
	//this.simpleBtn.setBtnStyle([ 'BT_P8_NOR', 'BT_P8_TCH', 'BT_P8_DIS' ]);
	
	//alert("yjhan1 펀드코드 ->[" + this.data['펀드코드'] + "]");
	
	this.butView2.show(AComponent.GONE);
		
	if(data['펀드코드'] == "4074" && data['납입방법'] == '01'){
		//alert("check 펀드코드 4074 ->[" + data['펀드코드'] + "]");
		this.butView1.show(AComponent.GONE); // VISIBLE
		this.butView2.show(AComponent.VISIBLE); // VISIBLE		
	}
	
	this.label2.setText(afc.floor(data['기준가'], 2));
	this.label3.setText(afc.addComma(data['잔고좌수'].split('.')[0]) + '좌');
	this.label4.setText(afc.addComma(data['매수원금']) + '원');
	this.label5.setText(afc.addComma(data['평가금액']) + '원');
	
	if(MetaInfo.PayMthdCode[data['납입방법']]) {
		this.label6.setText(MetaInfo.PayMthdCode[data['납입방법']]);
	} else {
		this.label6.setText(data['납입방법']);
	}
// 	thisObj.result[outblock['D1서브계좌번호']] = {'name' : outblock['D1한글투신펀드명'], '매수원금' : outblock['D1매수원금'], '평가금액' : outblock['D1평가금액'], '기준가' : outblock['D1기준가'], '잔고좌수' : outblock['D1펀드잔고수량'], '펀드계좌번호' : outblock['D1계좌번호']};
};

FD4102_V01.prototype.onButton1Click = function(comp, info)
{
	var thisObj = this;
	
	if(thisObj.data['HTS여부'] == '1')
		theApp.goPageCheck('FD3202', false, {tabId:'FD3202_T02', tabSubId:'FD3202_V06', fundCode: this.data['펀드코드']});
	else
	{
		theApp.alert(
			[	 
				'추가매수를 하시는 경우','<br>',
				'메리츠자산운용 고객센터','<br>',
				'(1588-5533)로 연락주시기','<br>',
				'바랍니다.','<br>',
				,' '
			].join(''),
			null,
			''
		);
	}
};

FD4102_V01.prototype.onButton2Click = function(comp, info)
{

	

};

FD4102_V01.prototype.onButton3Click = function(comp, info)
{
	//TODO:edit here
	/*var win = AWindow.createWindow('FD/window/FD4102_W02.lay','FD410202');
	win.subAccNo = this.data['펀드계좌번호'];
	win.fundCode = this.data['펀드코드'];
	win.openAsDialog(this, '100%', '100%');*/
	
	var win = AWindow.createWindow('FD/window/FD4102_W03.lay','FD410203');
	win.subAccNo = this.data['펀드계좌번호'];
	win.fundCode = this.data['펀드코드'];
	win.openAsDialog(this);

};


FD4102_V01.prototype.onWindowResult = function(result, windowObj)
{
	//TODO:edit here
			
	if(windowObj.containerId == 'FD410203'){
		if(result == 1){
			var win = AWindow.createWindow('FD/window/FD4102_W02.lay','FD410202');
			
			win.subAccNo = this.data['펀드계좌번호'];
			win.fundCode = this.data['펀드코드'];
			win.openAsDialog(this, '100%', '100%');
		}
	}
};

