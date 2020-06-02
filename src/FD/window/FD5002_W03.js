
/**
Constructor
Do not call Function in Constructor.
*/
function FD5002_W03(containerId)
{
	AWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5002_W03.lay';

	//TODO:edit here

}
afc.extendsClass(FD5002_W03, AWindow);


FD5002_W03.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);
	
	// 조회기간(2018.11.06 당일버튼 화면에서 제거)
	this.InqryBtn01 = this.findCompById('InqryBtn01');	// 당일		
	this.InqryBtn02 = this.findCompById('InqryBtn02');	// 1개월	 
	this.InqryBtn03 = this.findCompById('InqryBtn03');	// 3개월
	this.InqryBtn04 = this.findCompById('InqryBtn04');	// 직접입력
	this.InqryBtns = [
		{ btnComp : this.InqryBtn01, btnVal : '0', dateVal : 'C' },
		{ btnComp : this.InqryBtn02, btnVal : '1', dateVal : '1' },
		{ btnComp : this.InqryBtn03, btnVal : '2', dateVal : '3' },
		{ btnComp : this.InqryBtn04, btnVal : '3', dateVal : 'I' }
	];
		
	// 날짜
	this.datePicker01 = this.findCompById('DatePicker1');
	this.datePicker02 = this.findCompById('DatePicker2');

	// 거래구분
	this.RdoTrsfGrp = this.findCompById('RdoTrsfGrp');		// 라디오 그룹
	this.RdoTrsfBtn01 = this.findCompById('RdoTrsfBtn01');	// 전체
	this.RdoTrsfBtn02 = this.findCompById('RdoTrsfBtn02');	// 이관
	this.RdoTrsfBtn03 = this.findCompById('RdoTrsfBtn03');	// 수관
	this.RdoTrsfBtns = [
		{ btnComp : this.RdoTrsfBtn01, btnVal : '0' },
		{ btnComp : this.RdoTrsfBtn02, btnVal : '1' },
		{ btnComp : this.RdoTrsfBtn03, btnVal : '2' }
	];
	
	// 컴포넌트 초기화
	this.onInitComponents();
};


// 컴포넌트 초기화
FD5002_W03.prototype.onInitComponents = function()
{
	// 조회기간 및 거래구분 셋팅
	this.onOptionBtnSelect(this.w_inqryIndex, this.w_trsfIndex);
	
	// 날짜 셋팅
	var sDate = Utils.yyyymmdd(new Date());
	var eDate = Utils.yyyymmdd(new Date());
	
	if(this.w_inqryIndex == 3) // 직접입력을 선택했었으면
	{
		sDate = this.w_startDate;
		eDate = this.w_endDate;
	}
	
	this.datePicker01.setValue(sDate);
	this.datePicker02.setValue(eDate);
};


// 옵션에 따라 버튼 선택
FD5002_W03.prototype.onOptionBtnSelect = function(iIndex, tIndex)
{	
	// 조회기간
	this.onInqryBtnClick( this.InqryBtns[iIndex].btnComp );
	
	// 거래구분
	this.RdoTrsfGrp.setSelectBtn( this.RdoTrsfBtns[tIndex].btnComp );
};


// 조회기간별 버튼 클릭 시
FD5002_W03.prototype.onInqryBtnClick = function(comp, info)
{
	var compId = comp.getComponentId();
	
	// 조회기간 버튼 활성화 셋팅
	for(var i=0; i<this.InqryBtns.length; i++)
	{
		this.InqryBtns[i].btnComp.enable(true);
		if(this.InqryBtns[i].btnComp == comp)
		{
			// 조회기간 타입 셋팅
			this.w_inqryIndex = i;
			this.w_inqryTypeCd = this.InqryBtns[i].btnVal;
		}
	}
	comp.enable(false);

	
	// DatePicker 활성화 셋팅
	this.onDatePickerControl(false);
	if(compId == 'InqryBtn04')	// 직접입력
	{
		this.onDatePickerControl(true);
	}
};


// DatePicker 활성화 처리
FD5002_W03.prototype.onDatePickerControl = function(isTrue)
{
	var datePickers = [this.datePicker01, this.datePicker02];
	
	for(var i=0; i<datePickers.length; i++)
	{
		datePickers[i].enable(isTrue);
	
		if(isTrue) // true
		{
			datePickers[i].removeClass('dis');
		}
		else // false
		{
			datePickers[i].addClass('dis');
		}
	}
};


// 선택된 조회기간에 따라 시작일과 종료일 셋팅
FD5002_W03.prototype.onSetSelectInqryBtn = function()
{
	var selectIndex = this.w_inqryIndex;
	var selectDateVal = this.InqryBtns[selectIndex].dateVal;
	
	if(selectDateVal == "C") // 당일
	{
		this.w_startDate	= Utils.yyyymmdd(new Date());
		this.w_endDate		= Utils.yyyymmdd(new Date());
	}
	else if(selectDateVal == "I") // 직접입력
	{
		this.w_startDate 	= this.datePicker01.getValue();
		this.w_endDate 		= this.datePicker02.getValue();
	}
	else
	{
		var d = new Date();
		d.setMonth(d.getMonth() - (selectDateVal*1));
		
		this.w_startDate 	= Utils.yyyymmdd(d);
		this.w_endDate 		= Utils.yyyymmdd(new Date());
	}
};


// 선택된 거래구분의 타입 값 셋팅
FD5002_W03.prototype.onSetSelectRdoTrsfBtn = function()
{
	var selectComp = this.RdoTrsfGrp.getSelectBtn();
	
	for(var i=0; i<this.RdoTrsfBtns.length; i++)
	{
		if(this.RdoTrsfBtns[i].btnComp == selectComp)
		{
			// 거래구분 타입 셋팅
			this.w_trsfIndex = i;
			this.w_trsfTypeCd = this.RdoTrsfBtns[i].btnVal;
		}
	}
};


// 확인 버튼 클릭
FD5002_W03.prototype.onBtnOkClick = function(comp, info)
{
	// 뷰로 넘겨줄 값 셋팅
	this.onSetSelectInqryBtn();		// 조회기간 
	this.onSetSelectRdoTrsfBtn();	// 거래구분
	
	var resultParam = {
		w_inqryIndex	: this.w_inqryIndex,
		w_inqryTypeCd	: this.w_inqryTypeCd,
		w_inqryText 	: this.InqryBtns[this.w_inqryIndex].btnComp.getText(),
		w_trsfIndex		: this.w_trsfIndex,
		w_trsfTypeCd	: this.w_trsfTypeCd,
		w_trsfText		: this.RdoTrsfBtns[this.w_trsfIndex].btnComp.getText(),
		w_startDate		: this.w_startDate,
		w_endDate		: this.w_endDate
	};
	
	this.close(resultParam);
};


// X 버튼 클릭
FD5002_W03.prototype.onBtnCloseClick = function(comp, info)
{
	this.close(0);
};


