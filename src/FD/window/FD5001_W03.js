
/**
Constructor
Do not call Function in Constructor.
*/
function FD5001_W03(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5001_W03.lay';

	//TODO:edit here

}
afc.extendsClass(FD5001_W03, BaseWindow);


FD5001_W03.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

};

FD5001_W03.prototype.onActiveDone = function(reload)
{	
	BaseWindow.prototype.onActiveDone.call(this, reload);

	this.View1 = this.findCompById('View1');
	
	
	var content = this.param.name + '님의 납입가능금액은<br>'
				+ '<b>' + afc.addComma(this.param.limitPay) + '원</b> 입니다.';
				
	this.View1.$ele.children().children().eq(0).html(content);
}

FD5001_W03.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	this.close(0);
};

FD5001_W03.prototype.onCloseBtnClick = function(comp, info)
{

	//TODO:edit here
	this.close(0);

};
