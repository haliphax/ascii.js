// ascii.js
// by haliphax <http://roadha.us>
//
// A web-font-based rendering engine for displaying ASCII artwork on the web as text

(function(){

// list of ascii artwork; hold on to this for the "home" link
var list;

// function to handle hash changes in window.location
var hashchange = function() {
	// if no ascii specified, show the list of artwork, instead
	if(! window.location.hash.match(/#.+/)) {
		document.body.setAttribute('class', 'topaz500');
		document.body.innerHTML = list;
		return;
	}

	var
		// the ascii being opened
		ascii = window.location.hash.substring(1)
		// the font being used (cp437/topaz500)
		, asciiClass
		// AJAX object
		, xhr = new XMLHttpRequest()
	;

	// AJAX response handler
	xhr.onreadystatechange = function() {
		// only handle the "complete" event
		if(xhr.readyState != 4) return;
		
		// show the artwork (must escape < and > in the text)
		document.body.innerHTML =
			'<a href="#">home</a> // <a title="raw" href="ascii/' + ascii + '">' + ascii + '</a>' + '\n\n'
			+ xhr.responseText.replace(/&/ig, '&amp;').replace(/</ig, '&lt;').replace(/>/ig, '&gt;')
		;
		
		// which font should we use?
		switch(ascii.match(/\.[a-z]+$/i)[0]) {
			// amiga
			case '.txt':
				asciiClass = 'topaz500';
				break;
			// dos
			case '.asc':
			default:
				asciiClass = 'dos437';
				break;
		}
		
		// set the body class to change the font
		document.body.setAttribute('class', asciiClass + ' ascii');
	};

	// request the ascii with the appropriate character set
	xhr.open('GET', 'ascii/' + ascii, true);
	if(xhr.overrideMimeType) xhr.overrideMimeType('text/plain; charset=ISO-8859-1');
	xhr.setRequestHeader('Content-Type', 'text/plain; charset=ISO-8859-1');
	xhr.send(null);
};

// bind hash change handler
window.onhashchange = hashchange;

// page is loaded; initialize
window.onload = function() {
	// grab the list of artwork to be used later for the "home" link on artwork pages
	list = document.body.innerHTML;
	// IE sucks
	if(window.navigator.userAgent.match(/MSIE/)) alert('This will definitely look like crap in Internet Explorer.');
	// if there's a hash in window.location, handle that shit
	if(window.location.href.match(/#/)) hashchange();
};

}());
