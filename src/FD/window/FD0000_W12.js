
/**
Constructor
Do not call Function in Constructor.
*/
function FD0000_W12(containerId)
{
	BaseWindow.call(this, containerId);

}
afc.extendsClass(FD0000_W12, BaseWindow);


FD0000_W12.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here

};


FD0000_W12.prototype.onBtnCloseClick = function(comp, info)
{

	//TODO:edit here
	this.close(0);

};

FD0000_W12.prototype.onBtnTodayClick = function(comp, info)
{

	var now = new Date();
	var now2 = null;

	now.setDate(now.getDate());
	now2 = now.format('yyyyMMdd');								

	theApp.prefInfo.set('EventDate3', now2);

	//TODO:edit here
	this.close(0);

};


FD0000_W12.prototype.onBtnDetailClick = function(comp, info)
{

	//TODO:edit here	
	var fundGoPage = 'https://www.meritzam.com/14795/';
	
	// 해당 URL로 웹페이지 열기
	AppManager.goUrl(fundGoPage);
	
	this.close(0);

};
