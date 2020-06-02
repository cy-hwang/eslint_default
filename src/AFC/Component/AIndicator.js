
var AIndicator = {
	
};

AIndicator.show = function()
{
	if(afc.isSimulator)
	{
		var indiSpan =  document.createElement('div');
		indiSpan.setAttribute('class', 'loader');

		AIndicator.indiDiv = document.createElement('div');
		AIndicator.indiDiv.style.position = 'absolute';
		AIndicator.indiDiv.style.width = '100%';
		AIndicator.indiDiv.style.height = '100%';
		AIndicator.indiDiv.style.zIndex = '2147483647';

		AIndicator.indiDiv.appendChild(indiSpan);
		document.body.appendChild(AIndicator.indiDiv);
	}
	else AppManager.showProgress();
};

AIndicator.hide = function()
{
	if(afc.isSimulator)
	{
		if(AIndicator.indiDiv && document.body) 
		{
			document.body.removeChild(AIndicator.indiDiv);	
			AIndicator.indiDiv = null;
		}
	}
	else AppManager.hideProgress();
};