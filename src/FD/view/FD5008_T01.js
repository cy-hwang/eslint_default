

function FD5008_T01()
{
	AView.call(this);	
}
afc.extendsClass(FD5008_T01, AView);

FD5008_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);	
	
	
	this.FDlistView = this.findCompById('FDListView');
	this.FDlistView.setDelegator(this);
	
	this.tradingLbl = this.findCompById("TradingBtn");
	this.totalLbl = this.findCompById("TotalLbl");
	this.totalLbl.setText("");
	
	this.nodata = this.findCompById('Nodata');
	this.nodataLbl = this.findCompById("NodataLbl");
	
	this.sellGubunIdx = 0;
	this.sellGubun = {"0": "전체", "1":"매도", "2":"매수", "9":"시간외주문"};
	this.gubunMap = {"0": 0, "1": 2, "2": 1, "3": 9};
};


//화면이 활성화된 후 이벤트
FD5008_T01.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);		
	// 계좌세팅(투신상품만 조회)
	//this.accView.setDelegator(this);	//계좌번호 변경 이벤트 추가
	this.sDate = PensionCommon.removeAccBar(MetaInfo.fnGetToday());
	this.eDate = PensionCommon.removeAccBar(MetaInfo.fnGetToday());
	
	/*
	//2019.06.10 김재경 전체조회시 일반/예약주문 조회 모두 호출
	//예약주문 완료건 제외 필터링 추가
	//시간 범위 삭제
	var timeInfo = theApp.getTimeInfo();
	
	//추가 조회 용 키
	this.SOFFQ455contiKey = null;//매수 조회 
	this.SOFFQ445contiKey = null;//시간외
	
	
	if(timeInfo >= 080000 && timeInfo < 230000)
		this.sellGubunIdx = 0;
	else 
		this.sellGubunIdx = 3;
		
	//매수루틴을 안타고 전체메뉴에서 바로 들어가는경우 서버시간이 없으므로 디폴트로 '전체'
	if(!timeInfo)
		this.sellGubunIdx = 0;
	
	*/
	//펀드 리스트(연금/예약)
	this.SOFFQ445List = null;
	this.SOFFQ455List = null;
	
	//초기화
	this.onArrInit();
	this.setOption();
	//데이터 조회
	this.fnDoSendDataManage(0);
	
	
};


//화면이 소멸되기 전 이벤트
FD5008_T01.prototype.onWillDeactive = function(reload)
{		
	this.onArrInit();
};

//초기화
FD5008_T01.prototype.onArrInit = function()
{
	this.totalLbl.setText("총 0건");
	this.nodata.show(AComponent.VISIBLE);
	this.FDlistView.removeAllItems();
};

//매매구분값 세팅
FD5008_T01.prototype.setOption = function()
{
	var selected = this.gubunMap[this.sellGubunIdx];
	this.tradingLbl.setText(this.sellGubun[selected]);
};

//계좌번호 변경 시 이벤트
FD5008_T01.prototype.fnDoSendDataManage = function()
{
	this.onArrInit();
	this.sellGubunIdx = 0;

	this.sDate = PensionCommon.removeAccBar(MetaInfo.fnGetToday());
	this.eDate = PensionCommon.removeAccBar(MetaInfo.fnGetToday());
	this.SOFFQ455contiKey = null//매수조회
	this.SOFFQ445contiKey = null;//시간외 
	this.tradingLbl.setText(this.sellGubun[0]);
	this.sendDataFundCheck(0);
};



//펀드 데이터 조회
FD5008_T01.prototype.sendDataFundCheck = function(type)
{
	var thisObj = this;
	
	if(this.sellGubunIdx == 3) {
		this.sendSOFFQ445(type); //시간외
	}
	else if(this.sellGubunIdx == 0)
	{
		if(type)	//연속조회
			this.sendSOFFQ455(type);
		else{		//첫조회
			var callback = function(){
				thisObj.onArrInit();
				var cnt = thisObj.SOFFQ455List.length + thisObj.SOFFQ445List.length;
				if(cnt > 0){
					thisObj.nodata.show(AComponent.GONE);
					thisObj.listViewPrint(thisObj.SOFFQ455List);
					thisObj.listViewPrint(thisObj.SOFFQ445List, 9);
				}
				else{
					thisObj.nodataLbl.setText("조회 내역이 없습니다.");
					thisObj.nodata.show(AComponent.VISIBLE);
					AToast.show("주문내역이 없습니다.");
				}
				
				thisObj.totalLbl.setText("총 " + cnt + "건");
			}
			this.sendSOFFQ445(callback);
		}
	}
	else { 
		this.sendSOFFQ455(type);
	}
};



//펀드 주문내역 조회
FD5008_T01.prototype.sendSOFFQ455 = function(type, callback)
{
	var thisObj = this		
		,qrName = "SOFFQ455"
		,cont = this.getContainer()
		,cipherData = cont.secureTxf.getCipherData();
		
	if(!cont.accDbx.getSelectedItemData() || !cont.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator && !cipherData) {
		this.nodataLbl.setText("계좌비밀번호를 입력해주세요.");
		AToast.show('계좌 비밀번호를 입력하세요.');
		cont.secureTxf.addClass('active');
		return;
	}
	cont.secureTxf.removeClass('active');
	
	theApp.accNetManager.addSkipErrorCode('SOFFQ455', '2679'); // 등록된 내용이 없습니다. Skip 처리
	
	//재조회
	if(type || !this.SOFFQ455contiKey) {
		if(this.sellGubunIdx == 0){
		
		}
		else{
			this.onArrInit();
		}		
		this.SOFFQ455contiKey = null;
	}
	
	
	var checkObj = {
		svcId : qrName,
		accNo : cont.accDbx.getSelectedItemData()['D1계좌번호']
	};
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				
				
				InBlock1['D1계좌번호'] = checkObj.accNo;
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;
				InBlock1["D1조회시작일"] = thisObj.sDate;
				InBlock1["D1조회종료일"] = thisObj.eDate;
				InBlock1["D1조회구분"] = "0";
				InBlock1["D1매매구분"] = thisObj.gubunMap[thisObj.sellGubunIdx];
				
				queryData.setContiKey(thisObj.SOFFQ455contiKey);
				queryData.printQueryData();
				
				if(!afc.isSimulator){
					queryData.putPwInfo('InBlock1', 'D1비밀번호');
				}
			},
			function(queryData, groupName)
			{				
				if(queryData)
				{	
					
					//next키 저장
					thisObj.SOFFQ455contiKey = queryData.getContiKey();
				
					queryData.printQueryData();
					var outBlock = queryData.getBlockData('OutBlock1');
					
					//전체
					if(thisObj.sellGubunIdx == 0)
					{
						if(outBlock || outBlock.length > 0) {
							thisObj.nodata.show(AComponent.GONE);
// 							thisObj.listViewPrint(outBlock);
							thisObj.SOFFQ455List = outBlock;
						}
						callback();
					}
					else{
						if(!outBlock || outBlock.length == 0) {
							thisObj.nodataLbl.setText("조회 내역이 없습니다.");
							thisObj.nodata.show(AComponent.VISIBLE);
						} else {
							thisObj.nodata.show(AComponent.GONE);
						}

						if(outBlock.length == 0) {
							AToast.show("주문내역이 없습니다.");
							thisObj.totalLbl.setText("총 0건");
						} else {
							thisObj.listViewPrint(outBlock);
							thisObj.totalLbl.setText("총 " + outBlock.length + "건");
						}
					}
				}
			}		
		);
	});
};

// 예약매수내역 
FD5008_T01.prototype. sendSOFFQ445 = function(callback)
{
	var thisObj = this		
		,qrName = "SOFFQ445"
		,cont = thisObj.getContainer()
		,cipherData = cont.secureTxf.getCipherData();
		
	if(!cont.accDbx.getSelectedItemData() || !cont.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator && !cipherData) {
		this.nodataLbl.setText("계좌비밀번호를 입력해주세요.");
		AToast.show('계좌 비밀번호를 입력하세요.');
		cont.secureTxf.addClass('active');
		return;
	}
	cont.secureTxf.removeClass('active');
	
	theApp.accNetManager.addSkipErrorCode('SOFFQ445', '2679'); // 등록된 내용이 없습니다. Skip 처리
	
	if(!thisObj.SOFFQ445contiKey ){
		this.onArrInit();
		thisObj.SOFFQ445contiKey = null; 
	}
	
	var checkObj = {
		svcId : qrName,
		accNo : cont.accDbx.getSelectedItemData()['D1계좌번호']
	};
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				
				
				InBlock1['D1계좌번호'] = checkObj.accNo;
				InBlock1["D1조회시작일"] = thisObj.sDate;
				InBlock1["D1조회종료일"] = thisObj.eDate;
				InBlock1["D1조회구분"] = "0";
				queryData.setContiKey(thisObj.SOFFQ445contiKey);
				queryData.printQueryData();
			},
			function(queryData, groupName)
			{
				
				if(queryData)
				{	
					
					queryData.printQueryData();
					
					var outBlock = queryData.getBlockData('OutBlock1');
					thisObj.SOFFQ445contiKey = queryData.getContiKey();
					
					//전체
					if(thisObj.sellGubunIdx == 0)
					{
						if(outBlock || outBlock.length > 0) {
							thisObj.nodata.show(AComponent.GONE);
							for(var i = 0 ; i<outBlock.length; i++){
								if(outBlock[i]["D1주문처리여부"] == '1'){
									outBlock.splice(i,1);
								}
							}
							thisObj.SOFFQ445List = outBlock;
						}
						thisObj.sendSOFFQ455(0, callback);
					}
					else{
						if(!outBlock || outBlock.length == 0) {
							thisObj.nodataLbl.setText("조회 내역이 없습니다.");
							thisObj.nodata.show(AComponent.VISIBLE);
						} else {
							thisObj.nodata.show(AComponent.GONE);
						}

						if(outBlock.length == 0) {
							AToast.show("주문내역이 없습니다.");
							thisObj.totalLbl.setText("총 0건");
						} else {

							thisObj.listViewPrint(outBlock, 9);
							thisObj.totalLbl.setText("총 " + outBlock.length + "건");
						}
					}
				}
			}		
		);
	});
};

FD5008_T01.prototype.listViewPrint = function(outblock, type)
{

	var length = outblock.length;
	var i = 0;
	var data = [];
	var cont = this.getContainer();
	
	//예약주문내역
	if(type == 9) {
		for( i = 0; i< length; i++){
			data.push({"a1": outblock[i]['D1계좌번호'].substr(outblock[i]['D1계좌번호'].length-3, 3)
						,"a2": "임의식"
						,"a3": outblock[i]['D1펀드명']
						,"a4": outblock[i]
						,"a5": cont.secureTxf.getCipherData()
						,"a6": true});	//예약주문여부
		}
	//주문내역
	} else {
		for( i = 0; i< length; i++){
			data.push({"a1": outblock[i]['D1계좌일련번호']
						,"a2": this.getContainer().tradingValue[outblock[i]['D1납입방법코드']]
						,"a3": outblock[i]['D1펀드명']
						,"a4": outblock[i]
						,"a5": cont.secureTxf.getCipherData()
						,"a6": false});	//예약주문여부
		}
	}
	
	this.FDlistView.addItem('FD/view/FD5008_L01.lay', data);
};

// 펀드정보 데이터 출력
FD5008_T01.prototype.bindData = function(item, data, listview){	
	if(item.view.setData){
		item.view.setData(data);
	}
};

// 주문조회 유형 선택 버튼
FD5008_T01.prototype.onTradingBtnClick = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/FD5008_W01.lay', 'FD5008W01');
	win.selected = this.sellGubunIdx;
	
	win.sDateTime = this.sDate;
	win.eDateTime = this.eDate;
	
	win.openAsDialog(this);
};

FD5008_T01.prototype.onWindowResult = function(result, awindow)
{
	var thisObj = this;
	var winId = awindow.getId();
	if(winId == 'FD5008W01')
	{
		
		if(result) {
			this.sellGubunIdx = result["value"];
			this.onArrInit();
			this.setOption();
			this.sDate = result["sDate"];
			this.eDate = result["eDate"];
			this.sendDataFundCheck(0);
		}
	}
};

FD5008_T01.prototype.onFDListViewScrollBottom = function(comp, info)
{
	if(this.SOFFQ455contiKey || this.SOFFQ445contiKey) {
		this.sendDataFundCheck(true);
	} else {	
		if(comp.getItemCount() > 0) AToast.show(Message.LastList);
	}
};
