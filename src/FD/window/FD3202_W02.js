
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_W02(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD3202_W02.lay';

	//TODO:edit here

}
afc.extendsClass(FD3202_W02, BaseWindow);


FD3202_W02.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	
	this.CheckBox1 = this.findCompById('CheckBox1');	
	this.lblInvestName = this.findCompById('lblInvestName');
	
	this.btnConfirm = this.findCompById('btnConfirm');
	
	// 하단 확인 버튼 비활성화
	this.btnConfirm.enable(false);
	
	this.lblInvestName.setText(theApp.userInfo.get('D1사용자명'));
	//TODO:edit here
	
};

FD3202_W02.prototype.onWillActive = function(reload)
{
	BaseWindow.prototype.onWillActive.call(this, reload);				
			
};



FD3202_W02.prototype.onActiveDone = function(reload){
	
	BaseWindow.prototype.onActiveDone.call(this, reload);
			
};

FD3202_W02.prototype.onCheckBox1Click = function(comp, info)
{
	//TODO:edit here
		
	// 투자자정보확인서 동의 체크에 따른 버튼 활성화
	if(this.CheckBox1.getCheck()){
		this.btnConfirm.enable(true);
	}else{
		this.btnConfirm.enable(false);	
	}

};

FD3202_W02.prototype.onbtnConfirmClick = function(comp, info)
{
	//TODO:edit here
	// 동의 확인
	this.close(1);
};

FD3202_W02.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	// window close
	this.close(0);
};
