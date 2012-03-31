// This is how we get keyboard input for now, and maybe mouse in the future.
// This object is much more like a namespace than a class. There's a lot of
// stuff hidden in closures and self is not used. We just return an object with
// the functions we want to expose.

jsGame.Input = function(){
	// Based on a keycode, get a string name for the key.
	// Special cases for arrow keys, right now
	var getName = function(code){
		if(code >= 65 && code <= 90) { return String.fromCharCode(code); }
		else if(code >= 97 && code <= 122){
			return String.fromCharCode(code).toUpperCase();
		}
		switch(code){
			case 192: return "~"; break;
			case 37: return "LEFT"; break;
			case 38: return "UP"; break;
			case 39: return "RIGHT"; break;
			case 40: return "DOWN"; break;
			default: return "UNKNOWN";
		}
	};
	
	var justPressedKeys = [];
	var justReleasedKeys = [];
	var keys = {};
	
	
	document.onkeydown = function(e){
		var code = ('which' in e) ? e.which : e.keyCode;
		if(keys[getName(code)] === false || keys[getName(code)] === undefined){
			keys[getName(code)] = true;
			justPressedKeys.push(getName(code));
		}
	};
	document.onkeyup = function(e){
		var code = ('which' in e) ? e.which : e.keyCode;
		if(keys[getName(code)] === true){
			keys[getName(code)] = false;
			justReleasedKeys.push(getName(code));
		}
	};

	var update = function()
	{
		justPressedKeys = [];
		justReleasedKeys = [];
	}

	// Gotta add our update at the end of the game update. We need
	// an update function to make sure the justPressed and justReleased
	// lists work right.
	jsGame.Game = jsGame.extend(jsGame.Game, function(self){
		self.update = jsGame.extend(self.update, function(){
			update();	
		});
		return self;
	}, true, true);


	return {
		keyDown : function(name){
			return keys[name];
		},
		
		justPressed : function(name){
			return justPressedKeys.indexOf(name) !== -1;
		},
		
		justReleased : function(name){
			return justReleasedKeys.indexOf(name) !== -1;
		}		
	};

}();


jsGame.Input.doc = {};
jsGame.Input.doc.keyDown = {type:"function", params:["keyName"]};
jsGame.Input.doc.justPressed = {type:"function", params:["keyName"]};
jsGame.Input.doc.justReleased = {type:"function", params:["keyName"]};

