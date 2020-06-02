
/**
Constructor
Do not call Function in Constructor.
*/
function FD1204_T01()
{
	AView.call(this);	
}
afc.extendsClass(FD1204_T01, AView);


//초기화
FD1204_T01.prototype.onArrInit = function()
{		
};


FD1204_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);	
			
	this.accView = this.getContainer().findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx;
	this.secureTxf = this.accView.secureTxf;
};


//화면이 활성화된 후 이벤트
FD1204_T01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};

FD1204_T01.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);	
	this.secureTxf.addClass('active');
};

//화면이 소멸되기 전 이벤트
FD1204_T01.prototype.onWillDeactive = function(reload)
{		
	this.onArrInit();
};

FD1204_T01.prototype.sendSACMT602 = function()
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator)
	{
		if(!this.secureTxf.getCipherData())
		{
			AToast.show('계좌 비밀번호를 입력하세요.');
			this.secureTxf.addClass('active');
			return;
		}
	}	
	
// 	theApp.accNetManager.addSkipErrorCode('SDPKT360', '3130');
	cont.sendData('SACMT602', function(queryData, groupName){

		queryData.setHeaderInfo({
			FUNC_KEY_LST: '5'
		});

		var InBlock1 = queryData.getBlockData('InBlock1')[0];
		InBlock1['D1처리구분'] = '1';
		InBlock1['D1계좌계층구분'] = '1';
		InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
		InBlock1['D1입력비밀번호'] = thisObj.secureTxf.getCipherData();
// 		InBlock1['D1계좌번호'] = '00191000054'; //종합
// 		InBlock1['D1입력비밀번호'] = '0423'
		InBlock1['D1사고유형코드'] = '15';
		InBlock1['D1사고신청경로코드'] = '03';
		InBlock1['D1기타사고등록사유'] = '';
		InBlock1['D1사고해지사유코드'] = '';
		InBlock1['D1기타사고해지사유'] = ''; 
		InBlock1['D1사고등록일'] = ''; 
		InBlock1['D1사고해지일'] = ''; 
		InBlock1['D1승인요청일'] = ''; 
		InBlock1['D1승인자추가메시지'] = ''; 
		InBlock1['D1승인사용자명'] = ''; 
		InBlock1['D1승인처리ID'] = ''; 
		InBlock1['D1최종승인자ID'] = ''; 

		if(!afc.isSimulator)
		{
			queryData.putPwInfo('InBlock1', 'D1입력비밀번호');
		} else {
			queryData.printQueryData();
		}
	},
				  function(queryData, groupName) {
		var errorData = this.getLastError();	

		if(!queryData) return;
		var OutBlock1 = queryData.getBlockData('OutBlock2');
		
		if(afc.isSimulator)
		{
			queryData.printQueryData();
		}
		
		if(errorData.errCode == '1') {
			AToast.show('처리가 완료되었습니다.');
		}
	}, thisObj.accDbx.getSelectedItemData()['D1계좌번호']);	
};
	/*"처리구분,D1처리구분,0,TrxTp,STRING,1,0",
				"계좌계층구분,D1계좌계층구분,0,AcntClssTp,STRING,1,0",
				"계좌번호,D1계좌번호,0,AcntNo,STRING,20,0",
				"입력비밀번호,D1입력비밀번호,0,InptPwd,STRING,8,0",
				"사고유형코드,D1사고유형코드,0,AcdPtnCode,STRING,2,0",
				"사고신청경로코드,D1사고신청경로코드,0,AcdPrslPathCode,STRING,2,0",
				"기타사고등록사유,D1기타사고등록사유,0,EtcAcdRegRsn,STRING,100,0",
				"사고해지사유코드,D1사고해지사유코드,0,AcdAbndRsnCode,STRING,2,0",
				"기타사고해지사유,D1기타사고해지사유,0,EtcAcdAbndRsn,STRING,100,0",
				"사고등록일,D1사고등록일,0,AcdRegDt,STRING,8,0",
				"사고해지일,D1사고해지일,0,AcdAbndDt,STRING,8,0",
				"승인요청일,D1승인요청일,0,AgrmReqstDt,STRING,8,0",
				"승인자추가메시지,D1승인자추가메시지,0,AgrmAddMsg,STRING,100,0",
				"승인사용자명,D1승인사용자명,0,AgrmUserNm,STRING,40,0",
				"승인처리ID,D1승인처리ID,0,AgrmTrxId,STRING,8,0",
				"최종승인자ID,D1최종승인자ID,0,LastAgrmUserId,STRING,16,0"*/
FD1204_T01.prototype.onButton3Click = function(comp, info)
{
	this.secureTxf.removeClass('active');
	this.sendSACMT602();
};

FD1204_T01.prototype.fnDoSendDataManage = function() {
	this.secureTxf.removeClass('active');
};