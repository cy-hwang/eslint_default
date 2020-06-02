
/**
Constructor
Do not call Function in Constructor.
*/
function FD5002_W02(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5002_W02.lay';

	//TODO:edit here

}
afc.extendsClass(FD5002_W02, BaseWindow);


FD5002_W02.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5002_W02.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);

	this.lblTitle = this.findCompById('lblTitle');
	this.webView = this.findCompById('WebView');

	this.lblTitle.setText(this.loadTitle);
	this.webView.loadWebView(this.loadViewUrlAddr);
};


// X 버튼 또는 확인 버튼 클릭
FD5002_W02.prototype.onBtnCloseClick = function(comp, info)
{
	this.close(0);
};


