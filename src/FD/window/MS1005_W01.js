
/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_W01(containerId)
{
	BaseWindow.call(this, containerId);
	
	this.bankInfo;
}
afc.extendsClass(MS1005_W01, BaseWindow);


MS1005_W01.prototype.onReady = function()
{
	BaseWindow.prototype.onReady.call(this);
	
	this.rbManager = new RadioBtnManager();
	this.button1 = this.findCompById('Button1');
	this.button2 = this.findCompById('Button2');
	
	//속도 문제로 인해 2개의 컴포넌트로 분리
	this.bankListView = this.findCompById('BankListView');
	this.stockListView = this.findCompById('StockListView');
	this.bankListView.setDelegator(this);	//bindData 작동위해
	this.stockListView.setDelegator(this);	//bindData 작동위해
	
	this.bankList = [];
	this.stockList = [];
	this.setDataList();
	
	this.rbManager.selectButton(this.button1);
	this.bankListView.show(AComponent.VISIBLE);
	this.stockListView.show(AComponent.GONE);
};

MS1005_W01.prototype.onInit = function()
{
};

MS1005_W01.prototype.setDataList = function()
{
	this.bankList = [];
	this.stockList = [];
	
	var arrLength = this.bankInfo.length;
	var bankNo = '';
	var bankName = '';
	for( var i = 0; i < arrLength; i++)
	{	
		bankNo = this.bankInfo[i]['D1은행번호'];
		bankName = this.bankInfo[i]['D1은행명'];
			
		if( 200 >  bankNo)
		{
			this.bankList.push( [bankNo, bankName.substring(4, bankName.length)+'('+bankNo+')'] );
		} else {
			this.stockList.push( [bankNo, bankName.substring(4, bankName.length)+'('+bankNo+')'] );
		}	
	}		
	
	this.bankListView.addItem('FD/view/MS1005_L01.lay',this.bankList);
	this.stockListView.addItem('FD/view/MS1005_L01.lay',this.stockList);
};

MS1005_W01.prototype.bindData = function(item, data, alistview)
{
	if( item.view.setData) {
		item.view.setData(data);
	}
};


MS1005_W01.prototype.onButtonSelect = function(comp, info)
{
	this.rbManager.selectButton(comp);
	
	if( '은행' === comp.getText()) {
		this.bankListView.show(AComponent.VISIBLE);
		this.stockListView.show(AComponent.GONE);
	} else {		
		this.stockListView.show(AComponent.VISIBLE);
		this.bankListView.show(AComponent.GONE);
	}
};

MS1005_W01.prototype.onListView1Select = function(comp, info)
{
	this.close(info.view.data);
};
MS1005_W01.prototype.onCloseBtnClick = function(comp, info)
{
	this.close(0);
};
