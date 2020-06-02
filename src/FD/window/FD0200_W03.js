
/**
Constructor
Do not call Function in Constructor.
*/


//유형B (약관동의 미포함)
//menuId = "SMSCERTB"; 
function FD0200_W03(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD0200_W03.lay';

	//TODO:edit here
		
	this.qryTp = '2'    // 조회 구분 0.실명확인번호 1.고객번호 2.계좌번호
	this.accNo = null; // 실명확인번호 or 고객 번호 or 계좌번호 
	this.phoneNo = null; // 휴대폰 번호 
	this.noCode = null;  // 통신사 data 코드  [{text:'SKT',data:'1'},{text:'KT',data:'2'},{text:'LGU+',data:'3'},{text:'SKT알뜰폰',data:'5'},{text:'KT알뜰폰',data:'6'},{text:'LGU+알뜰폰',data:'7'}];
	this.isSimpleSMS = true; 
	
}
afc.extendsClass(FD0200_W03, BaseWindow);


FD0200_W03.prototype.onReady = function()
{
	var thisObj = this; 	
	
	BaseWindow.prototype.onReady.call(this);
	this.btnView = this.findCompById('BtnView');
	this.mobileView = this.findCompById('MobileView');
	this.loadView = this.mobileView.loadView; 
	
	
	this.loadView.phoneInfo.phoneNm = this.phoneNo; 
	this.loadView.phoneInfo.noCode = this.phoneNoCode; 
		
	this.loadView.accNo = this.accNo;
		
	if (this.birthdayTxt != null  ){
		this.loadView.birthdayTxtString = this.birthdayTxt; 	  	  }
	this.resetMobileView();

};

FD0200_W03.prototype.resetMobileView = function()
{	
	this.loadView.TitleView.show(AComponent.GONE);
	
	//this.loadView.BirthDatView.show(AComponent.GONE);
	this.loadView.TelecomView.show(AComponent.GONE);
	this.loadView.resetView();
}


FD0200_W03.prototype.onCancelBtnClick = function(comp, info)
{
	this.resetMobileView();
	this.close(0);

};

FD0200_W03.prototype.onConfirmBtnClick = function(comp, info)
{
	var mView = this.loadView;
	var thisObj=this;
	if(mView.agreeValidCheck() && mView.inputValidCheck() )
	{
		mView.confirmUser(function(success)
		{

			if(success) {

				thisObj.resetMobileView();
				thisObj.close(1); //팝업 종료 				
			}
			else 
			{
				AToast.show('휴대폰 본인 확인에 실패하였습니다');
			}
		});
	}
};


FD0200_W03.prototype.onCancelWindowClick = function(comp, info)
{
	this.resetMobileView();
	this.close(0);

};
