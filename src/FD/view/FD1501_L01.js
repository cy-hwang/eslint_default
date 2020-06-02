
/**
Constructor
Do not call Function in Constructor.
*/
function FD1501_L01()
{
	AView.call(this);
}
afc.extendsClass(FD1501_L01, AView);


FD1501_L01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.label1 = this.findCompByGroup('Label1Gr')[0];
	this.url;
	this.text;
	this.delegator = null;
};

FD1501_L01.prototype.setData = function(data, delegator)
{
	this.label1.setText(data.text);
	this.text = data.text;
	this.url = data.Url;
	this.zoom = data.zoom;
	this.delegator = delegator;
};

FD1501_L01.prototype.onButton1Click = function(comp, info)
{
	//상단항목 이벤트 전달 중지
	info.stopPropagation();
	var win = AWindow.createWindow('FD/window/FD1501_W01.lay','FD1501W01');
	win.setWindowOption
	(
		{
			isModal:true,
			modalBgOption:'none',
		}
	)

	win.titleText = comp.parent.text;
	win.data = comp.parent.url;
	win.urlType = 1;
	win.enableZoom = comp.parent.zoom;
	win.openAsDialog(this);		
};