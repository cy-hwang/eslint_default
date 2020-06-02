/**
 * @author asoocool
 */

//-----------------------------------------------------------------------------------------
//  AEvent class
//-----------------------------------------------------------------------------------------

function AEvent(acomp)
{
	this.acomp = acomp;
	this.isTouchLeave = true;
}

//--------------------------------------------------------------
// static area

AEvent.TOUCHTIME = 0;

AEvent.TOUCHLEAVE = 20;
if(afc.isIos) AEvent.TOUCHLEAVE = 40;

if(afc.isPC)
{
	AEvent.ACTION_DOWN = 'mousedown';
	AEvent.ACTION_MOVE = 'mousemove';
	AEvent.ACTION_UP = 'mouseup';
	//pc에서는 발생하지 않는 이벤트지만 변수를 맞추기 위해 넣어 놓음
	AEvent.ACTION_CANCEL = 'touchcancel';
}
else
{
	AEvent.ACTION_DOWN = 'touchstart';
	AEvent.ACTION_MOVE = 'touchmove';
	AEvent.ACTION_UP = 'touchend';
	AEvent.ACTION_CANCEL = 'touchcancel';
}

AEvent.bindEvent = function(element, eventName, callback)
{
	if(afc.isPC)
	{
		element.addEventListener(eventName, function(e)
		{
			e.changedTouches = [ { clientX:e.clientX, clientY:e.clientY, pageX:e.pageX, pageY:e.pageY } ];
			e.targetTouches = [ { clientX:e.clientX, clientY:e.clientY, pageX:e.pageX, pageY:e.pageY } ];
			e.touches = [ { clientX:e.clientX, clientY:e.clientY, pageX:e.pageX, pageY:e.pageY } ];
			
			callback.call(this, e);
		});
	}
	else element.addEventListener(eventName, callback);
};

AEvent.unbindEvent = function(element, eventName, callback)
{
	element.removeEventListener(eventName, callback);
};

AEvent.triggerEvent = function(element, eventName, info)
{
    var evt = document.createEvent('UIEvent');
	evt.initUIEvent(eventName, true, true);

	if(info)
	{
		if(afc.isPC)
		{
			evt.clientX = info.clientX;
			evt.clientY = info.clientY;
			evt.pageX = info.pageX;
			evt.pageY = info.pageY;
		}
		else
		{
			evt.changedTouches = info.changedTouches;
			evt.targetTouches = info.targetTouches;
			evt.touches = info.touches;
		}
		
		//evt.isTrigger = true;
		if(info.userData) evt.userData = info.userData;
	}
	
   	element.dispatchEvent(evt);
};

//모든 클릭 이벤트들이 중복해서 발생되지 않도록 체크함.
AEvent.clickComp = null;

//-------------------------------------------------------------




//	overloading functions

//각 터치 상태에 따라 컴포넌트 상태를 상속받아 구현한다.
AEvent.prototype.actionDownState = function(){};
AEvent.prototype.actionMoveState = function(){};
AEvent.prototype.actionUpState = function(){};
AEvent.prototype.actionCancelState = function(){};

//defaultAction 을 제외한 나머지 이벤트 함수들은 이벤트 함수 등록시만 호출된다.
AEvent.prototype.defaultAction = function(){};
//------------------------------------------------------



//---------------------------------------------------------------------------------------------------
//	Component Event Functions

AEvent.prototype.actiondown = function()
{
	this._actiondown();
};

AEvent.prototype.actionmove = function()
{
	this._actionmove();
};

AEvent.prototype.actionup = function()
{
	this._actionup();
};

AEvent.prototype.actioncancel = function()
{
	this._actioncancel();
};

//---------------------------------------------------------------------------------------------------


//공통으로 사용되어질 수 있는 이벤트 액션 구현
//상속받아 이벤트 함수를 선언하고 그 함수 안에서 다음 함수들 중 필요한 함수를 호출하면 됨.

AEvent.prototype._actiondown = function()
{
	var thisObj = this;
	this.acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		thisObj.actionDownState();
		thisObj.acomp.reportEvent('actiondown', e);
	});
};

AEvent.prototype._actionmove = function()
{
	var thisObj = this;
	
	this.acomp.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		thisObj.actionMoveState();
		thisObj.acomp.reportEvent('actionmove', e);
	});
};

AEvent.prototype._actionup = function()
{
	var thisObj = this;
	
	this.acomp.bindEvent(AEvent.ACTION_UP, function(e)
	{
		thisObj.actionUpState();
		thisObj.acomp.reportEvent('actionup', e);
	});
};

AEvent.prototype._actioncancel = function()
{
	var thisObj = this;
	
	this.acomp.bindEvent(AEvent.ACTION_CANCEL, function(e)
	{
		thisObj.actionCancelState();
		thisObj.acomp.reportEvent('actioncancel', e);
	});
};


AEvent.prototype._click = function(evtName)
{
	var thisObj = this, acomp = this.acomp;
	var startX = 0, startY = 0;
	
	if(!evtName) evtName = 'click';
	
	acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		//afc.log('AEvent.ACTION_DOWN');
		if(!acomp.isEnable || e.touches.length > 1) return;
		if(acomp.ddManager && acomp.ddManager.isDraggable) return;
		
		if(acomp.isSafeClick)
		{
			if((new Date().getTime() - AEvent.TOUCHTIME) < afc.DISABLE_TIME) return; 
		}
		
		/*
		if(AEvent.clickComp) return;
		AEvent.clickComp = acomp;
		*/

		thisObj.isTouchLeave = false;

		var oe = e.changedTouches[0];
		startX = oe.clientX;
		startY = oe.clientY;
		
		thisObj.actionDownState();
	});
	
	//모바일인 경우 자신의 영역에 touchstart 를 하지 않으면 touchmove 가 발생하지 않는다.
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다. 
	acomp.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		//afc.log('AEvent.ACTION_MOVE');
		if(thisObj.isTouchLeave || !acomp.isEnable || e.touches.length > 1) return;
		if(acomp.ddManager && acomp.ddManager.isDraggable) return;

		var oe = e.changedTouches[0];
		if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE) 
		{
			thisObj.isTouchLeave = true;
			//setTimeout(function() { AEvent.clickComp = null; }, afc.DISABLE_TIME);
			thisObj.actionMoveState();
			if(acomp.isSafeClick) AEvent.TOUCHTIME = new Date().getTime();
		}
		
	});
	
	acomp.bindEvent(AEvent.ACTION_UP, function(e) 
	{
		//afc.log('AEvent.ACTION_UP');
		//setTimeout(function() { AEvent.clickComp = null; }, afc.DISABLE_TIME);
		if(thisObj.isTouchLeave || !acomp.isEnable || e.touches.length > 1) return;
		if(acomp.ddManager && acomp.ddManager.isDraggable) return;

	   	//android 4.1 이하, BugFix01
	   	//상위 뷰가 터치 이벤트를 받지 않도록, ex)리스트뷰의 셀렉트 이벤트 발생 방지
	    if(acomp.eventStop) e.stopPropagation();
	
		thisObj.isTouchLeave = true;
		
		thisObj.actionUpState();
		
		if(acomp.isSafeClick)
		{
			if((new Date().getTime() - AEvent.TOUCHTIME) > afc.DISABLE_TIME) AEvent.TOUCHTIME = new Date().getTime();		
		}
		
		/*
		if(acomp.isSafeClick) 
		{
			//두번 클릭 방지
			acomp.actionDelay();
			
			acomp.reportEventDelay(evtName, e, 1);
		}
		else acomp.reportEventDelay(evtName, e, 1);
		*/
		
		acomp.reportEventDelay(evtName, e, 1);
	});
	
	acomp.bindEvent(AEvent.ACTION_CANCEL, function(e) 
	{
		thisObj.isTouchLeave = true;
		//setTimeout(function() { AEvent.clickComp = null; }, afc.DISABLE_TIME);
		thisObj.actionCancelState();
		if(acomp.isSafeClick) AEvent.TOUCHTIME = new Date().getTime();
	});
};

AEvent.prototype._longtab = function()
{
	var thisObj = this, acomp = this.acomp, timeout = null, startX = 0, startY = 0;
	
	acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		if(!acomp.isEnable || e.touches.length > 1) return;
		
		if((new Date().getTime() - AEvent.TOUCHTIME) < afc.DISABLE_TIME) return; 
		
		thisObj.actionDownState();

		var oe = e.changedTouches[0];
		startX = oe.clientX;
		startY = oe.clientY;
		
		if(timeout) 
		{
			clearTimeout(timeout);
			timeout = null;
		}
        
        timeout = setTimeout(function()
        {
			//롱탭 이벤트 시에는 버튼의 클릭이벤트가 발생되지 않도록 하기 위해
			thisObj.isTouchLeave = true;
			
        	timeout = null;
            acomp.reportEvent('longtab', e);
            
        }, 700);
	});

	acomp.bindEvent(AEvent.ACTION_MOVE, function(e) 
	{
		var oe = e.changedTouches[0];
		if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE)
		{
			if(timeout) 
			{
				clearTimeout(timeout);
				timeout = null;
			}
			thisObj.actionMoveState();
			if(!afc.isSimulator) AEvent.TOUCHTIME = new Date().getTime();
		}
	});

	acomp.bindEvent(AEvent.ACTION_UP, function(e) 
	{
        if(timeout) 
        {
        	clearTimeout(timeout);
        	timeout = null;
        }
		
		thisObj.actionUpState();
		
		if((new Date().getTime() - AEvent.TOUCHTIME) > afc.DISABLE_TIME) AEvent.TOUCHTIME = new Date().getTime();	
		
	});
	
	acomp.bindEvent(AEvent.ACTION_CANCEL, function(e) 
	{
		thisObj.isTouchLeave = true;
		if(timeout) 
		{
			clearTimeout(timeout);
			timeout = null;
		}
		thisObj.actionCancelState();
	});
};

AEvent.prototype._swipe = function()
{
	var scrlManager = new ScrollManager();
	scrlManager.setOption({moveDelay:200});
	
	var isDown = false, thisObj = this, evtArea = this.acomp.element;
	
	AEvent.bindEvent(evtArea, AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;

		e.preventDefault();

		scrlManager.initScroll(e.changedTouches[0].clientX);
	});
	
	//move
	AEvent.bindEvent(evtArea, AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;

		e.preventDefault();

		scrlManager.updateScroll(e.changedTouches[0].clientX, function(move)
		{
		});
	});
	
	AEvent.bindEvent(evtArea, AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		e.preventDefault();
		
		scrlManager.scrollCheck(e.changedTouches[0].clientX, function(move)
		{
			var evtObj = 
			{
				direction: 'left',//next
				distance: this.totDis
			};
			
			if(this.totDis<0) 
				evtObj.direction = 'right';
		
			thisObj.acomp.reportEvent('swipe', evtObj);
			return false;
		});
	});
};

/*
AEvent.prototype._swipe = function()
{
	var thisObj = this, acomp = this.acomp;
	var isTouchLeave = true, startX = 0, startY = 0, startTime = null, maxTime = 1000, maxDist = 15;
	
	acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		//if(acomp.ddManager && acomp.ddManager.isDraggable) return;

		isTouchLeave = false;
		startTime = e.timeStamp;

		var oe = e.changedTouches[0];
		startX = oe.clientX;
		startY = oe.clientY;
		
	});
	
	//모바일인 경우 자신의 영역에 touchstart 를 하지 않으면 touchmove 가 발생하지 않는다.
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다. 
	acomp.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(isTouchLeave) return;
		//if(acomp.ddManager && acomp.ddManager.isDraggable) return;
		
		//e.preventDefault();
		
		var oe = e.changedTouches[0];
		var disX = (oe.clientX - startX);
		var curDist = (startX === 0) ? 0 : Math.abs(disX);
		var currentTime = e.timeStamp;
		
		if(startTime !==0 && (currentTime - startTime) < maxTime && curDist > maxDist)
		{
			e.direction = ( disX < 0 );
			acomp.reportEvent('swipe', e, 1);
			startTime = 0;
			startX = 0;
		}
		
		//var oe = e.changedTouches[0];
		//if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE) 
		//{
		//	isTouchLeave = true;
		//}
	});
	
	acomp.bindEvent(AEvent.ACTION_UP, function(e) 
	{
		if(isTouchLeave) return;
		//if(acomp.ddManager && acomp.ddManager.isDraggable) return;
			
	   	//android 4.1 이하, BugFix01
	   	//상위 뷰가 터치 이벤트를 받지 않도록, ex)리스트뷰의 셀렉트 이벤트 발생 방지
		
	    e.stopPropagation();
		isTouchLeave = true;
		
		//swipe 범용 이벤트 적용하기
		//var oe = e.originalEvent.changedTouches[0];
        //var disX = aview.startX - oe.clientX;
		
        //if(Math.abs(disX) > 200)
        //{
        //    e.direction = ( disX > 0 );
        //	aview.reportEvent('swipe', e);
        //}
		
		startTime = 0;
		startX = 0;
	});
};
*/