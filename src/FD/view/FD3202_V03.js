
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_V03()
{
	AView.call(this);

	//TODO:edit here
		
}
afc.extendsClass(FD3202_V03, AView);


FD3202_V03.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	//TODO:edit here
	this.lblFundRiskNm = this.findCompById("lblFundRiskNm");	
	this.lblStep = this.findCompById('lblStep');
		

				
};

FD3202_V03.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);		
};

FD3202_V03.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	
		//계좌번호 로드뷰
	thisObj.accView = this.findCompById('AccView');
	thisObj.accView.viewLoad('FD/view/FD0000_V02.lay');
	
	//계좌드롭박스
	thisObj.accDbx = thisObj.accView.getLoadView().accDbx;
	
	thisObj.accView.getLoadView().doInitAccInfo(4);
	
	// 계좌컨트롤 숨김
//	thisObj.accView.show(AComponent.GONE);
	
	// 현재 단계 출력
	var lblStepText =[];
	
	lblStepText.push("<span class='fc_red3'>" + cont.fundNowBuyStep + "</span><span class='step'>/" + cont.fundAllBuyStep + "단계</span>");
				
			thisObj.lblStep.$ele.children().eq(0).html(lblStepText);
	
	//thisObj.lblStep.setText( cont.fundNowBuyStep + "/" +cont.fundAllBuyStep + " 단계");
		
	// 펀드위험등급 출력
	thisObj.printFundInfoContent();
	
};

// 펀드위험등급 출력
FD3202_V03.prototype.printFundInfoContent = function(reload)
{			
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	var lblText =[];
	
	lblText.push("<span class='font30'>선택하신 펀드의 위험등급은</span><br/><span class='font30_3'>'" + cont.selectFundInfo["D1위험구분"] + "'</span> <span class='font30'>입니다.</span>");
				
	thisObj.lblFundRiskNm.$ele.children().eq(0).html(lblText);
	
	//thisObj.lblFundRiskNm.setText("선택하신 펀드의 위험등급은 " + cont.selectFundInfo["D1위험구분"] + " 입니다.");
		
};

FD3202_V03.prototype.onbtnNext3Click = function(comp, info)
{

	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	var fundKindCode = cont.selectFundInfo["D1펀드종류코드"];
	
	var drvtInvstTerm = cont.g_UserDrvtInvstTerm; // 파생상품투자기간
	var nowDay = MetaInfo.fnGetToday('DATENUM');

	// 고객 나이를 연도별,월별로 계산하여 실제 나이를 구해옴
	var userAgeYear = Number(nowDay.substring(0,4)) - Number(cont.g_UserBirth.substring(0,4));
	var userAgeMonth = Number(nowDay.substring(4,8)) - Number(cont.g_UserBirth.substring(4,8));
	var userAge = 0;
	
	userAge = userAgeYear;			
	
	// 고객나이를 만으로 구해옴
	if(userAgeMonth < 0)
	{
		userAge = userAgeYear - 1;
	}
	
	// 고객등급과 펀드종류 위험등급 비교
	//(고객성향이 위험도코드 등급보다 낮으면 부적합금융투자상품거래확인서 작성 필요확인 조회)
	if(cont.g_UserGrade >= cont.selectFundInfo["D1위험도코드"]){
		if((fundKindCode == "02") || (fundKindCode == "04") || (fundKindCode == "06") || (fundKindCode == "08") || (fundKindCode == "10") || (fundKindCode == "12") || (fundKindCode == "14") || (fundKindCode == "16") || (fundKindCode == "18")){
			if(userAge >= 65){
				if(drvtInvstTerm >= 36){
					//alert("65세이상이지만 투자기간이 3년이상이면 가입가능");
					cont.fundNowBuyStep = cont.fundNowBuyStep + 1; // 다음스텝 넘어가기 전 세팅(3단계)
					cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V04', false);
				}else{
					// 부적정으로 부적합보고서 작성후 펀드가입 가능
					thisObj.nonReportChk();			
				}				
			}else{
				// 투자기간 1년이상 적정
				if(drvtInvstTerm >= 12){
					//alert("65세미만 투자기간이 1년이면 가입가능");
					cont.fundNowBuyStep = cont.fundNowBuyStep + 1; // 다음스텝 넘어가기 전 세팅(3단계)
					cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V04', false);
				}else{
					// 부적정으로 부적합보고서 작성후 펀드가입 가능
					thisObj.nonReportChk();	
				}				
			}			
		}else{	
			cont.fundNowBuyStep = cont.fundNowBuyStep + 1; // 다음스텝 넘어가기 전 세팅(3단계)
			cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V04', false);
		}
	}else{		
		thisObj.nonReportChk();
	}
};

// 부적합금융투자상품거래확인서 필요 조회 함수
FD3202_V03.prototype.nonReportChk = function()
{
	var thisObj = this;
	var cont = thisObj.getContainer();
		
	thisObj.accNo = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
	
	thisObj.fundCode= cont.selectFundInfo["D1투신펀드코드"];
	
	thisObj.TrxTp = '3'; // 1:등록, 3:조회
	
	// 해당계좌에 해당펀드에 대한 부적합금융투자상품거래확인서 등록여부 조회
	cont.nonReportRegChk(thisObj, function(oBlock){		
		if(oBlock == "0136"){			
			thisObj.confirmNextStep();
		}else if(oBlock == "3956"){
			// 부적정으로 부적합보고서 작성 가능 페이지로 변동
			theApp.confirm('이 펀드를 매수하기 위해서는<br/>부적합금융투자상품거래서 작성이<br/>필요합니다. 계속 진행하시겠습니까?',
				function(result){
					if(result){
						thisObj.onInvestInfoPopup();
					}else{

					}					
				}
				,'', ['예','아니오']
			);
		}
	});		
};


// 부적합금융투자상품거래확인서 필요 조회 함수
FD3202_V03.prototype.nonReportReg = function()
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
/*	thisObj.accList = theApp.accInfo.filterAccList(0); // 계좌번호 리스트 가져오기	
	thisObj.accNo = thisObj.accList[0]["D1계좌번호"]; // 첫번째 계좌 사용*/
	
	thisObj.accNo = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
	
	thisObj.fundCode= cont.selectFundInfo["D1투신펀드코드"];
	
	thisObj.TrxTp = '1'; // 1:등록, 3:조회
	
	// 해당계좌에 해당펀드에 대한 부적합거래확인서 등록
	cont.nonReportRegChk(thisObj, function(oBlock){		
		if(oBlock){			
			
			// 팝업창에서 토스트창으로 변경
			AToast.show("부적합 금융투자상품 거래 확인서 작성이 완료되었습니다.");
			thisObj.confirmNextStep();
			
		}else
		{
			// 부적합금융투자상품 거래 확인서 작성이 실패하였을 경우에는 팝업			
			theApp.alert(
				[	 
					'부적합 금융투자상품 거래 확인서 ', '<br/>',
					'작성이 실패하였습니다.'					
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

FD3202_V03.prototype.onInvestInfoPopup = function()
{
	var win = AWindow.createWindow('FD/window/FD3202_W02.lay','MS3202W2');		
		
	win.openAsDialog(this);
};


FD3202_V03.prototype.onWindowResult = function(result, windowObj)
{
	//TODO:edit here	
	if(windowObj.containerId == 'MS3202W2'){
	
		if(result == 1){
			var thisObj = this;		
			thisObj.nonReportReg();			
		}
	}
};

FD3202_V03.prototype.confirmNextStep = function()
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	cont.fundNowBuyStep = cont.fundNowBuyStep + 1; // 다음단계 세팅								
	cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V04', false);
}

