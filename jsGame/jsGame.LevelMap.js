// LevelMap is a grid of tiles, for fast and simple level development
// Handles rendering the portion of the map which is visible and collisions
// Useful for platformers or RPGs, and other things probably

jsGame.LevelMap = function(tilesize, w, h, image){
	var self = {};
	self.tiles = [];
	self.tilesize = tilesize;

	// The LevelMap should function like a collisongroup for tiles.
	self.tileCollisionGroup = jsGame.CollisionGroup();
	self.image = null;

	// We have to pretend no image has been given (so it stays null) until it
	// is completely loaded. Otherwise we'd try to render it and get DOM errs
	var tempImage = new Image();
	tempImage.onload = function(){
		self.image = tempImage;
	};
	tempImage.src = image;

	self.update = function(){};

	// We want to pretend this is like a Sprite, where we can just call collide
	// on it instead of worrying about how that works internally. So, we just 
	// set its collide and overlaps to its collisionGroup's functions
	self.collide = self.tileCollisionGroup.collide;
	self.overlaps = self.tileCollisionGroup.overlaps;

	// Render each tile if it is visible
	self.render = function(context, camera){
		// Figure out the minimum and maximum tiles horizontally
		var x1 = camera.scroll.x;
		var x2 = camera.scroll.x + camera.size.x;
		x1 = Math.floor(x1 / self.tilesize);
		x2 = Math.floor(x2 / self.tilesize);

		// And the same vertically
		var y1 = camera.scroll.y;
		var y2 = camera.scroll.y + camera.size.y;
		y1 = Math.floor(y1 / self.tilesize);
		y2 = Math.floor(y2 / self.tilesize);

		// And only render the ones that are on-screen
		for(var y = Math.max(0, y1); y < Math.min(y2+1,self.height); ++y)
		{
			for(var x = Math.max(0,x1); x < Math.min(x2+1, self.width); ++x)
			{
				var t = self.tiles[y][x];
				if(t !== null && self.image)
				{
					// For firefox, we have to never try to draw something
					// outside the canvas. So we must trim the images
					var dx = x * self.tilesize - camera.scroll.x;
					var dy = y * self.tilesize - camera.scroll.y;	
					var cutx = 0;
					var cuty = 0;
					var trimx = 0;
					var trimy = 0;
					if(dx < 0) { cutx = dx; }
					if(dy < 0) { cuty = dy; }

					if(dx + self.tilesize > camera.size.x) { trimx = (dx + self.tilesize) - camera.size.x; }
					if(dy + self.tilesize > camera.size.y){ trimy = (dy + self.tilesize) - camera.size.y; }

					// ugh.
					context.drawImage(self.image,
									t.imageIndex * self.tilesize - cutx, cuty, self.tilesize + cutx - trimx, self.tilesize + cuty - trimy,
									dx - cutx, dy - cuty , self.tilesize + cutx - trimx, self.tilesize + cuty - trimy);		 
					
				}
			}
		}
		
	}

	// Put a tile at a position
	self.put = function(t, x, y){
		if(self.tiles[y][x] !== null){
			self.tileCollisionGroup.remove(self.tiles[y][x]);	
		}
		self.tiles[y][x] = t;
		if(t.collides)
		{
			self.tileCollisionGroup.add(t);
		}
	}

	// Clear the tilemap
	self.reset = function(w, h){
		self.tileCollisionGroup.children = [];
		self.tiles = [];
		self.width = w;
		self.height = h;
		for(var y = 0; y < h; ++y){
			self.tiles.push([]);
			for(var x = 0; x < w; ++x){
				self.tiles[y].push(null);
			}
		}
	};

	self.reset(w,h);

	return self;	
};

// A Tile object is basically a Sprite with less stuff in it. It just needs to
// be able to draw and collide. 
jsGame.LevelMap.Tile = function(x, y, imageIndex, collide){
	var self = {};
	self.x = x * 32;
	self.y = y * 32;
	self.width = 32;
	self.height = 32;
	self.velocity = {x:0, y:0};
	self.collides = (collide === undefined) ? true : collide;
	self.overlaps = function(other, callback) { return jsGame.Collision.overlaps(self, other, callback); }
	self.collide = function(other) { return jsGame.Collision.collide(self, other); }
	self.immovable = true;
	self.imageIndex = imageIndex;
	return self;
};

// loadTileMap takes a square size for the tiles, a string of CSV map data,
// a sprite sheet for the tiles, and an optional table of functions to call
// upon seeing a tile with a given index. It then creates a map be reading the
// CSV data and placing the appropriate tiles.
jsGame.LevelMap.loadTileMap = function(tilesize, data, tilestrip, indices){
	// Parse CSV (commas between cells, newlines between rows)
	var lines = data.split("\n");
	var h = lines.length;
	if(h === 0) { return; }
	var w = lines[0].split(",").length;
	if(w === 0) { return; }

	var map = jsGame.LevelMap(tilesize, w, h, tilestrip);

	for(var y = 0; y < h; ++y)
	{
		var cells = lines[y].split(",");
		for(var x = 0; x < w; ++x)
		{
			var index = cells[x];
			if(index !== "0") // 0 special case for "no tile thanks"
			{
				// If there's a function callback for this tileindex, call it.
				// But usually just place the tile.
				if(indices[index] === undefined){
					var t = jsGame.LevelMap.Tile(x, y, index, true);
					map.put(t, x, y);
				}
				else
				{
					indices[index](map, x, y);
				}
			}
		}
	}
	return map;
};

jsGame.LevelMap.doc = {};
jsGame.LevelMap.doc.loadTileMap = {type:"function", params:["tilesize", "data", "tilestrip", "[indices]"], desc:"Loads a map from a string. Indices is an object with tile-number keys and function(map,x,y) values"};
