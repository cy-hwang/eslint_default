
/**
Constructor
Do not call Function in Constructor.
*/
function FD4102_T01()
{
	AView.call(this);	
}
afc.extendsClass(FD4102_T01, AView);


//초기화
FD4102_T01.prototype.onArrInit = function()
{		
	this.listview.removeAllItems();
	this.result = [];
	this.result2 = [];
	this.sum = 0;
	this.sum2 = 0;
	this.money = 0;
	this.money2 = 0;
	this.money3 = 0;
	this.money4 = 0;
	this.nextKey = 0;
	this.nodata.show(AComponent.GONE);
	this.centerView.scrollTo(0);
	
	// 2019.10.16. SOFFQ447 기준일 셋팅값 화면 종료하면서 클리어하도록 변경
	this.OrdDt = null;
	
	// 2019.10.18. 조회표시 기준일자
	this.lblStandDate.setText('');
	
};


FD4102_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);	
			
	this.accView = this.getContainer().findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx;
	this.secureTxf = this.accView.secureTxf;
	
	this.listview = this.findCompById('ListView1');
	this.listview.setDelegator(this);
	this.grid = this.findCompById('Grid2');
	
	// 2019.10.18. 조회표시 기준일자
	this.lblStandDate = this.findCompById('LblStandDate');
	
	this.nextKey = 0;
	
	this.result = [];
	this.result2 = [];
	
	this.sum = 0;
	this.sum2 = 0;
	this.money = 0;
	this.money2 = 0;
	this.money3 = 0;
	this.money4 = 0;
	
	
	this.orderAmt = 0; //주문금액
	this.depositReceived = 0; //예수금
	
	
	this.centerView = this.findCompById('CenterView');
	
	this.nodata = this.findCompById('Nodata');
	
	this.OrdDt = null;
};

FD4102_T01.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);	
	
	this.secureTxf.show(AComponent.GONE);
	this.accDbx.setWidth('578px');
	this.fnDoSendDataManage();
};

//화면이 활성화된 후 이벤트
FD4102_T01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	// 2020.04.21. 적립식매수절차 팝업 요청 (2020.04.30. 까지만 오픈하도록 요청)
	// 2020.05.04. 이미지 변경하여 적립식매수절차 팝업 요청(2020.05.11. 까지만 오픈하도록 요청)
	var now = new Date();			
	var now2 = null;			
	now2 = now.format('yyyyMMdd');
	
	var popupEvtDate = theApp.prefInfo.get('MonthBuyStepDate');
	
//	if(now2 <= 20200430){
	if(now2 <= 20200511){
		if(popupEvtDate < now2){
			var win = AWindow.createWindow('FD/window/FD0000_W17.lay', 'FD000W17');	
			win.open(this, 0, 0, '100%', '100%');
		}
	}
};


//화면이 소멸되기 전 이벤트
FD4102_T01.prototype.onWillDeactive = function(reload)
{		
	this.onArrInit();
};

//계좌 변경 시 호출
FD4102_T01.prototype.fnDoSendDataManage = function() {
	this.nodata.show(AComponent.GONE);
	this.result = [];
	this.sendSDPAQ001();	
};

// 	this.accView = this.findCompById('AccView');
// 	this.accView.viewLoad('FD/view/FD0000_V01.lay');
// 	
// 	계좌드롭박스
// 	this.accDbx = this.accView.getLoadView().accDbx;
// 	this.secureTxf = this.accView.getLoadView().secureTxf;
	
	
FD4102_T01.prototype.sendSDPAQ001 = function()
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
		thisObj.depositReceived = thisObj.money - thisObj.orderAmt; //예수금(=예수금총얙 - 주문금액)
		

		if(thisObj.OrdDt != null) {
			thisObj.sendSOFFQ447();
		} else {
			thisObj.sendSCMAQ048();
		}
		
	});	
};

FD4102_T01.prototype.sendSCMAQ048 = function()
{
	/*var thisObj = this;
	
	theApp.accNetManager.sendProcessByName('SCMAQ048', null, null, 

										   function(queryData)
										   {
		var inBlockData = queryData.getBlockData('InBlock1')[0];
		inBlockData['D1일자공통그룹코드'] = '010';

		queryData.printQueryData();
	},

										   //afterOutBlockData
										   function(queryData, groupName)
										   {
		var errCode = this.getLastError('errCode');
		if(errCode > 1000) {
		
		} else	if(queryData) {
			queryData.printQueryData();

			var outBlockData = queryData.getBlockData('OutBlock1')[0];

			thisObj.OrdDt = outBlockData['D1주문일'];
			
			// 2019.10.18. 조회표시 기준일자 
			thisObj.lblStandDate.setText("(" + thisObj.OrdDt.substring(0,4) + "." + thisObj.OrdDt.substring(4,6) + "." + thisObj.OrdDt.substring(6,8) + " 기준)");
			
			thisObj.sendSOFFQ447();
		}
	});*/
	
	this.ordDt = theApp.userInfo.get('BizDt');
	this.lblStandDate.setText("(" + this.ordDt.substring(0,4) + "." + this.ordDt.substring(4,6) + "." + this.ordDt.substring(6,8) + " 기준)");
	this.sendSOFFQ447();
};

FD4102_T01.prototype.sendSOFFQ447 = function(contiKey)
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
		
		var InBlock1 = queryData.getBlockData('InBlock1')[0];
		InBlock1['D1조회구분'] = '1';
		InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
		InBlock1['D1비밀번호'] = '';
// 		InBlock1['D1기준일'] = Utils.yyyymmdd(new Date());
		InBlock1['D1기준일'] = thisObj.OrdDt;
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
		
		thisObj.result2 = [];
		
		if(!OutBlock2 || OutBlock2.length == 0) {
			thisObj.nodata.show(AComponent.VISIBLE);
		} else {
			thisObj.nodata.show(AComponent.GONE);
		}
		
		OutBlock2.forEach(function(outblock) {
			thisObj.result.push({'name' : outblock['D1펀드명'], '매수원금' : outblock['D1원금액'], '평가금액' : outblock['D1평가금액'], '기준가' : outblock['D1매매기준가'], '잔고좌수' : outblock['D1펀드잔고수량'], '수익률' : outblock['D1수익률'], '펀드코드' : outblock['D1투신펀드코드'], '납입방법' : outblock['D1납입방법코드'], '펀드계좌번호' : outblock['D1계좌번호'],'HTS여부' : outblock['D1HTS매매가능여부']});
		});
		
		//next키 저장
		thisObj.nextKey = queryData.getContiKey();

		if(contiKey) {
			thisObj.addMore();
		} else {
			thisObj.drawPieChart();
		}
	});	
};


/*FD4102_T01.prototype.calcSum = function(index)
{
	var thisObj = this;
	
	if(!index) index = 0;
	
	if(this.accList[index]) {
		this.sendSOFFQ126(0, index);
	} else {
		drawPieChart();
	}
};

FD4102_T01.prototype.sendSOFFQ126 = function(contiKey, index)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
// 	theApp.accNetManager.addSkipErrorCode('SDPKT360', '3130');
	cont.sendData('SOFFQ126', function(queryData, groupName){
		/*		queryData.setHeaderInfo({
			FUNC_KEY_LST: '5'
		});
		
		var InBlock1 = queryData.getBlockData('InBlock1')[0];
		InBlock1['D1조회일'] = Utils.yyyymmdd(new Date());
		InBlock1['D1서브계좌번호'] = thisObj.accList[index];

		if(contiKey && contiKey != 0) {
			queryData.setContiKey(contiKey);
		}			

		//	theApp.setBriefSign(queryData);	
		queryData.printQueryData();
	},
				  function(queryData, groupName) {

		var errorData = this.getLastError();	

		if(!queryData) {
			thisObj.calcSum(index+1);
			return;
		}
		
		var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
		var OutBlock2 = queryData.getBlockData('OutBlock2');


		thisObj.result[thisObj.accList[index]]['평가금액'] = OutBlock1['D1평가금액'];

		OutBlock2.forEach(function(outblock) {
			thisObj.result[thisObj.accList[index]]['매수원금'] = thisObj.result[thisObj.accList[index]]['매수원금'] + outblock['D1매수원금'];
		});

		//next키 저장
		var nextKey = queryData.getContiKey();

		afc.log(nextKey);
		if(nextKey && nextKey != 0) {
			thisObj.sendSOFFQ126(nextKey);
		} else {
			thisObj.calcSum(index+1);
			return;
		}
	});	
};*/

FD4102_T01.prototype.drawPieChart = function() 
{
	
	this.grid.setCellText(0,2,afc.addComma(this.depositReceived) + '원');	//현금-예수금
	this.grid.setCellText(1,2,afc.addComma(this.orderAmt) + '원');			//현금-주문금
	this.grid.setCellText(2,2,afc.addComma(this.money2) + '원');				//투자원금
	this.grid.setCellText(3,2,afc.addComma(this.money3) + '원');				//펀드평가액(세전)
	
	/*
	this.grid.setCellText(0,1,afc.addComma(this.money) + '원');
	this.grid.setCellText(1,1,afc.addComma(this.money2) + '원');
	this.grid.setCellText(2,1,afc.addComma(this.money3) + '원');
	*/
	if($.isNumeric(this.money4)) {
		this.grid.setCellText(4,2,afc.floorPer(this.money4, 2));
	} else {
		this.grid.setCellText(4,2,'0%');
	}
	this.listview.addItem('FD/view/FD4102_V01.lay', this.result);
}

FD4102_T01.prototype.addMore = function()
{
	this.listview.addItem('FD/view/FD4102_V01.lay', this.result2);	
}

FD4102_T01.prototype.bindData = function(item, data, listview) {
	if(item.view.setData) {
		item.view.setData(data);
	}
};
FD4102_T01.prototype.onListView1ScrollBottom = function(comp, info)
{
	if(this.nextKey && this.nextKey != 0)
	this.sendSOFFQ447(this.nextKey);
	//TODO:edit here

};
