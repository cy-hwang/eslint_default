

/**
Constructor
Do not call Function in Constructor.
*/
function MS1005_T00()
{
	AView.call(this);

}
afc.extendsClass(MS1005_T00, AView);


MS1005_T00.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.informViewgr = this.findCompByGroup('InformViewgr');
	this.initViewPosition();
};

MS1005_T00.prototype.onActive = function(reload)
{
	AView.prototype.onActive.call(this, reload)
	
	this.initViewPosition();
};


MS1005_T00.prototype.onWillDeactive = function(reload)
{
	AView.prototype.onWillDeactive.call(this, reload);
};

MS1005_T00.prototype.onNextBtnClick = function(comp, info)
{
	thisObj.getContainer().nextView();
};

MS1005_T00.prototype.initViewPosition = function()
{
	for(var a = 0;a<this.informViewgr.length;a++){
		this.informViewgr[a].setStyleObj({'height':'90px'});
	}
};

MS1005_T00.prototype.onInformViewActionUp = function(comp, info)
{
	if(this.preSelectView)
	{
		this.preSelectView.setStyleObj({'height':'90px'});
		this.preSelectView.getChildren()[1].show(AComponent.INVISIBLE);
		
		this.preSelectView.getChildren()[0].getChildren()[0].removeClass('BT_13_TCH');
		this.preSelectView.getChildren()[0].getChildren()[0].addClass('BT_13_NOR');
		
		this.preSelectView.getChildren()[0].getChildren()[1].removeClass('font_style_selected');
		this.preSelectView.getChildren()[0].getChildren()[1].addClass('font_style');	
	}
	
	if(this.preSelectView === comp)
	{
		if(this.preSelectView.isOpen)
		{
			comp.setStyleObj({'height':'90px'});
			comp.getChildren()[1].show(AComponent.INVISIBLE);

			comp.getChildren()[0].getChildren()[0].removeClass('BT_13_TCH');
			comp.getChildren()[0].getChildren()[0].addClass('BT_13_NOR');
			
			comp.getChildren()[0].getChildren()[1].removeClass('font_style_selected');
			comp.getChildren()[0].getChildren()[1].addClass('font_style');	
			comp.isOpen = false;
		}
		else
		{
			comp.setStyleObj({'height':'195px'});
			comp.getChildren()[0].getChildren()[0].removeClass('BT_13_NOR');
			comp.getChildren()[0].getChildren()[0].addClass('BT_13_TCH');
			
			comp.getChildren()[0].getChildren()[1].removeClass('font_style');
			comp.getChildren()[0].getChildren()[1].addClass('font_style_selected');
			comp.getChildren()[1].show(AComponent.VISIBLE);
			comp.isOpen = true;
		}
	}
	else
	{
		comp.setStyleObj({'height':'195px'});
		comp.getChildren()[0].getChildren()[0].removeClass('BT_13_NOR');
		comp.getChildren()[0].getChildren()[0].addClass('BT_13_TCH');
		
		comp.getChildren()[0].getChildren()[1].removeClass('font_style');
		comp.getChildren()[0].getChildren()[1].addClass('font_style_selected');
		comp.getChildren()[1].show(AComponent.VISIBLE);
		comp.isOpen = true;
	}
	
	this.preSelectView = comp;
};


