
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_T02()
{
	AView.call(this);

	this.certImgB64 = '';
    //- 주민등록증 ( 0 : 주민등록증 / 주민등록증(재외국민), 1 : 이름, 2: 주민등록번호, 3 : 발급일, 5 : 발급처, 9 : 생년월일 )
    //- 운전면허증 ( 0 : 자동차운전면허증, 1 : 이름, 2: 주민등록번호, 3 : 발급일, 4 : 면허번호, 5 : 발급처, 8 : 위변조방지코드, 9 : 생년월일 )
	//	외국인이 발급받은 한국 운전면허증의 인식은 지원하지 않음
	this.certInfo = null;
}
afc.extendsClass(MS1005_T02, AView);


MS1005_T02.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.identifyView = this.findCompById('IdentifyView');
};

MS1005_T02.prototype.onActive = function(reload)
{
	AView.prototype.onActive.call(this, reload)

	var win = AWindow.createWindow('FD/window/MS1005_W20.lay', 'MS1005_W20');
	win.openAsDialog(this);

	this.modeChange('Default');
};

MS1005_T02.prototype.modeChange = function(mode)
{
	var thisObj = this;
	if(mode == 'OcrMode')
	{
		//모드 변경마다 뷰초기화
		thisObj.identifyView.viewLoad('FD/view/MS1005_V06.lay')
		//OpenOCR 함수 연동을 위한 delegator 연동
		thisObj.identifyView.getLoadView().setDelegator(this);
	}
	else if(mode == 'Default')
	{
		thisObj.identifyView.viewLoad('FD/view/MS1005_V05.lay');//MS1005_V05
		thisObj.certImgB64 = '';		
	}
};


MS1005_T02.prototype.OpenOCR = function()
{
	var thisObj = this;
	
	this.modeChange('Default');
	
	OCRManager.openOCR(function(step, text, image)
	{
		//OCR 촬영 시, CONTINUE_STEP > RESULT_SUCCESS 단계로 callback 반환
		if(step == OCRManager.RESULT_FAILE)
		{
			//thisObj.modeChange('Default');
		}
		else if(step == OCRManager.RESULT_SUCCESS)
		{
			thisObj.certInfo = JSON.parse(text);
			
			thisObj.certImgB64 = image;
			if(thisObj.certInfo[9].length != 6) {
				thisObj.certImgB64 = '';
				AToast.show('정확한 정보 파악을 위해 다시 촬영해주시기 바랍니다.');
			} else {
				theApp.encryptType = AQuery.OCR;
				
				//주민등록번호 검증
				QryRequest.request('SACMQ112',
				   function(queryData)
				   {	
						var inBlock1 = queryData.getBlockData('InBlock1')[0];
						inBlock1["D1처리구분"] = '1';
						inBlock1["D1실명확인번호"] = thisObj.certInfo[2];
						queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
					},
				   function(queryData)
				   {
						AppManager.endOltp();

						var errCode = this.getLastError('errCode');
						if(errCode == '0197') {
							thisObj.modeChange('OcrMode');
							if(thisObj.identifyView.getLoadView().setData) {
								thisObj.identifyView.getLoadView().setData(thisObj.certInfo, thisObj.certImgB64);		
							} else {
								thisObj.modeChange('OcrMode');
								if(thisObj.identifyView.getLoadView().setData) {
									thisObj.identifyView.getLoadView().setData(thisObj.certInfo, thisObj.certImgB64);		
								} else {
									thisObj.certImgB64 = '';
									AToast.show('정확한 정보 파악을 위해 다시 촬영해주시기 바랍니다.');
								}
							}
						} else {
							thisObj.certImgB64 = '';
							AToast.show('정확한 정보 파악을 위해 다시 촬영해주시기 바랍니다.');
						}
					}
				);
			}
		}
		else if(step == OCRManager.CONTINUE_STEP)
		{
		}
		else if(step == OCRManager.RESLT_CANCELED)
		{
			return;
		}
	});	
};


MS1005_T02.prototype.onNextBtnClick = function(comp, info)
{
	if(!this.certImgB64 || !this.identifyView.getLoadView().getData) {
		AToast.show('신분증 촬영을 해주세요.');
		return;
	}
    var win = AWindow.createWindow('FD/window/MS1005_W19.lay', 'MS1005_W19');
	
	var txfData = new Array(5);
	var mView = this.identifyView.getLoadView();
	txfData = mView.getData();
	
	this.certInfo[4] = txfData[0];		//면허번호
	this.certInfo[1] = txfData[1];		//이름
	this.certInfo[3] = txfData[3];		//발급일
	this.certInfo[8] = txfData[4];		//암호일련번호
	
	win.setData([this.certInfo[1],this.certInfo[9]]);

    win.openAsDialog(this);
};

MS1005_T02.prototype.onWindowResult = function(result, awindow)
{
	//fourierx
	//촬영 내용확인 창
	if( awindow.getContainerId() == 'MS1005_W19'){
		if(result) {
			//내용이 맞으면 기계좌존재유무 판별
			this.sendSACMQ241();
		}
	}
	else if(awindow.getContainerId() == 'MS1005_W18'){
		//기존 계좌가 있는경우
		if(1 == result) {	
			//추가개설
			//비대면계좌개설고객정보 등록
			if(this.CheckValid()) {
				this.delete_SACMT632();
			}
			
		}
		else if(2 == result){
			//로그인화면으로 이동
			theApp.isNFTFProgress = false;
			theApp.navigator.goPage('FrmPage');
			theApp.frmPage.goFirstPageProcess();
		}
	}
};
//실명확인번호 소유계좌현황
MS1005_T02.prototype.sendSACMQ241 = function(){
	var thisObj = this;
	
	QryRequest.request('SACMQ241',
	function(queryData)
	{
		var inBlock1 = queryData.getBlockData('InBlock1')[0];
		inBlock1['D1고객정보구분'] = '2';
		inBlock1['D1계좌상태코드'] = 'zz';
		inBlock1['D1지점번호'] = '000';
		inBlock1['D1고객확인번호'] = thisObj.certInfo[2];  //실명번호
		queryData.putPwInfo('InBlock1', 'D1고객확인번호', false, AQuery.OCR);

	},
	function(queryData)
	{
		var errCode = this.getLastError('errCode');

		
		if(136 == errCode || 133 == errCode){
				//조회완료,연속 ==> 계좌가 있는경우
				var win = AWindow.createWindow('FD/window/MS1005_W18.lay', 'MS1005_W18');
				win.openAsDialog(thisObj);
		}
		else if(2679 == errCode || 200 == errCode){
            //조회내역이 없습니다
            //비대면계좌개설고객정보 등록
            if(thisObj.CheckValid()) {
                thisObj.delete_SACMT632();
			}
		}
	});	
};

MS1005_T02.prototype.CheckValid = function()
{
	var txfData = new Array(5);
	var mView = this.identifyView.getLoadView();
	txfData = mView.getData();
	
	this.certInfo[4] = txfData[0];		//면허번호
	this.certInfo[1] = txfData[1];		//이름
	this.certInfo[3] = txfData[3];		//발급일
	this.certInfo[8] = txfData[4];		//암호일련번호

	if('주민등록증(재외국민)' == this.certInfo[0].trim() )
	{
		this.inappropriateCust();
		return false;
	}
	
	// 이름
	if(!this.certInfo[1]) {
	
		AToast.show('이름 항목을 입력해주세요.');
		mView.nameTxf.addClass('TF_03');
		mView.validName = false;
		return false;
	} 
	/*
	//발급일자
	if(!this.certInfo[3]) {
	
		AToast.show('발급일자를 입력해주세요.');
		mView.dateTxf.addClass('TF_03');
		mView.validDate = false;
		return false;
	}

	if(this.certInfo[3].length!=8)
	{
		AToast.show('발급일자 형식이 잘못되었습니다.');
		mView.dateTxf.addClass('TF_03');
		mView.validDate = false;
		return false;
	}		
	
	if('자동차운전면허증' == this.certInfo[0].trim() )
	{
		if( !this.certInfo[4])
		{
			AToast.show('면허번호를 입력해주세요.');
			mView.driveTxf.addClass('TF_03');
			mView.validDrive = false;
			return false;
		}
		
		if( this.certInfo[4].length < 14)
		{
			AToast.show('면허번호 형식이 잘못되었습니다.');
			mView.driveTxf.addClass('TF_03');
			mView.validDrive = false;
			return false;
		}
		
		if( !this.certInfo[8])
		{
			AToast.show('암호일련번호를 입력해주세요.');
			mView.pwTxf.addClass('TF_03');
			mView.validPw = false;
			return false;
		}
		if( this.certInfo[8].length < 5 || this.certInfo[8].length > 6)
		{
			AToast.show('암호일련번호 형식이 잘못되었습니다.');
			mView.pwTxf.addClass('TF_03');
			mView.validPw = false;
			return false;
		}
		if( this.certInfo[8].length == 5) {
			var temp = this.certInfo[8].substring(0,3);
			if(isNaN(temp))
			{
				AToast.show('암호일련번호 형식이 잘못되었습니다.');
				mView.pwTxf.addClass('TF_03');
				mView.validPw = false;
				return false;
			}
			temp = this.certInfo[8].substring(3,5);
			if(temp.match(/\d/) != null) {
				AToast.show('암호일련번호 형식이 잘못되었습니다.');
				mView.pwTxf.addClass('TF_03');
				mView.validPw = false;
				return false;
			}
		}
	}
*/
	//테스트진행중
	//this.certInfo[9] = "000101";
	//미성년자여부체크
	if( parseInt(Utils.clalcKoreanAge(this.certInfo[9]), 10) < 19 ) {
		this.inappropriateCust();
		return false;
	}
	return true;
}

MS1005_T02.prototype.inappropriateCust = function() {
	AToast.show('*미성년자 또는 재외국민등록증 소지자의 경우, 본점 방문 또는 대표번호로 연락주시기 바랍니다.\n*대표번호: 1588-5533\n\n*');
};

MS1005_T02.prototype.delete_SACMT632 = function()
{	
	var thisObj = this;
	
	//서비스 처리 프로세트
	//SACMT632 (del)-> SACMT632 (redelete)-> SACMT460 (add)
	
 	AppManager.beginOltp();
	
	// 디바이스 번호로 데이터 삭제
	QryRequest.request('SACMT632',
	function(queryData)
	{	
		var inBlock1 = queryData.getBlockData('InBlock1')[0];
		inBlock1["D1처리구분"] = '5';		
		inBlock1["D1디바이스고유번호"] = theApp.uId;
	},
	function(queryData)
    {
		//기존 정보 삭제 작업이므로 성공 실패 상관없이 진행...
		thisObj.reDelete_SACMT632();
	});
};

// 중복 등록된 이미지 삭제를 위한 처리 
MS1005_T02.prototype.reDelete_SACMT632 = function()
{
	var thisObj = this;
	
	// 주민번호로 삭제
	QryRequest.request('SACMT632',
	function(queryData)
	{	
		var inBlock1 = queryData.getBlockData('InBlock1')[0];
		inBlock1["D1처리구분"] = '6';		
		inBlock1["D1실명확인번호"] = thisObj.certInfo[2];
		queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, theApp.encryptType);
	},
	function(queryData)
    {
		//기존 정보 삭제 작업이므로 성공 실패 상관없이 진행...
		thisObj.sendSACMT460();
	});
}

//신분증 이미지 정보 등록
MS1005_T02.prototype.sendSACMT460 = function()
{
	AppManager.endOltp();
	AppManager.showTextProgress('<span class="SB" style="color:#ffffff; font-size:24px;">신분증 이미지를 업로드하는 중입니다.</span>');
	var totalBuf = Base64.atobArray(this.certImgB64);
	
//asoocool	시뮬레이션 테스트 시 > 임의로 totalBuf값 할당 
// 	var totalBuf = new Uint8Array(24500);	
// 	for(var i=0; i<24500; i++)
// 	{
// 		if(i%8192==0) totalBuf[i] = 0x40;
// 		else totalBuf[i] = 0x23;
// 	}
	
	var totalSize = totalBuf.length;
	var modSize = totalSize % Define.IMG_PACKET_SIZE;
	var sendCount = parseInt(totalSize/Define.IMG_PACKET_SIZE, 10); //소수자리 제거

	if(modSize==0) modSize = Define.IMG_PACKET_SIZE;
	else if(modSize>0) sendCount++;

	var offset = 0, index = 0, recordSize = 0, thisObj = this;

	var connMgr = theApp.connectManager;
	connMgr.connectAccForOneTimeQuery(function(result)
	{
		sendProcess('0');

		function sendProcess(strImageNum)
		{
			connMgr.netManager.sendProcessByName('SACMT460', 'nftf001', null, 

			function(queryData)
			{
				var inBlock1 = queryData.getBlockData('InBlock1');
				var inBlock2 = queryData.getBlockData('InBlock2');

				index++;
				recordSize = (index==sendCount) ? modSize : Define.IMG_PACKET_SIZE;
				
				//면허증 포멧 변경
				var driveLocation = null; 
				var driveNum = null;
				if(thisObj.certInfo[0] == '자동차운전면허증') {
					
					driveLocation = thisObj.certInfo[4].substring(0,2);
					driveNum = thisObj.certInfo[4].substring(3).replace(/-/g,'');
				}

				inBlock1[0] = 
				{
					'D1처리구분': '1',
					'D1실명확인번호': thisObj.certInfo[2],								//주민등록번호
					'D1이미지번호': strImageNum,
					'D1인감이미지길이': totalSize,
					'D1고객명': thisObj.certInfo[1],									  //이름
					'D1종류구분': (thisObj.certInfo[0]=='주민등록증') ? '1' : '2',
					'D1발급일자': thisObj.certInfo[3],									 //발급일
					'D1발급기관명': '',//thisObj.certInfo[5],			   				//발급처 
					'D1확인구분': '',//'Y',
					'D1파일확장자': 'jpg',
					'D1신분증진위확인날짜': '',
					'D1운전면허증면허지역': (thisObj.certInfo[0]=='주민등록증')?'':driveLocation,
					'D1운전면허증면허번호': (thisObj.certInfo[0]=='주민등록증')?'':driveNum,
					'D1운전면허증암호일련번호': (thisObj.certInfo[0]=='주민등록증')?'':thisObj.certInfo[8]
				};
				inBlock2[0] = 
				{
					'D1최종일련번호': sendCount,
					'D1처리일련번호': index-1,
					'D1레코드크기': recordSize,
					//buf[start] ~ buf[end-1]
					'D1바이너리데이터8K': totalBuf.subarray(offset, offset+recordSize)
				};
				queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, AQuery.OCR);

				offset += recordSize;
			},

			function(queryData)
			{
				var errCode = this.getLastError('errCode');
				if( errCode >= 1000)
				{
					AppManager.endOltp();
					theApp.getErrMsg(thisObj,this);
					//alert(this.printLastError());
					
					setTimeout(function() 
					{
						connMgr.stopAccForOneTimeQuery();
						
					}, 100);
				}
				else if(queryData) 
				{
					//queryData.printQueryData();
					var inBlock = queryData.getBlockData('InBlock1')[0];
					AppManager.setProgProg(index*100/sendCount);
					if(index < sendCount) sendProcess(inBlock['D1이미지번호']);
					//send complete!
					else 
					{
						setTimeout(function() 
						{
							connMgr.stopAccForOneTimeQuery();

						}, 100);
							
						//고객정보 세팅
						theApp.initUserInfo();
						theApp.userInfo.setUserData("D1실명확인번호암호화", thisObj.certInfo[2]);
						theApp.userInfo.setUserData('D1생년월일', thisObj.certInfo[9]);
						theApp.userInfo.setUserData('D1고객명', thisObj.certInfo[1]);
						theApp.userInfo.setUserData('D1이미지번호', inBlock['D1이미지번호']);													
						//이미지의 경우 endOltp 위치 다름
						//AppManager.endOltp();
						
						thisObj.getContainer().nextView();
						AppManager.hideTextProgress();
					}
				}
			});
		}
	});
};