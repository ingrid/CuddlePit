// Some utility functions, of course!

// Remove an element from an array
jsGame.aRemove = function(a, elem){
	if(a.indexOf(elem) === -1) { return; }
	a.splice(a.indexOf(elem),1);
};

// Load the contents of a file and call a function, supplying the file data
// as an argument
jsGame.loadFileAsync = function(url, callback){
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			if (request.status === 200) {
				callback(request.responseText);
			}
	  	}
	}
	request.send(null);
}

// Just a wrapper over setTimeout
jsGame.timer = function(time, f){
	window.setTimeout(f, time);
}
