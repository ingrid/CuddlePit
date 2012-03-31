window.onload = function(){
    jsGame.Sound.load('./assets/cuddlehappy2.wav');
    jsGame.Sound.load('./assets/cuddlesad.mp3');
    jsGame.Sound.load('./assets/overload.wav');
    initialize();
}

function initialize(){
	var game = jsGame.Game(800, 600);
	var overload = jsGame.Sound.play('./assets/overload.wav');
	overload.loop = true;
	//	var happySong2 = jsGame.Sound.play('./assets/cuddlehappy2.wav');
	//	happySong2.loop = true;

	// Dumb way to put a border around the game.
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
	player.setImage('./assets/penguin_idle.png', 80, 80);
	//	var walkAnim = jsGame.Animation.Strip([0, 1, 2, 3, 4, 5], 80, 80, 4.0);
	//	var idleAnim = jsGame.Animation.Strip([0], 80, 80, 1.0);
	//	player.playAnimation(walkAnim);
       	game.add(player);

	var guide = [];
	guide.x = 0;
	guide.y = 0;

	player.angle = 0;
	player.speed = 120;

       	player.update = jsGame.extend(player.update, function(elapsed){
		player.velocity.x = 0;
		player.velocity.y = 0;

		// This math might be terrible, should also be moved to mouse listener.
		var vec = [];
		vec.x = player.x - guide.x;
		vec.y = player.y - guide.y;
		if((Math.abs(player.x - guide.x) >= 1 ) && (Math.abs(player.y - guide.y) >= 5)){
		    player.angle = Math.atan2(vec.x, vec.y);

		    var dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

		    vec.x /= dist;
		    vec.y /= dist;
		    player.velocity.x = -vec.x * player.speed;
		    player.velocity.y = -vec.y * player.speed;
		    //		    player.playAnimation(walkAnim);
		}
		else{
		    //		    player.playAnimation(idleAnim);
		}
		
	    });

	player.render = function(context, camera){
		if(player.image !== null && player.visible){
		    context.save();
		    context.translate(player.x, player.y);
		    context.rotate(-(player.angle));
       		    //context.setTransform(1,0,0,1,0,0);
		    context.drawImage(player.image,
				      //					  player.frame.x,
				      //					  player.frame.y,
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

	game.run();
}
