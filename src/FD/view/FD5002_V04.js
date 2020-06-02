
/**
Constructor
Do not call Function in Constructor.
*/
function FD5002_V04()
{
	AView.call(this);
}
afc.extendsClass(FD5002_V04, AView);


FD5002_V04.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	// Object
	this.cont = this.getContainer();
};


// 확인 버튼 클릭
FD5002_V04.prototype.onBtnCheckClick = function(comp, info)
{
	// 이체진행상황으로 이동
	this.cont.tvManager.changeTab('FD5002_T03');
};


