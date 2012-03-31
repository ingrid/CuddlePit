// A Sprite is an object with an image and very simple physics.
// There is no collision detection, but it has position, velocity, acceleration
jsGame.Sprite = function(x, y){
	var self = {};
	self.x = x;
	self.y = y;
	self.width = 0;
	self.height = 0;
	
	self.image = null;
	self.visible = true; // The sprite can be hidden by setting this to false
	
	self.velocity = jsGame.Vector(0,0);
	self.acceleration = jsGame.Vector(0,0);

	// How much the render position is affected by the camera
	self.parallax = jsGame.Vector(1,1);
	
	// Loads an image and when it's finished loading, sets the sprite's image
	// to it. Automatically adjusts the sprite's width and height.
	self.setImage = function(url)
	{
		var tempImage = new Image();
		tempImage.onload = function(){
			self.image = tempImage;
			self.width = self.image.width;
			self.height = self.image.height;
			self.imageLoaded();
		}
		tempImage.src = url;
	}

	// In case you need to do something when the image finishes loading.
	self.imageLoaded = function(){};

	// Called by game, this is how the Sprite shows up on screen
	self.render = function(context, camera)
	{
		if(self.image !== null && self.visible){
			context.drawImage(self.image,
				self.x - camera.scroll.x * self.parallax.x,
				self.y - camera.scroll.y * self.parallax.y);
		}
	}
	
	// Handle simple physics every tick
	self.update = function(elapsed)
	{
		// This vector math stuff sucks because there's no such thing as
		// operator overloading

		// Add to velocity based on accel
		var va = jsGame.Vector.add, vm = jsGame.Vector.mul;
		self.velocity = va(self.velocity, vm(self.acceleration, elapsed));

		// Add to position based on velocity
		self.x += self.velocity.x * elapsed;
		self.y += self.velocity.y * elapsed;
	}
	
	return self;
};

jsGame.Sprite.doc = {};
jsGame.Sprite.doc.Sprite = {type:"constructor", params:["x","y"]};
jsGame.Sprite.doc.x = {type:"property"};
jsGame.Sprite.doc.y = {type:"property"};
jsGame.Sprite.doc.width = {type:"property"};
jsGame.Sprite.doc.height = {type:"property"};
jsGame.Sprite.doc.image = {type:"property"};
jsGame.Sprite.doc.velocity = {type:"property"};
jsGame.Sprite.doc.acceleration = {type:"property"};
jsGame.Sprite.doc.update = {type:"function", params:["elapsed"]};
jsGame.Sprite.doc.render = {type:"function", params:["context"]};
jsGame.Sprite.doc.setImage = {type:"function", params:["url"]};

