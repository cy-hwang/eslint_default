
/**
Constructor
Do not call Function in Constructor.
*/

//신규가입 or 계약이전 
function FD5001_V01()
{
	AView.call(this);

	//TODO:edit here
}
afc.extendsClass(FD5001_V01, AView);



FD5001_V01.prototype.init = function(context, evtListener)
{

	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	this.checkBox1 = this.findCompById('CheckBox1');
	this.checkBox2 = this.findCompById('CheckBox2');
	
};

	
//화면이 사라지고 난 후 초기화 
FD5001_V01.prototype.onArrInit = function()
{		
	this.checkBox1.setCheck(false);
	this.checkBox2.setCheck(false);
	
};

FD5001_V01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	var win = AWindow.createWindow('FD/window/FD5001_W06.lay', 'FD5001_W06');
	win.openAsDialog(this, 580, 680);
	
}

//화면이 사라짐 
FD5001_V01.prototype.onWillDeactive = function(reload)
{	
	AView.prototype.onWillDeactive.call(this, reload);
	this.onArrInit();
};

//신규가입 팝업
FD5001_V01.prototype.onCheckBox1Click = function(comp, info)
{

	//TODO:edit here
	var param = {
		"title" : "신규가입",
		"contents" : '신규가입이란 <br>' + '메리츠자산운용에 연금저축계좌를 <br>' + '신규로 개설하는 경우입니다.',
		"btnText" : '확인',
		"returnType" : "2",
		"returnData" : "check1"
	};

	
	
	if(this.checkBox1.getCheck() == true){
		PensionCommon.oneBtnPopup(this,param);
	}else{
		this.checkBox1.setCheck(true);
	}

};

//팝업 result
FD5001_V01.prototype.callbackPensionPopup = function(returnData,resultData)
{

	//TODO:edit here
	if(returnData == 'check1'){
		if(resultData == 0){
			this.checkBox1.setCheck(false);	
		}else{
			if(this.checkBox2.getCheck() == true){
				this.checkBox2.setCheck(false);
			}
		}
		
	}else{
		if(resultData == 0){
			this.checkBox2.setCheck(false);
		}else{
			if(this.checkBox1.getCheck() == true){
				this.checkBox1.setCheck(false);
			}
		}
		
	}
	
};


//계좌이전 팝업
FD5001_V01.prototype.onCheckBox2Click = function(comp, info)
{

	//TODO:edit here
	
	var param = {
		"title" : "계약이전",
		"contents" : '계약이전(타금융기관에서 이전하는 경우)이란<br>' +  '타금융회사의 연금상품을<br>'+ '메리츠자산운용으로<br>'+ '이전(이체)하는 경우입니다.',
		"btnText" : "확인",
		"returnType" : "2",
		"returnData" : "check2"
	};

	
	
	if(this.checkBox2.getCheck() == true){
		PensionCommon.oneBtnPopup(this,param);
	}else{
		this.checkBox2.setCheck(true);
	}
	

};


//다음 이동 
FD5001_V01.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here

	
	var thisObj = this;
	var cont = thisObj.getContainer();
	if(this.checkBox1.getCheck() == true){		
		cont.tvManager.getActiveView().tbvManager.changeTab('FD5001_V02', false);
	}else if(this.checkBox2.getCheck() == true){
		cont.tvManager.changeTab('FD5001_T02', false);
	}

};
