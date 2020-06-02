
/**
Constructor
Do not call Function in Constructor.
*/
function FD0001_V00()
{
	AView.call(this);

}
afc.extendsClass(FD0001_V00, AView);


FD0001_V00.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
    /*
    var certPwdSecurePad = this.findCompById('LoginCertPwTxf');

	if (Define.ENC_PREFIX == 'PAD.V02')
	{
		certPwdSecurePad.padOption.encryptMethod='seed';
	}
	*/
};

FD0001_V00.prototype.onFindIdBtnClick = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/FD0001_W02.lay', 'FD000102');
	win.setWindowOption({
		isAutoCenter: true,
		isFocusLostClose: false, 
		modalBgOption:'dark'
	});	
	win.open(this, 0, 0, '100%', '100%');
};

FD0001_V00.prototype.onLostPwdBtnClick = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/FD0001_W03.lay', 'FD000103');
	win.setWindowOption({
		isAutoCenter: true,
		isFocusLostClose: false, 
		modalBgOption:'dark'
	});	
	win.open(this, 0, 0, '100%', '100%');
};

FD0001_V00.prototype.onFirstVisitBtnClick = function(comp, info)
{
	theApp.isNFTFProgress = true;
	theApp.checkPageAccount();
};

FD0001_V00.prototype.onLoginPwTxfChange = function(comp, info)
{
	if (comp.getText())
	{
		var cont = this.getContainer();
		cont.onLoginBtnClick();
	}
};

FD0001_V00.prototype.onWindowResult = function(result, awindow)
{
	
	var winId = awindow.getId();
	
	if(winId == 'FD000101')
	{
		AppManager.setPortrait(AppManager.SCREEN_ORIENTATION_PORTRAIT);
	}
	
}

