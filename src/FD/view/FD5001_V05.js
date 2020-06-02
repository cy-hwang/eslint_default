
/**
Constructor
Do not call Function in Constructor.
*/
//연금펀드 계좌 이전(계좌 이체)
function FD5001_V05()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5001_V05, AView);


FD5001_V05.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	//TODO:edit here
	
	
	this.cbContent1 = this.findCompById('cbContent1'); // 연금저축계좌 약관
	this.cbContent2 = this.findCompById('cbContent2'); // 연금저축계좌 핵심설명서
	this.cbContent3 = this.findCompById('cbContent3'); // 연금저축계좌 가입시 유의사항
	this.cbContent4 = this.findCompById('cbContent4'); // 개인(신용)정보 필수동의서
	
	this.btnNext4 = this.findCompById('btnNext4'); // 다음 버튼
	
	this.lblStep = this.findCompById('lblStep');
	
	this.accView = this.findCompById('accView').viewLoad('FD/view/FD5001_V07.lay');
	this.accView = this.findCompById('accView').loadView;
	this.accDbx = this.accView.accDbx;
	this.secureTxf = this.accView.secureTxf;
	this.accView.setDelegator(this);
	
	//this.accView.doInitAccInfo(4);
	
	this.view1 = this.findCompById('View1'); 
	
};

//값 초기화 
FD5001_V05.prototype.onArrInit = function()
{	
	this.cbContent1.setCheck(false); 
	this.cbContent2.setCheck(false); 
	
	this.cbContent3.setCheck(false);  
	this.cbContent4.setCheck(false); 
	
	this.btnNext4.enable(false);

};

//화면이 사라지면 값 초기화 
FD5001_V05.prototype.onWillDeactive = function(reload)
{
	AView.prototype.onWillDeactive.call(this, reload);
	
	this.view1.scrollTo(0);
	this.onArrInit();
};


//계좌 드랍박스 , 비밀번호 
FD5001_V05.prototype.fnDoSendDataManage = function()
{
	
	if(afc.isSimulator){
	   this.accList =  theApp.accInfo.filterAccList(0)//종합계좌번호
		for(var i=0;i<this.accList.length;i++){
			if(this.accList[i]["D1계좌번호"].substr(5,6) == this.accDbx.getSelectedItemData()['D1계좌번호'].substr(5,6)){
				this.totalAcc = this.accList[i]["D1계좌번호"]; //종합계좌 
			}	
		}
	}
	
	if(this.secureTxf.getPwLength() == 0)
	{	
		AToast.show("계좌비밀번호를 입력해주세요.");
		this.secureTxf.addClass('active');
		
		this.flag = false;
		this.btnNext4.enable(false);
		this.cbContent1.setCheck(false);
		this.cbContent2.setCheck(false);
		this.cbContent3.setCheck(false);
		this.cbContent4.setCheck(false);
		return;
	}
	this.secureTxf.removeClass('active');
	
	this.accList =  theApp.accInfo.filterAccList(0)//종합계좌번호
	for(var i=0;i<this.accList.length;i++){
		if(this.accList[i]["D1계좌번호"].substr(5,6) == this.accDbx.getSelectedItemData()['D1계좌번호'].substr(5,6)){
			this.totalAcc = this.accList[i]["D1계좌번호"]; //종합계좌 
		}	
	}
	
}

FD5001_V05.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	
	
	
	// 초기 다음 버튼 비활성화
	thisObj.btnNext4.enable(false);
	
	// 화면 진입시 모두 체크 해제
	thisObj.cbContent1.setCheck(false);
	thisObj.cbContent2.setCheck(false);
	thisObj.cbContent3.setCheck(false);
	thisObj.cbContent4.setCheck(false);

	
	this.flag = false;
	this.accView.doInitAccInfo(4);
	
	PensionCommon.checkLimitPaymentAmount(this);
	
	this.now = new Date();
	this.yyyy = this.now.format('yyyy');	// 현재 해
	this.mm = this.now.format('MM');//저축 기간 구하기 달
	this.dd = this.now.format('dd');// 현재 일
	this.today = this.yyyy+this.mm+this.dd;
};



//연금 수령 희망일 : 만 55세와 저축기간 만기일을 모두 충족하는 날 이후로 지정 가능  합니다.
FD5001_V05.prototype.onbtnNext4Click = function(comp, info)
{
	//TODO:edit here
	
	
	var thisObj = this;
	
	var callSACAT409 = function(outBlock){
		setTimeout(function()
				   {
			thisObj.SendData_SACAT409(outBlock); //펀드 가입 계좌 id와 연결

		},3000);	
	}
	
	var callSACMT295 = function(hopeDay){
		thisObj.SendData_SACMT295(hopeDay,callSACAT409);	//펀드 가입 
	}
	
	//저축기간 5년으로
	this.getAge('5',PensionCommon.pNumber,callSACMT295);
	

};

//연금저축계좌 약관
FD5001_V05.prototype.oncbContent1Click = function(comp, info)
{

	if(!afc.isSimulator){
		if(this.secureTxf.getPwLength() == 0){
			AToast.show("계좌비밀번호를 입력해주세요.");
			this.cbContent1.setCheck(false);
			return;
		}
	}
	
	
	var param = {
		"viewUrl" : "http://www.meritzam.com/marketings/terms15.html",
		"title" : "연금저축계좌 약관",
		"btnType" : "0",
		"checkType" : "1"
	}
	
	PensionCommon.fullSizePopup(this, param);
	
	// 체크박스 처리...
	if(!this.cbContent1.getCheck()) // 체크박스 값이 true 에서 false 로 변경되는 순간 true 로 강제 세팅
	{
		this.cbContent1.setCheck(true);
	}
	
	
};

//연금저축계좌 핵심설명서
FD5001_V05.prototype.oncbContent2Click = function(comp, info)
{	

	if(!afc.isSimulator){
		if(this.secureTxf.getPwLength() == 0){
			AToast.show("계좌비밀번호를 입력해주세요.");
			this.cbContent2.setCheck(false);
			return;
		}
	}
	
	
	var param = {
		"viewUrl" : "http://www.meritzam.com/marketings/terms14.html",
		"title" : "연금저축계좌 핵심설명서",
		"btnType" : "0",
		"checkType" : "2"
	}
	
	PensionCommon.fullSizePopup(this, param);
	
	// 체크박스 처리...
	if(!this.cbContent2.getCheck()) // 체크박스 값이 true 에서 false 로 변경되는 순간 true 로 강제 세팅
	{
		this.cbContent2.setCheck(true);
	}
	
	
};

//연금저축계좌 가입시 유의사항
FD5001_V05.prototype.oncbContent3Click = function(comp, info)
{
	
	if(!afc.isSimulator){
		if(this.secureTxf.getPwLength() == 0){
			AToast.show("계좌비밀번호를 입력해주세요.");
			this.cbContent3.setCheck(false);
			return;
		}
	}
	var param = {
		"viewUrl" : "http://www.meritzam.com/marketings/terms19.html",
		"title" : "연금저축계좌 가입시 유의사항",
		"btnType" : "0",
		"checkType" : "3"
	}
	
	PensionCommon.fullSizePopup(this, param);
	
	// 체크박스 처리...
	if(!this.cbContent3.getCheck()) // 체크박스 값이 true 에서 false 로 변경되는 순간 true 로 강제 세팅
	{
		this.cbContent3.setCheck(true);
	}
	
	
};

//개인(신용)정보 필수동의서
FD5001_V05.prototype.oncbContent4Click = function(comp, info)
{
	if(!afc.isSimulator){
		if(this.secureTxf.getPwLength() == 0){
			AToast.show("계좌비밀번호를 입력해주세요.");
			this.cbContent4.setCheck(false);
			return;
		}
	}
	
	var param = {
		"viewUrl" : "http://www.meritzam.com/marketings/personal_info2.html",
		"title" : "개인(신용)정보 필수동의서",
		"btnType" : "0",
		"checkType" : "4"
	}
	
	
	PensionCommon.fullSizePopup(this, param);
	
	
	
	
};
//팝업 result
FD5001_V05.prototype.onWindowResult = function(data) {
	
	if(data == 1 && this.flag == false){ //처음 약관4 클릭 
		this.SendData_SACMT289("select");
		 
	}else if(data ==1 && this.flag == true){ //두번째 약관4 클릭시 SendData_SACMT289 가지않게.. 
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
FD5001_V05.prototype.SendData_SACMT289 = function(Type)
{
	var thisObj = this
	,cont = thisObj.getContainer() // 연결된 최상위 뷰
	,qrName = "SACMT289"
	,cipherData = thisObj.secureTxf.getCipherData();
	
	if(!afc.isSimulator && !cipherData) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		thisObj.secureTxf.addClass('active');
		return;
	}
	thisObj.secureTxf.removeClass('active');


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
				InBlock1['D1개인정보제공동의여부19'] = 1,//GA
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
		InBlock1['D1계좌번호'] = thisObj.totalAcc;
		InBlock1['D1비밀번호'] = afc.isSimulator ? '0423': cipherData;
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
				if(!thisObj.cbContent4.getCheck()) 
				{
					thisObj.cbContent4.setCheck(true);
				}
				
				//화면이 모두 클릭되면 다음 버튼 활성화 
				thisObj.oncbContentClick();
				thisObj.flag = true;
			}
		}else{// 서버에서 error 값 리턴 후에는 다시 서버를 타야함 .. 
			thisObj.cbContent4.setCheck(false);
		}
	});

	
};


FD5001_V05.prototype.updateSACMT289 = function()
{
	this.SendData_SACMT289("update");
}

//펀드 계좌 생성
FD5001_V05.prototype.SendData_SACMT295 = function(hopeDay,callSACAT409)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	var svcId = 'SACMT295';
	var cipherData = thisObj.secureTxf.getCipherData();
	
	if(!afc.isSimulator && !cipherData) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		thisObj.secureTxf.addClass('active');
		return;
	}
	thisObj.secureTxf.removeClass('active');
	
	theApp.accNetManager.addSkipErrorCode('SACMT295', '9999'); // 변경이 완료되었습니다. skip
	
	cont.sendData(svcId,
	function(queryData, groupName)
	{
		
			
		var inBlock1 = queryData.getBlockData('InBlock1')[0];
		var inBlock2 = queryData.getBlockData('InBlock2')[0];
		var inBlock3 = queryData.getBlockData('InBlock3')[0];
		
		
		inBlock1['D1상위계좌번호'] = thisObj.totalAcc;
		inBlock1['D1상품유형코드'] = '04';
		inBlock1['D1상품상세코드'] = '77';
 		inBlock1['D1계좌비밀번호'] = afc.isSimulator ? '0423': cipherData;
		queryData.putPwInfo('InBlock1','D1계좌비밀번호');		
		inBlock2['D1계약기간월수'] = '60';
		inBlock2['D1납입단위금액'] = '1';
		inBlock2['D1연금지급시작일'] = hopeDay;
		inBlock2['D1최초매수일'] = thisObj.today;
		inBlock2['D1투자신탁투자자분류코드'] = '0000'
		inBlock3['D1계정구분'] = '2';
		inBlock3['D1출금계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];	
		// Function key 세팅.
		queryData.setHeaderInfo(
			{FUNC_KEY_LST: 'C'}	// 조회.
		);
		
		
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
			
			if(queryData.getBlockData('OutBlock1')[0]){
				callSACAT409.call(thisObj,outBlock);
			}
         	
		}
	});
};

//연금 수령 희망일 : 만 55세와 저축기간 만기일을 모두 충족하는 날 이후로 지정 가능  합니다.
FD5001_V05.prototype.getAge = function(date,pNumber,callSACMT295)
{
	var birth = null; //태어난 해
	var age = null;	// 만 나이

	var birthYear = pNumber.substr(0,2); // 주민번호 태어난 해
	var birthMonth = pNumber.substr(2,2); // 주민번호 태어난 달
	var birthDay = pNumber.substr(4,2);// 주민번호 태어난 일
	var birthMD = pNumber.substr(2,4); // 주민번호 태어난 날짜

	var bb= pNumber.substr(6,1); // 주민번호 앞자리 1,2,3,4
	var month = this.now.format('MM')*1+1;//만나이 구하기 달
	var md = month.toString() + this.dd; // 만나이 현재 날짜
	var hopeDay1 = null;//만나이 개시 희망일
	var hopeDay2 = null;//저축기간 개시 희망일
	
	var hopeDay = '';
	if(bb == '1' || bb == '2'){
		birth = '19' + birthYear;
	}else{
		birth = '20' + birthYear;
	}


	if(birthMD*1 > md*1){
		age = this.yyyy*1 - birth*1 -1;

	}else{
		age = this.yyyy*1 - birth*1;
	}


	if(age*1 < 55 ){
		this.r1 = (this.yyyy*1 + 55 - age*1).toString() +birthMonth + birthDay ;
		hopeDay1 = (this.yyyy*1 + 55 - age*1).toString() + "."+birthMonth + "." + birthDay ;
	}else{
		this.r1 = this.yyyy + birthMonth + birthDay ;
		hopeDay1 = this.yyyy + "."+birthMonth + "."+birthDay ;
	}
	
	this.r2 = (this.yyyy*1 + date*1).toString() +this.mm +this.dd;
	hopeDay2 =(this.yyyy*1 + date*1).toString() + "."+this.mm + "."+this.dd;
	if(this.r1*1 < this.r2*1){
		hopeDay = this.r2*1;
	}else {
		hopeDay = this.r1*1;
	}
	
	if(hopeDay != ''){
		callSACMT295.call(this,hopeDay);
		hopeDay = '';
	}
		
}

//펀드 계좌 id와 연결 
FD5001_V05.prototype.SendData_SACAT409 = function(info)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	var svcId = 'SACAT409';

	
	
	cont.sendData(svcId,
	function(queryData, groupName)
	{
		
		
		var inBlock1 = queryData.getBlockData('InBlock1')[0];
		inBlock1['D1처리구분'] = '1';
		inBlock1['D1계좌번호'] = info['D1계좌번호'];
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
				"barAcc" : info['D1조회계좌번호'],
				"name" : info['D1고객명'],
				"acc" : info['D1계좌번호']
			}
			cont.tvManager.getActiveView().tbvManager.changeTab('FD5001_V06', param);
		}
	});
};

//화면이 모두 클릭되면 다음 버튼 활성화 
FD5001_V05.prototype.oncbContentClick = function(comp, info)
{	

	
	//TODO:edit here
	if(this.cbContent1.getCheck()
		&& this.cbContent2.getCheck()
		&& this.cbContent3.getCheck()
		&& this.cbContent4.getCheck()) {
		this.btnNext4.enable(true);
	}
	else {
		this.btnNext4.enable(false);
	}
};
