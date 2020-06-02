
/**
Constructor
Do not call Function in Constructor.
*/

function FD0000_W04(containerId)
{
	BaseWindow.call(this, containerId);

	this.contentView		= false;
	this.align				= 'left';
	this.text				= '';
}
afc.extendsClass(FD0000_W04, BaseWindow);


FD0000_W04.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//컴포넌트 초기화 START ++++++++++++++++++++++++++++++
	
	var alertGrp = this.findCompByGroup('AlertGrp');
	
	this.contentView	= alertGrp[0];
	this.contentView.$ele.css('text-align', this.align);
	this.contentView.$ele.css('max-height', '600px');
	this.contentView.$ele.css('overflow-y', 'auto');
	
	this.frame.css('height', 'auto');
	
	//최초 실행 호출
	this.onInit();
};


//최초 실행
FD0000_W04.prototype.onInit = function()
{
	this.contentView.$ele.html(this.text);
	
	this.moveToCenter();
};

FD0000_W04.prototype.onCloseBtnClick = function(comp, info)
{
	this.close(0);
};

FD0000_W04.prototype.setNotice = function(noticeArr)
{
	this.text = noticeArr;
};
