
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_W03(containerId)
{
	BaseWindow.call(this, containerId);

	//TODO:edit here

}
afc.extendsClass(FD3202_W03, BaseWindow);


FD3202_W03.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here
				
};

FD3202_W03.prototype.onCloseBtnClick = function(comp, info)
{

	//TODO:edit here
	this.close(0);
};

FD3202_W03.prototype.sendDataManage = function(reload)
{	
	var thisObj = this;	
	
	this.sendData('SDPNQ060',
		function(queryData, groupName)
		{										
			queryData.printQueryData();
										
		 },
		//afterOutBlockData
		function(queryData, groupName)
		{
		
			var errMsg = this.getLastError('errMsg');
			var errCode = this.getLastError('errCode');
				
//			AToast.show(this.getLastError('errMsg')+'('+this.getLastError('errCode')+')');
									
			queryData.printQueryData();
			
			if(!queryData) return;
			
			var OutBlock1 = queryData.getBlockData('OutBlock1');
			
			if(!OutBlock1) return;
			
			for(var j=0;j<OutBlock1.length;j++){
				if(OutBlock1[j]['D1장애여부'] == 'O'){					
					thisObj.BankInfoGrid.addRowWithData([OutBlock1[j]['D1은행명'],OutBlock1[j]['D1은행번호']]);
				}						
			}				
			
	});			

}

FD3202_W03.prototype.onActiveDone = function(reload)
{	
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.BankInfoGrid = this.findCompById('BankInfoGrid');
				
	//기존목록 제거
	this.BankInfoGrid.removeAll();	
	
	//등록된 은행코드 로드
	this.sendDataManage();		
	
};

FD3202_W03.prototype.onBankInfoGridSelect = function(comp, info)
{
	//TODO:edit here
	
	if(comp.indexOfRow(info) < 0) return;
	
	var rowData =  comp.getDataByOption(info); /*comp.getRowDataByIndex(comp.getRowIndexByInfo(info));*/
	
	this.close(rowData);

};

FD3202_W03.prototype.onBankInfoGridScrollBottom = function(comp, info)
{

	//TODO:edit here
	if(this.contiKey)
	{
		this.sendDataManage(true);
	}
	else
	{	
		if(comp.getRowCount() > 0) AToast.show(Message.LastList);
	}

};
