jsGame.Meta = {};

// Adds a function call to the end of an existing function
// -fOld = the function to call first (and return the value of)
// -fNew = the function to call second
// -returnSecond = optional boolean, return the second func result instead?
// -psasObject = optional boolean, pass the return value of fOld as first argument
// of fNew? Useful to extend a class constructor!!
jsGame.Meta.extend = function(fOld, fAdd, returnSecond, passObject)
{
	var doc = fOld.doc;
	fNew = function(){
		var returnValue1 = fOld.apply(null,arguments);
		if(passObject) { 
			args = [returnValue1];
			for(var i=0,len = arguments.length; i < len; i++)
			{
				args[i+1] = arguments[i];
			}
		}
		var returnValue2 = fAdd.apply(null, passObject ? args : arguments);
		return (returnSecond === true) ? returnValue2 : returnValue1;
	};
	fNew.doc = doc;
	return fNew;
}

// Puts all the properties from an object into the constructor of another
// Mixin pattern, extend some class (cOld) with contents of another (cMix)
jsGame.Meta.mixin = function(cOld, cMix)
{
	var doc = cOld.doc;
	cNew = function(){
		self = cOld.apply(null, arguments);
		for (var key in cMix){
			self[key] = cMix[key];
		}

		return self;
	}
	cNew.doc = doc;
	return cNew;
}

// We want extend to be as easily accessible as possible.
jsGame.extend = jsGame.Meta.extend;
jsGame.ex = jsGame.Meta.extend;
