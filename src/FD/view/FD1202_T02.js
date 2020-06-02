
/**
Constructor
Do not call Function in Constructor.
*/
function FD1202_T02()
{
	AView.call(this);	
}
afc.extendsClass(FD1202_T02, AView);


//초기화
FD1202_T02.prototype.onArrInit = function()
{	
};


FD1202_T02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);	
			
	this.accView = this.findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx;
	this.secureTxf = this.accView.secureTxf;
};


//화면이 활성화된 후 이벤트
FD1202_T02.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);		
	this.accView.doInitAccInfo(0);	
};


//화면이 소멸되기 전 이벤트
FD1202_T02.prototype.onWillDeactive = function(reload)
{		
	this.onArrInit();
};
