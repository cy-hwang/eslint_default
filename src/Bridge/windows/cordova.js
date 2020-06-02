


var cordova = {};

cordova.exec = function(successCallback, failCallback, className, funcName, paramArray)
{	
	if( className=='AppPlugin' )
	{
		if(funcName=='setPref')
		{
			localStorage.setItem(paramArray[0], paramArray[1]);
		}
		else if(funcName=='getPref')
		{
			var localData = localStorage.getItem(paramArray[0]);
			successCallback(localData);
		}
	}
	else window._exec(successCallback, failCallback, className, funcName, paramArray);
};


var m_document_addEventListener = document.addEventListener;
var m_document_removeEventListener = document.removeEventListener;
var m_window_addEventListener = window.addEventListener;
var m_window_removeEventListener = window.removeEventListener;

var documentEventHandlers = 
{
	'deviceready': window,
	'backbutton': window,
	'pause': window,
	'resume': window,
};
var windowEventHandlers = {};

document.addEventListener = function(evt, handler, capture) 
{
	var val = documentEventHandlers[evt];
    if(val) val._addEventListener(evt, handler);
	else m_document_addEventListener.call(document, evt, handler, capture);
};

window.addEventListener = function(evt, handler, capture) 
{
	var val = windowEventHandlers[evt];
    if(val) val._addEventListener(evt, handler);
	else m_window_addEventListener.call(window, evt, handler, capture);
};

document.removeEventListener = function(evt, handler, capture) 
{
    var val = documentEventHandlers[evt];
    if(val) val._removeEventListener(evt, handler);
    else m_document_removeEventListener.call(document, evt, handler, capture);
};

window.removeEventListener = function(evt, handler, capture) 
{
    var val = windowEventHandlers[evt];
    // If unsubscribing from an event that is handled by a plugin
    if(val) val._removeEventListener(evt, handler);
    else m_window_removeEventListener.call(window, evt, handler, capture);
};


//-----------------------------------------------------------------------------------------------
//	for sqlite

var cordova_db_arr = {}; 

window.openSimulatorDB = function(fileName)
{
	//var db = null;
	if ( cordova_db_arr [fileName] &&cordova_db_arr [fileName].transaction)
		return cordova_db_arr [fileName];
	else 
	{		
		var cordova_db = {};
		cordova_db.fileName = fileName; 
		cordova.exec(function()
		{			
			cordova_db.transaction = function(callback)
			{
				var tx = {};

				tx.executeSql = function(sql, valArr, successCallback, failCallback)
				{
					cordova.exec(function(rs) 
								 {
						var payload = { _rs: rs	};

						payload.rows = 
							{
							item: function(i) { return payload._rs[i]; },
							length: rs.length
						};

						successCallback(tx, payload); 
					}, 
								 function() { failCallback(tx, null); }, "SQLitePlugin", "executeSql", [sql, valArr,cordova_db.fileName]);
				};

				callback(tx);
			};

			cordova_db.close = function()
			{
				cordova.exec(null, null, "SQLitePlugin", "close", [cordova_db.fileName]);
			};


				//syl simulator 
				//theApp.masterInfo.db= db; 
			}
			, function() { alert('sqlite open fail!'); } , "SQLitePlugin", "open", [cordova_db.fileName]);

		cordova_db_arr [fileName] = cordova_db;
		return cordova_db;
	}
};
