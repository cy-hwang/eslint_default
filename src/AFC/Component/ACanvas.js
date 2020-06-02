/**
 * @author kyun
 */

function ACanvas()
{
	AComponent.call(this);
	
	this.ctx = null;
	this.canW = 0;
	this.canH = 0;
	//this.data = new Array();
	this.data = null;
	
}
afc.extendsClass(ACanvas, AComponent);

ACanvas.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	this.ctx = this.element.getContext('2d');
	
	this.canW = this.getWidth();
	this.canH = this.getHeight();
	
	this.centerX = this.canW/2;
	this.centerY = this.canH/2;
	
	this.setStyleObj({width:'', height:''});
};

ACanvas.prototype.updatePosition = function(pWidth, pHeight)
{
	//캔버스 두개 그려지는 안드로이드 버그로 인해 주석처리
    //AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
};


ACanvas.prototype.setData = function(data)
{
    this.data = data;
};

