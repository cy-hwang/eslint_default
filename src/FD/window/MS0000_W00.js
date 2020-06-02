
/**
Constructor
Do not call Function in Constructor.
*/
function MS0000_W00(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/MS0000_W00.lay';

	//TODO:edit here

}
afc.extendsClass(MS0000_W00, BaseWindow);


MS0000_W00.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	
};


MS0000_W00.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.checkBox2 = this.findCompById('CheckBox2');
	this.webView1 = this.findCompById('WebView1');
	
				
	this.webView1.setUrl('http://webmts.koscom.co.kr/notice/mts/951/2.html');
	
	// 5월 7일, 5월 8일은 체크박스 없애기
	this.Label1 = this.findCompById('Label1');
	this.Button4 = this.findCompById('Button4');
	this.View37 = this.findCompById('View37');
	
	
	var now = new Date();
	var until = 0;	
	var now2 = null;
	
	now.setDate(now.getDate());
	
	now2 = now.format('yyyyMMdd');
	
	// 5월 7일, 5월 8일은 체크박스 없애기
	//if(now2 == '20180505' || now2 == '20180506' || now2 == '20180507'){
		this.Label1.show(AComponent.GONE);
		this.checkBox2.show(AComponent.GONE);

		var leftMargin = (this.View37.getWidth() - this.Button4.getWidth()) / 2;

		this.Button4.setPos({left: leftMargin, top: 0});
	//}

};

MS0000_W00.prototype.onButton4Click = function(comp, info)
{

	//TODO:edit here
	
	var now = new Date();
	var until = 0;
	var now2 = null;
	var now3 = null;
	
	now.setDate(now.getDate());
	
	now3 = now.format('yyyyMMdd');
	
	// 5월 5일, 6일, 7일, 8일은 앱 종료
	//if(now3 == '20180505' || now3 == '20180506' || now3 == '20180507'){
		if(afc.isAndroid) navigator.app.exitApp();
		else if(afc.isIos) AppManager.exitApp();
/*	}else{
		if(this.checkBox2.getCheck()) {
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

			//theApp.userInfo.set('NoticeEvent', now2);				
			AppManager.setPref('NoticeEvent', now2);

		} else {		
			//theApp.userInfo.set('NoticeEvent', '');	
			AppManager.setPref('NoticeEvent', '');
		}

		this.close(1);
	}*/

};
