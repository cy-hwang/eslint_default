
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_T01()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(MS1005_T01, AView);


MS1005_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.termsListView = this.findCompById('TermsListView');
	this.nextBtn = this.findCompById('NextBtn');
	this.allCheckedchk = this.findCompById("AgreeallCbx");
	
	//계좌개설 공통
	this.commondata1 = [{'text':'전자금융거래 이용에 관한 기본약관',"Url":"https://www.meritzam.com/marketings/terms02.pdf"}	//전자금융거래 이용에 관한 기본 약관
						//개인(신용)정보 동의서(필수) > 불필요
						,{'text':'개인정보 처리방침',"Url":"https://www.meritzam.com/marketings/terms10.pdf"}				//개인(신용)정보 처리방침
						,{'text':'고객정보 취급방침',"Url":"https://www.meritzam.com/marketings/personal_info5.pdf"}				//고객정보 취급방침
						//종합계좌 설정약관 > 수익증권계좌설정약관 으로 대체
						//매매거래 계좌설정 약관 > 수익증권계좌설정약관 으로 대체
						,{'text':'입출금 이체서비스 약관',"Url":"https://www.meritzam.com/marketings/terms05.pdf"}				//입출금 이체서비스 약관
						//일중매매거래 위험고지 > 불필요 약관(주식거래 x)
						//매매 주문접수/처리방침 > 불필요 약관(주식거래 x)
						];
						
	//개인신용정보동의서			
	this.commondata2 = [{'text':'개인(신용)정보 필수동의서(공통)',"Url":"https://www.meritzam.com/marketings/personal_info2.pdf"}
						,{'text':'개인(신용)정보 선택동의서(공통)',"Url":"https://www.meritzam.com/marketings/personal_info1.pdf"}
						,{'text':'개인(신용)정보 필수동의서(상품별)',"Url":"https://www.meritzam.com/marketings/personal_info3.pdf"}
						];	
						
	//수익증권 약관				
	this.suickdata = [{'text':'수익증권저축약관',"Url":"https://www.meritzam.com/marketings/terms01.pdf"}
					  ,{'text':'수익증권계좌설정약관',"Url":"https://www.meritzam.com/marketings/terms03.pdf"}
					  ];	
	
	//ID 등록 약관
	this.iddata = [{'text':'개인정보 수집을 위한 이용자 동의사항',"Url":"https://www.meritzam.com/marketings/terms18.pdf"}	//개인정보 수집을 위한 이용자 동의사항
					,{'text':'온라인서비스이용약관',"Url":"https://www.meritzam.com/marketings/terms04.pdf"}				//홈트레이딩서비스 이용약관
					//전자금융거래 이용에 관한 기본 약관 - 계좌개설 공통에 포함
					//{'text':'개인(신용)정보 동의서',"Url":"https://www.meritzam.com/marketings/terms19.pdf"}				//개인정보 처리/취급방침
					//연계금융기관을 통한 계좌 설정약관 - 당사는 연계기관과 제휴를 맺고 있지 않아 필요 약관이 아님
					//매매거래 계좌설정 약관 - 수익증권계좌설정약관: 수익증권약관 포함
					//매매거래 계좌설정 약관 - 입출금및이체서비스약관: 계좌개설 공통에 포함
					//매매주문 접수·처리 방법 안내 - 주식의 매매 접수 관련 내용, 당사는 주식 매매를 하지 않음 수익증권의 WTS /MTS 매매주문 관련 사항은 당사 온라인서비스이용약관에 내용 삽입	
					//그룹사간 고객정보 확인 동의사항 - 불필요
					];
};

MS1005_T01.prototype.onActive = function(reload)
{
	AView.prototype.onActive.call(this, reload);
	
	this.allCheckedchk.setCheck(false);
	this.nextBtn.setText('약관/공지 동의');
	this.initRow();
};


MS1005_T01.prototype.bindData = function(item, data, listview){
	if(item.view.setData){
		item.view.setData(data, this);
	}
};

MS1005_T01.prototype.initRow = function()
{

	this.termsListView.removeAllItems();
	this.termsListView.setDelegator(this);
	var accType = theApp.getProductId();
	
	this.termsListView.addItem('FD/view/MS1005_L02.lay',this.commondata1);
	
	if(accType['수익증권'] == true){
		this.termsListView.addItem('FD/view/MS1005_L02.lay',this.suickdata);	
	}
	
	this.termsListView.addItem('FD/view/MS1005_L02.lay',this.commondata2);
	
	this.termsListView.addItem('FD/view/MS1005_L02.lay',this.iddata);
};

MS1005_T01.prototype.onTermsListViewSelect = function(comp, info)
{
	var bChecked = info.view.cbx1.getCheck();
	info.view.setCheck(!bChecked);
	this.isAllChecked();
};

// 다음으로
MS1005_T01.prototype.onNextBtnClick = function(comp, info)
{
	if(this.nextBtn.getText() == '약관/공지 동의') {
		this.checkAllItem(true);
		this.allCheckedchk.setCheck(true);
		this.nextBtn.setText('다음');
		return;
	} else if(this.nextBtn.getText() == '다음') {
		this.getContainer().nextView();
		return;
	}
	
	this.nextBtn.setText('약관/공지 동의');
};


// 이전으로
MS1005_T01.prototype.onBeforeBtnClick = function(comp, info)
{
	this.getContainer().beforeView();
};

//아이템 전부 체크
MS1005_T01.prototype.checkAllItem = function(value)
{
	var items = this.termsListView.getItems();
	var itemsLen = items.length;
	
	for(var item=0; item < itemsLen; item++) {
	
		items[item].view.cbx1.setCheck(value);
	}
};


//아이템 체크 여부 확인
MS1005_T01.prototype.isAllChecked = function()
{
	var items = this.termsListView.getItems();
	var itemsLen = items.length;
	var allItems = true;
	
	for(var item=0; item < itemsLen; item++) {
	
		if(items[item].view.cbx1.getCheck() == false) {
			allItems = false;
			break;
		}
	}
	
	if(allItems) {
		this.nextBtn.setText('다음');
		this.allCheckedchk.setCheck(true);
	} else {
		this.nextBtn.setText('약관/공지 동의');
		this.allCheckedchk.setCheck(false);
	}
};

MS1005_T01.prototype.onAgreeallCbxClick = function(comp, info)
{
	if(this.nextBtn.getText() == '약관/공지 동의') {
	
		this.checkAllItem(true);
		this.nextBtn.setText('다음');
	} else if(this.nextBtn.getText() == '다음') {
		this.checkAllItem(false);
		this.nextBtn.setText('약관/공지 동의');
	}
};
