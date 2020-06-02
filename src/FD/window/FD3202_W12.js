
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_W12(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD3202_W12.lay';

	//TODO:edit here

}
afc.extendsClass(FD3202_W12, BaseWindow);


FD3202_W12.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
		
	//TODO:edit here

};

//화면이 활성화된 후 이벤트
FD3202_W12.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.accView = this.findCompById('AccView').viewLoad('FD/view/FD0000_V03.lay');
	this.accDbx = this.accView.accDbx;
	this.secureTxf = this.accView.secureTxf;
	
	this.accNmComp = this.findCompById('AccNm');
	this.bankNmComp = this.findCompById('BankNm');
	this.bankAccNoComp = this.findCompById('BankAccNo');
	this.accNm_TitleComp = this.findCompById('AccNm_Title');
	
	this.contiKey = null;
	
	this.accNm = '';
	
	this.accNmComp.setText('');
	this.bankNmComp.setText('');
	this.bankAccNoComp.setText('');
	
	this.accView.doInitAccInfo(0);
};

//계좌번호 변경 시 이벤트
FD3202_W12.prototype.fnDoSendDataManage = function()
{
	//alert("yjhan1 팝업창 계좌변경시 이벤트 ");
	this.sendSACAQ501(0);
};


//자동이체내역 조회 서비스 전송
FD3202_W12.prototype.sendSACAQ501 = function(type)
{
	afc.log("sendSACAQ501 start");
	
	/*
	var thisObj = this
		,qrName = "SACAQ501"
		,cont = this.getContainer()
		,cipherData = thisObj.secureTxf.getCipherData();
	*/
	var thisObj = this
		,qrName = "SACAQ501"
		//,cont = this.getContainer();
		,cont = thisObj.opener.getContainer();
		
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	/*
	if(!afc.isSimulator && !cipherData) {
		AToast.show('계좌 비밀번호를 입력하세요.');
		return;
	}
	*/
	
	//재조회
	if(type || !this.contiKey) {
		this.contiKey = null;
	}
	
	var checkObj = {
		svcId : qrName,
		accNo : this.accDbx.getSelectedItemData()['D1계좌번호']
	};
	
	var accNm = this.accDbx.getSelectedItemData()['D1계좌명'];
	
	thisObj.accNm_TitleComp.setText(accNm);

	cont.sendData(qrName, 
			function(queryData, groupName)
			{
				var InBlock1 = queryData.getBlockData('InBlock1')[0];

				InBlock1['D1계좌구분'] = '1';
				InBlock1['D1계좌번호'] = checkObj.accNo;
				//InBlock1['D1입력비밀번호'] = '';
				InBlock1["D1서비스종류코드"] = 'zzzz';
				
				queryData.setContiKey(thisObj.contiKey);
			},
			function(queryData, groupName)
			{
				if(queryData)
				{	
					//next키 저장
					thisObj.contiKey = queryData.getContiKey();
				
					var outBlock1 = queryData.getBlockData('OutBlock1');
					var outBlock2 = queryData.getBlockData('OutBlock2');
					
					thisObj.accNm = outBlock1['D1계좌명'];
					
					afc.log(outBlock1['D1계좌명']);
					
					if(outBlock2.length == 0)
					{
						AToast.show("조회 내역이 없습니다.");
					}
					else 
					{
						for(var i=0; i<outBlock2.length; i++)
						{
							var serviceCd = outBlock2[i]['D1서비스종류코드'];
						
							afc.log("serviceCd: " + serviceCd);
						
							if(serviceCd == '1410') // 가상계좌
							{
								thisObj.accNmComp.setText(outBlock2[i]['D1상대거래계좌명']);
								thisObj.bankNmComp.setText(outBlock2[i]['D1거래기관명']);
								thisObj.bankAccNoComp.setText(outBlock2[i]['D1상대기관계좌번호']);
								
								// 일단 한건만.....-_-;
								return;
							}
						}
					}
				}
			}		
		);
		
	/*
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				var InBlock1 = queryData.getBlockData('InBlock1')[0];

				InBlock1['D1계좌구분'] = '1';
				InBlock1['D1계좌번호'] = checkObj.accNo;
				//InBlock1['D1입력비밀번호'] = afc.isSimulator ? '0423' : result;
				InBlock1['D1입력비밀번호'] = '';
				InBlock1["D1서비스종류코드"] = '1410';
				
				queryData.setContiKey(thisObj.contiKey);
				
				//if(!afc.isSimulator){
				//	queryData.putPwInfo('InBlock1', 'D1비밀번호');
				//}
			},
			function(queryData, groupName)
			{
				if(queryData)
				{	
					//next키 저장
					thisObj.contiKey = queryData.getContiKey();
				
					var outBlock1 = queryData.getBlockData('OutBlock1');
					var outBlock2 = queryData.getBlockData('OutBlock2');
					
					thisObj.accNm = outBlock1['D1계좌명'];
					
					afc.log(outBlock1['D1계좌명']);
					
					//thisObj.accNmComp.setText(thisObj.accNm);
					
					if(outBlock2.length == 0)
					{
						AToast.show("조회 내역이 없습니다.");
					}
					else 
					{
						for(var i=0; i<outBlock2.length; i++)
						{
							var serviceCd = outBlock2[i]['D1서비스종류코드'];
						
							afc.log("serviceCd: " + serviceCd);
						
							if(serviceCd == '1410') // 가상계좌
							{
								//thisObj.accNmComp()D1상대거래계좌명
								thisObj.accNmComp.setText(outBlock2[i]['D1상대거래계좌명']);
								thisObj.bankNmComp.setText(outBlock2[i]['D1거래기관명']);
								thisObj.bankAccNoComp.setText(outBlock2[i]['D1상대기관계좌번호']);
								
								// 일단 한건만.....-_-;
								return;
							}
						}
					}
				}
			}		
		);
	});
	*/
};


FD3202_W12.prototype.onbtnCloseClick = function(comp, info)
{
	//TODO:edit here
	this.close(0);
};

FD3202_W12.prototype.onconfirmBtnClick = function(comp, info)
{
	//TODO:edit here
	this.close(0);
	
};
