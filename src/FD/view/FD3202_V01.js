
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_V01()
{
	AView.call(this);

	//TODO:edit here
				
	this.arrOutBlockData = []; // 펀드 데이터 조회 데이터 배열
	
	this.contiKey = null; // 연속키
	
}
afc.extendsClass(FD3202_V01, AView);


FD3202_V01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	this.listView1 = this.findCompById('ListView1');
	
	this.listView1.setDelegator(this);
	
	this.listCount = 0; // 펀드 개수 카운트
	
};

FD3202_V01.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
};

FD3202_V01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	// 스크롤 관련하여 처리
	/*
	thisObj.fundActiveH = theApp.userInfo.get('fundScroll2');
		
	if(thisObj.fundActiveH == undefined){		
		thisObj.fundActiveH = cont.tvManager.getActiveView().getHeight(); // 화면 높이 구해옴		
		theApp.userInfo.set('fundScroll2', thisObj.fundActiveH);		
	}else{
		thisObj.fundActiveH = theApp.userInfo.get('fundScroll2');		
	}
	
	*/
	
	// userInfo 저장을 쓰면 펀드매수 단계가 아니면서 화면이 종료될 때 문제가 생기는 현상으로 인하여
	// 기기에 저장하는 prefInfo 를 사용함 2018/05/31
	
	thisObj.fundActiveH = theApp.prefInfo.get('fundScroll2');
		
	if(!thisObj.fundActiveH){		
		thisObj.fundActiveH = cont.tvManager.getActiveView().getHeight(); // 화면 높이 구해옴		
		theApp.prefInfo.set('fundScroll2', thisObj.fundActiveH);		
	}else{
		thisObj.fundActiveH = theApp.prefInfo.get('fundScroll2');
		
		cont.view5.setHeight(thisObj.fundActiveH);
	}
	
	
	cont.scrToolView.show(AComponent.VISIBLE); // 상단 Simple Choice, 펀드 더보기 보임처리
	
	// 선택된 펀드정보 초기화
//	this.fundInfoClear();
	
	// 화면이 그려지기 전에 연속키 클리어
	thisObj.contiKey = null;
	thisObj.sendDataFundCheck();

	if(cont.pageData !== undefined){
		if(cont.pageData.tabId){
			if(cont.pageData.fundCode){
				if(cont.pageData.fundCode == "2000"){
					thisObj.specificFundWindowPopup();
				//펀드 코드 초기화
				cont.pageData.fundCode = null;
				}
			}
		}
	}

};

FD3202_V01.prototype.specificFundWindowPopup = function()
{
	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	
//	cont.selectFundInfo = this.fundInfo;		
				
	cont.sendData('SOFFT107',
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			
			InBlock1['D1처리구분'] = '1';
		
			var InBlock2 = queryData.getBlockData('InBlock2')[0];
										
			InBlock2['D1투신국내외구분'] = '1';
			InBlock2['D1투신펀드코드'] = cont.pageData.fundCode;
			InBlock2['D1이용사번호'] = theApp.systemInfo.fno;
			InBlock2['D1펀드내용'] = '';
			InBlock2['D1투자기간일수'] = '';
			InBlock2['D1환매수수료내용'] = '';
			InBlock2['D1보수내용'] = '';
			InBlock2['D1운용전략내용'] = '';
			InBlock2['D1위험관리전략내용'] = '';
			InBlock2['D1가입대상명'] = '';
			InBlock2['D1목표수익률'] = '0';
			InBlock2['D1펀드운용역명'] = '';
																
			queryData.printQueryData();				
		 },
		//afterOutBlockData
		function(queryData, groupName)
		{			
			if(queryData)
			{
				queryData.printQueryData();
												
				var InBlock2 = queryData.getBlockData('InBlock2')[0];
				
				var content1 = "";
				var content2 = "";
				var contentSum = "";
				
				if(InBlock2){
					content1 = InBlock2["D1운용전략내용"];
					content2 = InBlock2["D1위험관리전략내용"];
					contentSum = content1 + " " + content2;
				}
				
				thisObj.onFundDetailWindowOpen(contentSum);
				
				
			}
		});			
};

FD3202_V01.prototype.onFundDetailWindowOpen = function(fundDetailData)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	var win = AWindow.createWindow('FD/window/FD3202_W01.lay','FD3202W1');
	
	win.setWindowOption({isFocusLostClose: false, overflow: 'scroll'});
	
	win.fundInfo = thisObj.fundInfo;
	win.contentSum = fundDetailData;

	//Left:30, Top:259, Width:580, Height:auto
	win.open(this,30,259, 580);
	
//	win.openAsDialog(this, 580);

}

FD3202_V01.prototype.onWindowResult = function(result, windowObj)
{
	//TODO:edit here
	
	if(windowObj.containerId == 'FD3202W1'){
	
		var thisObj = this;
		var cont = thisObj.getContainer();	
		
		var tabGubun = result;
				
		if(result == '0'){
			
		}else{
//			cont.scrToolView.show(AComponent.GONE); // 상단 Simple Choice, 펀드 더보기 숨김처리
			cont.scrToolView.show(AComponent.GONE); // 상단 Simple Choice, 펀드 더보기 숨김처리
			
			//스크롤 영역 변경
			cont.view5.$ele.css({
		 		'top': '0px'		
			});	
			cont.view5.setHeight(cont.view5.getHeight() + cont.scrToolView.getHeight());
			
			
			//상단 타이틀 바 제목 세팅
			cont.titleLbl.setText('펀드매수');
						
			// 상세보기 화면									
			if(tabGubun == '2'){
				cont.tvManager.changeTab('FD3202_T02');
				cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V31', false);
				// 현재 펀드에 대해서 매수내역이 있는 경우
			}else if(tabGubun == '3'){ 
				cont.fundNowBuyStep = 1; // 현재단계 입력
				cont.fundAllBuyStep = 2; // 총단계 입력					
				cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V06', false);
				// 정보제공구분이 미제공이거나 투자권유구분이 불원이면 투자정보 확인서 화면 이동
			}else if(tabGubun == '4'){ 
				cont.fundNowBuyStep = 3; // 현재단계 입력
				cont.fundAllBuyStep = 6; // 총단계 입력					
				cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V04', false);
				// 투자자정보확인서도 등록되어 있으며 투자권유구분이 불원이 아니고 매수내역이 없는 경우
			}else if(tabGubun == '5'){ 
				cont.fundNowBuyStep = 1; // 현재단계 입력
				cont.fundAllBuyStep = 6; // 총단계 입력					
				cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V02', false);
			}
		}
	}
			
};


FD3202_V01.prototype.onWillDeactive = function(reload)
{
	AView.prototype.onWillDeactive.call(this, reload);
	
	var thisObj = this;
	var cont = thisObj.getContainer();
		
	cont.tvManager.getActiveView().setHeight(thisObj.fundActiveH + cont.scrToolView.getHeight());
	
};

FD3202_V01.prototype.fundInfoClear = function()
{
	var thisObj = this;
	var cont = thisObj.getContainer();

	cont.selectFundInfo = null;
	
};

// 펀드조회
FD3202_V01.prototype.sendDataFundCheck = function()
{
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	var arrCnt;
			
	if(!thisObj.contiKey)
	{
		// 연속키 없으면 ListView 조회전 클리어
		arrCnt = 0; // 연속키가 없으면 배열값 초기화		
		thisObj.listCount = 0;
		
		thisObj.listView1.removeAllItems();
	}else{
		arrCnt = thisObj.arrOutBlockData.length;
		thisObj.listCount = thisObj.arrOutBlockData.length;
		
	}
		
	cont.sendData('SOFFQ421',
	function(queryData, groupName)
		{	
			queryData.setHeaderInfo({
				FUNC_KEY_LST: !thisObj.contiKey?'C':'7'
			});
			
		var InBlock1 = queryData.getBlockData('InBlock1')[0];				
		
		InBlock1['D1투신펀드코드'] = '';
		InBlock1['D1운용사코드'] = '000';
		InBlock1['D1기준일'] = MetaInfo.fnGetToday('NUMDATE');
		InBlock1['D1투신펀드유형구분'] = '';
		InBlock1['D1간접투자코드'] = '';
		InBlock1['D1가입자격구분'] = '';
		InBlock1['D1투자기간코드'] = '';
		InBlock1['D1한글투신펀드명'] = '';
		InBlock1['D1투신상세코드'] = '';
		InBlock1['D1투자방식코드'] = '';
		InBlock1['D1구분'] = '0';
		InBlock1['D1투자등급코드'] = '00'; // 모든투자등급이 나오는 코드
				
		if(thisObj.contiKey){
			queryData.setContiKey(thisObj.contiKey);	
		}
		
	},
	function(queryData, groupName) {

		if(queryData != null){
				
			var OutBlock1 = queryData.getBlockData('OutBlock1');
						
			if(!OutBlock1) return;

			if(OutBlock1.length > 0)
			{
/*
				for(thisObj.listCount;thisObj.listCount < OutBlock1.length ; thisObj.listCount++)
				{
					// SimpleFund 에 있는 내용은 펀드더보기에서는 제외
					if(OutBlock1[thisObj.listCount]["D1투신펀드코드"] == cont.simpleFundCode[0] 
						|| OutBlock1[thisObj.listCount]["D1투신펀드코드"] == cont.simpleFundCode[1] 
						|| OutBlock1[thisObj.listCount]["D1투신펀드코드"] == cont.simpleFundCode[2]
						|| OutBlock1[thisObj.listCount]["D1투신상세코드"] == '77') // 181001추가 연금펀드내용 제외
					{
					
					}
					else
					{
						thisObj.arrOutBlockData[arrCnt] = OutBlock1[thisObj.listCount];
						thisObj.arrOutBlockData[arrCnt]['펀드설명1'] = ''; // 펀드설명 기본으로 디폴트값
						arrCnt++;
					}
						
						// 테스트하기 위해서 아래의 소스를 사용
						//thisObj.arrOutBlockData[thisObj.listCount] = OutBlock1[thisObj.listCount];
						//thisObj.arrOutBlockData[thisObj.listCount]['펀드설명1'] = ''; // 펀드설명 기본으로 디폴트값
				}						
*/
				
				for(var i=0; i<OutBlock1.length; i++)
				{
					// SimpleFund 에 있는 내용은 펀드더보기에서는 제외
					if(OutBlock1[i]["D1투신펀드코드"] == cont.simpleFundCode[0] 
						|| OutBlock1[i]["D1투신펀드코드"] == cont.simpleFundCode[1] 
						|| OutBlock1[i]["D1투신펀드코드"] == cont.simpleFundCode[2]
						|| OutBlock1[i]["D1투신상세코드"] == '77') // 181001추가 연금펀드내용 제외
					{
						//Pass!!!
					}
					else
					{
						thisObj.arrOutBlockData[arrCnt] = OutBlock1[i];
						thisObj.arrOutBlockData[arrCnt]['펀드설명1'] = ''; // 펀드설명 기본으로 디폴트값
						arrCnt++;
						thisObj.listCount++
					}
				}										
					
				// 펀드더보기에서 나오는 갯수만큼 높이 설정
				cont.tvManager.getActiveView().setHeight(247*thisObj.arrOutBlockData.length + 30);	
			}
			
			//next키 저장
			thisObj.contiKey = queryData.getContiKey();
			
			//[임시] onListView1ScrollBottom 연속키 이벤트 처리 안 되서 임시 조치함
			if(thisObj.contiKey) {
				thisObj.sendDataFundCheck();
			}else{
				thisObj.listViewSet();
			}
			
		}else{
			thisObj.contiKey = null;
		}
	});	
};

FD3202_V01.prototype.listViewSet = function()
{		
	var thisObj = this;
	thisObj.listCount = 0;
	
	if(thisObj.contiKey){
		listCount = thisObj.arrOutBlockData.length;
	}
	
	for(thisObj.listCount; thisObj.listCount<thisObj.arrOutBlockData.length; thisObj.listCount++){
		thisObj.checkFundDetailInfo(thisObj, thisObj.arrOutBlockData[thisObj.listCount]["D1투신펀드코드"], thisObj.listCount, function(arrCnt){			
			if(arrCnt == thisObj.arrOutBlockData.length-1){ // 펀드설명에 대한 데이터를 서버에서 모두 조회 후 펀드 Set				
				thisObj.listViewSetList();	
			}
		})
	}			
};

FD3202_V01.prototype.listViewSetList = function()
{
	var thisObj = this;
	
	for(var i=0; i<thisObj.arrOutBlockData.length; i++){				
		thisObj.listView1.addItem('FD/view/FD3202_L01.lay',[{"a1":thisObj.arrOutBlockData[i]['D1한글투신펀드명'], "a2":thisObj.arrOutBlockData[i], "a3":thisObj.arrOutBlockData[i]['펀드설명1']}]);
	}						
};

FD3202_V01.prototype.checkFundDetailInfo = function(caller, fundCode, arrCnt)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	var thisObj2 = caller;
	var callback = arguments[3];
				
	cont.sendData('SOFFT107',
	function(queryData, groupName)
	{
		var InBlock1 = queryData.getBlockData('InBlock1')[0];

		InBlock1['D1처리구분'] = '1';

		var InBlock2 = queryData.getBlockData('InBlock2')[0];

		InBlock2['D1투신국내외구분'] = '1';
		InBlock2['D1투신펀드코드'] = fundCode;
		InBlock2['D1이용사번호'] = theApp.systemInfo.fno;
		InBlock2['D1펀드내용'] = '';
		InBlock2['D1투자기간일수'] = '';
		InBlock2['D1환매수수료내용'] = '';
		InBlock2['D1보수내용'] = '';
		InBlock2['D1운용전략내용'] = '';
		InBlock2['D1위험관리전략내용'] = '';
		InBlock2['D1가입대상명'] = '';
		InBlock2['D1목표수익률'] = '0';
		InBlock2['D1펀드운용역명'] = '';

	},	
	function(queryData, groupName)
	{			
		if(queryData)
		{			
			var InBlock2 = queryData.getBlockData('InBlock2')[0];

			if(InBlock2){
				thisObj.arrOutBlockData[arrCnt]['펀드설명1'] = InBlock2["D1펀드내용"];
			}
		}
				
		callback(arrCnt);
	});
			
};

// 펀드상품정보 데이터 출력
FD3202_V01.prototype.bindData = function(item, data, listview){
	if(item.view.setData){
		item.view.setData(data);
	}
};

FD3202_V01.prototype.onListView1ScrollBottom = function(comp, info)
{
	//TODO:edit here
	if(this.contiKey)
	{
		this.sendDataFundCheck(true);
	}
	else
	{	
		// if(comp.getRowCount() > 0) AToast.show(Message.LastList);
	}
	
};
