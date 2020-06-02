
/**
Constructor
Do not call Function in Constructor.
** 고객정보 조회**
*/
function FD0100_W01()
{
	BaseWindow.call(this);
}
afc.extendsClass(FD0100_W01, BaseWindow);


FD0100_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	
	this.zipCode = this.findCompById('TextField1');			//우편번호
	
	this.defaultDataGrd = this.findCompById('Grid1');			//기본정보
	this.contactDataGrd = this.findCompById('Grid2');			//연락처
	this.etcDataGrd = this.findCompById('Grid3');			//기타연락처
	
	var accInfo = theApp.accInfo.filterAccList(0);
 	this.selectSACMT901(accInfo);
};

//고객 정보 조회 서비스
FD0100_W01.prototype.selectSACMT901 = function(accInfo)
{
	var thisObj = this;
	var accNo = accInfo[0]['D1계좌번호'];
	
	theApp.accNetManager.sendProcessByName('SACMT901', null, null,
										   function(queryData, groupName){	

		queryData.setHeaderInfo(
			{FUNC_KEY_LST: 'C'}
		);	

		var inBlock1 = queryData.getBlockData('InBlock1');		
		inBlock1[0] =
			{		
			'D1계좌번호' : accNo,
			'D1비밀번호' : '0000' //값 상관 없음
		};
		queryData.printQueryData();
	},
										   function(queryData, groupName)
										   {
		if(!queryData)
		{
			return;
		}
		else
		{
			// 성공
			var outBlock1 = queryData.getBlockData('OutBlock1')[0];
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			queryData.printQueryData();
 			thisObj.setFormData(outBlock1, InBlock1);
		}
	});	
};

//값 세팅
FD0100_W01.prototype.setFormData = function(outBlock1, InBlock1){
	//기본정보
	this.defaultDataGrd.setCellText(0,1,theApp.userInfo.userObj['D1사용자명']);
	if(InBlock1['D1휴대폰지역번호'] && InBlock1['D1휴대폰국번호'] && InBlock1['D1휴대폰일련번호']){
		this.defaultDataGrd.setCellText(1,1,InBlock1['D1휴대폰지역번호']+'-'+InBlock1['D1휴대폰국번호']+'-'+InBlock1['D1휴대폰일련번호']);
	}
	this.defaultDataGrd.setCellText(2,1,this.checkTongboPlace(InBlock1['D1투자신탁잔고통보지']));
	this.defaultDataGrd.setCellText(3,1,this.checkTongboPlace(InBlock1['D1자산운용보고서통보지']));
	//연락처
	this.contactDataGrd.setCellText(0,1,InBlock1['D1자택우편번호']);
	this.contactDataGrd.setCellText(1,1,outBlock1['D1자택동이상주소']+'\n'+InBlock1['D1자택주소']);
	if(InBlock1['D1전화지역번호'] && InBlock1['D1전화국번호'] && InBlock1['D1전화일련번호']){
		this.contactDataGrd.setCellText(2,1,InBlock1['D1전화지역번호']+'-'+InBlock1['D1전화국번호']+'-'+InBlock1['D1전화일련번호']);
	}
	//기타연락처
	if(InBlock1['D1이메일주소']){
		this.etcDataGrd.setCellText(0,1,InBlock1['D1이메일주소']);
	}
	if(InBlock1['D1팩스지역번호'] && InBlock1['D1팩스국번호'] && InBlock1['D1팩스일련번호']){
	   this.etcDataGrd.setCellText(1,1,InBlock1['D1팩스지역번호']+'-'+InBlock1['D1팩스국번호']+'-'+InBlock1['D1팩스일련번호']);
	}
};

//수령지 값 text로 변경
FD0100_W01.prototype.checkTongboPlace = function(place)
{
	var tongbo = null;
	switch(place){
		case '01':
			tongbo = '주소지';
			break;
		case '04':
			tongbo = 'E-MAIL';
			break;
		case '10':
			tongbo = 'SMS';
			break;
		case '06':
			tongbo = '불원';
			break;
	};
	return tongbo;
};

//종료 버튼
FD0100_W01.prototype.onCloseBtnClick = function(comp, info)
{
	this.close();
};

//변경 화면으로 이동
FD0100_W01.prototype.onBtnModifyClick = function(comp, info)
{
	theApp.subNavi.goPage('FD1302');
	this.close();
};
