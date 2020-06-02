/**
 * @author asoocool
 */

var afc = 
{
    BTN_STATE: ['normal', 'touch', 'disable'],
    CHECK_STATE: ['check', 'normal'],
    
    ATTR_BASE: 'data-base',
    ATTR_CLASS: 'data-class',
    ATTR_COLOR: 'data-color',               //텍스트 색상
    ATTR_GROUP: 'data-group',
    
    ATTR_BGCOLOR: 'data-bgcolor',  			//배경 색상
    ATTR_BGIMAGE: 'data-bgimage',  			//배경 이미지
    ATTR_STYLE: 'data-style',           	//스타일
    ATTR_STYLE_TAB: 'data-style-tab',       //탭 버튼 스타일
    ATTR_DEFAULT: 'data-default',           //라디오버튼(초기셀렉트 아이디)
    
    ATTR_LISTENER: 'data-listener',
    ATTR_QUERY_NAME: 'data-query-name',
    ATTR_RESP: 'data-responsive',
	ATTR_MASK: 'data-mask',
	ATTR_COLOR: 'data-color',
    
    CLASS_MARK: '--',
    CMARK_LEN: 2,
    
    MASK_NONE: 0,
    MASK_MONEY: 1,
	MASK_FLOAT: 2,

	DISABLE_TIME: 500,
	TOUCH_DELAY_TIME: 300
	
};

afc.ClassName =
{
    LABEL:'ALabel',
    BUTTON:'AButton',
    CHECKBOX:'ACheckBox',
    RADIOGROUP:'ARadioGroup',
    RADIOBUTTON:'ARadioButton',
    TEXTFIELD:'ATextField',
    TEXTAREA:'ATextArea',
    DROPBOX:'ADropBox',
    SELECTBOX:'ASelectBox',
    GRID:'AGrid',
    SWITCHBUTTON:'ASwitchButton',
    IMAGE:'AImage',
    CANVAS:'ACanvas',
    PROGRESS : 'AProgress',
    SLIDER : 'ASlider',
    DATEPICKER : 'ADatePicker',
    TIMEPICKER : 'ATimePicker',
    
    VIEW:'AView',
    LISTVIEW:'AListView',
    TABVIEW:'ATabView',
    WEBVIEW:'AWebView',
    
    //TITLEBAR:'ATitleBar',
    TOOLBAR:'AToolBar',
    
    PAGE:'APage',
    WINDOW: 'AWindow',
    APPLICATION: 'Application'
    
};

afc.ACTION_DOWN = 'touchstart';
afc.ACTION_MOVE = 'touchmove';
afc.ACTION_UP = 'touchend';

afc.COMP_CTX = {};

afc.COMP_CTX.defEvents = ['actiondown', 'actionmove', 'actionup'];

//라벨
afc.COMP_CTX[afc.ClassName.LABEL] = 
{
    tag:'<span data-base="ALabel" data-class="ALabel" data-flag="0001" class="ALabel-Style"><span>Label</span></span>',

    defStyle: 
    {
        width:'100px', height:'25px'
    },

    events: []
};

//버튼
afc.COMP_CTX[afc.ClassName.BUTTON] = 
{
	
    //tag:'<span data-base="AButton" data-class="AButton" data-flag="0001" data-state="0" class="AButton-Style AButton-normal"><span>Button</span></span>',
    tag:'<Button data-base="AButton" data-class="AButton" data-flag="0001" data-state="0" class="AButton-Style AButton-normal">Button</Button>',

    defStyle: 
    {
    	width:'120px', height:'40px' 
    },
   
    events: ['click', 'longtab', 'drop', 'dragStart', 'dragEnd']
};
    
//체크박스
afc.COMP_CTX[afc.ClassName.CHECKBOX] =  
{
    tag:'<span data-base="ACheckBox" data-class="ACheckBox" data-flag="0001" class="ACheckBox-Style checkbox-normal">CheckBox</span>',
    
    defStyle: 
    {
        width:'180px', height:'40px' 
    },

    events: ['click']
};

//라디오 버튼
afc.COMP_CTX[afc.ClassName.RADIOBUTTON] =   
{
    tag:'<span data-base="ARadioButton" data-class="ARadioButton" data-flag="0001" class="ARadioButton-Style radiobtn-normal">RadioButton</span>',
    
    defStyle: 
    {
        width:'200px', height:'40px'
    },

    events: ['click']
};

//라디오 그룹
afc.COMP_CTX[afc.ClassName.RADIOGROUP] =    
{
    tag: '<div data-base="ARadioGroup" data-class="ARadioGroup" data-flag="1011" class="ARadioGroup-Style"></div>',

    defStyle: 
    {
        width:'400px', height:'200px' 
    },

    events: ['change']
};

//텍스트필드
afc.COMP_CTX[afc.ClassName.TEXTFIELD] = 
{
    tag: '<input data-base="ATextField" data-class="ATextField" data-flag="0001" type="text" value="Text" class="ATextField-Style"/>',
        
    defStyle: 
    {
        width:'100px', height:'25px'  
    },

    events: ['change', 'focus', 'blur']
};

//슬라이더
afc.COMP_CTX[afc.ClassName.SLIDER] = 
{
    tag: '<input data-base="ASlider" data-class="ASlider" data-flag="0001" type="range" min="0" max="100" value="25" step="1" class="ASlider-Style"/>',

    defStyle: 
    {
        width:'100px', height:'25px' 
    },
    
    events: ['change']
};

//텍스트 Area
afc.COMP_CTX[afc.ClassName.TEXTAREA] = 
{
    tag: '<textarea data-base="ATextArea" data-class="ATextArea" data-flag="0001" class="ATextArea-Style"></textarea>',

    defStyle: 
    {
        width:'200px', height:'150px'
    },

    events: ['focus', 'change', 'blur']
};

//드롭박스
afc.COMP_CTX[afc.ClassName.DROPBOX] = 
{
    tag: '<div data-flag="0001" data-base="ADropBox" data-class="ADropBox" class="ADropBox-Style">'+
            '<input type="text" class="dropboxLabel" value="Text"/><span class="dropboxButton"></span></div>',

    defStyle: 
    {
        width:'240px', height:'40px'
    },

    events: ['click', 'select', 'change']
};

//셀렉트 박스
afc.COMP_CTX[afc.ClassName.SELECTBOX] = 
{
    tag: '<select data-base="ASelectBox" data-class="ASelectBox" data-flag="0001" class="ASelectBox-Style"><option value="value1">item1</option></select>',

    defStyle: 
    {
        width:'200px', height:'30px'
    },

    events: ['change']
};

//그리드컨트롤
afc.COMP_CTX[afc.ClassName.GRID] = 
{
    tag: '<div data-base="AGrid" data-class="AGrid" data-flag="0001" class="AGrid-Style" data-selectable="true">'+
            '<table cellpadding="0" align="center" style="width:100%; border-collapse:collapse;" class="main-prop">'+
            	'<colgroup><col /><col /><col /></colgroup>'+
                '<thead align="center" class="head-prop">'+
                    '<tr height="40px"><td>col1</td><td>col2</td><td>col3</td></tr></thead>'+
                '<tbody align="center" class="body-prop">'+
                    '<tr height="40px" class="normal-prop"><td></td><td></td><td></td></tr></tbody></table></div>',
    
    defStyle: 
    {
        width:'400px', height:'300px'
    },
    
    events: ['longtab', 'select', 'scrolltop', 'scrollbottom']
};

//스위치 버튼
afc.COMP_CTX[afc.ClassName.SWITCHBUTTON] =
{
    tag: '<div data-base="ASwitchButton" data-class="ASwitchButton" data-flag="0001" class="ASwitchButton-Style switch-back-off"><span class="switch-bar-off"></span></div>',
    
    defStyle: 
    {
        width:'80px', height:'40px'
    },

    events: ['change']
};

//이미지
afc.COMP_CTX[afc.ClassName.IMAGE] = 
{
    tag: '<span data-base="AImage" data-class="AImage" data-flag="0001" class="AImage-Style -chiron-aimage"></span>',
    
    defStyle: 
    {
        width:'170px', height:'120px' 
    },

    events: []
};

//캔버스
afc.COMP_CTX[afc.ClassName.CANVAS] = 
{
    tag: '<canvas data-base="ACanvas" data-class="ACanvas" data-flag="0001" class="ACanvas-Style"></canvas>',

    defStyle: 
    {
        width:'400px', height:'400px'
    },

    events: []
};

//프로그레스
afc.COMP_CTX[afc.ClassName.PROGRESS] = 
{
    tag: '<div data-base="AProgress" data-class="AProgress" data-flag="0001" class="AProgress-Style"><div></div></div>',

    defStyle: 
    {
        width:'200px', height:'20px' 
    },

    events: []
};

//데이트피커
afc.COMP_CTX[afc.ClassName.DATEPICKER] = 
{
    tag: '<input data-base="ADatePicker" data-class="ADatePicker" data-flag="0001" type="text" class="ADatePicker-Style"/>',

    defStyle: 
    {
        width:'100px', height:'25px'  
    },

    events: ['change']
};

//타임피커
afc.COMP_CTX[afc.ClassName.TIMEPICKER] = 
{
    tag: '<input data-base="ATimePicker" data-class="ATimePicker" data-flag="0001" type="text" class="ATimePicker-Style"/>',

    defStyle: 
    {
        width:'100px', height:'25px'  
    },

    events: ['change']
};

//뷰
afc.COMP_CTX[afc.ClassName.VIEW] = 
{
    tag: '<div data-base="AView" data-class="AView" data-flag="1011" class="AView-Style"></div>',

    defStyle: 
    {
        width:'400px', height:'200px'
    },

    //events: ['swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom', 'drop', 'dragStart', 'dragEnd' ]
    events: ['swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom', 'drop', 'dragStart', 'dragEnd' ]
};

//페이지
afc.COMP_CTX[afc.ClassName.PAGE] = 
{
    tag: '<div data-base="APage" data-class="APage" data-flag="1110" class="APage-Style"></div>',

    defStyle: 
    {
        width:'100%', height:'100%'
    },

    events: []
};

//윈도우
afc.COMP_CTX[afc.ClassName.WINDOW] = 
{
    tag: '<div data-base="AWindow" data-class="AWindow" data-flag="1111" class="AWindow-Style"></div>',

    defStyle: 
    {
        width:'300px', height:'300px'
    },

    events: []
};

//리스트 뷰
afc.COMP_CTX[afc.ClassName.LISTVIEW] = 
{
    tag: '<div data-base="AListView" data-class="AListView" data-flag="0001" class="AListView-Style">'+
            '<div class="listview_row"></div><div class="listview_row AListView-select"></div><div class="listview_row" ></div><div class="listview_row"></div></div>',

    defStyle: 
    {
        width:'380px', height:'270px'
    },

    events: ['select', 'scrolltop', 'scrollbottom', 'drop']
};

//탭 뷰
afc.COMP_CTX[afc.ClassName.TABVIEW] = 
{
    tag: '<div data-base="ATabView" data-class="ATabView" data-flag="0001" class="ATabView-Style" data-state="0" >'+
    		'<div class="tabContents" style="padding-top:65px;"></div>'+
	        '<div class="tabArea" style="height: 65px;">'+
	            '<span class="ATabView-select" style="width:110px; line-height: 65px;">tab1</span>'+
	            '<span class="ATabView-diselect" style="width:110px; line-height: 65px;">tab2</span>'+
	            '<span class="ATabView-diselect" style="width:110px; line-height: 65px;">tab3</span></div>'+
	      '</div>',

    defStyle: 
    {
        width:'380px', height:'240px'
    },

    events: ['swipe']
};

//웹 뷰
afc.COMP_CTX[afc.ClassName.WEBVIEW] = 
{
    tag: '<div data-base="AWebView" data-class="AWebView" data-flag="0001" class="AWebView-Style"><iframe frameborder="0" scrolling="auto"></iframe></div>',
    
    defStyle: 
    {
        width:'400px', height:'200px'
    },

    events: []
};

/*
//타이틀바
afc.COMP_CTX[afc.ClassName.TITLEBAR] = 
{
    tag: '<div data-base="ATitleBar" data-class="ATitleBar" data-flag="1011" class="ATitleBar-Style"></div>',

    defStyle: 
    {
        width:'100%', height:'90px'
    },
    
    events: []
};
*/

//툴바
afc.COMP_CTX[afc.ClassName.TOOLBAR] = 
{
    tag: '<div data-base="AToolBar" data-class="AToolBar" data-flag="1011" data-gap="20px" class="AToolBar-Style"></div>',

    defStyle:
    {
        width:'100%', height:'90px'
    },

    events: ['scroll', 'scrollleft', 'scrollright', 'drop']
};



//--------------------------------------------------------------------------------------------
// About Log
//--------------------------------------------------------------------------------------------

afc.disableLog = function()
{
	afc.log = function() { return ''; };
	console.log = function() {};
};

afc.logFilter = 'ChironStudio';
afc.logOption = 
{
	compElement: false,
};

afc.log = function(msg)
{
	var logMsg = '';
	
	if(msg instanceof AComponent || msg instanceof AContainer) logMsg = msg.toString(); 
	else if(msg instanceof HTMLElement) logMsg = $(msg)[0].outerHTML;
	else if(msg instanceof Object) logMsg = afc.stringifyOnce(msg, undefined, 4);
	else logMsg = msg;
	
	logMsg = afc.logFilter + ' => ' + logMsg;
	console.log(logMsg);
	
	if(afc.isIos) AppManager.consoleLog(logMsg);
	
	return logMsg;
};

afc.log2 = function(msg)
{
	var logMsg = '';
	
	if(msg instanceof HTMLElement) logMsg = $(msg)[0].outerHTML;
	else if(msg instanceof Object) logMsg = afc.stringifyOnce(msg, undefined, 4);
	else logMsg = msg;
	
	logMsg = afc.logFilter + ' => ' + logMsg;
	console.log(logMsg);
	
	if(afc.isIos) AppManager.consoleLog(logMsg);
	
	return logMsg;
};


afc.setLogFilter = function(filter)
{
	afc.logFilter = filter;
};

afc.setLogOption = function(option)
{
	for(var p in option)
	{
		if(!option.hasOwnProperty(p)) continue;
		afc.logOption[p] = option[p];
	}
};

afc.stringifyOnce = function(obj, replacer, indent)
{
    var printedObjects = [];
    var printedObjectKeys = [];

    function printOnceReplacer(key, value)
    {
        if ( printedObjects.length > 200) // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
        { 
        	return 'object too long';
        }
        
        var printedObjIndex = false;
        printedObjects.forEach(function(obj, index)
        {
            if(obj===value)
                printedObjIndex = index;
        });

		//root element
        if ( key == '')
        {
        	printedObjects.push(obj);
            printedObjectKeys.push("root");
            return value;
        }
        else if(printedObjIndex+"" != "false" && typeof(value)=="object")
        {
            if ( printedObjectKeys[printedObjIndex] == "root") return "(pointer to root)";
            else return "(see " + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase()  : typeof(value)) + " with key " + printedObjectKeys[printedObjIndex] + ")";
        }
        else
        {
            var qualifiedKey = key || "(empty key)";
            printedObjects.push(value);
            printedObjectKeys.push(qualifiedKey);
            
            if(replacer) return replacer(key, value);
            else return value;
        }
    }
    
    return JSON.stringify(obj, printOnceReplacer, indent);
};


//--------------------------------------------------------------------------------------------
// About Time Check
//--------------------------------------------------------------------------------------------

afc.startTime = 0;
afc.oldTime = 0;
afc.beginTimeCheck = function(msg)
{
	afc.log(msg + ' start time ==> --------------------------------------------------');
	window.startTime = window.oldTime = Date.now();
};

afc.ellapseCheck = function(msg)
{
	if(window.startTime==0) return;
	
	afc.log(msg + ' ellapsed time ==> ' + (Date.now() - window.oldTime));
	window.oldTime = Date.now();
};

afc.endTimeCheck = function(msg)
{
	afc.log(msg + ' end time ==> ' + (Date.now() - window.startTime) + ' -------------------------------------');
	window.startTime = 0;
	window.oldTime = 0;
};


//-------------------------------------------------------------------
//  function MyObject()
//  {
//      ParentObject.call(this); //부모에 변수 선언이 있다면 호출해 줄 것.
//  }
//  afc.extendsClass(MyObject, ParentObject);
//--------------------------------------------------------------------

//클래스 상속 관련 처리를 해준다.
afc.extendsClass = function(childClass, parentClass)
{
    //이미 상속처리가 되어져 있는 경우는 리턴
    if(childClass.prototype.superClass) return;

    //상속 받을 부모의 프로토 타입 객체를 생성한다.
    var superProto = new parentClass(); //파라미터 없이 호출한다.
    for(var p in superProto) 
        if(superProto.hasOwnProperty(p)) delete superProto[p];
    
    childClass.prototype = superProto;
    childClass.prototype.constructor = childClass;
    childClass.prototype.superClass = parentClass;
};

afc.getUrlParameter = function()
{  
    var ParameterObject = new Object();  
    var locate = location.href;  
 
    if(locate.indexOf("?")==-1)  
        return ParameterObject;  
 
    var parameter = locate.split("?")[1];  
    var paramAreay = parameter.split("&");  
    for ( var i=0; i<paramAreay.length; i++ )  
    {  
        var tem = paramAreay[i].split("=");  
        ParameterObject[tem[0]] = tem[1];  
    }

    return ParameterObject;  
};

afc.loadSync = function(trgEle, url, callback) 
{
    $.ajax(
    {
    	async: false,
        url: url,
        dataType: 'text',
        success: function(html)
        {
        	if(trgEle)
        	{
	        	var trgObj = $(trgEle);
	        	trgObj.children().remove();
				trgObj.append(html);
				callback.call(trgEle, true);
        	}
        	else callback(html);
        },
        
        error: function() 
        {
        	callback.call(trgEle, false);
        }
    });
};

//동적로드 4가지 유형
//1. document.write('<script src="./MainPage.js"></script>');
//2. afc.loadScript('./MainPage.js');
//3. afc.loadScriptSync('./MainPage.js');
//4. eval(afc.getScriptSrc("./MainPage.js"));

afc.scriptMap = {};

afc.getScriptSrc = function(url, isEnc)
{
	var retVal = '';
	jQuery.ajax(
	{
		async:false, type:'GET', url: url, dataType:'text',
		success: function(data) 
		{
			if(isEnc)
			{
				GibberishAES.size(128);	
				retVal = GibberishAES.aesDecrypt(data, 'asydhf745igjdfdf'); //asydhf745igjdfdf 암호화 키(16자리)
			}
			else retVal = data;
		},
		error: function(xhr, textStatus, errorThrown) { alert('error - ' + src);}
	});

	return retVal;
};

afc.loadScript = function(url)
{
	if(!afc.scriptMap[url])
	{
		$('<script src="' + url + '"></script>').appendTo('head');
		afc.scriptMap[url] = true;
	}
};

afc.loadScriptSync = function(url, isEnc)
{
	if(!afc.scriptMap[url])
	{
		$('<script>eval(afc.getScriptSrc("' + url + '", ' + isEnc + '));</script>').appendTo('head');
		afc.scriptMap[url] = true;
	}
};

afc.syncNativeCall = function(msg)
{
	/*
	if(afc.isIos)
	{
		var iframe = document.createElement("IFRAME");
		iframe.setAttribute('src', 'ios-msg:#' + msg);
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;
	}
	*/
};

afc.touchDelay = function()
{
	afc.enableApp(false);
	setTimeout(function() { afc.enableApp(true); }, afc.TOUCH_DELAY_TIME);
};

afc.enableApp = function(isEnable)
{
	//if(afc.isIos) afc.syncNativeCall('enableApp#'+isEnable);
	//else if(afc.isAndroid) AppManager.enableApp(isEnable);
	
	AppManager.enableApp(isEnable);
};

afc.refreshApp = function()
{
	var tmp = $('<div style="position:absolute; z-index:123156456;">　</div>');
	$('body').append(tmp);

	setTimeout(function() { tmp.remove(); }, 10);
};

//컴포넌트 클래스가 구현 가능한 모든 이벤트 목록을 얻어온다. 
//셋팅한 파라미터의 이벤트 목록만 리턴한다. 둘다 null 이면 AEvent.events 리턴
afc.getEventList = function(baseName)
{
	/*
	var retArr = AEvent.events;
	
	if(baseName) retArr = retArr.concat(window[baseName+'Event'].events);
	if(className && baseName!=className) 
	{
		var evtClass = window[className+'Event'];
		if(evtClass) retArr = retArr.concat(evtClass.events);
	}
	
	return retArr;
	*/
	var ctx = afc.COMP_CTX[baseName];
	if(ctx) return ctx.events.concat(afc.COMP_CTX.defEvents);
	else return [];
};

//--------------------------------------------------------------------------------------------
// About Device & Version
//--------------------------------------------------------------------------------------------

afc.isAndroid = false;
afc.isIos = false;
afc.isTizen = false;
afc.isPC = false;
afc.isSimulator = false;
afc.isChrome = false;
afc.isAndWebview = false;

afc.andVer = 1000.0;	//버전값으로만 ios 제외하기 위해 , 4.1, 4.2 ...
afc.iosVer = 1000.0;	//7.0, 7.1 ...
afc.ChromeVer = 1000.0;	//chrome webview version

afc.strAndVer = ''; 	//4.1.2
afc.strIosVer = '';		//7.1.2
afc.strChromeVer = '';  // 58.0.3029.83

afc.strModuleName = '';

afc.isDeviceOf = function(device)
{
	return (navigator.userAgent.indexOf(device)>-1);
};

afc.androidVersion = function()
{
	var match = navigator.userAgent.match(/Android\s([0-9\.]*)/);
	afc.strAndVer = match ? match[1] : null;
	
	return afc.strAndVer;
};

afc.chromeVersion = function() 
{
	var match = navigator.userAgent.match(/Chrome\/([0-9\.]*)/);
	afc.strChromeVer = match ? match[1] : null;
	return afc.strChromeVer;
};

afc.iosVersion = function()
{
	var match = navigator.userAgent.match(/iPhone OS\s([0-9\_]*)/);
	afc.strIosVer = match ? match[1] : null;
	
	if(afc.strIosVer) 
	{
		afc.strIosVer = afc.strIosVer.replace(/_/g, '.');
		return afc.strIosVer;
	}
	else return null; 
};

afc.makeMeta = function()
{
	//------------------------------------------------------------------------------
	//  param check
	//------------------------------------------------------------------------------
    var params = afc.getUrlParameter();
    var scale = params['scale'];
    var density = params['density'];
    
    //alert(navigator.userAgent);
    
	var devWidth = PROJECT_OPTION.docWidth+'px';
	//var devWidth = 'device-width';
	var meta = null;
	
	if(PROJECT_OPTION.autoScale)
	{
	    //viewport-fit 추가 - iPhone X 대응  
		if(scale)	meta = '<meta name="viewport" content="width=' + devWidth + ', initial-scale=' + scale + ', user-scalable=no viewport-fit=cover"/>';
		else if(density)	meta = '<meta name="viewport" content="width=' + devWidth + ', target-densitydpi=' + density + 'dpi, user-scalable=no"/>';
		else meta = '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>';
	}
	
	//설정값으로 스케일 하는 경우
	else
	{ 
		meta = '<meta name="viewport" content="width=device-width, initial-scale=' + PROJECT_OPTION.scaleVal + ', user-scalable=no"/>';
	}

	//alert(meta);
    
   	if(meta) document.write(meta);
   	
   	document.write('<meta http-equiv="Content-Security-Policy" content="connect-src *; default-src * gap://ready file:; img-src * data:; style-src * \'unsafe-inline\'; script-src * \'unsafe-inline\' \'unsafe-eval\'">');
    
	//아이폰 숫자 폰번호 인식 방지
	document.write('<meta name="format-detection" content="telephone=no"/>');

};

afc.deviceCheck = function()
{
	if(afc.isDeviceOf('Android')) 
	{
		afc.isAndroid = true;
		afc.andVer = parseFloat(afc.androidVersion());
		afc.ChromeVer = parseFloat(afc.chromeVersion()).toFixed(1);
		
		if(afc.isDeviceOf('Chrome'))
		{
			afc.isChrome = true;
		}
		
		//System Webview
		if(afc.isDeviceOf('Version/'))
		{
			afc.isAndWebview = true;
		}
	}
	else if(afc.isDeviceOf('iPhone') || afc.isDeviceOf('iPad') || afc.isDeviceOf('iPod')) 
	{
		afc.isIos = true;
		afc.iosVer = parseFloat(afc.iosVersion());
		
		//document에 touchend 이벤트를 바인드하지 않으면 아이폰에서 특정 컴포넌트의 touchend가 가끔식 발생하지 않음
		$(document).bind('touchend', function(e){});
	}
	else if(afc.isDeviceOf('Tizen')) 
	{
		afc.isTizen = true;
	}
	else
	{
		//alert(navigator.userAgent);
		afc.isPC = true;
		
		afc.ACTION_DOWN = 'mousedown';
		afc.ACTION_MOVE = 'mousemove';
		afc.ACTION_UP = 'mouseup';
		
		if(afc.isDeviceOf('/Simulator'))
		{
			afc.isSimulator = true;
			
			/*
			//시뮬레이터에서 스크롤바 표시 안함
			var strCss = '::-webkit-scrollbar {width: 0px; height: 0px;}'; 
			$('<style></style>').text(strCss).appendTo('head');
			*/
		}
	}
	
	if(afc.isAndroid || afc.isSimulator || afc.isTizen)
	{
		//시뮬레이터에서 스크롤바 표시 안함
		var strCss = '::-webkit-scrollbar {width: 0px; height: 0px;}'; 
		$('<style></style>').text(strCss).appendTo('head');	
	} 
	
	if(window.PROJECT_OPTION)
	{
		if(PROJECT_OPTION.bridgeName=='phonegap')
		{
			afc.makeMeta();
			
			/*
			//cordova dynamic load
			if(afc.isIos) 			document.write('<script src="Bridge/ios/cordova.js"></script>');
			else if(afc.isAndroid)	document.write('<script src="Bridge/android/cordova.js"></script>');
			else if(afc.isPC)	document.write('<script src="Bridge/windows/cordova.js"></script>');
			*/
			
			
			//cordova dynamic load
			if(afc.isIos) 			afc.loadScript('Bridge/ios/cordova.js');
			else if(afc.isAndroid)	afc.loadScript('Bridge/android/cordova.js');
			else if(afc.isPC)		afc.loadScript('Bridge/windows/cordova.js');
		}
	}
};

//--------------------------------------------------------------------------------------------
// About BugFix
//--------------------------------------------------------------------------------------------

//스타일을 동적으로 수정하기
afc.addRule = function(sheet, selector, styles)
{
	if(sheet.insertRule) return sheet.insertRule(selector + '{' + styles + '}');
	if(sheet.addRule) return sheet.addRule(selector, styles);
};

//전화걸기
afc.phoneCall = function(phoneNumber)
{
	var phoneStr = 'tel:'+phoneNumber;
	if(afc.isAndroid) AppManager.goUrl(phoneStr);
	else if(afc.isIos) window.location = phoneStr;
};

//pos자리만큼 소수점 버림
afc.floor = function(value, pos) 
{
	var digits = Math.pow(10, pos);
	return parseFloat(parseInt(value*digits, 10)/digits).toFixed(pos);
};

//pos자리만큼 소수점 버림 + '%'
afc.floorPer = function(value, pos) 
{
	var digits = Math.pow(10, pos);
	return parseFloat(parseInt(value*digits, 10)/digits).toFixed(pos)+'%';
};


//pos만큼 소수점 자리 자르기
afc.floatFix = function(value, pos) 
{
	if(!value) value = 0;
	else value = parseFloat(value);
	
	if(!pos) pos = 2;
	return value.toFixed(pos);
};

//천단위마다 콤마 추가
afc.addComma = function(val) 
{
	if(val != undefined)
	{
		var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
		val += '';  // 숫자를 문자열로 변환
		while (reg.test(val))
			val = val.replace(reg, '$1' + ',' + '$2');
		return val;	
	}
	else return '';
	
	/*
	if(val != undefined) return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	else return '';
	*/
};

//천단위마다 콤마 추가 값이 0인 경우 특수문자 "　" 리턴
afc.hogaComma = function(val) 
{
	if(val != 0)
	{
		var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
		val += '';  // 숫자를 문자열로 변환
		while (reg.test(val))
			val = val.replace(reg, '$1' + ',' + '$2');
		return val;	
	}
	else return '　';
	
	/*
	if(val != undefined) return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	else return '';
	*/
};

//콤마 삭제
afc.removeComma = function(val) 
{
	if(!val) return '';
	else return val.toString().replace(/,/g, '');
};

//더미 데이터의 길이만큼 '*'를 생성
afc.makeDummyString = function(length) 
{
	var dumStr = '';
	for(var i=0; i<length; i++) dumStr += '●';
	return dumStr;
};

//계좌정보에서 계좌정보에 셋팅할 텍스트를 생성
afc.makeAccText = function(accInfo, isGroup) 
{
	var regAcNo = accInfo['D1계좌번호'];
	var accText = '';
	if(theApp.systemInfo)
	{
		accText = theApp.systemInfo.makeAccNumber(regAcNo);
	}
	else accText = regAcNo.substring(0, 3) + "-" + regAcNo.substring(3, 5) + "-" + regAcNo.substring(5, regAcNo.length);
	return accText;
};

//랜덤컬러값을 생성
afc.getRandomColor = function()
{
	return "#"+((1<<24)*Math.random()|0).toString(16);
};

//DATE객체를 String으로 
afc.dateToString = function(date) 
{
	return sprintf('%4d%02d%02d', date.getFullYear(), date.getMonth()+1, date.getDate());
};

afc.formatDate = function(dateNum)
{
	if(!parseInt(dateNum, 10)) return '';
    dateNum+='';
    return dateNum.substring(0,4)+'/'+dateNum.substring(4,6)+'/'+dateNum.substring(6,8); 
};

afc.formatDate2 = function(dateNum)
{
	if(!parseInt(dateNum, 10)) return '';
    dateNum+='';
    return dateNum.substring(2,4)+'/'+dateNum.substring(4,6)+'/'+dateNum.substring(6,8); 
};

afc.formatMonth = function(monthNum)
{
    monthNum+='';
	return monthNum.substring(0,4)+'/'+monthNum.substring(4,6); 
};

afc.formatDateTime = function(datetimeNum)
{
    datetimeNum+='';
	return datetimeNum.substring(0,2)+'/'+datetimeNum.substring(2,4)+' '+datetimeNum.substring(4,6)+':'+datetimeNum.substring(6,8); 
};

afc.formatTime = function(time)
{
	if(!parseInt(time, 10)) return '';
	
	var map1 = { '31000000':'장마감',
			   '41000000':'시간외마감',
			   '51000000':'장전',
			   '61000000':'장중',
			   '71000000':'장후',
			   '81000000':'단일가',
			   '88000000':'단일가 마감',
			   '91000000':'BN 마감',
			   '91000001':'BN 마감',
			   '91000002':'BN 마감',
			   '91000003':'BN 마감',
			   '91000004':'BN 마감',
			   '91000005':'BN 마감',
			   '91000006':'BN 마감',
			   '91000007':'BN 마감',
			   '91000008':'단일가BN마감'};
	if(map1[time]) return map1[time];
	
	var map2 = ['3','4','5','6','7','8','9'];
    time+='';
	if(map2.indexOf(time.substring(0,1)) > -1) time = '0' + time;	

	return time.substring(0,2)+':'+time.substring(2,4); 
};

afc.formatHMS = function(time)
{
	if(!parseInt(time, 10)) return '';
	
	var map1 = { '31000000':'장마감',
			   '41000000':'시간외마감',
			   '51000000':'장전',
			   '61000000':'장중',
			   '71000000':'장후',
			   '81000000':'단일가 마감',
			   '88000000':'단일가 마감',
			   '91000000':'BN 마감',
			   '91000001':'BN 마감',
			   '91000002':'BN 마감',
			   '91000003':'BN 마감',
			   '91000004':'BN 마감',
			   '91000005':'BN 마감',
			   '91000006':'BN 마감',
			   '91000007':'BN 마감',
			   '91000008':'단일가BN마감'};
	if(map1[time]) return map1[time];
	
	var map2 = ['3','4','5','6','7','8','9'];
    time+='';
	if(map2.indexOf(time.substring(0,1)) > -1) time = '0' + time;

	return time.substring(0,2)+':'+time.substring(2,4)+':'+time.substring(4,6);
};

afc.formatTic = function(ticNum)
{
    ticNum+='';
	return ticNum.substring(0,2)+' '+ticNum.substring(2,4)+':'+ticNum.substring(4,6)+':'+ticNum.substring(6,8); 
};

afc.formatSecond = function(t)
{
    t+='';
	return t.substring(0,2)*3600+t.substring(2,4)*60+t.substring(4,6)*1; 
};

afc.switchButtonColor = function(comp)
{
	comp.removeClass('BT38_K00007');
	
    if(comp.getText() == 'ON')
	{
		comp.removeClass('BT92_K06102');
		comp.addClass('BT91_K06101');
	}
	else
	{
		comp.removeClass('BT91_K06101');
		comp.addClass('BT92_K06102');
	}
};

afc.returnAsIt = function(val)
{
	return val;
};

afc.abs = function(val)
{/*
	if(val == '') val = 0;
	else val *= 1;
	
	return val<0 ? val*-1 : val;*/
	val = val.toString();
	if(val.charAt(0) == '-') return val.substring(1);
	else return val;
};

afc.addPercent = function(val)
{
	return val + '%';
};

afc.absComma = function(val)
{
	return afc.addComma(afc.abs(val));
};

afc.intComma = function(val)
{
	return afc.addComma(parseInt(val));
};

afc.absPercent = function(val)
{
	return afc.abs(val) + '%';
};

afc.commaPercent = function(val)
{
	return afc.addComma(val) + '%';
};

afc.absCommaPercent = function(val)
{
	return afc.addComma(val) + '%';
};

afc.plusfloorPercent = function(val)
{
	var digits = Math.pow(10, 2);
	var retVal = parseFloat(parseInt(val*digits, 10)/digits).toFixed(2)+'%';
	//if(val > 0) retVal = ('+'+retVal);
	return retVal;
};

//소수점2자리 버림
afc.floor2 = function(value)
{
	var digits = Math.pow(10, 2);
	return afc.addComma(parseFloat(parseInt(value*digits, 10)/digits).toFixed(2));
};

//소수점2자리 반올림
afc.toFixed2 = function(value)
{
	return afc.addComma(value.toFixed(2));
};

afc.toFixed6 = function(value)
{
	return afc.addComma(value.toFixed(6));
};

afc.toFixed7 = function(value)
{
	return afc.addComma(value.toFixed(7));
};

//절대값 소수점2자리 버림
afc.absFloor2 = function(value)
{
	var digits = Math.pow(10, 2);
	value = afc.abs(value);
	return afc.addComma(parseFloat(parseInt(value*digits, 10)/digits).toFixed(2));
};

//절대값 소수점1자리 버림
afc.absFloor1 = function(value)
{
	var digits = Math.pow(10, 1);
	value = afc.abs(value);
	return afc.addComma(parseFloat(parseInt(value*digits, 10)/digits).toFixed(1));
};

//소수점2자리 버림 + '%'
afc.floor2Per = function(value)
{
	
	if(!value) return null;  // 임의 처리 오류 확인을 하기 위함. 2016.12.01
	
//value값이 0.28 등으로 들어올 때 0.29로 javascript에서 처리하기에 toFixed 함수 새로 생성	2016.11.21. 황청유
	//var digits = Math.pow(10, 2);
	//return parseFloat(parseInt(value*digits, 10)/digits).toFixed(2)+'%';
	return ( afc.toFixed(value, 2) + '%' );
};

//num 을 소숫점 fixed 자릿수 이하에서 버리는 함수
afc.toFixed = function (num, fixed) 
{
	if((num != undefined) && (fixed != undefined))
	{
		var numArr = num.toString().split('.');
		var decimal = '';
		if(numArr[1] != undefined)
		{
			var len = numArr[1].length;
			if(len > fixed)
			{
				return parseFloat(numArr[0]+"."+numArr[1].substring(0, fixed)).toFixed(fixed);	
			}
			return parseFloat(num).toFixed(fixed);
		}
		else
		{
			return parseFloat(num).toFixed(fixed);
		}
	}
	else 
	{
		var tmp = '0.';
		for(var i = 0; i < fixed; i++) tmp = tmp + "0";
		return tmp;
	}
	
	/*
	if(!num || !fixed) { // 임의 처리 오류 확인을 하기 위함. 216.12.01
		return null;
	}
	//값이 없을 경우 처리
	if(num*10 == 0) {
		var tmp = '0.';
		for(var i = 0; i < fixed; i++) tmp = tmp + "0";
		return tmp;
	}

    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0]; // <<- // 오류 사항 : TypeError:null is not an object (evaluation 'a.toString().match(d)'), ....
    */ 
};

afc.absFloor2Per = function(value) 
{
	var digits = Math.pow(10, 2);
	value = afc.abs(value);
	return parseFloat(parseInt(value*digits, 10)/digits).toFixed(2)+'%';
};

afc.sigaTotalAmount = function(value) 
{
	if(!value) return '0';
	else
	{
		value = value/1000000000;
		if(value < 0) return value.toFixed(2);
		else return afc.addComma(parseInt(value, 10));
	}
};

afc.capitalAmount = function(value) 
{
	if(!value) return '0';
	else
	{
		value = value/1000000;
		if(value < 0) return value.toFixed(2);
		else return afc.addComma(parseInt(value, 10));
	}
};

afc.addCommaIfFixed = function(value) 
{
	if(!value) return 0;
	else
	{
		if(value.toString().indexOf('.') > -1)
		{
			if(value<0) value *= -1;
			value = parseFloat(value)*1;
			return afc.addComma(value.toFixed(2));
		}
		else return afc.addComma(value);
	}
};

afc.absCommaIfFixed = function(value) 
{
	if(!value) return 0;
	else
	{
		if(value.toString().indexOf('.') > -1)
		{
			if(value<0) value *= -1;
			value = afc.absComma(parseFloat(value))*1;
			return value.toFixed(2);
		}
		else return afc.absComma(value);
	}
};

afc.oneHundredMillionAmount = function(value)
{
	if(!value) return '0';
	else
	{
		value = value/100000000;
		if(value < 0) return value.toFixed(2);
		else return afc.addComma(parseInt(value, 10));
	}
};

afc.isResize = true;

//------------------------------------------------------------------------------------------------------------------
Date.prototype.format = function(f) 
{
    if (!this.valueOf()) return " ";
    
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) 
    {
        switch ($1) 
        {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

String.prototype.str = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".str(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

//------------------------------------------------------------------------------------------------------------------
	
	
window.onerror = function(message, url, lineNumber)
{
	if(!lineNumber || !url) return;

	var totMsg = message + ', Line - ' + lineNumber + ', ' + url;

	if(Define.SAVE_LOG)
	    AppManager.addLog(totMsg);

	afc.log(totMsg);
	
	alert(totMsg);
		
	if(afc.isAndroid) navigator.app.exitApp();
	else if(afc.isIos) AppManager.exitApp();


};

//------------------------------------------------------------------------------------------------------------------
// function call

	afc.deviceCheck();

//------------------------------------------------------------------------------------------------------------------


afc.loadCSSIfNotLoaded = function() 
{
    var ss = document.styleSheets;
	var headEle = document.getElementsByTagName("head")[0];
	
	var ssLen = ss.length;
    for(var i=0; i<ssLen; i++) 
	{
		if(ss[i].cssRules.length==0)
		{
			ss[i].disabled = true;
			
			var link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = ss[i].href;
			headEle.appendChild(link);
		}
    }
};


/*
afc.clearStyle = function()
{
	//$('head link[href="theme/black/global.css"]').remove();
	//$('head link[href="theme/white/global.css"]').remove();

	//	--> SmarTreePlus
	$('head link[href="stl/black/TitleBar.css"]').remove();
	$('head link[href="stl/black/ToolBar.css"]').remove();
	$('head link[href="stl/black/Grid.css"]').remove();
	$('head link[href="stl/black/ListView.css"]').remove();
	$('head link[href="stl/black/Popop.css"]').remove();
	$('head link[href="stl/black/SubView.css"]').remove();
	$('head link[href="stl/black/Common.css"]').remove();
	$('head link[href="stl/black/Font.css"]').remove();


	$('head link[href="stl/white/TitleBar.css"]').remove();
	$('head link[href="stl/white/ToolBar.css"]').remove();
	$('head link[href="stl/white/Grid.css"]').remove();
	$('head link[href="stl/white/ListView.css"]').remove();
	$('head link[href="stl/white/Popup.css"]').remove();
	$('head link[href="stl/white/SubView.css"]').remove();
	$('head link[href="stl/white/Common.css"]').remove();
	$('head link[href="stl/white/Font.css"]').remove();
	//
};

afc.loadStyle = function(theme)
{
	//$('<link rel="stylesheet" href="theme/' + theme + '/global.css"/>').appendTo('head');
	//	--> SmarTreePlus
	$('<link rel="stylesheet" href="stl/' + theme + '/TitleBar.css"/>').appendTo('head');
	$('<link rel="stylesheet" href="stl/' + theme + '/ToolBar.css"/>').appendTo('head');
	$('<link rel="stylesheet" href="stl/' + theme + '/Grid.css"/>').appendTo('head');
	$('<link rel="stylesheet" href="stl/' + theme + '/ListView.css"/>').appendTo('head');
	$('<link rel="stylesheet" href="stl/' + theme + '/Popup.css"/>').appendTo('head');
	$('<link rel="stylesheet" href="stl/' + theme + '/SubView.css"/>').appendTo('head');
	$('<link rel="stylesheet" href="stl/' + theme + '/Common.css"/>').appendTo('head');
	$('<link rel="stylesheet" href="stl/' + theme + '/Font.css"/>').appendTo('head');
	
};
*/
