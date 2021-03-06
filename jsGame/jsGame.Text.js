// A sprite-like object which renders by drawing text to the screen
jsGame.Text = jsGame.extend(jsGame.Sprite, function(self){

	self.text = "";
	self.font = "";
	self.color = "";
	self.shadow = false;

	self.render = function(context, camera){
		context.font = self.font;
		context.fillStyle = "rgb(0,0,0)";
		context.fillText(self.text,
			self.x - camera.scroll.x * self.parallax.x + 1,
			self.y - camera.scroll.y * self.parallax.y + 2);
		context.fillStyle = self.color;
		context.fillText(self.text,
			self.x - camera.scroll.x * self.parallax.x,
			self.y - camera.scroll.y * self.parallax.y);
	};

	return self

}, true, true);
