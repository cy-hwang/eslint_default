
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_T13()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(MS1005_T13, AView);


MS1005_T13.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.cipheredPW=null;
	
	this.wholeView=this.findCompById('View21');
	
	this.dpBox1 = this.findCompById('DropBox1'); //펀드잔고
	this.dpBox3 = this.findCompById('DropBox3'); //매매내역, 계좌정보 등
	this.dpBox7 = this.findCompById('DropBox7'); // 자산운용보고서 통보지
	this.dpBox8 = this.findCompById('DropBox8'); // 기타 우편물
	
	this.securityPw = this.findCompById('XSecureTextField1');
	this.securityPwCheck = this.findCompById('XSecureTextField2');
	
	//복수 E2E 가능하므로 RSA 암호화로 수정 2018.07.04 KJK
	//이어하기가 아닌 경우에만
/*	if(!theApp.ifContinued) {
		this.securityPw.padOption.encryptMethod='seed';
		this.securityPwCheck.padOption.encryptMethod='seed';
	}
*/	
	this.btnView = this.findCompById('View10');

	//펀드잔고
	this.dpBox1.addItem('SMS','10');
	this.dpBox1.addItem('EMAIL','04');
	// this.dpBox1.addItem('주소지','01');
	this.dpBox1.addItem('통보사절','06');
	
	//매매내역, 계좌정보 등 >> SMS 약정
	this.dpBox3.addItem('SMS','1');
	this.dpBox3.addItem('통보사절','0');

	//자산운용보고서
	this.dpBox7.addItem('EMAIL','04');
	this.dpBox7.addItem('주소지','01');
	this.dpBox7.addItem('통보사절','06');
	
	//기타 우편물
	this.dpBox8.addItem('EMAIL','04');
	this.dpBox8.addItem('주소지','01');
	this.dpBox8.addItem('통보사절','06');
	
	this.clearBtn1 = this.findCompById('Button4');
	this.clearBtn2 = this.findCompById('Button5');
	this.clearBtn1.show(AComponent.GONE);
	this.clearBtn2.show(AComponent.GONE);
	
	this.zPdptnCode = null;
    this.zPrdtDtlCode = null;
	this.accountCount = 0;

	//fourierx
	this.EmpNoTxt = this.findCompById('EmpNoTxt');
	this.EmpNmTxt = this.findCompById('EmpNmTxt');

};



MS1005_T13.prototype.onActive = function(reload)
{
	AView.prototype.onActive.call(this, reload)

	if( reload)
	{
		theApp.checkCreateDatetime();
	}
	
	this.setPdptnCode();
	this.colorCheck();
	this.setAccountCount();
};

MS1005_T13.prototype.setAccountCount = function()
{
	this.accountCount = 0;
	
	if(theApp.getProductId('수익증권')) {
		this.accountCount++;
	} 
};

MS1005_T13.prototype.setPdptnCode = function()
{
	this.zPdptnCode = null;
    this.zPrdtDtlCode = null;
	
	if(theApp.getProductId('수익증권')) {
		this.zPdptnCode = '04'
		this.zPrdtDtlCode = '61'
	}
};

MS1005_T13.prototype.checkVaild = function()
{
	if( !this.securityPw.getText())
	{
		AToast.show('신규 비밀번호를 입력해주세요.');
		this.securityPw.addClass('TF_03');
		return false;
	}
	
	if( !this.securityPwCheck.getText() )
	{
		AToast.show('신규 비밀번호 확인을 입력해주세요.');
		this.securityPwCheck.addClass('TF_03');
		return false;
	}
	
	if( null == this.dpBox1.getSelectedItem() )
	{
		AToast.show('펀드잔고 통보처를 선택해주세요');
		this.dpBox1.addClass('DR_01_2');
		return false;
	}
	
	if( null == this.dpBox3.getSelectedItem() )
	{
		AToast.show('매매내역, 계좌정보 통보처를 선택해주세요');
		this.dpBox3.addClass('DR_01_2');
		return false;
	}
	if( null == this.dpBox7.getSelectedItem() )
	{
		AToast.show('자산운용보고서 통보처를 선택해주세요');
		this.dpBox7.addClass('DR_01_2');
		return false;
	}
	if( null == this.dpBox8.getSelectedItem() )
	{
		AToast.show('기타 우편물 통보처를 선택해주세요');
		this.dpBox8.addClass('DR_01_2');
		this.wholeView.scrollToBottom();
		return false;
	}
	return true;
};


MS1005_T13.prototype.onButtonGoNext = function(comp, info)
{	
	if( !this.checkVaild())
	{		
		return;
	}
	
	var thisObj = this;
	var tempPw = this.securityPw.getCipherData();
	var tempPwCheck = this.securityPwCheck.getCipherData();	

	this.cipheredPW=tempPw;
	
	//이어하기의 경우 실명확인번호가 RSA 암호화되어 있으므로, 계좌비밀번호를 복호화 할 필요 없음 > 이경우 암호화방식은 RSA 2018.02.28 HCY
	//복수 E2E 적용으로 복호화 방식 나눌 필요 없음 2018.07.03 KJK
	AppManager.showTextProgress('<span class="SB" style="color:#ffffff; font-size:24px;">계좌를 개설하는 중입니다.</span>');
	thisObj.send_SACMT632(tempPw, tempPwCheck);
	
/*	if(theApp.ifContinued) {
		AppManager.showTextProgress('<span class="SB" style="color:#ffffff; font-size:24px;">계좌를 개설하는 중입니다.</span>');
		thisObj.send_SACMT632(tempPw, tempPwCheck);
		//메리츠 > 은행연합회에 가입되어 있지 않으며, 대포통장명의인 정보조회 진행하지 않음 : 해당 사안은 확정안이 아니기에 주석처리함
		//thisObj.send_SACMT142();
	
	//처음부터 진행할 경우 실명확인번호가 OCR 암호화되어 있으므로, 계좌비밀번호 복호화 필요 > 이경우 암호화방식은 SEED 2018.02.28 HCY
	} else {
		SecurePadManager.cipherToText(tempPw, function(result)
		{
			SecurePadManager.cipherToText(tempPwCheck, function(result1)
			{
				AppManager.showTextProgress('<span class="SB" style="color:#ffffff; font-size:24px;">계좌를 개설하는 중입니다.</span>');
				thisObj.send_SACMT632(result, result1);
				//메리츠 > 은행연합회에 가입되어 있지 않으며, 대포통장명의인 정보조회 진행하지 않음 : 해당 사안은 확정안이 아니기에 주석처리함
				//thisObj.send_SACMT142();
			});
		});	
	}*/
};


MS1005_T13.prototype.process_send_SACMT634 = function()
{
	var tempPw = this.securityPw.getCipherData();
	var tempPwCheck = this.securityPwCheck.getCipherData();
	var thisObj = this;
	
	//계좌비밀번호 검증을 서비스에서 수행하므로 SEED 필요없음 2018.07.03 KJK
	thisObj.send_SACMT632(tempPw, tempPwCheck);
	/*SecurePadManager.cipherToText(tempPw, function(result)
	{
		SecurePadManager.cipherToText(tempPwCheck, function(result1)
		{
			if( result != result1 )
			{
				AppManager.hideTextProgress();
				AToast.show('비밀번호가 다릅니다');
				thisObj.securityPwCheck.addClass('TF_03');
				return;
			}
			else
			{	
  				thisObj.send_SACMT632(result, result1);
			}
		});
	});*/
};

MS1005_T13.prototype.send_SACMT632 = function(pw, pwCheck)
{
	var thisObj = this;

	QryRequest.request('SACMT632',						
	function(queryData){		
	
		var inBlock1 = queryData.getBlockData('InBlock1')[0];
		
		inBlock1['D1처리구분'] = '2'
		inBlock1['D1실명확인번호'] = theApp.userInfo.getUserData('D1실명확인번호암호화');
		inBlock1['D1고객명'] = theApp.userInfo.getUserData('D1고객명');
		inBlock1['D1본인확인구분'] = 'A'
		inBlock1['D1상품유형코드'] = thisObj.zPdptnCode;
		inBlock1['D1상품상세코드'] = thisObj.zPrdtDtlCode;
		inBlock1['D1IC Card 발급구분'] = theApp.userInfo.getUserData('D1IC Card 발급구분');
		inBlock1['D1OTP발급구분'] = theApp.userInfo.getUserData('D1OTP발급구분');
		inBlock1['D1보안카드 발급구분'] = theApp.userInfo.getUserData('D1보안카드 발급구분');
		inBlock1['D1거래매체수령주소유형코드'] = theApp.userInfo.getUserData('D1거래매체수령주소유형코드');
		inBlock1['D1영상통화일련번호'] = theApp.userInfo.getUserData('D1영상통화일련번호');
		inBlock1['D1당타사여부'] = '1'
		inBlock1['D1은행코드'] = theApp.userInfo.getUserData('D1은행코드');
		inBlock1['D1기관계좌번호'] = theApp.userInfo.getUserData('D1기관계좌번호');
		inBlock1['D1비밀번호'] = theApp.userInfo.getUserData('D1비밀번호');
		inBlock1['D1이체금액'] = theApp.userInfo.getUserData('D1이체금액');
		inBlock1['D1상대기관코드'] = theApp.userInfo.getUserData('D1상대기관코드');
		inBlock1['D1상대계좌번호'] = theApp.userInfo.getUserData('D1상대계좌번호');
		inBlock1['D1상대계좌명'] = theApp.userInfo.getUserData('D1상대계좌명');
		inBlock1['D1자택우편번호'] = theApp.userInfo.getUserData('D1자택우편번호');
		inBlock1['D1자택동이상주소'] = theApp.userInfo.getUserData('D1자택동이상주소');
		inBlock1['D1자택동이하주소2'] = theApp.userInfo.getUserData('D1자택동이하주소2');
		inBlock1['D1자택전화지역번호'] = theApp.userInfo.getUserData('D1자택전화지역번호');
		inBlock1['D1자택전화국번호'] = theApp.userInfo.getUserData('D1자택전화국번호');
		inBlock1['D1자택전화일련번호'] = theApp.userInfo.getUserData('D1자택전화일련번호');
		inBlock1['D1팩스지역번호1'] = theApp.userInfo.getUserData('D1팩스지역번호1');
		inBlock1['D1팩스국번호1'] = theApp.userInfo.getUserData('D1팩스국번호1');
		inBlock1['D1팩스일련번호1'] = theApp.userInfo.getUserData('D1팩스일련번호1');
		inBlock1['D1이메일주소'] = theApp.userInfo.getUserData('D1이메일주소');
		inBlock1['D1이동전화식별번호'] = theApp.userInfo.getUserData('D1이동전화식별번호');
		inBlock1['D1이동전화국번호'] = theApp.userInfo.getUserData('D1이동전화국번호');
		inBlock1['D1이동전화일련번호'] = theApp.userInfo.getUserData('D1이동전화일련번호');
		inBlock1['D1휴대폰지역번호'] = theApp.userInfo.getUserData('D1휴대폰지역번호');
		inBlock1['D1휴대폰국번호'] = theApp.userInfo.getUserData('D1휴대폰국번호');
		inBlock1['D1휴대폰일련번호'] = theApp.userInfo.getUserData('D1휴대폰일련번호');
		inBlock1['D1디바이스고유번호'] = theApp.userInfo.getUserData('D1디바이스고유번호');
		inBlock1['D1이미지번호'] = theApp.userInfo.getUserData('D1이미지번호');
		inBlock1['D1영상이미지번호'] = theApp.userInfo.getUserData('D1영상이미지번호');
		
// 		queryData.printQueryData();
		queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
	},
	
	function(queryData)
	{	
		var errCode = this.getLastError('errCode');
		if( errCode >= 1000)
		{
			if(errCode != 3582) {
				AppManager.hideTextProgress();		
				theApp.getErrMsg(thisObj,this);
			} else {
				thisObj.send_SACMT634(pw, pwCheck);		
			}
			//this.printLastError();
		}
		else if(queryData)
		{
			AppManager.setProgProg(90);
// 			queryData.printQueryData();
			thisObj.send_SACMT634(pw, pwCheck);			
		}
		else 
		{
			AppManager.hideTextProgress();	
			this.printLastError();
			
			AToast.show('통신 상태가 원활하지 않습니다.\n다시 시도해 주십시오');
		}
	});
};

MS1005_T13.prototype.send_SACMT634 = function(pw, pwCheck)
{	
	var thisObj = this;
	QryRequest.request('SACMT634',						
	function(queryData){		
		var inBlock1 = queryData.getBlockData('InBlock1')[0];
		inBlock1['D1실명확인번호'] = theApp.userInfo.getUserData('D1실명확인번호암호화');
		inBlock1['D1실명확인방법코드'] = '01';
		inBlock1['D1고객명'] = theApp.userInfo.getUserData('D1고객명');
		inBlock1['D1영문고객명'] = '';
		inBlock1['D1본인확인구분'] = 'A';
		inBlock1['D1내외국인코드'] = '01';
		inBlock1['D1국내거주여부'] = '1';
		inBlock1['D1소득자코드'] = '111';
		inBlock1['D1투자자분류코드'] = '151';
		inBlock1['D1고객단체종류코드'] = '01';
		inBlock1['D1배당세과세여부'] = '1';
		inBlock1['D1이용료과세여부'] = '1';
		inBlock1['D1국적국가번호'] = '000';
		inBlock1['D1거주국가번호'] = '000';

		var inBlock2 = queryData.getBlockData('InBlock2')[0];
		inBlock2['D1계좌명'] = theApp.userInfo.getUserData('D1고객명');
		inBlock2['D1계좌한글부기명'] = '';
		inBlock2['D1계좌영문부기명'] = '';
		inBlock2['D1비밀번호'] = pw;
		inBlock2['D1비밀번호확인'] = pwCheck;
		inBlock2['D1개설지점번호'] = '002'; //비대면
		inBlock2['D1원천징수위임여부'] = '1';
		inBlock2['D1원장통보주소유형코드'] = '06'; //안씀
		inBlock2['D1매매통보주소유형코드'] = '06'; //안씀
		inBlock2['D1실질주주통보코드'] = thisObj.dpBox8.getSelectedItemData();
		inBlock2['D1약관변경통보지'] = '';
		inBlock2['D1약정구분'] = thisObj.dpBox3.getSelectedItemData();	//매매내역, 계좌정보 등 : SMS = 1, 불원 = 0
		inBlock2['D1이체금액'] = 0;
		inBlock2['D1상대기관코드'] = '';
		inBlock2['D1상대계좌번호'] = '';
		inBlock2['D1상대계좌명'] = '';
		
		// 자택주소
		var inBlock3 = queryData.getBlockData('InBlock3')[0];
		inBlock3['D1우편번호'] = theApp.userInfo.getUserData('D1자택우편번호');
		inBlock3['D1동이상주소'] = theApp.userInfo.getUserData('D1자택동이상주소');
		inBlock3['D1동이상주소사용여부'] = '1';
		inBlock3['D1동이하주소'] = theApp.userInfo.getUserData('D1자택동이하주소2');
		inBlock3['D1전화지역번호'] = theApp.userInfo.getUserData('D1자택전화지역번호');
		inBlock3['D1전화국번호'] = theApp.userInfo.getUserData('D1자택전화국번호');
		inBlock3['D1전화일련번호'] = theApp.userInfo.getUserData('D1자택전화일련번호');
		inBlock3['D1팩스지역번호'] = '';
		inBlock3['D1팩스국번호'] = '';
		inBlock3['D1팩스일련번호'] = '';
		inBlock3['D1대표여부'] = '1'; 
		inBlock3['D1새주소적용여부'] = '1'; // 주소 입력시점에 적용여부도 저장하고 633에 받아와야함
		inBlock3['D1도로코드'] = '';
		inBlock3['D1세부유형코드'] = '';
		inBlock3['D1지하구분'] = '';
		inBlock3['D1각주코드'] = '';
		inBlock3['D1처리코드1'] = '';

		// 직장주소 
		var inBlock4 = queryData.getBlockData('InBlock4')[0];		
		// 기타주소
		var inBlock5 = queryData.getBlockData('InBlock5')[0];


		var inBlock6 = queryData.getBlockData('InBlock6')[0];
		inBlock6['D1이메일주소'] = theApp.userInfo.getUserData('D1이메일주소');
		
		var inBlock7 = queryData.getBlockData('InBlock7')[0];
		inBlock7['D1이동전화식별번호'] = theApp.userInfo.getUserData('D1이동전화식별번호');
		inBlock7['D1이동전화국번호'] = theApp.userInfo.getUserData('D1이동전화국번호');
		inBlock7['D1이동전화일련번호'] = theApp.userInfo.getUserData('D1이동전화일련번호');
		inBlock7['D1휴대폰지역번호'] = theApp.userInfo.getUserData('D1휴대폰지역번호');
		inBlock7['D1휴대폰국번호'] = theApp.userInfo.getUserData('D1휴대폰국번호');
		inBlock7['D1휴대폰일련번호'] = theApp.userInfo.getUserData('D1휴대폰일련번호');
		
		var inBlock8 = queryData.getBlockData('InBlock8')[0];
		if(theApp.getProductId('수익증권')){
			inBlock8['D1상품유형코드'] = thisObj.zPdptnCode; //'04'; // 투신
			inBlock8['D1상품상세코드'] = thisObj.zPrdtDtlCode; //'61';
		}
		
		//fourierx
		inBlock8['D1관리사원번호'] = thisObj.EmpNoTxt.getText();
		inBlock8['D1권유자사원번호'] = thisObj.EmpNoTxt.getText();
	
		// 수익증권
		var inBlock12 = queryData.getBlockData('InBlock12')[0];		
		if(theApp.getProductId('수익증권'))
		{
			inBlock12['D1투자신탁투자자분류코드'] = '0000';
			inBlock12['D1자산운용보고서통보지'] = thisObj.dpBox7.getSelectedItemData();
			inBlock12['D1투자신탁잔고통보지'] = thisObj.dpBox1.getSelectedItemData();
		}
		//이어하기의 경우, 신분증과 함께 비밀번호 또한 RSA로 암호화 2018.02.28 HCY
		if(theApp.ifContinued) {
			queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);	//RSA
			queryData.putPwInfo('InBlock2', 'D1비밀번호', false, theApp.encryptType);	//RSA
			queryData.putPwInfo('InBlock2', 'D1비밀번호확인', false, theApp.encryptType);	//RSA
		}
		else{
			//복수 E2E 적용 2018.07.03 KJK
			queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);	//OCR
			queryData.putPwInfo('InBlock2', 'D1비밀번호', false, AQuery.RSA);	//RSA
			queryData.putPwInfo('InBlock2', 'D1비밀번호확인', false, AQuery.RSA);	//RSA			
		}
	},
	
	function(queryData)
	{	
		//광고측정 계좌개설 완료시
// 		NFTFManager.adbrix(theApp.uId+'_SACMT634');
		
		var errCode = this.getLastError('errCode');
		if( errCode >= 1000)
		{
			AppManager.hideTextProgress();	
			//계좌비밀번호 상이함 알림창	2018.02.28 HCY
			if(errCode == 1801) {
				var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');
				win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">계좌 비밀번호와 계좌비밀번호 확인의 입력값이 상이합니다.<br>(SACMT634)(1801)</span>';
				win.openAsDialog(thisObj);
			} else {
				theApp.getErrMsg(thisObj,this);
			}
		}
		else if(queryData)
		{
			AppManager.setProgProg(100);
// 			queryData.printQueryData();
			var blockData = queryData.getBlockData('OutBlock1')[0];
			theApp.userInfo.setUserData('D1종합계좌번호', blockData['D1계좌번호']);
			theApp.userInfo.setUserData('D1계좌번호', blockData['D1개별계좌번호']);
			theApp.userInfo.setUserData('D1계좌비밀번호', thisObj.cipheredPW);
		
			theApp.saveStep('7', function(){
				AppManager.hideTextProgress();
				thisObj.getContainer().nextView();
			});
		}
		
		else 
		{
			AppManager.hideTextProgress();	
			AToast.show('통신 상태가 원활하지 않습니다.\n다시 시도해 주십시오');
		}
	});
};

MS1005_T13.prototype.onButtonGoBack = function(comp, info)
{
	this.resetPage();
	this.getContainer().beforeView();
};

MS1005_T13.prototype.onWindowResult = function(result, awindow)
{
	if( awindow.containerId == 'MS1005_W04')
	{
		if( 1 == result )
		{
			AppManager.showTextProgress('<span class="SB" style="color:#ffffff; font-size:24px;">계좌를 개설하는 중입니다.</span>');
			AppManager.setProgProg(70);
			this.process_send_SACMT634();
		}
	}
	else if(awindow.containerId == 'MS1005_W17')
	{
        if(result)
        {
		    this.EmpNoTxt.setText(result[0]);
		    this.EmpNmTxt.setText(result[1]);
	    }
	}
};

MS1005_T13.prototype.onDropBox1Select = function(comp, info)
{
	if( '주소지' == comp.getSelectedItemText() )
	{
		if(!theApp.userInfo.getUserData('D1자택우편번호'))
		{
			comp.clearSelectItem();
			var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');			
			win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">주소지가 등록되어 있지 않습니다.</span>';
			win.openAsDialog(this);
		} else {
			comp.removeClass('DR_01_2');
		}		
	}
	else if( 'EMAIL' == comp.getSelectedItemText() )
	{
	    //fourierx
		if(!theApp.userInfo.getUserData('D1이메일주소') || "@" == theApp.userInfo.getUserData('D1이메일주소'))
		{
			comp.clearSelectItem();
			var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');
			
			win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">Email 정보가 없습니다. <BR> 다른 통보지를 선택해주시기 바랍니다.</span>';
			win.openAsDialog(this);
		} else {
			comp.removeClass('DR_01_2');
		}
	}
	else if( 'SMS' == comp.getSelectedItemText() )
	{
		if(!theApp.userInfo.getUserData('D1이동전화식별번호') || !theApp.userInfo.getUserData('D1이동전화국번호') || !theApp.userInfo.getUserData('D1이동전화일련번호'))
		{
			comp.clearSelectItem();
			var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');
			
			win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">휴대폰 정보가 등록되어 있지 않습니다.</span>';
			win.openAsDialog(this);
		} else {
			comp.removeClass('DR_01_2');
		}
	}
	else {
		comp.removeClass('DR_01_2');
	}	
};

MS1005_T13.prototype.send_SACMT142 = function()
{
//SACMT142 -> SACMT148 -> SACMT146 -> [SACMQ930] -> SACMQ634 -> SACMT634 -> SACMT150
	AppManager.showTextProgress('<span class="SB" style="color:#ffffff; font-size:24px;">계좌를 개설하는 중입니다.</span>');
	
	var thisObj = this;
	QryRequest.request('SACMT142',
		function(queryData)
		{
			var inBlock1 = queryData.getBlockData('InBlock1');
			inBlock1[0] ={				
					"D1실명확인번호": theApp.userInfo.getUserData('D1실명확인번호암호화'),
					"D1최종전문번호":''
			};
			queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
		},
		function(queryData){	
			/*if( queryData){
				queryData.printQueryData();				
			}
			else{
				this.printLastError();
			}*/
		},
		function(queryData)
		{
			var errCode = this.getLastError('errCode');
			
			if( errCode >= 1000 && errCode!=2679)
			{
				AppManager.hideTextProgress();
				theApp.getErrMsg(thisObj,this);
			}
			else if( queryData)
			{
// 				queryData.printQueryData();			
				var outBlock = queryData.getBlockData('OutBlock1')[0];
				
				if( 1 <= outBlock['D1등록건수'] )
				{
					AppManager.hideTextProgress();					
					
					thisObj.cantMake();
			
					// 일정 시간 후 앱 종료
					setTimeout(function()
					{
						//theApp.navigator.goPage('MS1006');
						theApp.navigator.goPage('MS1005',false);	
					}, Define.EXIT_DELAY);
				}
				
				//전화 금융 사기 계좌명의인 이 아닌 경우 개설 진행......
				else
				{
					AppManager.setProgProg(14);
					thisObj.send_SACMT148();
				}				
			}		
		}
	);
};

MS1005_T13.prototype.send_SACMT148 = function()
{
	var thisObj = this;
	QryRequest.request('SACMT148',
		function(queryData)
		{
			var inBlock1 = queryData.getBlockData('InBlock1');
			inBlock1[0] ={				
					"D1실명확인번호": theApp.userInfo.getUserData('D1실명확인번호암호화'),
					"D1최종전문번호":''
			};
			queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
		},
		function(queryData)
		{
			/*var errCode = this.getLastError('errCode');
			if( errCode >= 1000)
			{
				this.printLastError();
			}
			else if( queryData){
				queryData.printQueryData();				
			}		*/	
		},
		function(queryData)
		{
			var errCode = this.getLastError('errCode');
			if( errCode >= 1000 && errCode != 2679)
			{
				AppManager.hideTextProgress();			
				theApp.getErrMsg(thisObj,this);
			}
			else if( queryData)
			{
// 				queryData.printQueryData();		
				var outBlock = queryData.getBlockData('OutBlock1')[0];
				
				if( 1 <= outBlock['D1등록건수'] )
				{
					AppManager.hideTextProgress();

					thisObj.cantMake();
			
					// 일정 시간 후 앱 종료
					setTimeout(function()
					{
						//theApp.navigator.goPage('MS1006');
						theApp.navigator.goPage('MS1005',false);	
					}, Define.EXIT_DELAY);
				}
				
				//대포통장 명의인 이 아닌 경우 개설 진행......
				else
				{
					AppManager.setProgProg(28);
					thisObj.send_SACMT146();
				}
			}			
		}
	);
};

MS1005_T13.prototype.send_SACMT146 = function()
{
	var thisObj = this;
	
	QryRequest.request('SACMT146',
		function(queryData)
		{
			var inBlock1 = queryData.getBlockData('InBlock1');
			inBlock1[0] ={				
					"D1실명확인번호": theApp.userInfo.getUserData('D1실명확인번호암호화'),
					"D1최종전문번호":''
			};
			queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
		},
		function(queryData)
		{
			/*var errCode = this.getLastError('errCode');
			if( errCode >= 1000)
			{
				this.printLastError();
			}
			else if( queryData){
				queryData.printQueryData();				
			}*/
		},
		function(queryData)
		{
			var errCode = this.getLastError('errCode');
			if( errCode >= 1000 && errCode != 2679)
			{
				AppManager.hideTextProgress();		
				theApp.getErrMsg(thisObj,this);
			}
			else if(queryData)
			{
// 				queryData.printQueryData();		
				var outBlock = queryData.getBlockData('OutBlock1')[0];
				AppManager.setProgProg(42);
				
				//단기간 다수 계좌 개설 건수가 없는 경우 ....
				if( 0 == outBlock['D1등록건수'] )
				{
					//대포통장의심계좌명의인 상태 조회로 진행......
					thisObj.send_SACMQ930();
				}
				else
				{
					//금일 금융거래목적확인 발급 회수 확인으로 진행.....
					thisObj.send_SACMQ634();
				}
			}			
		}
	);
};


//대포통장의심계좌명의인 상태 조회
MS1005_T13.prototype.send_SACMQ930 = function() // 동기식
{	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {
		dd='0'+dd
	} 
	if(mm<10) {
		mm='0'+mm
	} 	
	
	var date = yyyy+mm+dd;
	
	var thisObj = this;
	QryRequest.request('SACMQ930',
		function(queryData)
		{
			var inBlock1 = queryData.getBlockData('InBlock1');
			inBlock1[0] =
			{
				"D1실명확인번호": theApp.userInfo.getUserData('D1실명확인번호암호화'),
				"D1발행명" : theApp.userInfo.getUserData('D1고객명'),
				"D1시작일자" : "00000000",
				"D1종료일자" : date,
				"D1지점명" : '',
				"D1조회구분" : '1'
			};
			queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
			
		},
		function(queryData)
		{		
			var errCode = this.getLastError('errCode');
			if( errCode >= 1000 && errCode != 2679)
			{
				AppManager.endOltp();
				theApp.getErrMsg(thisObj,this);
				//this.printLastError();
			}
			else if(queryData)
			{
// 				queryData.printQueryData();
				var outBlock1 = queryData.getBlockData('OutBlock1')[0];
				
				//빈 값이면 
				if(!outBlock1['D1실명확인번호'] && this.accountCount == 1)
				{				
					//바로 계좌개설 신청서 등록
					AppManager.setProgProg(56);
					thisObj.process_send_SACMT634(); 
				}
				
				//특정 값이 셋팅되어져 있으면 
				else
				{
					// 금융거래목적 확인서 등록 절차
					AppManager.setProgProg(56);
					thisObj.send_SACMQ634(); 
				}
			}
		}
	);
};

MS1005_T13.prototype.send_SACMQ634 = function()
{	
	var thisObj = this;
	QryRequest.request('SACMQ634',
		function(queryData)
		{
			var inBlock1 = queryData.getBlockData('InBlock1');
			inBlock1[0] =
			{
				"D1실명확인번호": theApp.userInfo.getUserData('D1실명확인번호암호화')
			};
			queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
		},
		function(queryData)
		{		
			var errCode = this.getLastError('errCode');
			if( errCode >=1000 )
			{
				AppManager.hideTextProgress();		
				theApp.getErrMsg(thisObj,this);
			}
			else if( queryData)
			{
// 				queryData.printQueryData();
				var outBlock1 = queryData.getBlockData('OutBlock1')[0];
				
				if( '1' == outBlock1['D1금융거래목적확인서등록여부'] )
				{
					AppManager.setProgProg(84);
					thisObj.process_send_SACMT634();
				}
				else
				{
					AppManager.hideTextProgress();		
					var win = AWindow.createWindow('FD/window/MS1005_W04.lay','MS1005_W04');
					win.name = theApp.userInfo.getUserData('D1고객명');
					win.openAsDialog(thisObj);
 				}
			}	
		}
	);
};

MS1005_T13.prototype.onImage1ActionDown = function(comp, info)
{
	this.securityPw.setText('');
	this.clearBtn1.show(AComponent.GONE);
};

MS1005_T13.prototype.onImage2ActionDown = function(comp, info)
{
	this.securityPwCheck.setText('');
	this.clearBtn2.show(AComponent.GONE);	
};

MS1005_T13.prototype.onXSecureTextField1Change = function(comp, info)
{
	var srchTxt = comp.getText();
	
	if(srchTxt.length == 0)
	{
		this.clearBtn1.show(AComponent.GONE);
	}
	else 
	{
		this.clearBtn1.show(AComponent.VISIBLE);
		comp.removeClass('TF_03');
		comp.removeClass('TF_03');
	}
	this.colorCheck();
};

MS1005_T13.prototype.onXSecureTextField2Change = function(comp, info)
{
	var srchTxt = comp.getText();
	
	if(srchTxt.length == 0)
	{
		this.clearBtn2.show(AComponent.GONE);
	}
	else 
	{
		this.clearBtn2.show(AComponent.VISIBLE);
		comp.removeClass('TF_03');
		comp.removeClass('TF_03');
	}
	this.colorCheck();
};

MS1005_T13.prototype.resetPage = function()
{
	this.dpBox1.clearSelectItem();
	this.dpBox3.clearSelectItem();
	this.dpBox7.clearSelectItem();
	this.dpBox8.clearSelectItem();
};

MS1005_T13.prototype.cantMake = function()
{
	var win = AWindow.createWindow('FD/window/MS1005_W05.lay', 'MS1005_W05');
	win.infoMsg = '<span class="SB" style="color:#323b4c; font-size:24px; line-height:141%">고객센터로 문의하시기 바랍니다.<br>TEL : 1500-7600</span>';
	win.openAsDialog(thisObj);
};

MS1005_T13.prototype.colorCheck = function(comp, info)
{
	if( !this.securityPw.getText() || this.securityPw.getText() == '')
	{
		this.securityPw.addClass('TF_03');
		return;
	} 
	
	if( !this.securityPwCheck.getText() || this.securityPwCheck.getText() == '')
	{
		this.securityPwCheck.addClass('TF_03');
		return;
	}
};
MS1005_T13.prototype.onDropBox2Select = function(comp, info)
{
	comp.removeClass('DR_01_2');
};

MS1005_T13.prototype.onButton6Click = function(comp, info)
{

	//TODO:edit here
	var win = AWindow.createWindow('FD/window/MS1005_W17.lay', 'MS1005_W17');
	win.openAsDialog(this);

};
