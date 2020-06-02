
/**
 적립식매수현황(자동이체 내역 조회/취소)
*/
function FD5008_T02()
{
	AView.call(this);
	
}
afc.extendsClass(FD5008_T02, AView);

FD5008_T02.prototype.init = function(context, evtListener)
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
};


//화면이 활성화된 후 이벤트
FD5008_T02.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);		
	
	//조회 키 
	this.contiKey = null;
	this.SACAQ532contiKey = null;
	this.data = [] //list array
	this.service = [] //서브계좌 array
	this.SOFFQ586subAcc = []//SOFFQ586 서브계좌 array 
	//this.sendSACMQ619(); 
	
	// 계좌번호 리로드
	var cont = this.getContainer();
	cont.accView.doInitAccInfo(5);	//0: 종합계좌번호, 4: 투신상품계좌번호 5:연금펀드 
}


//화면이 소멸되기 전 이벤트
FD5008_T02.prototype.onWillDeactive = function(reload)
{		
	this.onArrInit();
};

//초기화
FD5008_T02.prototype.onArrInit = function()
{
	this.nodata.show(AComponent.VISIBLE);
	this.label8.setText('총 0건');
	this.FDlistView.removeAllItems();
	this.length = 0;
	
};


// 서비스 조회
FD5008_T02.prototype.sendSACAQ532 = function(subAcc,i,callback)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	// 등록된 내용이 없습니다. Skip 처리
	theApp.accNetManager.addSkipErrorCode('SACAQ532', '2679');
	
	
	if(!thisObj.SACAQ532contiKey) 
	{
		thisObj.SACAQ532contiKey = null;
	}	
	
	
	cont.sendData('SACAQ532',
		function(queryData, groupName)
		{
			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1계좌구분'] = '3';
			InBlock1['D1계좌번호'] = subAcc;
			InBlock1['D1입력비밀번호'] = '1';
			InBlock1['D1서비스종류코드'] = '3206';
			queryData.setContiKey(thisObj.SACAQ532contiKey);
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{
			if(queryData)
			{
				
				thisObj.SACAQ532contiKey = queryData.getContiKey();
				if(afc.isSimulator) queryData.printQueryData();
				var OutBlock2 = queryData.getBlockData('OutBlock2');
				thisObj.setServiceNum(OutBlock2);
				
				var callback = function(){
					
					thisObj.callSACAQ532(i+1); //다른 서브 계좌로 다시 조회 callback으로 순서대로 .. 
				}
				
				
				if(thisObj.SACAQ532contiKey)
				{
					thisObj.sendSACAQ532(subAcc,i,callback);
				}else{
					callback.call();
				}
			}
		}
	)
	
};

//SACAQ532에서 모은 서브계좌 array 나중에 자동이체내역와 비교할거임 
FD5008_T02.prototype.setServiceNum = function(OutBlock2)
{
	
	for(var i=0;i<OutBlock2.length;i++){
		this.service.push({
			"subAcc" : OutBlock2[i]['D1상대기관계좌번호']
		})
	}
	
}

//계좌번호 변경 시 이벤트
FD5008_T02.prototype.fnDoSendDataManage = function()
{
	this.label8.setText('총 0건');
	this.nodataLbl.setText("조회 내역이 없습니다.");
	this.nodata.show(AComponent.VISIBLE);
	this.FDlistView.removeAllItems();
	this.contiKey = null;
	this.SACAQ532contiKey = null;
	this.length = 0;
	
	this.service = []
	this.data = []
	this.SOFFQ586subAcc = []
	this.sendSACMQ619(); 
	
};

//자동이체내역 조회 서비스 전송
//2019.06.04 적립식 매수현황 전문을 SOFFQ586 에서 SACMQ619 로 변경
FD5008_T02.prototype.sendSACMQ619 = function()
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
		this.nodataLbl.setText("조회 내역이 없습니다.");
		this.nodata.show(AComponent.VISIBLE);
		this.contiKey = null;
		this.length = 0;
		this.label8.setText('총 0건');
	}	
	
	var checkObj = {
		svcId : qrName,
		accNo : cont.accDbx.getSelectedItemData()['D1계좌번호']
	};
	
	// 윈도우로 넘기기 위해.
	this.accPwd = cipherData;
	
	theApp.accNetManager.addSkipErrorCode('SACMQ619', '2679');
	
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
				
				if(queryData)
				{
					//queryData.printQueryData();
				
					//next키 저장
					thisObj.contiKey = queryData.getContiKey();
					
					var inBlock1	= queryData.getBlockData('InBlock1');
					var outBlock1	= queryData.getBlockData('OutBlock1');
					var outBlock2	= queryData.getBlockData('OutBlock1');
					
					if(outBlock2.length == 0) {
						thisObj.nodataLbl.setText("조회 내역이 없습니다.");
						thisObj.nodata.show(AComponent.VISIBLE);
						AToast.show("조회 내역이 없습니다.");
					} else {												
						
						thisObj.setSubAcc(outBlock2); //일단 서브계좌를 모은다
					
						thisObj.setListView(inBlock1, outBlock1, outBlock2)//list add 데이터 모은다 

						if(thisObj.contiKey) 
						{
							thisObj.sendSACMQ619(); //contikey있으면 다시 조회 
						}else{
							
							thisObj.callSACAQ532(0) //없음 sendSACAQ532로 가기위해 
						}
							
					}
					
				}
			}
		);
	});
};

//일단 서브계좌를 모은다
FD5008_T02.prototype.setSubAcc = function(outBlock2)
{

	for(var i = 0;i<outBlock2.length;i++){
		// 2019.06.04 적립식 매수현황 전문을 SOFFQ586 에서 SACMQ619 로 변경으로 
		// D1CMS약정여부 와 D1대체약정여부 체크 X			
		this.SOFFQ586subAcc.push({
			"subAcc" : outBlock2[i]['D1서브계좌번호']
		})		
	}
	
}

//한번에 하나의 서브계좌밖에 조회 되지 않기때문에 하나씩 서브계좌 서비스를 조회한다 
FD5008_T02.prototype.callSACAQ532 = function(i)
{
	
	if(i < this.SOFFQ586subAcc.length){
		this.sendSACAQ532(this.SOFFQ586subAcc[i].subAcc,i,'');
	}else{
		
		this.listViewPrint(); //list 보여줌 
	}
}

//list add 데이터 모은다 
FD5008_T02.prototype.setListView = function(inBlock, outBlock1, outBlock2)
{
	
	var outlength = outBlock2.length;

	for(var i = 0; i < outlength; i++)
	{
		// 2019.06.04 적립식 매수현황 전문을 SOFFQ586 에서 SACMQ619 로 변경으로 
		// D1CMS약정여부 와 D1대체약정여부 체크 X

		this.data.push({"a1": outBlock2[i]['D1서브계좌번호'].substr(outBlock2[i]['D1서브계좌번호'].length-3, 3)
					   ,"a2": outBlock2[i]['D1납입방법명']
					   ,"a3": outBlock2[i]['D1펀드명']
					   ,"a4": inBlock
					   ,"a5": outBlock1
					   ,"a6": outBlock2[i]
					   ,"a7": this.accPwd });

	}
}

//list 보여줌 
FD5008_T02.prototype.listViewPrint = function()
{
	
	
	if(this.data.length == 0){
		this.nodataLbl.setText("조회 내역이 없습니다.");
		this.nodata.show(AComponent.VISIBLE);
		AToast.show("조회 내역이 없습니다.");
		return;
	}
	
	for(var i = 0; i < this.data.length; i++)
	{
		
		this.nodata.show(AComponent.GONE);
	
		for(var j=0;j<this.service.length;j++){
			if(this.data[i].a2 != "월정액적립식"){
				if(this.service[j].subAcc == this.data[i].a6['D1서브계좌번호']){
					this.data[i].a2 = "일정액적립식";
					break;
				}else{
					this.data[i].a2 = "자유적립식";
				}
			}
			
		}

	}

	this.label8.setText( '총 ' + this.data.length + '건');	
	
	this.FDlistView.addItem('FD/view/FD5008_L02.lay', this.data);
};



// 펀드정보 데이터 출력
FD5008_T02.prototype.bindData = function(item, data, listview){	
	if(item.view.setData){
		item.view.setData(data);
	}
};


FD5008_T02.prototype.onListView1ScrollBottom = function(comp, info)
{
	if(this.contiKey) 
	{
		
	}
	else
	{	
		if(comp.getItemCount() > 0) AToast.show(Message.LastList);
	}

};
