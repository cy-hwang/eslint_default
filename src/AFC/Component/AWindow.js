/**
 *	@author asoocool
 * 
 */

function AWindow(containerId)	
{
	AContainer.call(this, containerId);
	
	this.url = null;
	this.opener = null;			//윈도우 open 을 호출한 주체
	this.openContainer = null;

	this.frame = null;		//view 를 감싸고 있는 div
	this.modalBg = null;	//모달용 배경 div
	
	this.isOpenActionDelay = true;
	
	//윈도우 창을 화면 중앙에 띄울지 여부
	//openCenter 를 호출하면 자동으로 true 로 세팅된다.
	this.isFixedCenter = false;
	
	//show 함수 호출시 delay 를 주었는지
	this.isDelayShow = false; 
	//사라지면서 터치한 정보가 하위 컨테이너에게 전달되는 것을 시간 지연을 통해서 막음.
	this.isDisableTime = true;
	
	this.option =
	{
		isModal: true,
		isAutoCenter: false,		//자동 중앙정렬 할지
		isFocusLostClose: false,	//모달인 경우 포커스를 잃을 때 창을 닫을지
		isFocusLostHide: false,		//모달인 경우 포커스를 잃을 때 창을 숨길지
		modalBgOption: 'dark',		//none, light, dark 모달인 경우 배경을 어둡기 정도
		overflow: 'hidden',			//hidden, auto, visible, scroll
	};
	
	/*
	if(afc.andVer<4.4) 
	{
		//4.3 이하에서만 작동
		this.option.isPreventTouch = true;
	}
	*/
	
}
afc.extendsClass(AWindow, AContainer);

//--------------------------------------------------------------------------------
//	static area
//--------------------------------------------------------------------------------

AWindow.BASE_ZINDEX = 1100;

//팝업된 AWindow 객체들을 모아 둔다.
AWindow.wndList = [];

//AWindow.wndList 에서 윈도우를 제거한다.
//윈도우 close 시 내부적으로 자동 호출해 준다.
AWindow.removeWindow = function(awnd)
{
	var length = AWindow.wndList.length;

	for(var i=0; i<length; i++)
	{
		if(AWindow.wndList[i]===awnd)
		{
			AWindow.wndList.splice(i,1);
			break;
		}
	}
};

//AWindow.wndList 에 윈도우를 추가한다.
//윈도우 open 시 내부적으로 자동 호출해 준다.
AWindow.addWindow = function(awnd)
{
	var length = AWindow.wndList.length;

	//이미 존재하는지 체크
	for(var i=0; i<length; i++)
	{
		if(AWindow.wndList[i]===awnd) return false;
	}
	
	AWindow.wndList.push(awnd);
	return true;
};

//보여지고 있는 윈도우 중에서 최상단 윈도우에게 backKey 이벤트를 전달한다.
//디바이스에서 backKey 가 눌려지면 자동으로 호출된다. 
AWindow.reportBackKeyEvent = function()
{
	var tmpWnd = null;
	for(var i=AWindow.wndList.length-1; i>-1; i--)
	{
		tmpWnd = AWindow.wndList[i];
	
		if(tmpWnd.isShow()) return tmpWnd.onBackKey();
	}
	
	return false;
};

//open 된 윈도우들에게 resize 이벤트를 전달한다.
//네이티브 WebView 의 사이즈가 변경되면 자동으로 호출된다.
AWindow.resizeWindow = function()
{
	var length = AWindow.wndList.length;

	for(var i=0; i<length; i++)
		AWindow.wndList[i].onResize();
};

/*
AWindow.getTopWindow = function()
{
	if(AWindow.wndList.length>0) return AWindow.wndList[AWindow.wndList.length-1];
	else return null;
};
*/

AWindow.findWindow = function(winId)
{
	var tmpWnd = null;
	for(var i=AWindow.wndList.length-1; i>-1; i--)
	{
		tmpWnd = AWindow.wndList[i];
	
		if(tmpWnd.getId()==winId) return tmpWnd;
	}
	return null;
};

AWindow.getWindows = function(winId)
{
	var arr = [];
	for(var i=AWindow.wndList.length-1; i>-1; i--)
	{
		tmpWnd = AWindow.wndList[i];
	
		if(tmpWnd.getId()==winId) arr.push(tmpWnd);
	}
	return arr;
};

AWindow.closeAll = function(winId)
{
	var tmpWnd = null;
	for(var i=AWindow.wndList.length-1; i>-1; i--)
	{
		tmpWnd = AWindow.wndList[i];
	
		if(winId)
		{
			if(tmpWnd.getId()==winId) 
			{
				tmpWnd.close();
				continue;
			}	
		}
		else tmpWnd.close();
	}
};

AWindow.closeExceptAll = function(exceptId)
{
	var tmpWnd = null;
	for(var i=AWindow.wndList.length-1; i>-1; i--)
	{
		tmpWnd = AWindow.wndList[i];
		if(tmpWnd.isShow() && (tmpWnd.getId()!=exceptId))
		{
			tmpWnd.close();
		}	
	}
};


AWindow.getWindowPos = function(idx)
{
	return AWindow.wndList[idx]
};

AWindow.getTopWindow = function()
{
	var tmpWnd = null;
	for(var i=AWindow.wndList.length-1; i>-1; i--)
	{
		tmpWnd = AWindow.wndList[i];
	
		if(tmpWnd.isShow()) return tmpWnd;
	}
	
	return null;
};

AWindow.createWindow = function(url, containerId)
{
	//cls 파일 동적 로딩
	if(PROJECT_OPTION.dynamicInc) afc.loadScript(url.replace('.lay', '.js'));

	var clsName = url.substring(url.lastIndexOf('/')+1, url.length-4); //.lay 제거
	var wnd = new window[clsName](containerId);
	wnd.url = url;
	
	return wnd; 
};



//----------------------------------------------------------
//	opener result function
//	function onWindowResult(result, awindow);
//----------------------------------------------------------

AWindow.prototype.init = function(context)
{
	AContainer.prototype.init.call(this, context);
	
	//AWindowEvent.implement(this);
};

AWindow.prototype.setUrl = function(url)
{
	this.url = url;
};

AWindow.prototype.setOpenContainer = function(openContainer)
{
	this.openContainer = openContainer;
};

AWindow.prototype.getOpenContainer = function()
{
	return this.openContainer;
};

//리소스 로드가 완료되면 호출, 최초 한번만 호출된다.
AWindow.prototype.onReady = function()
{
    
	if(this.isFixedCenter || this.option.isAutoCenter) this.moveToCenter();
	
    this.windowTouchBugFix(true);
    
    if(this.option.isPreventTouch) this.preventTouch();
};

AWindow.prototype.moveToCenter = function()
{

    var cenX = $(window).width()/2 - this.getWidth()/2;
    var cenY = $(window).height()/2 - this.getHeight()/2;
    
    this.move(cenX, cenY);
};

AWindow.prototype.setWindowOption = function(option)
{
	for(var p in option)
    {
    	if(option[p]!=undefined)
    		this.option[p] = option[p];
    }
};

//window buf fix
AWindow.prototype.windowTouchBugFix = function(isOpen)
{
	if(isOpen)
	{
		//IOS UIWebOverflowContentView BugFix
		if(afc.isIos) afc.touchDelay();
		
		this.isDisableTime = true;
		
		//이전 윈도우가 사라지면서 자신을 띄웠을 때, 이전 윈도우가 터치한 정보가 자신에게 전달되는 것을 막음.
		//아이폰에서는 this.actionDelay('input'); 이 작동하지 않는다.
		
		if(this.isOpenActionDelay) this.actionDelay();
		
		//자신을 띄운 하위 컨테이너에게 터치 정보가 전달되는 것을 막음. 
		if(this.option.isModal && this.openContainer)
		{
			if(++this.openContainer.disableCount==1)
			{
				//var $ele = this.openContainer.get$ele();
				//$ele.find('input').css('pointer-events', 'none');
				//$ele.css('pointer-events', 'none');
				
				this.openContainer.enable(false);
			}
		}
	}
	
	//close
	else
	{
		//IOS UIWebOverflowContentView BugFix
		if(afc.isIos) afc.touchDelay();
		
		if(this.option.isModal)
		{
			var thisObj = this;
			
			//사라지면서 터치한 정보가 하위 컨테이너에게 전달되는 것을 시간 지연을 통해서 막음.
 			if(this.isDisableTime) setTimeout(_closeHelper, afc.DISABLE_TIME);
			//Disable delay가 없는 경우
 			else _closeHelper();
 			
 			function _closeHelper()
 			{
 				if(!thisObj.openContainer.isValid()) return;
 				
				if(--thisObj.openContainer.disableCount==0)
				{
					//var $ele = thisObj.openContainer.get$ele();
					//$ele.find('input').css('pointer-events', 'auto');
					//$ele.css('pointer-events', 'auto');

					thisObj.openContainer.enable(true);
				}
 			}
		}
	}
};

//android 4.3 이하, BugFix
//배경으로 터치 전달되어 스크롤되는 버그
AWindow.prototype.preventTouch = function()
{
	if(afc.andVer>4.3) return;
	
    AEvent.bindEvent(this.frame[0], AEvent.ACTION_DOWN, function(e)
    {
		e.preventDefault();
		e.stopPropagation();
    });
};

//윈도우가 모달 모드인 경우의 처리
AWindow.prototype.modalManage = function(zIndex)
{
	this.modalBg = $('<div></div>');
	this.modalBg.css(
	{
		'width':'100%', 'height':'100%',
		//'position':'fixed',
		'position':'absolute',
		'top':'0px', 'left':'0px',
		'z-index':zIndex, 
	});
	
	if(this.option.modalBgOption=='light') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.3)');
	else if(this.option.modalBgOption=='dark') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.5)');
	
	$('body').append(this.modalBg);
	
	var thisObj = this;
	AEvent.bindEvent(this.modalBg[0], AEvent.ACTION_DOWN, function(e)
	{
		e.preventDefault();
		e.stopPropagation();
	    	
		if(thisObj.option.isFocusLostClose) 
		{
			thisObj.isDisableTime = false;
			thisObj.close();
		}
		else if(thisObj.option.isFocusLostHide) 
		{
			thisObj.isDisableTime = false;
			thisObj.hide();
		}
	});
	
};

//width, height 값을 지정하지 않으면 컨텐츠 사이즈 만큼 윈도우 사이즈가 잡힌다.
AWindow.prototype.openAsDialog = function(opener, width, height, modalBg)
{
	if(!modalBg)	modalBg = 'light';
	this.setWindowOption(
	{
		isModal: true,
		isAutoCenter: true,
		modalBgOption: modalBg
	});
	this.open(opener, 0, 0, width, height);
};

AWindow.prototype.openCenter = function(opener, width, height)
{
	this.isFixedCenter = true;
	this.setWindowOption(
    {
        isModal: true,
        modalBgOption: 'light'
    });
	this.open(opener, 0, 0, width, height);
};


//	윈도우 창을 연다.
//	opener : Window 를 open 한 주체 , onWindowResult 함수가 호출될 객체
//	width, height 값을 지정하지 않으면 컨텐츠 사이즈 만큼 윈도우 사이즈가 잡힌다.
//
AWindow.prototype.open = function(opener, left, top, width, height)
{
	if(!this.url) return;
    
	var frame = $('<div></div>');
	
	this.frame = frame;
	
	//openContainer 가 지정되어져 있지 않으면
	//기본은 지정되어져 있지 않다.
	if(!this.openContainer)
	{
		if(opener) 
		{
			if(opener instanceof AContainer) this.openContainer = opener;
			else if(opener instanceof AComponent) this.openContainer = opener.getContainer();
		}
		
		//openContainer 가 지정되지 않았으면 topWindow, getCurrentPage 순서로 지정
		if(!this.openContainer)
		{
			this.openContainer = AWindow.getTopWindow();
			if(!this.openContainer) this.openContainer = theApp.getCurrentPage();
		}
	}
	
	this.opener = opener;

	var zIndex = AWindow.BASE_ZINDEX + AWindow.wndList.length*100;
	
	//전역 wndList 에 추가
	AWindow.addWindow(this);
	
	//window position size
	if(!isNaN(left)) left += 'px';
	if(!isNaN(top)) top += 'px';
	if(!isNaN(width)) width += 'px';
	if(!isNaN(height)) height += 'px';
	
	//frame.css( { 'position':'fixed', 'left':left, 'top':top, 'z-index':zIndex });
	frame.css( { 'position':'absolute', 'left':left, 'top':top, 'z-index':zIndex });
	if(width) frame.css('width', width);
	if(height) frame.css({'height': height, 'overflow':this.option.overflow});
	
    var thisObj = this;
    
    if(typeof(this.url)=="string")
    {
	    this.url = this.url.replace('.lay', '.html');
	    
	    //content html load
	    //frame.load(this.url, function() 
	    afc.loadSync(frame[0], this.url, function()
	    {
	    	if(thisObj.option.isModal) thisObj.modalManage(zIndex-1);
	    	
	    	var childContent = $(this).children();
	    	childContent.css('position', 'relative');
	    	
			$('body').append(this);

			thisObj.init(childContent[0]);
			thisObj.view.updatePosition();
			thisObj.onReady();
	    });
    }
    else
    {
    	if(this.option.isModal) this.modalManage(zIndex-1);
		
		this.url.css('position', 'relative');
	    frame.append(this.url);
	    
		$('body').append(frame);
		
		this.url[0].noRealizeChildren = true;
		this.init(this.url[0]);
		this.onReady();
    }
	
	//전역 wndList 에 추가
	//AWindow.addWindow(this);
};

//윈도우 창을 닫는다.
//----------------------------------------------------------
//	opener result function
//	function onWindowResult(result, awindow);
//----------------------------------------------------------

AWindow.prototype.onClose = function()
{
	return true;
};

AWindow.prototype.close = function(result)
{
	if(!this.frame) return;
	
	if(!this.onClose()) return;
	
	this.windowTouchBugFix(false);
	
	this.view.removeFromView();
	this.view = null;
	
    this.frame.remove();
    this.frame = null;
    
	if(this.option.isModal) 
	{
		this.modalBg.remove();
		this.modalBg = null;
	}
	
	//전역 wndList 에서 제거
	AWindow.removeWindow(this);
	
	if(this.opener && this.opener.onWindowResult) 
	{
		var thisObj = this;
		setTimeout(function()
		{
			thisObj.opener.onWindowResult(result, thisObj);
		}, 10);
	}
};

AWindow.prototype.show = function(delay)
{	
	this.windowTouchBugFix(true);
	
	var zIndex = (AWindow.BASE_ZINDEX + AWindow.wndList.length*100)-2;
	
	if(this.option.isModal)
	{
		this.modalBg.css('z-index', zIndex-1);
		this.modalBg.show();
	}
	
	this.frame.css('z-index', zIndex);
        
    if(delay!=undefined)
    {
      	var thisObj = this;
       	thisObj.isDelayShow = true;

       	setTimeout(function() 
       	{
       		if(thisObj.isDelayShow) 
       			thisObj.frame.show();
       	}, delay);
    }
    else this.frame.show();
};

AWindow.prototype.hide = function()
{
	this.isDelayShow = false;
	
	this.windowTouchBugFix(false);	
	
    this.frame.hide();
	if(this.option.isModal) this.modalBg.hide();
};

AWindow.prototype.move = function(x, y)
{
	if(!isNaN(x)) x += 'px';
	if(!isNaN(y)) y += 'px';
	
	this.frame.css( { 'left':x, 'top':y });
};

AWindow.prototype.moveX = function(x)
{
	if(!isNaN(x)) x += 'px';
	this.frame.css('left', x);
};

AWindow.prototype.moveY = function(y)
{
	if(!isNaN(y)) y += 'px';
	this.frame.css('top', y);
};

AWindow.prototype.offset = function(x, y)
{
	var pos = this.getPos();
	this.frame.css( { 'left':(pos.left+x)+'px', 'top':(pos.top+y)+'px' });
};

AWindow.prototype.getPos = function()
{
	return this.frame.position();
};

AWindow.prototype.setPos = function(pos)
{
	this.frame.css( { 'left': pos.left+'px', 'top': pos.top+'px' });
};

AWindow.prototype.getWidth = function()
{
	return this.frame.width();
};

AWindow.prototype.getHeight = function()
{
	return this.frame.height();
};

AWindow.prototype.setWidth = function(width)
{
	return this.frame.width(width);
};

AWindow.prototype.setHeight = function(height)
{
	return this.frame.height(height);
};

AWindow.prototype.isShow = function()
{
	return this.frame.is(":visible");
};

AWindow.prototype.isOpen = function()
{
	return (this.frame!=null);
};

AWindow.prototype.onBackKey = function()
{
	this.close();
	return true;
};

