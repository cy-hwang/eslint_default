
/**
Constructor
Do not call Function in Constructor.
*/
function DistNetManager()
{
	SocketManager.call(this, this);

	//TODO:edit here
	
	this.sndBuf = new ABuffer(1024);
	this.sndBuf.setCharset('euc-kr');
	
	this.rcvBuf = new ABuffer(1024);
	this.rcvBuf.setCharset('euc-kr');
	
	this.callback = null;
}
afc.extendsClass(DistNetManager, SocketManager);


DistNetManager.prototype.getDistAddress = function(ip, port, callback)
{
	this.callback = callback;
	this.enableRetry(Define.RETRY_COUNT);
	this.startManager(ip, port);
};

DistNetManager.prototype.onRetryConnected = function(success)
{
	if(success)
	{
	
		//alert(theApp.connectManager.orgCode + " / " + theApp.connectManager.userId);
		//--------------------------------------------------
		//	공개키 요청 패킷 전송
		var abuf = this.sndBuf;
		var totalLen = 43;

		//common header
		abuf.setNumString(OS_CH_TG_LEN, SZ_CH_TG_LEN, totalLen-SZ_CH_TG_LEN); //전문길이 필드를 제외한 길이(6)
		abuf.addChar('L'); //전문구분 -> L : 로그인 관련
		abuf.addByte(0x30); //압축여부
		abuf.addByte(0x30); //암호화여부
		abuf.addOriString(SZ_CH_FILLER, ''); //데이터 옵셋, 사용 안함
		//---------------------
		abuf.addOriString(8, 'L0000001');		//서비스코드 -> TR 코드
		abuf.addOriString(2, theApp.connectManager.orgCode); 	//기관 분류 코드
		abuf.addNumString(3, theApp.systemInfo.fno);			//이용사 번호
		abuf.addOriString(16, theApp.connectManager.userId);	//사용자 아이디
		
		abuf.addChar('0');					//상품 구분
		abuf.addChar('K');					//언어 구분

		this.sendBufferData(abuf, totalLen);
		
		//alert('send data~~~');
	}
	else
	{
		this.callbackManage(0, 'connect error');
	}
};

/*
DistNetManager.prototype.onConnected = function(success)
{
};
*/

DistNetManager.prototype.onClosed = function()
{
	//alert('dist closed');
};

DistNetManager.prototype.onReceived = function(strData)
{
	var abuf = this.rcvBuf;

	var dataSize = Base64.atobArray(strData, abuf.getBuffer());
	var packetType = abuf.getByte(OS_CH_TG_TP);

    if(packetType!=PACKET_TYPE.L)
    {
		this.callbackManage(0, 'packet error');
		return;
    }
	
	
	var svcId = abuf.getOriString(12, 8);
	var result = abuf.nextByte();
	
	//fail
	if(result==0x30)
	{
		var msgLen = abuf.getParseInt(72, 3);
		var msg = '';
		if(msgLen>0) msg = abuf.nextString(msgLen);
		
		this.callbackManage(0, msg);
	}
	else 
	{
		var address = [];
		//파일 서버
		address[0] = abuf.nextOriString(12); //abuf.nextIpString();
		//address[0] = abuf.nextIpString();
		address[1] = abuf.nextParseInt(5);

		//계정계 서버
		address[2] = abuf.nextOriString(12)+'.koscom.co.kr';
		//address[2] = abuf.nextIpString();
		address[3] = abuf.nextParseInt(5);

		//정보계 서버
		address[4] = abuf.nextOriString(12)+'.koscom.co.kr';
		//address[4] = abuf.nextIpString();
		address[5] = abuf.nextParseInt(5);
	
		this.callbackManage(1, address);
	}
};



DistNetManager.prototype.sendBufferData = function(abuf, sendLen)
{
	var thisObj = this;
	this.requestSend(Base64.btoaArray(abuf.subArray(0, sendLen)), function(result)
	{
		if(!result) 
		{
			//alert('send fail!');
			thisObj.callbackManage(0, 'send error');
		}
	});
};


DistNetManager.prototype.callbackManage = function(ret, info)
{
	this.stopManager();
	this.callback(ret, info);
};








