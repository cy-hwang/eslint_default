
/**
Constructor
Do not call Function in Constructor.
*/
function FD1304_W01(containerId)
{
	BaseWindow.call(this, containerId);
	
}
afc.extendsClass(FD1304_W01, BaseWindow);


FD1304_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	
	this.onCheckSetting();
	this.findCompById('investType').enable(false);
	this.findCompById('infoType').enable(false);
};

FD1304_W01.prototype.onWillActive = function(reload)
{
	BaseWindow.prototype.onWillActive.call(this, reload);		
	
};


FD1304_W01.prototype.onbtnCloseClick = function(comp, info)
{	
	this.close(0);
};


FD1304_W01.prototype.onBTN_CONFIRMClick = function(comp, info)
{

	//TODO:edit here
	this.opener.afterCallback('1');
	this.close();
};


FD1304_W01.prototype.onCheckSetting = function()
{
	if(!this.data.investType){  //투자권유불원
		this.findCompById('investType').setCheck(true);
	}
	
	if(!this.data.infoType){  //정보제공미제공
		this.findCompById('infoType').setCheck(true);
	}	
};



