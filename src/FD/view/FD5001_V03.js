
/**
Constructor
Do not call Function in Constructor.
*/

//연금펀드 신규 가입 
function FD5001_V03()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5001_V03, AView);


FD5001_V03.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	//TODO:edit here
	
	
	this.btnContent1 = this.findCompById('cbContent1'); 
	this.btnContent2 = this.findCompById('cbContent2'); 
	
	this.btnContent3 = this.findCompById('CheckBox3'); 
	this.btnContent4 = this.findCompById('CheckBox4'); 
	
	this.btnNext4 = this.findCompById('btnNext4'); 
	
	
		
};



FD5001_V03.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	this.btnNext4.enable(false);
	this.term = this.viewData.term; //저축기간
	this.pay =this.viewData.pay; //금액
	this.pw= afc.isSimulator ? '0423' : this.viewData.pw; //비밀번호
	this.date=this.viewData.date;//희망일 
	this.acc=this.viewData.acc;//투신계좌
	this.today=this.viewData.today;//오늘날짜
	this.totalacc = this.viewData.totalacc;//종합계좌
	this.flag = false;	//한번 SendData_SACMT289 타면 두번째는 안 타기 위한 flag
	this.ItemInBlock = ''; //SendData_SACMT289 
	
	
	
};

//초기화 
FD5001_V03.prototype.onArrInit = function()
{		

	this.btnContent1.setCheck(false); 
	this.btnContent2.setCheck(false); 
	
	this.btnContent3.setCheck(false);  
	this.btnContent4.setCheck(false); 
	
	this.btnNext4.enable(false);

};
//화면이 사라지면 초기화 
FD5001_V03.prototype.onWillDeactive = function(reload)
{	
	AView.prototype.onWillDeactive.call(this, reload);
	this.onArrInit();
};

//연금저축계좌 약관
FD5001_V03.prototype.oncbContent1Click = function(comp, info)
{

	//TODO:edit here
	var param = {
		"viewUrl" : "http://www.meritzam.com/marketings/terms15.html",
		"title" : "연금저축계좌 약관",
		"btnType" : "0",
		"checkType" : "1"
	}
	
	PensionCommon.fullSizePopup(this, param);
	
	if(!this.btnContent1.getCheck()) // 체크박스 값이 true 에서 false 로 변경되는 순간 true 로 강제 세팅
	{
		this.btnContent1.setCheck(true);
	}
	
	
};
//연금저축계좌 핵심설명서
FD5001_V03.prototype.oncbContent2Click = function(comp, info)
{

	//TODO:edit here
	
	var param = {
		"viewUrl" : "http://meritzam.com/marketings/terms14.html",
		"title" : "연금저축계좌 핵심설명서",
		"btnType" : "0",
		"checkType" : "2"
	}
	
	PensionCommon.fullSizePopup(this, param);
	if(!this.btnContent2.getCheck()) // 체크박스 값이 true 에서 false 로 변경되는 순간 true 로 강제 세팅
	{
		this.btnContent2.setCheck(true);
	}
	
};

//연금저축계좌 가입시 유의사항
FD5001_V03.prototype.onCheckBox3Click = function(comp, info)
{

	//TODO:edit here
	
	var param = {
		"viewUrl" : "http://www.meritzam.com/marketings/terms19.html",
		"title" : "연금저축계좌 가입시 유의사항",
		"btnType" : "0",
		"checkType" : "3"
	}
	
	PensionCommon.fullSizePopup(this, param);
	if(!this.btnContent3.getCheck()) // 체크박스 값이 true 에서 false 로 변경되는 순간 true 로 강제 세팅
	{
		this.btnContent3.setCheck(true);
	}
	


};

//개인(신용)정보 필수동의서
FD5001_V03.prototype.onCheckBox4Click = function(comp, info)
{

	//TODO:edit here
	
	var param = {
		"viewUrl" : "http://www.meritzam.com/marketings/personal_info2.html",
		"title" : "개인(신용)정보 필수동의서",
		"btnType" : "0",
		"checkType" : "4"
	}
	
	PensionCommon.fullSizePopup(this, param);
	
	

	
};

//팝업 result
FD5001_V03.prototype.onWindowResult = function(data) {
	
	

	if(data == 1 && this.flag == false){ //처음 약관4 클릭 
		this.SendData_SACMT289("select");
		 
	}else if(data ==1 && this.flag == true){ //두번째 약관 4 클릭시 SendData_SACMT289 가지않게.. 
		if(!this.btnContent4.getCheck())
		{
			this.btnContent4.setCheck(true);
		}
		this.oncbContentClick();
	}else{
		this.oncbContentClick(); //약관 4 이외에 클릭
	}
	
	
	
	
}

//GA동의 처리 모든 동의 여부 항목 select 후 GA만 1로 하고 update
FD5001_V03.prototype.SendData_SACMT289 = function(Type)
{
	var thisObj = this
	,cont = thisObj.getContainer() // 연결된 최상위 뷰
	,qrName = "SACMT289";

	cont.sendData(qrName,function(queryData, groupName)
	{		
		
		var InBlock1 = queryData.getBlockData('InBlock1')[0];				

		if (Type == 'select'){

			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});

			InBlock1['D1처리구분'] = '3';
		} else {

			queryData.setHeaderInfo({
				FUNC_KEY_LST: '5'
			});

			InBlock1['D1처리구분'] = '2',	// 정정 
				InBlock1['D1개인정보제공동의여부1'] = thisObj.ItemInBlock.D1개인정보제공동의여부1,					
				InBlock1['D1개인정보제공동의여부2'] = thisObj.ItemInBlock.D1개인정보제공동의여부2,
				InBlock1['D1개인정보제공동의여부3'] = thisObj.ItemInBlock.D1개인정보제공동의여부3,
				InBlock1['D1개인정보제공동의여부4'] = thisObj.ItemInBlock.D1개인정보제공동의여부4,
				InBlock1['D1개인정보제공동의여부5'] = thisObj.ItemInBlock.D1개인정보제공동의여부5,
				InBlock1['D1항목값'] = thisObj.ItemInBlock.D1항목값,
				InBlock1['D1개인정보제공동의여부6'] = thisObj.ItemInBlock.D1개인정보제공동의여부6,
				InBlock1['D2항목값'] = thisObj.ItemInBlock.D2항목값,
				InBlock1['D1개인정보제공동의여부7'] = thisObj.ItemInBlock.D1개인정보제공동의여부7,
				InBlock1['D1개인정보제공동의여부8'] = thisObj.ItemInBlock.D1개인정보제공동의여부8,
				InBlock1['D1개인정보제공동의여부9'] = thisObj.ItemInBlock.D1개인정보제공동의여부9,					
				InBlock1['D1개인정보제공동의여부10'] = thisObj.ItemInBlock.D1개인정보제공동의여부10,
				InBlock1['D3항목값'] = thisObj.ItemInBlock.D3항목값,
				InBlock1['D1개인정보제공동의여부11'] = 1,//G2
				InBlock1['D1개인정보제공동의여부12'] = thisObj.ItemInBlock.D1개인정보제공동의여부12,
				InBlock1['D1개인정보제공동의여부13'] = 1,//G4
				InBlock1['D1개인정보제공동의여부14'] = 1,//G5
				InBlock1['D1개인정보제공동의여부15'] = 1,//G6
				InBlock1['D1개인정보제공동의여부16'] = thisObj.ItemInBlock.D1개인정보제공동의여부16,
				InBlock1['D1개인정보제공동의여부17'] = thisObj.ItemInBlock.D1개인정보제공동의여부17,
				InBlock1['D1개인정보제공동의여부18'] = thisObj.ItemInBlock.D1개인정보제공동의여부18,
				InBlock1['D1개인정보제공동의여부19'] = 1, //GA
				InBlock1['D1개인정보제공동의여부20'] = thisObj.ItemInBlock.D1개인정보제공동의여부20,
				InBlock1['D1개인정보제공동의여부21'] = thisObj.ItemInBlock.D1개인정보제공동의여부21,
				InBlock1['D1개인정보제공동의여부22'] = thisObj.ItemInBlock.D1개인정보제공동의여부22,
				InBlock1['D1개인정보제공동의여부23'] = thisObj.ItemInBlock.D1개인정보제공동의여부23,
				InBlock1['D1개인정보제공동의여부24'] = thisObj.ItemInBlock.D1개인정보제공동의여부24,
				InBlock1['D1개인정보제공동의여부25'] = thisObj.ItemInBlock.D1개인정보제공동의여부25,
				InBlock1['D1개인정보제공동의여부26'] = thisObj.ItemInBlock.D1개인정보제공동의여부26,
				InBlock1['D1개인정보제공동의여부27'] = thisObj.ItemInBlock.D1개인정보제공동의여부27,
				InBlock1['D1개인정보제공동의여부28'] = thisObj.ItemInBlock.D1개인정보제공동의여부28,
				InBlock1['D1개인정보제공동의여부29'] = thisObj.ItemInBlock.D1개인정보제공동의여부29,
				InBlock1['D1개인정보제공동의여부30'] = thisObj.ItemInBlock.D1개인정보제공동의여부30,
				InBlock1['D1개인정보제공동의여부31'] = thisObj.ItemInBlock.D1개인정보제공동의여부31,
				InBlock1['D1개인정보제공동의여부32'] = thisObj.ItemInBlock.D1개인정보제공동의여부32,
				InBlock1['D1개인정보제공동의여부33'] = thisObj.ItemInBlock.D1개인정보제공동의여부33,
				InBlock1['D1개인정보제공동의여부34'] = thisObj.ItemInBlock.D1개인정보제공동의여부34,
				InBlock1['D1개인정보제공동의여부35'] = thisObj.ItemInBlock.D1개인정보제공동의여부35,
				InBlock1['D1개인정보제공동의여부36'] = thisObj.ItemInBlock.D1개인정보제공동의여부36,
				InBlock1['D1개인정보제공동의여부37'] = thisObj.ItemInBlock.D1개인정보제공동의여부37,
				InBlock1['D1개인정보제공동의여부38'] = thisObj.ItemInBlock.D1개인정보제공동의여부38,
				InBlock1['D1개인정보제공동의여부39'] = thisObj.ItemInBlock.D1개인정보제공동의여부39,
				InBlock1['D1개인정보제공동의여부40'] = thisObj.ItemInBlock.D1개인정보제공동의여부40,
				InBlock1['D1개인정보제공동의여부41'] = thisObj.ItemInBlock.D1개인정보제공동의여부41,
				InBlock1['D1개인정보제공동의여부42'] = thisObj.ItemInBlock.D1개인정보제공동의여부42,
				InBlock1['D1개인정보제공동의여부43'] = thisObj.ItemInBlock.D1개인정보제공동의여부43,
				InBlock1['D1개인정보제공동의여부44'] = thisObj.ItemInBlock.D1개인정보제공동의여부44,
				InBlock1['D1개인정보제공동의여부45'] = thisObj.ItemInBlock.D1개인정보제공동의여부45,
				InBlock1['D1개인정보제공동의여부46'] = thisObj.ItemInBlock.D1개인정보제공동의여부46,
				InBlock1['D1개인정보제공동의여부47'] = thisObj.ItemInBlock.D1개인정보제공동의여부47,
				InBlock1['D1개인정보제공동의여부48'] = thisObj.ItemInBlock.D1개인정보제공동의여부48,
				InBlock1['D1개인정보제공동의여부49'] = thisObj.ItemInBlock.D1개인정보제공동의여부49,
				InBlock1['D1개인정보제공동의여부50'] = thisObj.ItemInBlock.D1개인정보제공동의여부50

		}
		InBlock1['D1계좌번호'] = thisObj.totalacc;
		InBlock1['D1비밀번호'] = thisObj.pw;
		queryData.putPwInfo('InBlock1','D1비밀번호');		
		queryData.printQueryData();
	},
	function(queryData, groupName) {

		if(queryData != null){
			
			queryData.printQueryData();

			var inBlock1 = queryData.getBlockData('InBlock1')[0];
			thisObj.ItemInBlock = inBlock1;	

			if(Type=='select'){
				thisObj.updateSACMT289();
			}else{
				// 체크박스 처리... update 후 
				if(!thisObj.btnContent4.getCheck()) 
				{
					thisObj.btnContent4.setCheck(true);
				}
				thisObj.flag = true;
				//화면이 모두 클릭되면 다음 버튼 활성화 
				thisObj.oncbContentClick();
			}	
		}else{
			//error값 받으면 다시 서버로 가야하므로 .. 
			thisObj.btnContent4.setCheck(false);
		}
	});

	
};

FD5001_V03.prototype.updateSACMT289 = function()
{
	this.SendData_SACMT289("update");
}

//화면이 모두 클릭되면 다음 버튼 활성화 
FD5001_V03.prototype.oncbContentClick = function()
{

	//TODO:edit here
	
	if(this.btnContent1.getCheck()
		&& this.btnContent2.getCheck()
		&& this.btnContent3.getCheck()
		&& this.btnContent4.getCheck()) {
		this.btnNext4.enable(true);
		
	}else{
		this.btnNext4.enable(false);
	}
	
	

};


FD5001_V03.prototype.onbtnNext4Click = function(comp, info)
{

	//TODO:edit here
	
	var thisObj = this;
	var callback = function(outBlock){
	
		setTimeout(function()
		{
			thisObj.SendData_SACAT409(outBlock); //펀드 가입 계좌 id와 연결

		},3000);
		
	}
	
	
 	this.SendData_SACMT295(callback); //계좌 만들기
	
	//cont.tvManager.getActiveView().tbvManager.changeTab('FD5001_V04', false);
	//this.SendData_SACAT409();	
};


//펀드 가입 계좌 id와 연결 
FD5001_V03.prototype.SendData_SACAT409 = function(info)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	var svcId = 'SACAT409';
	
	
	
	cont.sendData(svcId,
	function(queryData, groupName)
	{
		
		var inBlock1 = queryData.getBlockData('InBlock1')[0];
		inBlock1['D1처리구분'] = '1';
		inBlock1['D1계좌번호'] =  info['D1계좌번호'];
		inBlock1['D1전자금융사용자ID'] = theApp.accNetManager.getHeaderInfo('USER_ID');

   		queryData.printQueryData();
		
	},
	function(queryData, groupName)
	{
		var errorData = this.getLastError();
		
		afc.log("errorCode : " + errorData.errCode);
		afc.log("errMsg : " + errorData.errMsg);
		
		if(queryData) {
			queryData.printQueryData();
			
			var outBlock = queryData.getBlockData('OutBlock1')[0];
			var param = {
				"name" : info['D1고객명'],
				"barAcc" : info['D1조회계좌번호'],
				"acc" : info['D1계좌번호']
			}
			
	
			cont.tvManager.getActiveView().tbvManager.changeTab('FD5001_V04', param);
			
		}
	});
};

//펀드 가입 계좌 생성 
FD5001_V03.prototype.SendData_SACMT295 = function(callback)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	var svcId = 'SACMT295';
	
	theApp.accNetManager.addSkipErrorCode('SACMT295', '9999'); // 변경이 완료되었습니다. skip
	cont.sendData(svcId,
	function(queryData, groupName)
	{
		
		
		var inBlock1 = queryData.getBlockData('InBlock1')[0];
		var inBlock2 = queryData.getBlockData('InBlock2')[0];
		var inBlock3 = queryData.getBlockData('InBlock3')[0];
		
		
		inBlock1['D1상위계좌번호'] = thisObj.totalacc;
		inBlock1['D1상품유형코드'] = '04';
		inBlock1['D1상품상세코드'] = '77';
		inBlock1['D1계좌비밀번호'] = thisObj.pw;
		inBlock2['D1계약기간월수'] = thisObj.term*12;
		inBlock2['D1납입단위금액'] = thisObj.pay;
		inBlock2['D1연금지급시작일'] = thisObj.date;
		inBlock2['D1최초매수일'] = thisObj.today;
		inBlock2['D1투자신탁투자자분류코드'] = '0000'
		queryData.putPwInfo('InBlock1','D1계좌비밀번호');
		
		inBlock3['D1계정구분'] = '1';
		
		inBlock3['D1출금계좌번호'] = thisObj.acc;
		
		// Function key 세팅.
		queryData.setHeaderInfo(
			{FUNC_KEY_LST: 'C'}	// 조회.
		);
		
		
		
		
	},
	function(queryData, groupName)
	{
		var errorData = this.getLastError();
		
		afc.log("errorCode : " + errorData.errCode);
		afc.log("errMsg : " + errorData.errMsg);
		
		if(queryData) {
		
			queryData.printQueryData();
			
			var outBlock = queryData.getBlockData('OutBlock1')[0];
			if(queryData.getBlockData('OutBlock1')[0]) {
				callback.call(thisObj,outBlock);
			}

		}
	});
	
	
	
};




