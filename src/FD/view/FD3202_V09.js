
/**
Constructor
Do not call Function in Constructor.
*/
function FD3202_V09()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(FD3202_V09, AView);


FD3202_V09.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here
	
	this.lblFundBuyWord = this.findCompById('lblFundBuyWord');
	this.btnNext = this.findCompById('btnNext');

};


FD3202_V09.prototype.onActiveDone = function(reload)
{
	AView.prototype.onActiveDone.call(this, reload);			
	
	var thisObj = this;
	var cont = thisObj.getContainer();
	
	// 완료 문구 수정
	var lblStepText =[];
	
	if(this.viewData.finishGubun == "1"){													// 임의식 펀드가입 완료인 경우
	
		lblStepText.push("<span class='font30_3'>펀드가입</span><span class='font30'>이 완료되었습니다.</span>");
		
	}else if(this.viewData.finishGubun == "2" && this.viewData.monthGubun == "21"){			// 월적립식 펀드가입 완료인 경우, monthGubun(21:월적립식, 22:일적립식)
	
		lblStepText.push("<span class='font30_3'>월적립식 가입</span><span class='font30'>이 완료되었습니다.</span>");
		
	}else if(this.viewData.finishGubun == "2" && this.viewData.monthGubun == "22"){			// 일적립식 펀드가입 완료인 경우, monthGubun(21:월적립식, 22:일적립식)
	
		lblStepText.push("<span class='font30_3'>일적립식 가입</span><span class='font30'>이 완료되었습니다.</span>");
	
	}
	
	
	
	thisObj.lblFundBuyWord.$ele.children().eq(0).html(lblStepText);
	
	if(thisObj.viewData.finishGubun == "1"){			// 임의식 펀드가입 완료인 경우
		
		thisObj.btnNext.setText('오늘의 주문 내역으로 가기');
	
	}else if(thisObj.viewData.finishGubun == "2"){		// 적립식 펀드가입 완료인 경우
		
		thisObj.btnNext.setText('적립식 가입 현황 가기');
	}
	
};

FD3202_V09.prototype.onbtnNextClick = function(comp, info)
{
	// 2018.06.11 펀드매수 완료 후 임의식은 오늘의 주문내역으로, 적립식은 적립식 매수현황으로 이동
	if(this.viewData.finishGubun == "1"){			// 임의식 펀드가입 완료인 경우
		
		theApp.goPageCheck('FD1201', false, {tabId:'FD1201_T01'});
	
	}else if(this.viewData.finishGubun == "2"){		// 적립식 펀드가입 완료인 경우
		
		theApp.goPageCheck('FD1201', false, {tabId:'FD1201_T02'});
	}
};
