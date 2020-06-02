var Util = 
{
    RGBtoRGBA: function(r, g, b)
    {
        if((g == void 0) && (typeof r == 'string'))
        {
           r = r.replace(/^\s*#|\s*&/g, '');
           if(r.length == 3){
               r = r.replace(/(.)/g, '$1$1');
           }
           g = parseInt(r.substr(2, 2), 16);
           b = parseInt(r.substr(4, 2), 16);
           r = parseInt(r.substr(0, 2), 16);
        } 
        
        var min, a = ( 255 - (min = Math.min(r, g, b)) ) / 255;
        
        return [
            r = 0|(r-min)/a,
            g = 0|(g-min)/a,
            b = 0|(b-min)/a,
            a = (0|1000*a)/1000
        ];
    },
	
	formatDate: function(dateStr)
	{
		dateStr += '';
		var date = dateStr.replace(/:/g, '');
		return date.substring(0, 2)+':'+date.substring(2, 4)+':'+date.substring(4, 6);
	},

	makeNumString: function(size, value)
	{
		var ret = '';
		value = ''+value;
		
		//빈자리는 0 으로 채움
		var valueInx = size - value.length; 
		for(var i=0; i<valueInx; i++)
			ret += '0';
	
		//실제 숫자를 채움
		for(var j=0; i<size; i++, j++)
			ret += value.charAt(j);
			
		return ret;
	},
	
	
    autoShrink: function(ele, info) 
	{
		if(info)
		{
			var $ele = $(ele);
			var len = $.trim($ele.text()).length;
			len = (info.maxChar-len)/len;
			if(len<0) $ele.css('font-size', (info.fontSize+info.fontSize*len)+'px');
			else $ele.css('font-size', info.fontSize+'px');
		}
		
    },
	
	
};

/*
Util.moveChildrenToScrlView = function(aview, except)
{
	var scrlView = new AView();
	scrlView.init();
	scrlView.setStyleObj(
	{
		left: '0px',
		top: '0px',
		width: '100%',
		height: '100%',
		overflow: 'auto'
	});
	
	aview.addComponent(scrlView);
	
	var children = aview.getChildren();
	
	for(var i=0; i<children.length; i++)
	{
		if(children[i]===scrlView || children[i]===except) continue;
		
		scrlView.addComponent(children[i]);
	}
};
*/

(function($) {
    $.fn.textfill = function(maxFontPixels) 
	{
        var fontSize = maxFontPixels, ourText = $('span:visible:first', this),
        	maxHeight = $(this).height(), maxWidth = $(this).width(), textHeight, textWidth;
			
        do 
		{
            ourText.css('font-size', fontSize);
            textHeight = ourText.height();
            textWidth = ourText.width();
            fontSize = fontSize - 1;
        } while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 3);
		
        return this;
    }
})(jQuery);


//info : {maxChar:15, fontSize:24}
(function($) {
    $.fn.autoShrink = function(info) 
	{
		if(info)
		{
			var $ele = $(this);
			var len = $.trim($ele.text()).length;
			len = (info.maxChar-len)/len;
			if(len<0) $ele.css('font-size', (info.fontSize+info.fontSize*len)+'px');
			else $ele.css('font-size', info.fontSize+'px');
		}
		
        return this;
    }
})(jQuery);


(function($) {
    $.fn.removeNoLeak = function() 
	{
		var $ele = $(this);
		//$ele.unbind();
		$ele.remove();
    }
})(jQuery);


/*
var Anim = 
{
	scrollTo: function(targetEl, direction, movePos, duration)  
	{
		targetEl = targetEl || document.getElementById('scrolldom');
		
		var timer, start = Date.now(), progress = 0, offset = 1, timeLapsed = 0, position = 0;
		
		if(direction) offset = targetEl.scrollLeft;
		else offset = targetEl.scrollTop;
		
		var distance = movePos - offset, duration = duration || 1000;
		if(timer) clearInterval(timer);
		if(distance == 0) return;
		
		if(direction)
		{
			function stepLeft()
			{
				timeLapsed += 16;
				progress = ( timeLapsed / duration );
				progress = ( progress > 1 ) ? 1 : progress;
				//position = offset + ( distance * easingPattern('easeInOutQuad', progress) );
				position = offset + ( distance * (progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress) );
				
				targetEl.scrollLeft = position;
				if(targetEl.scrollLeft == movePos) clearInterval(timer); 
			}
			timer = setInterval(stepLeft, 16);	
		}
		else
		{
			function stepTop()
			{
				timeLapsed += 16;
				progress = ( timeLapsed / duration );
				progress = ( progress > 1 ) ? 1 : progress;
				position = offset + ( distance * (progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress) );
				
				targetEl.scrollTop = position;
				if(targetEl.scrollTop == movePos) clearInterval(timer);
			}
			timer = setInterval(stepTop, 16);
		}
	}
};
*/



var CallbackDone = {};

CallbackDone.count = 0;
CallbackDone.endCallback = null;

CallbackDone.begin = function()
{
	if(!CallbackDone.endCallback) return;
	
	CallbackDone.count++;
};

CallbackDone.end = function()
{
	if(!CallbackDone.endCallback) return;
	
	if(--CallbackDone.count==0) 
	{
		CallbackDone.endCallback();
		CallbackDone.endCallback = null;
	}
};

CallbackDone.waitAll = function(endCallback)
{
	CallbackDone.count = 0;
	CallbackDone.endCallback = endCallback;
};








