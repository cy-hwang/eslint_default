/**
 * @author asoocool
 */


function AImage()
{
	AComponent.call(this);
	
}
afc.extendsClass(AImage, AComponent);

AImage.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	//html 저장시, background-size 가 '100% 100%' 에서 '100%' 로 변하는 버그때문에...
	if(this.getStyle('background-size')=='100%') 
		this.setStyle('background-size', '100% 100%');
	
};


AImage.prototype.setImage = function(url)
{
	this.setStyle('background-image', 'url('+url+')');
};

AImage.prototype.getImage = function()
{
	return this.getStyle('background-image');
};

