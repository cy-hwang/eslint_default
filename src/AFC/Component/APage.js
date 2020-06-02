/**
 * @author asoocool
 */

function APage(containerId)
{
	AContainer.call(this, containerId);
	
	this.navigator = null;
	this.pageData = null;
}
afc.extendsClass(APage, AContainer);


APage.prototype.init = function(context)
{
	AContainer.prototype.init.call(this, context);

};

APage.prototype.onBackKey = function()
{
    if(this.navigator.canGoPrev())
    {
        this.navigator.goPrevPage(false);
        return true;
    }
    
	return false;
};
