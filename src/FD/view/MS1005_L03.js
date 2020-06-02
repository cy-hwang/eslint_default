
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_L03()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(MS1005_L03, AView);


MS1005_L03.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.zipCode=this.findCompByGroup('zipCode')[0];
	this.roadAddr=this.findCompByGroup('roadAddr')[0];
	this.jibunAddr=this.findCompByGroup('jibunAddr')[0];

};

MS1005_L03.prototype.setData = function(data){
	this.zipCode.setText(data.zipNo);
	this.roadAddr.setText(data.roadAddr);
	this.jibunAddr.setText(data.jibunAddr);
};

MS1005_L03.prototype.getData = function(){
	var addrData = [{
	"zipNo":this.zipCode.getText()
	,"roadAddr":this.roadAddr.getText()
	,"jibunAddr":this.jibunAddr.getText()
	}];
	return addrData;
};