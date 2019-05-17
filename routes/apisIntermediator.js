// 8679790 ADALGISA ALVES DE OLIVEIRA
// 8671133 ADEMAR JOSE RIGO
// 8901193 ELIANA APARECIDA DA SILVA
// 12759787 FRANCISCO LUCAS DE ARAUJO
// 12701154 IVANIZE FERNANDES DE OLIVEIRA

var express = require('express');
const convert = require('xml-js');

// var EasySoap = require('easysoap');
// var request = require('request');

var router = express.Router();
const querystring = require('querystring');
var parseString = require('xml2js').parseString;
var DOMParser = require('xmldom').DOMParser;

router.post('/*', function (request, response) {

	// console.log(request);
	// return

    try{
		var form = request.body;
		// var form = request.body.params;
		var method = request.baseUrl.replace("/","")
		// var method = request.baseUrl.replace(/\//g,"")
		// var method = request.body.method

		if(method == ""){
	        response.json({"status":"0", "error":"Not a valid method", "desc": "Is not a valid method"});
			return;
		}

		// {
		//     logonUsuario : 'WSREPLIKANTE',
		//     senhaUsuario : 'integração@68852',
		//     idCliente : '8679790'
		// };

		// var formData = querystring.stringify(form);
		var formData = form;
		formData = querystring.stringify(iteractOverData(formData));
		// formData = iteractOverData(formData);
		// console.log(formData);
		// formData = formData.replace(/%20/g,"-")
		var contentLength = formData.length;
		if(contentLength == 0){
	        response.json({"status":"0", "error":"Not a valid JSON", "desc": "Is not a valid JSON"});
			return;
		}	
		var request = require('request');

		request({
			headers: {
			  'Content-Length': contentLength,
			  'Content-Type': 'application/x-www-form-urlencoded'
			},
			uri: 'http://189.112.232.33:8082/easycollectorwshomologacao/easycollectorWs.asmx/' + method,
			body: formData,
			method: 'POST'
			}, function (err, res, body) {
				try{
		        	var xml = res.body;
		        	// console.log(res)
					parseString(xml, function (err, result) {
						var doc = new DOMParser().parseFromString(result.string._,'text/xml');
						// doc.documentElement.setAttribute('x','y');
						// doc.documentElement.setAttributeNS('./lite','c:x','y2');
						// var nsAttr = doc.documentElement.getAttributeNS('./lite','x')
		        		response.json(xmlToJson(doc));
						return;
					});
				}
				catch(e){
					// console.log(e);
					// response.json({"status":"0", "error":"Error in processing API", "desc": "This generally occur when the JSON is incomplete"});
					var returnTxt = res.body.replace(/\r\n/g,"").replace(/&#39;/g,"'");
					response.json({"status":"0", "error":"Error in processing API", "desc": returnTxt});
					return;
				}
			}
		);
	}
	catch(e){
		console.log(e);
		response.json({"status":"0", "error":"Error in processing API", "desc": "This generally occur when the JSON is incomplete"});
		return;
	}
});

// Changes XML to JSON
// Modified version from here: http://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	// If just one text node inside
	if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
		obj = xml.childNodes[0].nodeValue;
	}
	else if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				if (nodeName != "#text"){
					obj[nodeName] = xmlToJson(item);
				}
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}

function iteractOverData(dataReceived){
	var options = {compact: true, ignoreComment: false };
	Object.keys(dataReceived).forEach(function(valor){
		if(typeof dataReceived[valor] != "string"){
			// console.log(convert.json2xml(iteractOverData(dataReceived[valor]),options))
			// console.log("kkk")
			// dataReceived[valor] = convert.json2xml(iteractOverData(dataReceived[valor]),options)
			dataReceived[valor] = convert.json2xml(dataReceived[valor],options)
		}
	});
	return dataReceived;
}

module.exports = router;