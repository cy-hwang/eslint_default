
/**
Constructor
Do not call Function in Constructor.
*/
function FD4102_T02()
{
	AView.call(this);	
}
afc.extendsClass(FD4102_T02, AView);


//초기화
FD4102_T02.prototype.onArrInit = function()
{		
	this.listview.removeAllItems();
	this.result = [];
	this.sum = 0;
	this.sum2 = 0;
	this.money = 0;
	this.money2 = 0;
	this.money3 = 0;
	this.money4 = 0;
	this.label10.show(AComponent.GONE);
	this.$ele.parent().scrollTop(0)
	
	// 2019.10.18. 조회표시 기준일자 
	this.lblStandDate.setText('');
};


FD4102_T02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);	
			
	this.accView = this.getContainer().findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx;
	this.secureTxf = this.accView.secureTxf;
	this.listview = this.findCompById('ListView1');
	this.listview.setDelegator(this);
	this.listview.setOption({'isUpdatePosition' : true});
	this.grid = this.findCompById('Grid2');
	this.pieChart = this.findCompById('Canvas1');
	
	this.label10 = this.findCompById('Label10');
	
	// 2019.10.18. 조회표시 기준일자 
	this.lblStandDate = this.findCompById('LblStandDate');
	
	this.result = [];
	this.sum = 0;
	this.sum2 = 0;
	this.money = 0;
	this.money2 = 0;
	this.money3 = 0;
	this.money4 = 0;
	
	
	this.orderAmt = 0; //주문금액
	
	
	this.moneyColor = '#FE8D19';
	this.orderAmtColor = '#FF0000'; //[20190305_00014]
	this.fundColor = ['#DE5E5F', '#6A71CF', '#45A8C5', '#3C927C', '#41707D', '#BB66D0', '#925F5D', '#60964F', '#4855A5'];
};

FD4102_T02.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);	
	
	this.secureTxf.show(AComponent.GONE);
	this.accDbx.setWidth('578px');
	this.fnDoSendDataManage();
};

//화면이 활성화된 후 이벤트
FD4102_T02.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);	
};


//화면이 소멸되기 전 이벤트
FD4102_T02.prototype.onWillDeactive = function(reload)
{		
	this.onArrInit();
};

//계좌 변경 시 호출
FD4102_T02.prototype.fnDoSendDataManage = function() {
	this.label10.show(AComponent.GONE);
	this.pieChart.show(AComponent.VISIBLE); //[20190305_00014]
	this.result = [];
	this.sendSDPAQ001();
};

// 	this.accView = this.findCompById('AccView');
// 	this.accView.viewLoad('FD/view/FD0000_V01.lay');
// 	
// 	계좌드롭박스
// 	this.accDbx = this.accView.getLoadView().accDbx;
// 	this.secureTxf = this.accView.getLoadView().secureTxf;
	
FD4102_T02.prototype.sendSDPAQ001 = function()
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	this.listview.removeAllItems();

	cont.sendData('SDPAQ001', function(queryData, groupName){
		var InBlock1 = queryData.getBlockData('InBlock1')[0];
		InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
		InBlock1['D1비밀번호'] = '';
	},
				  function(queryData, groupName) {
		var errorData = this.getLastError();	
		
		if(!queryData) {
			thisObj.sendSOFFQ447();
			return;
		}
		
		var OutBlock1 = queryData.getBlockData('OutBlock4');

		if(afc.isSimulator)
		{
			queryData.printQueryData();
		}
		
		thisObj.money = OutBlock1[0]['D1예수금총액'];
		
		
		thisObj.orderAmt = OutBlock1[0]['D1주문금액'];
	
		
		thisObj.sendSOFFQ447();
	});	
};

FD4102_T02.prototype.sendSOFFQ447 = function(contiKey)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!contiKey) this.listview.removeAllItems();
// 	
	theApp.accNetManager.addSkipErrorCode('SOFFQ447', '2679');
	theApp.accNetManager.addSkipErrorCode('SOFFQ447', '3742');
// 	theApp.accNetManager.addSkipErrorCode('SOFFQ130', '3609');
	cont.sendData('SOFFQ447', function(queryData, groupName){
		
		// 2019.10.18. 조회표시 기준일자 
		var standDate = Utils.yyyymmdd(new Date());		
		
		var InBlock1 = queryData.getBlockData('InBlock1')[0];
		InBlock1['D1조회구분'] = '1';
		InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
		InBlock1['D1비밀번호'] = '';
		InBlock1['D1기준일'] = standDate;
		
		thisObj.lblStandDate.setText("(" + standDate.substring(0,4) + "." + standDate.substring(4,6) + "." + standDate.substring(6,8) + " 기준)");

		if(contiKey && contiKey != 0) {
			queryData.setContiKey(contiKey);
		}			
	},
				  function(queryData, groupName) {
		var errorData = this.getLastError();	
		if(errorData.errCode == '3742') {
			
			var Msg = ['오전 9시이후부터','<br/>','조회하실 수 있습니다.','<br/>','(한국시간기준)'].join('');

			theApp.alert(Msg,null,"알림");
			
		}

		if(!queryData) {
			thisObj.drawPieChart();
			return;
		}
		
		var OutBlock1 = queryData.getBlockData('OutBlock1');
		var OutBlock2 = queryData.getBlockData('OutBlock2');

		if(afc.isSimulator)
		{
			queryData.printQueryData();
		}
		
		var i = 0;
		
		thisObj.money2 = OutBlock1[0]['D1원금합계금액'];
		thisObj.money3 = OutBlock1[0]['D1평가금액합계'];
		thisObj.money4 = OutBlock1[0]['D1평가수익률'];
		
		OutBlock2.forEach(function(outblock) {
			thisObj.result.push({'name' : outblock['D1펀드명'], '매수원금' : outblock['D1원금액'], '평가금액' : outblock['D1평가금액'], '기준가' : outblock['D1매매기준가'], '잔고좌수' : outblock['D1펀드잔고수량']});
		});
		
		//next키 저장
		var nextKey = queryData.getContiKey();

		if(nextKey && nextKey != 0) {
			thisObj.sendSOFFQ447(nextKey);
		} else {
			thisObj.drawPieChart();
			return;
		}	
	});	
};

FD4102_T02.prototype.drawPieChart = function() 
{
	this.grid.setCellText(0,1,afc.addComma(this.money) + '원');
	this.grid.setCellText(1,1,afc.addComma(this.money2) + '원');
	this.grid.setCellText(2,1,afc.addComma(this.money3) + '원');
	this.grid.setCellText(3,1,afc.addComma(this.money3 - this.money2) + '원');
	if($.isNumeric(this.money4)) {
		this.grid.setCellText(4,1,afc.floorPer(this.money4, 2));
	} else {
		this.grid.setCellText(4,1,'0%');
	}
	
	this.grid.setCellText(5,1,afc.addComma(this.money3 + this.money) + '원');
	
	var total = this.money3 + this.money + this.orderAmt; //D1평가금액합계 + D1예수금총액 + D1주문금액
	
	if(total <= 0) {
		this.label10.show(AComponent.VISIBLE);
		this.pieChart.show(AComponent.GONE);
		return;
	}
	
	var rates = [{'name' : '현금', 'data' : this.money * 100 / total, 'color' : this.moneyColor}
				,{'name' : '주문중인 금액', 'data' : this.orderAmt * 100 / total, 'color' : this.orderAmtColor}
				];
	
	var color = [this.moneyColor
				,this.orderAmtColor
				];
	
	for(var i=0; i<this.result.length; i++) {
		rates.push({'name' : this.result[i]['name'], 'data' : this.result[i]['평가금액'] * 100 / total, 'color' : this.fundColor[i%9]});
		color.push(this.fundColor[i%9]);
	}
		
	this.listview.addItem('FD/view/FD4102_V03.lay', rates);
	
	this.pieChart.setChartColor(color);
	
	//5% 미만은 파이차트에 수치를 표시하지 않음
	for(var i=0; i<rates.length; i++) {
		if(rates[i]['data'] < 5) {
			rates[i]['data'] = parseInt(rates[i]['data'], 10);
		}
	}
	
	this.pieChart.draw(rates);
}

FD4102_T02.prototype.bindData = function(item, data, listview) {
	if(item.view.setData) {
		item.view.setData(data);
	}
};