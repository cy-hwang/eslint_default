
/**
Constructor
Do not call Function in Constructor.
*/
function FD5002_W01(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5002_W01.lay';

	//TODO:edit here

}
afc.extendsClass(FD5002_W01, BaseWindow);


FD5002_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
};


// X 버튼 또는 확인 버튼 클릭
FD5002_W01.prototype.onBtnCloseClick = function(comp, info)
{
	this.close(0);
};


