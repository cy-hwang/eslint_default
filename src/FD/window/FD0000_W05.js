
/**
Constructor
Do not call Function in Constructor.
*/
function FD0000_W05(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD0000_W05.lay';

	//TODO:edit here

}
afc.extendsClass(FD0000_W05, BaseWindow);


FD0000_W05.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	this.btnView1 = this.findCompById('BtnView1');
	this.leftBtn = this.findCompById('Button4');
	this.rightBtn = this.findCompById('Button2');
	this.webView = this.findCompById('WebView');
	this.dropBox = this.findCompById('DropBox1');
	this.checkBox = this.findCompById('CheckBox1');
	this.label1 = this.findCompById('Label1');
	
// 	this.noticeNumber = 0;

// 	this.dataList = [];

	this.dropBox.addItem('오늘 하루 보지 않기', '1');
	this.dropBox.addItem('일주일간 보지 않기', '2');
	this.dropBox.addItem('다시 보지 않기', '3');
	
	this.dropBox.selectItem(1);
	var tmp = this.dropBox.getSelectedItemText();
	if(!tmp) tmp = '오늘 하루 보지 않기';
	this.label1.setText(tmp);
	
	var thisObj = this;

	var noticeArr = theApp.prefInfo.get('NoticeNumber');
	/*$.ajax({
		url : 'http://testwebmts.koscom.co.kr/notice/mts/' + theApp.systemInfo.fno + '.html',
		success : function(result){
			var results = result.trim().split(';');
			if(results.length < 2) {
				thisObj.close(0);
				return;
			}
			for(var i = 1; i<results.length-1; i++) {
				thisObj.dataList.push(results[i].trim());
			}
			
			thisObj.noticeNumber = Number(results[0]);
			
			if(!noticeArr || thisObj.noticeNumber > Number(noticeArr[0])) {
				thisObj.getNoticeList(results);
			} else {
				if(noticeArr.length < 2 || !noticeArr[1]) {
					thisObj.getNoticeList(results);
				} else {
					var now = new Date();
					var until = new Date(noticeArr[1]);
					
					if(now >= until) {
						thisObj.getNoticeList(results);
					} else {
						thisObj.close(0);
						return;
					}
				}
			}
		},
		error : function(error) {
			thisObj.close(0);
		}
	});*/

	this.getNoticeList(this.results);
};

FD0000_W05.prototype.getNoticeList = function(results) {
	if(results.length > 2) {
		this.setBtnView(this.dataList.length);
	} else {
		theApp.prefInfo.set('NoticeNumber', [this.noticeNumber,]);
		this.close(0);
	}
};

FD0000_W05.prototype.setBtnView = function(length)
{
	this.current = 0;
	
	if(!length || length < 1) {
		length = 1;
	}
	
	var pos = 270 - 15 * length;
	
	this.leftBtn.setPos({left: pos, top : 0});
	pos += 60;

	for(var i=0 ; i<length; i++)
	{
		var btn = new AButton();
		var tabId = i;
		btn.init();
		btn.setBtnStyle([ 'LB_M002_2', 'LB_M002_1', 'LB_M002_1' ]);
		btn.changeBtnState(-1, AButton.NORMAL);
		btn.setText('');
		btn.setComponentId(tabId);
		btn.setGroupName('BtnGrp');

		btn.setPos({left : pos, top : 35});
		btn.setWidth('20px');
		btn.setHeight('100%');
		
		pos += 30;
		
		btn.addEventListener('click', this, 'onTabBtnClick');

		this.btnView1.addComponent(btn);
	}
	
	this.rightBtn.setPos({left: pos, top : 0});
	
	this.btnGrp = this.findCompByGroup('BtnGrp');
	
	this.btnGrp[0].enable(false);
	
	this.webView.destroyWebView();
	this.webView.loadWebView(this.dataList[0]);
	
	if(length == 1) {
		this.leftBtn.show(AComponent.GONE);
		this.rightBtn.show(AComponent.GONE);
	}
// 	this.btnView1.updatePosition();
};

FD0000_W05.prototype.onTabBtnClick = function(comp, info)
{
	this.btnGrp[this.current].enable(true);
	
	this.current = Number(comp.getComponentId());
	
	this.btnGrp[this.current].enable(false);
	
	this.webView.destroyWebView();
	this.webView.loadWebView(this.dataList[this.current]);
	
	/*var children = this.btnView1.getChildren();
	
	for(var i=0; i<children.length; i++)
		children[i].enable(true);

	comp.enable(false);*/
};
FD0000_W05.prototype.onButton4Click = function(comp, info)
{
	if(this.current > 0) {
		this.webView.destroyWebView();
		this.btnGrp[this.current].enable(true);
		this.current--;
		this.btnGrp[this.current].enable(false);
		this.webView.loadWebView(this.dataList[this.current]);
	} else {
		this.webView.destroyWebView();
		this.btnGrp[this.current].enable(true);
		this.current = this.dataList.length -1;
		this.btnGrp[this.current].enable(false);
		this.webView.loadWebView(this.dataList[this.current]);
	}
};

FD0000_W05.prototype.onButton2Click = function(comp, info)
{
	if(this.current < this.dataList.length - 1) {
		this.webView.destroyWebView();
		this.btnGrp[this.current].enable(true);
		this.current++;
		this.btnGrp[this.current].enable(false);
		this.webView.loadWebView(this.dataList[this.current]);
	} else {
		this.webView.destroyWebView();
		this.btnGrp[this.current].enable(true);
		this.current = 0;
		this.btnGrp[this.current].enable(false);
		this.webView.loadWebView(this.dataList[this.current]);
	}
};

FD0000_W05.prototype.onMS0000W01CloseBtnClick = function(comp, info)
{
	theApp.prefInfo.set('NoticeNumber', [this.noticeNumber,]);
	this.close(0);
};

FD0000_W05.prototype.onClose = function()
{
	this.webView.destroyWebView();
	return true;
};

FD0000_W05.prototype.onButtonGoNext = function(comp, info)
{
	if(this.checkBox.getCheck()) {
		var now = new Date();
		var until = this.dropBox.getSelectedIndex();
// 		var until = 0;
		var now2 = null;
		
		switch(until) {
			case 0:
				now.setDate(now.getDate() + 1);
				now2 = now.format('yyyy-MM-dd');
				break;
			case 1:
				now.setDate(now.getDate() + 7);
				now2 = now.format('yyyy-MM-dd');
				break;
			case 2:
				now2 = '9999-12-31';
				break;
			default:
				now2 = '';
				break;
		}
		
		theApp.prefInfo.set('NoticeNumber', [this.noticeNumber,now2]);
	} else {
		theApp.prefInfo.set('NoticeNumber', [this.noticeNumber,]);
	}
	
	this.close(0);
};
