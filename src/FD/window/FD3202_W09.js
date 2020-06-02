
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_W09(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD3202_W09.lay';

	//TODO:edit here

}
afc.extendsClass(FD3202_W09, BaseWindow);


FD3202_W09.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here		

};


FD3202_W09.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.lblTitle = this.findCompById('lblTitle');
	
	this.webView = this.findCompById('View3');
	
	this.lblTitle.setText(this.loadTitle);
		
	this.webView.loadWebView(this.loadviewUrlAddr);
	
//	this.webView.setUrl('http://webmts.koscom.co.kr/notice/mts/Event/winEvent40Hy1.html');
	
};
FD3202_W09.prototype.onbtnCloseClick = function(comp, info)
{

	//TODO:edit here
	if(this.lblTitle.getText() == "약관동의"){
		this.close(3);
	}else if(this.lblTitle.getText() == "개인정보 수집 및 이용동의"){
		this.close(4);
	}else if(this.lblTitle.getText() == "개인정보 제 3자 제공동의"){
		this.close(5);
	}else{
		this.close(0);
	}
	
};
