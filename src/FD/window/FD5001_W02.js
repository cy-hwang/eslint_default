
/**
Constructor
Do not call Function in Constructor.
*/
function FD5001_W02(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5001_W02.lay';

	//TODO:edit here
	
	

}
afc.extendsClass(FD5001_W02, BaseWindow);


FD5001_W02.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here
	
};


FD5001_W02.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	this.textField1 = this.findCompById('TextField1');
	this.textField2 = this.findCompById('TextField2');
	this.textField3 = this.findCompById('TextField3');

	var thisObj = this;
	
	var cont = thisObj.opener.getContainer();
	
	var r1 = this.opener.r1; //만 55세 나이
	var r2 = this.opener.r2; //저축기간 나이
	this.result = null;
	
	
	if(r1 < r2){
		this.textField1.setText(r2.substr(0,4));
		this.textField2.setText(r2.substr(4,2));
		this.textField3.setText(r2.substr(6,2));
		this.result = r2;
	}else{
		this.textField1.setText(r1.substr(0,4));
		this.textField2.setText(r1.substr(4,2));
		this.textField3.setText(r1.substr(6,2));
		this.result  =r1;
	}
};



FD5001_W02.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	
	
	if(this.textField1.getText() != '' && this.textField2.getText() != '' && this.textField3.getText() != ''){
		var month = null;
		var day  =null;
		var year = this.textField1.getText();
		
		if(this.textField2.getText().length != 2 && this.textField2.getText() != '0'){
			month = '0' + this.textField2.getText();
		}else{
			month = this.textField2.getText();
			
			if(month*1 > 12 || month*1 < 1){
				AToast.show('월을 정확히 입력해 주세요');
				return;
			}
		}

		if(this.textField3.getText().length != 2 && this.textField3.getText() != '0'){
			day = '0' + this.textField3.getText();
		}else{
			day = this.textField3.getText();	
			
			if(month == '01' ||month == '03'||month == '05'||month == '07' ||month == '08'||month == '10' ||month == '12'){
				if(day*1 > 31 || day*1 < 1){
					AToast.show('일을 정확히 입력해 주세요');
					return;
				}
			}else if(month == '02'){
				if(day*1 > 28 || day*1 < 1){
					AToast.show('일을 정확히 입력해 주세요');
					return;
				}
			}else{
				if(day*1 > 30 || day*1 < 1){
					AToast.show('일을 정확히 입력해 주세요');
					return;
				}
			}
			
		}
		var hope = this.textField1.getText() + month + day;
		
		if(this.result*1  > hope*1){
			AToast.show('만 55세와 저축기간 만기일을 모두 충족하는 날 이후로 개시 가능합니다');
		}else{
			
			var date = [year,
						month,
						day];

			this.close({"key":"2","data":date});
		}
		
	}
	
	

};



FD5001_W02.prototype.onCancelWindowBtnClick = function(comp, info)
{

	//TODO:edit here
	this.close(0);

};
