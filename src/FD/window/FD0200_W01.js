
/**
Constructor
Do not call Function in Constructor.
*/


//유형A (약관동의 포함)
//menuId = "SMSCERTA"; 
function FD0200_W01(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD0200_W01.lay';

	//TODO:edit here
		
	this.qryTp = '2'    // 조회 구분 0.실명확인번호 1.고객번호 2.계좌번호
	this.accNo = null; // 실명확인번호 or 고객 번호 or 계좌번호 
	this.phoneNo = null; // 휴대폰 번호 
	this.phoneNoCode = null;  // 통신사 data 코드  [{text:'SKT',data:'1'},{text:'KT',data:'2'},{text:'LGU+',data:'3'},{text:'SKT알뜰폰',data:'5'},{text:'KT알뜰폰',data:'6'},{text:'LGU+알뜰폰',data:'7'}];
	
	this.birthdayTxt = null; 
	
}
afc.extendsClass(FD0200_W01, BaseWindow);


FD0200_W01.prototype.onReady = function()
{

	BaseWindow.prototype.onReady.call(this);
	
	
	this.btnView = this.findCompById('BtnView');
	this.mobileView = this.findCompById('MobileView');
	this.loadView = this.mobileView.loadView; 
	
	
	this.loadView.phoneInfo.phoneNm = this.phoneNo; 
	this.loadView.phoneInfo.noCode = this.phoneNoCode; 
		
	this.loadView.accNo = this.accNo;
	
	
	if (this.birthdayTxt != null  ){
		this.loadView.birthdayTxt = this.birthdayTxt;
		}
	this.resetMobileView();

};

FD0200_W01.prototype.resetMobileView = function()
{	
		
	this.loadView.resetView();
}


FD0200_W01.prototype.onCancelBtnClick = function(comp, info)
{
	this.clearLocalData();
	this.close(0);

};

FD0200_W01.prototype.onConfirmBtnClick = function(comp, info)
{
	var mView = this.loadView;
	var thisObj=this;
	

		mView.confirmUser(function(success)
		{
			
			if(success) {
				thisObj.phoneNo = thisObj.loadView.phoneInfo.phoneNm;				 
				thisObj.phoneNoCode = thisObj.loadView.phoneInfo.noCode ; 
				thisObj.birthdayTxt = thisObj.loadView.birthdayTxt ; 
				thisObj.close(1); 
			
			/*
			//	등록 여부 확인
				thisObj.check_sendSACMT469(
				
				function (blockData) {		// 이미 등록 된 경우 		
				
				//정정 - ( 유형 A 로 호출한 경우에만 정정)							
				if ( !thisObj.isSimpleSMS)
					thisObj.correct_sendSACMT469();	
				else 
					thisObj.close(1); //팝업 종료 
				},
				function(blockData) { 		// 처음 등록 
				//등록 
					thisObj.sendSACMT469();
				});
				
			*/
			}
			else 
			{
				AToast.show('휴대폰 본인 확인에 실패하였습니다');
			}
		});
	
};



FD0200_W01.prototype.onCancelWindowBtnClick = function(comp, info)
{
	this.clearLocalData();
	this.close(0); 

};


FD0200_W01.prototype.clearLocalData = function()
{

	this.accNo = null; 
	this.phoneNo = null; 	// 전화번호
	this.phoneNoCode = null;  //통신사	
	this.birthdayTxt= null;
	
	this.resetMobileView();
}