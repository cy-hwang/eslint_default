
/**
Constructor
Do not call Function in Constructor.
*/
function FD0000_W07(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD0000_W07.lay';

	//TODO:edit here

}
afc.extendsClass(FD0000_W07, BaseWindow);


FD0000_W07.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here

};

FD0000_W07.prototype.onButton1Click = function(comp, info)
{
	var thisObj = this;
	this.sendData('SBPGT135', 
	function(queryData, groupName)
	{
		var InBlock1 = queryData.getBlockData('InBlock1')[0];
		
		InBlock1['D1처리구분'] = '2';
		InBlock1['D1약관동의처리대상ID'] = this.getHeaderInfo('USER_ID');
		InBlock1['D1약관종류코드'] = 'Z1';
		InBlock1['D1약관동의여부'] = 'Y';
		InBlock1['D1약관동의처리대상코드'] = '01';

	},
	function(queryData, groupName)
	{				
		var errMsg = this.getLastError('errMsg');
		var errCode = this.getLastError('errCode');

		if(queryData)
		{						
		}		
		thisObj.close();
	});
};

FD0000_W07.prototype.onButton2Click = function(comp, info)
{
	var thisObj = this;
	this.sendData('SBPGT135', 
	function(queryData, groupName)
	{
		var InBlock1 = queryData.getBlockData('InBlock1')[0];
		
		InBlock1['D1처리구분'] = '2';
		InBlock1['D1약관동의처리대상ID'] = this.getHeaderInfo('USER_ID');
		InBlock1['D1약관종류코드'] = 'Z1';
		InBlock1['D1약관동의여부'] = 'N';
		InBlock1['D1약관동의처리대상코드'] = '01';

	},
	function(queryData, groupName)
	{				
		var errMsg = this.getLastError('errMsg');
		var errCode = this.getLastError('errCode');

		if(queryData)
		{						
		}		
		thisObj.close();
	});
};