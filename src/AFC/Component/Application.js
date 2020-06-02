/**
 * @author asoocool
 */

function Application()
{
	this.navigator = null;
	//this.indicator = null;
	this.orientation = 'portrait';
	
	this.appContainer = null;
	this.resPool = null;
}

Application.prototype.onReady = function()
{
	//필요시 동적으로 생성하기
	//this.resPool = new ResPool();
	
	//this.indicator = new AIndicatorBar();
	//this.indicator.create();
	
	this.navigator = new ANavigator(this);
	
	this.appContainer = document.getElementById('page_navigator');
    this.navigator.init(this.appContainer, null);
    
    var thisObj = this;
    window.addEventListener('orientationchange', function()
    {
    	var page = thisObj.navigator.getActivePage();
    	if(!page) return;
    	
      	switch (window.orientation) 
      	{
        	case 0: //portrait
        	case 180:
        		thisObj.orientation = 'portrait';
        		page.onOrientationChange('portrait');
          	break;
          	
        	case 90: 
        	case -90: //landscape
        		thisObj.orientation = 'landscape';
        		page.onOrientationChange('landscape');
          	break;
          	
        	default:
	            //viewport.setAttribute('content', 'width=' + vpwidth + ', initial-scale=0.25, maximum-scale=1.0;')
          	break;
      	}
        
    }, false);

    window.addEventListener('resize', function()
    {
		//var $focus = $(':focus');
		//if($focus.length>0) return;
		AWindow.resizeWindow();
    	
    	var page = thisObj.navigator.getActivePage();
    	if(!page) return;

   		page.onResize();
    });
   	
};

//android 의 백키 터치시 기본적으로 처리해 줘야 할 것들. 
//true를 리턴하면 받는 곳에서 아무처리도 하지 않도록 한다.
Application.prototype.onBackKeyManage = function()
{
    if(AWindow.reportBackKeyEvent()) return true;
    
    /*
    if(this.navigator.canGoPrev())
    {
        this.navigator.goPrevPage(true);
        return true;
    }
    */
   
   	var page = this.navigator.getActivePage();
   	if(page && page.onBackKey()) return true;
       
    return false;
};

Application.prototype.getOrientation = function()
{
	return this.orientation;
};

Application.prototype.getCurrentPage = function()
{
	return this.navigator.getActivePage();
};

