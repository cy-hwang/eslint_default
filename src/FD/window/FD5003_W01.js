
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_W01(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5003_W01.lay';

	//TODO:edit here

}
afc.extendsClass(FD5003_W01, BaseWindow);


FD5003_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5003_W01.prototype.onWillActive = function(reload)
{
	BaseWindow.prototype.onWillActive.call(this, reload);
	
	// Object
	this.cont = this.opener.getContainer();
	
	// 계좌
	this.accView = this.findCompById('AccView').loadView;
	this.accView.setDelegator(this);
	this.cont.onAccViewControl(this.accView);
	
	// 컴포넌트
	this.View1 = this.findCompById('View1');
	this.Label = this.findCompById('Label6');
	this.View2 = this.findCompById('View2');
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5003_W01.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	// 계좌 초기화
	this.initAccView();
	
	// doInitAccInfo에서 계좌가 없을 시 아래 이벤트 실행
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		this.fnDoSendDataManage();
	}
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5003_W01.prototype.onWillDeactive = function(reload)
{		
	BaseWindow.prototype.onWillDeactive.call(this, reload);
};


// 계좌 초기화
FD5003_W01.prototype.initAccView = function()
{	
	// 계좌드롭박스
	this.accDbx = this.accView.accDbx;
	
	// 계좌 // doInitAccInfo에서 계좌가 있을 시 fnDoSendDataManage 함수실행
	this.accView.doInitAccInfo(this.cont.accTypeCd);
};


// 컴포넌트 초기화
FD5003_W01.prototype.onInitComponents = function()
{	
	// 컴포넌트 셋팅
	this.onSetComponents('');
	
	// 서비스 조회
	this.sendSDPAQ070();
};


// 계좌번호 변경 시 이벤트
FD5003_W01.prototype.fnDoSendDataManage = function() 
{
	// 계좌번호 저장
	PensionCommon.setFundAcc(this);
	
	// 컴포넌트 초기화
	this.onInitComponents();
};


// 서비스 조회
FD5003_W01.prototype.sendSDPAQ070 = function()
{
	var thisObj = this;
	
	// 계좌번호가 없으면
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	// 조회
	theApp.accNetManager.sendProcessByName('SDPAQ070', null, null,
		function(queryData)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
			InBlock1['D1비밀번호'] = "";
			InBlock1['D1금액'] = "0";
			InBlock1['D1세금징수구분'] = "";
			InBlock1['D1출금유형코드'] = "30"; // 30: 출금
			InBlock1['D1해지구분'] = "0"; // 0: 해당없음
			
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{
			if(!queryData)
			{
				return;
			}
			else if(queryData) // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
				var OutBlock2 = queryData.getBlockData('OutBlock2')[0];
				var OutBlock3 = queryData.getBlockData('OutBlock3')[0];
				var OutBlock4 = queryData.getBlockData('OutBlock4');
				
				if(!OutBlock1) return;
				
				// 18.12.04 매수가능금액에서 납입가능금액으로수정
				// 매수가능금액
				/* var money1 = OutBlock1['D1예수금'] * 1;
				var money2 = OutBlock1['D1증거금현금'] * 1;
				
				// 컴포넌트 셋팅
				var money =  money1 - money2; // 매수가능금액 
				thisObj.onSetComponents(money);	*/
				
				
				// 납입가능금액
				var money1 = OutBlock1['D1납입한도금액'];		// 연간 납입한도
				var money2 = thisObj.getData(OutBlock4);	// 당해년도 기납입액
				
				// 컴포넌트 셋팅
				var money = money1 - money2; // 납입가능금액
				thisObj.onSetComponents( thisObj.chkData(money) );
			}
		}
	);
};


// 당해년도의 납입금액을 구함
FD5003_W01.prototype.getData = function(OutBlock4)
{
	if(OutBlock4 == null || OutBlock4.length < 1) 
	{
		return 0;
	}

	var cYear = MetaInfo.fnGetToday().substring(0, 4);

	for(var i=0; i<OutBlock4.length; i++) 
	{
		var pYear = OutBlock4[i]['D1납입년도'];
		
		if(cYear == pYear) 
		{
			return OutBlock4[i]['D1납입금액'] -  OutBlock4[i]['D1과세제외금액출금'];
		}
	}
	
	return 0;
};


// 납입가능금액이 1이면 계좌이전용 계좌로 만든 상태라서 
// 납입가능금액을 0으로 셋팅
FD5003_W01.prototype.chkData = function(amount)
{
	if(amount == 1) return 0;
	else return amount;
};


// 컴포넌트 셋팅
FD5003_W01.prototype.onSetComponents = function(money)
{
	// 사용자명
	var userNm = theApp.userInfo.userObj['D1사용자명'];  
	
	// 18.12.04 매수가능금액에서 납입가능금액으로수정
	var content1 = userNm 
				// + "님의 매수가능금액은<br>"
				+ "님의 납입가능금액은<br>"
				+ "<b>" + afc.addComma(money) + "</b>" + "원 입니다.";
	
	var content2 = "연금펀드 매수를 위해<br>추가로 입금하시겠습니까?";
	
	this.View1.$ele.html(content1);
	this.View1.$ele.css('text-align', 'center');
	
	this.View2.$ele.html(content2);
	this.View2.$ele.css('text-align', 'center');
};


// X 버튼 클릭
FD5003_W01.prototype.onCloseBtnClick = function(comp, info)
{
	this.close(0);
};


// 입금하기 버튼 클릭
FD5003_W01.prototype.onCancelBtnClick = function(comp, info)
{
	this.close(0);
	
	// 연간 납입 금액 조회
	PensionCommon.sendSDPAQ070(this.cont, null);
};


// 매수하기 버튼 클릭
FD5003_W01.prototype.onConfirmBtnClick = function(comp, info)
{
	this.close(1);
};


