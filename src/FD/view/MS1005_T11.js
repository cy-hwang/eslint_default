
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_T11()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(MS1005_T11, AView);


MS1005_T11.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.radioBtn21 = this.findCompById('RadioButton21'); //e1
	this.radioBtn22 = this.findCompById('RadioButton22'); //e1
	this.radioBtn19 = this.findCompById('RadioButton19'); //e3
	this.radioBtn20 = this.findCompById('RadioButton20'); //e3

	
	this.radioBtn1 = this.findCompById('RadioButton1');	//f1
	this.radioBtn2 = this.findCompById('RadioButton2');	//f1
	this.radioBtn25 = this.findCompById('RadioButton25'); //f4
	this.radioBtn26 = this.findCompById('RadioButton26'); //f4
	this.radioBtn29 = this.findCompById('RadioButton29'); //f3
	this.radioBtn30 = this.findCompById('RadioButton30'); //f3
	
	//상품서비스 통보지
	this.radioBtn3 = this.findCompById('RadioButton3'); 	//전체동의
	this.radioBtn8 = this.findCompById('RadioButton8');
	this.radioBtn9 = this.findCompById('RadioButton9');
	
	//dummy
	this.radioBtn35 = this.findCompById('RadioButton35'); //e1
	this.radioBtn36 = this.findCompById('RadioButton36'); //e3
	this.radioBtn42 = this.findCompById('RadioButton42'); //f1
	this.radioBtn43 = this.findCompById('RadioButton43'); //f4
	this.radioBtn45 = this.findCompById('RadioButton45'); //f3

	this.btnView = this.findCompById('View4');
	this.btn1 = this.findCompById('Button2');				//이전버튼
	this.btn2 = this.findCompById('Button3');				//다음버튼
	this.conBtn1 = this.findCompById('Button5');				//내용보기 상
	this.conBtn2 = this.findCompById('Button1');				//내용보기 하
	
	
	this.radioGp8 = this.findCompById('RadioGroup8'); //e1
	this.radioGp7 = this.findCompById('RadioGroup7'); //e3

	this.radioGp1 = this.findCompById('RadioGroup1'); //f1
	this.radioGp10 = this.findCompById('RadioGroup10'); //f4
	this.radioGp12 = this.findCompById('RadioGroup12'); //f3

	this.bWholeAgree = false;
	this.cWholeAgree = false;
};


MS1005_T11.prototype.onActive = function(reload)
{
	AView.prototype.onActive.call(this, reload);
	
	if( reload)
	{		
		theApp.checkCreateDatetime();
	}
	
};

MS1005_T11.prototype.fillSavedData = function()
{
	var usrData = theApp.userInfo.getUserData();
	
	
};

MS1005_T11.prototype.onWindowResult = function(result, awindow)
{	
	if("MS1005_W02" == awindow.getContainerId())
	{
		if(result == 1) //1이면
		{
			switch( awindow.btnGroupId)
			{
				case 'group7':
				case 'group8':
				{
					this.radioGp7.setSelectBtn(this.radioBtn19);
					this.radioGp8.setSelectBtn(this.radioBtn21);				
				}break;				
			}			
		}
	}
};

// 내용보기 버튼 클릭
//공통
MS1005_T11.prototype.onButton1Click = function(comp, info)
{
	
	if(afc.isIos)
	{
		//2018.03.09 HCY 메리츠측에서 약관 변환 완료
		var win = AWindow.createWindow('FD/window/MS1005_W03.lay','MS1005_W03');

		win.loadTitle = comp.parent.getChildren()[0].getText();	
		win.data = "https://www.meritzam.com/marketings/personal_info2.pdf";
		win.openAsDialog(this, '100%', '100%');
	}
	else		// Android
	{
		AppManager.openPdfModule("https://www.meritzam.com/marketings/personal_info2.pdf", comp.parent.getChildren()[0].getText());
	}
	
};

//선택동의서
MS1005_T11.prototype.onButton3Click = function(comp, info)
{
	
	if(afc.isIos)
	{
		//2018.03.09 HCY 메리츠측에서 약관 변환 완료
		var win = AWindow.createWindow('FD/window/MS1005_W03.lay','MS1005_W03');

		win.loadTitle = comp.parent.getChildren()[0].getText();	
		win.data = "https://www.meritzam.com/marketings/personal_info1.pdf";
		win.openAsDialog(this, '100%', '100%');
	}
	else		// Android
	{
		AppManager.openPdfModule("https://www.meritzam.com/marketings/personal_info1.pdf", comp.parent.getChildren()[0].getText());
	}
	
};

// 상품서비스 안내 방식 라디오 버튼 전체 선택 확인
MS1005_T11.prototype.checkRadionType = function()
{
	if( false == this.radioBtn8.getCheck())
		return false;
		
	if( false == this.radioBtn9.getCheck())
		return false;
				
	return true;
};

// 상품서비스 전체동의 
MS1005_T11.prototype.onRadioButton3Click = function(comp, info)
{	
	if( true == this.radioBtn1.getSelect() )
	{
		if( false == this.bWholeAgree)
		{
			this.bWholeAgree = true;
			this.radioBtn8.setCheck(true);
			this.radioBtn9.setCheck(true);
		}
		else
		{
			this.bWholeAgree = false;
			this.radioBtn8.setCheck(false);
			this.radioBtn9.setCheck(false);
		}
	}
	else
	{
		AToast.show('F1.개인(신용)정보 수집/이용을 동의 하지 않아 선택할 수 없습니다');
		this.radioBtn3.setCheck(false);
	}	
};

//상품서비스 안내방식 마켓타입 체크 가져오기
MS1005_T11.prototype.getCheckedMarketingType = function()
{
	var typeArr = new Array();
	
	if( true == this.radioBtn8.getCheck())
	{
		typeArr.push('문자서비스(sns)');
	}
	
	if( true == this.radioBtn9.getCheck())
	{
		typeArr.push('이메일');
	}
	
	return typeArr;
};


//상품서비스 안내 방식
MS1005_T11.prototype.makeValueCheckedMarketingType = function()
{
	var returnValue = '';
	
	if( true == this.radioBtn8.getCheck()) // 문자(sms)
	{
		returnValue += '20';
	}
	
	if( true == this.radioBtn9.getCheck()) // 이메일
	{
		returnValue += '30';
	}
	
	return returnValue;
}

// 개인정보수집/이용 개별 라디오버튼 클릭시 이벤트
MS1005_T11.prototype.onRadioButton7Click = function(comp, info)
{
	if( true == this.radioBtn1.getSelect() )
	{
		if( true == this.bWholeAgree)
		{
			this.bWholeAgree = false;
			this.radioBtn3.setCheck(false);
		}
		
		if( true == this.checkRadionType())
		{
			this.bWholeAgree = true;
			this.radioBtn3.setCheck(true);
		}
	}
	else
	{
		comp.setCheck(false);
		AToast.show('F1.개인(신용)정보 수집/이용을 동의 하지 않아 선택할 수 없습니다');
	}	
};

MS1005_T11.prototype.checkNormalCondition = function()
{
	//'<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">미동의시 계좌개설이 불가능합니다.</span>';
	if( false == this.radioBtn21.getSelect())
	{		
		this.openWindow('<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">E1.개인(신용)정보 수집<br>동의가 필요합니다.</span>');
		return false;
	}
	
	if( false == this.radioBtn19.getSelect())
	{		
		this.openWindow('<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">E3.개인(신용)정보 수집<br>동의가 필요합니다.</span>');
		return false;
	}
	
	if( false == this.radioBtn1.getSelect() && false == this.radioBtn2.getSelect())
	{
		AToast.show('F1.개인(신용)정보 수집/이용 동의/미동의 선택이 필요합니다.')
		return false;
	}
	
	if( false == this.radioBtn25.getSelect() && false == this.radioBtn26.getSelect())
	{
		AToast.show('F4.고유식별정보의 처리 동의/미동의 선택이 필요합니다.')
		return false;
	}
	
	if( false == this.radioBtn29.getSelect() && false == this.radioBtn30.getSelect())
	{
		AToast.show('F3.개인(신용)정보 제3자 제공 동의/미동의 선택이 필요합니다.')
		return false;
	}
	
	if(this.radioBtn1.getSelect() != this.radioBtn25.getSelect())
	{
		AToast.show('F1.개인(신용)정보 수집/이용과 F4.고유식별정보의 처리는<br>동일한 값을 선택해야 합니다.');
		return false;
	}
}


//개인 신용 정보를 등록하는 함수
MS1005_T11.prototype.sendSACMT289 = function(aType, editInfo)
{
	
	var thisObj = this;
	var f1Val = 0;
	if( true == this.radioBtn1.getSelect()) {
		f1Val = 1;
	}
	var f4Val = 0;
	if( true == this.radioBtn25.getSelect()) {
		f4Val = 1;
	}
	var f3Val = 0;
	if( true == this.radioBtn29.getSelect()) {
		f3Val = 1;
	}
	
	//AToast.show(f1Val);
	QryRequest.request('SACMT289',

	function(queryData){
		var inBlock1 = queryData.getBlockData('InBlock1')[0];		

		if( '1' == aType ) // 등록
		{
			inBlock1['D1처리구분'] = aType;
			inBlock1['D1실명확인번호'] = theApp.userInfo.getUserData('D1실명확인번호암호화');
			inBlock1['D1계좌번호'] = '';
			inBlock1['D1비밀번호'] = '';
			inBlock1['D1개인정보제공동의여부1'] = 1;    //e1
			inBlock1['D1개인정보제공동의여부2'] = 1;
			inBlock1['D1개인정보제공동의여부3'] = 1;		//e3
			inBlock1['D1개인정보제공동의여부4'] = 9;
			inBlock1['D1개인정보제공동의여부5'] = f1Val;		//f1
			inBlock1['D1항목값'] = thisObj.makeValueCheckedMarketingType();
			inBlock1['D1개인정보제공동의여부6'] = '';
			inBlock1['D2항목값'] = '';
			inBlock1['D1개인정보제공동의여부7'] = f3Val;		//f3
			inBlock1['D1개인정보제공동의여부8'] = f4Val;		//f4
			inBlock1['D1개인정보제공동의여부9'] = 9;
			inBlock1['D1개인정보제공동의여부10'] = 0; 		//f6
			inBlock1['D3항목값'] = '';
			inBlock1['D1개인정보제공동의여부11'] = 9;
			inBlock1['D1개인정보제공동의여부12'] = 8;
			inBlock1['D1개인정보제공동의여부13'] = 9;
			inBlock1['D1개인정보제공동의여부14'] = 9;
			inBlock1['D1개인정보제공동의여부15'] = 9;
			inBlock1['D1개인정보제공동의여부16'] = 8;
			inBlock1['D1개인정보제공동의여부17'] = 9;
			inBlock1['D1개인정보제공동의여부18'] = 9;
			inBlock1['D1개인정보제공동의여부19'] = 9;
			inBlock1['D1개인정보제공동의여부20'] = 9;
			inBlock1['D1개인정보제공동의여부21'] = 9;
			inBlock1['D1개인정보제공동의여부22'] = 9;
			inBlock1['D1개인정보제공동의여부23'] = 9;
			inBlock1['D1개인정보제공동의여부24'] = 9;
			inBlock1['D1개인정보제공동의여부25'] = 9;
			inBlock1['D1개인정보제공동의여부26'] = 9;
			inBlock1['D1개인정보제공동의여부27'] = 9;
			inBlock1['D1개인정보제공동의여부28'] = 9;
			inBlock1['D1개인정보제공동의여부29'] = 9;
			inBlock1['D1개인정보제공동의여부30'] = 9;
			inBlock1['D1개인정보제공동의여부31'] = 9;
			inBlock1['D1개인정보제공동의여부32'] = 9;
			inBlock1['D1개인정보제공동의여부33'] = 9;		
			inBlock1['D1개인정보제공동의여부34'] = 9;
			inBlock1['D1개인정보제공동의여부35'] = 9;
			inBlock1['D1개인정보제공동의여부36'] = 9;
			inBlock1['D1개인정보제공동의여부37'] = 9;
			inBlock1['D1개인정보제공동의여부38'] = 9;
			inBlock1['D1개인정보제공동의여부39'] = 9;
			inBlock1['D1개인정보제공동의여부40'] = 9;
			inBlock1['D1개인정보제공동의여부41'] = 9;
			inBlock1['D1개인정보제공동의여부42'] = 9;
			inBlock1['D1개인정보제공동의여부43'] = 9;
			inBlock1['D1개인정보제공동의여부44'] = 9;
			inBlock1['D1개인정보제공동의여부45'] = 9;
			inBlock1['D1개인정보제공동의여부46'] = 9;
			inBlock1['D1개인정보제공동의여부47'] = 9;
			inBlock1['D1개인정보제공동의여부48'] = 9;
			inBlock1['D1개인정보제공동의여부49'] = 9;
			inBlock1['D1개인정보제공동의여부50'] = 9;		
		}
		else // 정정
		{
			inBlock1['D1처리구분'] = aType;
			inBlock1['D1실명확인번호'] = theApp.userInfo.getUserData('D1실명확인번호암호화');
			inBlock1['D1계좌번호'] = editInfo['D1계좌번호'];
			inBlock1['D1비밀번호'] = editInfo['D1비밀번호'];
			inBlock1['D1개인정보제공동의여부1'] = 1;// 선택한 값
			inBlock1['D1개인정보제공동의여부2'] = editInfo['D1개인정보제공동의여부2'];
			inBlock1['D1개인정보제공동의여부3'] = 1;// 선택한 값
			inBlock1['D1개인정보제공동의여부4'] = editInfo['D1개인정보제공동의여부4'];
			inBlock1['D1개인정보제공동의여부5'] = f1Val;// 선택한 값
			inBlock1['D1항목값'] = thisObj.makeValueCheckedMarketingType();
			inBlock1['D1개인정보제공동의여부6'] = editInfo['D1개인정보제공동의여부6'];
			inBlock1['D2항목값'] = editInfo['D2항목값'];
			inBlock1['D1개인정보제공동의여부7'] = f3Val;		//f3
			inBlock1['D1개인정보제공동의여부8'] = f4Val;		//f4
			inBlock1['D1개인정보제공동의여부9'] = editInfo['D1개인정보제공동의여부9'];
			inBlock1['D1개인정보제공동의여부10'] = editInfo['D1개인정보제공동의여부10'];//f6Val;		
			inBlock1['D3항목값'] = editInfo['D3항목값'];
			inBlock1['D1개인정보제공동의여부11'] = editInfo['D1개인정보제공동의여부11'];
			inBlock1['D1개인정보제공동의여부12'] = editInfo['D1개인정보제공동의여부12'];
			inBlock1['D1개인정보제공동의여부13'] = editInfo['D1개인정보제공동의여부13'];
			inBlock1['D1개인정보제공동의여부14'] = editInfo['D1개인정보제공동의여부14'];
			inBlock1['D1개인정보제공동의여부15'] = editInfo['D1개인정보제공동의여부15'];
			inBlock1['D1개인정보제공동의여부16'] = editInfo['D1개인정보제공동의여부16'];
			inBlock1['D1개인정보제공동의여부17'] = editInfo['D1개인정보제공동의여부17'];
			inBlock1['D1개인정보제공동의여부18'] = editInfo['D1개인정보제공동의여부18'];
			inBlock1['D1개인정보제공동의여부19'] = editInfo['D1개인정보제공동의여부19'];
			inBlock1['D1개인정보제공동의여부20'] = editInfo['D1개인정보제공동의여부20'];
			inBlock1['D1개인정보제공동의여부21'] = editInfo['D1개인정보제공동의여부21'];
			inBlock1['D1개인정보제공동의여부22'] = editInfo['D1개인정보제공동의여부22'];
			inBlock1['D1개인정보제공동의여부23'] = editInfo['D1개인정보제공동의여부23'];
			inBlock1['D1개인정보제공동의여부24'] = editInfo['D1개인정보제공동의여부24'];
			inBlock1['D1개인정보제공동의여부25'] = editInfo['D1개인정보제공동의여부25'];
			inBlock1['D1개인정보제공동의여부26'] = editInfo['D1개인정보제공동의여부26'];
			inBlock1['D1개인정보제공동의여부27'] = editInfo['D1개인정보제공동의여부27'];
			inBlock1['D1개인정보제공동의여부28'] = editInfo['D1개인정보제공동의여부28'];
			inBlock1['D1개인정보제공동의여부29'] = editInfo['D1개인정보제공동의여부29'];
			inBlock1['D1개인정보제공동의여부30'] = editInfo['D1개인정보제공동의여부30'];
			inBlock1['D1개인정보제공동의여부31'] = editInfo['D1개인정보제공동의여부31'];
			inBlock1['D1개인정보제공동의여부32'] = editInfo['D1개인정보제공동의여부32'];
			inBlock1['D1개인정보제공동의여부33'] = editInfo['D1개인정보제공동의여부33'];		
			inBlock1['D1개인정보제공동의여부34'] = editInfo['D1개인정보제공동의여부34'];
			inBlock1['D1개인정보제공동의여부35'] = editInfo['D1개인정보제공동의여부35'];
			inBlock1['D1개인정보제공동의여부36'] = editInfo['D1개인정보제공동의여부36'];
			inBlock1['D1개인정보제공동의여부37'] = editInfo['D1개인정보제공동의여부37'];
			inBlock1['D1개인정보제공동의여부38'] = editInfo['D1개인정보제공동의여부38'];
			inBlock1['D1개인정보제공동의여부39'] = editInfo['D1개인정보제공동의여부39'];
			inBlock1['D1개인정보제공동의여부40'] = editInfo['D1개인정보제공동의여부40'];
			inBlock1['D1개인정보제공동의여부41'] = editInfo['D1개인정보제공동의여부41'];
			inBlock1['D1개인정보제공동의여부42'] = editInfo['D1개인정보제공동의여부42'];
			inBlock1['D1개인정보제공동의여부43'] = editInfo['D1개인정보제공동의여부43'];
			inBlock1['D1개인정보제공동의여부44'] = editInfo['D1개인정보제공동의여부44'];
			inBlock1['D1개인정보제공동의여부45'] = editInfo['D1개인정보제공동의여부45'];
			inBlock1['D1개인정보제공동의여부46'] = editInfo['D1개인정보제공동의여부46'];
			inBlock1['D1개인정보제공동의여부47'] = editInfo['D1개인정보제공동의여부47'];
			inBlock1['D1개인정보제공동의여부48'] = editInfo['D1개인정보제공동의여부48'];
			inBlock1['D1개인정보제공동의여부49'] = editInfo['D1개인정보제공동의여부49'];
			inBlock1['D1개인정보제공동의여부50'] = editInfo['D1개인정보제공동의여부50'];		
		}

		queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
		// 			queryData.printQueryData();
	},

	function(queryData){
		var errCode = this.getLastError('errCode');
		if( errCode >= 1000)
		{
			theApp.getErrMsg(thisObj,this);
		}
		else if( queryData)
		{
			queryData.printQueryData();
			var outBlock1 = queryData.getBlockData('OutBlock1')[0];

			// 633 다시 불러오기
			theApp.getUserInfo(theApp.userInfo.getUserData('D1실명확인번호암호화'), function(success){
				if(success) 
				{
					theApp.saveStep('6', function(){
						thisObj.getContainer().nextView();
					});	//화면이동
				}
			});
		}		
	},

	null, '5');// DB에 값을 입력하는 경우에는 해더 펑션키 5
}


 
// 다음 버튼 클릭
MS1005_T11.prototype.onButtonGoNext = function(comp, info)
{
	//temp code
	
	if( false === this.checkNormalCondition())
		return;
		
	if( true == this.radioBtn1.getSelect())
	{
		if( '' == this.makeValueCheckedMarketingType())
		{
			AToast.show('상품서비스 안내를 위한 연락방식 중 \n하나 이상을 선택해주세요');
			return;
		}		
	}
	var thisObj = this;	
	
	//--------------------------------
	//개인 신용 정보를 조회하는 함수
	QryRequest.request('SACMT289',
		function(queryData)
		{
			var inBlock1 = queryData.getBlockData('InBlock1')[0];				
			inBlock1['D1처리구분'] = "3";
			inBlock1['D1실명확인번호'] = theApp.userInfo.getUserData('D1실명확인번호암호화');
			queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
			//queryData.printQueryData();
		},
		function(queryData)
		{		
			var errCode = this.getLastError('errCode');
			
			if( queryData)
			{	
				var type = "";
				queryData.printQueryData();
				
				var inBlockResult = queryData.getBlockData('InBlock1')[0];
				if( errCode == '0036') {
					type = "1";
				} else if(errCode == '0136') {
					type = "2";
				}
					
				thisObj.sendSACMT289(type, inBlockResult);
			}
			else
			{
				theApp.getErrMsg(thisObj,this);
				//alert(this.printLastError());
			}	
			
		}		
		, null, 'C');	// DB에서 조회하는 경우 해더 펑션키 C
	
};

// 이전 버튼 클릭
MS1005_T11.prototype.onButtonGoBack = function(comp, info)
{
	this.resetPage();
	
	//TODO:edit here
	this.getContainer().beforeView();
};


MS1005_T11.prototype.openWindow = function(msg)
{
	//에러메세지;
	var win = AWindow.createWindow('FD/window/MS1005_W02.lay','MS1005_W02');
	win.infoMsg = msg;
	win.btnText = "확인";
	win.openAsDialog(this);
};



//E3
MS1005_T11.prototype.onRadioGroup7Change = function(comp, info)
{	
	if( true == this.radioBtn19.getSelect())
	{
		this.radioGp7.setSelectBtn(this.radioBtn19);
		this.radioGp8.setSelectBtn(this.radioBtn21);
	}
	else
	{
		AToast.show('E3.미동의시 개좌개설이 불가능합니다.');
	}
};
//E1
MS1005_T11.prototype.onRadioGroup8Change = function(comp, info)
{
	if( true == this.radioBtn21.getSelect())
	{
		this.radioGp7.setSelectBtn(this.radioBtn19);
		this.radioGp8.setSelectBtn(this.radioBtn21);
	}
	else
	{
		AToast.show('E1.미동의시 개좌개설이 불가능합니다.');
	}
};

//F1 개인신용정보수집/이용(상품서비스안내)
MS1005_T11.prototype.onRadioGroup1Change = function(comp, info)
{
	if( true == this.radioBtn1.getSelect())
	{
		this.radioGp1.setSelectBtn(this.radioBtn1);
	}
	else
	{
		this.bWholeAgree = false;
		this.radioGp1.setSelectBtn(this.radioBtn2);
		this.radioBtn3.setCheck(false);
		this.radioBtn8.setCheck(false);
		this.radioBtn9.setCheck(false);
	}
};

MS1005_T11.prototype.resetPage = function()
{

	this.bWholeAgree = false;
	this.radioBtn3.setCheck(false);
	this.radioBtn8.setCheck(false);
	this.radioBtn9.setCheck(false);
	
	this.cWholeAgree = false;
	
	this.radioGp1.setSelectBtn(this.radioBtn42);
	this.radioGp7.setSelectBtn(this.radioBtn36);
	this.radioGp8.setSelectBtn(this.radioBtn35);
	this.radioGp10.setSelectBtn(this.radioBtn43);
	this.radioGp12.setSelectBtn(this.radioBtn45);
};