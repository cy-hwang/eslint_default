
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_V11()
{
	AView.call(this);
			
}
afc.extendsClass(FD3202_V11, AView);


//초기화
FD3202_V11.prototype.onArrInit = function()
{		
};


FD3202_V11.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);	
	
	this.userGrade = null;
	
	this.lblFundExplan1 = this.findCompById('lblFundExplan1');
	this.lblFundExplan2 = this.findCompById('lblFundExplan2');
	this.lblFundExplan3 = this.findCompById('lblFundExplan3');
	
};


//화면이 활성화된 후 이벤트
FD3202_V11.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
		
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	cont.scrToolView.show(AComponent.VISIBLE); // 상단 Simple Choice, 펀드 더보기 보임처리
	
	thisObj.checkFundDetailInfo(cont.simpleFundCode[0], 1);
	thisObj.checkFundDetailInfo(cont.simpleFundCode[1], 2);
	thisObj.checkFundDetailInfo(cont.simpleFundCode[2], 3);
	
	// 2018/05/31 스크롤 관련하여 높이 조절하는 부분 추가
	thisObj.fundActiveH = theApp.prefInfo.get('fundScroll2');
		
	if(!thisObj.fundActiveH){		
		thisObj.fundActiveH = cont.tvManager.getActiveView().getHeight(); // 화면 높이 구해옴		
		theApp.prefInfo.set('fundScroll2', thisObj.fundActiveH);		
	}else{
		thisObj.fundActiveH = theApp.prefInfo.get('fundScroll2');
		
		cont.view5.setHeight(thisObj.fundActiveH);
	}
	
	
	
	if(cont.pageData !== undefined){
		if(cont.pageData.tabId){
			if(cont.pageData.fundCode){
				if(cont.pageData.fundCode == "1"){
					thisObj.onbtnSimpeFund1Click();
				}else if(cont.pageData.fundCode == "2"){
					thisObj.onbtnSimpeFund2Click();
				}else if(cont.pageData.fundCode == "3"){
					thisObj.onbtnSimpeFund3Click();
				}
				//펀드 코드 초기화
				cont.pageData.fundCode = null;
			}
		}
	}
};


//화면이 소멸되기 전 이벤트
FD3202_V11.prototype.onWillDeactive = function(reload)
{		
	this.onArrInit();
};

// 1번째 Simple Fund 선택 Event
FD3202_V11.prototype.onbtnSimpeFund1Click = function(comp, info)
{
	
	//TODO:edit here
					
	var thisObj = this;
	var cont = thisObj.getContainer();
				
	// 선택한 펀드코드로 펀드정보 데이터 조회
	thisObj.fundDataCode = cont.simpleFundCode[0]; // 상단에 세팅한 1번째 펀드코드 세팅		
	cont.sendDataFundCheck(thisObj, function(oBlock){
		if(oBlock){			
			thisObj.simpleFundWindowPopup(oBlock);
		}else{
			theApp.alert(
				[	 
					'선택한 펀드에 대한 ', '<br/>',
					'정보가 없습니다.'					
					,' '
				].join('')
				,
				function()
				{			

				}
				,''
			);
		}
	});		
};

// 2번째 Simple Fund 선택 Event
FD3202_V11.prototype.onbtnSimpeFund2Click = function(comp, info)
{

	var thisObj = this;
	var cont = thisObj.getContainer();
				
	// 선택한 펀드코드로 펀드정보 데이터 조회
	thisObj.fundDataCode = cont.simpleFundCode[1]; // 상단에 세팅한 2번째 펀드코드 세팅		
	cont.sendDataFundCheck(thisObj, function(oBlock){
		if(oBlock){
			thisObj.simpleFundWindowPopup(oBlock);
		}else{		
	/*			
			theApp.alert(
				[	 
					'선택한 펀드에 대한 ', '<br/>',
					'정보가 없습니다.'					
					,' '
				].join('')
				,
				function()
				{			

				}
				,''
			);
	*/
		}
	});

};

// 3번째 Simple Fund 선택 Event
FD3202_V11.prototype.onbtnSimpeFund3Click = function(comp, info)
{

	//TODO:edit here
	
	var thisObj = this;
	var cont = thisObj.getContainer();
				
	// 선택한 펀드코드로 펀드정보 데이터 조회
	thisObj.fundDataCode = cont.simpleFundCode[2]; // 상단에 세팅한 3번째 펀드코드 세팅		
	cont.sendDataFundCheck(thisObj, function(oBlock){
		if(oBlock){
			thisObj.simpleFundWindowPopup(oBlock);
		}else{
			theApp.alert(
				[	 
					'선택한 펀드에 대한 ', '<br/>',
					'정보가 없습니다.'					
					,' '
				].join('')
				,
				function()
				{			

				}
				,''
			);
		}
	});
};

FD3202_V11.prototype.simpleFundWindowPopup = function(simpleFundData)
{				
	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	cont.selectFundInfo = simpleFundData;		
				
	cont.sendData('SOFFT107',
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			
			InBlock1['D1처리구분'] = '1';
		
			var InBlock2 = queryData.getBlockData('InBlock2')[0];
										
			InBlock2['D1투신국내외구분'] = '1';
			InBlock2['D1투신펀드코드'] = simpleFundData["D1투신펀드코드"];
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
		//afterOutBlockData
		function(queryData, groupName)
		{			
			if(queryData)
			{
												
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


FD3202_V11.prototype.onFundDetailWindowOpen = function(fundDetailData)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	var win = AWindow.createWindow('FD/window/FD3202_W01.lay','FD3202W1');
	
	win.setWindowOption({isFocusLostClose: false, overflow: 'scroll'});
	
	win.fundInfo = thisObj.fundInfo;
	win.contentSum = fundDetailData;

	//Left:30, Top:259, Width:580, Height:auto
	win.open(this,30,259, 580);
	
	//win.openAsDialog(this, 580);								
}


FD3202_V11.prototype.onWindowResult = function(result, windowObj)
{
	//TODO:edit here
			
	if(windowObj.containerId == 'FD3202W1'){
	
		var thisObj = this;
		var cont = thisObj.getContainer();
		
		var tabGubun = result;
		
		if(tabGubun == '0'){
		
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
				cont.scrToolView.show(AComponent.GONE); // 상단 Simple Choice, 펀드 더보기 숨김처리
				// Simple Choie에서 상세보기 후 펀드더보기 상세보기 시 문제생기는 부분으로 인하여 상단 탭 변경
				cont.tvManager.changeTab('FD3202_T02'); 
				cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V31', false);
			}else{
				if(cont.selectFundInfo["D1투신펀드코드"] == 2190){
					cont.userAgeCheck(thisObj, function(oBlock){
						if(oBlock){
							if(oBlock["D1미성년계좌여부"] == "0"){
								cont.scrToolView.show(AComponent.VISIBLE);

								var contentScrollHeight = theApp.prefInfo.get('fundScroll2');

								cont.view5.$ele.css({			
									'top': '170px'
								});

								//cont.contTabView.setHeight(contentScrollHeight);
								cont.view5.setHeight(contentScrollHeight);

								theApp.alert(
									[	 
										'메리츠주니어펀드는 가입당시','<br>',
										'20세 이하 투자자가 가입가능합니다.','<br>',
										,' '
									].join('')
									,
									function()
									{			
										thisObj.juniorPopupResult();
									}
									,''
								);
							}else{
								if(tabGubun == '3'){ 
									cont.fundNowBuyStep = 1; // 현재단계 입력
									cont.fundAllBuyStep = 2; // 총단계 입력
									cont.tvManager.changeTab('FD3202_T02'); 
									cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V06', false);
									// 정보제공구분이 미제공이거나 투자권유구분이 불원이면 투자정보 확인서 화면 이동
								}else if(tabGubun == '4'){ 
									cont.fundNowBuyStep = 3; // 현재단계 입력
									cont.fundAllBuyStep = 6; // 총단계 입력
									cont.tvManager.changeTab('FD3202_T02'); 
									cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V04', false);
									// 투자자정보확인서도 등록되어 있으며 투자권유구분이 불원이 아니고 매수내역이 없는 경우
								}else if(tabGubun == '5'){ 
									cont.fundNowBuyStep = 1; // 현재단계 입력
									cont.fundAllBuyStep = 6; // 총단계 입력
									cont.tvManager.changeTab('FD3202_T02'); 
									cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V02', false);
								}
							}
						}
					});
				}
				else if(tabGubun == '3'){ 
					cont.fundNowBuyStep = 1; // 현재단계 입력
					cont.fundAllBuyStep = 2; // 총단계 입력
					cont.tvManager.changeTab('FD3202_T02'); 
					cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V06', false);
					// 정보제공구분이 미제공이거나 투자권유구분이 불원이면 투자정보 확인서 화면 이동
				}else if(tabGubun == '4'){ 
					cont.fundNowBuyStep = 3; // 현재단계 입력
					cont.fundAllBuyStep = 6; // 총단계 입력
					cont.tvManager.changeTab('FD3202_T02'); 
					cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V04', false);
					// 투자자정보확인서도 등록되어 있으며 투자권유구분이 불원이 아니고 매수내역이 없는 경우
				}else if(tabGubun == '5'){ 
					cont.fundNowBuyStep = 1; // 현재단계 입력
					cont.fundAllBuyStep = 6; // 총단계 입력
					cont.tvManager.changeTab('FD3202_T02'); 
					cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V02', false);
				}
			}
		}
	}
};

FD3202_V11.prototype.juniorPopupResult = function()
{
	return;
}

FD3202_V11.prototype.checkFundDetailInfo = function(fundCode, simpleFundTp)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
				
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
		//afterOutBlockData
		function(queryData, groupName)
		{			
			if(queryData)
			{
				
				var InBlock2 = queryData.getBlockData('InBlock2')[0];
			
				if(simpleFundTp == 1){
					thisObj.lblFundExplan1.setText(InBlock2["D1펀드내용"]);
				}else if(simpleFundTp == 2){
					thisObj.lblFundExplan2.setText(InBlock2["D1펀드내용"]);
				}else if(simpleFundTp == 3){
					thisObj.lblFundExplan3.setText(InBlock2["D1펀드내용"]);
				}
			}
		});
	
};


