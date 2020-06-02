
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_V02()
{
	AView.call(this);
	//TODO:edit here

}
afc.extendsClass(FD3202_V02, AView);

FD3202_V02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	//TODO:edit here
	this.lblContent = this.findCompById("lblContent");	
	this.lblStep = this.findCompById('lblStep');
	
};

FD3202_V02.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
			
};

FD3202_V02.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	// 페이지 중간에 들어올 가능성이 있으므로 페이지 진입했을 경우에는 상단 Simple Choice, 펀드 더보기 숨김처리
	cont.scrToolView.show(AComponent.GONE); // 상단 Simple Choice, 펀드 더보기 숨김처리
	
	cont.titleLbl.setText('펀드매수');
	
	cont.nowTradeStateCheck(thisObj, function(){		
		// 일반펀드매수, 예약펀드매수 모두 불가상태
		if(cont.g_tradeState == 3){
			theApp.alert(
				[	 
					//'펀드매매가능시간이 아닙니다.'
					'펀드매매 이용시간은 ', '<br/>',
					'오전 7시~오후23시까지', '<br/>',
					'(한국시간 기준)입니다.', '<br/>',
					,' '
				].join('')
				,
				function()
				{			
					cont.fundTradePopoup();
				}
				,''
			);
		}else if(cont.g_tradeState == 1 || cont.g_tradeState == 2 || cont.g_tradeState == 4){ // 일반펀드매수 또는 예약펀드매수 가능
	
			// 현재 단계 세팅
			var lblStepText =[];
	
			lblStepText.push("<span class='fc_red3'>" + cont.fundNowBuyStep + "</span><span class='step'>/" + cont.fundAllBuyStep + "단계</span>");
				
			thisObj.lblStep.$ele.children().eq(0).html(lblStepText);
									
			
//			thisObj.lblStep.setText( cont.fundNowBuyStep + "/" + cont.fundAllBuyStep + " 단계");

			// 고객성향 출력
			thisObj.printUserInfoContent();
		}
	});
	
	// 2018/05/31 스크롤 관련하여 높이 조절하는 부분 추가
	thisObj.fundActiveH = theApp.prefInfo.get('fundScroll2');
	
	if(!thisObj.fundActiveH){		
	
	}else{
		thisObj.fundActiveH = theApp.prefInfo.get('fundScroll2');
		
		cont.view5.setHeight(thisObj.fundActiveH + cont.scrToolView.getHeight());
	}
};

FD3202_V02.prototype.fundTradePopoup = function()
{
	theApp.goPrevPageCheck(false);
};

// 고객성향 출력
FD3202_V02.prototype.printUserInfoContent = function()
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	var lblText =[];
	
	lblText.push("<span class='font30'>고객님의 투자성향은</span><br/><span class='font30_3'>'" + cont.g_UserGradeName + "'</span> <span class='font30'>입니다.</span>");
				
	thisObj.lblContent.$ele.children().eq(0).html(lblText);
	
	// this.lblContent.setText("고객님의 투자성향은 " + cont.g_UserGradeName + " 입니다.");	
};

FD3202_V02.prototype.onbtnNext2Click = function(comp, info)
{
	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();

	cont.fundNowBuyStep = cont.fundNowBuyStep + 1; // 다음스텝 넘어가기 전 세팅(2단계)
	cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V03', false);
	
	// 하단의 내용은 다른페이지로 넘겨서 테스트하기 위함
//	cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V08', false); //자동이체약정신청 화면이동
//	cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V09', false); //완료화면으로 이동
//	cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V09', {finishGubun:'1'});
};


