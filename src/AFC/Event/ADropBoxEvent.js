
/**
 * @author asoocool
 */

function ADropBoxEvent(acomp)
{
	AEvent.call(this, acomp);
	
}
afc.extendsClass(ADropBoxEvent, AEvent);


ADropBoxEvent.prototype.actionUpState = function()
{
	var $input = this.acomp.$ele.children('input');
    if($input.attr('readonly') && this.acomp.isEnable)
    //if(this.acomp.isEnable)
	{
		this.acomp.openBox(true);
	}
};

ADropBoxEvent.prototype.defaultAction = function()
{
	this._click();
};

//---------------------------------------------------------------------------------------------------
//	Component Event Functions
//	events: ['click', 'select', 'change']


ADropBoxEvent.prototype.change = function()
{
	this._change();
};


//---------------------------------------------------------------------------------------------------



ADropBoxEvent.prototype._change = function()
{
	var adropbox = this.acomp;
	
	adropbox.$ele.bind('keyup', function(e) 
	{
		adropbox.reportEvent('change', e);
	});
};

ADropBoxEvent.prototype._select = function(itemList)
{
    if(!itemList) return;
    
    var adropbox = this.acomp;
    var isTouchLeave = true, startX = 0, startY = 0;
    
    AEvent.bindEvent(itemList, AEvent.ACTION_DOWN, function(e)
    {
        isTouchLeave = false;
        
        //android 4.3 이하, BugFix
        //드랍박스는 기본적으로 상위로 전달되지 않도록 처리한다. 박스가 동적으로 생성되기 때문에 
		/*
        if(afc.andVer<4.4)
        {
			//스크롤이 작동되기 위해 상위로 전달되는 것을 막음.
			if(adropbox.isScroll()) e.stopPropagation();
		}
		*/
        
        var oe = e.changedTouches[0];
        startX = oe.clientX;
        startY = oe.clientY;
    });
    
    AEvent.bindEvent(itemList, AEvent.ACTION_MOVE, function(e)
    {
        var oe = e.changedTouches[0];

        if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE)
        {
            isTouchLeave = true;
        }
    });

    AEvent.bindEvent(itemList, AEvent.ACTION_UP, function(e)
    {        
        if(isTouchLeave) return;
		
		$(this).removeClass(adropbox.normalClass);
		$(this).addClass(adropbox.selectClass);
        adropbox.selectItem(this.index);
        
        var touchItem = this;
		setTimeout(function() 
		{ 
			adropbox.dropWin.close();
			adropbox.reportEvent('select', touchItem);
		}, 10);	
		
		//딜레이 10이상 주지 말것. 아이폰에서 오류날 수 있음.
		//10 이상 주려면 afc.touchDelay 를 먼저 호출해 줄것.
    });
    
    AEvent.bindEvent(itemList, AEvent.ACTION_CANCEL, function(e)
    {        
        isTouchLeave = true;
    });
};
