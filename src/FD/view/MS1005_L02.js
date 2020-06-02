
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_L02()
{
	AView.call(this);

}
afc.extendsClass(MS1005_L02, AView);


MS1005_L02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.label1 = this.findCompByGroup('Label1Gr')[0];
	this.cbx1 = this.findCompByGroup('Label1Gr')[1];
	this.url;
	this.text;
	this.delegator = null;
};

MS1005_L02.prototype.setData = function(data, delegator)
{
	this.label1.setText(data.text);
	this.text = data.text;
	this.url = data.Url;
	this.zoom = data.zoom;
	this.delegator = delegator;
};

MS1005_L02.prototype.setCheck = function(value)
{
	this.cbx1.setCheck(value);
};

MS1005_L02.prototype.onButton1Click = function(comp, info)
{
	//상단항목 이벤트 전달 중지
	info.stopPropagation();

	if(!this.cbx1.getCheck()) {
		this.cbx1.setCheck(true);
	}
	
	this.delegator.isAllChecked();

	if(afc.isIos)
	{
		var win = AWindow.createWindow('FD/window/MS1005_W03.lay','MS1005_W03');

		win.loadTitle = comp.parent.text;
		win.data = comp.parent.url;
		win.urlType = 1;
		win.enableZoom = comp.parent.zoom;
		win.openAsDialog(this, '100%', '100%');
	}
	else		// Android
	{
		AppManager.openPdfModule(comp.parent.url, comp.parent.text);
	}

};

MS1005_L02.prototype.onCheckBox1Click = function(comp, info)
{
	this.delegator.isAllChecked();
};



MS1005_L02.prototype.onWindowResult = function(result, awindow)
{
	if(result == 1) {
		this.cbx1.setCheck(true);
	}
	this.delegator.isAllChecked();
}