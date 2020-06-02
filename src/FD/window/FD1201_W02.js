
/**
Constructor
Do not call Function in Constructor.
*/
function FD1201_W02(containerId)
{
	BaseWindow.call(this, containerId);
	
	this.cancelBtn = null;
}
afc.extendsClass(FD1201_W02, BaseWindow);


FD1201_W02.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	
//	this.cancelBtn = this.findCompById('CancelBtn');
};


FD1201_W02.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.cancelBtn = this.findCompById('CancelBtn');
	
	this.sellTypeTp; // 환매신청유형구분값
	this.sellReqAmt; // 매도주문금액 입력값(매도금액 or 매도좌수)
	this.sellCmsTp; // CMS 약정구분
	
	//0: 펀드명, 1: 주문구분, 2: 가입유형, 3: 납입방법, 4: 주문번호, 5: 주문금액, 6: 주문좌수. 7: 주문일자, 8: 기준가적용일, 9: 결제예정일
	this.fundInfoGrd = this.findCompById("FundInfoGrd");
	//0: 펀드면, 			 1: 가입유형,  			  2: 주문번호, 3: 주문금액, 4: 신청일자, 5: 주문일자, 6: 기준가적용일, 7: 결제예정일
	this.refundInfoGrd = this.findCompById("ReFundInfoGrd");
	this.setBaseFundInfo();
};

FD1201_W02.prototype.setBaseFundInfo = function()
{
	var thisObj = this;
	var cont = thisObj.opener.getContainer();
	
	if(this.ifReserved) {
	
		this.refundInfoGrd.show(AComponent.VISIBLE);
		this.fundInfoGrd.show(AComponent.GONE);
	
		this.refundInfoGrd.setCellText(0,1, this.fundInfo["D1펀드명"]);
		this.refundInfoGrd.setCellText(1,1, this.fundInfo["D1투신상세명"]); //WTS와 맞춤
		this.refundInfoGrd.setCellText(2,1, this.fundInfo["D1일련번호"]);	
		this.refundInfoGrd.setCellText(3,1, afc.addComma(this.fundInfo["D1주문금액"]) + "원");
		this.refundInfoGrd.setCellText(4,1, MetaInfo.fnGetDateHTxt2(this.fundInfo["D1신청일"]));
		this.refundInfoGrd.setCellText(5,1, MetaInfo.fnGetDateHTxt2(this.fundInfo["D1주문일"]));
		this.refundInfoGrd.setCellText(6,1, MetaInfo.fnGetDateHTxt2(this.fundInfo["D1기준가적용일"]));
		this.refundInfoGrd.setCellText(7,1, MetaInfo.fnGetDateHTxt2(this.fundInfo["D1결제일"]));	
		
		if(this.fundInfo["D1취소여부"] == "1") {
			this.refundInfoGrd.setCellText(8,1, "취소완료");
			this.cancelBtn.enable(false);
		} else {
			this.refundInfoGrd.setCellText(8,1, "정상");
			
			if(cont.today >= this.fundInfo["D1신청일"] &&
				cont.today <= this.fundInfo["D1주문일"]){
				this.cancelBtn.enable(true);
			}else {
				this.cancelBtn.enable(false);
			}
		}
	}
	else
	{
		this.refundInfoGrd.show(AComponent.GONE);
		this.fundInfoGrd.show(AComponent.VISIBLE);
		
		this.fundInfoGrd.setCellText(0,1, this.fundInfo["D1한글투신펀드명"]);
		this.fundInfoGrd.setCellText(1,1, this.fundInfo["D1주문유형명"]);
		this.fundInfoGrd.setCellText(2,1, this.fundInfo["D1투신상세명"]);	//WTS와 맞춤
		this.fundInfoGrd.setCellText(3,1, cont.tradingValue[this.fundInfo["D1납입방법코드"]]);
		this.fundInfoGrd.setCellText(4,1, this.fundInfo["D1주문번호"]);				//펀드순번이 없음: 계좌일련번호
		this.fundInfoGrd.setCellText(5,1, afc.addComma(this.fundInfo["D1매매금액"]) + "원");
		this.fundInfoGrd.setCellText(6,1, this.fundInfo["D1매매수량"] + "좌");
		this.fundInfoGrd.setCellText(7,1, MetaInfo.fnGetDateHTxt2(this.fundInfo["D1주문일"]));
		this.fundInfoGrd.setCellText(8,1, MetaInfo.fnGetDateHTxt2(this.fundInfo["D1기준가적용일"]));
		this.fundInfoGrd.setCellText(9,1, MetaInfo.fnGetDateHTxt2(this.fundInfo["D1결제일"]));
		
		if(this.fundInfo["D1취소여부"] == "1") {
			this.fundInfoGrd.setCellText(10,1, "취소완료");
			this.cancelBtn.enable(false);
		} else {
			this.fundInfoGrd.setCellText(10,1, "정상");
			if(cont.today == this.fundInfo["D1주문일"]){
				this.cancelBtn.enable(true);
			}else {
				this.cancelBtn.enable(false);
			}			
		}
	}
};

//펀드 매매 취소
FD1201_W02.prototype.onCancelBtnClick = function(comp, info)
{
	//예약주문인 경우
	if(this.ifReserved) {
		this.sendSOFFT224();
	//일반주문인 경우
	} else {
		this.sendSOFFT131();
	}
};

//펀드 매매 취소
FD1201_W02.prototype.sendSOFFT131 = function(){

	var thisObj = this
		,cont = thisObj.opener.getContainer() // 연결된 최상위 뷰
		,qrName = "SOFFT131"
		,cipherData = thisObj.txtPw; // 전 페이지에서 이미 getCipherData()를 사용해서 넘오옴
	
	var accNo = cont.accDbx.getSelectedItemData()['D1계좌번호'];
	var subAccNo = accNo + this.fundInfo["D1계좌일련번호"];

	var checkObj = {
		svcId : qrName,
		sAccNo : subAccNo
	};
	
	SecurePadManager.cipherToText(cipherData, checkObj, function(result){
		cont.sendData(qrName,
			function(queryData, groupName){
				// 수정하기 위해 펑션키 수정		>> ??
				queryData.setHeaderInfo(
					{FUNC_KEY_LST: '5'}	//C?
				);
				var inBlock1 = queryData.getBlockData('InBlock1')[0];
				inBlock1["D1계좌번호"] = checkObj.sAccNo;
				inBlock1["D1비밀번호"] = afc.isSimulator ? '0423' : result;
				inBlock1["D1거래구분"] = '1';  //1: 주문, 2: 매매
				inBlock1["D1처리지점번호"] = thisObj.fundInfo["D1처리지점번호"];
				inBlock1["D1투신국내외구분"] = '1'; // 1: 국내물, 2: 해외물
				inBlock1["D1주문일"] = thisObj.fundInfo["D1주문일"];
				inBlock1["D1주문번호"] = thisObj.fundInfo["D1주문번호"];
				inBlock1["D1펀드매매처리구분"] = '0'; //1: 자금대체, 2: 은행이체,. 3: CMS, 4: 입금매수
				inBlock1["D1상대계좌번호"] = '';	//펀드매매처리구분이 1, 2일 경우 입력
				
				//queryData.printQueryData();
				queryData.putPwInfo('InBlock1', 'D1비밀번호');
			},
			function(queryData, groupName) {
				if(!queryData) return;
				
				//queryData.printQueryData();	
				AToast.show("정상 처리되었습니다.");
				thisObj.close(1);
			},
			accNo
		);
	});
};

//펀드예약매매 취소
FD1201_W02.prototype.sendSOFFT224 = function(){

	var thisObj = this
		,cont = thisObj.opener.getContainer() // 연결된 최상위 뷰
		,qrName = "SOFFT224"
		,cipherData = thisObj.txtPw; // 전 페이지에서 이미 getCipherData()를 사용해서 넘오옴
	
	// 2018.07.24 펀드예약매매취소 시 SMS 인증 투신펀드계좌번호로 변경(기존은 서브계좌를 사용하고 있었음)
	var accNo = cont.accDbx.getSelectedItemData()['D1계좌번호'];
	
	cont.sendData(qrName,
		function(queryData, groupName){
			// 수정하기 위해 펑션키 수정
			queryData.setHeaderInfo(
				{FUNC_KEY_LST: '5'}	//C?
			);
			var inBlock1 = queryData.getBlockData('InBlock1')[0];
			inBlock1["D1계좌번호"] = thisObj.fundInfo["D1계좌번호"];
			inBlock1["D1신청일"] = thisObj.fundInfo["D1신청일"];
			inBlock1["D1일련번호"] = thisObj.fundInfo["D1일련번호"];

			//queryData.printQueryData();
		},
		function(queryData, groupName) {
			if(!queryData) return;

			//queryData.printQueryData();	
			AToast.show("정상 처리되었습니다.");
			thisObj.close(1);
		},
		accNo
	);
};

FD1201_W02.prototype.onCloseBtnClick = function(comp, info)
{
	this.close(0);
};