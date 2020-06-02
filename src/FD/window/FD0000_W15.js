
/**
Constructor
Do not call Function in Constructor.
*/
function FD0000_W15(containerId)
{
	AWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD0000_W15.lay';

	//TODO:edit here

}
afc.extendsClass(FD0000_W15, AWindow);


FD0000_W15.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);
	//TODO:edit here
	
//	this.$w15Com = $("#FD0000_W15--w15Com");
	this.View1 = this.findCompById('View1');
	this.Label2 = this.findCompById('Label2');
	this.Label3 = this.findCompById('Label3');
	this.Label4 = this.findCompById('Label4');
	this.Label3Number = 0;
	this.Label4Number = 0;
	
	this.setNumberImage();
	
};

FD0000_W15.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	this.close(0);
};

FD0000_W15.prototype.onBtnDayClick = function(comp, info)
{

	//TODO:edit here
	//TODO:edit here
	var now = new Date();
	var now2 = null;

	now.setDate(now.getDate());
	now2 = now.format('yyyyMMdd');
	
	theApp.prefInfo.set('EventDate2', now2);

	this.close(0);

};

FD0000_W15.prototype.changeBgToRed = function(comp, info)
{
//	this.$w15Com.removeClass('bg_white');
//	this.$w15Com.addClass('bg_red');

	this.Label2.show(AComponent.INVISIBLE);
	this.Label3.show(AComponent.INVISIBLE);
	this.Label4.show(AComponent.INVISIBLE);
	
};

FD0000_W15.prototype.setNumberImage = function(comp, info)
{
	this.View1.removeClass('bg_100_01');
	this.View1.addClass('bg_100_'+this.getViewClass());

	this.Label3Number = parseInt(this.eventCnt / 10);
	this.Label4Number = parseInt(this.eventCnt % 10);
	
	this.Label3.removeClass('number0');
	this.Label3.addClass('number'+this.Label3Number);
	this.Label4.removeClass('number0');
	this.Label4.addClass('number'+this.Label4Number);
};

FD0000_W15.prototype.getViewClass = function(comp, info)
{
	var result = '01';
	var dayVal = this.eventCnt;
	
	if (20 < dayVal && 40 > dayVal) result = '02';
	else if (40 < dayVal && 60 > dayVal) result = '03';
	else if (60 < dayVal && 80 > dayVal) result = '04';
	else if (80 < dayVal && 100 > dayVal) result = '05';
	else if (20 == dayVal || 40 == dayVal || 60 == dayVal || 80 == dayVal) {
		this.changeBgToRed();
		result = this.eventCnt;
	}
	return result;
};


