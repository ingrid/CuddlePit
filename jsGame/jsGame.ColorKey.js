// This module allows you to load an image into an animated Sprite and 
// replace a certain RGB value with transparent. This is especially good
// if taking the sprite from some online source. 
jsGame.Sprite = jsGame.extend(jsGame.Sprite, function(self){

	// This function loops through all the pixels and replaces the specific
	// color with transparent. 
	self.setTransparentColor = function(r,g,b){
		if(self.image === undefined || self.image === null) { return; }

		var cImage = document.createElement("canvas");
		cImage.width = self.image.width;
		cImage.height = self.image.height;
	
		var context = cImage.getContext("2d");
		context.drawImage(self.image, 0, 0);

		var data = context.getImageData(0,0,self.image.width,self.image.height);
		var pix = data.data;

		// TODO: allow supplying the RGB instead of "detecting" it
		if(true);
		{
			r = pix[0];
			g = pix[1];
			b = pix[2];	
		}

		for(var i = 0, n = pix.length; i < n; i+=4)
		{
			// If all the pixels are correct, set the alpha value to 0
			if(pix[i] == r && pix[i+1] == g && pix[i+2] == b){
				pix[i + 3] = 0;
				pix[i] = 255;
			}
		}

		context.putImageData(data, 0 ,0);

		self.image = cImage;

	};

	// Use setImageColorKey instead of setImage to load your sprites
	self.setImageColorKey = jsGame.extend(self.setImage, function(){
		// We can't do it now, we have to wait until the image loads.
		// So, extend the imageLoaded function
		self.imageLoaded = jsGame.extend(self.imageLoaded, function(){
			self.setTransparentColor();	
		});
	});

	return self;
}, true, true);
