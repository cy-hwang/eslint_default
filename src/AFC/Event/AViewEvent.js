
/**
 * @author asoocool
 */

function AViewEvent(acomp)
{
	AEvent.call(this, acomp);
	
	this.bScrollBind = false;
}
afc.extendsClass(AViewEvent, AEvent);



//events: ['swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom', 'drop', 'dragStart', 'dragEnd' ]

//---------------------------------------------------------------------------------------------------
//	Component Event Functions

AViewEvent.prototype.swipe = function()
{
	this._swipe();
};

AViewEvent.prototype.longtab = function()
{
	this._longtab();
};

AViewEvent.prototype.scroll = function()
{
	this._scroll();
};

AViewEvent.prototype.scrollleft = function()
{
	this._scroll();
};

AViewEvent.prototype.scrollright = function()
{
	this._scroll();
};

AViewEvent.prototype.scrolltop = function()
{
	this._scroll();
};

AViewEvent.prototype.scrollbottom = function()
{
	this._scroll();
};

//---------------------------------------------------------------------------------------------------

AViewEvent.prototype._scroll = function()
{
	if(this.bScrollBind) return;
	this.bScrollBind = true;
	
	var aview = this.acomp, lastTop = 0, lastLeft = 0;
	
	aview.element.addEventListener('scroll', function(e)
	{
		aview.reportEvent('scroll', e);
		
		//horizontal
		if(lastLeft!=this.scrollLeft)
		{
			if(this.offsetWidth + this.scrollLeft >= this.scrollWidth)
			{
				if(aview.scrollRightManage())
					aview.reportEvent('scrollright', e);
			}
			else if(this.scrollLeft == 0)
			{
				if(aview.scrollLeftManage())
					aview.reportEvent('scrollleft', e);
			}
			
			lastLeft = this.scrollLeft;
		}
		
		//vertical
		if(lastTop!=this.scrollTop)
		{
			if(this.offsetHeight + this.scrollTop >= this.scrollHeight)
	        {
	        	if(aview.scrollBottomManage())
					aview.reportEvent('scrollbottom', e);
	        }
	        else if(this.scrollTop == 0)
	        {
	        	if(aview.scrollTopManage())
					aview.reportEvent('scrolltop', e);
	        }
			
			lastTop = this.scrollTop;
		}
	});
};

