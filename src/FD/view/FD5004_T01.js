
/**
Constructor
Do not call Function in Constructor.
*/
function FD5004_T01()
{
	AView.call(this);

	//TODO:edit here
	
	this.g_nowTime = null; 				// 현재시간 조회 체크	
	this.g_bizDateCheck = null;			// 영업일인지 아닌지 체크 0:영업일아님,1:영업일
	
	this.g_tradeState = null;			// 현재 매매가능상태 1:일반펀드매수매도, 2: 예약펀드매수매도, 3:펀드매수불가

}
afc.extendsClass(FD5004_T01, AView);


FD5004_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	this.listView = this.findCompById('ListView1');
	this.listView.setDelegator(this);
	this.nodata = this.findCompById('Nodata');
	this.nodataLbl = this.findCompById("NodataLbl");	
	this.accView = this.findCompById('AccView').viewLoad('FD/view/FD0000_V00.lay');;
	this.accDbx = this.accView.accDbx;
	this.accView.setDelegator(this);
	this.secureTxf = this.accView.secureTxf;
};

FD5004_T01.prototype.bindData = function(item, data, listview){	
	if(item.view.setData){
		item.view.setData(data);
	}
};


//화면이 활성화된 후 이벤트
FD5004_T01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	
	this.contiKey = null; // 연속키 초기화
	this.fundSellInfo = null;
	this.listView.removeAllItems();
	this.accView.doInitAccInfo(5);
};


//화면이 소멸되기 전 이벤트
FD5004_T01.prototype.onWillDeactive = function(reload)
{		
	this.onArrInit();
};

//초기화
FD5004_T01.prototype.onArrInit = function()
{
	this.nodata.show(AComponent.VISIBLE);
	this.listView.removeAllItems();
};



FD5004_T01.prototype.fnDoSendDataManage = function()
{
	
	// 다시 조회할 때 리스트 아이템 제거
	this.listView.removeAllItems();
	
	// 하단 이미지 변경
	this.nodata.show(AComponent.VISIBLE);
	
	// 시뮬레이터가 아니면서 계좌비밀번호가 있어야만 아래의 함수를 실행
	if(!afc.isSimulator){
		if(this.secureTxf.getCipherData()){
			this.secureTxf.removeClass('active');
			this.sendDataSOFFQ365();
		}else{
			this.nodataLbl.setText("계좌비밀번호를 입력해주세요.");
			AToast.show("계좌비밀번호를 입력하세요");
			this.secureTxf.addClass('active');
		}
	}else{
		this.sendDataSOFFQ365();
	}
}

FD5004_T01.prototype.sendDataSOFFQ365 = function()
{
	var thisObj = this	
		,cont = thisObj.getContainer()
		,qrName = "SOFFQ365"
		,cipherData = thisObj.secureTxf.getCipherData();		
		
	if(!thisObj.accDbx.getSelectedItemData() || !thisObj.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator)
	{
		if(!cipherData)
		{
			AToast.show('계좌 비밀번호를 입력하세요.');
			return;
		}
	}
	
	var checkObj = {
		svcId : qrName,
		accNo : thisObj.accDbx.getSelectedItemData()['D1계좌번호']
	};
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
				InBlock1['D1계좌번호'] = checkObj.accNo;
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;
				InBlock1['D1잔고유무여부'] = '1'; // 1:잔고가 있는것만 조회, 공백:가입된 펀드 모두 조회
				queryData.printQueryData();
			},
			function(queryData, groupName)
			{				
				var errMsg = this.getLastError('errMsg');
				var errCode = this.getLastError('errCode');
						
				if(queryData)
				{
					var OutBlock2 = queryData.getBlockData('OutBlock2');
					queryData.printQueryData();
					
					if(OutBlock2.length == 0){
						thisObj.nodataLbl.setText("조회 내역이 없습니다.");
						thisObj.nodata.show(AComponent.VISIBLE);
						
						var param = {
							"title" : "",
							"contents" : '고객님의 계좌에 매도가능한 </br> 펀드가 없습니다.',
							"btnText" : '확인',
							"returnType" : "0",
							"returnData" : ""
						};
						
						PensionCommon.oneBtnPopup(this,param);
					}
					else{
						thisObj.nodata.show(AComponent.GONE);
						thisObj.listViewPrint(OutBlock2);
					}
				}
			}
		);
	});
};


FD5004_T01.prototype.listViewPrint = function(outBlock)
{
	var data = [];
	for(var i=0;i<outBlock.length;i++){
		data.push({"a1" : outBlock[i]['D1펀드명'],
			"a2" : outBlock[i]['D1납입방법명'],
			"a3" : outBlock[i]['D1계좌일련번호'],
			"a4" : this.accDbx.getSelectedItemData()['D1계좌번호'],
			"a5" : afc.isSimulator ? '0423' : this.secureTxf.getCipherData(),
 			"a6" : outBlock[i]
		});
	}
	this.listView.addItem('FD/view/FD5004_L01.lay', data);
}



