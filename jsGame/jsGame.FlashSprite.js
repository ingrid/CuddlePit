// A simple module which adds oldschool sprite flashing capabilities.
// Just call flash(time) and the sprite will alternate between visible
// and invisible rapidly for the supplied number of seconds.

// Check if the sprite is flashing by looking at its mySprite.flashing 
jsGame.Sprite = jsGame.extend(jsGame.Sprite, function(self){
	self.flashTimer = 0;
	self.flashing = false;
	self.flash = function(t){
		// Assume that you can't start flashing again until you're done
		if(self.flashTimer <= 0){
			self.flashTimer = t;
			self.flashing = true;
		}
	}

	self.update = jsGame.extend(self.update, function(elapsed){
		self.flashTimer -= elapsed;
		if(self.flashTimer <= 0)
		{
			self.flashing = false;
		}
		// Hard-coded for now to alternate 8 times a second between the two
		if(self.flashTimer % 0.125 >= 0.0625){
			self.visible = false;
		}
		else{
			self.visible = true;
		}
	});

	return self;

}, true, true);
