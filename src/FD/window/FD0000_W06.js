
/**
Constructor
Do not call Function in Constructor.
*/
function FD0000_W06(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD0000_W06.lay';

	//TODO:edit here

}
afc.extendsClass(FD0000_W06, BaseWindow);


FD0000_W06.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);



};

//화면이 활성화된 후 이벤트
FD0000_W06.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.btnView1 = this.findCompById('BtnView1');
	this.leftBtn = this.findCompById('Button4');
	this.rightBtn = this.findCompById('Button2');
	this.webView = this.findCompById('WebView');
	this.dropBox = this.findCompById('DropBox1');
	this.checkBox = this.findCompById('CheckBox1');
	
// 	this.noticeNumber = 0;

// 	this.dataList = [];

	this.dropBox.addItem('오늘 하루', '1');
	this.dropBox.addItem('일주일 동안', '2');
	this.dropBox.addItem('다시', '3');
	
	this.dropBox.selectItem(0);
	
	var thisObj = this;

	var noticeArr = theApp.prefInfo.get('EventDate');		
	this.webView.loadWebView('http://webmts.koscom.co.kr/notice/mts/951/2.html');
	
};

FD0000_W06.prototype.onMS0000W01CloseBtnClick = function(comp, info)
{
	theApp.prefInfo.set('EventDate', '');
	this.close(0);
};


FD0000_W06.prototype.onButtonGoNext = function(comp, info)
{
	if(this.checkBox.getCheck()) {
		var now = new Date();
// 		var until = this.dropBox.getSelectedIndex();
		var until = 0;
		var now2 = null;
		
		switch(until) {
			case 0:
				now.setDate(now.getDate() + 1);
				now2 = now.format('yyyyMMdd');								
				break;
			case 1:
				now.setDate(now.getDate() + 7);
				now2 = now.format('yyyyMMdd');
				break;
			case 2:
				now2 = '9999-12-31';
				break;
			default:
				now2 = '';
				break;
		}
		
		theApp.prefInfo.set('EventDate', now2);
	} else {
		theApp.prefInfo.set('EventDate', '');
	}
	
	this.close(0);
};
