
/**
Constructor
Do not call Function in Constructor.
*/
function FD4102_T03()
{
	AView.call(this);	
}
afc.extendsClass(FD4102_T03, AView);


//초기화
FD4102_T03.prototype.onArrInit = function()
{	
	this.listview.removeAllItems();
	
	var d = new Date()
	d.setMonth(d.getMonth() - 1);

	this.startDate = Utils.yyyymmdd(d);
	this.endDate = Utils.yyyymmdd(new Date());
	this.type = '0';
	this.button3.setText('1개월 · 전체');
	this.nodata.show(AComponent.GONE);
	this.label8.setText( '총 0건');
	this.dayType = [1,0];
	this.centerView.scrollTo(0);
};


FD4102_T03.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
			
	this.accView = this.getContainer().findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx;
	this.secureTxf = this.accView.secureTxf;
	this.listview = this.findCompById('ListView1');
	this.listview.setDelegator(this);
	this.button3 = this.findCompById('Button3');
	this.label8 = this.findCompById('Label8');
	
	this.centerView = this.findCompById('CenterView');
	
	var d = new Date()
	d.setMonth(d.getMonth() - 1);

	this.startDate = Utils.yyyymmdd(d);
	this.endDate = Utils.yyyymmdd(new Date());
	this.type = '0';
	
	this.length = 0;
	
	this.nodata = this.findCompById('Nodata');
	this.dayType = [1,0];
};

FD4102_T03.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);	
	
	this.secureTxf.show(AComponent.VISIBLE);
	this.accDbx.setWidth('428px');
	this.fnDoSendDataManage();
};

//화면이 활성화된 후 이벤트
FD4102_T03.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);	
};


//화면이 소멸되기 전 이벤트
FD4102_T03.prototype.onWillDeactive = function(reload)
{		
	this.onArrInit();
};

/*"조회구분,D1조회구분,0,QryTp,STRING,1,0",
				"계좌번호,D1계좌번호,0,AcntNo,STRING,20,0",
				"비밀번호,D1비밀번호,0,Pwd,STRING,8,0",
				"조회시작일,D1조회시작일,0,QrySrtDt,STRING,8,0",
				"조회종료일,D1조회종료일,0,QryEndDt,STRING,8,0",
				"시작번호,D1시작번호,0,SrtNo,NUMSTRING,10,0",
				"상품유형코드,D1상품유형코드,0,PdptnCode,STRING,2,0",
				"종목번호,D1종목번호,0,IsuNo,STRING,12,0",
				"정렬순서구분,D1정렬순서구분,0,StnlnSeqTp,STRING,1,0"*/
FD4102_T03.prototype.sendSDPBQ001 = function(contiKey)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator)
	{
		if(!this.secureTxf.getCipherData())
		{
			AToast.show('계좌 비밀번호를 입력하세요.');
			this.secureTxf.addClass('active');
			return;
		}
	}	
	
	if(!contiKey) {
		this.listview.removeAllItems();
		this.length = 0;
	} 
	
// 	theApp.accNetManager.addSkipErrorCode('SDPKT360', '3130');
	cont.sendData('SDPBQ001', function(queryData, groupName){
		/*		queryData.setHeaderInfo({
			FUNC_KEY_LST: '5'
		});
*/		
		var InBlock1 = queryData.getBlockData('InBlock1')[0];
		InBlock1['D1조회구분'] = thisObj.type;
		InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
// 		InBlock1['D1계좌번호'] = '00191000054';
		InBlock1['D1조회시작일'] = thisObj.startDate;
		InBlock1['D1조회종료일'] = thisObj.endDate;
		InBlock1['D1시작번호'] = '0';
		InBlock1['D1상품유형코드'] = '4';
		InBlock1['D1종목번호'] = '';
		InBlock1['D1정렬순서구분'] = '2';

		if(afc.isSimulator)
		{
			InBlock1['D1비밀번호'] = '0423'
			queryData.printQueryData();
		} else {
			InBlock1['D1비밀번호'] = thisObj.secureTxf.getCipherData();	
			queryData.putPwInfo('InBlock1', 'D1비밀번호');	
		}
		
		if(contiKey && contiKey != 0) {
			queryData.setContiKey(contiKey);
		}			

		//	theApp.setBriefSign(queryData);	
		if(afc.isSimulator)
		{
			queryData.printQueryData();
		}	
	},
				  function(queryData, groupName) {
		var errorData = this.getLastError();	
		
		if(!queryData) return;
		var OutBlock1 = queryData.getBlockData('OutBlock2');

		if(!OutBlock1 || OutBlock1.length == 0) {
			thisObj.nodata.show(AComponent.VISIBLE);
		} else {
			thisObj.nodata.show(AComponent.GONE);
		}
		thisObj.length += OutBlock1.length;
		thisObj.label8.setText( '총 ' + thisObj.length + '건');
		
		//next키 저장
		thisObj.contiKey = queryData.getContiKey();

		afc.log(thisObj.contiKey);
		if(afc.isSimulator)
		{
			queryData.printQueryData();
		}	
		
// 		OutBlock1.forEach(function(outblock) {
			thisObj.listview.addItem('FD/view/FD4102_V02.lay', OutBlock1);
// 		});
	});	
};

FD4102_T03.prototype.bindData = function(item, data, listview) {
	if(item.view.setData) {
		item.view.setData(data);
	}
};

FD4102_T03.prototype.fnDoSendDataManage = function() {
	this.nodata.show(AComponent.GONE);
	this.secureTxf.removeClass('active');
	this.sendSDPBQ001();	
};

FD4102_T03.prototype.onListView1ScrollBottom = function(comp, info)
{
	if(this.contiKey) {
		this.sendSDPBQ001(this.contiKey);
	}
	//TODO:edit here

};

FD4102_T03.prototype.onButton3Click = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/FD4102_W01.lay', 'FD410201');
	win.setWindowOption(
	{
		isAutoCenter: true
	});
	win.dayType = this.dayType;
	win.date = [this.startDate, this.endDate];
	win.open(this, 0, 0, 580, 750);
};

FD4102_T03.prototype.onWindowResult = function(result, awindow)
{
	var winId = awindow.getId();
	if(winId == 'FD410201')
	{
// 		var d = new Date()
	// 	d.setMonth(d.getMonth() - 1);
// 		d.setMonth(d.getMonth() - 3);
	// 	d.setDate(d.getDate() - 7);

		if(Array.isArray(result)) {
			this.startDate = result[0];
			this.endDate = result[1];
			this.type = result[2];
			this.button3.setText(result[3] + ' · ' + result[4]);
			this.dayType = result[5];
			this.sendSDPBQ001();
		}
	}
};