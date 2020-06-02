
/**
Constructor
Do not call Function in Constructor.
*/
function FD5001_W04(containerId)
{
	BaseWindow.call(this, containerId);

	//# Set layout url like this ...
	//this.url = 'folderName/FD5001_W04.lay';

	//TODO:edit here

}
afc.extendsClass(FD5001_W04, BaseWindow);


FD5001_W04.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);

	//TODO:edit here
	
};


FD5001_W04.prototype.onBackBtnClick = function(comp, info)
{

	//TODO:edit here
	
	this.close(0);
	
};



FD5001_W04.prototype.onActiveDone = function(reload)
{
	BaseWindow.prototype.onActiveDone.call(this, reload);
	
	this.grid1 = this.findCompById('Grid1');
	this.grid2 = this.findCompById('Grid2');
	this.grid1.setCellText(0,1, '18,000,000원');
	this.grid1.setCellText(1,1,afc.addComma(this.limitPay)+'원');
	
	this.nameLabel = this.findCompById('lblDrawAccNm');
	
	afc.log(this.name);
 	this.nameLabel.setText(this.name);
	PensionCommon.contiKey = null;
	
	PensionCommon.SendData_SACMT192(this);
	
	this.cnt = 0;
	this.array1 = new Array();
	this.array2 = new Array();
	this.arrResult = new Array();
}



//모든 은행 정보 가져오기 PensionCommon SACMT192
FD5001_W04.prototype.callback192Data = function(block)
{

	
	var flag = false;
	var sum = 0;
	for(var i=0;i<block.length;i++){
	
		if(block[i]['D1계좌상태명'] == '활동계좌'){
			afc.log( block[i]['D1지점명'] +  block[i]['D1세금우대가입금액']);
			this.array1[this.cnt] = block[i]['D1지점명'];
			this.array2[this.cnt] = block[i]['D1세금우대가입금액'];
			this.cnt++;
			flag = true;
			
		}
	}
	
	
	if(flag == true){
		if(PensionCommon.contiKey != null) {
			PensionCommon.SendData_SACMT192(this);
			
		}else{

			this.array1[this.cnt++]='0'; //중복값을 알기 위해 마지막에 '0'값 넣기 

			this.setGridData();
		}
		
		flag = false;
	}
	
					
	
};






FD5001_W04.prototype.onButton1Click = function(comp, info)
{

	//TODO:edit here
	
	this.close(0);

};

//가져온 은행 정보 중복값 없이 화면에 보여주기 
//중복 은행 세금우대가입금액 모두 더하기 
FD5001_W04.prototype.setGridData = function()
{

	//TODO:edit here
	
	
	for(var i=0;i<this.cnt-1;i++){
		var sum = this.array2[i]*1;
		var bank = '';
		for(var j=i+1;j<this.cnt;j++){
			if(this.array1[i] != this.array1[j]){
				bank = this.array1[i];
				i=j-1;
				break;
			}else{
				sum = sum + this.array2[j]*1;	
				
			}
		}
		
		this.grid2.addRow([bank,afc.addComma(sum)+'원']);
	}
	


};

FD5001_W04.prototype.onView1ScrollBottom = function(comp, info)
{

	//TODO:edit here
	
	
};

