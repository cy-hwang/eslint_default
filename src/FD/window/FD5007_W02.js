
/**
Constructor
Do not call Function in Constructor.
*/
function FD5007_W02(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5007_W02.lay';

	//TODO:edit here

}
afc.extendsClass(FD5007_W02, BaseWindow);


FD5007_W02.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	
	
	
};
FD5007_W02.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	
	this.listView = this.findCompById('FDListView');
	this.listView.setDelegator(this);
	this.grid = this.findCompById('Grid1');
	this.nodata = this.findCompById('Nodata');
	this.label = this.findCompById('Label9');
	
	this.context = this.opener;
	this.password = this.context.secureTxf;
	this.account = this.context.accDbx;
	
	this.flag = false;
	this.SDPAQ070ContiKey = null;
	this.nodata.show(AComponent.GONE);
	this.label.show(AComponent.VISIBLE)
	this.sendSDPAQ070();
	
}

FD5007_W02.prototype.sendSDPAQ070 = function()
{
	
	var thisObj = this		
		,qrName = "SDPAQ070"
		,cont = thisObj.opener.getContainer()
		,cipherData = thisObj.password.getCipherData();
	
	
	
	if(!thisObj.account.getSelectedItemData() || !thisObj.account.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator && !cipherData) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		thisObj.password.addClass('active');
		return;
	}
	thisObj.password.removeClass('active');

	//재조회
	if(!thisObj.SDPAQ070ContiKey){
		thisObj.SDPAQ070ContiKey = null;
		this.nodata.show(AComponent.GONE);
		this.label.show(AComponent.VISIBLE)
	}
	
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.account.getSelectedItemData()['D1계좌번호']
	};
	
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{

			
				queryData.setContiKey(thisObj.SDPAQ070ContiKey);
				
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
	
				InBlock1['D1계좌번호'] = checkObj.accNo;		
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;
				
				
				if(!afc.isSimulator){
					queryData.putPwInfo('InBlock1', 'D1비밀번호');
				}
				
				queryData.printQueryData();

			},
			function(queryData, groupName)
			{				
				if(queryData)
				{
				
				
					var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
					var OutBlock4 = queryData.getBlockData('OutBlock4');
					
					SDPAQ070ContiKey = queryData.getContiKey();
					
					if(thisObj.flag == false){
						thisObj.setGrid(OutBlock1)
					}
					
					
					thisObj.listViewPrint(OutBlock4)
					
					if(SDPAQ070ContiKey != null){
						thisObj.sendSDPAQ070(SDPAQ070ContiKey);

					}
					queryData.printQueryData();
					
					
				}
			}
			
		);
	});
}



FD5007_W02.prototype.setGrid = function(OutBlock1)
{
	this.flag = true;
	this.grid.setCellText(0,1,afc.addComma(OutBlock1['D1금액20']))
	this.grid.setCellText(0,2,afc.addComma(OutBlock1['D1금액21']))
	this.grid.setCellText(0,3,afc.addComma(OutBlock1['D1금액22']))
	this.grid.setCellText(1,1,afc.addComma(OutBlock1['D1금액30']))
	this.grid.setCellText(1,2,afc.addComma(OutBlock1['D1금액31']))
	this.grid.setCellText(1,3,afc.addComma(OutBlock1['D1금액32']))
	this.grid.setCellText(2,1,afc.addComma(OutBlock1['D1금액40']))
	this.grid.setCellText(2,2,afc.addComma(OutBlock1['D1금액41']))
	this.grid.setCellText(2,3,afc.addComma(OutBlock1['D1금액42']))
	this.grid.setCellText(3,1,afc.addComma(OutBlock1['D1금액50']))
	this.grid.setCellText(3,2,afc.addComma(OutBlock1['D1금액51']))
	this.grid.setCellText(3,3,afc.addComma(OutBlock1['D1금액52']))
	this.grid.setCellText(4,1,afc.addComma(OutBlock1['D1금액10']))
	this.grid.setCellText(4,2,afc.addComma(OutBlock1['D1금액11']))
	this.grid.setCellText(4,3,afc.addComma(OutBlock1['D1금액12']))
};

FD5007_W02.prototype.listViewPrint = function(OutBlock4)
{
	
	var data = [];
	if(OutBlock4.length == 0){
		this.nodata.show(AComponent.VISIBLE);
		this.label.show(AComponent.GONE);
		return;
	}
	for(var i = 0; i < OutBlock4.length; i++)
	{
		data.push({"a1": OutBlock4[i]['D1납입년도']
				   ,"a2": OutBlock4[i]['D1납입금액']
				   ,"a3": OutBlock4[i]['D1과세제외금액']
				   ,"a4": OutBlock4[i]['D1과세제외금액출금']
				   ,"a5": OutBlock4[i]['D1소득공제금액']
				   ,"a6": OutBlock4[i]['D1소득공제금액출금']});
		
	}
	
	this.listView.addItem('FD/view/FD5007_L03.lay', data);
	
};


// X 버튼 클릭
FD5007_W02.prototype.onBtnCloseClick = function(comp, info)
{
	this.close(0);
};


FD5007_W02.prototype.bindData = function(item, data, listview){	
	if(item.view.setData){
		item.view.setData(data);
	}
};


FD5007_W02.prototype.onFDListViewScrollBottom = function(comp, info)
{

	//TODO:edit here

	if(this.SDPAQ070ContiKey) {
		this.sendSDPAQ070();
	} else {	
		if(comp.getItemCount() > 0) AToast.show(Message.LastList);
	}
	

};
