
/*
function AToast()
{
}
*/

var AToast = {};

AToast.CURSPAN = null;

AToast.show = function(text)
{
	if(AToast.CURSPAN)
	{
		AToast.CURSPAN.innerHTML = text;
	}
	else
	{
		AToast.CURSPAN =  document.createElement('span');
		AToast.CURSPAN.style.padding = '20px';
		AToast.CURSPAN.style.borderRadius = '10px';
		AToast.CURSPAN.style.backgroundColor = 'rgba(4, 4, 4, 0.8)';
		AToast.CURSPAN.style.color = 'white';
		AToast.CURSPAN.style.boxShadow = '3px 3px 8px #222222';
		AToast.CURSPAN.style.fontSize = '25px';
		AToast.CURSPAN.style.whiteSpace = 'pre-line';
		AToast.CURSPAN.style.margin = '20px';
		AToast.CURSPAN.style.display = 'inline-block';
		AToast.CURSPAN.style.wordBreak = 'break-all';
		AToast.CURSPAN.innerHTML = text;

		var toastDiv = document.createElement('div');
		toastDiv.style.position = 'absolute';
		toastDiv.style.width = '100%';
		toastDiv.style.bottom = '100px';
		toastDiv.style.textAlign = 'center';
		toastDiv.appendChild(AToast.CURSPAN);
		toastDiv.style.zIndex = '2147483647';
		document.body.appendChild(toastDiv);
		toastDiv.setAttribute('class', 'show-toast');
		toastDiv.addEventListener('webkitAnimationEnd', function()
		{
			AToast.CURSPAN = null;
			document.body.removeChild(this);
		});
	}
    
};

AToast.show_Top = function(text)
{
	if(AToast.CURSPAN)
	{
		AToast.CURSPAN.innerHTML = text;
	}
	else
	{
		AToast.CURSPAN =  document.createElement('span');
		AToast.CURSPAN.style.padding = '20px';
		AToast.CURSPAN.style.borderRadius = '10px';
		AToast.CURSPAN.style.backgroundColor = 'rgba(4, 4, 4, 0.8)';
		AToast.CURSPAN.style.color = 'white';
		AToast.CURSPAN.style.boxShadow = '3px 3px 8px #222222';
		AToast.CURSPAN.style.fontSize = '25px';
		AToast.CURSPAN.style.whiteSpace = 'pre-line';
		AToast.CURSPAN.style.margin = '20px';
		AToast.CURSPAN.style.display = 'inline-block';
		AToast.CURSPAN.style.wordBreak = 'break-all';
		AToast.CURSPAN.innerHTML = text;

		var toastDiv = document.createElement('div');
		toastDiv.style.position = 'absolute';
		toastDiv.style.width = '100%';
		toastDiv.style.top = '100px';
		toastDiv.style.textAlign = 'center';
		toastDiv.appendChild(AToast.CURSPAN);
		toastDiv.style.zIndex = '2147483647';
		document.body.appendChild(toastDiv);
		toastDiv.setAttribute('class', 'show-toast');
		toastDiv.addEventListener('webkitAnimationEnd', function()
		{
			AToast.CURSPAN = null;
			document.body.removeChild(this);
		});
	}
    
};
