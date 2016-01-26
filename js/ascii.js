(function(){

var
	ansiFormat
	, convertSpecialChars
	, hashchange
	, list
;

/***
 * when the hash in the URL changes, either load the main menu
 * or display the specified artwork.
 ***/
hashchange = function() {
	// no filename; load main menu
	if(! window.location.hash.match(/#.+/)) {
		document.body.setAttribute('class', 'topaz500');
		document.body.innerHTML = list;
		return;
	}

	var
		ascii = window.location.hash.substring(1) // filename
		, asciiClass // which font?
		, xhr = new XMLHttpRequest() // AJAX request for pulling file
	;

	// AJAX response handler
	xhr.onreadystatechange = function() {
		if(xhr.readyState != 4) return;

		var
			// content of the file, slightly altered
			content = xhr.responseText
				.replace(/&/g, '&amp;') // htmldecode
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/\r/g, '') // DOS carriage returns
				.replace(/\x1b\[\d*D/g, '') // unsupported ANSI sequences
				.replace(/\x1b\[A\n\x1b\[\d*C/g, '')
				.replace(/\x1a(?:.|\n)*$/, '') // hide SAUCE
			// parts of the filename
			, parts = ascii.match(/(?:([^\/]+)\/)?(.+\.[a-z]+)$/i)
		;

		// if you find \x1b, run it through the ANSI formatter
		if(content.indexOf('\x1b') > -1) {
			content = ansiFormat(content);
		}

		// convert unprintable ASCII characters to their adjusted glyphs
		content = convertSpecialChars(content);

		// display the header nav and artwork
		document.body.innerHTML =
			'<a href="#">home</a> // <a title="raw" href="ascii/' + ascii + '">'
			+ parts[2] + '</a>' + '\n\n' + content
		;

		// which font to use?
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

	// pull the file
	xhr.open('GET', 'ascii/' + ascii, true);

	// specify response charset if browser allows it
	if(xhr.overrideMimeType) {
		xhr.overrideMimeType('text/plain; charset=ISO-8859-1');
	}

	xhr.setRequestHeader('Content-Type', 'text/plain; charset=ISO-8859-1');
	xhr.send(null);
};

// bind the hash change event
window.onhashchange = hashchange;

/***
 * when the page loads, grab its initial contents and use them for the
 * 'main menu'. throw a warning if being viewed in Internet Explorer.
 ***/
window.onload = function() {
	list = document.body.innerHTML;

	if(window.navigator.userAgent.match(/MSIE/)) {
		alert('This will definitely look like crap in Internet Explorer.');
	}

	if(window.location.href.match(/#/)) {
		hashchange();
	}
};

/***
 * replace ANSI SGR and CSI codes with their HTML/CSS equivalents.
 * not all codes are supported; only 8 background and 16 foreground
 * colors in the pallete.
 ***/
ansiFormat = function(content) {
	var
		bg = 0 // background color
		, fg = 7 // foreground color
		, bold = false // bold flag
		, started = false // have we started parsing?
		, column = 0 // which column are we at?
		, copy = content // temporary buffer of ASCII content
		, match // holds regex matches
		, rgx = {
			ansi: /^\x1b\[[^Cm]*[Cm]/ // for stripping all CSI/SGR codes
			, cursorForward: /\x1b\[(\d*)C/ // CUF
			, sgr: /\x1b\[((?:\d+;?)*)m/ // SGR recognition
		}
		, div = document.createElement('div') // holds elements off-screen
		, snippet // temporary string for building output
		, span // HTML element with current SGR attributes
		, transformed = '' // transformed ASCII
	;

	// loop through ASCII one character at a time and parse SGR/CSI codes
	for(var i = 0; i < content.length; i++) {
		// any SGR/CSI codes?
		try {
			snippet = copy.match(rgx.ansi)[0];
		} catch(ex) {
			snippet = false;
		}

		// yep; parse 'em
		if(snippet) {
			// start appending output after first pass
			if(started == true) {
				span.innerHTML = transformed;
				div.appendChild(span);
			}

			started = true;
			span = document.createElement('span');
			transformed = '';

			// SGR parsing
			if((match = snippet.match(rgx.sgr))) {
				var params = match[1].split(';');

				for(var j = 0; j < params.length; j++) {
					switch(true) {
						// default
						case (params[j] == 0):
							fg = 7;
							bg = 0;
							bold = false;
							break;
						// bold
						case (params[j] == 1):
							bold = true;
							break;
						// normal
						case (params[j] == 22):
							bold = false;
							break;
						// foreground color
						case (params[j] >= 30 && params[j] <= 37):
							fg = params[j] - 30;
							break;
						// normal (fg only)
						case (params[j] == 39):
							fg = 7;
							break;
						// background color
						case (params[j] >= 40 && params[j] <= 47):
							bg = params[j] - 40;
							break;
						// normal (bg only)
						case (params[j] == 49):
							bg = 0;
							break;
						// unrecognized
						default:
							break;
					}
				}

				// "bold" changes color in our case, not font weight
				if(bold == true && fg < 8) {
					fg += 8;
				}
			// CUF parsing
			} else if((match = snippet.match(rgx.cursorForward))) {
				// @TODO attributes in empty space or not?

				// how many spaces to move?
				var count = (match[1] ? match[1] : 1);

				// do it
				for(var j = 0; j < count; j++) {
					column++;

					// wrap
					if(column > 79) {
						transformed += '\n';
						column = 0;
					}

					transformed += ' ';
				}
			}

			// apply attributes
			span.setAttribute('class', 'bg' + bg + ' fg' + fg);
			// strip CSI/SGR
			copy = copy.replace(rgx.ansi, '');
			// continue
			i = content.length - copy.length - 1;
		// nothing to parse; just append output
		} else {
			// newline resets the column counter
			if(content[i] != '\n') {
				column++;
			} else {
				column = 0;
			}

			// append output
			transformed += content[i];
			// remove from buffer
			copy = copy.substring(1);
		}
	}

	span.innerHTML = transformed;
	div.appendChild(span);
	return div.innerHTML;
}

/***
 * convert certain unprintable ASCII characters to updated glyphs.
 * takes advantage of the doctored DOS font files.
 ***/
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

