window.onload = function(){
	initialize();
}

function initialize(){
	var game = jsGame.Game(500, 300);

	// Dumb way to put a border around the game
	game._canvas.style.border="1px solid black";

	game._canvas.onmousemove = function(e) {
	    var mouseX, mouseY;

	    if(e.offsetX) {
		mouseX = e.offsetX;
		mouseY = e.offsetY;
	    }
	    else if(e.layerX) {
		mouseX = e.layerX;
		mouseY = e.layerY;
	    }
	    guide.x = mouseX;
	    guide.y = mouseY;
	};

       	var player = jsGame.Sprite(300, 150);
	//       	player.rectangleImage(20, 20, "rgb(0,0,0)");
	player.setImage('./assets/sheet.png', 64, 64);
	var walkAnim = jsGame.Animation.Strip([0, 1, 2, 3, 4, 5], 64, 64, 4.0, 0, 0);
	player.playAnimation(walkAnim);
       	game.add(player);

	var guide = [];
	guide.x = 0;
	guide.y = 0;

	player.angle = 0;
	player.speed = 50;

       	player.update = jsGame.extend(player.update, function(elapsed){
		if (player.x === guide.x){
		    player.velocity.x = 0;
		}
		else{
		    if (player.x > guide.x){
			player.velocity.x = -player.speed;
		    }
		    else{
			player.velocity.x = player.speed;
		    }
		}
		if (player.y === guide.y){
		    player.velocity.y = 0;
		}
		else{
		    if (player.y > guide.y){
			player.velocity.y = -player.speed;
		    }
		    else{
			player.velocity.y = player.speed;
		    }
		}

		// This math might be terrible, should also be moved to mouse listener.
		var vec = [];
		vec.x = player.x - guide.x;
		vec.y = player.y - guide.y;
		if((Math.abs(player.x - guide.x) >= 1 ) && (Math.abs(player.y - guide.y) >= 5)){
		    player.angle = Math.atan2(vec.x, vec.y);
		}
		
	    });

	//	player.oldRender = player.render;
	player.oldRender = function(context, camera){
		if(player.image !== null && player.visible){
		    context.save();
		    context.translate(player.x, player.y);

		    context.rotate(-(player.angle + 1.5));
		    //		    context.setTransform(1,0,0,1,0,0);
		    //		    context.setTransform(0.93,0.3,-0.3,0.93,0,0);
		    context.drawImage(player.image,
					  //	player.x - camera.scroll.x * player.parallax.x,
					  //player.y - camera.scroll.y * player.parallax.y,
					  0,
					  0,
					  player.width,
					  player.height,
					  -player.width/2,
					  -player.height/2,
					  player.width,
					  player.height);
			context.restore();
		}
	};

	player.render = function(context, camera){
		// Add angle caclculations here. Happens every render,
		// but should be fine on player sprite?

		

		player.oldRender(context, camera);


	    };

	var tail = jsGame.Sprite(300, 150);
       	tail.rectangleImage(20, 20, "rgb(255,0,0)");
       	game.add(tail);

	game.run();
}
