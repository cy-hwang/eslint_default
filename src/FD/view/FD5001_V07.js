
/**
Constructor
Do not call Function in Constructor.
*/
function FD5001_V07()
{
	AView.call(this);

	this.accDbx = null;
	this.secureTxf = null;
	this.delegator = null;
	this.accType = null;
}
afc.extendsClass(FD5001_V07, AView);


FD5001_V07.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.accDbx = this.findCompByGroup('AccGrp')[0];
	this.secureTxf = this.findCompByGroup('AccGrp')[1];
	this.delegator = this.getContainer();
};

FD5001_V07.prototype.setDelegator = function(delegator)
{
	this.delegator = delegator;
};

//계좌번호 설정
FD5001_V07.prototype.doInitAccInfo = function(gejoaInfo, isNoTrigger)
{

	var  accInfo = [] // 전체계좌
		,accDbx = this.accDbx
		,text
		,acc
		,prevSelectedIdx = 0
		,selectedText = theApp.accInfo.getLastAcc(gejoaInfo)
		,accList = theApp.accInfo.filterAccList(4)
		,fundList = theApp.accInfo.filterAccList(5)
		,flag = false;
	
	
	
	for(var i=0; i<accList.length; i++){
		flag = false;
		for(var j=0;j<fundList.length;j++){
			if(accList[i]['D1계좌번호'].substr(5,6) == fundList[j]['D1계좌번호'].substr(5,6)){
				flag = true;
				break;
			}
		}
		if(flag == false){
			accInfo.push(accList[i]);
		}
	}
	
	
	this.accType = gejoaInfo; //현재 선택 계좌 타입 저장
	
	accDbx.removeAll();
	
	//계좌가 없을 경우
	if(accInfo.length < 1)
	{
		this.secureTxf.enable(false);
		this.secureTxf.clear();
	}
	else
	{
	
		this.secureTxf.enable(true);
		
		//계좌등록
		for(var i=0; i<accInfo.length; i++)
		{
			acc = afc.makeAccText(accInfo[i]);
			text = [accInfo[i]['D1상품유형명'], ' ', acc, ' ', accInfo[i]['D1계좌명']].join('');
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


FD5001_V07.prototype.onAccDbxSelect = function(comp, info)
{	
	var  accSelectText = this.accDbx.getSelectedItemText()
		,accSelectItem = this.accDbx.getSelectedItemData()
		,accNo = accSelectItem['D1계좌번호'] //계좌번호
		,secTxf = this.secureTxf	
		,appAccInfo = theApp.accInfo;
		
	
	//마지막 선택 계좌 저장
	appAccInfo.setLastAcc(this.accType, accSelectText);
	
	//비번삭제
	secTxf.clear();
	if(appAccInfo.getAccPw(accNo))
	{
		secTxf.setText(afc.makeDummyString(appAccInfo.getAccPwLength(accNo)));	//더미 텍스트 표시
		secTxf.setCipherData(appAccInfo.getAccPw(accNo));						//비번저장	
		secTxf.setPwLength(appAccInfo.getAccPwLength(accNo)); 					//비번길이 저장
		
	}
	
	//데이터 호출 sendDataManage
	if(!this.isNoTrigger && this.delegator.fnDoSendDataManage) this.delegator.fnDoSendDataManage();
	else this.isNoTrigger = false;
};

FD5001_V07.prototype.onSecureTxfChange = function(comp, info)
{
	var  thisObj = this		
		,accData = thisObj.accDbx.getSelectedItemData()	//계좌드롭
		,cipherData = thisObj.secureTxf.getCipherData()	//비번
		,pwLength = thisObj.secureTxf.getPwLength();	//비번길이

	var checkObj = 
	{
		svcId: 'SACMQ226',
		accNo: accData['D1계좌번호']
	};
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result)
	{
		thisObj.getContainer().sendData('SACMQ226',
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];

			InBlock1['D1계좌번호'] = checkObj.accNo;
			InBlock1['D1계좌계층구분'] = accData['D1계좌계층구분'];
			InBlock1['D1입력비밀번호'] = afc.isSimulator ? '0423' : result;
			queryData.putPwInfo('InBlock1', 'D1입력비밀번호');
			
			queryData.printQueryData();
		},
		function(queryData, groupName)
		{
			if(!queryData)
			{
				AToast.show(this.getLastError('errMsg'));
				return;
			}
			
			queryData.printQueryData();
			
			var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
			if(OutBlock1['D1유효여부'] == 'N')
			{
				thisObj.secureTxf.clear();
				var ableCount =  OutBlock1['D1적용횟수'] - OutBlock1['D1비밀번호연속오류횟수'];
				AToast.show(['비밀번호 오류입니다. (', OutBlock1['D1적용횟수'], '회중 ', ableCount, '회 남았습니다.'].join(''));
				return;
			}
			
			//액티브뷰에 데이터 호출
			if(thisObj.delegator.fnDoSendDataManage) thisObj.delegator.fnDoSendDataManage();
			
		});
	
	});

};

