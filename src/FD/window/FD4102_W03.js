
/**
Constructor
Do not call Function in Constructor.
*/
function FD4102_W03(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD4102_W03.lay';

	//TODO:edit here

}
afc.extendsClass(FD4102_W03, BaseWindow);


FD4102_W03.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here

};


FD4102_W03.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.txtMonthReqYn = this.findCompById('txtMonthReqYn'); // 월지급약정여부 조회 필드
	this.txtMonthPayDay = this.findCompById('txtMonthPayDay'); // 월지급일 필드
	this.txtMonthReqMoney = this.findCompById('txtMonthReqMoney'); // 신청금액 조회 필드
	
	this.monthRequestCheck();
	
};


// 시니어펀드 월지급 약정 조회
FD4102_W03.prototype.monthRequestCheck = function()
{
						
	// 현재 페이지에 대한 데이터	
	var thisObj = this;	
	var cont = thisObj.opener.getContainer();		
		
	// 호출한 데이터
	var	qrName = "SACAT562";	
	
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.subAccNo
	};
						
	theApp.accNetManager.addSkipErrorCode('SACAT562', '3113'); // 약정내역이 존재하지 않습니다.
	thisObj.sendData(qrName, 
		function(queryData, groupName)
		{												
			queryData.setHeaderInfo({
				FUNC_KEY_LST: "C"
			});

			var InBlock1 = queryData.getBlockData('InBlock1')[0];

			InBlock1['D1처리구분'] = '3'; // 1.등록 2.해지 3.정정
			InBlock1['D1서비스종류코드'] = '3084';
			InBlock1['D1계좌번호'] = checkObj.accNo;
			InBlock1['D1비밀번호'] = '1'
			InBlock1['D1투신펀드코드'] = '';
			InBlock1['D1대체계좌번호'] = '';
			InBlock1['D1은행코드'] = '';
			InBlock1['D1은행계좌번호'] = '';
			InBlock1['D1은행계좌명'] = '';
			InBlock1['D1일괄대체코드'] = '02';
			InBlock1['D1자동이체대체금액'] = '';
			InBlock1['D1타사대체구분'] = '1';
			InBlock1['D1약정시작일'] = '';
			InBlock1['D1자동대체일'] = '20';
			InBlock1['D1대출만기일'] = '9999';
			InBlock1['D1월지급펀드여부'] = '1';

			queryData.printQueryData();	

		},
		function(queryData, groupName)
		{				

			var errMsg = this.getLastError('errMsg');
			var errCode = this.getLastError('errCode');
			
			afc.log("yjhan1 4102_W03 SACAT562 errMsg ->[" + errMsg + "]");
			afc.log("yjhan1 4102_W03 SACAT562 errCode ->[" + errCode + "]");
			
			// 에러스킵코드 해제
			theApp.accNetManager.removeSkipErrorCode('SACAT562', '3113'); // 약정내역이 존재하지 않습니다.
									
			// errCode 0217(등록된 내역 있음), errCode(3113)(약정내역이 존재하지 않습니다.)			
			if(errCode == "3113"){
				thisObj.txtMonthReqYn.setText("미약정");				
			}else if(errCode == "0217"){
				if(queryData != null){

					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
					if(!OutBlock1) return;
					
					thisObj.txtMonthReqYn.setText("약정");
					thisObj.txtMonthPayDay.setText("매월 20일");
					thisObj.txtMonthReqMoney.setText(OutBlock1["D1자동이체대체금액"]);

					queryData.printQueryData();									
				}
			}																		
		}
	);
		
};


FD4102_W03.prototype.onbtnCloseClick = function(comp, info)
{

	//TODO:edit here
	// 그냥 닫기
	this.close(0);
};

FD4102_W03.prototype.onbtnCancelClick = function(comp, info)
{
	//TODO:edit here	
	// 그냥 닫기
	this.close(0);

};

FD4102_W03.prototype.onbtnConfirmClick = function(comp, info)
{

	//TODO:edit here
	// 월지급약정 신청 및 변경, 취소 화면 팝업 띄우기
	this.close(1);
};
