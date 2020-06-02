
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_T16()
{
	AView.call(this);
	this.certMovB64 = '';
    //- 주민등록증 ( 0 : 주민등록증, 1 : 이름, 2: 주민등록번호, 3 : 발급일, 5 : 발급처 )
    //- 운전면허증 ( 0 : 자동차운전면허증, 1 : 이름, 2: 주민등록번호, 3 : 발급일, 4 : 면허번호, 5 : 발급처, 6:'', 7:'', 8:암호일련번호)
	this.certInfo = null;
	this.movCnfCode = null;
	this.filePath = null;
}
afc.extendsClass(MS1005_T16, AView);


MS1005_T16.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	this.identifyView = this.findCompById('IdentifyView');
};

MS1005_T16.prototype.onActive = function(reload)
{
	AView.prototype.onActive.call(this, reload)
	
 	this.modeChange('Default');
};

MS1005_T16.prototype.modeChange = function(mode)
{
	var thisObj = this;
	if(mode == 'VrMode')
	{
		//모드 변경마다 뷰초기화
		thisObj.identifyView.viewLoad('FD/view/MS1005_V08.lay');
		var mView = this.identifyView.getLoadView();
		mView.startShowRP();
	}
	else if(mode == 'Default')
	{
		thisObj.identifyView.viewLoad('FD/view/MS1005_V07.lay');//MS1005_V05
		thisObj.certMovB64 = '';		
	}
};

MS1005_T16.prototype.startVR = function()
{
	var thisObj=this;
 	this.modeChange('Default');

	this.sendSBPGQ121(function(movCnfCode) {
		VRManager.startVR(movCnfCode[0],movCnfCode[1],movCnfCode[2],movCnfCode[3],7, 'medium', function(step, filePath)
						  {
			if(step == VRManager.RESULT_FAILE)
			{
				thisObj.certMovB64 = '';
				return;
			}
			else if(step == VRManager.RESULT_SUCCESS) {
				VRManager.getVideoFile(filePath, function(videofile){
					if( videofile!=null){ // null check 꼭 해주세요
						afc.log("***syl VRManager.getVideoFile test");
						afc.log(videofile);
						thisObj.certMovB64=videofile;
 						thisObj.modeChange('VrMode');
						thisObj.filePath = filePath;
					}
				});
			}
			else if(step == VRManager.CONTINUE_STEP)
			{
			}
			else if(step == VRManager.RESLT_CANCELED)
			{
				VRManager.endRP();
				thisObj.certMovB64 = '';
				return;
			}
		});
	});
};

//본인확인 인증숫자코드 전송
MS1005_T16.prototype.sendSBPGQ121 = function(callback){
	var thisObj = this;
	var movCnfCode = [];
	
	QryRequest.request('SBPGQ121',
	function(queryData)
	{
	},
	function(queryData)
	{
		if(queryData)
		{
			var blockData = queryData.getBlockData('OutBlock1')[0];
			movCnfCode[0] = blockData['D1응답코드'].substr(0,1);
			movCnfCode[1] = blockData['D1응답코드'].substr(1,1);
			movCnfCode[2] = blockData['D1응답코드'].substr(2,1);
			movCnfCode[3] = blockData['D1응답코드'].substr(3,1);
			thisObj.movCnfCode=movCnfCode[0]+movCnfCode[1]+movCnfCode[2]+movCnfCode[3];
			callback(movCnfCode);
		}
	});	
};


MS1005_T16.prototype.sendSACMT465 = function(){
	var movCnfCode = this.movCnfCode;
	var totalBuf = Base64.atobArray(this.certMovB64);
	var totalSize = totalBuf.length;
	var modSize = totalSize % Define.IMG_PACKET_SIZE;

	var sendCount = parseInt(totalSize/Define.IMG_PACKET_SIZE, 10); //소수자리 제거

	if(modSize==0) modSize = Define.IMG_PACKET_SIZE;
	else if(modSize>0) sendCount++;

	var offset = 0, index = 0, recordSize = 0, thisObj = this;
	
	AppManager.showTextProgress('<span class="SB" style="color:#ffffff; font-size:24px;">영상을 업로드하는 중입니다.</span>');
	
	var connMgr = theApp.connectManager;
	connMgr.connectAccForOneTimeQuery(function(result){
		if(result){
			sendProcess('0');
			function sendProcess(strMovNum){
				connMgr.netManager.sendProcessByName('SACMT465','nftf001', null, function(queryData){
					var inBlock1 = queryData.getBlockData('InBlock1');
					var inBlock2 = queryData.getBlockData('InBlock2');
					index++;
					recordSize = (index==sendCount) ? modSize : Define.IMG_PACKET_SIZE;

					inBlock1[0] = 
						{
						'D1처리구분': '1',
						'D1실명확인번호': theApp.userInfo.getUserData("D1실명확인번호암호화"),//주민등록번호
						'D1이미지번호': strMovNum,
						'D1이미지길이': totalSize,
						'D1이미지확인코드': movCnfCode,
						'D1고객명': theApp.userInfo.getUserData('D1고객명'),//이름
						'D1종류구분': '2',													//1.영상통화내역 2.영상촬영내역
						'D1파일확장자': '3gp',
						'D1확인구분': ''//'Y',
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
						AppManager.hideTextProgress();
						theApp.getErrMsg(thisObj,this);

						setTimeout(function() 
								   {
							connMgr.stopAccForOneTimeQuery();

						}, 100);
					}
					else if(queryData) 
					{
						//queryData.printQueryData();
						var inBlock = queryData.getBlockData('InBlock1')[0];
						afc.log("index*100/sendCount="+index*100/sendCount);
						AppManager.setProgProg(index*100/sendCount);
						
						if(index < sendCount) sendProcess(inBlock['D1이미지번호']);
						//send complete!
						else 
						{
							setTimeout(function() 
									   {
								connMgr.stopAccForOneTimeQuery();

							}, 100);

							if(thisObj.getContainerId() == 'MS1005') {
								thisObj.sendSACMT632(inBlock['D1이미지번호']);
							} 
						}
					}
				});	
			}
		}
	});
};

//비대면 계좌개설 고객정보 등록
MS1005_T16.prototype.sendSACMT632 = function(movVal)
{
	var thisObj = this;
	
	QryRequest.request('SACMT632',
	function(queryData)
	{	
		//A.사본(실명확인 미확인단계) B.사본+영상 C.사본+매체 D.사본+이체 Z.삭제된 고객
		var inBlock1 = queryData.getBlockData('InBlock1')[0];
		inBlock1["D1처리구분"] = '1';
		inBlock1["D1실명확인번호"] = theApp.userInfo.getUserData('D1실명확인번호암호화'); //'9301272409917';//thisObj.certInfo[2];
		inBlock1['D1고객명'] = theApp.userInfo.getUserData('D1고객명'); //'김재경'; //thisObj.certInfo[1];
		inBlock1["D1디바이스고유번호"] = theApp.uId;
		inBlock1["D1본인확인구분"] = 'A';
		inBlock1["D1이미지번호"] = theApp.userInfo.getUserData('D1이미지번호');	//메모리에서 가져올것..
		inBlock1["D1영상이미지번호"] = movVal;
		inBlock1["D1상품유형코드"] = ''; //주식
		inBlock1["D1상품상세코드"] = '61'; //수익증권
		queryData.putPwInfo('InBlock1', 'D1실명확인번호', false, AQuery.OCR);
	},
	function(queryData)
    {
		var errCode = this.getLastError('errCode');
		if( errCode >= 1000)
		{
			AppManager.hideTextProgress();		
			theApp.getErrMsg(thisObj,this);
		}
		else if(queryData)
		{
			//queryData.printQueryData();
			AppManager.setProgProg(100);
			theApp.userInfo.setUserData('D1영상이미지번호', movVal);
			
			theApp.saveStep('2', function(){
				/*
				2019.05.28 이경임
				영상촬영단계 종료 후 다음스텝 넘어가기 전에 비디오 영상파일 삭제하도록 한다
				*/
				VRManager.deleteVideoFile(thisObj.filePath);
				
				AppManager.hideTextProgress();
				thisObj.getContainer().nextView();
			});
			
		}
	});

};


MS1005_T16.prototype.onBeforeBtnClick = function(comp, info)
{
	VRManager.endRP();
	this.getContainer().beforeView();
};


MS1005_T16.prototype.onNextBtnClick = function(comp, info)
{	
	if(!this.certMovB64)
	{
		AToast.show('영상 촬영을 해주세요.');
		return;
	}
	
	VRManager.endRP();
	
	var win = AWindow.createWindow('FD/window/MS1005_W07.lay', 'MS1005_W07');
	if(this.getContainerId() == 'MS1005') {
		win.infoMsg = '<div style="float:left; width: 100%; height:100%"><br><br><br><span class="SB" style="color:#555; font-size:24px; line-height:141%;">본인임을 확인합니다.</span></div>';
	} 
	
	win.processType = '1';
	win.openAsDialog(this);
};

MS1005_T16.prototype.onWindowResult = function(result, awindow)
{
	var thisObj=this;
	if( awindow.getContainerId() == 'MS1005_W07')
	{		
		if( awindow.processType == '1' )
		{
			if(result)
			{
				this.register_VR_Mov();
			}
			else{
				var mView = thisObj.identifyView.getLoadView();
				if(mView.className == 'MS1005_V08'){
				    mView.startShowRP();
				}
			}
		}
		/*else
		{
			if(result)
			{
				this.delete_SACMT632_By_SSNumber();
			}
		}		*/
	}	
};


MS1005_T16.prototype.register_VR_Mov = function()
{
	if(!this.certMovB64)
	{
		AToast.show('영상 촬영을 해주세요.');
		return;
	}

	this.sendSACMT465();
	
};

MS1005_T16.prototype.onPhotoBtnClick = function(comp, info)
{
	this.startVR();
};
