
/**
Constructor
Do not call Function in Constructor.
*/
function FD0000_W03()
{
	BaseWindow.call(this);
	
	//this.winType = 'full';
	this.listView = null;
	this.defaultTitleArr = null;
	this.defaultNoticeArr = null;
}
afc.extendsClass(FD0000_W03, BaseWindow);


FD0000_W03.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	/*
	this.baseH = this.view.$ele.height();
	
	this.frame.hide();
	this.frame.anima({y:-this.baseH, height:0});
	this.frame.anima({y:0, height:this.baseH}, 300);
	this.frame.show();
	*/
	this.listView = this.findCompById('ListView1');
	this.listView.setDelegator(this);	
	
	this.listView.removeAllItems();
	this.listView.setDividerColor('black');
	this.listView.addItem('FD/view/FD0000_L01.lay', [0]);
};

FD0000_W03.prototype.onCloseBtnClick = function(comp, info)
{
	this.close();
};

FD0000_W03.prototype.bindData = function(item, data, alistview)
{
	// data: index값
	item.view.data = data;
	item.view.label.$ele.html(this.defaultNoticeArr[data]);
	item.view.$ele.css('height', item.view.label.getHeight() + 20);
};

FD0000_W03.prototype.setNotice = function(noticeArr)
{
	var	nameArr = [],
		itemArr = [];
		
	for(var key in noticeArr){
		nameArr.push(noticeArr[key][0]);
		itemArr.push(noticeArr[key][1]);
	}
	
	this.defaultTitleArr = nameArr;
	this.defaultNoticeArr = itemArr;
};



