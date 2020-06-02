
/**
Constructor
Do not call Function in Constructor.
*/
function FD2201_T01()
{
	AView.call(this);	
}
afc.extendsClass(FD2201_T01, AView);


//초기화
FD2201_T01.prototype.onArrInit = function()
{
	this.accNm = '';
	this.bankNm = '';
};


FD2201_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);	
			
	this.accView = this.findCompById('AccView').viewLoad('FD/view/FD0000_V03.lay');
	this.accDbx = this.accView.accDbx;
	this.secureTxf = this.accView.secureTxf;
	
	this.accNmComp = this.findCompById('AccNm');
	this.bankNmComp = this.findCompById('BankNm');
	this.bankAccNoComp = this.findCompById('BankAccNo');
	this.accNm_TitleComp = this.findCompById('AccNm_Title');
	
	this.contiKey = null;
};

//화면이 활성화된 후 이벤트
FD2201_T01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	this.accNm = '';
	
	this.accNmComp.setText('');
	this.bankNmComp.setText('');
	this.bankAccNoComp.setText('');
	

	
	this.accView.doInitAccInfo(0);
};

//계좌번호 변경 시 이벤트
FD2201_T01.prototype.fnDoSendDataManage = function()
{
	this.sendSACAQ501(0);
};

//자동이체내역 조회 서비스 전송
FD2201_T01.prototype.sendSACAQ501 = function(type)
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

//화면이 소멸되기 전 이벤트
FD2201_T01.prototype.onWillDeactive = function(reload)
{		
	this.onArrInit();
};

//가상계좌번호 자동 복사 이벤트
//chrome 43 이상, safari 10 이상 기능 동작
FD2201_T01.prototype.onBankAccNoActionUp = function(comp, info)
{
	var text = comp.getText();
	
	//textarea, input만 복사 가능하므로 임시 textarea 생성 후 복사 기능 추가
	var textarea = document.createElement('textarea');
	textarea.id = 'temp_element';
	textarea.style.height = 0;
	document.body.appendChild(textarea);
	textarea.value = text;
	
	if(afc.isIos)
	{
		var range = document.createRange();
		textarea.contentEditable = true;
		textarea.readOnly = false;
		range.selectNodeContents(textarea);

		textarea.setSelectionRange(0, 999999);
	}
	else
	{
		var selector = document.querySelector('#temp_element');
		selector.select();
	}

	var isCopied = document.execCommand('copy');
	//임시 textarea 삭제
	document.body.removeChild(textarea);

	if(isCopied)
		AToast.show('계좌번호가 복사되었습니다.');
};