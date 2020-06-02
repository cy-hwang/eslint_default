/**
 * @author asoocool
 */

function AView(delegator)
{
	AComponent.call(this);
	
	//뷰의 기능만 사용하고 대표자를 다른 객체로 삼고자 할 경우, APage, AWindow 가 사용한다.
	this.delegator = delegator;
	this.isActiveActionDelay = true;
	
	//AView 의 소유자, ATabView, AListView 가 사용한다.
	this.owner = null;
	this.loadView = null;
	this.loadPage = null;
	
	//자체적인 스크롤 구현
	this.scrlManagerX = null;
	this.scrlManagerY = null;
}
afc.extendsClass(AView, AComponent);

AView.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	//뷰의 기능만 사용하고 대표자를 다른 객체로 삼고자 할 경우, ex)APage, AWindow
	if(this.delegator) this.element.acomp = this.delegator;
	
	//html 저장시, background-size 가 '100% 100%' 에서 '100%' 로 변하는 버그때문에...
	//if($.trim(this.getStyle('background-size'))=='100%')
	//	this.setStyle('background-size', '100% 100%');

	var respClass = this.getAttr(afc.ATTR_RESP);
	if(respClass) this.addClass(respClass);
	
	//jQuery droppable 클래스 제거
	this.removeClass('ui-droppable');
	
	if(!this.element.noRealizeChildren) this.realizeChildren(evtListener);
	
	var loadUrl = this.getAttr('data-load-url');
	if(loadUrl) this.viewLoad(loadUrl);
	
	if(afc.isIos)
	{
		if(this.$ele.css('overflow')!='hidden')
			this.$ele.css('-webkit-overflow-scrolling', 'touch');
	}
	else
	{
		/*
		//뷰에 스크롤이 발생할 경우 가속기능을 부여하기 위해 z-index가 없거나 auto인 경우 0으로 대체
		if(this.$ele.css('overflow')=='auto')
		{
			var viewZindex = this.$ele.css('z-index');
			if(!viewZindex || viewZindex == 'auto') this.$ele.css('z-index', 0);
		}
		*/
		//android 4.3 이하, BugFix
		//스크롤뷰 안의 컴포넌트 터치 안되는 버그 수정
		if(afc.andVer<4.4)
		{
			this.$ele.css('-webkit-transform', 'translateZ(0)');
			
			//thisObj = this;
			//setTimeout(function() { thisObj.$ele.css('-webkit-transform', ''); }, 100);
		}
	}
	
	this.escapePreventTouch();
};

//ATabView 의 서브뷰에서 사용됨.
AView.prototype.onWillActive = function(reload) {};
AView.prototype.onActive = function(reload) {};
AView.prototype.onActiveDone = function(reload) {};
AView.prototype.onWillDeactive = function() {};
AView.prototype.onDeactive = function() {};
AView.prototype.onDeactiveDone = function() {};
//--------------------------------------------------------

AView.prototype.reuse = function()
{
	AComponent.prototype.reuse.call(this);
	
	var container = this.getContainer();
	
	this.$ele.children().each(function()
	{
		if(this.acomp) 
		{
			this.container = container;
			//루트뷰는 변경되지 않는다.
			//this.rootView = rootView;
			this.acomp.reuse();
		}
	});
};

AView.prototype.setScrollArrowX = function()
{
	var sa = new ScrollArrow();
	sa.setArrow('horizental');
	sa.apply(this.element);
};

AView.prototype.setScrollArrowY = function()
{
	var sa = new ScrollArrow();
	sa.setArrow('vertical');
	sa.apply(this.element);
};

AView.prototype.enableScrlManagerX = function()
{
	if(this.scrlManagerX) return;
	
	this.scrlManagerX = new ScrollManager();
	this.scrlManagerX.setOption(
	{
		startDelay: 10,
		endDelay: 20,
		scrollAmount: 10,
		speedRatio: 0.03
	});
	
	this.$ele.css({'overflow':'auto', '-webkit-overflow-scrolling': ''});
	
	this.scrollXImplement();
	this.aevent._scroll();
};

AView.prototype.enableScrlX = function()
{
	this.scrlManagerX.enableScroll(true);
};

AView.prototype.disableScrlX = function()
{
	this.scrlManagerX.enableScroll(false);
};

AView.prototype.enableScrlManagerY = function()
{
	if(this.scrlManagerY) return;

	this.scrlManagerY = new ScrollManager();
	this.$ele.css({'overflow':'auto', '-webkit-overflow-scrolling': ''});
	
	this.scrollYImplement();
	this.aevent._scroll();
};

AView.prototype.setScrollXComp = function(acomp)
{
	this.scrollXComp = acomp;
};

AView.prototype.scrollXImplement = function()
{
	var aview = this;
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false;
	
	this.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		
		e.preventDefault();
		
		aview.scrlManagerX.initScroll(e.changedTouches[0].clientX);
	});
	
	this.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerX.updateScroll(e.changedTouches[0].clientX, function(move)
		{
			scrlArea.scrollLeft += move;
			if(aview.scrollXComp) aview.scrollXComp.element.scrollLeft += move;
		});
	});
	
	this.bindEvent(AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerX.scrollCheck(e.changedTouches[0].clientX, function(move)
		{
			scrlArea.scrollLeft += move;
			if(aview.scrollXComp) aview.scrollXComp.element.scrollLeft += move;
			
			return true;
		});
	});
};

AView.prototype.scrollYImplement = function()
{
	var aview = this;
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false;
	
	this.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		
		e.preventDefault();
		
		aview.scrlManagerY.initScroll(e.changedTouches[0].clientY);
	});
	
	this.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerY.updateScroll(e.changedTouches[0].clientY, function(move)
		{
			scrlArea.scrollTop += move;
		});
	});
	
	this.bindEvent(AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerY.scrollCheck(e.changedTouches[0].clientY, function(move)
		{
			scrlArea.scrollTop += move;
			return true;
		});
	});
};


AView.prototype.scrollTopManage = function()
{
	if(this.scrlManagerY) this.scrlManagerY.stopScrollTimer();
	
	return true;
};

AView.prototype.scrollBottomManage = function()
{
	if(this.scrlManagerY) this.scrlManagerY.stopScrollTimer();

	return true;
};

AView.prototype.scrollLeftManage = function()
{
	if(this.scrlManagerX) this.scrlManagerX.stopScrollTimer();
	
	return true;
};

AView.prototype.scrollRightManage = function()
{
	if(this.scrlManagerX) this.scrlManagerX.stopScrollTimer();
	
	return true;
};


AView.prototype.realizeChildren = function(evtListener)
{
	var acomp, className, thisObj = this;
	var container = this.getContainer(), rootView = this.getRootView();
	
	this.$ele.children().each(function()
	{
		className = this.getAttribute(afc.ATTR_CLASS);
		acomp = new window[className]();
		if(acomp) 
		{
			this.container = container;
			this.rootView = rootView;
			
			//parent 변수만 셋팅해야 하므로 setParent 함수를 호출하지 않는다.
			//acomp.setParent(thisObj);
			acomp.parent = thisObj;

			acomp.init(this, evtListener);
		}
	});
};

AView.prototype.viewLoad = function(url)
{
	url = url.replace('.lay', '.html');

	var thisObj = this, aview = null;
	
	//cls 파일 동적 로딩
	if(PROJECT_OPTION.dynamicInc) afc.loadScript(url.replace('.html', '.js'));
	
	afc.loadSync(this.element, url, function(success)
	{
		if(!success) return;
		
		var viewObj = $(this).children();
		
		//AView의 absolute 옵션을 relative로 바꿔준다.
		viewObj.css('position', 'relative');

		var className = viewObj.attr(afc.ATTR_CLASS);
		aview = new window[className]();
		if(aview) 
		{
			aview.owner = thisObj;
			
			viewObj[0].container = thisObj.getContainer();
			viewObj[0].rootView = aview;
			
			aview.init(viewObj[0], aview);
			aview.updatePosition();
		}
	});
	
	this.loadView = aview; 
	return aview;
};

AView.prototype.pageLoad = function(url, pageId)
{
	url = url.replace('.lay', '.html');

	var thisObj = this, apage = null;
	
	//cls 파일 동적 로딩
	if(PROJECT_OPTION.dynamicInc) afc.loadScript(url.replace('.html', '.js'));
	
	afc.loadSync(this.element, url, function(success)
	{
		if(!success) return;
		
		var childContent = $(this).children();
		
		//AView의 absolute 옵션을 relative로 바꿔준다.
		childContent.css('position', 'relative');

		var className = childContent.attr(afc.ATTR_CLASS);
		apage = new window[className]();
		
		apage.owner = thisObj;
		
		apage.setContainerId(pageId);
		apage.init(childContent[0]);
		apage.onReady();
	});
	
	this.loadPage = apage;
	return apage;
};


AView.prototype.getLoadView = function()
{
	return this.loadView;
};

AView.prototype.removeLoadView = function()
{
	if(this.loadView)
	{
		this.loadView.removeFromView();
		this.loadView = null;
	}
};

AView.prototype.setHtml = function(html)
{
	$(this.element).html(html);
};

AView.prototype.findCompById = function(strId)
{
	var ele = document.getElementById(this.className+afc.CLASS_MARK+strId);
	if(ele) return ele.acomp;
	else return null;
};

//return : Array
AView.prototype.findCompByGroup = function(strGroup)
{
	var ret = [];
	$(this.element).find('*[data-group="'+strGroup+'"]').each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

//return : Array
AView.prototype.findCompByClass = function(className)
{
	var ret = [];
	$(this.element).find('*['+afc.ATTR_CLASS+'="'+className+'"]').each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

AView.prototype.addComponent = function(acomp, isPrepend, posComp)
{
	if(!acomp.element) acomp.init();
	
	if(posComp)
	{
		if(isPrepend) acomp.$ele.insertBefore(posComp.element);
		else acomp.$ele.insertAfter(posComp.element);
	}
	else
	{
		if(isPrepend) this.$ele.prepend(acomp.element);
		else this.$ele.append(acomp.element);
	}
	
	acomp.setParent(this);
};

AView.prototype.removeComponent = function(acomp)
{
	acomp.removeFromView();
};

AView.prototype.getChildren = function()
{
	var ret = [];
	this.$ele.children().each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

AView.prototype.removeChildren = function(onlyRelease)
{
	this.$ele.children().each(function()
	{
		if(this.acomp) 
			this.acomp.removeFromView(onlyRelease);
	});
};

AView.prototype.removeFromView = function(onlyRelease)
{
	this.removeChildren(onlyRelease);
	
	AComponent.prototype.removeFromView.call(this, onlyRelease);
};

AView.prototype.setWidth = function(w)
{
	AComponent.prototype.setWidth.call(this, w);
	
	this.updatePosition();
};

AView.prototype.setHeight = function(h)
{
	AComponent.prototype.setHeight.call(this, h);
	
	this.updatePosition();
};

AView.prototype.updatePosition = function(pWidth, pHeight)
{
	//AView 클래스만 다음 비교를 한다.
	if(pWidth && pHeight) 
		AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	var width = this.$ele.width();
	var height = this.$ele.height();

	this.$ele.children().each(function()
	{
		if(this.acomp)
			this.acomp.updatePosition(width, height);
	});
};

//툴바의 inline 기능을 추가
AView.prototype.inlineChildren = function()
{
	var children = this.getChildren();
	
	for(var i=0; i<children.length; i++)
		children[i].setInlineStyle();
};


/*
//스크롤이 있을경우 스크롤을 가운데로 셋팅
AView.prototype.scrollToCenter = function(tHeight)
{
	var tremHeight = 0;
	if(tHeight) tremHeight = tHeight;
	this.element.scrollTop = ((this.element.scrollHeight + tremHeight) - this.element.offsetHeight)/2;
};
*/

AView.prototype.scrollTo = function(pos)
{
	this.element.scrollTop = pos;
};

AView.prototype.scrollOffset = function(offset)
{
	this.element.scrollTop += offset;
};

AView.prototype.scrollToTop = function()
{
	this.element.scrollTop = this.element.scrollHeight*-1;
};

AView.prototype.scrollToBottom = function()
{
	this.element.scrollTop = this.element.scrollHeight;
};

AView.prototype.scrollToCenter = function()
{
	this.element.scrollTop = (this.element.scrollHeight - this.element.offsetHeight)/2;
};

AView.prototype.isMoreScrollTop = function()
{
	if(this.element.scrollTop > 0) return true;
	else return false;	
};

AView.prototype.isMoreScrollBottom = function()
{
	if(this.element.offsetHeight + this.element.scrollTop < this.element.scrollHeight) return true;
	else return false;	
};

AView.prototype.isMoreScrollLeft = function()
{
	if(this.element.scrollLeft > 0) return true;
	else return false;	
};

AView.prototype.isMoreScrollRight = function()
{
	if(this.element.offsetWidth + this.element.scrollLeft < this.element.scrollWidth) return true;
	else return false;
};

AView.prototype.isHscroll = function()
{
	return (this.element.offsetWidth < this.element.scrollWidth);
};

AView.prototype.isVscroll = function()
{
    return (this.element.offsetHeight < this.element.scrollHeight);
};

AView.prototype.isScroll = function()
{
	return (this.isHscroll() || this.isVscroll());
};

AView.prototype.enable = function(isEnable)
{
	this.isEnable = isEnable;
	
	//input tag 도 같이 해줘야 이벤트 전달시 키보드가 오픈을 막을 수 있다.
	if(isEnable) 
	{
		this.$ele.find('input').css('pointer-events', 'auto');
		this.$ele.css('pointer-events', 'auto');
	}
	else 
	{
		this.$ele.find('input').css('pointer-events', 'none');
		this.$ele.css('pointer-events', 'none');
	}
};

AView.prototype.shrinkChildren = function(ratio)
{
	var children = this.getChildren(), acomp, newTop, newHeight, newFontSize, unit;
	
	for(var i=0; i<children.length; i++)
	{
		acomp = children[i];
		
		//afc.log('[' + acomp.$ele.css('bottom') + ']');
		
		//newTop = acomp.getPos().top * ratio;
		//newHeight  = acomp.getHeight() * ratio;
		
		newTop = acomp.getPos().top;
		newHeight  = acomp.getHeight();
		newFontSize = acomp.$ele.css('font-size');
		
		unit = newFontSize.substring(newFontSize.length-2);
		newFontSize = Number(newFontSize.substring(0, newFontSize.length-2));
		
		//afc.log('[' + unit + ']');

		newTop = parseInt(newTop * ratio, 10);
		newHeight = parseInt(newHeight * ratio, 10);
		newFontSize = parseInt(newFontSize * ratio, 10);

		if(acomp.$ele.css('bottom')!='auto') 
		{
			acomp.$ele.css(
			{
				'height': newHeight+'px'
			});
			
			acomp.element.style.setProperty('font-size', newFontSize+unit, 'important');
		}
		else
		{
			acomp.$ele.css(
			{
				'top': newTop+'px',
				'height': newHeight+'px'
			});
			
			acomp.element.style.setProperty('font-size', newFontSize+unit, 'important');
		}
		
		//afc.log('[' + newFontSize+unit + ']');
		
		if(acomp.baseName=='AView') acomp.shrinkChildren(ratio);
	}

};


AView.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	var keyVal, children = this.getChildren(), child;
	for(var i=0; i<children.length; i++)
	{
		child = children[i];
		
		//매핑 타입이 child mapping 이면 자식 컴포넌트 자체에 셋팅된 필드키를 적용한다.
		if(child.mappingType==3) child.updateComponent(queryData);
		else 
		{
			if(!keyArr) continue;
			keyVal = keyArr[i];
			if(keyVal) child.setQueryData(dataArr, [keyVal], queryData);
		}
	}
	
};

AView.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	var keyVal, children = this.getChildren(), child;
	for(var i=0; i<children.length; i++)
	{
		child = children[i];
		
		//매핑 타입이 child mapping 이면 자식 컴포넌트 자체에 셋팅된 필드키를 적용한다.
		if(child.mappingType==3) child.updateQueryData(queryData);
		else 
		{
			keyVal = keyArr[i];
			if(keyVal) child.getQueryData(dataArr, [keyVal], queryData);
		}
	}
	
};

