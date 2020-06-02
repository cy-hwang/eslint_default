
/**
 * @author asoocool
 */

function ANavigator(owner)
{
    this.owner = owner;
    this.tabView = null;
    
    this.pageHistory = new Array();
	this.historyPop = new Array();	//히스토리 팝업용
	
    this.curHisIndex = -1;
    this.pageData = null;
    this.indicator = null;
    this.slideDir = 'left';
    
    this.pageInfo = {};
}

ANavigator.prototype.init = function(appContainer, indicator)
{
    this.indicator = indicator;
    
    //실제 내용이 들어갈 탭 컨트롤 생성
    this.tabView = new ATabView();
    this.tabView.setDelegator(this);
    this.tabView.setNavigator(this);	//탭을 네비게이터로 사용하도록 셋팅
    
    this.tabView.init(appContainer);
    
    //탭버튼은 숨긴다. 네이게이터가 셋팅되면 자동 숨겨짐
    //this.tabView.hideTabArea();
};

ANavigator.prototype.initWithTabview = function(tabView, indicator)
{
	this.tabView = tabView;
	this.indicator = indicator;
};		

//url 은 필수.
ANavigator.prototype.registerPage = function(url, pageId, pageName, option)
{
	var tId = null;
	
	if(!option) option = {};
	
	if(pageId)
	{
		var infoArray = this.pageInfo[pageId];
		var newInfo = { tabId: pageId+'_0', cond: option.cond };
		
		if(!infoArray) 
		{
			infoArray = new Array();
			this.pageInfo[pageId] = infoArray;
		}
		else newInfo.tabId = pageId+'_'+infoArray.length;
		
		infoArray.push(newInfo);
		
		tId = newInfo.tabId;
	}
	
    this.tabView.addTab(
    {
        name: pageName,
        url: url,
        tabId: tId,
        data: null,
		oneshot: option.oneshot
    });
};

//cond 옵션을 비교하여 tabId 를 리턴한다.
ANavigator.prototype.getCondTabId = function(pageId)
{
	var infoArray = this.pageInfo[pageId];
	if(!infoArray) return '';
	
	var obj;
	for(var i=0; i<infoArray.length; i++)
	{
		obj = infoArray[i];
		if(obj.cond)
		{
			if( (!obj.cond.width || screen.width==obj.cond.width) && 
				(!obj.cond.height || screen.height==obj.cond.height) ) return obj.tabId;
		}
	}
	
	return obj.tabId;
};

/*
ANavigator.prototype.pushHistory = function(tab)
{
	this.curHisIndex++;
    //히스토리상의 중간이었으면 
    //새로 이동한 페이지를 마지막으로 셋팅하고 나머지는 잘라낸다.
    this.pageHistory.length = this.curHisIndex; 
    this.pageHistory.push(tab);

	//히스토리 팝업 저장
	for(var i = 0; i <= this.historyPop.length; i++)
	{
		//중복 처리
		if(this.historyPop[i])	//최초일 시 검사 안함
		{
			if(this.historyPop[i].name == tab.name)	//중복일시 삭제
				this.historyPop.splice(i, 1);
			else if(tab.name == '국내종합' || tab.name == '해외종합' || tab.name == '뉴스종합')	//국내/해외/뉴스 HOME하나로 취급함
				if(this.historyPop[i].name == '국내종합' || this.historyPop[i].name == '해외종합' || this.historyPop[i].name == '뉴스종합')
					this.historyPop.splice(i, 1);
		}
				
	}
	this.historyPop.push(tab);
};
*/

ANavigator.prototype.pushHistory = function(tab)
{
	this.curHisIndex++;
    //히스토리상의 중간이었으면 
    //새로 이동한 페이지를 마지막으로 셋팅하고 나머지는 잘라낸다.
    this.pageHistory.length = this.curHisIndex; 
    this.pageHistory.push(tab);
	
	//히스토리 팝업 저장
	var hPop;
	for(var i = 0; i < this.historyPop.length; i++)
	{
		hPop = this.historyPop[i];

		//중복 체크
		if(hPop.name == tab.name || (tab.tabId.slice(0, 1)=='0' && hPop.tabId.slice(0, 1)=='0') )	
		{
			this.historyPop.splice(i, 1);
			break;
		}
	}

	this.historyPop.push(tab);
};

ANavigator.prototype.goPage = function(pageId, isAni, data, isNoHistory)
{
	var tab = null;
	
	this.pageData = data;
	
	if(this.indicator) this.indicator.show(-1, -1);
	
	this.tabView.enableAnimation(isAni);
	this.tabView.setSlideDir(this.slideDir);
	
	if(typeof(pageId)=="string") tab = this.tabView.selectTabById(this.getCondTabId(pageId));
	else if(typeof(pageId)=="number") tab = this.tabView.selectTabByIndex(pageId);
    else 
    {
    	alert('type error!');
    	return;
    }
    
    if(!isNoHistory) this.pushHistory(tab);
	
};

ANavigator.prototype.goPrevPage = function(isAni, data)
{
	if(this.canGoPrev())
	{
		if(this.indicator) this.indicator.show(-1, -1);
		
		this.pageData = data;
		this.curHisIndex--;
		var tab = this.pageHistory[this.curHisIndex];
		
		this.tabView.enableAnimation(isAni);
		this.tabView.setSlideDir('right');
		this.tabView.selectTab(tab);
		return true;
	}
	
	return false;
};

ANavigator.prototype.goNextPage = function(isAni, data)
{
	if(this.canGoNext())
	{
		if(this.indicator) this.indicator.show(-1, -1);
		
		this.pageData = data;
		this.curHisIndex++;
		var tab = this.pageHistory[this.curHisIndex];
		
		this.tabView.enableAnimation(isAni);
		this.tabView.setSlideDir('left');
		this.tabView.selectTab(tab);
		return true;
	}
	
	return false;
};

ANavigator.prototype.getActivePage = function()
{
    var tab = this.tabView.getSelectedTab();
    if(tab) return tab.data;
    
    return null;
};

ANavigator.prototype.getActiveTab = function()
{
    var tab = this.tabView.getSelectedTab();
    if(tab) return tab;
    
    return null;
};


ANavigator.prototype.getPage = function(pageId)
{
	var tab = null;
		
	if(typeof(pageId)=="string") tab = this.tabView.getTabById(this.getCondTabId(pageId)); 
	else if(typeof(pageId)=="number") tab = this.tabView.getTabByInx(pageId);
		
    if(tab) return tab.data;
    else return null;
};

ANavigator.prototype.canGoPrev = function()
{
	return (!this.tabView.isTabChanging && this.curHisIndex>0);
};

ANavigator.prototype.canGoNext = function()
{
	return (!this.tabView.isTabChanging && this.curHisIndex<this.pageHistory.length-1);
};

ANavigator.prototype.clearHistory = function()
{
	this.pageHistory.length = 0;
	this.curHisIndex = -1;
};


//ATabView.js 참조
ANavigator.prototype.bindDelegator = function(tab, delegator) //delegator is class APage
{
    if(tab) 
    {
    	//pageid_2 -> pageid 만 추출
    	if(tab.tabId) delegator.setContainerId(tab.tabId.split('_')[0]);
    	
    	delegator.navigator = this;
    	tab.data = delegator;
    }
};

//fade, slide
ANavigator.prototype.setChangeAnimation = function(ani)
{
	this.tabView.setTabOption({changeAnimation:ani});
};

ANavigator.prototype.setSlideDir = function(dir)
{
	this.slideDir = dir;
};

//------------------------------------------------
//	ATabView delegate functions
//------------------------------------------------
ANavigator.prototype.beforeTabChanging = function(oldTab, newTab, reload)
{
	if(oldTab) oldTab.data.onWillDeactive();

	if(newTab) 
	{
		//goPage 호출시 넘어온 data 를 셋팅한다.
		newTab.data.pageData = this.pageData;
		
		//tab 에 추가된 html 파일의 로드가 완료되면
		if(reload) newTab.data.onReady();

		newTab.data.onWillActive(reload);
	}
};

ANavigator.prototype.tabChanging = function(oldTab, newTab, reload) 
{ 
	if(oldTab) oldTab.data.onDeactive();
	if(newTab) newTab.data.onActive(reload);
};
        
ANavigator.prototype.afterTabChanged = function(oldTab, newTab, reload)
{
    if(oldTab) oldTab.data.onDeactiveDone();
    if(newTab) newTab.data.onActiveDone(reload);
};

