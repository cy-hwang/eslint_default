
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_T01()
{
	AView.call(this);
}
afc.extendsClass(FD5003_T01, AView);


FD5003_T01.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	// Object
	this.cont = this.getContainer();

	// 스크롤 관련 영역
	this.view2 = this.findCompById("View2");
	
	// 펀드 버튼
	this.fundBtn = this.findCompById("Button1");	// 메리츠펀드
	this.pFundBtn = this.findCompById("Button2");	// 메리츠연금펀드
	
	// 리스트 뷰
	this.listView = this.findCompById("ListView");
	this.listView.setDelegator(this);
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5003_T01.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 서비스 조회
	this.sendSOFFQ421();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5003_T01.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5003_T01.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.view2.$ele.scrollTop(0);
};


// 컴포넌트 초기화
FD5003_T01.prototype.onInitComponents = function()
{
	// 버튼 셋팅
	this.fundBtn.enable(true);
	this.pFundBtn.enable(false);
	
	// 펀드 리스트
	this.fundList = [];
	this.fIdx = 0;	// 펀드 리스트 인덱스
	this.cIdx = 0;	// 펀드 리스트 펀드내용 인덱스
	this.iIdx = 0;	// 펀드 리스트 아이템 인덱스
	
	// 리스트뷰 내의 모든 아이템 삭제
	this.listView.removeAllItems();
};


// 서비스 조회
FD5003_T01.prototype.sendSOFFQ421 = function(contiKey)
{
	var thisObj = this;
	
	// 연속키가 없으면
	if(!contiKey)	
	{
		thisObj.listView.removeAllItems();	// 리스트뷰 내의 모든 아이템 삭제
	}
	
	// 조회
	this.cont.sendData('SOFFQ421',
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1투신펀드코드'] = '';
			InBlock1['D1운용사코드'] = '000';
			InBlock1['D1기준일'] = MetaInfo.fnGetToday('NUMDATE');
			InBlock1['D1투신펀드유형구분'] = '';
			InBlock1['D1간접투자코드'] = '';
			InBlock1['D1가입자격구분'] = '';
			InBlock1['D1투자기간코드'] = '';
			InBlock1['D1한글투신펀드명'] = '';
			InBlock1['D1투신상세코드'] = '77'; // 신연금저축
			InBlock1['D1투자방식코드'] = '';
			InBlock1['D1구분'] = '0';
			InBlock1['D1투자등급코드'] = '00';
			
			if(afc.isSimulator) queryData.printQueryData();
			
			if(contiKey) // 연속키가 있으면 
			{
				queryData.setContiKey(contiKey); // 연속키 저장
			}
		},
		function(queryData, groupName)
		{
			if(!queryData)
			{
				return;
			}
			else // 성공
			{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1');
					
				if(!OutBlock1 || OutBlock1.length == 0)
				{
					return;
				}
				else
				{
					// 리스트의 인덱스부터 OutBlock 개수만큼 돌면서
					for(thisObj.fIdx; thisObj.fIdx < OutBlock1.length; thisObj.fIdx++)
					{
						// 펀드 리스트에 넣는다
						thisObj.fundList[thisObj.fIdx] = OutBlock1[thisObj.fIdx];
						thisObj.fundList[thisObj.fIdx]['D1펀드내용'] = '';
						thisObj.fundList[thisObj.fIdx]['D1운용전략내용'] = '';
						thisObj.fundList[thisObj.fIdx]['D1위험관리전략내용'] = '';
					}
				}
				
				// 연속키 저장
				thisObj.contiKey = queryData.getContiKey();
				
				// 리스트 셋팅
				thisObj.onSetfundList();
			}
		}
	);
};


// 펀드 리스트 셋팅
FD5003_T01.prototype.onSetfundList = function()
{
	var thisObj = this;

	// 펀드내용 인덱스부터 펀드 리스트 개수만큼 돌면서
	thisObj.sendSOFFT107( 
			thisObj,
			thisObj.fundList[0]["D1투신펀드코드"],
			0
		);
};


// 서비스 조회 (펀드 설명)
FD5003_T01.prototype.sendSOFFT107 = function(caller, fundCd, index)
{
	var thisObj = this;
	
	// 조회
	this.cont.sendData('SOFFT107',
		function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
			InBlock1['D1처리구분'] = '1';
			
			var InBlock2 = queryData.getBlockData('InBlock2')[0];
			InBlock2['D1투신국내외구분'] = '1';
			InBlock2['D1투신펀드코드'] = fundCd;
			InBlock2['D1이용사번호'] = theApp.systemInfo.fno;
			InBlock2['D1펀드내용'] = '';
			InBlock2['D1투자기간일수'] = '';
			InBlock2['D1환매수수료내용'] = '';
			InBlock2['D1보수내용'] = '';
			InBlock2['D1운용전략내용'] = '';
			InBlock2['D1위험관리전략내용'] = '';
			InBlock2['D1가입대상명'] = '';
			InBlock2['D1목표수익률'] = '0';
			InBlock2['D1펀드운용역명'] = '';
			
			if(afc.isSimulator) queryData.printQueryData();
		},
		function(queryData, groupName)
		{
			if(queryData) // 성공
			{
				var InBlock2 = queryData.getBlockData('InBlock2')[0];
				
				if(InBlock2)
				{
					thisObj.fundList[index]['D1펀드내용'] = InBlock2["D1펀드내용"].trim();
					thisObj.fundList[index]['D1운용전략내용'] = InBlock2["D1운용전략내용"].trim();
					thisObj.fundList[index]['D1위험관리전략내용'] = InBlock2["D1위험관리전략내용"].trim();
				}
			}
			
			if(index + 1 == thisObj.fundList.length) {
				thisObj.setList();
			} else {
				thisObj.sendSOFFT107( 
					thisObj,
					thisObj.fundList[index+1]["D1투신펀드코드"],
					index+1
				);
			}
		}
	);
};


// 리스트 셋팅
FD5003_T01.prototype.setList = function()
{
	var item = [];
	for(this.iIdx; this.iIdx < this.fundList.length; this.iIdx++)
	{
		item.push(this.fundList[this.iIdx]);
	}

	this.listView.addItem('FD/view/FD5003_L01.lay', item);
};


// 리스트뷰 데이터 바인딩
FD5003_T01.prototype.bindData = function(item, data, listview)
{
	if(item.view.setData)
	{
		item.view.setData(data);
	}
};


// 뷰를 하단으로 스크롤
FD5003_T01.prototype.onScrollBottom = function(comp, info)
{
	if(this.contiKey) 
	{
		this.sendSOFFQ421(this.contiKey);
	}
};


// 펀드 버튼 클릭
FD5003_T01.prototype.onFundBtnClick = function(comp, info)
{
	var btnId = comp.getComponentId();

	if(btnId == "Button1")
	{
		var param = {
			"title" : "메리츠연금펀드",
			"contents" : "<span>[메리츠연금펀드]에서<br>나가시겠습니까?</span>",
			"btnArray" : ['예', '아니오'],
			"returnType" : "1",
			"returnData" : ""
		};

		PensionCommon.twoBtnPopup(this, param);
	}
};


// 팝업 콜백함수
FD5003_T01.prototype.callbackPensionPopup = function(returnData, resultData)
{
	// 메리츠펀드 초기화면으로 이동
	if(theApp.subNavi)
	{
		theApp.subNavi.clearHistory();
	}
	theApp.navigator.goPage('FrmPage');
};


