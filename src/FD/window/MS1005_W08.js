
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_W08(containerId)
{
	BaseWindow.call(this, containerId);

	this.data = null;
}
afc.extendsClass(MS1005_W08, BaseWindow);

MS1005_W08.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	
	this.listView = this.findCompById("ListView1");
	this.listView.setDelegator(this);	//bindData 실행위해
	this.listView.addItem('FD/view/MS1005_L01.lay',this.data);
};

MS1005_W08.prototype.setData = function(data) {
	
	this.data = data;
	//this.data.push(['', "신규 ID 생성"]);
};

MS1005_W08.prototype.bindData = function(item, data, alistview)
{
	if( item.view.setData) {
		item.view.setData(data);
	}
};