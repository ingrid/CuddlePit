// jsGame modules should attach themselves to the jsGame object.
// This will preserve a nice single namespace for everything jsGame related.

jsGame = function(){
	var lib = {};
	var startTime = (new Date()).getTime();
	lib.modules = [];
	lib.includeModule = function(name){

		// Could be pretty bad to include a module multiple times
		if(lib.modules.indexOf(name) !== -1)
		{
			lib.log("Module " + name + " has already been loaded. Skipping.");
			return;
		}

		// prevents the browser from caching the js files by putting
		// extra random data on the url with ?
		var nocache = Math.random();

		document.write("<script language='javascript' src='jsGame/jsGame."+name+".js?" + nocache + "'></script>");
		lib.modules.push(name);
	}
	
	// Log is viewable by checking this object or through some debug implementation
	// in a debug module
	lib.logMessages = [];
	lib.log = function(text){
		lib.logMessages.push({"time":(new Date()).getTime() - startTime, "message":text});
	}
	return lib;
}();

// Load all the default modules
jsGame.includeModule("Meta");
jsGame.includeModule("Util");
jsGame.includeModule("Game");
jsGame.includeModule("Sprite");
jsGame.includeModule("Input");
jsGame.includeModule("Vector");
jsGame.includeModule("Sound");
jsGame.includeModule("RectCollision");
jsGame.includeModule("ProtoTools");
jsGame.includeModule("Animation");
jsGame.includeModule("Debug");
jsGame.includeModule("LevelMap");
jsGame.includeModule("ColorKey");
jsGame.includeModule("FlashSprite");
jsGame.includeModule("Text");
