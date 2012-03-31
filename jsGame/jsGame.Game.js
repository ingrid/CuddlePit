jsGame.Game = function(width, height, parentElement){
	var self = {};

// Private
	self._canvas = document.createElement("canvas"); 
	self._context = self._canvas.getContext("2d");
	self._children = [];
	self._bgColor = "rgb(255,255,255)";

	// List of objects to be removed
	self._remove = [];

// Public
	self.width = width;
	self.height = height;
	self.fps = 80;		// Frequency
	self.elapsed = 0; 	// Period
	self.camera = {
		scroll:jsGame.Vector(0,0),
		size:jsGame.Vector(self.width, self.height),
		follow:null,
	};

	// If they didn't supply this argument, assume the doc body
	// as the parent element for the canvas
	if(parentElement === undefined){
		parentElement = document.body;	
	}
	parentElement.appendChild(self._canvas);

	self._canvas.width = self.width;
	self._canvas.height = self.height

	self._tick = function(){
		self.render();
		self.update();
		window.setTimeout(self._tick, 1000.0/self.fps);
	};

	// Called every frame. Most importantly, calls update on each child
	// Additionally, clears out removed elements and updates the camera
	self.update = function(){
		// This filter just says "only leave me if i'm not in the remove list"
		self._children = self._children.filter(function(x,i,a){ return self._remove.indexOf(x) === -1 });
		self._remove = [];

		self.elapsed = 1.0/self.fps;

		// Simplest possible follow code
		if(self.camera.follow !== null)
		{
			self.camera.scroll.x = self.camera.follow.x - self.width / 2;
			self.camera.scroll.y = self.camera.follow.y - self.height / 2;
		}

		// Call update on each child and pass it the elapsed time
		for (var i = self._children.length-1; i >= 0; --i)
		{
			self._children[i].update(1.0/self.fps);
		}
	};

	// Called every frame. Clears the screen then calls render on each child.
	self.render = function(){
		var ctx = self._context;
		ctx.fillStyle = self._bgColor;
		ctx.fillRect(0,0,self.width,self.height);
		for (var i = self._children.length-1; i >= 0; --i)
		{
			self._children[i].render(ctx, self.camera);
		}
	};

	self.setBGColor = function(r,g,b){
		self._bgColor = "rgb(" + r + "," + g + "," + b + ")";
	};

	self.add = function(sprite){
		self._children.push(sprite);
	};

	self.remove = function(sprite){
		if(self._remove.indexOf(sprite) === -1)
		{
			self._remove.push(sprite);
		}
	};

	self.run = function(){
		self._tick();
	};

	return self;
};

jsGame.Game.doc = {};
jsGame.Game.doc.Game = {type : "constructor", params :["width", "height", "parentElement"]};
jsGame.Game.doc.width = {type : "property"};
jsGame.Game.doc.height = {type : "property"};
jsGame.Game.doc.fps = {type : "property"};
jsGame.Game.doc.update = {type : "function", params : []};
jsGame.Game.doc.render = {type : "function", params : []};
jsGame.Game.doc.setBGColor= {type : "function", params : ["r","g","b"]};
jsGame.Game.doc.add = {type : "function", params : ["sprite"], desc : "Add a sprite to the game to be rendered and updated"};
jsGame.Game.doc.run = {type : "function", params : [], desc : "Runs the game loop."};


