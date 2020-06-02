
/**
 2018.03.16 KYH
 적립식매수현황(자동이체 내역 조회/취소)
*/
function FD1201_T02()
{
	AView.call(this);
}
afc.extendsClass(FD1201_T02, AView);

FD1201_T02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);	
	
	//추가 조회 용 키
	this.contiKey = null;
	
	this.FDlistView = this.findCompById('ListView1');
	this.FDlistView.setDelegator(this);
	
	this.selSubAccNo = null;
	
	this.label8 = this.findCompById('Label8');
	
	this.nodata = this.findCompById('Nodata');
	this.nodataLbl = this.findCompById("NodataLbl");
		
	this.length = 0;
	
	this.accPwd = null;

	this.basePriceTp = '0';

	this.sDate = MetaInfo.fnGetToday('NUMDATE');
	
};


//화면이 활성화된 후 이벤트
FD1201_T02.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);		
	
	this.FDlistView.removeAllItems();
	
	this.contiKey = null;

	//this.sendDataFunc(true);
	
	// 계좌번호 리로드
	var cont = this.getContainer();
	cont.accView.doInitAccInfo(4);	//0: 종합계좌번호, 4: 투신상품계좌번호 5:연금펀드 
};


//화면이 소멸되기 전 이벤트
FD1201_T02.prototype.onWillDeactive = function(reload)
{		
	this.onArrInit();
};

//초기화
FD1201_T02.prototype.onArrInit = function()
{
	this.nodata.show(AComponent.VISIBLE);
	this.label8.setText('총 0건');
	this.length = 0;
};


//계좌번호 변경 시 이벤트
FD1201_T02.prototype.fnDoSendDataManage = function()
{
	this.sendDataFunc(0);
};
FD1201_T02.prototype.sendDataFunc = function(type)
{
	this.sendSACMQ619(type);
	/*if(this.basePriceTp == '1')
	{
		var d= new Date();
		d.setDate(d.getDate() - 1);
		this.sDate = d.format('yyyyMMdd');
		this.sendSACMQ619(type);

	}*/
	
};


//자동이체내역 조회 서비스 전송
//2019.06.04 적립식 매수현황 전문을 SOFFQ586 에서 SACMQ619 로 변경
FD1201_T02.prototype.sendSACMQ619 = function(type)
{
	var thisObj = this		
		,qrName = "SACMQ619"
		,cont = this.getContainer()
		,cipherData = this.getContainer().secureTxf.getCipherData();
		
	if(!cont.accDbx.getSelectedItemData() || !cont.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	if(!afc.isSimulator && !cipherData) {
		thisObj.nodataLbl.setText("계좌비밀번호를 입력해주세요.");
		AToast.show('계좌 비밀번호를 입력하세요.');
		cont.secureTxf.addClass('active');
		return;
	}
	
	cont.secureTxf.removeClass('active');
	
	if(!this.contiKey) 
	{
		this.FDlistView.removeAllItems();
		this.contiKey = null;
		this.length = 0;
	}	
	
	var checkObj = {
		svcId : qrName,
		accNo : cont.accDbx.getSelectedItemData()['D1계좌번호']
	};
		
	// 윈도우로 넘기기 위해.
	this.accPwd = cipherData;
	
	theApp.accNetManager.addSkipErrorCode('SACMQ619', '2679');
	//theApp.accNetManager.addSkipErrorCode('SOFFQ586', '3742');
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName, 
			function(queryData, groupName)
			{
				var InBlock1 = queryData.getBlockData('InBlock1')[0];
										
				InBlock1['D1계좌번호'] = checkObj.accNo;
				InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : result;
				
				queryData.setContiKey(thisObj.contiKey);
				
				if(!afc.isSimulator){
					queryData.putPwInfo('InBlock1', 'D1비밀번호');
				}
				
				//queryData.printQueryData();
			},
			function(queryData, groupName)
			{
				var errorData = this.getLastError();	

				/*if(errorData.errCode == '3742'&& thisObj.basePriceTp == '0') {
					thisObj.basePriceTp = '1';
					return;
				}
				else{
					thisObj.basePriceTp = '0';
				}*/
				if(queryData)
				{
					//next키 저장
					thisObj.contiKey = queryData.getContiKey();
				
					//queryData.printQueryData();
					var inBlock1	= queryData.getBlockData('InBlock1');
					var outBlock1	= queryData.getBlockData('OutBlock1');					
										
					if(!outBlock1 || outBlock1.length == 0) {
						thisObj.nodataLbl.setText("조회 내역이 없습니다.");
						thisObj.nodata.show(AComponent.VISIBLE);
					} else {
						thisObj.nodata.show(AComponent.GONE);
					}										
					
					if(outBlock1.length == 0)
					{
						AToast.show("조회 내역이 없습니다.");
					}
					else 
					{
						thisObj.listViewPrint(inBlock1, outBlock1);
						
						if(thisObj.contiKey) 
						{
							thisObj.sendDataFunc();
						}
					}
				}
			}
		);
	});
};

FD1201_T02.prototype.listViewPrint = function(inBlock, outBlock1)
{
	var outlength = outBlock1.length;
	
	var i = 0;
	var data = [];

	// 비반복 데이타를 매번 넘기는게 찝찝하지만...
	
	for( i = 0; i < outlength; i++)
	{
		//if(outBlock2[i]['D1CMS약정여부'] == '1')
//		if(outBlock2[i]['D1CMS약정여부'] == '1' || outBlock2[i]['D1대체약정여부'] == '1')
//		{
			// 자유적립식이 현재 없고 일정액적립식 사용할 때 자유적립식으로 가입하므로 내려오는 데이터 변경
			if(outBlock1[i]["D1납입방법명"] == "자유적립식"){
				outBlock1[i]["D1납입방법명"] = "일정액적립식";
			}
			
			data.push({"a1": outBlock1[i]['D1서브계좌번호'].substr(outBlock1[i]['D1서브계좌번호'].length-3, 3)
						,"a2": outBlock1[i]['D1납입방법명']
						,"a3": outBlock1[i]['D1펀드명']
						,"a4": inBlock
						,"a5": outBlock1
						,"a6": outBlock1[i]
						,"a7": this.accPwd });

			this.length++;
			this.label8.setText( '총 ' + this.length + '건');
//		}
	}
	
	this.FDlistView.addItem('FD/view/FD3203_L02.lay', data);
};

// 펀드정보 데이터 출력
FD1201_T02.prototype.bindData = function(item, data, listview){	
	if(item.view.setData){
		item.view.setData(data);
	}
};

FD1201_T02.prototype.onListView1ScrollBottom = function(comp, info)
{
	if(this.contiKey) 
	{
		this.sendDataFunc();
	}
	else
	{	
		if(comp.getItemCount() > 0) AToast.show(Message.LastList);
	}

};
