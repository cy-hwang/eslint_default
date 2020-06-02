
/**
Constructor
Do not call Function in Constructor.
*/
function FD5002_W04(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5002_W04.lay';

	//TODO:edit here

}
afc.extendsClass(FD5002_W04, BaseWindow);


FD5002_W04.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
};


// 연금저축계좌개설[계약이전(계좌이체)] 페이지로 이동
FD5002_W04.prototype.onConfirmBtnClick = function(comp, info)
{
	this.close(0);
	
	// 연금저축계좌개설로 이동
	theApp.goPageCheck('FD5001', false, {tabId:'FD5001_T02'});
};


