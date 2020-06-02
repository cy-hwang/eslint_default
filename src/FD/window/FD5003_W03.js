
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_W03(containerId)
{
	AWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5003_W03.lay';

	//TODO:edit here

}
afc.extendsClass(FD5003_W03, AWindow);


FD5003_W03.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);

	// 펀드내용
	this.fundContent = this.findCompById('lblFundContent');
		
	// 컴포넌트 초기화
	this.onInitComponents();
};


// 컴포넌트 초기화
FD5003_W03.prototype.onInitComponents = function()
{
	// 펀드내용 셋팅
	this.fundContent.setText(this.w_fundContent);
};


// X 버튼 또는 확인 버튼 클릭
FD5003_W03.prototype.onBtnCloseClick = function(comp, info)
{
	this.close(0);
};


