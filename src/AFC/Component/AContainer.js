/**
 * @author asoocool
 */

function AContainer(containerId)	//필요시만 셋팅
{
	//view 의 기능을 사용하기 위해 
	this.view = null; //AView
	
	this.containerId = containerId;	//컨테이너를 구분 짓는 아이디(APage, AWindow)
	
    //this.element = null;		//dom tree object
    //this.$ele = null;			//jQuery object
    
   	//같은 컨테이너를 여러 윈도우가 disable 시킬 수 있으므로 레퍼런스 카운팅을 한다.
	this.disableCount = 0;
}

AContainer.prototype.init = function(context)
{
	context.container = this;
	
	context.preventEvent = true;
	
	//뷰의 기능을 사용하기위해 변수를 생성하지만 
	//대표자는 자신으로 한다.
	context.rootView = this.view = new AView(this);
	this.view.init(context, this);
	
    //this.element = this.view.element;
    //this.$ele = this.view.$ele;
};

//컨테이너의 리소스 로드가 완료되면 호출, 최초 한번만 호출된다.
//리소스는 로드됐지만 컨테이너가 보여지진 않는다. 
AContainer.prototype.onReady = function()
{
};

//onReady 후에 호출되며 페이지 활성화가 시작되기 바로 전에 매번 호출된다.
AContainer.prototype.onWillActive = function(reload) 
{
};

//onWillActive 후에 호출되며 페이지 활성화가 시작되면 매번 호출된다. 
AContainer.prototype.onActive = function(reload) 
{
};

//onActive 이후 컨테이너 활성화 과정이 모두 종료되면 매번 호출된다.
//hide, show 의 에니메이션이나 특정 이펙트가 완전히 종료된 후 호출
AContainer.prototype.onActiveDone = function(reload) 
{
};

AContainer.prototype.onWillDeactive = function() 
{
};

AContainer.prototype.onDeactive = function() 
{
};

AContainer.prototype.onDeactiveDone = function() 
{
};

//Application 이 Background 로 이동하는 경우
AContainer.prototype.onAppPause = function() 
{
};

//Application 이 Foreground 로 이동하는 경우
AContainer.prototype.onAppResume = function()
{
};

//-------------------------------------------------------------------

AContainer.prototype.onOrientationChange = function(info)
{
	this.updatePosition();
};

AContainer.prototype.onBackKey = function()
{
	return false;
};

AContainer.prototype.onResize = function()
{
	this.updatePosition();
};

AContainer.prototype.updatePosition = function(pWidth, pHeight)
{
	if(this.view) this.view.updatePosition(pWidth, pHeight);
};
//----------------------------------------------------------------------

AContainer.prototype.addComponent = function(acomp, isPrepend, insComp)
{
	if(this.view) this.view.addComponent(acomp, isPrepend, insComp);
};

AContainer.prototype.findCompById = function(strId)
{
	return this.view.findCompById(strId);
};

AContainer.prototype.findCompByGroup = function(strGroup)
{
	return this.view.findCompByGroup(strGroup);
};

AContainer.prototype.getWidth = function()
{
	return this.view.getWidth();
};

AContainer.prototype.getHeight = function()
{
	return this.view.getHeight();
};

AContainer.prototype.setWidth = function(width)
{
	this.view.setWidth(width);
};

AContainer.prototype.setHeight = function(height)
{
	this.view.setHeight(height);
};

//deprecated
AContainer.prototype.setId = function(containerId)
{
	this.containerId = containerId;
};
//deprecated
AContainer.prototype.getId = function()
{
	return this.containerId;
};

AContainer.prototype.setContainerId = function(containerId)
{
	this.containerId = containerId;
};

AContainer.prototype.getContainerId = function()
{
	return this.containerId;
};

AContainer.prototype.getElement = function()
{
    return this.view.element;
};

AContainer.prototype.get$ele = function()
{
	return this.view.$ele;	
};

AContainer.prototype.isValid = function()
{
	return (this.view!=null);
};

AContainer.prototype.toString = function()
{
	var ret = '\n{\n', value;
    for(var p in this) 
    {
        if(!this.hasOwnProperty(p)) continue;
        
        value = this[p];
        
        if(typeof(value) == 'function') continue;
        
        else if(value instanceof HTMLElement)
        {
        	if(afc.logOption.compElement) ret += '    ' + p + ' : ' + $(value)[0].outerHTML + ',\n';
        	else ret += '    ' + p + ' : ' + value + ',\n';
        }
        else if(value instanceof Object) ret += '    ' + p +' : ' + value.constructor.name + ',\n';
		else ret += '    ' + p + ' : ' + value + ',\n';
    }
    ret += '}\n';
    
    return ret;
};

AContainer.prototype.actionDelay = function(filter)
{
	if(this.view) this.view.actionDelay(filter);
};

AContainer.prototype.enable = function(isEnable)
{
	if(this.view) this.view.enable(isEnable);
};

