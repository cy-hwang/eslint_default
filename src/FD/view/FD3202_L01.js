
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_L01()
{
	AView.call(this);

	//TODO:edit here
	
	this.fundInfo;

}
afc.extendsClass(FD3202_L01, AView);


FD3202_L01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
			
	this.listFundName = this.findCompByGroup('listViewGrp')[0];
	this.classDetailFullName = this.findCompByGroup('listViewGrp')[1]; // 클래스상세 전체명 추가 2019.09.19
	this.lblContent = this.findCompByGroup('listViewGrp')[2];

	//TODO:edit here
	//this.listFundName.setShrinkInfo({maxChar:19, fontSize:26}); // 펀드명 자동폰트 셋팅 2019.09.26 -> 가장 긴 펀드명(23자리) 크기로 CSS에서 고정 처리함 2020.03.05 
	//this.classDetailFullName.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
};

FD3202_L01.prototype.setData = function(data)
{		
	this.listFundName.setText(data.a1); // 펀드이름 Set
			
	this.lblContent.setText(data.a3); // 펀드설명 Set
	
	this.fundInfo = (data.a2);			

	this.classDetailFullName.setText(this.fundInfo['D1클래스상세 전체명']); // 클래스상세 전체명 추가 2019.09.19
};

FD3202_L01.prototype.fundInfoSet = function(fundInfo)
{
	
};

FD3202_L01.prototype.onbtnDetailClick = function(comp, info)
{
	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	cont.selectFundInfo = this.fundInfo;		
				
	cont.sendData('SOFFT107',
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			
			InBlock1['D1처리구분'] = '1';
		
			var InBlock2 = queryData.getBlockData('InBlock2')[0];
										
			InBlock2['D1투신국내외구분'] = '1';
			InBlock2['D1투신펀드코드'] = thisObj.fundInfo["D1투신펀드코드"];
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

FD3202_L01.prototype.onFundDetailWindowOpen = function(fundDetailData)
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

FD3202_L01.prototype.onWindowResult = function(result, windowObj)
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



