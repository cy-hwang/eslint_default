
/**
Constructor
Do not call Function in Constructor.
*/

function FD5008_W01(containerId)
{
	BaseWindow.call(this, containerId);

	this.selected = 0;
	this.sDateTime = '';
	this.eDateTime = '';
}
afc.extendsClass(FD5008_W01, BaseWindow);


FD5008_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	this.onInit();
	this.btnGrp = this.findCompByGroup("BtnGrp");
	this.radioGrp = this.findCompById("RadioGroup1");
	this.sDate = this.findCompById("DatePicker1");
	this.eDate = this.findCompById("DatePicker2");
	
	this.radioGrp.setSelectBtn(this.btnGrp[this.selected]);
	
	
	if(this.sDateTime == ''){
		if(this.selected == 3) {
			this.sDate.setValue(this.sDateTime);
			this.eDate.setValue(this.eDateTime);
		} else {
			this.sDate.setValue(MetaInfo.fnGetToday());
			this.eDate.setValue(MetaInfo.fnGetToday());
		}
	}else{
		this.sDate.setValue(this.sDateTime);
		this.eDate.setValue(this.eDateTime);
	}
	
		
	
	
	this.setDatePicker();
};


//최초 실행
FD5008_W01.prototype.onInit = function()
{
	this.moveToCenter();
};

FD5008_W01.prototype.onCloseBtnClick = function(comp, info)
{
	this.close(0);
};

FD5008_W01.prototype.onOkBtnClick = function(comp, info)
{
	this.close({"value": this.selected, "sDate": this.sDate.getValue(), "eDate": this.eDate.getValue()});
};

FD5008_W01.prototype.setDatePicker = function()
{
	/*//시간외주문
	if(this.selected == 3) {
		this.sDate.enable(true);
		this.eDate.enable(true);
		
		this.sDate.removeClass('dis');
		this.eDate.removeClass('dis');
	//전체, 매수, 매도
	} else {
		this.sDate.enable(false);
		this.eDate.enable(false);
		
		this.sDate.addClass('dis');
		this.eDate.addClass('dis');
	}*/
	
	this.sDate.enable(true);
	this.eDate.enable(true);

	this.sDate.removeClass('dis');
	this.eDate.removeClass('dis');
};

FD5008_W01.prototype.onRadioButtonClick = function(comp, info)
{
	this.selected = parseInt(comp.compId.replace("RadioButton", ""), 10);
	this.setDatePicker();
};
