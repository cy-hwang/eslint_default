
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_W04(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	this.url = 'FD/window/MS1005_W04.lay';

	this.name = null;
}
afc.extendsClass(MS1005_W04, BaseWindow);


MS1005_W04.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	this.btn = this.findCompById('Button2');
	
	this.onInit();
};

MS1005_W04.prototype.onInit = function()
{
	this.checkBox1 = this.findCompById('CheckBox1');
	this.checkBox2 = this.findCompById('CheckBox2');
	this.checkBox3 = this.findCompById('CheckBox3');
	
	this.radioGroup8 = this.findCompById('RadioGroup8');
	this.radioGroup1 = this.findCompById('RadioGroup1');
	
	this.radioBtn1 = this.findCompById('RadioButton1');
	this.radioBtn2 = this.findCompById('RadioButton2');
	this.radioBtn3 = this.findCompById('RadioButton3');
	this.radioBtn4 = this.findCompById('RadioButton4');
};

// 닫기
MS1005_W04.prototype.onButtonClose = function(comp, info)
{
	this.close(0);
};

MS1005_W04.prototype.openWindow = function(text)
{
	var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');
	win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">' + text + '</span>';
	win.openAsDialog(this);
};

// 확인
MS1005_W04.prototype.onButtonApply = function(comp, info)
{
	if( false == this.CheckValid())
		return;
		
	this.send_SACMT188();
};

MS1005_W04.prototype.send_SACMT188 = function()
{
	var thisObj = this;
	
	QryRequest.request('SACMT188',
	
	function(queryData)
	{
		var inBlock1 = queryData.getBlockData('InBlock1');
		inBlock1[0] ={
						"D1처리구분":1,
						"D1실명확인번호": theApp.userInfo.getUserData('D1실명확인번호암호화'),
						"D1질문1":0,
						"D1질문2":0,
						"D1질문3":0,
						"D1질문4":0,
						"D1질문5":0,
						"D1질문6":1,
						"D1질문7":0,
						"D1질문8":0,
						"D1구분문자9":0,
						"D1구분문자10":0,
						"D1설명1":''
					};
			queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
	},
	
	function(queryData)
	{	
		var errCode = this.getLastError('errCode');
			
		if( errCode >= 1000)
		{
			theApp.getErrMsg(thisObj, this);
		} else if( errCode == '0104')
		{
			thisObj.resend_SACMT188();
		}
		else if(queryData)
		{
// 			queryData.printQueryData();
			
			thisObj.close(1);
		}
		else this.printLastError();
	});
};

MS1005_W04.prototype.onCheckBox1Click = function(comp, info)
{
	var compId = comp.getComponentId();	
	
	if( 'CheckBox2' ==  compId )
	{
		if( true == this.checkBox2.getCheck() )
		{
			AToast.show('통장 대여 및 신용등급 상향 목적의 개설 요청 받은 고객은 개설이 불가능 합니다.');
		}
	}
	else if( 'CheckBox3' ==  compId )
	{
		if( true == this.checkBox3.getCheck() )
		{
			AToast.show('법인으로부터 고용 등을 이유로 계좌개설 위임 받은 고객은 개설이 불가능 합니다.');
		}
	}
	
};

MS1005_W04.prototype.onRadioGroup8Change = function(comp, info)
{	
	if(this.radioGroup8.getSelectBtn().compId == 'RadioButton3')
	{
		AToast.show('타인으로부터 통장대여 요청을 받은 사실이 있는 고객은 개설이 불가능 합니다.');	
	}
};

MS1005_W04.prototype.onRadioGroup1Change = function(comp, info)
{
	if(this.radioGroup1.getSelectBtn().compId == 'RadioButton1')
	{
		AToast.show('타인으로부터 신용등급상향, 대출 등의 목적으로 통장개설을 요청받은 사실이 있는 고객은 개설이 불가능 합니다.');	
	}
};


MS1005_W04.prototype.CheckValid = function()
{
	if( false == this.checkBox1.getCheck() )
	{
		this.openWindow('재태크 등 금융거래ㆍ주식을 포함한 금융상품 거래 및 투자 목적으로만 개설이 가능합니다.');
		return false;
	}
	
	if( true == this.checkBox2.getCheck() )
	{
		this.openWindow('통장 대여 및 신용등급 상향 목적의 개설 요청 받은 고객은 개설이 불가능 합니다.');
		return false;
	}
	
	if( true == this.checkBox3.getCheck() )
	{
		this.openWindow('법인으로부터 고용 등을 이유로 계좌개설 위임 받은 고객은 개설이 불가능 합니다.');
		return false;
	}
	
	if(false == this.radioBtn3.getSelect() && false == this.radioBtn4.getSelect())
	{	
		this.openWindow('2번 문항에 예 / 아니오 를 선택해주세요');
		return false;
	}
	
	if(false == this.radioBtn1.getSelect() && false == this.radioBtn2.getSelect())
	{	
		this.openWindow('3번 문항에 예 / 아니오 를 선택해주세요');
		return false;
	}
	
	if(true == this.radioBtn3.getSelect())//if(this.radioGroup8.getSelectBtn().compId == 'RadioButton3')
	{
		this.openWindow('타인으로부터 통장대여 요청을 받은 사실이 있는 고객은 개설이 불가능 합니다.');
		return false;
	}
	
	if(true == this.radioBtn1.getSelect())//if(this.radioGroup1.getSelectBtn().compId == 'RadioButton1')
	{		
		this.openWindow('타인으로부터 신용등급상향, 대출 등의 목적으로 통장개설을 요청받은 사실이 있는 고객은 개설이 불가능 합니다.');
		return false;
	}
	
	return true;
}

MS1005_W04.prototype.resend_SACMT188 = function()
{
	var thisObj = this;
	
	QryRequest.request('SACMT188',
	
	function(queryData)
	{
		var inBlock1 = queryData.getBlockData('InBlock1');
		inBlock1[0] ={
						"D1처리구분":2,
						"D1실명확인번호": theApp.userInfo.getUserData('D1실명확인번호암호화'),
						"D1질문1":0,
						"D1질문2":0,
						"D1질문3":0,
						"D1질문4":0,
						"D1질문5":0,
						"D1질문6":1,
						"D1질문7":0,
						"D1질문8":0,
						"D1구분문자9":0,
						"D1구분문자10":0,
						"D1설명1":''
					};
			queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
	},
	
	function(queryData)
	{	
		var errCode = this.getLastError('errCode');
			
		if( errCode >= 1000)
		{
			theApp.getErrMsg(thisObj, this);
		} else if( errCode == '0104')
		{
			thisObj.resend_SACMT188();
		}
		else if(queryData)
		{
// 			queryData.printQueryData();
			
			thisObj.close(1);
		}
		else this.printLastError();
	},null,'5');
};