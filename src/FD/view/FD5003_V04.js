
/**
Constructor
Do not call Function in Constructor.
*/
function FD5003_V04()
{
	AView.call(this);		
}
afc.extendsClass(FD5003_V04, AView);


FD5003_V04.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	// Object
	this.cont = this.getContainer();
	this.contTab = this.cont.tvManager.getActiveView();
	
	// 스크롤 관련 영역
	this.view3 = this.findCompById('View3');
	
	// 체크박스
	this.CheckAll = this.findCompById('CheckAll');
	this.cbInvestList1 = this.findCompById('cbInvestList1');
	this.cbInvestList2 = this.findCompById('cbInvestList2');
	this.cbInvestList3 = this.findCompById('cbInvestList3');
	this.cbInvestList4 = this.findCompById('cbInvestList4');
	this.cbInvestList5 = this.findCompById('cbInvestList5');
	this.cbInvestList6 = this.findCompById('cbInvestList6');
	this.cbInvestList7 = this.findCompById('cbInvestList7');
	this.checkList = [this.cbInvestList1, this.cbInvestList2, this.cbInvestList3, this.cbInvestList4,
						this.cbInvestList5, this.cbInvestList6, this.cbInvestList7];
	
	// 투자자 체크리스트
	this.lblStep = this.findCompById('lblStep'); // 단계
	this.btnNext5 = this.findCompById('btnNext5'); // 다음 버튼
	this.lblFundName = this.findCompById('lblFundName'); // 펀드명
	this.lblFundName2 = this.findCompById('lblFundName2'); // 클래스상세 전체명 추가 2019.09.24
	
	this.lblFundName.setShrinkInfo({maxChar:20, fontSize:24}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.lblFundName2.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
};


// 뷰의 활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V04.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
	
	// 컴포넌트 초기화
	this.onInitComponents();
	
	// 매수단계 및 펀드명 셋팅
	this.setFundStepInfo();
};


// 뷰 활성화 과정이 모두 종료되면 매번 호출된다
FD5003_V04.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	// 2019.03.25. 하단항목 안 그려지는 증상 > 강제 redraw를 통해 대응
	setTimeout(function(){ $("#FD5003_V04--View5").forceRedraw();}, 700);
	
};
	

// 뷰 비활성화가 시작되기 바로 전에 매번 호출된다
FD5003_V04.prototype.onWillDeactive = function(reload)
{		
	AView.prototype.onWillDeactive.call(this, reload);
	
	//스크롤 영역 변경	
	this.view3.scrollTo(0);
};


// 컴포넌트 초기화
FD5003_V04.prototype.onInitComponents = function()
{
	// 다음 버튼 비활성화
	this.btnNext5.enable(false);
	
	// 체크박스 전체 체크 해제
	this.CheckAll.setCheck(false);
	for(var i=0; i < this.checkList.length; i++)
	{
		this.checkList[i].setCheck(false);
	}
};


// 매수단계 및 펀드명 셋팅
FD5003_V04.prototype.setFundStepInfo = function()
{
	// 펀드매수단계 셋팅
	var txtStep = "<span class='fc_red3'>" + this.cont.fundStepNow + "</span>"
					+ "<span class='step'>/" + this.cont.fundStepAll + "단계</span>";
	this.lblStep.$ele.children().eq(0).html(txtStep);
	
	
	// 펀드명 셋팅
	var fundNm = this.cont.selectFundInfo["D1한글투신펀드명"];
	this.lblFundName.setText(fundNm);
	this.lblFundName2.setText(this.cont.selectFundInfo["D1클래스상세 전체명"]);  // 클래스상세 전체명 추가 2019.09.24
};


// 체크박스 클릭
FD5003_V04.prototype.oncbInvestListClick = function(comp, info)
{
	// 체크 상태 확인
	if(this.checkAllCheckBox())
	{
		this.CheckAll.setCheck(true);
		this.onCheckAllClick();
	}
	else
	{
		this.CheckAll.setCheck(false);
		this.btnNext5.enable(false);
	}
};


// 전체 체크박스 클릭
FD5003_V04.prototype.onCheckAllClick = function(comp, info)
{
	// 체크박스 전체 체크
	for(var i=0; i < this.checkList.length; i++)
	{
		this.checkList[i].setCheck(true);
	}
	
	// 활성화 시
	if( this.CheckAll.getCheck() )
	{
		this.btnNext5.enable(true);
	}
	else // 비활성화 시
	{
		this.btnNext5.enable(false);
		
		// 체크 상태 확인
		if(this.checkAllCheckBox())
		{
			for(var i=0; i < this.checkList.length; i++)
			{
				this.checkList[i].setCheck(false);
			}
		}
	}	
};


// 체크박스가 모두 체크되어 있는 지 체크
FD5003_V04.prototype.checkAllCheckBox = function()
{
	var chk1, chk2, chk3, chk4, chk5, chk6, chk7;
	chk1 = this.cbInvestList1.getCheck();
	chk2 = this.cbInvestList2.getCheck();
	chk3 = this.cbInvestList3.getCheck();
	chk4 = this.cbInvestList4.getCheck();
	chk5 = this.cbInvestList5.getCheck();
	chk6 = this.cbInvestList6.getCheck();
	chk7 = this.cbInvestList7.getCheck();
	
	if(chk1 && chk2 && chk3 && chk4 && chk5 && chk6 && chk7)
	{
		return true;
	}
	else
	{
		return false;
	}
};


// 다음단계 클릭
FD5003_V04.prototype.onbtnNext5Click = function(comp, info)
{
	// 펀드매수단계 셋팅
	this.cont.fundStepNow = this.cont.fundStepNow + 1; // 5단계
	
	// 펀드등급조회로 이동
	this.contTab.tbvManager.changeTab('FD5003_V05');
};


