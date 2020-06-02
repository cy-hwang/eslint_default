
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_W10(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD3202_W10.lay';

	//TODO:edit here

}
afc.extendsClass(FD3202_W10, BaseWindow);


FD3202_W10.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here

};

FD3202_W10.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	// 윈도우 창 그냥 닫기
	this.close(0);

};

FD3202_W10.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.checkBox1 = this.findCompById('CheckBox1');
	
	this.btnConfirm = this.findCompById('BtnConfirm');
	
	this.txtRequestMoney = this.findCompById('txtRequestMoney');
	
	this.btnConfirm.enable(false); // // 확인버튼 비활성화		
	
}

FD3202_W10.prototype.onCheckBox1Click = function(comp, info)
{

	//TODO:edit here
	
	// 체크박스가 체크될 경우에만 내용팝업 올림
	if(this.checkBox1.getCheck()){
		var win = AWindow.createWindow('FD/window/FD3202_W11.lay','FD320211');

		win.bankInfo = this.bankInfo;
		win.openAsDialog(this);
	}else{
		this.btnConfirm.enable(false); // 확인버튼 비활성화
	}

};

FD3202_W10.prototype.onWindowResult = function(result, windowObj)
{
	if(windowObj.containerId == 'FD320211'){
		if(result == 1){
			this.checkBox1.setCheck(true);
			this.btnConfirm.enable(true); // 확인버튼 활성화
		}else{
			this.checkBox1.setCheck(false);
		}
	}
}



FD3202_W10.prototype.onBtnConfirmClick = function(comp, info)
{

	//TODO:edit here
	if(this.validCheck()){
		this.sendDataMonRequest();
	}else{
		
	}

};

FD3202_W10.prototype.sendDataMonRequest = function(comp, info)
{		
	var thisObj = this
	var cont = thisObj.opener.getContainer() // 연결된 최상위 뷰		
	
	thisObj.txtReqMoney = thisObj.txtRequestMoney.getText();
						
	cont.monthRequestJoin(thisObj, function(oBlock){
		if(oBlock){
			if(oBlock == "0210"){
				theApp.alert(
					[	 
						'월 지급식 약정 등록이 ','<br>',
						'완료되었습니다.','<br>',
						,' '
					].join('')
					,
					function()
					{			
						thisObj.monthPaySuccess();
					}
					,''
				);
			}
		}
	});	
};

// 월 지급식 약정 등록 성공 후 프로세스
FD3202_W10.prototype.monthPaySuccess = function()
{
	this.close(1);
};

FD3202_W10.prototype.validCheck = function()
{

	//TODO:edit here
	if(!this.txtRequestMoney.getText()){
		AToast.show("신청금액을 입력하세요");
		this.txtRequestMoney.addClass('active');
		return false;
	}
	
	return true;

};

FD3202_W10.prototype.ontxtRequestMoneyBlur = function(comp, info)
{

	//TODO:edit here
	this.txtRequestMoney.removeClass('active');
};

