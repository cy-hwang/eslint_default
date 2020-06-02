
/**
Constructor
Do not call Function in Constructor.
*/
function FD5008_W04(containerId)
{
	BaseWindow.call(this, containerId);
	
	this.fundCode = null;
	this.bankCode = null;
	this.bankAccNo = null;
	this.bankAccNm = null;
	this.realNmCode = null;
	this.TDate = null;
	this.SDate = null;
	this.EDate = null;
	this.accPwd = null;
	
	this.contiKey = null;
}
afc.extendsClass(FD5008_W04, BaseWindow);

FD5008_W04.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	
	/*
	if(this.inParam)
		this.inParamData = this.inParam;
	
	if(this.out1Param)
		this.out1ParamData = this.out1Param;
		
	if(this.out2Param)
		this.out2ParamData = this.out2Param;
	*/
};

FD5008_W04.prototype.init = function(context, evtListener)
{
	BaseWindow.prototype.init.call(this, context, evtListener);	
	
	if(this.inParam)
		this.inParamData = this.inParam;
	
	if(this.out1Param)
		this.out1ParamData = this.out1Param;
		
	if(this.out2Param)
		this.out2ParamData = this.out2Param;
		
	//2019.09.03 출력레코드 'D1인수도지정' 우선순위(단계별 처리상태를 모두 수신한다고함, 해서 가장 우선순위 높은 것(최근 상태)을 화면에 출력함, 우선순위:1.등록완료 > 2.등록신청중 > 3.등록신청 > 4.등록불가능)
	this.currentPriority = null;
	this.currentPriorityItem = null
};

FD5008_W04.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.contiKey = null;
	
	this.fundInfoGrd = this.findCompById("FundInfoGrd");

	this.initFundInfo();
	
	this.sendSACAQ501();
};

FD5008_W04.prototype.initFundInfo = function()
{
	this.fundInfoGrd.setCellText(0,1, "");
	this.fundInfoGrd.setCellText(1,1, "");
	this.fundInfoGrd.setCellText(2,1, "");
	this.fundInfoGrd.setCellText(3,1, "");
	this.fundInfoGrd.setCellText(4,1, "");
	
};

FD5008_W04.prototype.sendSACAQ501 = function()
{
	var thisObj = this;
	
	var strAccNo = thisObj.out2ParamData['D1서브계좌번호'];
	var strCCurPwd = this.accPwd;

    var checkObj = 
    {
		svcId: 'SACAQ501',
		accNo: strAccNo
    };

	thisObj.sendData('SACAQ501',
	function(queryData, groupName)
	{
		var inBlock1 = queryData.getBlockData('InBlock1')[0];
		inBlock1['D1계좌구분'] = '2';
		inBlock1['D1계좌번호'] = strAccNo;
 		inBlock1['D1입력비밀번호'] = afc.isSimulator?'0423':strCCurPwd;
		inBlock1['D1서비스종류코드'] = '3206';
			
		if(!afc.isSimulator)
		{
			queryData.putPwInfo('InBlock1','D1입력비밀번호');
		}
		
		queryData.setContiKey(thisObj.contiKey);
		
		// Function key 세팅.
		queryData.setHeaderInfo(
			{FUNC_KEY_LST: 'C'}	// 조회.
		);
		
	},
	function(queryData, groupName)
	{
		if(!queryData)
		{
			//return;
			thisObj.closes(0);
		}
		else
		{
			queryData.printQueryData();
			
			var outBlock2	= queryData.getBlockData('OutBlock2');
			
			if(outBlock2.length == 0)
			{
				AToast.show("조회 내역이 없습니다.");
				
				thisObj.close(0);
			}
			else
			{
				/* AS-IS
				// 첫번째것만.....
				thisObj.setFundInfo(outBlock2[0]);
				*/
				
				//2019.09.03 출력레코드 'D1인수도지정' 우선순위 적용
				for (var i=0; i<outBlock2.length; i++) {
					var priority = 9;
					var insudo = outBlock2[i]["D1인수도지정"];
					switch(insudo) {
						case '등록완료'  : priority = 1; break;
						case '등록신청중': priority = 2; break;
						case '등록신청'  : priority = 3; break;
						case '등록불가능': priority = 4; break;
						default: priority = 9;
					}
					
					if (!thisObj.currentPriority) { //초기값 셋팅
						thisObj.currentPriority = priority;
						thisObj.currentPriorityItem = outBlock2[i];
					} else {
						//우선순위가 높은 경우 저장(작은수 일수록 높음)
						if (priority < thisObj.currentPriority) {
							thisObj.currentPriority = priority;
							thisObj.currentPriorityItem = outBlock2[i];
						}
					}
				}
				
				//next키 저장
				thisObj.contiKey = queryData.getContiKey();
				if(thisObj.contiKey) {
					thisObj.sendSACAQ501();
				} else {
					thisObj.setFundInfo(thisObj.currentPriorityItem);
				}
			}
		}
	});
};

FD5008_W04.prototype.setFundInfo = function(outBlock2)
{
	var thisObj = this;
	var cont = thisObj.opener.getContainer();
	
	// 2019.06.04. 적립식매수현황 전문변경(SOFFQ586->SACMQ619)으로 펀드명사용 필드 변경
	this.fundInfoGrd.setCellText(0,1, this.out2ParamData["D1펀드명"]);	
	this.fundInfoGrd.setCellText(1,1, afc.addComma(outBlock2["D1자동이체대체금액"]) + "원");
	this.fundInfoGrd.setCellText(2,1, "매일");	
	this.fundInfoGrd.setCellText(3,1, MetaInfo.fnGetDateHTxt2(outBlock2["D1약정등록일"]));
	this.fundInfoGrd.setCellText(4,1, MetaInfo.fnGetDateHTxt2(outBlock2["D1약정만료일"]));
	
	// 김용훈 차장님과 협의완료, 미지정 또는 빈값시 등록완료로 표기
	if(outBlock2["D1인수도지정"] == "미지정" || outBlock2["D1인수도지정"] == ""){
		this.fundInfoGrd.setCellText(5,1, "등록완료");
	}
			
	this.highRankAccNo = this.inParamData[0]["D1계좌번호"]; // 모계좌
	this.accSubNo = this.out2ParamData["D1서브계좌번호"]; // 대체상대계좌번호(서브계좌번호)
	this.fundBuyCode = outBlock2["D1매수펀드번호"]; //매수투신펀드코드
	this.dailyPayMoney = outBlock2["D1자동이체대체금액"]; // 은행자동이체금액
	this.transEndDate = outBlock2["D1약정만료일"]; // 이체종료일
	this.transStartDate = outBlock2["D1약정등록일"]; // 이체시작일
			
};

FD5008_W04.prototype.onCancelBtnClick = function(comp, info)
{
	this.sendSACAT502();
};

//자동 이체 해지 신청
FD5008_W04.prototype.sendSACAT502 = function(){

	var thisObj = this;
	
	var strAccNo = thisObj.out2ParamData['D1서브계좌번호'];
	var strCCurPwd = this.accPwd;

    var checkObj = 
    {
		svcId: 'SACAT502',
		accNo: strAccNo
    };

	thisObj.sendData('SACAT502',
	function(queryData, groupName)
	{		
		// 수정하기 위해 펑션키 수정
		queryData.setHeaderInfo(
			{FUNC_KEY_LST: '5'}
		);

		var InBlock1 = queryData.getBlockData('InBlock1')[0];

		InBlock1['D1처리구분'] = '2'; // 해지
		InBlock1['D1계좌번호'] = thisObj.highRankAccNo;
		InBlock1['D1비밀번호'] = afc.isSimulator ? '0423' : strCCurPwd;
		InBlock1['D1서비스종류코드'] = '3206';
		InBlock1['D1매도투신펀드코드'] = '';
		InBlock1['D1대체상대계좌번호'] = thisObj.accSubNo;
		InBlock1['D1매수투신펀드코드'] = thisObj.fundBuyCode;
		InBlock1['D1환불금은행이체여부'] = '';
		InBlock1['D1자동대체일'] = '00';
		InBlock1['D1은행자동이체금액'] = thisObj.dailyPayMoney;
		InBlock1['D1약정만료일'] = thisObj.transEndDate; // 이체종료일
		InBlock1['D1은행이체비밀번호'] = '';
		InBlock1['D1약정시작일'] = thisObj.transStartDate // 이체시작일
		InBlock1['D1자동이체입금일'] = '';

		queryData.putPwInfo('InBlock1', 'D1비밀번호');

		//queryData.printQueryData();
		
		
	},
	function(queryData, groupName)
	{
		var errMsg = this.getLastError('errMsg');
		var errCode = this.getLastError('errCode');
		
		if(!queryData)
		{
			thisObj.close(0);
		}
		else
		{
			//queryData.printQueryData();
			
			AToast.show("정상 처리되었습니다.");
			thisObj.close(1);
		}
	});
};

FD5008_W04.prototype.onCloseBtnClick = function(comp, info)
{
	this.close(0);
};