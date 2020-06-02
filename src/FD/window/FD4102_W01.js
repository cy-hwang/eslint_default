
/**
Constructor
Do not call Function in Constructor.
*/
function FD4102_W01(containerId)
{
	AWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD4102_W01.lay';

	//TODO:edit here

}
afc.extendsClass(FD4102_W01, AWindow);


FD4102_W01.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);

	this.button1 = this.findCompById('Button1');
	this.button2 = this.findCompById('Button2');
	this.button3 = this.findCompById('Button3');
	this.button4 = this.findCompById('Button4');
	
	this.radioGroup2 = this.findCompById('RadioGroup2');
	this.radioButton5 = this.findCompById('RadioButton5');
	this.radioButton6 = this.findCompById('RadioButton6');
	this.radioButton7 = this.findCompById('RadioButton7');
	this.radioButton9 = this.findCompById('RadioButton9');
	this.radioButton8 = this.findCompById('RadioButton8');
	this.radioGroup2.setSelectBtn(this.radioButton5);
	
	this.datePicker1 = this.findCompById('DatePicker1');
	this.datePicker2 = this.findCompById('DatePicker2');
	
	this.datePicker1.setValue(Utils.yyyymmdd(new Date()));
	this.datePicker2.setValue(Utils.yyyymmdd(new Date()));
	
	this.view6 = this.findCompById('View6');
	
	this.startDate = null;
	this.endDate = null;
	
	this.text1 = null;
	
	if(Array.isArray(this.dayType)) {
		switch(this.dayType[0]) {
			case 0:
				this.onButton1Click();
				break;
			case 1:
				this.onButton2Click();
				break;
			case 2:
				this.onButton3Click();
				break;
			case 3:
				this.onButton4Click();
				this.datePicker1.setValue(this.date[0]);
				this.datePicker2.setValue(this.date[1]);
				break;
		}
		switch(this.dayType[1]) {
			case 0:
				this.radioGroup2.setSelectBtn(this.radioButton5);
				break;
			case 1:
				this.radioGroup2.setSelectBtn(this.radioButton6);
				break;
			case 2:
				this.radioGroup2.setSelectBtn(this.radioButton7);
				break;
			case 3:
				this.radioGroup2.setSelectBtn(this.radioButton9);
				break;
			case 4:
				this.radioGroup2.setSelectBtn(this.radioButton8);
				break;
		}
	}
};


FD4102_W01.prototype.onButton1Click = function(comp, info)
{
	this.datePickerControl(false);
	this.button1.enable(false);
	this.button2.enable(true);
	this.button3.enable(true);
	this.button4.enable(true);
	
	this.text1 = '당일';
	
	this.startDate = Utils.yyyymmdd(new Date());
	this.endDate = Utils.yyyymmdd(new Date());
	
	this.dayType[0] = 0;
};

FD4102_W01.prototype.onButton2Click = function(comp, info)
{
	this.datePickerControl(false);
	this.button2.enable(false);
	this.button1.enable(true);
	this.button3.enable(true);
	this.button4.enable(true);
	
	this.text1 = '1개월';
	
	var d = new Date()
	d.setMonth(d.getMonth() - 1);

	this.startDate = Utils.yyyymmdd(d);
	this.endDate = Utils.yyyymmdd(new Date());

	this.dayType[0] = 1;
};

FD4102_W01.prototype.onButton3Click = function(comp, info)
{
	this.datePickerControl(false);
	this.button3.enable(false);
	this.button2.enable(true);
	this.button1.enable(true);
	this.button4.enable(true);
	
	this.text1 = '3개월';
	
	var d = new Date()
	d.setMonth(d.getMonth() - 3);

	this.startDate = Utils.yyyymmdd(d);
	this.endDate = Utils.yyyymmdd(new Date());

	this.dayType[0] = 2;
};

FD4102_W01.prototype.onButton4Click = function(comp, info)
{	
	this.datePickerControl(true);
	this.button4.enable(false);
	this.button2.enable(true);
	this.button3.enable(true);
	this.button1.enable(true);
	
	this.text1 = '직접입력';
	
	this.startDate = null;
	this.endDate = null;

	this.dayType[0] = 3;
};

FD4102_W01.prototype.onOkBtnClick = function(comp, info)
{
	if(!this.startDate) {
		this.startDate = this.datePicker1.getValue();
		this.endDate = this.datePicker2.getValue();
	}
	switch(this.radioGroup2.getSelectBtn()) {
		case this.radioButton5 :
			this.close([this.startDate, this.endDate, 0, this.text1, '전체', [this.dayType[0], 0]]);
			break;
		case this.radioButton6 :
			this.close([this.startDate, this.endDate, 3, this.text1, '매매', [this.dayType[0], 1]]);
			break;
		case this.radioButton7 :
			this.close([this.startDate, this.endDate, 7, this.text1, '신청(주문)', [this.dayType[0], 2]]);
			break;
		case this.radioButton9 :
			this.close([this.startDate, this.endDate, 1, this.text1, '입출금', [this.dayType[0], 3]]);
			break;
		case this.radioButton8 :
			this.close([this.startDate, this.endDate, 4, this.text1, '기타', [this.dayType[0], 4]]);
			break;
	}
};

FD4102_W01.prototype.onCloseBtnClick = function(comp, info)
{
	this.close(-1);
};

FD4102_W01.prototype.datePickerControl = function(isTrue)
{
	if(isTrue) {
		this.datePicker1.enable(true);
		this.datePicker2.enable(true);
		
		this.datePicker1.removeClass('dis');
		this.datePicker2.removeClass('dis');	
	} else {
		this.datePicker1.enable(false);
		this.datePicker2.enable(false);
		
		this.datePicker1.addClass('dis');
		this.datePicker2.addClass('dis');
	}
};