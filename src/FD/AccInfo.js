
/**
Constructor
Do not call Function in Constructor.
*/
function AccInfo()
{
	// 종합계좌
	this.totAccObj = {};
	
	// 종합계좌 외
	this.accFndObj = new Object();
	this.accPndObj = new Object();
	
	this.filterMap = 
	{
		0: {'00':true},
		1: {'01':true},
		2: {'02':true},
		3: {'03':true},
		4: {'04':true}, 
//		5: {'01':true, '02':true},
		5: {'04':true},
		6: {'01':true, '03':true},
		9: {'00':true, '01':true, '02':true, '03':true}
	};
	
	this.lastAcc = 
	{
		0:null,
		1:null,
		2:null,
		3:null,
		4:null,
		5:null,
		6:null,
		9:null
	};
	
	//자주쓰는 계좌
	this.jajuBankNums = null;
	
}

AccInfo.prototype.loadInfo = function()
{
	CallbackDone.begin();
	
	var dataVal = null;
	var prevVal = null;

	var thisObj = this;
	AppManager.getPref('LASTACC', function(result)
	{
		var tmp = null;
		if(result)
		{
			tmp = JSON.parse(result);
			
			for(var p in thisObj.lastAcc)
			{
				thisObj.lastAcc[p] = tmp[p];
			}	
		}
		CallbackDone.end();
	});
};

AccInfo.prototype.saveInfo = function()
{
	AppManager.setPref('LASTACC', JSON.stringify(this.lastAcc));
};

//계좌정보를 클리어 함
AccInfo.prototype.clearInfo = function()
{
	this.accFndObj = new Object();
	this.accPndObj = new Object();
	this.totAccObj = new Object();
	this.jajuBankNums = null;
};

//마지막 계좌정보를 셋팅함
AccInfo.prototype.setLastAcc = function(type, accData)
{
	this.lastAcc[type] = accData;
};

//마지막 계좌정보를 가져옴
AccInfo.prototype.getLastAcc = function(type)
{
	return this.lastAcc[type];
};

//계좌정보를 셋팅함
AccInfo.prototype.setAccData = function(accData)
{
	var accOne = null,
		tmpAcc = '';
	
	for(var i = 0; i<accData.length; i++)
	{
		accOne = accData[i];
		
		if(accOne['D1상품유형코드'] == '00')
		{
			this.totAccObj[accOne['D1계좌번호']] = accOne;
		}
		else
		{
			if (accOne['D1계좌번호'].length == 11)
			{
				if(accOne['D1계좌번호'].substring(3,5) == '46')
					this.accFndObj[accOne['D1계좌번호']] = accOne;
				else if(accOne['D1계좌번호'].substring(3,5) == '47')
					this.accPndObj[accOne['D1계좌번호']] = accOne;
			}
			else
			{
				// 12자리 넘어가는 경우 sub번호가 포함된 것으로 판단..
				// 11자리로 계좌 관리
				tmpAcc = accOne['D1계좌번호'].substr(0, 11);
				
				if(tmpAcc.substring(3,5) == '46')
				{
					if (!this.accFndObj[tmpAcc])
					{
						accOne['D1계좌번호'] = tmpAcc;
						this.accFndObj[tmpAcc] = accOne;
					}
				}
				else if(tmpAcc.substring(3,5) == '47')
				{
					if (!this.accPndObj[tmpAcc])
					{
						accOne['D1계좌번호'] = tmpAcc;
						this.accPndObj[tmpAcc] = accOne;
					}
				}
			}
				
			accOne['D1상품유형명'] = '투자상품';
		}
	}
};

//계좌정보를 가져옴
AccInfo.prototype.getAccData = function(accNo)
{
	if(accNo && accNo.length == 11)
	{
		if(accNo.substring(3,5) == '46'){
			if(this.accFndObj[accNo]) return this.accFndObj[accNo];
		}
		else if(accNo.substring(3,5) == '47'){
			if(this.accPndObj[accNo]) return this.accPndObj[accNo];
		}
	}
	else return null;
};

//계좌전체를 배열로 가져옴
AccInfo.prototype.getAccList = function()
{
	var accList = new Array();
	
	for(var accKey in this.accFndObj)
	{
		accList.push(this.accFndObj[accKey]);
	}
	for(var accKey in this.accPndObj)
	{
		accList.push(this.accPndObj[accKey]);
	}
	
	for(var accKey in this.totAccObj)
	{
		accList.push(this.totAccObj[accKey]);
	}
	
	accList.sort(function(a,b){
		if(a['D1계좌번호'] < b['D1계좌번호']) return -1;
  		if(a['D1계좌번호'] > b['D1계좌번호']) return 1;
  		return 0;
	});
	
	return accList;
};

//필터 타입으로 필터된 계좌 정보를 배열로 가져옴
AccInfo.prototype.filterAccList = function(filterType)
{
	var accList = new Array();
	var accOne = null;
	var accType = null;
	
	if(filterType == 0)
	{
		for(var accKey in this.totAccObj)
		{
			accOne = this.totAccObj[accKey];
			accList.push(accOne);
		}
	}
	else
	{
		if(filterType == 4)
		{
			for(var accKey in this.accFndObj)
			{
				accOne = this.accFndObj[accKey];
				accType = accOne['D1상품유형코드'];

				if(this.filterMap[filterType][accType])
					accList.push(accOne);
			}
		}	
		else if(filterType == 5)
		{
			for(var accKey in this.accPndObj)
			{
				accOne = this.accPndObj[accKey];
				accType = accOne['D1상품유형코드'];

				if(this.filterMap[filterType][accType])
					accList.push(accOne);
			}
		}	
	}
	
	accList.sort(function(a,b){
		if(a['D1계좌번호'] < b['D1계좌번호']) return -1;
  		if(a['D1계좌번호'] > b['D1계좌번호']) return 1;
  		return 0;
	});
	
	return accList;
};

//계좌에 암호화된 비밀번호 셋팅
AccInfo.prototype.setAccPw = function(accNo, cipherData, pwLength)
{
	if(accNo && accNo.length == 11)
	{
		if(accNo.substring(3,5) == '46')
		{
			if(this.accFndObj[accNo])
			{
				this.accFndObj[accNo]['D1입력비밀번호'] = cipherData;
				this.accFndObj[accNo]['D1입력비밀번호길이'] = pwLength;
			}
		}	
		else if(accNo.substring(3,5) == '47')
		{
			if(this.accPndObj[accNo])
			{
				this.accPndObj[accNo]['D1입력비밀번호'] = cipherData;
				this.accPndObj[accNo]['D1입력비밀번호길이'] = pwLength;
			}
		}	
	}	
};

//암호화된 비밀번호와 평문비밀번호 길이 가져오기
AccInfo.prototype.getAccPw = function(accNo)
{
	if(accNo && accNo.length == 11)
	{
		if(accNo.substring(3,5) == '46')
		{
			var accOne = this.accFndObj[accNo];
			if(accOne && accOne['D1입력비밀번호'])
			{
				return accOne['D1입력비밀번호'];
			}
			else return null;
		}
		else if(accNo.substring(3,5) == '47')
		{
			var accOne = this.accPndObj[accNo];
			if(accOne && accOne['D1입력비밀번호'])
			{
				return accOne['D1입력비밀번호'];
			}
			else return null;
		}
	}
	else return null;
	
};

//계좌 암호비밀번호로 평문 비밀번호 가져오기
AccInfo.prototype.getAccRealPw = function(accNo, callback)
{
	var accPw = this.getAccPw(accNo);
	if(accPw)
	{
		SecurePadManager.cipherToPlain(accPw, callback);
	}
	else callback(null);
};

//계좌 비밀번호 길이 가져오기
AccInfo.prototype.getAccPwLength = function(accNo)
{
	if(accNo && accNo.length == 11)
	{
		if(accNo.substring(3,5) == '46')
		{
			var accOne = this.accFndObj[accNo];
			if(accOne && accOne['D1입력비밀번호길이'])
			{
				return accOne['D1입력비밀번호길이'];
			}
			else return null;
		}
		else if(accNo.substring(3,5) == '47')
		{
			var accOne = this.accPndObj[accNo];
			if(accOne && accOne['D1입력비밀번호길이'])
			{
				return accOne['D1입력비밀번호길이'];
			}
			else return null;
		}
	}
	else return null;
};

//계좌 비밀번호 입력 여부 리턴
AccInfo.prototype.isExistAccPw = function(accNo)
{
	if(accNo && accNo.length == 11)
	{
		if(accNo.substring(3,5) == '46')
		{
			var accOne = this.accFndObj[accNo];
			return (accOne && accOne['D1입력비밀번호']);
		}
		else if(accNo.substring(3,5) == '47')
		{
			var accOne = this.accPndObj[accNo];
			return (accOne && accOne['D1입력비밀번호']);
		}
	}
	else return null;
};


//자주쓰는계좌번호 리스트 로드
AccInfo.prototype.doLoadJaJuBankNums = function()
{
	var data = localStorage.getItem(theApp.accNetManager.getHeaderInfo('USER_ID')+"_JAJUBANKNUMS");
	
	if(data)
	{
		this.jajuBankNums = JSON.parse(data);
	}
	
};

//자주쓰는계좌번호 리스트 가져오기
AccInfo.prototype.doGetJaJuBankNumsAll = function()
{
	return this.jajuBankNums;
};

//자주쓰는계좌번호 리스트 등록 {'D1은행명':'', 'D1은행번호':'', 'D1계좌번호' : '', 'D1계좌명' : ''}
AccInfo.prototype.doAddJaJuBankNum = function(data)
{

	var jsonLocalData = null;
	
	if(data)
	{		
		if(!this.jajuBankNums)
		{
				
			localStorage.setItem(theApp.accNetManager.getHeaderInfo('USER_ID')+"_JAJUBANKNUMS", JSON.stringify([data]));
		}
		else
		{
			this.jajuBankNums.push(data);
			localStorage.setItem(theApp.accNetManager.getHeaderInfo('USER_ID')+"_JAJUBANKNUMS", JSON.stringify(this.jajuBankNums));
		}
		
		jsonLocalData = JSON.parse(localStorage.getItem(theApp.accNetManager.getHeaderInfo('USER_ID')+"_JAJUBANKNUMS"));
		
		this.jajuBankNums = jsonLocalData;
		
	}
	
	return this.jajuBankNums;
};

//삭제
AccInfo.prototype.doDelJaJuBankNum = function(bankNum)
{

	if(bankNum)
	{
		if(this.jajuBankNums.length > 0)
		{
			for(var i=0; i < this.jajuBankNums.length; i++)
			{
				if(this.jajuBankNums[i]['D1계좌번호'] == bankNum)
				{	
					this.jajuBankNums.splice(i,1);
				}
			}
		
			localStorage.setItem(theApp.accNetManager.getHeaderInfo('USER_ID')+"_JAJUBANKNUMS", JSON.stringify(this.jajuBankNums));
		}
		
		//jsonLocalData = JSON.parse(localStorage.getItem("JAJUBANKNUMS"));
		//this.jajuBankNums = jsonLocalData;
	}
	
	return this.jajuBankNums;
};







