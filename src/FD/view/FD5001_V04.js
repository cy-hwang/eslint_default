
/**
Constructor
Do not call Function in Constructor.
*/
//개설 축하
function FD5001_V04()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD5001_V04, AView);


FD5001_V04.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	this.grid = this.findCompById('Grid1');
	
	
};

//화면이 활성화된 후 이벤트
FD5001_V04.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);	
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	this.name = this.viewData.name;
	this.barAcc = this.viewData.barAcc;
	
	this.acc = this.viewData.acc;
	this.grid.setCellText(1,1,this.name);
	this.grid.setCellText(2,1,this.barAcc);
	

};


FD5001_V04.prototype.onButton1Click = function(comp, info)
{
	
	//TODO:edit here
	
	this.requestAccountInfo();

};





//계좌정보 가져오기
FD5001_V04.prototype.requestAccountInfo = function()
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	cont.sendData('SACEQ306',
	//beforeInBlockBuffer
	function(queryData, groupName)
	{
		var inblockData = queryData.getBlockData('InBlock1');
		inblockData[0]['D1전자금융사용자ID'] = this.headerInfo.USER_ID;
	},
	
	//afterOutBlockData
	function(queryData, groupName)
	{
		if (afc.isSimulator) queryData.printQueryData();
		//기존의 계좌정보 클리어합니다.
		theApp.accInfo.clearInfo();
		
		if(!queryData){
			return;
		} 
		
		var OutBlock1 = queryData.getBlockData('OutBlock1');
		if(OutBlock1 && OutBlock1.length > 0)
		{
			//계좌정보 재세팅합니다.
			theApp.accInfo.setAccData(OutBlock1);
			
			
			theApp.fundAcc = thisObj.acc
			// 가져오기로 이동
			theApp.goPageCheck('FD0005', false);
		}
		else return;
		
	});
};