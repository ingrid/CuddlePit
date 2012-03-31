// Extremely simple sound library. Can load or cache a sound and play it.

// Either just use jsGame.Sound.play(url) or cache it first with
// jsGame.Sound.load(url), then call play with that same url.  

// Right now the cache is hidden in the closure
jsGame.Sound = function(){
	var cache = {};

	// Load will create an html5 audio tag and store the object in
	// the cache, keyed by its url
	var load = function(url){
		var aud = document.createElement('audio');
		aud.setAttribute('src', url);
		aud.load();
		cache[url] = aud;
	};

	// Play just calls the audio tag play function, or loads it first
	// then plays it.
	var play = function(url){
		if(cache[url] === undefined){
			load(url);
		}
		cache[url].play();
	};

	return {
		load : load,
		play : play,
	};
}();

jsGame.Sound.doc = {};
jsGame.Sound.doc.load = {type:"function",params:["url"],desc:"Preload a sound."};
jsGame.Sound.doc.play = {type:"function",params:["url"],desc:"Play a sound, loading it first if it's not preloaded."};
