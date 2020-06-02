
/**
Constructor
Do not call Function in Constructor.
*/
function FD0300_L01()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD0300_L01, AView);


FD0300_L01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.zipCode=this.findCompByGroup('zipCode')[0];
	this.roadAddr=this.findCompByGroup('roadAddr')[0];
	this.jibunAddr=this.findCompByGroup('jibunAddr')[0];
};

FD0300_L01.prototype.setData = function(data){
	this.zipCode.setText(data.zipNo);
	this.roadAddr.setText(data.roadAddr);
	this.jibunAddr.setText(data.jibunAddr);
};

FD0300_L01.prototype.getData = function(){
	var addrData = [{
	"zipNo":this.zipCode.getText()
	,"roadAddr":this.roadAddr.getText()
	,"jibunAddr":this.jibunAddr.getText()
	}];
	return addrData;
};