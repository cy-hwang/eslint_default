
/**
Constructor
Do not call Function in Constructor.
*/
function FD5006_T02()
{
	AView.call(this);	
}
afc.extendsClass(FD5006_T02, AView);


FD5006_T02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	// Object
	this.cont = this.getContainer();

	// 계좌
	this.accView = this.cont.findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx; 			// 계좌드롭박스
	this.secureTxf = this.accView.secureTxf;	// 계좌비밀번호
	
	// 보유상품현황 파이차트
	this.pieChart = this.findCompById('Canvas1');
 
	// 보유상품현황 리스트
	this.listView = this.findCompById('ListView1');	
	this.listView.setDelegator(this);
	this.listView.setOption({'isUpdatePosition' : true});
	
	// 보유한 상품이 없을 시 보여주는 메시지
	this.txtNoFund = this.findCompById('Label10');	
	
	// 보유자산 그리드
	this.grid = this.findCompById('Grid2');
	
	// 2019.10.18. 조회표시 기준일자 
	this.lblStandDate = this.findCompById('LblStandDate');
	
	// Color
	this.moneyColor = '#FE8D19';
	this.fundColor = ['#DE5E5F', '#6A71CF', '#45A8C5', '#3C927C', '#41707D', '#BB66D0', '#925F5D', '#60964F', '#4855A5'];
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5006_T02.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	this.fnDoSendDataManage();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5006_T02.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5006_T02.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.$ele.parent().scrollTop(0);
};


// 컴포넌트 초기화
FD5006_T02.prototype.onInitComponents = function()
{
	// 그리드 데이터
	this.money1 = 0;	// 현금 
	this.money2 = 0;	// 투자원금
	this.money3 = 0;	// 펀드평가액(세전)
	this.money4 = 0;	// 수익률(세전)
	
	// 리스트 아이템
	this.listItem = [];
	
	
	// 계좌 컨트롤
	this.cont.onAccViewControl();
	
	// 컴포넌트 숨기기
	this.txtNoFund.show(AComponent.GONE);	// 라벨
	this.pieChart.show(AComponent.GONE);	// 차트 
 	this.listView.show(AComponent.GONE);	// 리스트
	
	// 그리드뷰 초기화
	for(var i=0; i<6; i++)
	{
		this.grid.setCellText(i, 1, "");
	}
	
	// 리스트뷰 내의 모든 아이템 삭제
	this.listView.removeAllItems();
	
	// 2019.10.18. 조회표시 기준일자 
	this.lblStandDate.setText('');
	
};


// 계좌번호 변경 시 이벤트
FD5006_T02.prototype.fnDoSendDataManage = function() 
{
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 계좌번호 저장
	PensionCommon.setFundAcc(this);
	
	// 서비스 조회
	this.sendSDPAQ001();	
};


// 서비스 조회
FD5006_T02.prototype.sendSDPAQ001 = function()
{
	var thisObj = this;
	
	// 계좌번호가 없으면
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	// 리스트뷰 내의 모든 아이템 삭제
	thisObj.listView.removeAllItems();
	
	// 조회
	this.cont.sendData('SDPAQ001', 
		function(queryData, groupName)
		{
			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
			InBlock1['D1비밀번호'] = '';
			
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{
			if(!queryData)
			{
				thisObj.sendSOFFQ447();
				return;
			}
			else // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock4 = queryData.getBlockData('OutBlock4')[0];
				
				if(!OutBlock4) return;
				
				thisObj.money1 = OutBlock4['D1예수금총액'];
				
				thisObj.sendSOFFQ447();
			}
		}
	);
};


// 서비스 조회
FD5006_T02.prototype.sendSOFFQ447 = function(contiKey)
{
	var thisObj = this;

	// 계좌번호가 없으면
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		return;
	}

	// 연속키가 없으면
	if(!contiKey)	
	{
		// 리스트뷰 내의 모든 아이템 삭제
		thisObj.listView.removeAllItems();	
	}

	// 등록된 내용이 없습니다. Skip 처리
	theApp.accNetManager.addSkipErrorCode('SOFFQ447', '2679');
	// 펀드 기준가 오픈전입니다. 기준가 오픈후 조회 가능합니다.(SOFFQ447, 3742) Skip 처리
	theApp.accNetManager.addSkipErrorCode('SOFFQ447', '3742');
	
	// 조회
	this.cont.sendData('SOFFQ447',
		function(queryData, groupName)
		{
			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});
			
			// 2019.10.18. 조회표시 기준일자 
			var standDate = Utils.yyyymmdd(new Date());
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1조회구분'] = '1';	// Default
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
			InBlock1['D1비밀번호'] = '';
			InBlock1['D1실명확인번호'] = '';
			InBlock1['D1기준일'] = standDate;
			
			thisObj.lblStandDate.setText("(" + standDate.substring(0,4) + "." + standDate.substring(4,6) + "." + standDate.substring(6,8) + " 기준)");
			
			if(afc.isSimulator) queryData.printQueryData();
			
			if(contiKey) // 연속키가 있으면
			{
				queryData.setContiKey(contiKey); // 연속키 저장
			}
		},
		function(queryData, groupName)
		{
		
			theApp.accNetManager.removeSkipErrorCode('SOFFQ447', '3742');
			
			var errorData = this.getLastError();	
			
			if(errorData.errCode == '3742') {

				var Msg = ['오전 9시이후부터','<br/>','조회하실 수 있습니다.','<br/>','(한국시간기준)'].join('');

				theApp.alert(Msg,null,"알림");

			}
		
			if(!queryData)
			{
				thisObj.setGridList();	
				return;
			}
			else // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
				var OutBlock2 = queryData.getBlockData('OutBlock2');
		
				// 그리드
				thisObj.money2 = OutBlock1['D1원금합계금액'];
				thisObj.money3 = OutBlock1['D1평가금액합계'];
				thisObj.money4 = OutBlock1['D1평가수익률'];
				
				// 리스트
				OutBlock2.forEach(function(outblock) {
					thisObj.listItem.push({
						"FundNm" 		: outblock['D1펀드명'], 
						"OrgAmt" 		: outblock['D1원금액'], 
						"EvalAmt" 		: outblock['D1평가금액'], 
						"BnsBasePrc" 	: outblock['D1매매기준가'], 
						"FundBalQty" 	: outblock['D1펀드잔고수량']
					});
				});
				
				// 연속키 저장
				var nextKey = queryData.getContiKey();
				
				// 연속키가 있으면
				if(nextKey)
				{
					thisObj.sendSOFFQ447(nextKey);
				}
				else // 연속키가 없으면
				{
					thisObj.setGridList();
					return;
				}
			}
		}
	);	
};


// 보유상품현황 및 보유자산 셋팅
FD5006_T02.prototype.setGridList = function()
{
	var visible = this.setTxtNoFund();
	if(visible == "T") // 보유한 상품이 없으면
	{
		this.pieChart.show(AComponent.GONE);
 		this.listView.show(AComponent.GONE);
	}
	else
	{
		this.setChart();
	}
	
	this.setGrid();
};


// 메시지 visible 처리
FD5006_T02.prototype.setTxtNoFund = function()
{
	var total = this.money3 + this.money1;
	if(total <= 0) 
	{
		this.txtNoFund.show(AComponent.VISIBLE);
		return "T";
	}
};


// 차트 셋팅
FD5006_T02.prototype.setChart = function()
{
	this.pieChart.show(AComponent.VISIBLE);
 	this.listView.show(AComponent.VISIBLE);
		
	var total = this.money3 + this.money1;
	var color = [this.moneyColor];
	
	var rates = [{
		'name' 	: '현금', 
		'data' 	: this.money1 * 100 / total, 
		'color' : this.moneyColor
	}];
	
	// 리스트
	for(var i=0; i<this.listItem.length; i++) 
	{
		rates.push({
			'name' 	: this.listItem[i]['FundNm'], 
			'data' 	: this.listItem[i]['EvalAmt'] * 100 / total, 
			'color' : this.fundColor[i%9]
		});
		
		color.push(this.fundColor[i%9]);
	}
	this.listView.addItem('FD/view/FD5006_V03.lay', rates);
	
	
	// 차트
	this.pieChart.setChartColor(color);
	for(var i=0; i<rates.length; i++) 
	{
		if(rates[i]['data'] < 5)
		{
			rates[i]['data'] = parseInt(rates[i]['data'], 10);
		}
	}
	this.pieChart.draw(rates);
};


// 보유자산 그리드 셋팅
FD5006_T02.prototype.setGrid = function()
{
	this.grid.setCellText(0, 1, afc.addComma(this.money1) + '원');
	this.grid.setCellText(1, 1, afc.addComma(this.money2) + '원');
	this.grid.setCellText(2, 1, afc.addComma(this.money3) + '원');
	this.grid.setCellText(3, 1, afc.addComma(this.money3 - this.money2) + '원');
	
	if($.isNumeric(this.money4))
	{
		this.grid.setCellText(4, 1, afc.floorPer(this.money4, 2));
	}
	else
	{
		this.grid.setCellText(4, 1, '0%');
	}
	
	this.grid.setCellText(5, 1, afc.addComma(this.money3 + this.money1) + '원');
};


// 리스트뷰 데이터 바인딩
FD5006_T02.prototype.bindData = function(item, data, listview)
{
	if(item.view.setData)
	{
		item.view.setData(data);
	}
};


