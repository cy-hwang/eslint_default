/**
 * @author asoocool
 * ADropBox 컴포넌트에서 사용하는 Item은 {'text':'', 'data':''} Object임
 */



function ADropBox()
{
	AComponent.call(this);
	
	this.items = new Array();
	this.selIndex = -1;
	
	this.dropBoxH = 300;
	
	this.selectClass = 'dropboxCellOver';
	this.normalClass = 'dropboxCell';
	
	this.textfield = null;
	this.dropBtn = null;
	this.dropWin = null;
	this.openDir = true;	//드랍박스를 펼칠 방향 (true : 하단으로 펼침, false: 상단으로 펼침)
	this.useDropBox = true;
	
	this.scrollArea = null;
}
afc.extendsClass(ADropBox, AComponent);

ADropBox.isBoxShow = null;

ADropBox.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	this.textfield = this.element.children[0];
	this.dropBtn = this.element.children[1];
	
	this.dropWin = new AWindow('_drop_win');

};

/*
ADropBox.prototype.defaultAction = function()
{
	ADropBoxEvent.implement(this);
};
*/

ADropBox.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	$(this.textfield).width(this.getWidth() - ($(this.dropBtn).width()+10));
};

ADropBox.prototype.setSelectClass = function(selectClass)
{
	this.selectClass = selectClass;
};

ADropBox.prototype.setWidth = function(w)
{
	AComponent.prototype.setWidth.call(this, w);	
	$(this.textfield).width(w - ($(this.dropBtn).width()+10));
};

ADropBox.prototype.clearSelectItem = function()
{
	this.selIndex = -1;
	$(this.textfield).val('');
};

ADropBox.prototype.addItem = function(text, data)
{
	var item = {'text':text, 'data':data};
	this.items.push(item);
	
	return item;
};

ADropBox.prototype.setItem = function(index, text, data)
{
	this.items[index] = {'text':text, 'data':data};
};

ADropBox.prototype.getItem = function(index)
{
    return this.items[index];
};

ADropBox.prototype.getItems = function()
{
    return this.items;
};

ADropBox.prototype.setUseDropBox = function(useDropBox)
{
	this.useDropBox = useDropBox;
};


ADropBox.prototype.setItems = function(items)
{
	this.items = new Array(items.length);
	var item;
	for(var i=0; i<items.length; i++)
	{
		item = items[i];
		this.items[i] = { 'text':item[0], 'data':item[1] };
	}
};

ADropBox.prototype.setItemText = function(index, text)
{
	this.items[index].text = text;
};

ADropBox.prototype.getItemText = function(index)
{
	return this.items[index].text;
};

ADropBox.prototype.setItemData = function(index, data)
{
	this.items[index].data = data;
};

ADropBox.prototype.getItemData = function(index)
{
	return this.items[index].data;
};

ADropBox.prototype.getSelectedIndex = function()
{
    return this.selIndex;
};

ADropBox.prototype.getSelectedItem = function()
{
	return this.items[this.selIndex];
};

ADropBox.prototype.indexOfText = function(text)
{
	for(var i=0; i<this.items.length; i++)
	{
		if(this.items[i].text == text) return i;
	}
	
	return -1;
};

ADropBox.prototype.indexOfData = function(data)
{
	for(var i=0; i<this.items.length; i++)
	{
		if(this.items[i].data==data) return i;
	}
	
	return -1;
};

ADropBox.prototype.selectItem = function(index)
{
	if(index>-1)
	{
		this.selIndex = index;
		this.setEditText(this.items[index].text);
	}
};

ADropBox.prototype.selectItemByText = function(text)
{
	this.selectItem(this.indexOfText(text));
};

ADropBox.prototype.selectItemByData = function(data)
{
	this.selectItem(this.indexOfData(data));
};

ADropBox.prototype.getSelectedItemData = function(key)
{
	var selectedItem = this.getSelectedItem();
	if(selectedItem)
	{	
		if(key) return selectedItem.data[key];
		return selectedItem.data;
	}
	else return false;
};

ADropBox.prototype.getSelectedItemText = function()
{
    return this.getSelectedItem().text;
};

ADropBox.prototype.getItemSize = function()
{
    return this.items.length;
};

ADropBox.prototype.removeItem = function(index)
{
    this.items.splice(index, 1);
};

ADropBox.prototype.removeAll = function()
{
	this.textfield.value = '';
    this.items.length = 0;
};

ADropBox.prototype.setReadOnly = function(isReadOnly)
{
    if(isReadOnly) $(this.textfield).attr('readonly', isReadOnly);
    else $(this.textfield).removeAttr('readonly');
};

ADropBox.prototype.getEditText = function()
{
    return this.textfield.value;
};

ADropBox.prototype.setEditText = function(text)
{
    this.textfield.value = text;
};

ADropBox.prototype.setDataType = function(dataType)
{
	this.textfield.type = dataType;
};

ADropBox.prototype.getDataType = function()
{
	return this.textfield.type;
};

ADropBox.prototype.setTextAlign = function(align)
{
    this.textfield.textAlign = align;
};

ADropBox.prototype.getTextAlign = function()
{
    return this.textfield.textAlign;
};

ADropBox.prototype.setOpenDirection = function(isDown)
{
    this.openDir = isDown;
};

ADropBox.prototype.openBox = function(isButtonClick)
{
	
	if(this.dropWin.isValid() || !this.useDropBox) return;
	
    var thisObj = this;   
    if(this.getItemSize() < 1) return;
	
	var listDiv = $('<div data-base="AView" data-class="AView" data-flag="1011" class="dropboxBack AView-Style" ></div>');
	
	var ulObj = $('<ul data-base="AView" data-class="AView" data-flag="1011" class="dropboxList"></ul>');
	var upScroll = $('<span class="scrollbar-up"></span>');
	var dwScroll = $('<span class="scrollbar-down"></span>');
	listDiv.append(ulObj);
	listDiv.append(upScroll);
	listDiv.append(dwScroll);
	
	this.scrollArea = ulObj;
	this.enableScrlManagerY();
	
	this.dropWin.url = listDiv;
	this.bindData(ulObj);
	
	upScroll.hide();
	dwScroll.hide();
	
	/*
	ulObj.bind('scroll', function(e)
	{
		upScroll.show();
		dwScroll.show();
		if(this.offsetHeight + this.scrollTop >= this.scrollHeight)
		{
			dwScroll.hide();
		}
		else if(this.scrollTop == 0)
		{
			upScroll.hide();
		}
	});
	*/
	
	this.dropWin.setWindowOption(
	{
		isModal: true,
		modalBgOption: 'none',
		isFocusLostClose: true
	});
	
	var pos = this.$ele.offset();
    var boxHeight = Math.min(60*this.items.length, this.dropBoxH);
	
	//드랍박스를 상단으로 띄울지 하단으로 띄울지 결정
	if((pos.top + boxHeight) > $(window).height()) pos.top -= boxHeight;
	else pos.top += this.$ele.height() - 1;
	
	this.dropWin.open(this, pos.left, pos.top, this.$ele.outerWidth(), boxHeight);
	
	/*
	if(ulObj[0].offsetHeight < ulObj[0].scrollHeight)
	{
		dwScroll.show();
	}
	*/
    
};

ADropBox.prototype.bindData = function(ulObj)
{
    var dataArr = this.items;
	
    for(var i=0; i<dataArr.length; i++)
    {
        var liObjStr = '<li class="'+this.normalClass+'" style="width:' + $(this.element).width() + 'px;"><span style="margin:10px;">'+dataArr[i].text+'</sapn>';
		/*  코드와 값을 같이 보여줘야 할경우 셋팅
        if(this.showCode)
        {
            liObjStr +=  '<span style="position:absolute; right:20px;">'+dataArr[i][1]+'</sapn>';   
        }
		*/
        liObjStr += '</li>';
        
        var liObj = $(liObjStr);
        liObj[0].data = dataArr[i];
		liObj[0].index = i;
        ulObj.append(liObj);
        
        
        this.aevent._select(liObj[0]);
		
    }
	
	
    //ADropBoxEvent.implement(this, ulObj.children('li'));
};

ADropBox.prototype.enableScrlManagerY = function()
{
	//if(this.scrlManagerY) return;
	
	if(afc.isSimulator || afc.isAndroid) return;
	
	this.scrlManagerY = new ScrollManager();
	this.scrollArea.css({'overflow':'auto', '-webkit-overflow-scrolling': ''});
	
	this.scrollYImplement();
};

ADropBox.prototype.scrollYImplement = function()
{
	var aview = this;
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false;
	var thisObj = this;
	
	this.scrollArea[0].addEventListener(AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		
		e.preventDefault();
		thisObj.scrlManagerY.initScroll(e.changedTouches[0].clientY);
	});
	
	this.scrollArea[0].addEventListener(AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		var scrlArea = this;
		thisObj.scrlManagerY.updateScroll(e.changedTouches[0].clientY, function(move)
		{
			scrlArea.scrollTop += move;
		});
	});
	
	this.scrollArea[0].addEventListener(AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		e.preventDefault();
		
		var scrlArea = this;
		thisObj.scrlManagerY.scrollCheck(e.changedTouches[0].clientY, function(move)
		{
			scrlArea.scrollTop += move;
			return true;
		});
	});
};


ADropBox.prototype.setQueryData = function(dataArr, keyArr)
{
	if(!keyArr) return;
	
	var value = dataArr[0][keyArr[0]];
	
	if(value == undefined) return;
	
	this.selectItemByData(value);
};

ADropBox.prototype.getQueryData = function(dataArr, keyArr)
{
	if(!keyArr) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getSelectedItemData();
};

ADropBox.prototype.isMoreScrollTop = function()
{
	if(this.scrollArea[0].scrollTop > 0) return true;
	else return false;	
};

ADropBox.prototype.isMoreScrollBottom = function()
{
	if(this.scrollArea[0].offsetHeight + this.scrollArea[0].scrollTop < this.scrollArea[0].scrollHeight) return true;
	else return false;	
};

ADropBox.prototype.isScroll = function()
{
    return (this.scrollArea[0].offsetHeight < this.scrollArea[0].scrollHeight);
};
