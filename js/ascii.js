(function(){

var list;

var hashchange = function() {
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
		
		document.body.innerHTML =
			'<a href="#">home</a> // <a title="raw" href="ascii/' + ascii + '">' + ascii.replace(/^(?:[^\/]+\/)?/, '') + '</a>' + '\n\n'
			+ xhr.responseText.replace(/&/ig, '&amp;').replace(/</ig, '&lt;').replace(/>/ig, '&gt;')
		;
		
		switch(ascii.match(/(?:([^\/]+)\/)?.+\.[a-z]+$/i)[1]) {
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
	if(xhr.overrideMimeType) xhr.overrideMimeType('text/plain; charset=ISO-8859-1');
	xhr.setRequestHeader('Content-Type', 'text/plain; charset=ISO-8859-1');
	xhr.send(null);
};

window.onhashchange = hashchange;

window.onload = function() {
	list = document.body.innerHTML;
	if(window.navigator.userAgent.match(/MSIE/)) alert('This will definitely look like crap in Internet Explorer.');
	if(window.location.href.match(/#/)) hashchange();
};

}());
