
/**
Constructor
Do not call Function in Constructor.
*/
function FD5006_V01()
{
	AView.call(this);
}
afc.extendsClass(FD5006_V01, AView);


FD5006_V01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// Object
	this.cont = this.getContainer();
	
	// 계좌
	this.accView = this.cont.findCompById('AccView').loadView;
	this.accDbx = this.accView.accDbx; // 계좌드롭박스
	
	// 리스트
	this.list1 	= this.findCompByGroup('M')[0];	// 펀드명
	this.list2 	= this.findCompByGroup('M')[1];	// 수익률
	this.list3 	= this.findCompByGroup('M')[2];	// 기준가
	this.list4 	= this.findCompByGroup('M')[3];	// 보유좌수
	this.list5 	= this.findCompByGroup('M')[4]; // 원금
	this.list6 	= this.findCompByGroup('M')[5]; // 평가액(세전)
	this.list7 	= this.findCompByGroup('M')[6]; // 납입방법
	
	// 버튼뷰
	this.btnView1 = this.findCompByGroup('btnViewGrp')[0];	// 추가매수 뷰
	this.btnView2 = this.findCompByGroup('btnViewGrp')[1];	// 월지급 약정신청 및 변경 뷰
};


// 데이터 셋팅
FD5006_V01.prototype.setData = function(data)
{
	// 월지급 약정신청 및 변경 뷰 (사용X)
	this.btnView2.show(AComponent.GONE);
	
	// 리스트 데이터
	this.listData = data;
	
	// 펀드명
	this.list1.setText( data['D1펀드명'] );
	
	// 수익률
	if($.isNumeric( data['D1수익률'] )) 
	{
		this.list2.setText(afc.floorPer(data['D1수익률'], 2));
	}
	else
	{
		this.list2.setText('0%');
	}
	
	// 매매기준가
	this.list3.setText(afc.floor(data['D1매매기준가'], 2));
	
	// 펀드잔고수량
	this.list4.setText(afc.addComma(data['D1펀드잔고수량'].split('.')[0]) + '좌');
	
	// 원금액
	this.list5.setText(afc.addComma(data['D1원금액']) + '원');
	
	// 평가금액
	this.list6.setText(afc.addComma(data['D1평가금액']) + '원');
	
	// 납입방법 // 2018.11.14 주석처리
	/*if( MetaInfo.PayMthdCode[data['D1납입방법코드']] )
	{
		this.list7.setText( MetaInfo.PayMthdCode[data['D1납입방법코드']] );
	}
	else
	{
		this.list7.setText(data['D1납입방법코드']);
	}*/
	
	// 납입방법 // 2018.11.14 추가
	if( data['D1납입방법코드'] == '04' ) // 일정액적립식과 자유적립식 구분
	{
		var account = this.accDbx.getSelectedItemData()['D1계좌번호'];
		var subNo = data['D1계좌일련번호'];
		
		var param = {
			'acc' : account + '' + subNo
		};
		
		// 서비스 조회
		this.sendSACAQ532(param);
	}
	else
	{
		// 납입방법 셋팅
		this.setPayMthd();
	}
};


// 납입방법 셋팅 // 2018.11.14 추가
FD5006_V01.prototype.setPayMthd = function()
{
	var thisObj = this;
	var mthdCd = thisObj.listData['D1납입방법코드'];
	
	if( MetaInfo.PayMthdCode[mthdCd] )
	{
		thisObj.list7.setText( MetaInfo.PayMthdCode[mthdCd] );
	}
	else
	{
		thisObj.list7.setText( mthdCd );
	}
};


// 서비스 조회 // 2018.11.14 추가
FD5006_V01.prototype.sendSACAQ532 = function(param)
{
	var thisObj = this;

	// 등록된 내용이 없습니다. Skip 처리
	theApp.accNetManager.addSkipErrorCode('SACAQ532', '2679');
	
	// 조회
	this.cont.sendData('SACAQ532',
		function(queryData, groupName)
		{
			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1계좌구분'] = '3';
			InBlock1['D1계좌번호'] = param.acc;
			InBlock1['D1입력비밀번호'] = '1'; // 비밀번호의 길이가 0이면 비밀번호 체크하는 부분에서 걸리므로 1 세팅
			InBlock1['D1서비스종류코드'] = '3206'; // 일적립식 매수서비스 자동대체
			
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{
			if(!queryData)
			{
				// 납입방법 셋팅
				thisObj.setPayMthd();
			}
			else // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock2 = queryData.getBlockData('OutBlock2');
				
				// 납입방법 셋팅
				if(OutBlock2.length > 0) // 약정O => 일정액적립식
				{
					thisObj.list7.setText( '일정액적립식' );
				}
				else // 약정X => 자유적립식
				{
					thisObj.list7.setText( '자유적립식' );
				}
			}
		}
	);
};


// 추가매수
FD5006_V01.prototype.onButton1Click = function(comp, info)
{
	// 매매가능여부
	if(this.listData['D1HTS매매가능여부'] == '1')
	{
		// 서비스 조회
		this.sendSDPAQ070();
	}
	else
	{
		theApp.alert(
			[	 
				'추가매수를 하시는 경우', '<br>',
				'메리츠자산운용 고객센터', '<br>',
				'(1588-5533)로 연락주시기', '<br>',
				'바랍니다.'
			].join(''),
			null,
			''
		);
	}
};


// 서비스 조회
FD5006_V01.prototype.sendSDPAQ070 = function()
{
	var thisObj = this;
	
	// 계좌번호가 없으면
	if(!this.accDbx.getSelectedItemData() || !this.accDbx.getSelectedItemData()['D1계좌번호'])
	{
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
	
	// 조회
	theApp.accNetManager.sendProcessByName('SDPAQ070', null, null,
		function(queryData)
		{
			queryData.setHeaderInfo({
				FUNC_KEY_LST: 'C'
			});
			
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1계좌번호'] = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
			InBlock1['D1비밀번호'] = '';
			InBlock1['D1금액'] = '0';
			InBlock1['D1세금징수구분'] = '';
			InBlock1['D1출금유형코드'] = '30'; // 30: 출금
			InBlock1['D1해지구분'] = '0'; // 0: 해당없음
			
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{
			if(!queryData)
			{
				return;
			}
			else if(queryData) // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
				
				if(!OutBlock1) return;
				
				var money1 = OutBlock1['D1예수금'] * 1;
				var money2 = OutBlock1['D1증거금현금'] * 1;
				
				// 팝업
				var win = AWindow.createWindow('FD/window/FD5006_W01.lay', 'FD5006W01');
				win.setWindowOption({ isAutoCenter: true });
				
				// 팝업으로 넘기는 파라미터 
				win.w_userNm = theApp.userInfo.userObj['D1사용자명'];  // 사용자명
				win.w_money =  money1 - money2; 					  // 매수가능금액
				win.w_fundCd = thisObj.listData['D1투신펀드코드'];	  // 펀드코드
				win.w_subAccSeqNo = thisObj.listData['D1계좌일련번호']; // 계좌일련번호
				
				// 팝업 오픈
				win.open(thisObj, 0, 0, 580, 350);
			}
		}
	);
};


/* // 월지급 약정신청 및 변경
FD5006_V01.prototype.onButton3Click = function(comp, info)
{
	var win = AWindow.createWindow('FD/window/FD4102_W03.lay', 'FD4102W03');
	win.subAccNo = this.listData['D1계좌번호'];
	win.fundCode = this.listData['D1투신펀드코드'];
	win.openAsDialog(this);
};


// 팝업에서 넘긴 결과
FD5006_V01.prototype.onWindowResult = function(result, windowObj)
{
	if(windowObj.containerId == 'FD4102W03')
	{
		if(result == 1)
		{
			var win = AWindow.createWindow('FD/window/FD4102_W02.lay', 'FD4102W02');
			
			win.subAccNo = this.listData['D1계좌번호'];
			win.fundCode = this.listData['D1투신펀드코드'];
			win.openAsDialog(this, '100%', '100%');
		}
	}
}; */


