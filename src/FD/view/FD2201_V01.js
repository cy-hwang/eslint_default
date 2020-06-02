
/**
Constructor
Do not call Function in Constructor.
*/
function FD2201_V01()
{
	AView.call(this);	
}
afc.extendsClass(FD2201_V01, AView);


//초기화
FD2201_V01.prototype.onArrInit = function()
{
	this.accNm = '';
	this.bankNm = '';
};


FD2201_V01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);	
	
	this.cnt =  this.getContainer();
			
	this.accView = this.findCompById('AccView').viewLoad('FD/view/FD0000_V03.lay');
	this.accDbx = this.accView.accDbx;
	this.secureTxf = this.accView.secureTxf;
	
	this.accNmComp = this.findCompById('AccNm');
	this.bankNmComp = this.findCompById('BankNm');
	this.bankAccNoComp = this.findCompById('BankAccNo');
	this.accNm_TitleComp = this.findCompById('AccNm_Title');
	this.regBtn = this.findCompById("RegBtn");
	this.modiBtn = this.findCompById("ModiBtn");
	this.rdoManager = new RadioBtnManager(this);
	this.rdoManager.selectButton(this.regBtn);
	
	this.contiKey = null;
};


//화면이 활성화된 후 이벤트
FD2201_V01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	this.accNm = '';
	
	this.accNmComp.setText('');
	this.bankNmComp.setText('');
	this.bankAccNoComp.setText('');
	
	this.accView.doInitAccInfo(0);
	this.scrollToTop();
};

//계좌번호 변경 시 이벤트
FD2201_V01.prototype.fnDoSendDataManage = function()
{
	this.sendSACAQ501(0);
};

//자동이체내역 조회 서비스 전송
FD2201_V01.prototype.sendSACAQ501 = function(type)
{
	var thisObj = this		
		,qrName = "SACAQ501"
		,cont = this.getContainer();
		
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
				InBlock1["D1서비스종류코드"] = '1105';
				
				queryData.setContiKey(thisObj.contiKey);
				
				//if(!afc.isSimulator){
				//	queryData.putPwInfo('InBlock1', 'D1입력비밀번호');
				//}
			},
			function(queryData, groupName)
			{
				if(queryData)
				{	
					if(afc.isSimulator) queryData.printQueryData();
					//next키 저장
					thisObj.contiKey = queryData.getContiKey();
				
					var outBlock1 = queryData.getBlockData('OutBlock1');
					var outBlock2 = queryData.getBlockData('OutBlock2');
					
					thisObj.accNm = outBlock1['D1계좌명'];
					
					if(outBlock2.length == 0)
					{
						//AToast.show("조회 내역이 없습니다.");
						thisObj.accNmComp.setText("");
						thisObj.bankNmComp.setText("");
						thisObj.bankAccNoComp.setText("");
						
						thisObj.cnt.tbvManager.getActiveView().setAcntInfo(
									"", "", "", 
									accNm, checkObj.accNo);
									
						thisObj.rdoManager.selectButton(thisObj.modiBtn);
					}
					else 
					{
						for(var i=0; i<outBlock2.length; i++)
						{
							var serviceCd = outBlock2[i]['D1서비스종류코드'];
						
							if(serviceCd == '1105') // 가상계좌
							{
								//thisObj.accNmComp()D1상대거래계좌명
								thisObj.accNmComp.setText(outBlock2[i]['D1상대거래계좌명']);
								thisObj.bankNmComp.setText(outBlock2[i]['D1거래기관명']);
								thisObj.bankAccNoComp.setText(outBlock2[i]['D1상대기관계좌번호']);
								
								thisObj.cnt.tbvManager.getActiveView().setAcntInfo(
									outBlock2[i]['D1상대거래계좌명'], outBlock2[i]['D1상대기관코드'], outBlock2[i]['D1상대기관계좌번호'], 
									accNm, checkObj.accNo);
								
								thisObj.rdoManager.selectButton(thisObj.regBtn);
								
								// 일단 한건만.....-_-;
								return;
							}
						}
					}
				}
			}		
		);
};


//화면이 소멸되기 전 이벤트
FD2201_V01.prototype.onWillDeactive = function(reload)
{		
	this.onArrInit();
};

FD2201_V01.prototype.onRegBtnClick = function(comp, info)
{
	this.cnt.tbvManager.getActiveView().tvManager.changeTab('TabBtn2');
};

FD2201_V01.prototype.onModiBtnClick = function(comp, info)
{
	this.cnt.tbvManager.getActiveView().tvManager.changeTab('TabBtn2');
};
