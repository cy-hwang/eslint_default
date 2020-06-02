
/**
Constructor
Do not call Function in Constructor.
*/
function FD1204_V01()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD1204_V01, AView);


FD1204_V01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.name = this.findCompByGroup('L')[0];
	this.grid = this.findCompByGroup('L')[1];
	//TODO:edit here

};

FD1204_V01.prototype.setData = function(data)
{
	this.data = data;
	
	this.name.setText([Utils.makeAccForm(data['D1계좌번호']),data['D1계좌명']].join(' '));
	this.grid.setCellText(0,1,data['D1등록구분']);
	this.grid.setCellText(1,1,data['D1사고유형']);
	this.grid.setCellText(2,1,data['D1사고접수경로']);
	var dateString = [data['D1사고등록일'].substring(0, 4), data['D1사고등록일'].substring(4, 6), data['D1사고등록일'].substring(6)].join('.') + ' ' + [data['D1변경일시'].substring(0, 2), data['D1변경일시'].substring(2, 4), data['D1변경일시'].substring(4, 6)].join(':');
	this.grid.setCellText(3,1,dateString);
	this.grid.setCellText(4,1,data['D1변경사용자ID']);
	this.grid.setCellText(5,1,data['D1변경지점번호']);	
};