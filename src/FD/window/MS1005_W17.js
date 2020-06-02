
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_W17(containerId)
{
	AWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/MS1005_W17.lay';

	//TODO:edit here

}
afc.extendsClass(MS1005_W17, AWindow);


MS1005_W17.prototype.onReady = function()
{
	AWindow.prototype.onReady.call(this);
	
	this.EmpNoGrid = this.findCompById('EmpNoGrid');
	//TODO:edit here
	//this.sendSSLDQ019();

	this.rbManager = new RadioBtnManager();
	this.EmpNmBtn = this.findCompById('EmpNmBtn');
	this.EmpNoBtn = this.findCompById('EmpNoBtn');
	this.RecomTxt = this.findCompById('RecomTxt');
	this.RecomTxt.maxLen = 40;
	this.gubun = '추천인';
	this.rbManager.selectButton(this.EmpNmBtn);
};

MS1005_W17.prototype.sendSSLDQ019 = function()
{
	var thisobj = this;
	
	var EmpNm = "";
	var EmpNo = "";
	var temp = this.RecomTxt.getText().trim();
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi; // Avoid SQL Injection Vulnerabilities
	var recom = temp.replace(regExp, "");
	if (this.gubun === '추천인') {
		if (!recom) { AToast.show('추천인을 입력하여주세요.'); return; }
		else if (recom.length > 40) { AToast.show('추천인은 40자 이내로 입력해주세요.'); return; }
		else { EmpNm = recom; }
	} else {
		if (!recom) { AToast.show('ID를 입력하여주세요.'); return; }
		else if (recom.length > 9) { AToast.show('ID는 9자 이내로 입력해주세요.'); return; }
		else { EmpNo = recom.toLowerCase(); }
	}
	
	//next키가 없으면 그리드 초기화
	if(!thisobj.contiKey)
	{
		thisobj.EmpNoGrid.removeAll();
	}
	
	QryRequest.request('SSLDQ019',
	function(queryData)
	{
		var inBlock1 = queryData.getBlockData('InBlock1');

		inBlock1[0] = { "D1사원번호"    : EmpNo,
						"D1지점번호"    : "999",
						"D1사원명"      : EmpNm,
						"D1퇴직여부"    :"0",
						"D1회사전체여부" : "",
						"D1추가사원여부" :"" };
		
		//next 키 저장			
		queryData.setContiKey(thisobj.contiKey);
		//queryData.printQueryData();
	},
	
	function(queryData)
	{	
		if(queryData) {
			//queryData.printQueryData();
			var outBlock1 = queryData.getBlockData('OutBlock1');

			var row = null;
			
			if(outBlock1.length == 0) {
				AToast.show('조회 내역이 없습니다.');
			}
			
			for(var i in outBlock1){
				if('999999999' == outBlock1[i].D1사원번호)
					continue;
					
				row = thisobj.EmpNoGrid.addRow([outBlock1[i].D1사원번호,outBlock1[i].D1사원명]);
				row.data = outBlock1[i];
			}
			
			//next키 저장
			thisobj.contiKey = queryData.getContiKey();
			
		} else {
			theApp.getErrMsg(thisobj,this);
		}
	});
	
};

MS1005_W17.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	this.close(['','']);

};

MS1005_W17.prototype.onEmpNoGridSelect = function(comp, info)
{
	
	//TODO:edit here
	this.close([info.data.D1사원번호, info.data.D1사원명]);	

};

MS1005_W17.prototype.onEmpNoGridScrollBottom = function(comp, info)
{

	//TODO:edit here
	if(this.contiKey)
	{
		this.sendSSLDQ019();
	}
	else
	{	
		if(comp.getRowCount() > 0) AToast.show('마지막 목록입니다');
	}

};

MS1005_W17.prototype.onButton6Click = function(comp, info)
{
	this.sendSSLDQ019();
};

MS1005_W17.prototype.onButtonSelect = function(comp, info)
{
	this.rbManager.selectButton(comp);
	this.RecomTxt.setText("");
	this.gubun = comp.getText();
	if (this.gubun === '추천인') {
		this.RecomTxt.maxLen = 40;
	} else {
		this.RecomTxt.maxLen = 9;
	}
	this.RecomTxt.$ele.attr('maxlength', this.RecomTxt.maxLen);
};