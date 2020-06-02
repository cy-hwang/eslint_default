
/**
Constructor
Do not call Function in Constructor.
*/
function FD5006_W01(containerId)
{
	AWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5006_W01.lay';

	//TODO:edit here

}
afc.extendsClass(FD5006_W01, AWindow);


FD5006_W01.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);
	
	// Object
	this.cont = this.opener.getContainer();
	
	// 컴포넌트
	this.View1 = this.findCompById('View1');
	this.Label = this.findCompById('Label6');
	this.View2 = this.findCompById('View2');
	
	// 컴포넌트 셋팅
	this.onSetComponents();
};


// 컴포넌트 셋팅
FD5006_W01.prototype.onSetComponents = function()
{
	this.View1.$ele.html(this.w_userNm + "님의 연금펀드");
	this.View1.$ele.css('text-align', 'center');
	
	this.Label.setText("매수가능금액은");
	
	this.View2.$ele.html("<b>" + afc.addComma(this.w_money) + "</b>" + "원 입니다.");
	this.View2.$ele.css('text-align', 'center');
};


// 입금하기 버튼 클릭
FD5006_W01.prototype.onCancelBtnClick = function(comp, info)
{
	this.close(0);
	
	// 연간 납입 금액 조회
	PensionCommon.sendSDPAQ070(this.cont, null);
};


// 매수하기 버튼 클릭
FD5006_W01.prototype.onConfirmBtnClick = function(comp, info)
{
	this.close(0);
	
	// 매수하기(5단계)로 이동 
	theApp.goPageCheck('FD5003', false, { tabId:'FD5003_T03', 
		fundSubSeq: this.w_subAccSeqNo, fundCd: this.w_fundCd, fundJoinYN: 'Y'});
};


// X 버튼 클릭
FD5006_W01.prototype.onCloseBtnClick = function(comp, info)
{
	this.close(0);
};


