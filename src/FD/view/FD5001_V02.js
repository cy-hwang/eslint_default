
/**
Constructor
Do not call Function in Constructor.
*/
//계좌구분 
function FD5001_V02()
{
	AView.call(this);

	this.now = null;//오늘 날짜
	this.yyyy =null;//오늘 년도
	this.mm = null;//오늘 달
	this.dd = null;//오늘 월
	this.r1 = null; // 55세가 되는 해
	this.r2 = null; // 저축기간 되는 해
	this.pNumber = null;//주민번호
	this.name = null;//이름 
	this.hopeDay = null;//희망일
}
afc.extendsClass(FD5001_V02, AView);


FD5001_V02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	this.accView = this.findCompById('accView').viewLoad('FD/view/FD5001_V07.lay');
	this.textField2 = this.findCompById('TextField2');//날짜
	this.textField1 = this.findCompById('TextField1');//저축기간
	this.textField3 = this.findCompById('TextField3');//금액
	
	
	this.bt_modify = this.findCompById('Bt_modify');//수정 버튼
	this.bt_modify.enable(false);

	//계좌드롭박스
	this.accView = this.findCompById('accView').loadView;
	this.accDbx = this.accView.accDbx;
	this.accView.setDelegator(this);
	this.secureTxf = this.accView.secureTxf;
	
};


//값 초기화
FD5001_V02.prototype.onArrInit = function()
{		
	
	this.textField2.setText(this.yyyy+'.'+this.mm+'.'+this.dd);//날짜 초기화
	this.textField1.setText('');//저축기간 초기화
	this.textField3.setText('');//금액 초기확 

};

//화면이 없어지면 값 초기화 
FD5001_V02.prototype.onWillDeactive = function(reload)
{	
	AView.prototype.onWillDeactive.call(this, reload);
	this.onArrInit();
};

//화면이 나타는 중 
FD5001_V02.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	this.bt_modify.enable(false);
	
	this.accView.doInitAccInfo(4);	//0: 종합계좌번호, 4: 투신상품계좌번호 5: 연금 저축 
	
	PensionCommon.checkLimitPaymentAmount(this);//납입금액 초과한 경우 팝업을 띄우기 위해
	this.now = new Date();
	this.yyyy = this.now.format('yyyy');// 현재 해
	this.mm = this.now.format('MM');//저축 기간 구하기 달
	this.dd = this.now.format('dd');// 현재 일
	//오늘 날짜 찍기 
	this.textField2.setText(this.yyyy+'.'+this.mm+'.'+this.dd);
	
	this.today = this.yyyy+this.mm+this.dd;
};

//다음 버튼 
FD5001_V02.prototype.onButton2Click = function(comp, info)
{

	var thisObj = this;
	var cont = thisObj.getContainer();
	
	//TODO:edit here
	
	if(!afc.isSimulator && this.secureTxf.getPwLength() == 0){
		AToast.show('비밀번호를 입력해 주세요');
		return;
	}


	if(this.textField1.getText() == ''){
		AToast.show('저축기간을 입력해 주세요');
		return;
	}

	if(this.textField2.getText() == ''){
		AToast.show('연간 수령 개시 희망일을 입력해 주세요');
		return;
	}

	if(this.textField3.getText() == ''){
		AToast.show('연간 납입금액을 입력해 주세요');
		return;
	}
	
	//한도잔여금액 초과시 팝업 
	if(PensionCommon.limitPay*1 < this.textField3.getText()*1){
		var param = {
			"name" : PensionCommon.name,
			"limitPay" : PensionCommon.limitPay
		};
		
		
		var win = AWindow.createWindow('FD/window/FD5001_W03.lay', 'FD5001_W03');
		win.param = param;
		win.openAsDialog(this);
	}else{ //다음으로 
		
		var param =  { 
			"acc" : this.accDbx.getSelectedItemData()['D1계좌번호'],//투신계좌
			"pw" : afc.isSimulator ? '0423' : this.secureTxf.getCipherData(),
			"term" : this.textField1.getText(),//저축기간
			"pay" : this.textField3.getText(),//금액
			"date" : this.hopeDay,//희망일
			"today"  : this.today, //오늘날짜
			"totalacc" : this.acc1};//종합계좌
		cont.tvManager.getActiveView().tbvManager.changeTab('FD5001_V03', param);
		
	}	

};

//날짜수정버튼
FD5001_V02.prototype.onBt_modifyClick = function(comp, info)
{

	//연금수령희망개시일 팝업 
	if(this.textField1.getText() != ''){
		var win = AWindow.createWindow('FD/window/FD5001_W02.lay', 'FD5001_W02');
		win.openAsDialog(this);
	}
};

//계좌 드랍박스, 비밀번호 
FD5001_V02.prototype.fnDoSendDataManage = function()
{

	if(afc.isSimulator ){
		this.accList =  theApp.accInfo.filterAccList(0)//종합계좌번호
		for(var i=0;i<this.accList.length;i++){
			if(this.accList[i]["D1계좌번호"].substr(5,6) == this.accDbx.getSelectedItemData()['D1계좌번호'].substr(5,6)){
				this.acc1 = this.accList[i]["D1계좌번호"];
			}	
		}
	}
	
	
	if(this.secureTxf.getPwLength() == 0)
	{	
		AToast.show("계좌비밀번호를 입력해주세요.");
		//값초기화 
		this.secureTxf.addClass('active');
		this.textField1.setText('');
		this.textField3.setText('');
		this.textField2.setText(this.yyyy+'.'+this.mm+'.'+this.dd);
		this.bt_modify.enable(false);
		
		return;
	}
	this.secureTxf.removeClass('active');
	
	if(this.secureTxf.getPwLength() != 0)
	{	
		if(PensionCommon.totalPay*1 >= 18000000){ // 세금우대가입금액 한도 초과 
		
			var contents = '연금저축계좌 한도에 도달하여 <br>'+
							'계약이전(계좌이체)만 가능합니다.<br>'+
							'진행하시겠습니까?'
			var param = {
				"title" : "",
				"contents" : contents,
				"btnText" : "확인",
				"returnType" : "1",
				"returnData" : ""
			};
			PensionCommon.oneBtnPopup(this,param);
		}else{ //내가 드랍박스에서 선택한 투신계좌로 연금 펀드 계좌 개설 -> 계좌가 여러개 일수도 있으므로 
			this.accList =  theApp.accInfo.filterAccList(0)//종합계좌번호
			for(var i=0;i<this.accList.length;i++){
				if(this.accList[i]["D1계좌번호"].substr(5,6) == this.accDbx.getSelectedItemData()['D1계좌번호'].substr(5,6)){
					this.acc1 = this.accList[i]["D1계좌번호"]; //종합계좌 
				}	
			}
		}
	}

};


FD5001_V02.prototype.callbackPensionPopup = function(returnData, resultData)
{
	theApp.goPageCheck('FD5002', false, {tabId:'FD5002_T01'});	
}

// 2019.03.04 계산식 변경 
// 연금 수령 희망일 : 만 55세와 저축기간 만기일을 모두 충족하는 날 이후(+1일)로 지정 가능  합니다.
FD5001_V02.prototype.getAge = function(date,pNumber)
{
	var birthFrontYear = null; //태어난 해 앞2자리
	var birthYear = null; // 태어난 해 4자리
	var age = null;	// 만 나이	

	var birthEndYear = pNumber.substr(0,2); // 주민번호 태어난 해
	var birthMonth = pNumber.substr(2,2); // 주민번호 태어난 달
	var birthDay = pNumber.substr(4,2);// 주민번호 태어난 일
	
	var bb= pNumber.substr(6,1); // 주민번호 앞자리 1,2,3,4
	
	//2000년 생 구분 
	if(bb == '1' || bb == '2'){
		birthYear = '19' + birthEndYear;
	}else{
		birthYear = '20' + birthEndYear;
	}
	
	// 생년월일 8자리로 변경
	var birthDate = new Date(birthYear, Number(birthMonth)-1, birthDay);
	var formatBirthDate = birthDate.format('yyyyMMdd');	
		
	// 생년월일 앞 8자리 계산 끝
	
	// 오늘일자 8자리 계산
	var formatNowDate = this.now.format('yyyyMMdd');
	
	// 현재 일자 구하여 만나이 구하기
	var nowYear = formatNowDate.substr(0,4); // 당일 해당 년 
	var nowMonth = formatNowDate.substr(4,2); // 당일 해당 월
	var nowDay = formatNowDate.substr(6,2);// 당일 해당 일
			
	var yearAge = formatNowDate.substr(0,4)*1 - formatBirthDate.substr(0,4)*1;
		
	if(formatNowDate.substr(4,8) >= formatBirthDate.substr(4,8)){
		
	}else{
		yearAge = yearAge - 1;
	}	
	
	var hopeDay1 = null;//만나이 개시 희망일
	var hopeDay2 = null;//저축기간 개시 희망일
	
	var formHopeDay1 = null; // Date 형식의 만나이 개시 희망일
	var formHopeDay2 = null; // Date 형식의 저축기간 개시 희망일
			
	if(yearAge*1 + date*1 >= 55*1){		
		formHopeDay1 = new Date(nowYear*1 + date*1, nowMonth-1, nowDay*1 + 1*1);
		this.r1 = formHopeDay1.format('yyyyMMdd');
		hopeDay1 = Utils.formatDotDate(formHopeDay1.format('yyyyMMdd'));
		
		this.textField2.setText(hopeDay1);
				
	}else{
		formHopeDay2 = new Date(birthYear*1 + 55*1, birthMonth-1, birthDay*1 + 1*1);				
		this.r2 = formHopeDay2.format('yyyyMMdd');
		hopeDay2 = Utils.formatDotDate(formHopeDay2.format('yyyyMMdd'));
		
		this.textField2.setText(hopeDay2);
		
	}

	//희망일 
	this.hopeDay = this.textField2.getText().split('.').join('');		
};

/*
// 2019.03.04 이전 연금수령희망일 계산 소스
//연금 수령 희망일 : 만 55세와 저축기간 만기일을 모두 충족하는 날 이후로 지정 가능  합니다.
FD5001_V02.prototype.getAge = function(date,pNumber)
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
	
	//2000년 생 구분 
	if(bb == '1' || bb == '2'){
		birth = '19' + birthYear;
	}else{
		birth = '20' + birthYear;
	}

	//만 나이 구하기 
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
	
	//선택한 저축기간 날짜 
	this.r2 = (this.yyyy*1 + date*1).toString() +this.mm +this.dd;
	hopeDay2 =(this.yyyy*1 + date*1).toString() + "."+this.mm + "."+this.dd;
	
	//만나이 저축기간 날짜 비교 
	if(this.r1*1 < this.r2*1){
		this.textField2.setText(hopeDay2);	
	}else {
		this.textField2.setText(hopeDay1);
	}

	//희망일 
	this.hopeDay = this.textField2.getText().split('.').join('');
}

*/

//팝업 result
FD5001_V02.prototype.onWindowResult = function(result, awindow)
{	

	var date = null;
	
	if(result != 0){
		var key = result.key;
		if(key == "1"){ //저축기간 팝업
			date = result.data;
			if(date.substr(0,1) == 0){
				date = date.substr(1,1);
			}
			
			this.textField1.setText(date);
			this.getAge(date,PensionCommon.pNumber);
			
			this.bt_modify.enable(true);
			
		}else if(key == "2"){//희망일 팝업
			date = result.data;
			this.textField2.setText(date[0]+'.'+date[1]+'.'+date[2]);
			this.hopeDay = this.textField2.getText().split('.').join('');
		}	
	}
};

//저축기간 팝업
FD5001_V02.prototype.onTextField1ActionUp = function(comp, info)
{

	//TODO:edit here
	
	var win = AWindow.createWindow('FD/window/FD5001_W01.lay', 'FD5001_W01');
	
	win.openAsDialog(this);


};

//나의 저축 한도는 ? 팝업
FD5001_V02.prototype.onLabel9ActionUp = function(comp, info)
{

	//TODO:edit here
	var win = AWindow.createWindow('FD/window/FD5001_W04.lay', 'FD5001_W04');
	win.limitPay = PensionCommon.limitPay;
	win.name = PensionCommon.name;
	win.open(this,0,0,'100%','100%');

};






