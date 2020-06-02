
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_W01(containerId)
{
	BaseWindow.call(this, containerId);
	
}
afc.extendsClass(FD3202_W01, BaseWindow);


FD3202_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here

};

FD3202_W01.prototype.onWillActive = function(reload)
{
	BaseWindow.prototype.onWillActive.call(this, reload);
					
};

FD3202_W01.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
			
	this.lblFundTitle	= this.findCompById('lblFundTitle');
	this.lblFundTitle2 = this.findCompById('lblFundTitle2'); // 클래스상세 전체명 추가 2019.09.19
	this.lblFuncContent = this.findCompById('lblFuncContent');
	
	this.AccView = this.findCompById('AccView');
	
	this.lblFundTitle.setShrinkInfo({maxChar:17, fontSize:30}); // 펀드명 자동폰트 셋팅 2019.09.26
	//this.lblFundTitle2.setShrinkInfo({maxChar:18, fontSize:26}); // 클래스상세 전체명 자동폰트 셋팅 2019.09.26
	
	//계좌번호 로드뷰
	this.accView = this.findCompById('AccView');
	this.accView.viewLoad('FD/view/FD0000_V02.lay');
	
	// 해당펀드를 갖고 있는지 구분 화면 로드될때마다 초기화
	this.isOptFundResult = 0; // 0:없음, 1: 있음
			
	this.accView.getLoadView().doInitAccInfo(4);		
	
	// 계좌컨트롤 사이즈 조절 및 라벨 숨기
	this.accView.getLoadView().title1.show(AComponent.GONE);	
	this.accView.getLoadView().accDbx.setWidth(518);
	this.accView.getLoadView().accDbx.addClass('combo2');
	
	//계좌드롭박스
	this.accDbx = this.accView.getLoadView().accDbx;
	
	// 펀드 기본 설명 세팅
	this.checkFundDetailInfo();
	
};

FD3202_W01.prototype.checkFundDetailInfo = function()
{
	var thisObj = this;
	var cont = thisObj.opener.getContainer();
	
	thisObj.lblFundTitle.setText(cont.selectFundInfo['D1한글투신펀드명']);
	thisObj.lblFundTitle2.setText(cont.selectFundInfo['D1클래스상세 전체명']); // 클래스상세 전체명 추가 2019.09.19
	thisObj.lblFuncContent.setText(thisObj.contentSum);
	
};


FD3202_W01.prototype.onbtnCloseClick = function(comp, info)
{
	//TODO:edit here
	this.close(0); // 닫기
};


FD3202_W01.prototype.onbtnFundJoinClick = function(comp, info)
{
	//TODO:edit here				
	
	var thisObj = this;
	
	thisObj.isFundJoinCheck(); // 이미 가입되어 있는 페이지인지 먼저 체크	
};

// 투자권유 불원 화면 팝업
FD3202_W01.prototype.userGrdRegWindow = function()
{
	var win = AWindow.createWindow('FD/window/FD3202_W04.lay','FD3202W4');

	win.openAsDialog(this, 580, 640);
};

FD3202_W01.prototype.onWindowResult = function(result, windowObj)
{
	if(windowObj.containerId == 'FD3202W4'){
		var thisObj = this;
		var cont = thisObj.opener.getContainer();								
		
		if(result == 1){
			thisObj.userGrdTrxTp = '1'; // 투자자등록확인서 등록(불원, 정보미제공으로만 등록함)

			cont.userGradeCheck(thisObj, function(){				
				cont.scrToolView.show(AComponent.GONE); // 상단 Simple Choice, 펀드 더보기 숨김처리
				
				//스크롤 영역 변경
				cont.view5.$ele.css({
					'top': '0px'		
				});	
				cont.view5.setHeight(cont.view5.getHeight() + cont.scrToolView.getHeight());
					
				//상단 타이틀 바 제목 세팅
				cont.titleLbl.setText('펀드매수');
				
				if(thisObj.isOptFundResult == '1'){
					cont.fundNowBuyStep = 1; // 현재단계 입력
					cont.fundAllBuyStep = 2; // 총단계 입력
					cont.tvManager.changeTab('FD3202_T02');
					cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V06', false);
				}else{
					if(cont.g_UserInvstCnvsGubun == "0" || cont.g_UserInfoPrvdGubun == "0"){
						cont.fundNowBuyStep = 3; // 현재단계 입력
						cont.fundAllBuyStep = 6; // 총단계 입력
						cont.tvManager.changeTab('FD3202_T02');
						cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V04', false);
					}else{
						cont.fundNowBuyStep = 1; // 현재단계 입력
						cont.fundAllBuyStep = 6; // 총단계 입력
						cont.tvManager.changeTab('FD3202_T02');
						cont.tvManager.getActiveView().tbvManager.changeTab('FD3202_V02', false);
					}					
				}								
			});
		}
	}
};


// 이미 가입된 펀드인지 확인
FD3202_W01.prototype.isFundJoinCheck = function()
{				
	
	var thisObj = this
		,cont = thisObj.opener.getContainer() // 연결된 최상위 뷰
		,qrName = "SOFFQ365"
		,accNo = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
		
//		,isOptFundResult = 0; // 이미 가입된 펀드가 있는지 체크 0:default, 1:가입된 펀드 있음			
		
	if(!thisObj.accDbx.getSelectedItemData() || !thisObj.accDbx.getSelectedItemData()['D1계좌번호']){
		AToast.show('계좌번호를 선택하세요.');
		return;
	}
				
	cont.sendData(qrName, 
	function(queryData, groupName)
	{
		var InBlock1 = queryData.getBlockData('InBlock1')[0];

		InBlock1['D1계좌번호'] = accNo;
		InBlock1['D1비밀번호'] = '1';
		InBlock1['D1잔고유무여부'] = '';

	},
	function(queryData, groupName)
	{				
		var errMsg = this.getLastError('errMsg');
		var errCode = this.getLastError('errCode');

		if(queryData)
		{								
			var OutBlock2 = queryData.getBlockData('OutBlock2');

			for(var i=0; i < OutBlock2.length; i++){										
				if(OutBlock2[i]["D1투신펀드코드"] == cont.selectFundInfo["D1투신펀드코드"]){
					thisObj.isOptFundResult = 1;
					break;
				}											
			}
			
			//투자자정보확인서가 작성되지 않았을 경우에는 팝업 처리								
		thisObj.userGrdTrxTp = '3'; // 투자자등록확인서 조회					
		cont.userGradeCheck(thisObj, function(oBlock){
			
		var userGrdRegYn = theApp.userInfo.get('UserGrade'); // 투자자정보확인서 체크
								
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

				thisObj.close(0); // 현재 윈도우창 그냥 닫기

			}else{
				// 주니어펀드일 경우 미성년자 구분 위해서 세팅
				if(cont.selectFundInfo["D1투신펀드코드"] == 2190){
					cont.juniorSelAccNo = thisObj.accDbx.getSelectedItemData()['D1계좌번호'];
				}
			
				if(thisObj.isOptFundResult == '1'){
					// 투자자정보 등록이 되어 있으며 선택한 펀드를 가입하고 있을 경우
					thisObj.close(3);
				}else{
					// 투자자정보등록이 되어 있으며
					// 정보제공구분이 미제공이거나 투자권유구분이 불원이면 투자정보확인서(3단계) 화면 이동
					if(cont.g_UserInvstCnvsGubun == "0" || cont.g_UserInfoPrvdGubun == "0"){
						thisObj.close(4);
					}else{
						// 투자자정보등록이 되어 있으며
						// 정보제공구분이 제공하고 투자권유구분이 희망이면 (1단계) 화면 이동
						thisObj.close(5);
					}
				}
			}							
		});
	}
	});
};


FD3202_W01.prototype.onbtnFundDatailClick = function(comp, info)
{
	//TODO:edit here
	this.close(2); // 상세보기
};


