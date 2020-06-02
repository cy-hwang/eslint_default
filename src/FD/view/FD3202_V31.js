
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_V31()
{
	AView.call(this);

	//TODO:edit here
	
	this.fundInfoChar = null;
		
}
afc.extendsClass(FD3202_V31, AView);


FD3202_V31.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
//	alert("11111");
	
	this.lblFundName = this.findCompById('lblFundName');
	this.lblFundName2 = this.findCompById('lblFundName2'); // 클래스상세 전체명 추가 2019.09.19
	
	//펀드정보 그리드
	this.fundInfoGrid = this.findCompById('fundInfoGrid');
	
	this.lblFundName.setShrinkInfo({maxChar:20, fontSize:24}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.lblFundName2.setShrinkInfo({maxChar:20, fontSize:24}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
	
	this.fundInfoGrid.setMaskInfo([
		 0, 0
		,0, 0
		,0, 0
		,0, Utils.formatDotDate // 설정일
		,0, 0
		,0, 0
		,0, 0 // 펀드순자산총액
		,0, 0
		,0, 0
		,0, 0 //총보수
		,0, 0
		,0, 0
		,0, 0
		,0, 0
		,0, 0
		,0, 0
		,0, 0
		,0, 0
		,0, 0
		,0, 0
	])
			
	//계좌번호 로드뷰
	this.accView = this.findCompById('AccView');
	this.accView.viewLoad('FD/view/FD0000_V02.lay');
	
	//계좌드롭박스
	this.accDbx = this.accView.getLoadView().accDbx;
	
	this.view1 = this.findCompById('View1');
	
	this.btnReg = this.findCompById('Button4');
};

FD3202_V31.prototype.onButton2Click = function(comp, info)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	var win = AWindow.createWindow('FD/window/FD3102_W01.lay','FD3102W01');		
	var fundCode = cont.selectFundInfo["D1투신펀드코드"];
	var setUrl = '';
	
	//2018.03.26 webView 하드코딩
	if(fundCode == '2066'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠코리아증권1호주식종류a/#phide_top';
	}else if(fundCode == '2105'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠코리아스몰캡증권투자신탁주식/#phide_top';
	}else if(fundCode == '2133'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠글로벌헬스케어증권투자신탁주식/#phide_top';
	}else if(fundCode == '2154'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠차이나증권투자신탁주식/#phide_top';
	}else if(fundCode == '2190'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠주니어증권자투자신탁주식-재간접형/#phide_top';
	}else if(fundCode == '2210'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠글로벌인프라증권자투자신탁주식/#phide_top';
	}else if(fundCode == '2228'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠샐러리맨증권자투자신탁주식-재간접형/#phide_top';
	}else if(fundCode == '2227'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠샐러리맨증권자투자신탁주식-재간접형/#phide_top';
	}else if(fundCode == '3027'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠코리아증권투자신탁주식혼합/#phide_top';
	}else if(fundCode == '4053'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠코리아증권채권혼합/#phide_top';
	}else if(fundCode == '4074'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠시니어증권자투자신탁채권혼합-재간접형-2/#phide_top';
	}else if(fundCode == '2000'){
		setUrl= 'https://www.meritzam.com/fund_pro/fund7005/#phide_top';
	}else if(fundCode == '4500'){
		setUrl= 'https://www.meritzam.com/fund_pro/fund1146/#phide_top TOP10';
	}else if(fundCode == '1500'){
		setUrl= 'https://www.meritzam.com/fund_pro/fund7052/#phide_top TOP10';
	}
	
	win.viewLink = setUrl;
	win.openAsDialog(this, '100%', '100%');
	//win.openAsDialog(theApp.frmPage, theApp.frmPage.getWidth(), theApp.frmPage.getHeight());
};

FD3202_V31.prototype.onButton3Click = function(comp, info)
{

	//TODO:edit here
	var thisObj = this;
	var cont = thisObj.getContainer();
	var win = AWindow.createWindow('FD/window/FD3102_W02.lay','FD3102W02');		
	var fundCode = cont.selectFundInfo["D1투신펀드코드"];
	var setUrl = '';
	
	//2018.03.26 webView 하드코딩
	if(fundCode == '2066'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠코리아증권1호주식종류a/#top10';
	}else if(fundCode == '2105'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠코리아스몰캡증권투자신탁주식/#top10';
	}else if(fundCode == '2133'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠글로벌헬스케어증권투자신탁주식/#top10';
	}else if(fundCode == '2154'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠차이나증권투자신탁주식/#top10';
	}else if(fundCode == '2190'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠주니어증권자투자신탁주식-재간접형/#top10';
	}else if(fundCode == '2210'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠글로벌인프라증권자투자신탁주식/#top10';
	}else if(fundCode == '2228'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠샐러리맨증권자투자신탁주식-재간접형/#top10';
	}else if(fundCode == '2227'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠샐러리맨증권자투자신탁주식-재간접형/#top10';
	}else if(fundCode == '3027'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠코리아증권투자신탁주식혼합/#top10';
	}else if(fundCode == '4053'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠코리아증권채권혼합/#top10';
	}else if(fundCode == '4074'){
		setUrl= 'http://www.meritzam.com/fund_pro/메리츠시니어증권자투자신탁채권혼합-재간접형-2/#top10';
	}else if(fundCode == '2000'){
		setUrl= 'https://www.meritzam.com/fund_pro/fund7005/#top10';
	}else if(fundCode == '4500'){
		setUrl= 'https://www.meritzam.com/fund_pro/fund1146/#top10';
	}else if(fundCode == '1500'){
		setUrl= 'https://www.meritzam.com/fund_pro/fund7052/#top10';
	}

	win.viewLink = setUrl;
	win.openAsDialog(this, '100%', '100%');
	//win.openAsDialog(theApp.frmPage, theApp.frmPage.getWidth(), theApp.frmPage.getHeight());
};

FD3202_V31.prototype.onButton4Click = function(comp, info)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	var fundCode = cont.selectFundInfo["D1투신펀드코드"];
	var title = "집합투자규약";

	if(fundCode == '2000')
	{
		fundCode = '7003';
		title = "정관";
	}

	if(afc.isIos)
	{
		var win = AWindow.createWindow('FD/window/FD3202_W06.lay', 'FD3202W06');
		
		win.loadTitle = title;

		if(fundCode == '4500') {
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/stipul_1146.pdf';
		} else if(fundCode == '1500') { // 2020.01.31. 메리츠글로벌리츠부동산투자신탁[리츠-재간접형]Ae 추가
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/stipul_7052.pdf';
		} else {
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/stipul_' + fundCode + ".pdf";
		}
		
		win.openAsDialog(this, '100%', '100%');
	}
	else		// Android
	{
		if(fundCode == '4500') {
			AppManager.openPdfModule("https://www.meritzam.com/marketings/stipul_1146.pdf", title);
		} else if(fundCode == '1500') { // 2020.01.31. 메리츠글로벌리츠부동산투자신탁[리츠-재간접형]Ae 추가
			AppManager.openPdfModule("https://www.meritzam.com/marketings/stipul_7052.pdf", title);
		} else {
			AppManager.openPdfModule("https://www.meritzam.com/marketings/stipul_" + fundCode + ".pdf", title);
		}
	}
};

FD3202_V31.prototype.onButton5Click = function(comp, info)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	var fundCode = cont.selectFundInfo["D1투신펀드코드"];
	var title = "투자설명서";
	
	if(fundCode == '2000')
		fundCode = '7003';
	
	if(afc.isIos)
	{
		var win = AWindow.createWindow('FD/window/FD3202_W06.lay', 'FD3202W06');
		win.loadTitle = title;
		
		if(fundCode == '4500') {
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/invest_1146.pdf';
		} else if(fundCode == '1500') { // 2020.01.31. 메리츠글로벌리츠부동산투자신탁[리츠-재간접형]Ae 추가
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/invest_7052.pdf';
		} else {
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/invest_' + fundCode + ".pdf";
		}

		win.openAsDialog(this, '100%', '100%');
	}
	else		// Android
	{
		if(fundCode == '4500') {
			AppManager.openPdfModule("https://www.meritzam.com/marketings/invest_1146.pdf", title);
		} else if(fundCode == '1500') { // 2020.01.31. 메리츠글로벌리츠부동산투자신탁[리츠-재간접형]Ae 추가
			AppManager.openPdfModule("https://www.meritzam.com/marketings/invest_7052.pdf", title);
		} else {
			AppManager.openPdfModule("https://www.meritzam.com/marketings/invest_" + fundCode + ".pdf", title);
		}
	}
};

FD3202_V31.prototype.onButton6Click = function(comp, info)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	var fundCode = cont.selectFundInfo["D1투신펀드코드"];
	var title = "간이설명서";
	
	if(fundCode == '2000')
		fundCode = '7003';
	
	if(afc.isIos)
	{
		var win = AWindow.createWindow('FD/window/FD3202_W06.lay', 'FD3202W06');
		win.loadTitle = title;
		
		if(fundCode == '4500') {
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/prospectus_1146.pdf';
		} else if(fundCode == '1500') { // 2020.01.31. 메리츠글로벌리츠부동산투자신탁[리츠-재간접형]Ae 추가
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/prospectus_7052.pdf';
		} else {
			win.loadviewUrlAddr = 'https://www.meritzam.com/marketings/prospectus_' + fundCode + ".pdf";
		}

		win.openAsDialog(this, '100%', '100%');
	}
	else		// Android
	{
		if(fundCode == '4500') {
			AppManager.openPdfModule("https://www.meritzam.com/marketings/prospectus_1146.pdf", title);
		} else if(fundCode == '1500') { // 2020.01.31. 메리츠글로벌리츠부동산투자신탁[리츠-재간접형]Ae 추가
			AppManager.openPdfModule("https://www.meritzam.com/marketings/prospectus_7052.pdf", title);
		} else {
			AppManager.openPdfModule("https://www.meritzam.com/marketings/prospectus_" + fundCode + ".pdf", title);
		}
	}
};

FD3202_V31.prototype.onWillActive = function(reload)
{
	AView.prototype.onWillActive.call(this, reload);
							
};

FD3202_V31.prototype.onWillDeactive = function(reload)
{	
	AView.prototype.onWillDeactive.call(this, reload);
	
	this.view1.scrollTo(0); // 스크롤 맨 위로 처리변경	
};

FD3202_V31.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	//상단 타이틀 바 제목 세팅
	cont.titleLbl.setText('펀드매수');
	
	thisObj.accView.getLoadView().title1.show(AComponent.GONE); // 타이틀 숨김
	thisObj.accView.getLoadView().setHeight(78); // 계좌컨트롤 전체 뷰 높이 변경
	thisObj.accView.getLoadView().accDbx.setHeight(76); // 계좌콤보박스 높이 변경
	thisObj.accView.getLoadView().accDbx.setWidth(578); // 계좌콤보박스 가로길이 변경
	thisObj.accView.getLoadView().accDbx.addClass('combo2'); // 클래스 변경
	
	// 펀드가입 내용 조회 구분값
	thisObj.isOptFundResult = 0; // 0 해당펀드 가입내역 없음, 1: 해당펀드 가입내역 있음

	// 펀드이름 세팅
	thisObj.lblFundName.setText(cont.selectFundInfo["D1한글투신펀드명"]);
	thisObj.lblFundName2.setText(cont.selectFundInfo["D1클래스상세 전체명"]); // 클래스상세 전체명 추가 2019.09.19
	
	// 계좌번호세팅
	thisObj.accView.getLoadView().doInitAccInfo(4);
			
	// 펀드정보 조회
	thisObj.checkDetailFund();
	
	var fundCode = cont.selectFundInfo["D1투신펀드코드"];
	if(fundCode == '2000')
	{
		thisObj.btnReg.setText('정관');
	}
	else
	{
		thisObj.btnReg.setText('집합투자규약');
	}

	
};


// 펀드기본정보 조회
FD3202_V31.prototype.checkDetailFund = function()
{

	var thisObj = this;
	var cont = thisObj.getContainer();
						
	cont.sendData('SOFFQ422',
		function(queryData, groupName)
		{	
			queryData.setHeaderInfo({
						FUNC_KEY_LST: 'C'
			});
			
		var InBlock1 = queryData.getBlockData('InBlock1')[0];				
		
		InBlock1['D1투신펀드코드'] = cont.selectFundInfo["D1투신펀드코드"];
										
// 		queryData.printQueryData();
	},
	 function(queryData, groupName) {

		if(queryData != null){
		
// 			queryData.printQueryData();
		
			var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
						
			if(!OutBlock1) return;
									
			if(OutBlock1['D1허들레이트2'] == "0.00000000" || OutBlock1['D1성과보수율2'] == "0.00000000"){		
				// thisObj.fundInfoGrid

				OutBlock1['D1허들레이트2'] = "해당없음";
				OutBlock1['D1성과보수율2'] = "해당없음";
			}
			
			OutBlock1['D1매입기준일명1'] = thisObj.getBaseDtNm(OutBlock1['D1매입기준일명1']);
			OutBlock1['D1매입기준일명2'] = thisObj.getBaseDtNm(OutBlock1['D1매입기준일명2']);
			OutBlock1['D1환매기준일명1'] = thisObj.getBaseDtNm(OutBlock1['D1환매기준일명1']);
			OutBlock1['D1환매기준일명2'] = thisObj.getBaseDtNm(OutBlock1['D1환매기준일명2']);
						
			thisObj.checkFundDetailMoney();
		}
	});
};

FD3202_V31.prototype.checkFundDetailMoney = function()
{
	var thisObj = this;
	var	cont = thisObj.getContainer();

	cont.sendData('SOFFT101',
	function(queryData, groupName)
	{
		
			var inBlock1 = queryData.getBlockData('InBlock1')[0];		
			
			inBlock1["D1처리구분"] = '2';
			inBlock1["D1기준일"] = MetaInfo.fnGetToday('NUMDATE');
			inBlock1["D1투신펀드코드"] = cont.selectFundInfo["D1투신펀드코드"];
			inBlock1["D1매매기준가"] = '0';
			inBlock1["D1과표기준가"] = '0';
			inBlock1["D1소득구분"] = '2';
			inBlock1["D1모집매도시작일"] = '0';
			inBlock1["D1모집매도종료일"] = '0';
			inBlock1["D1세금우대과표기준가"] = '0';
			inBlock1["D1비거주과표기준가"] = '0';
			inBlock1["D1펀드설정원본"] = '0';
			inBlock1["D1펀드순자산총액"] = '0';
			inBlock1["D1적용법률구분"] = '1';
			inBlock1["D1수정과표기준가"] = '2';
						
// 			queryData.printQueryData();			
		
		
	},
	function(queryData, groupName) {
		
		//2019.01.24 HCY Chrome v71에서 하단 항목 안그려지는 증상 > 강제 redraw를 통해 대응
		setTimeout(function(){ $("#FD3202_V31--View7").forceRedraw();}, 700);
		
		if(queryData != null){
			var OutBlock1 = queryData.getBlockData('OutBlock1')[0];
			
			OutBlock1['D1펀드순자산총액'] = thisObj.addIntCommaWon(OutBlock1['D1펀드순자산총액']);
				
// 				queryData.printQueryData();
			if(!OutBlock1) return;																		
		}
	});
}




FD3202_V31.prototype.onbtnFundBuyClick = function(comp, info)
{
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	//TODO:edit here
	if(cont.selectFundInfo["D1투신펀드코드"] == 2190){
		
		// 주니어펀드일 경우 계좌세팅
		cont.juniorSelAccNo = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];		
		cont.userAgeCheck(thisObj, function(oBlock){
			if(oBlock){
				if(oBlock["D1미성년계좌여부"] == "0"){
					theApp.alert(
						[	 
							'메리츠주니어펀드는 가입당시','<br>',
							'20세 이하 투자자가 가입가능합니다.','<br>',
							,' '
						].join('')
						,
						function()
						{			
							thisObj.juniorPopupResult();
						}
						,''
					);
				}else{
					thisObj.isFundJoinCheck();
				}
			}
		});
	}else{
		thisObj.isFundJoinCheck(); 
	}			

};

FD3202_V31.prototype.juniorPopupResult = function()
{
	return;
}

// 투자권유 불원 화면 팝업
FD3202_V31.prototype.userGrdRegWindow = function()
{
	var win = AWindow.createWindow('FD/window/FD3202_W04.lay','FD3202W4');

	win.openAsDialog(this, 580, 640);
};

FD3202_V31.prototype.onWindowResult = function(result, windowObj)
{
	if(windowObj.containerId == 'FD3202W4'){
		var thisObj = this;
		var cont = thisObj.getContainer();								
		
		if(result == 1){
			thisObj.userGrdTrxTp = '1'; // 투자자등록확인서 등록(불원, 정보미제공으로만 등록함)

			cont.userGradeCheck(this, function(){				
				cont.scrToolView.show(AComponent.GONE); // 상단 Simple Choice, 펀드 더보기 숨김처리
					
				//상단 타이틀 바 제목 세팅
				cont.titleLbl.setText('펀드매수');
				
				if(thisObj.isOptFundResult == '1'){
					cont.fundNowBuyStep = 1; // 현재단계 입력
					cont.fundAllBuyStep = 3; // 총단계 입력					
					cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V06', false);
				}else{
					if(cont.g_UserInvstCnvsGubun == "0" || cont.g_UserInfoPrvdGubun == "0"){
						cont.fundNowBuyStep = 3; // 현재단계 입력
						cont.fundAllBuyStep = 6; // 총단계 입력					
						cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V04', false);
					}else{
						cont.fundNowBuyStep = 1; // 현재단계 입력
						cont.fundAllBuyStep = 6; // 총단계 입력					
						cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V02', false);
					}					
				}												
			});
		}else{

		}		
	}
};


// 이미 가입된 펀드인지 확인
FD3202_V31.prototype.isFundJoinCheck = function()
{
	
	var thisObj = this
		,cont = thisObj.getContainer() // 연결된 최상위 뷰
		,qrName = "SOFFQ365"
		,accNo = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
				
	cont.sendData(qrName, 
	function(queryData, groupName)
	{
			var InBlock1 = queryData.getBlockData('InBlock1')[0];
									
			InBlock1['D1계좌번호'] = accNo;
			InBlock1['D1비밀번호'] = '1';
			InBlock1['D1잔고유무여부'] = '';
				
// 			queryData.printQueryData();
				
	},
	function(queryData, groupName)
	{				
		var errMsg = this.getLastError('errMsg');
		var errCode = this.getLastError('errCode');
						
		if(queryData)
		{								
			var OutBlock2 = queryData.getBlockData('OutBlock2');

// 			queryData.printQueryData();	

			for(var i=0; i < OutBlock2.length; i++){						
				afc.log("yjhan1 OutBlock2->[" + afc.log(OutBlock2[i]) + "]");
				if(OutBlock2[i]["D1투신펀드코드"] == cont.selectFundInfo["D1투신펀드코드"]){
					thisObj.isOptFundResult = 1;
					break;
				}											
			}
					
			var userGrdRegYn = theApp.userInfo.get('UserGrade');
					
			if(userGrdRegYn == undefined){
				theApp.confirm('선택하신 펀드가 본인의 투자성형과<br/>적합한지 확인을 위해 투자자정보<br/>확인서를 작성하셔야 합니다.<br/>진행하시겠습니까?', function(result) {
					if(result == 1){							
						if(thisObj.isOptFundResult == '1'){
							theApp.goPageCheck('FD1304', false, {tabId:'FD3202_T02', tabSubId:'FD3202_V06', fundCode:cont.selectFundInfo["D1투신펀드코드"]});
						}else{								
							theApp.goPageCheck('FD1304', false, {tabId:'FD3202_T02', tabSubId:'FD3202_VCHECK', fundCode:cont.selectFundInfo["D1투신펀드코드"]}); // 투자자정보확인서를 체크해야 하므로
						}							
					} else {					
						thisObj.userGrdRegWindow();
					}
				}, '', ['예','아니오']
				)
			}else{					
				if(thisObj.isOptFundResult == '1'){
					cont.fundNowBuyStep = 1; // 현재단계 입력
					cont.fundAllBuyStep = 2; // 총단계 입력					
					cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V06', false);
				}else{
					// 정보제공구분이 미제공이거나 투자권유구분이 불원이면 투자정보 확인서 화면 이동
					if(cont.g_UserInvstCnvsGubun == "0" || cont.g_UserInfoPrvdGubun == "0"){
						cont.fundNowBuyStep = 3; // 현재단계 입력
						cont.fundAllBuyStep = 6; // 총단계 입력					
						cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V04', false);
					}else{
						cont.fundNowBuyStep = 1; // 현재단계 입력
						cont.fundAllBuyStep = 6; // 총단계 입력					
						cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V02', false);
					}
				}
			}
		}
	}
	);
};


FD3202_V31.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	
	var thisObj = this;
	var cont = thisObj.getContainer();
		
	var win = AWindow.createWindow('FD/window/FD3202_W05.lay','FD3202W5');		
	
	win.fundInfo = cont.selectFundInfo;
	
	win.openAsDialog(this, 580, 500);

};


FD3202_V31.prototype.getBaseDtNm = function(string)
{
	var thisObj = this;
	var BaseDtNm = string;
	var setString  = null;
	var DtNmCheck = false;
	
	//매입기준일, 환매기준일 관련 수정 사항
	thisObj.BaseData = [
		["3시30분이전","3시30분"]
		 ,["5시이전","5시"]
		 ,["1시30분이전","1시30분"]
		 ,["3시이전","3시"]
		 ,["2시30분이전","2시30분"]
		 ,["3시20분이전","3시20분"]
		 ,["1시이전","1시"]
		 ,["2시이전","2시"]
	];
			
	for (var i = 0; i < thisObj.BaseData.length ; i++){
		var baseDataA = thisObj.BaseData[i][0];
		var baseDataB = thisObj.BaseData[i][1];
		if (BaseDtNm.indexOf(baseDataA) > -1){
			setString = BaseDtNm.replace(baseDataA,baseDataB);
			DtNmCheck = true;
		}
	}
	if (!DtNmCheck) setString = string;
	return setString;
};

FD3202_V31.prototype.addIntCommaWon = function(val)
{
	return afc.addComma(parseInt(val)) + "원";
};


