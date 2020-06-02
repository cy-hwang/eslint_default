
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_T07()
{
	AView.call(this);

}
afc.extendsClass(MS1005_T07, AView);

MS1005_T07.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.jobDbx = this.findCompById('JobDbx');
	var jobArr = [{text:'일반회사원',data:'10'},{text:'전문직회사원',data:'20'},{text:'일반자영업자',data:'30'},
				  {text:'전문직자영업자',data:'40'},{text:'공무원',data:'50'},{text:'연금생활자',data:'61'},
				  {text:'학생',data:'62'},{text:'주부',data:'63'},{text:'카지노,대부업,환전상(EDD대상)',data:'71'},
				  {text:'고가의귀금속판매상(EDD대상)',data:'72'},{text:'기타',data:'99'}];
	
	for(var i=0;i<jobArr.length;i++){
		this.jobDbx.addItem(jobArr[i].text,jobArr[i].data);
	}
	
	
	this.objectDbx = this.findCompById('ObjectDbx');
	var objectArr = [{text:'생활비',data:'01'},{text:'사업상거래',data:'02'},{text:'저축및투자',data:'03'},{text:'기타',data:'09'}];
	
	for(var i=0;i<objectArr.length;i++){
		this.objectDbx.addItem(objectArr[i].text,objectArr[i].data);
	}
	
	this.objectView = this.findCompById('ObjectView');
	this.objectView.show(AComponent.GONE);
	this.objectTxt = this.findCompById('ObjectTxt');
	
	this.originDbx = this.findCompById('OriginDbx');
	var originArr = [{text:'급여',data:'01'},{text:'사업소득',data:'02'},{text:'상속',data:'03'},{text:'부동산처분',data:'04'},{text:'기타',data:'99'}];
	
	for(var i=0;i<originArr.length;i++){
		this.originDbx.addItem(originArr[i].text,originArr[i].data);
	}
	
	this.originView = this.findCompById('OriginView');
	this.originView.show(AComponent.GONE);
	this.originTxt = this.findCompById('OriginTxt');
	
	this.radioGroup1 = this.findCompById('RadioGroup1');
	
	this.btnView = this.findCompById('BtnView');
	
	this.trueRBtn1 = this.findCompById('TrueRBtn1')
	this.falseRBtn2 = this.findCompById('FalseRBtn2')
	this.falseRBtn3 = this.findCompById('FalseRBtn3')
	
	this.radioGroup1.setSelectBtn(this.trueRBtn1);
	
	this.nextBtn = this.findCompById('NextBtn');
	
	this.name = this.findCompById('NameLbl');
	this.phone = this.findCompById('ProductLbl');
	
	this.validJobDbx = true;
	this.validOjectDbx = true;
	this.validOringinDbx = true;
};

MS1005_T07.prototype.onActive = function(reload)
{
	AView.prototype.onActive.call(this, reload);
	this.sendSFCFQ005();
	this.fillSavedData();
};

MS1005_T07.prototype.onDeactiveDone = function()
{
	AView.prototype.onDeactiveDone.call(this);
		
	this.objectDbx.clearSelectItem();
	this.originDbx.clearSelectItem();
	this.jobDbx.clearSelectItem();
	
	this.objectTxt.setText('');
	this.originTxt.setText('');
	this.objectView.show(AComponent.GONE);
	this.originView.show(AComponent.GONE);
	
	if(!this.validJobDbx) {
		this.jobDbx.addClass('DR_01');
		this.jobDbx.removeClass('DR_01_2');
		this.validJobDbx = true;
	}
	
	if(!this.validOjectDbx) {
		this.objectDbx.addClass('DR_01');
		this.objectDbx.removeClass('DR_01_2');
		this.validOjectDbx = true;
	}
	
	if(!this.validOringinDbx) {
		this.originDbx.addClass('DR_01');
		this.originDbx.removeClass('DR_01_2');
		this.validOringinDbx = true;
	}
	
	this.fillSavedData();
};



MS1005_T07.prototype.fillSavedData = function()
{
	var usrData = theApp.userInfo.getUserData();
	
	this.name.setText(usrData['D1고객명']);

//각 항목 값 확인
	if(usrData['D1이동전화국번호'] != 'undefined' && usrData['D1이동전화일련번호'] != 'undefined') {
	this.phone.setText(usrData['D1이동전화식별번호']+'-'+usrData['D1이동전화국번호']+'-'+usrData['D1이동전화일련번호']);
	} else {
		this.phone.setText(usrData['D1이동전화식별번호']);
	}
	
	if(this.phone.getText() == "--")
		this.phone.setText("");
};

MS1005_T07.prototype.onBeforeBtnClick = function(comp, info)
{

	this.getContainer().beforeView();

};

MS1005_T07.prototype.onNextBtnClick = function(comp, info)
{

	if(!this.pageValidCheck()) return;
	
	this.sendSAMCT102(); 
};

MS1005_T07.prototype.sendSAMCT102 = function()
{
	var thisObj = this;
	this.owner;
	if(this.radioGroup1.getSelectBtn().compId == 'TrueRBtn1') this.owner = 1;
	if(this.radioGroup1.getSelectBtn().compId == 'FalseRBtn1') this.owner = 0;
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {
		dd='0'+dd
	} 
	if(mm<10) {
		mm='0'+mm
	} 
	
	var date = yyyy + mm + dd;
	QryRequest.request('SAMCT102',
	function(queryData)
	{
		var inBlock1 = queryData.getBlockData('InBlock1');
		inBlock1[0] =
		{
			"D1처리일" : date,
			"D1실명확인번호" : theApp.userInfo.getUserData('D1실명확인번호암호화'),
			"D1실명" : theApp.userInfo.getUserData('D1고객명'),
			"D1휴대폰지역번호" : theApp.userInfo.getUserData('D1휴대폰지역번호'),
			"D1휴대폰국번호" : theApp.userInfo.getUserData('D1휴대폰국번호'),
			"D1휴대폰일련번호" : theApp.userInfo.getUserData('D1휴대폰일련번호'),
			"D1RA직업코드" : thisObj.jobDbx.getSelectedItemData(),
			"D1거래용도코드" : thisObj.objectDbx.getSelectedItemData(),
			"D1EDD투자자금출처" : thisObj.originDbx.getSelectedItemData(),
			"D1실소유자여부" : thisObj.owner,
			"D1상품유형구분" : '00',
			"D1상품상세코드" : '00',
			"D1거래용도기타" : thisObj.objectTxt.getText(),
			"D1EDD투자자금출처기타사유" : thisObj.originTxt.getText()
			
		};

		queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
	},
	
	function(queryData)
	{	
		var errCode = this.getLastError('errCode');
		var errMsg = this.getLastError('errMsg');
		
		if((1001 == errCode || 251 == errCode) && 0 == errMsg.indexOf('WLF'))
		{
			var win = AWindow.createWindow('FD/window/MS1005_W09.lay', 'MS1005_W09');
			win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">고객님의 정보 확인을 위해<br>메리츠자산운용 고객센터<br>(1588-5533)로 연락<br>주시기 바랍니다.</span>';
            win.openAsDialog(this);
		}
		else 
		{
			if( errCode >= 1000 )
			{
				theApp.getErrMsg(thisObj,this);
			}
			else if(queryData) {
				//theApp.userInfo.setUserData("D1처리일", date);
				//queryData.printQueryData();
	// 			thisObj.sendSFCAT010();
				theApp.saveStep('4', function(){
					thisObj.getContainer().nextView();
				});
			}
		}
	});
};

MS1005_T07.prototype.pageValidCheck = function()
{
	if(!this.jobDbx.getSelectedItemData())
	{
		AToast.show('직업을 선택해주세요');
		this.validJobDbx = false;
		
		this.jobDbx.addClass('DR_01_2');
		this.jobDbx.removeClass('DR_01');
		return false;
	}
		
	if(!this.objectDbx.getSelectedItemData())
	{
		AToast.show('거래목적을 선택해주세요');
		this.validOjectDbx = false;
		
		this.objectDbx.addClass('DR_01_2');
		this.objectDbx.removeClass('DR_01');
		return false;
	} 
	
	//거래목적이 "기타" 인 경우 입력값 체크(공란 안 됨)
	if(this.objectDbx.getSelectedItemData() == '09')
	{
		var tmp = this.objectTxt.getText();
		if(tmp.length > 50) {
        	AToast.show('거래목적의 기타 내용은 50글자를 초과할 수 없습니다.');
        	return false;
        }
		tmp = tmp.trim();
		if(tmp.length < 1) {
			AToast.show('거래목적이 기타인 경우 내용을 입력해주세요.');
			return false;
		}
		if(!this.checkInputText(this.objectTxt)) return false;
	}
	
	if(!this.originDbx.getSelectedItemData())
	{
		AToast.show('자금출처를 선택해주세요');
		this.validOringinDbx = false;
		
		this.originDbx.addClass('DR_01_2');
		this.originDbx.removeClass('DR_01');
		return false;
	} 
	
	//자금출처가 "기타" 인 경우 입력값 체크(공란 안 됨)
	if(this.originDbx.getSelectedItemData() == '99')
	{
		var tmp = this.originTxt.getText();
		if(tmp.length > 50) {
        	AToast.show('자금출처의 기타 내용은 50글자를 초과할 수 없습니다.');
        	return false;
        }
		tmp = tmp.trim();
		if(tmp.length < 1) {
			AToast.show('자금출처가 기타인 경우 내용을 입력해주세요.');
			return false;
		}
		if(!this.checkInputText(this.originTxt)) return false;
	}
	
	if( this.radioGroup1.getSelectBtn().compId != 'TrueRBtn1')	
	{
		AToast.show('잘못된 실소유자여부 선택입니다. 다시 선택해주세요.');
		return false;
	} 
	return true;

};

MS1005_T07.prototype.onRadioGroup1Change = function(comp, info)
{
	if( this.radioGroup1.getSelectBtn().compId != 'TrueRBtn1')	
	{		
		var win = AWindow.createWindow('FD/window/MS1005_W02.lay', 'MS1005_W02');		
		
		win.infoMsg = '<span class="SB" style="color:rgb(104, 104, 104);font-size:24px; line-height:141%;">실소유자만 계좌개설이<br/>가능합니다.</span>';
		win.btnText = "확인";
	 	win.btnGroupId = "radioGroup1";
		win.btnType = 1;
		win.openAsDialog(this);
	}
};

MS1005_T07.prototype.onWindowResult = function(result, awindow)
{
	if("MS1005_W07" == awindow.getContainerId())
	{			
		if(afc.isAndroid) navigator.app.exitApp();
		else if(afc.isIos) AppManager.exitApp();
	}
	else if("MS1005_W09" == awindow.getContainerId())
	{
		//nothing 
	}
	
};


MS1005_T07.prototype.checkFATCAValidation = function()
{
	this.tempValid = false;
	if(this.radioGroup1.getSelectBtn().compId == 'TrueRBtn1' /*&& this.radioGroup2.getSelectBtn().compId == 'FalseRBtn2' && this.radioGroup3.getSelectBtn().compId == 'FalseRBtn3'*/ ) {
		this.tempValid = true;
	}
	return this.tempValid;
};

//FATCA 사용 여부 호출
MS1005_T07.prototype.sendSFCFQ005 = function(){
	var thisObj=this;
	QryRequest.request('SFCFQ005',
	function(queryData)
	{
	},
	function(queryData)
	{
		if(queryData)
		{
			var blockData = queryData.getBlockData('OutBlock1')[0];
			if(blockData['D1사용여부']=='0'){	//사용 안함
				return;
			}else{	//사용함
				var win = AWindow.createWindow('FD/window/MS1005_W02.lay', 'MS1005_W02');		

				win.infoMsg = '<span class="SB" style="color:rgb(104, 104, 104);font-size:24px; line-height:141%;">FATCA 사용 시 메리츠 문의가<br/>필요합니다.</span>';
				win.btnText = "확인";
				win.btnGroupId = "radioGroup1";
				win.btnType = 1;
				win.openAsDialog(thisObj);
			}
		}
	});	
};

MS1005_T07.prototype.onJobDbxActionDown = function(comp, info)
{
	if(!this.validJobDbx) {
		comp.addClass('DR_01');
		comp.removeClass('DR_01_2');
		this.validJobDbx = true;
	}
};

MS1005_T07.prototype.onObjectDbxActionDown = function(comp, info)
{
	if(!this.validOjectDbx) {
		comp.addClass('DR_01');
		comp.removeClass('DR_01_2');
		this.validOjectDbx = true;
	}
};

MS1005_T07.prototype.onOriginDbxActionDown = function(comp, info)
{	
	if(!this.validOringinDbx) {
		comp.addClass('DR_01');
		comp.removeClass('DR_01_2');
		this.validOringinDbx = true;
	}
};

MS1005_T07.prototype.onObjectDbxSelect = function(comp, info)
{
	if(this.objectDbx.getSelectedItemData() == '09') { //09.기타
		this.objectTxt.setText('');
		this.objectView.show(AComponent.VISIBLE);
	} else {
		this.objectView.show(AComponent.GONE);
	}
};

MS1005_T07.prototype.onOriginDbxSelect = function(comp, info)
{
	if(this.originDbx.getSelectedItemData() == '99') { //99.기타
		this.originTxt.setText('');
		this.originView.show(AComponent.VISIBLE);
	} else {
		this.originView.show(AComponent.GONE);
	}
};

MS1005_T07.prototype.checkInputText = function(obj)
{
	var tmp = obj.getText();
	
	//특수문자 제거
	var regExp = /[^(가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s)]/gi;		// /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	if(regExp.test(tmp)) {
		if(afc.isIos) AToast.show('특수문자는 입력할 수 없습니다.');
		else AToast.show('특수문자는 입력할 수 없습니다.');
		tmp = tmp.replace(regExp, "");
		obj.setText(tmp);
		return false;
	}
	
	var tmpLen = tmp.length;
	if(tmpLen > obj.maxLen)
	{
		AToast.show(tmpLen + '자 입력하셨습니다.\r\n기타는 '+obj.maxLen+'자 이내로 입력하셔야 합니다.');	
		return false;
	}
	return true;
};

MS1005_T07.prototype.onObjectTxtChange = function(comp, info)
{
	this.checkInputText(this.objectTxt);
};

MS1005_T07.prototype.onOriginTxtChange = function(comp, info)
{
	this.checkInputText(this.originTxt);
};
