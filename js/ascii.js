(function(){

var
	ansiFormat
	, hashchange
	, list
;

hashchange = function() {
	if(! window.location.hash.match(/#.+/)) {
		document.body.setAttribute('class', 'topaz500');
		document.body.innerHTML = list;
		return;
	}

	var
		ascii = window.location.hash.substring(1)
		, asciiClass
		, xhr = new XMLHttpRequest()
	;

	xhr.onreadystatechange = function() {
		if(xhr.readyState != 4) return;
		
		var
			content = xhr.responseText
				.replace(/&/g, '&amp;') // htmldecode
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/\r/g, '') // DOS carriage returns
				.replace(/\x1b\[\d*D/g, '') // unsupported ANSI sequences
				.replace(/\x1b\[A\n\x1b\[\d*C/g, '')
				.replace(/\x1a(?:.|\n)*$/, '') // hide SAUCE
			, parts = ascii.match(/(?:([^\/]+)\/)?(.+\.[a-z]+)$/i)
		;
		
		if(content.indexOf('\x1b') > -1) {
			content = ansiFormat(content);
		}

		content = convertSpecialChars(content);
		
		document.body.innerHTML =
			'<a href="#">home</a> // <a title="raw" href="ascii/' + ascii + '">'
			+ parts[2] + '</a>' + '\n\n' + content
		;
		
		switch(parts[1]) {
			case 'dos':
				asciiClass = 'dos437';
				break;
			case '80x50':
				asciiClass = 'dos80x50';
				break;
			case 'amiga':
			default:
				asciiClass = 'topaz500';
				break;
		}
		
		document.body.setAttribute('class', asciiClass + ' ascii');
	};

	xhr.open('GET', 'ascii/' + ascii, true);
	
	if(xhr.overrideMimeType) {
		xhr.overrideMimeType('text/plain; charset=ISO-8859-1');
	}
	
	xhr.setRequestHeader('Content-Type', 'text/plain; charset=ISO-8859-1');
	xhr.send(null);
};

window.onhashchange = hashchange;

window.onload = function() {
	list = document.body.innerHTML;
	
	if(window.navigator.userAgent.match(/MSIE/)) {
		alert('This will definitely look like crap in Internet Explorer.');
	}
	
	if(window.location.href.match(/#/)) {
		hashchange();
	}
};

ansiFormat = function(content) {
	var
		bg = 0
		, bold = false
		, code = false
		, column = 0
		, copy = content
		, counter
		, div = document.createElement('div')
		, fg = 7
		, lastColumn = 0
		, match
		, rgx = {
			ansi: /^\x1b\[[^Cm]*[Cm]/
			, cursorForward: /\x1b\[(\d*)C/
			, sgr: /\x1b\[((?:\d+;?)*)m/
		}
		, snippet
		, span
		, transformed = ''
	;
	
	for(var i = 0; i < content.length; i++) {
		try {
			snippet = copy.match(rgx.ansi)[0];
		} catch(ex) {
			snippet = false;
		}
		
		if(snippet) {
			if(code == true) {
				span.innerHTML = transformed;
				div.appendChild(span);
			}
			
			code = true;
			span = document.createElement('span');
			transformed = '';
			
			if((match = snippet.match(rgx.sgr))) {
				var params = match[1].split(';');
				
				for(var j = 0; j < params.length; j++) {
					switch(true) {
						case (params[j] == 0):
							fg = 7;
							bg = 0;
							bold = false;
							break;
						case (params[j] == 1):
							bold = true;
							break;
						case (params[j] == 22):
							bold = false;
							break;
						case (params[j] >= 30 && params[j] <= 37):
							fg = params[j] - 30;
							break;
						case (params[j] == 39):
							fg = 7;
							break;
						case (params[j] >= 40 && params[j] <= 47):
							bg = params[j] - 40;
							break;
						case (params[j] == 49):
							bg = 0;
							break;
						default:
							break;
					}
				}
				
				if(bold == true && fg < 8) {
					fg += 8;
				}
			} else if((match = snippet.match(rgx.cursorForward))) {
				var count = (match[1] ? match[1] : 1);
				
				if(lastColumn != 0) {
					count = lastColumn - count + 1;
					lastColumn = 0;
				}
				
				for(var j = 0; j < count; j++) {
					column++;
					
					if(column > 79) {
						transformed += '\n';
						column = 0;
					}
					
					transformed += ' ';
				}
			}
			
			span.setAttribute('class', 'bg' + bg + ' fg' + fg);
			copy = copy.replace(rgx.ansi, '');
			i = content.length - copy.length - 1;
		} else {			
			if(content[i] != '\n') {
				column++;
			} else {
				column = 0;
			}
			
			transformed += content[i];
			copy = copy.substring(1);
		}
	}

	span.innerHTML = transformed;
	div.appendChild(span);
	return div.innerHTML;
}

convertSpecialChars = function(content)
{
	var
		newcontent = "" + content
		, map = {
			"\x01": "\uff00"
			, "\x02": "\uff01"
			, "\x03": "\uff02"
			, "\x04": "\uff03"
			, "\x05": "\uff04"
			, "\x06": "\uff05"
			, "\x07": "\uff06"
			, "\x08": "\uff07"
			, "\x09": "\uff08"
			//, "\x0a": "\uff09" // carriage return
			, "\x0b": "\uff0a"
			, "\x0c": "\uff0b"
			, "\x0d": "\uff0c" // new line
			, "\x0e": "\uff0d"
			, "\x0f": "\uff0e"
			, "\x10": "\uff0f"
			, "\x11": "\uff10"
			, "\x12": "\uff11"
			, "\x13": "\uff12"
			, "\x14": "\uff13"
			, "\x15": "\uff14"
			, "\x16": "\uff15"
			, "\x17": "\uff16"
			, "\x18": "\uff17"
			, "\x19": "\uff18"
			, "\x1a": "\uff19"
			, "\x1b": "\uff1a"
			, "\x1c": "\uff1b"
			, "\x1d": "\uff1c"
			, "\x1e": "\uff1d"
			, "\x1f": "\uff1e"
			, "\x7f": "\uff1f"
		}
	;

	for(var a in map) {
		newcontent = newcontent.replace(new RegExp(a, 'g'), map[a]);
	}

	return newcontent;
}

}());
