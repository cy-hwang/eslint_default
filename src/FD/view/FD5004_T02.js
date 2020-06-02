
/**
Constructor
Do not call Function in Constructor.
*/
function FD5004_T02()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5004_T02, AView);


FD5004_T02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	

};


FD5004_T02.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);			
	
	
};

FD5004_T02.prototype.onbtnNextClick = function(comp, info)
{
	theApp.goPageCheck('FD5008', false, {tabId:'FD5008_T01'});
	
};
