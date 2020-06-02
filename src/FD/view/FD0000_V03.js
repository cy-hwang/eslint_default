
/**
Constructor
Do not call Function in Constructor.
*/
function FD0000_V03()
{
	AView.call(this);

	this.accDbx = null;
	this.delegator = null;
	this.accType = null;
	this.title1 = null;
}
afc.extendsClass(FD0000_V03, AView);


FD0000_V03.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.accDbx = this.findCompByGroup('AccGrp')[0];
	this.title1 = this.findCompByGroup('LabelGrp')[0];
	this.delegator = this.getContainer();
};

FD0000_V03.prototype.setDelegator = function(delegator)
{
	this.delegator = delegator;
};

//계좌번호 설정
FD0000_V03.prototype.doInitAccInfo = function(gejoaInfo, isNoTrigger)
{

	var  accInfo = theApp.accInfo.filterAccList(gejoaInfo) // 전체계좌
		,accDbx = this.accDbx
		,text
		,acc
		,prevSelectedIdx = 0
		,selectedText = theApp.accInfo.getLastAcc(gejoaInfo);
	
	this.accType = gejoaInfo; //현재 선택 계좌 타입 저장
	
	accDbx.removeAll();
	
	//계좌가 없을 경우
	if(accInfo.length < 1)
	{
	}
	else
	{
		//계좌등록
		for(var i=0; i<accInfo.length; i++)
		{
			acc = afc.makeAccText(accInfo[i]);
			text = [accInfo[i]['D1상품유형명'], ' ', accInfo[i]['D1계좌명']].join('');
			accDbx.addItem(text, accInfo[i]);
		}
		
		if(selectedText)
		{
			var selectedIdx = accDbx.indexOfText(selectedText);
			if(selectedIdx > -1) prevSelectedIdx = selectedIdx;
		}
		
		//계좌선택
		accDbx.selectItem(prevSelectedIdx);
		
		//현재 계좌번호 선택 이벤트 발생
		this.isNoTrigger = isNoTrigger;
		this.onAccDbxSelect();
	}
	
};


FD0000_V03.prototype.onAccDbxSelect = function(comp, info)
{	
	var  accSelectText = this.accDbx.getSelectedItemText()
		,accSelectItem = this.accDbx.getSelectedItemData()
		,accNo = accSelectItem['D1계좌번호'] //계좌번호
		,appAccInfo = theApp.accInfo;
		
	
	//마지막 선택 계좌 저장
	appAccInfo.setLastAcc(this.accType, accSelectText);
	
	//데이터 호출 sendDataManage
	if(!this.isNoTrigger && this.delegator.fnDoSendDataManage) this.delegator.fnDoSendDataManage();
	else this.isNoTrigger = false;
};

FD0000_V03.prototype.doHideTitle = function()
{
	this.title1.show(AComponent.INVISIBLE);
	this.accDbx.setStyle('left', 0);
};
