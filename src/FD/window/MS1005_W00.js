
/**
Constructor
Do not call Function in Constructor.
*/

function MS1005_W00(containerId)
{
	BaseWindow.call(this, containerId);

	this.isConfirm 			= false;
	this.contentView		= false;
	this.align				= 'center';
	this.text				= '';
	this.title				= '';
	this.btnTextArr			= ['확인', '취소'];
	
}
afc.extendsClass(MS1005_W00, BaseWindow);


MS1005_W00.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here
	//컴포넌트 초기화 START ++++++++++++++++++++++++++++++
	
	var alertGrp = this.findCompByGroup('AlertGrp');
	
	this.titileLbl		= alertGrp[0];
	this.contentView	= alertGrp[1];
	this.contentView.$ele.css('text-align', this.align);
	this.contentView.$ele.css('max-height', '600px');
	this.contentView.$ele.css('overflow-y', 'auto');
	
	this.cancelBtn		= alertGrp[2];
	this.okBtn		= alertGrp[3];
	
	//this.frame.css('position', 'relative');
	this.frame.css('height', 'auto');
	
	//최초 실행 호출
	this.onInit();
};


//최초 실행
MS1005_W00.prototype.onInit = function()
{
	if(this.title) this.titileLbl.setText(this.title);
	this.contentView.$ele.html(this.text);
	if(this.btnTextArr) this.okBtn.setText(this.btnTextArr[0]);
	
	if(this.isConfirm)
	{
		this.cancelBtn.$ele.show();
		if(this.btnTextArr) this.cancelBtn.setText(this.btnTextArr[1]);
	}
	
	this.moveToCenter();
};

MS1005_W00.prototype.onCloseBtnClick = function(comp, info)
{
	this.close(0);
};

MS1005_W00.prototype.onCancelBtnClick = function(comp, info)
{
	this.close(0);
};

MS1005_W00.prototype.onOkBtnClick = function(comp, info)
{
	this.close(1);
};
