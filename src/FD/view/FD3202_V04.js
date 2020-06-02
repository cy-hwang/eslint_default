
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_V04()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD3202_V04, AView);


FD3202_V04.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	//TODO:edit here
	this.btnContent1 = this.findCompById('btnContent1'); // 집합투자규약
	this.btnContent2 = this.findCompById('btnContent2'); // 간이투자설명서
	
	this.cbContent1 = this.findCompById('cbContent1'); // 집합투자규약
	this.cbContent2 = this.findCompById('cbContent2'); // 간이투자설명서
	
	this.btnNext4 = this.findCompById('btnNext4'); // 다음 버튼
	
	this.lblStep = this.findCompById('lblStep');
	this.lblReg = this.findCompById('Label6');
		
};

FD3202_V04.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);

};

FD3202_V04.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	thisObj.scrollTo(0);
	
	// 페이지 중간에 들어올 가능성이 있으므로 페이지 진입했을 경우에는 상단 Simple Choice, 펀드 더보기 숨김처리
	cont.scrToolView.show(AComponent.GONE); // 상단 Simple Choice, 펀드 더보기 숨김처리
	
	cont.titleLbl.setText('펀드매수');
	
	// 초기 다음 버튼 비활성화
	thisObj.btnNext4.enable(false);
	
	// 화면 진입시 모두 체크 해제
	thisObj.cbContent1.setCheck(false);
	thisObj.cbContent2.setCheck(false);
	
	//현재단계 세팅
	var lblStepText =[];
	
	lblStepText.push("<span class='fc_red3'>" + cont.fundNowBuyStep + "</span><span class='step'>/" + cont.fundAllBuyStep + "단계</span>");
				
	thisObj.lblStep.$ele.children().eq(0).html(lblStepText);
	
	//thisObj.lblStep.setText( cont.fundNowBuyStep + "/" +cont.fundAllBuyStep + " 단계");
	
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
		}
	});
	
	// 2018/05/31 스크롤 관련하여 높이 조절하는 부분 추가
	thisObj.fundActiveH = theApp.prefInfo.get('fundScroll2');
	
	if(!thisObj.fundActiveH){		
		
	}else{
		thisObj.fundActiveH = theApp.prefInfo.get('fundScroll2');
		
		cont.view5.setHeight(thisObj.fundActiveH + cont.scrToolView.getHeight());
	}
	var fundCode = cont.selectFundInfo["D1투신펀드코드"];
	if(fundCode == '2000')
		thisObj.lblReg.setText('정관');
	else
		thisObj.lblReg.setText('집합투자규약');

};

FD3202_V04.prototype.fundTradePopoup = function()
{
	theApp.goPrevPageCheck(false);
};


FD3202_V04.prototype.onbtnNext4Click = function(comp, info)
{

	//TODO:edit here
	
	var thisObj = this;
	var cont = thisObj.getContainer();

	cont.fundNowBuyStep = cont.fundNowBuyStep + 1; // 다음스텝 넘어가기 전 세팅(4단계)
	cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V05', false);

};

FD3202_V04.prototype.oncbContent1Click = function(comp, info)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	var fundCode = cont.selectFundInfo["D1투신펀드코드"];
	var title = "집합투자규약";
	
	if(fundCode == '2000')
	{
		fundCode = '7003';
		title = "정관";
	}

	if(afc.isIos)
	{
		var win = AWindow.createWindow('FD/window/FD3202_W06.lay', 'FD3202W9');

		win.loadTitle = title;
	
		if(fundCode == '4500') {
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/stipul_1146.pdf';
		} else if(fundCode == '1500') { // 2020.01.31. 메리츠글로벌리츠부동산투자신탁[리츠-재간접형]Ae 추가
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/stipul_7052.pdf';
		} else {
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/stipul_' + fundCode + ".pdf";
		}
		
		win.openAsDialog(this, '100%', '100%');
	}
	else		// Android
	{
		if(fundCode == '4500') {
			AppManager.openPdfModule("https://www.meritzam.com/marketings/stipul_1146.pdf", title);
		} else if(fundCode == '1500') { // 2020.01.31. 메리츠글로벌리츠부동산투자신탁[리츠-재간접형]Ae 추가
			AppManager.openPdfModule("https://www.meritzam.com/marketings/stipul_7052.pdf", title);
		} else {
			AppManager.openPdfModule("https://www.meritzam.com/marketings/stipul_" + fundCode + ".pdf", title);
		}
	}
	
	// 한번이라도 클릭하면 체크가 해제되지 않도록 변경(집합투자규약)
	if(!thisObj.cbContent1.getCheck()) // 체크박스 값이 true 에서 false 로 변경되는 순간 true 로 강제 세팅
	{
		thisObj.cbContent1.setCheck(true);
	}
	
	thisObj.oncbContentClick();

};

FD3202_V04.prototype.oncbContent2Click = function(comp, info)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	var fundCode = cont.selectFundInfo["D1투신펀드코드"];
	var title = "간이투자설명서";

	if(fundCode == '2000')
		fundCode = '7003';
	
	if(afc.isIos)
	{
		var win = AWindow.createWindow('FD/window/FD3202_W06.lay', 'FD3202W9');

		if(fundCode == '4500') {
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/prospectus_1146.pdf';
		} else if(fundCode == '1500') { // 2020.01.31. 메리츠글로벌리츠부동산투자신탁[리츠-재간접형]Ae 추가
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/prospectus_7052.pdf';
		} else {
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/prospectus_' + fundCode + ".pdf";
		}
		win.loadTitle = title;
		win.openAsDialog(this, '100%', '100%');
	}
	else		// Android
	{
		if(fundCode == '4500') {
			AppManager.openPdfModule("https://www.meritzam.com/marketings/prospectus_1146.pdf", title);
		} else if(fundCode == '1500') { // 2020.01.31. 메리츠글로벌리츠부동산투자신탁[리츠-재간접형]Ae 추가
			AppManager.openPdfModule("https://www.meritzam.com/marketings/prospectus_7052.pdf", title);
		} else {
			AppManager.openPdfModule("https://www.meritzam.com/marketings/prospectus_" + fundCode + ".pdf", title);
		}
	}
	
	//간이투자설명서 클릭하면 체크가 해제되지 않도록 변경
	if(!this.cbContent2.getCheck()){
		this.cbContent2.setCheck(true);
	}
	
	this.oncbContentClick();
};

FD3202_V04.prototype.oncbContentClick = function(comp, info)
{	
	//TODO:edit here
	if(this.cbContent1.getCheck() && this.cbContent2.getCheck()){
		this.btnNext4.enable(true);
	}else{
		this.btnNext4.enable(false);
	}
};
