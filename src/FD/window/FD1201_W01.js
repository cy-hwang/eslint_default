
/**
Constructor
Do not call Function in Constructor.
*/

function FD1201_W01(containerId)
{
	BaseWindow.call(this, containerId);

	this.selected = 0;
	this.sDateTime = '';
	this.eDateTime = '';
}
afc.extendsClass(FD1201_W01, BaseWindow);


FD1201_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	this.onInit();
	this.btnGrp = this.findCompByGroup("BtnGrp");
	this.radioGrp = this.findCompById("RadioGroup1");
	this.sDate = this.findCompById("DatePicker1");
	this.eDate = this.findCompById("DatePicker2");
	
	this.radioGrp.setSelectBtn(this.btnGrp[this.selected]);
	
	//if(this.selected == 3) {
	if(1){
		this.sDate.setValue(this.sDateTime);
		this.eDate.setValue(this.eDateTime);
	} else {
		this.sDate.setValue(MetaInfo.fnGetToday());
		this.eDate.setValue(MetaInfo.fnGetToday());
	}
	
	this.setDatePicker();
};


//최초 실행
FD1201_W01.prototype.onInit = function()
{
	this.moveToCenter();
};

FD1201_W01.prototype.onCloseBtnClick = function(comp, info)
{
	this.close(0);
};

FD1201_W01.prototype.onOkBtnClick = function(comp, info)
{
	this.close({"value": this.selected, "sDate": this.sDate.getValue(), "eDate": this.eDate.getValue()});
};

FD1201_W01.prototype.setDatePicker = function()
{
	//시간외주문
	//if(this.selected == 3) {
	if(1){
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
	}
};

FD1201_W01.prototype.onRadioButtonClick = function(comp, info)
{
	this.selected = parseInt(comp.compId.replace("RadioButton", ""), 10);
	this.setDatePicker();
};
