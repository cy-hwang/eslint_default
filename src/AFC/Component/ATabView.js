/**
 * @author asoocool
 */

function ATabView()
{
	this.delegator = null;
	this.navigator = null;	//ANavigator 에서 탭을 사용할 경우 셋팅
	
    this.tabArea = null;
    this.tabContents = null;
    this.tabBtnTpl = null;
    
	this.isRefresh = false;
    
    this.isAnimation = false;
    this.slideDir = 'left';	//changeAnimation 이 slide 일 경우 사용된다.
    
    this.tabHeight = '65px';
    //this.paddingX = '40px';
    //this.paddingY = '20px';
    this.selectedTab = null;
    //바로 이전에 선택되었던 탭
    this.oldTab = null;
	this.lastSelectedTabId = null;
    
    this.isTabChanging = false;	//탭이 변경되고 있는 중인지
    
    this.option =
    {
        contentReload: false,    //탭이 변경될 경우 컨텐츠를 다시 로드할 지
        changeAnimation: 'slide',    //fade, slide
		sameTabCheck: true
    };
    
    /*
    this.option =
    {
        upTxtColor: '#585858',
        upBgColor: '#d8e1eb',
        downTxtColor: '#2c2c2c',
        downBgColor: '#f0f0f0',
        borderColor: '#a0a0a0',
        tabBgColor: '#eef1fb',
    };
    */
    
    this.txtColors = ['',''];
	this.bgColors = ['',''];
   	this.bgImages = ['',''];
   	this.btnStyles = ['',''];
    
}
afc.extendsClass(ATabView, AComponent);

ATabView.prototype.init = function(context, evtListener)
{
	if(this.navigator) 
	{
		this.element = context;
    	this.element.acomp = this;
    	this.$ele = $(this.element);
    	
    	this.tabArea = $('<div class="ATabView-PageTabArea"></div>');
	    this.tabContents = $('<div class="ATabView-PageContents"></div>');
	    this.tabBtnTpl = $('<span></span>');
	    
	    var container = $(this.element);
	    container.append(this.tabContents, this.tabArea);
	    this.hideTabArea();
	}
	else 
	{
		AComponent.prototype.init.call(this, context, evtListener);
		
		this.tabArea = this.$ele.find('.tabArea');
		this.tabContents = this.$ele.find('.tabContents');
		this.tabBtnTpl = this.tabArea.children().eq(1).clone(); 
		
    	this.tabHeight = this.tabArea.css('height');
		
		var attrArr = this.getAttr(afc.ATTR_COLOR);
		if(attrArr) this.setTextColor(attrArr.split('|'));
		
		attrArr = this.getAttr(afc.ATTR_BGCOLOR);
		if(attrArr) this.setBGColor(attrArr.split('|'));
		
		attrArr = this.getAttr(afc.ATTR_BGIMAGE);
		if(attrArr) this.setBGImage(attrArr.split('|'));
		
		attrArr = this.getAttr(afc.ATTR_STYLE_TAB);
		if(attrArr) this.setBtnStyle(attrArr.split('|'));
		
		/*
		this.option.borderColor = tabArea.css('border-bottom-color');
		
        this.option.downTxtColor = tab.css('color');
        this.option.downBgColor = tab.css('background-color');
    	
    	tab = tabArea.find('span').eq(1);
        this.option.upTxtColor = tab.css('color');
        this.option.upBgColor = tab.css('background-color');
       
       
		this.option.upClass = $(this.element).attr('data-disable-style');
		this.option.downClass = $(this.element).attr('data-select-style');
        */
       
		this.tabArea.children().remove();
        
        if(this.tabArea.css('visibility')=='hidden') this.hideTabArea();
	}

};

ATabView.prototype.setNavigator = function(navigator)
{
	this.navigator = navigator;
};

//----------------------------------------------------------
//	* delegate functions *
//	function beforeTabChanging(oldTab, newTab, reload);
//	function tabChanging(oldTab, newTab, reload);
//	function afterTabChanged(oldTab, newTab, reload);
//----------------------------------------------------------
ATabView.prototype.setDelegator = function(delegator)
{
	this.delegator = delegator;
};

ATabView.prototype.setSlideDir = function(dir)
{
	this.slideDir = dir;
};

ATabView.prototype.enableAnimation = function(enable)
{
	this.isAnimation = enable;
};

ATabView.prototype.setTabOption = function(option)
{
    for(var p in option)
    { 
        if(option[p]!=undefined)
            this.option[p] = option[p];
    }
};

ATabView.prototype.showTabArea = function()
{
	this.tabContents.css('padding-top', this.tabHeight);
    this.tabArea.show();
};

ATabView.prototype.hideTabArea = function()
{
    this.tabArea.hide();
    this.tabContents.css('padding-top', '0px');
};

/*
ATabView.prototype.getTabAreaHeight = function()
{
	if(!this.tabArea.is(":visible")) return 0;
    else return this.tabArea.height();
};
*/

//탭컨트롤 내부에 탭버튼을 추가한다. url 은 탭버튼 클릭시 보여줄 컨텐츠이다. 
ATabView.prototype.addTab = function(tabInfo)//name, url, tabId, data
{
	tabInfo.url = tabInfo.url.replace('.lay','.html');
   
    //탭버튼 템플릿을 복사하여 추가한다.
   	var tabObj = this.tabBtnTpl.clone();
   	tabObj.attr('data-page', tabInfo.url);
   	tabObj.text(tabInfo.name);
   	
    this.tabArea.append(tabObj);

    var content = $('<div></div>');
    content.css(
    {
        display: 'none',
        width: '100%',
        height: '100%',
        overflow: 'auto'
    });
    
    //box-sizing 적용됨. padding-top 만큼이 tabarea 뒤에 숨는다. 
    //this.tabContents.css('padding-top', this.getTabAreaHeight()+'px');
    this.tabContents.append(content);
    
    var tabEle = tabObj[0];
    //탭과 매칭되는 컨텐츠 영역을 저장해 둔다.
    tabEle.content = content[0];
    tabEle.name = tabInfo.name;
    tabEle.tabId = tabInfo.tabId;
    tabEle.data = tabInfo.data;
    tabEle.view = null;
	tabEle.oneshot = tabInfo.oneshot;
    
    //content 내부의 중복 클래스 접근을 위해 고유 아이디를 부여한다.
    if(tabEle.tabId) content.attr('id', this.element.id+'-'+tabEle.tabId);
    
    var thisObj = this;
    AEvent.bindEvent(tabEle, AEvent.ACTION_DOWN, function(e)
    {
		thisObj.lastSelectedTabId = tabEle.tabId;
        thisObj.tabChangeManage(this);
    }); 
    
    
    return tabEle;
};

ATabView.prototype.removeTab = function(tab)
{
    $(tab.content).remove();
    $(tab).remove();
    
    //box-sizing 적용됨. padding-top 만큼이 tabarea 뒤에 숨는다. 
    //this.tabContents.css('padding-top',this.getTabAreaHeight()+'px');
};

/*
ATabView.prototype.setTabPadding = function(paddingX, paddingY)
{
    this.paddingX = paddingX;
    this.paddingY = paddingY;
};
*/

ATabView.prototype.setTabName = function(tab, name)
{
	tab.name = name;
	$(tab).text(name);
};

ATabView.prototype.setTabUrl = function(tab, url, callback)
{
	url = url.replace('.lay','.html');
	$(tab).attr('data-page', url);
	
	this.loadTabContent(tab, callback);
};

ATabView.prototype.selectTab = function(tab)
{
	this.lastSelectedTabId = tab.tabId;
	this.tabChangeManage(tab);
};

ATabView.prototype.clearSelectTab = function()
{
	this.selectedTab = null;
    this.oldTab = null;
	this.lastSelectedTabId = null;
};

ATabView.prototype.removeAllTab = function()
{
	this.clearSelectTab();
	var allTabs = this.getAllTabs();
	for(var i = 0; i<allTabs.length; i++)
	{
		this.removeTab(allTabs[i]);
	}
};

//탭을 순서 번호로 찾아 활성화 한다.
ATabView.prototype.selectTabByIndex = function(index)
{
    var selTab = this.getTabByInx(index);
    
    if(selTab) this.selectTab(selTab);
    return selTab;
};

//탭을 고유 아이디로 찾아 활성화한다. 활성화된 탭을 리턴한다. 찾지 못하면 null
ATabView.prototype.selectTabById = function(tabId)
{
    var selTab = this.getTabById(tabId);
    if(selTab) this.selectTab(selTab);
    return selTab;
};

//탭 아이디로 탭 객체 얻어오기
ATabView.prototype.getLastSelectedTabId = function()
{
    if(this.lastSelectedTabId) return this.lastSelectedTabId;
	else return this.getTabByInx(0).tabId;
};

//탭 아이디로 탭 객체 얻어오기
ATabView.prototype.getTabById = function(tabId)
{
    var retTab = null;
    
    this.tabArea.children().each(function()
    {
        if(this.tabId==tabId) 
        {
            retTab = this;
            return false;   //each callback 리턴
        }
    });
    
    return retTab;
};

//탭 인덱스로 탭 객체 얻어오기
ATabView.prototype.getTabByInx = function(index)
{
    var retTab = null;
    if(index<0) retTab = this.tabArea.children().last()[0];
    else retTab = this.tabArea.children().eq(index)[0];
    
    return retTab;
};

ATabView.prototype.getAllTabs = function()
{
    return this.tabArea.children();
};

ATabView.prototype.getSelectedTab = function()
{
    return this.selectedTab;
};

ATabView.prototype.getSelectedView = function()
{
	if(this.selectedTab) return this.selectedTab.view;
    else return null;
};

ATabView.prototype.tabChangeManage = function(tabEle)
{
	if(this.isTabChanging) return;
	
	if(this.selectedTab === tabEle)
	{
		if(this.option.sameTabCheck) return;
		else 
		{
			this.activeTab(this.selectedTab, this.selectedTab, false);
			//this.activeTab(null, this.selectedTab, false);
			return;
		}
	}

	this.oldTab = this.selectedTab;

	//이전 버튼 비활성
	if(this.oldTab) 
	{
		$(this.oldTab).css(
		{
			'color': this.txtColors[1],
			'background-color': this.bgColors[1],
			'background-image': this.bgImages[1]	
		});
		
		if(this.btnStyles[0]) $(this.oldTab).removeClass(this.btnStyles[0]);
		$(this.oldTab).removeClass('ATabView-select');
		
		if(this.btnStyles[1]) $(this.oldTab).addClass(this.btnStyles[1]);
		$(this.oldTab).addClass('ATabView-diselect');
	}

	this.selectedTab = tabEle;
	
	//현재 버튼 활성화
	$(this.selectedTab).css(
	{
		'color': this.txtColors[0],
		'background-color': this.bgColors[0],
		'background-image': this.bgImages[0]	
	});
	
	if(this.btnStyles[1]) $(this.selectedTab).removeClass(this.btnStyles[1]);
	$(this.selectedTab).removeClass('ATabView-diselect');
	if(this.btnStyles[0]) $(this.selectedTab).addClass(this.btnStyles[0]);
	$(this.selectedTab).addClass('ATabView-select');

	if(!tabEle.content.loaded || this.option.contentReload) 
	{
		var thisObj = this;
		this.loadTabContent(tabEle, function(success)
		{
			if(success) 
				thisObj.activeTab(thisObj.oldTab, thisObj.selectedTab, true);
		});
	}
	else this.activeTab(this.oldTab, this.selectedTab, false);
};

ATabView.prototype.loadTabContent = function(tabEle, callback) 
{
	var thisObj = this;

	//afc.loadSync 함수 내에서 호출해 주고 있음.
	//$(tabEle.content).children().remove();
	
	var tabUrl = $(tabEle).attr('data-page');
	
	//cls 파일 동적 로딩
	if(PROJECT_OPTION.dynamicInc) afc.loadScript(tabUrl.replace('.html', '.js'));

	//$(tabEle.content).load($(tabEle).attr('data-page'), function(response, status, xhr) 
	afc.loadSync(tabEle.content, tabUrl, function(response, status, xhr)
	{
		if (status == 'error') 
		{
			alert('ATabView network error :' + response + ":" + xhr);
			if(callback) callback(false);
		}
		else 
		{
			var childContent = $(this).children();
			
			//AView의 absolute 옵션을 relative로 바꿔준다.
			childContent.css('position', 'relative');
			
			//탭뷰를 네비게이터로 사용하도록 설정한 경우
			if(thisObj.navigator)
			{
				var pageClass = childContent.attr(afc.ATTR_CLASS);
				var apage = new window[pageClass]();
				
				thisObj.navigator.bindDelegator(tabEle, apage);
				apage.init(childContent[0]);
			}
			else
			{
				var className = childContent.attr(afc.ATTR_CLASS);
				var aview = new window[className]();
				if(aview) 
				{
					tabEle.view = aview;
					aview.tab = tabEle;
					aview.owner = thisObj;
					
					childContent[0].container = thisObj.getContainer();
					childContent[0].rootView = aview;
					aview.init(childContent[0], aview);
				}
			}
			
			tabEle.content.loaded = true;
			if(callback) callback(true);
		}
	});

};

//탭활성화 관련 처리, reload : 컨텐츠를 새롭게 다시 로드했는지
ATabView.prototype.activeTab = function(oldTab, newTab, reload) 
{
	this.isTabChanging = true;
	$('body').css('pointer-events', 'none');
	
	var thisObj = this, oldView = null, newView = null;

	//네이게이터용 탭뷰와 일반 탭뷰를 구별하여 뷰를 얻어온다. 
	if(this.navigator) 
	{
		if(oldTab) oldView = oldTab.data.view;
		newView = newTab.data.view;
	}
	else 
	{
		if(oldTab) oldView = oldTab.view;
		newView = newTab.view;
	}

	//IOS UIWebOverflowContentView BugFix	
	if(afc.isIos) afc.enableApp(false);
	
	//---------------------------------------------------------------------------
	//	나중에 액티브될 경우 이벤트가 전달되지 않도록 사라질 때 disable 상태로 만든다.
	
	if(oldView && oldView.isActiveActionDelay) oldView.enable(false);
	
	if (this.delegator && this.delegator.beforeTabChanging)
		this.delegator.beforeTabChanging(oldTab, newTab, reload);

	//최초 액티브될 경우 이벤트가 전달되지 않도록 disable 시켜둔다.
	if(reload && newView.isActiveActionDelay) newView.enable(false);
	//-----------------------------------------------------------------------------
	
	if(this.isAnimation)
	{
		switch(this.option.changeAnimation) 
		{
			case 'slide':
			{
				if(oldTab) $(oldTab.content).addClass('slide-out-'+this.slideDir);
				
				var newContent = $(newTab.content);
	           	newContent.show();
				newContent.addClass('slide-in-'+thisObj.slideDir);
	           	 
	           	newContent.one('webkitAnimationEnd', function()
	           	{
	        		if(oldTab) 
	        		{
	        			$(oldTab.content).removeClass('slide-out-'+thisObj.slideDir);
	        			$(oldTab.content).hide();
	        		}
	        		
	            	newContent.removeClass('slide-in-'+thisObj.slideDir);
	            	
	            	_effectCallback();
	           	});
			}
			break;

			case 'fade':
			{
				if(oldTab) $(oldTab.content).hide();

				$(newTab.content).fadeIn('fast', _effectCallback);
			}
			break;

			default:
			{
				if(oldTab) $(oldTab.content).hide();
					
				$(newTab.content).show('fast', _effectCallback);
			}
			break;
		}
		
		//자체적으로 호출하므로 effectCallback 을 호출하지 않는다.
		_showCallback(false);
	}

	//에니메이션 효과가 없는 경우
	else
	{
		if(oldTab) $(oldTab.content).hide();
		
		var newContent = $(newTab.content);
		newContent.show();
		
		_showCallback(true);
	}
	
	function _showCallback(isEffectCallback)
	{
		//화면이 보여진 후, 위치를 계산해 준다.
		//if(reload) newView.updatePosition();
		//asoocool animation bug
		newView.updatePosition();
			
		if(thisObj.delegator && thisObj.delegator.tabChanging)
			thisObj.delegator.tabChanging(oldTab, newTab, reload);
			
		if(isEffectCallback) setTimeout(_effectCallback, 1);
	}

	function _effectCallback() 
	{
		if(thisObj.delegator && thisObj.delegator.afterTabChanged)
			thisObj.delegator.afterTabChanged(oldTab, newTab, reload);
		
		//이전 탭에서 터치한 정보가 전달되지 안도록 
		//disable 상태에서 잠시 딜레이를 준 후 enable 시켜준다.
		
		if(newView.isActiveActionDelay)
			setTimeout(function() { newView.enable(true); }, afc.DISABLE_TIME);
		
		//IOS UIWebOverflowContentView BugFix
		if(afc.isIos) setTimeout(function() { afc.enableApp(true); }, afc.TOUCH_DELAY_TIME);

		if(oldTab && oldTab.oneshot) 
		{
			$(oldTab.content).children().remove();
			oldTab.content.loaded = false;
		}
		
		
		thisObj.isTabChanging = false;
		$('body').css('pointer-events', 'auto');
	}
};

ATabView.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	if(this.selectedTab)
	{
		var aview = null;
		if(this.navigator) 
		{
			if(this.selectedTab.data)
				aview = this.selectedTab.data.view;
		}
		else aview = this.selectedTab.view;
		
		if(aview) aview.updatePosition();
	}
};


ATabView.prototype.setTextColor = function(colors)
{
	this.txtColors = colors;
};

ATabView.prototype.setBGColor = function(colors)
{
	this.bgColors = colors;
};

ATabView.prototype.setBGImage = function(images)
{
	this.bgImages = images;
};

ATabView.prototype.setBtnStyle = function(styles)
{
	if(this.btnStyles)
	{
		this.removeClass(this.btnStyles[0]);
		this.removeClass(this.btnStyles[1]);
		this.removeClass(this.btnStyles[2]);
	}
	
	this.btnStyles = styles;
};

ATabView.prototype.changeBtnState = function(oldState, newState)
{
	this.setStyle('color', this.txtColors[newState]);
	this.setStyle('background-color', this.bgColors[newState]);
	this.setStyle('background-image', this.bgImages[newState]);
	
	/*
	if(this.txtColors[newState]) this.element.style.setProperty('color', this.txtColors[newState], 'important');
	if(this.bgColors[newState]) this.element.style.setProperty('background-color', this.bgColors[newState], 'important');
	
	if(this.bgImages[newState]) this.element.style.setProperty('background-image', this.bgImages[newState], 'important');
	else this.element.style.setProperty('background-image', '', 'important');
	*/
	
	//최초 초기화 하는 경우
	if(oldState<0)
	{
		if(this.btnStyles[newState]) this.addClass(this.btnStyles[newState]);
		this.addClass('AButton-'+afc.BTN_STATE[newState]);
	}
	else
	{
		if(this.isStyleOver)
		{
			if(newState>AButton.NORMAL && this.btnStyles[newState]) this.addClass(this.btnStyles[newState]);
			if(oldState>AButton.NORMAL && this.btnStyles[oldState]) this.removeClass(this.btnStyles[oldState]);
		}
		else
		{
			if(this.btnStyles[newState]) this.addClass(this.btnStyles[newState]);
			if(this.btnStyles[oldState]) this.removeClass(this.btnStyles[oldState]);
		}
		
		this.removeClass('AButton-'+afc.BTN_STATE[oldState]);
		this.addClass('AButton-'+afc.BTN_STATE[newState]);
	}
};

