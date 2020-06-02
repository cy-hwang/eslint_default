
/**
Constructor
Do not call Function in Constructor.
*/
function FD3101_T01()
{
	AView.call(this);	
}
afc.extendsClass(FD3101_T01, AView);


//초기화
FD3101_T01.prototype.onArrInit = function()
{		
};


FD3101_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);	
			
	this.accView = this.findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx;
	this.secureTxf = this.accView.secureTxf;
};


//화면이 활성화된 후 이벤트
FD3101_T01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);		
	this.accView.doInitAccInfo(0);	
};


//화면이 소멸되기 전 이벤트
FD3101_T01.prototype.onWillDeactive = function(reload)
{		
	this.onArrInit();
};
