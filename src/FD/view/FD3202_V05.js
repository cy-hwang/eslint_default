
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_V05()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD3202_V05, AView);


FD3202_V05.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	this.CheckAll = this.findCompById('CheckAll');
	
	this.cbInvestList1 = this.findCompById('cbInvestList1');
	this.cbInvestList2 = this.findCompById('cbInvestList2');
	this.cbInvestList2_1 = this.findCompById('cbInvestList2_1');
	this.cbInvestList3 = this.findCompById('cbInvestList3');
	this.cbInvestList4 = this.findCompById('cbInvestList4');
	this.cbInvestList5 = this.findCompById('cbInvestList5');
	this.cbInvestList6 = this.findCompById('cbInvestList6');
	this.cbInvestList7 = this.findCompById('cbInvestList7');
	
	this.lblFundName = this.findCompById('lblFundName');
	this.lblFundName2 = this.findCompById('lblFundName2'); // 클래스상세 전체명 추가 2019.09.19
	
	this.btnNext5 = this.findCompById('btnNext5');
	
	this.lblStep = this.findCompById('lblStep');
	
	this.View1 = this.findCompById('View1');
	
	this.View3 = this.findCompById('View3');
	
	this.lblFundName.setShrinkInfo({maxChar:20, fontSize:24}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.lblFundName2.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
};

FD3202_V05.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	
};

FD3202_V05.prototype.onWillDeactive = function(reload)
{	
	AView.prototype.onWillDeactive.call(this, reload);
	
	this.View1.scrollTo(0);
	this.View3.scrollTo(0); // 스크롤 맨 위로 처리변경
};

FD3202_V05.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	
//	thisObj.View1.scrollTo(0);
	
	// 다음버튼 비활성화
	thisObj.btnNext5.enable(false);
	
	// 선택한 펀드 이름 세팅
	thisObj.lblFundName.setText(cont.selectFundInfo["D1한글투신펀드명"]);
	thisObj.lblFundName2.setText(cont.selectFundInfo["D1클래스상세 전체명"]); // 클래스상세 전체명 추가 2019.09.19
	
	// 체크박스 모두 해제
	thisObj.CheckAll.setCheck(false);
	thisObj.cbInvestList1.setCheck(false);
	thisObj.cbInvestList2.setCheck(false);
	thisObj.cbInvestList2_1.setCheck(false);
	thisObj.cbInvestList3.setCheck(false);
	thisObj.cbInvestList4.setCheck(false);
	thisObj.cbInvestList5.setCheck(false);
	thisObj.cbInvestList6.setCheck(false);
	thisObj.cbInvestList7.setCheck(false);
	
	var lblStepText =[];
	
	lblStepText.push("<span class='fc_red3'>" + cont.fundNowBuyStep + "</span><span class='step'>/" + cont.fundAllBuyStep + "단계</span>");
				
	thisObj.lblStep.$ele.children().eq(0).html(lblStepText);
	
	// 2019.03.25. 하단항목 안 그려지는 증상 > 강제 redraw를 통해 대응
	setTimeout(function(){ $("#FD3202_V05--View5").forceRedraw();}, 700);
	
	//thisObj.lblStep.setText( cont.fundNowBuyStep + "/" +cont.fundAllBuyStep + " 단계");	
};

FD3202_V05.prototype.onCheckAllClick = function(comp, info)
{

	//TODO:edit here		
	this.cbInvestList1.setCheck(true);
	this.cbInvestList2.setCheck(true);
	this.cbInvestList2_1.setCheck(true);
	this.cbInvestList3.setCheck(true);
	this.cbInvestList4.setCheck(true);
	this.cbInvestList5.setCheck(true);
	this.cbInvestList6.setCheck(true);
	this.cbInvestList7.setCheck(true);
	
	// 전체 체크 할 경우 다음 버튼 활성/비활성화
	if(this.CheckAll.getCheck()){
		this.btnNext5.enable(true);
	}else{
		this.btnNext5.enable(false);
		
		var chk1, chk2, chk2_1, chk3, chk4, chk5, chk6, chk7
		
		// 상단부터 체크되어 있는 상태 가져옴
		chk1 = this.cbInvestList1.getCheck();
		chk2 = this.cbInvestList2.getCheck();
		chk2_1 = this.cbInvestList2_1.getCheck();
		chk3 = this.cbInvestList3.getCheck();
		chk4 = this.cbInvestList4.getCheck();
		chk5 = this.cbInvestList5.getCheck();
		chk6 = this.cbInvestList6.getCheck();
		chk7 = this.cbInvestList7.getCheck();
		
		
		// 전체 체크 해제할 경우에 아래 항목이 모두 체크되어 있다면 전체 체크 해제
		if(chk1 && chk2 && chk2_1 && chk3 && chk4 && chk5 && chk6 && chk7){
			this.cbInvestList1.setCheck(false);
			this.cbInvestList2.setCheck(false);
			this.cbInvestList2_1.setCheck(false);
			this.cbInvestList3.setCheck(false);
			this.cbInvestList4.setCheck(false);
			this.cbInvestList5.setCheck(false);
			this.cbInvestList6.setCheck(false);
			this.cbInvestList7.setCheck(false);
		}
	}	
};

FD3202_V05.prototype.oncbInvestListClick = function(comp, info)
{

	//TODO:edit here
	
	var chk1, chk2, chk2_1, chk3, chk4, chk5, chk6, chk7
	
	// 상단부터 체크되어 있는 상태 가져옴
	chk1 = this.cbInvestList1.getCheck();
	chk2 = this.cbInvestList2.getCheck();
	chk2_1 = this.cbInvestList2_1.getCheck();
	chk3 = this.cbInvestList3.getCheck();
	chk4 = this.cbInvestList4.getCheck();
	chk5 = this.cbInvestList5.getCheck();
	chk6 = this.cbInvestList6.getCheck();
	chk7 = this.cbInvestList7.getCheck();
	
	// 모든 투자자체크리스트 체크했을 시 전체동의 선택 후 다음 화면
	if(chk1 && chk2 && chk2_1 && chk3 && chk4 && chk5 && chk6 && chk7){
		this.CheckAll.setCheck(true);
		this.onCheckAllClick();
	}else{
		this.CheckAll.setCheck(false);
		this.btnNext5.enable(false);
	}
};

FD3202_V05.prototype.onbtnNext5Click = function(comp, info)
{
	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	//	cont.tbvManager.changeTab('FD3202_V06');
	cont.fundNowBuyStep = cont.fundNowBuyStep + 1; // 다음스텝 넘어가기 전 세팅(5단계)
	cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V06', false);

};
