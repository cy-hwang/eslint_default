
/**
Constructor
Do not call Function in Constructor.
*/
function FD1503_W00(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD1503_W00.lay';

	//TODO:edit here

}
afc.extendsClass(FD1503_W00, BaseWindow);


FD1503_W00.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here	

};

// 화면 그린 후 데이터
FD1503_W00.prototype.onActiveDone = function(reload)
{	
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.selectFund = null;
	
	// 소유펀드 리스트 저장 배열
	this.fundList = [];
	
	// CheckBox Radio 만드는 배열
	this.radioButtonNew = [];
	
	// 라디오버튼 매니저 초기화
	this.rdoManager = null;	
	this.rdoManager = new RadioBtnManager(this);	
		
	this.grid1 = this.findCompById('Grid1');
	
	this.contiKey = null; //next 키
		
	// 그리드 초기화
	this.grid1.removeAll();
		
	//this.doSetFilterToGrid();
	this.sendDataManage();
	
};

// 화면 종료할 때 사용
FD1503_W00.prototype.onWillDeactive = function()
{
	BaseWindow.prototype.onWillDeactive.call(this);
		
};

FD1503_W00.prototype.sendDataManage = function()
{
	var thisObj = this;
	var qrName = 'SOFFQ602';
		
	//next키가 없으면 그리드 초기화
	if(!thisObj.contiKey)
	{		
		thisObj.grid1.removeAll();
	}
	
	var checkObj = 
	{ 
		svcId: qrName,
		accNo: thisObj.accDbx
	};
	
	SecurePadManager.cipherToText(this.cipherData, checkObj, function(result){
		thisObj.sendData(qrName, function(queryData, groupName)
		{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
						
			//헤더요청:레코드갯수 - 테스트하기 위해 10개씩 찍어서 확인함.
			/*queryData.setHeaderInfo({
					REQST_REC_QTY: 10
			});*/
													
			InBlock1['D1계좌번호'] = checkObj.accNo;						
			InBlock1['D1기준월'] = thisObj.selDateMM; // 뷰화면에서 선택한 년월(ex:201910)
			
			//next 키 저장
			if(thisObj.contiKey) queryData.setContiKey(thisObj.contiKey);
			
			if(afc.isSimulator) queryData.printQueryData();
			
		},
		function(queryData, groupName)
		{
			var errCode = this.getLastError('errCode');
			var errMsg = this.getLastError('errMsg');			
									
			if(!queryData)
			{
				AToast.show(this.getLastError('errMsg'));
				thisObj.contiKey = null;
				return;
			}else{
				if(afc.isSimulator) queryData.printQueryData();
				
				var OutBlock1 = queryData.getBlockData('OutBlock1');
				
				thisObj.contiKey = queryData.getContiKey();
				
				thisObj.addGridRowData(OutBlock1);
																
			}						
		});		
	});
};

// 그리드 화면 데이터 출력
FD1503_W00.prototype.addGridRowData = function(OutBlockData)
{
	var thisObj = this;
			
	var nowFundListLength = thisObj.fundList.length; // 현재 펀드목록 길이
	var	addFundListLength = nowFundListLength + OutBlockData.length; // 펀드목록에 추가한 목록 길이
		
	// 체크버튼 생성, 펀드 리스트 세팅, 그리드 로우 세팅
	for(var i=nowFundListLength; i<addFundListLength; i++){
		thisObj.radioButtonNew[i] = new AButton();										
		thisObj.radioButtonNew[i].init();
		thisObj.radioButtonNew[i].setText('');
		thisObj.radioButtonNew[i].setInlineStyle();					
		thisObj.radioButtonNew[i].addClass('basic_rdo_nor');
		thisObj.radioButtonNew[i].setBtnStyle(['basic_rdo_nor', 'basic_rdo_nor', 'basic_rdo_chk']);
		thisObj.radioButtonNew[i].setComponentId('RadioBtn' + i);
		thisObj.radioButtonNew[i].setGroupName('RadioGrp1');
		
		thisObj.radioButtonNew[i].addEventListener('click', this, 'chkBtnClickEvent');		
		
		// 펀드전체목록에 현재 조회한 펀드데이터만 배열뒤로 넣음.
		thisObj.fundList[i] = OutBlockData[(i-nowFundListLength)];		

		thisObj.grid1.addRowWithData( [ thisObj.radioButtonNew[i], thisObj.fundList[i]["D1계좌일련번호"], thisObj.fundList[i]["D1한글투신펀드명"] ] );
						
	}		
	
	thisObj.radioGrp1 = this.findCompByGroup('RadioGrp1');					
};

//function(radioBtn, info)
// 체크 라디오버튼 클릭 이벤트
FD1503_W00.prototype.chkBtnClickEvent = function(radioBtn, info)
{
	// 체크 버튼 선택
	this.rdoManager.selectButton(radioBtn);	
	
	// 현재 선택한 체크버튼 Index 찾아서 펀드목록 Index 와 맞춤.
	var radioBtnID = radioBtn.compId; // 체크 라디오 버튼 ID
	var radioBtnIndex = Number(radioBtnID.replace('RadioBtn','')); // 체크 라디오 버튼 Index 숫자형 변환
			
	this.selectFund = this.fundList[radioBtnIndex];	
};

// 화면 그냥 닫기
FD1503_W00.prototype.onCloseBtnClick = function(comp, info)
{

	//TODO:edit here
	this.close(0);
};

// 펀드 선택하고 닫기
FD1503_W00.prototype.onOkBtnClick = function(comp, info)
{
	//TODO:edit here		
	var selBtn = this.rdoManager.getSelectButton();	
	
	// 선택한 펀드가 없을 경우 체크
	if(!selBtn){
		AToast.show('보유펀드를 선택해주세요.');
		return;
	}		
	
	// 현재 선택한 펀드내용 모두 담아서 내려줌.
	this.close(this.selectFund);	
};

FD1503_W00.prototype.onGrid1ScrollBottom = function(comp, info)
{
	//TODO:edit here
	if(this.contiKey)
	{
		this.sendDataManage();
	}
	else
	{	
		if(comp.getRowCount() > 0) AToast.show(Message.LastList);
	}

};
