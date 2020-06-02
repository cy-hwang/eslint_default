
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_V06()
{
	AView.call(this);

}
afc.extendsClass(MS1005_V06, AView);


MS1005_V06.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.idImg = this.findCompById('IdImg');

	this.driveLbl = this.findCompById('DriveLbl');
	this.nameLbl = this.findCompById('NameLbl');
	this.idLbl = this.findCompById('IdLbl');
	this.dateLbl = this.findCompById('DateLbl');
	this.pwLbl = this.findCompById('PwLbl');
	this.dateView = this.findCompById("DateView");
	
	this.driveTxf = this.findCompById('DriveTxf');	//운전면허증
	this.nameTxf = this.findCompById('NameTxf'); 	// 이름
	this.idTxf = this.findCompById('IdTxf');		// 주민등록번호
	this.dateTxf = this.findCompById('DateTxf');	// 발급일
	this.pwTxf = this.findCompById('PwTxf');		// 암호일련번호
	
	this.idTxf.setReadOnly(true);
	this.driveView = this.findCompById('DriveView');
	this.pwView = this.findCompById('PwView');
	
	this.lbl1 = this.findCompById('Label1');	
	this.lbl2 = this.findCompById('Label5');
	
	this.cancelBtn1 = this.findCompById('CancelBtn1');
	this.cancelBtn2 = this.findCompById('CancelBtn2');
	this.cancelBtn4 = this.findCompById('CancelBtn4');
	this.cancelBtn5 = this.findCompById('CancelBtn5');
	
	this.cancelBtn1.$ele.hide();
	this.cancelBtn2.$ele.hide();
	this.cancelBtn4.$ele.hide();
	this.cancelBtn5.$ele.hide();
	
	this.driveView.$ele.show();
	this.pwView.$ele.show();
	
	this.validDrive = true;
	this.validName = true;
	this.validId = true;
	this.validDate = true;
	this.validPw = true;
	
	this.idCard = '';
	this.delegator = null;
		
	if(afc.isAndroid && parseFloat(afc.strAndVer) < 5.0)
    {
        this.$ele.removeClass('BG_02');
        this.$ele.addClass('BG_02_NR');
    }
};

MS1005_V06.prototype.setDelegator = function(delegator) {
	this.delegator = delegator;
}


//OCR 촬영 결과 기반 데이터 입력
MS1005_V06.prototype.setData = function(certInfo, image)
{
	var thisObj = this;
	thisObj.idImg.setImage("data:image/png;base64,"+image);
	thisObj.idCard = certInfo[0].trim();
	
	if( '자동차운전면허증' == certInfo[0].trim()) {
				
		thisObj.driveTxf.setText(certInfo[4]);
		thisObj.nameTxf.setText(certInfo[1]);
		thisObj.idTxf.setText(certInfo[9]);
		thisObj.dateTxf.setText(certInfo[3]);
		thisObj.pwTxf.setText(certInfo[8].replace(/\s/g, ''));
		thisObj.dateView.$ele.removeClass("line_box_sub");
		
		thisObj.lbl1.show(AComponent.INVISIBLE);	
		thisObj.lbl2.show(AComponent.VISIBLE);	
		
		if(thisObj.driveTxf.getText().length > 0)
			this.cancelBtn1.$ele.show();
			
		if(thisObj.nameTxf.getText().length > 0)
			this.cancelBtn2.$ele.show();
					
		if(thisObj.dateTxf.getText().length > 0)
			this.cancelBtn4.$ele.show();
			
		if(thisObj.pwTxf.getText().length > 0)
			this.cancelBtn5.$ele.show();
		
	} else {
	
		thisObj.nameTxf.setText(certInfo[1]);
		thisObj.idTxf.setText(certInfo[9]);
		thisObj.dateTxf.setText(certInfo[3]);
		thisObj.driveView.$ele.hide();
		thisObj.pwView.$ele.hide();
		thisObj.dateView.$ele.addClass("line_box_sub");
		
		thisObj.lbl1.show(AComponent.VISIBLE);
		thisObj.lbl2.show(AComponent.INVISIBLE);
		
		if(thisObj.nameTxf.getText().length > 0)
			this.cancelBtn2.$ele.show();
			
		if(thisObj.dateTxf.getText().length > 0)
			this.cancelBtn4.$ele.show();
	}
};

MS1005_V06.prototype.getData = function()
{
	var txfData = new Array(5);
	
	txfData[0] = this.driveTxf.getText();					//면허번호
	txfData[1] = this.nameTxf.getText();					//이름
	txfData[2] = this.idTxf.getText().replace(/-/g, '');	//주민등록번호
	txfData[3] = this.dateTxf.getText();					//발급일
	txfData[4] = this.pwTxf.getText();						//암호일련번호
	
	return txfData;
}

//신분증 재촬영 버튼
MS1005_V06.prototype.onPhotoBtnClick = function(comp, info)
{
	this.delegator.OpenOCR();
};

//항목위치 안내 버튼
MS1005_V06.prototype.onGuideBtnClick = function(comp, info)
{	
	var win = AWindow.createWindow('FD/window/MS1005_W16.lay', 'MS1005_W16');
	if( '자동차운전면허증' == this.idCard ) {
		win.title = '운전면허증';
	} else {
		win.title = this.idCard;
	}
	win.openAsDialog(this);
};


MS1005_V06.prototype.onIdTxfBlur = function(comp, info)
{
	comp.setText(Utils.makeIdNoForm(comp.getText()));
};


//cancel 버튼 기능 구현 > onCancelBtn1Click ~ onPwTxfChange
MS1005_V06.prototype.onCancelBtn1Click = function(comp, info)
{
	this.driveTxf.setText("");
	this.cancelBtn1.$ele.hide();
};

MS1005_V06.prototype.onCancelBtn2Click = function(comp, info)
{
	this.nameTxf.setText("");
	this.cancelBtn2.$ele.hide();
};

MS1005_V06.prototype.onCancelBtn4Click = function(comp, info)
{
	this.dateTxf.setText("");
	this.cancelBtn4.$ele.hide();
};

MS1005_V06.prototype.onCancelBtn5Click = function(comp, info)
{
	this.pwTxf.setText("");
	this.cancelBtn5.$ele.hide();
};

MS1005_V06.prototype.onDriveTxfChange = function(comp, info)
{
	var driveTxt = comp.getText();
	this.driveTxf.removeClass('TF_03');

	if(driveTxt.length == 0) {
		this.cancelBtn1.$ele.hide();
	} else {
		this.cancelBtn1.$ele.show();		
	}
};

MS1005_V06.prototype.onNameTxfChange = function(comp, info)
{
	var nameTxt = comp.getText();
	this.nameTxf.removeClass('TF_03');

	if(nameTxt.length == 0) {
		this.cancelBtn2.$ele.hide();
	} else {
		this.cancelBtn2.$ele.show();		
	}

};

MS1005_V06.prototype.onDateTxfChange = function(comp, info)
{
	var dateTxt = comp.getText();
	this.dateTxf.removeClass('TF_03');
	
	if(dateTxt.length == 0) {
		this.cancelBtn4.$ele.hide();
	} else {
		this.cancelBtn4.$ele.show();		
	}
};


MS1005_V06.prototype.onPwTxfChange = function(comp, info)
{
	var pwTxt = comp.getText();
	this.pwTxf.removeClass('TF_03');
	
	if(pwTxt.length == 0) {
		this.cancelBtn5.$ele.hide();
	} else {
		this.cancelBtn5.$ele.show();		
	}
};

MS1005_V06.prototype.onDriveTxfActionDown = function(comp, info)
{
	if(!this.validDrive) {
		this.driveTxf.removeClass('TF_03');
		this.validDrive = true;
	}
};

MS1005_V06.prototype.onNameTxfActionDown = function(comp, info)
{
	if(!this.validName) {
		this.nameTxf.removeClass('TF_03');
		this.validName = true;
	}
};

MS1005_V06.prototype.onDateTxfActionDown = function(comp, info)
{
	if(!this.validDate) {
		this.dateTxf.removeClass('TF_03');
		this.validDate = true;
	}
};

MS1005_V06.prototype.onPwTxfActionDown = function(comp, info)
{
	if(!this.validPw) {
		this.pwTxf.removeClass('TF_03');
		this.validPw = true;
	}
};
