window.onload = function(){
    var titleGame = jsGame.Game(800, 600);
    
    var titleImg = jsGame.Sprite(0, 0);
    titleImg.setImage("./assets/title.png");
    titleGame.add(titleImg);

    titleGame._canvas.onmousedown = function(e)
    {
        titleGame.ended = true;
        titleGame._canvas.parentNode.removeChild(titleGame._canvas);
        initialize();
    }

    titleGame.run();
}

function initialize(){
	var game = jsGame.Game(800, 600);
	var gameOver = false;
	var won = false;
	var lost = false;
	var gameOverBg;
	var timerText = jsGame.Text(360,595);
	timerText.layer = 6;
	timerText.color = "rgb(255,255,255)";
	timerText.text = "";
	timerText.shadow = true;
	timerText.font = "30pt arial bold";
    game.add(timerText);

	// SFX
	var deathcry = jsGame.Sound.load('./assets/deathcry.mp3');
	var footstep2 = jsGame.Sound.load('./assets/footstep2.mp3');
	footstep2.volume = 0.9;
	var footstep1 = jsGame.Sound.load('./assets/footstep1.mp3');
	footstep1.volume = 0.4;
	var gonnagetcha1 = jsGame.Sound.load('./assets/gonnagetcha1.mp3');
	var gonnagetcha2 = jsGame.Sound.load('./assets/gonnagetcha2.mp3');
	var gonnagetcha3 = jsGame.Sound.load('./assets/gonnagetcha3.mp3');
	var gonnagetcha4 = jsGame.Sound.load('./assets/gonnagetcha4.mp3');
	var gonnagetcha5 = jsGame.Sound.load('./assets/gonnagetcha5.mp3');
	var harpeffect = jsGame.Sound.load('./assets/harpeffect422.mp3');
	var pop = jsGame.Sound.load('./assets/pop.mp3');
	var punch1 = jsGame.Sound.load('./assets/punch1.mp3');
	var punch2 = jsGame.Sound.load('./assets/punch2.mp3');
	var sigh = jsGame.Sound.load('./assets/sigheffect2.mp3');
	
	gonnagetcha1.volume = 0.7; gonnagetcha2.volume = 0.7; gonnagetcha3.volume = 0.7;
	gonnagetcha4.volume = 0.7; gonnagetcha5.volume = 0.7; harpeffect.volume = 0.7;
	sigh.volume = 0.7;

	game.heartPool = [];
	

	game.makeHeart = function(){
	    var heart = jsGame.Sprite(0,0);
	    heart.setImage("./assets/heart.png");
	    heart.visible = false;
	    heart.lifeSpan = 5;
	    heart.timer = 0;
	    heart.inUse = false;
	    heart.layer = 3;
	    heart.drawHeart = function(x, y){
		heart.x = x;
		heart.y = y;
		heart.ancor = x;
		heart.visible = true;
		heart.inUse = true;
		heart.update = function(elapsed){
		    if(heart.timer >= heart.lifeSpan){
			heart.timer = 0;
			heart.visible = false;
			heart.velocity.y = 0;
			heart.inUse = false;
			heart.update = function(elapsed){
			};
		    }else{
			heart.y -= 0.5;
			// Sine wave stuff.
			heart.x = x - Math.sin(heart.timer*3) * 20;
			heart.timer += game.elapsed;
		    }
		    };
	    };
	    game.add(heart);
	    return heart;
	};
	for(var h = 0; h < 30; h++){
	    game.heartPool[h] = game.makeHeart();
	}
	for(var h = 0; h < game.heartPool.length; h++){
	    game.heartPool[h].visible = false;
	}

	game.getHeart = function(){
	    for(var h = 0; h < game.heartPool.length; h++){
		if(game.heartPool[h].inUse === false){
		    return game.heartPool[h];
		}
	    }
	    return undefined;
	}

	var butterPool = [];

	var happySong2 = jsGame.Sound.load('./assets/cuddlepitmusicbright.mp3');
	happySong2.loop = true;
	happySong2.play();

	var cuddleSad = jsGame.Sound.load('./assets/cuddlepitmusicdark.mp3');
	cuddleSad.loop = true;
	cuddleSad.volume = 0;
	cuddleSad.play();

	var happyBG = jsGame.Sprite(0,0);
	happyBG.setImage("./assets/happybg.png");
	happyBG.fade = 1;
	happyBG.layer=-2;

	var sadBG = jsGame.Sprite(0,0);
	sadBG.setImage("./assets/sadbg.png");
	sadBG.fade = 0;
	sadBG.layer=-2;

	var oldHappyRender = happyBG.render;
	var oldSadRender = sadBG.render;

	happyBG.render = function(context, camera){
	    context.save()
	    context.globalAlpha = happyBG.fade;
	    oldHappyRender(context, camera);
	    context.restore();
	}

	sadBG.render = function(context, camera){
	    context.save()
   	    context.globalAlpha = sadBG.fade;
	    oldSadRender(context, camera);
	    context.restore();
	}

	var fading = false;
	var fadeTime = 0;
	var valOld = 1;
	var valNew = 0;
	var fadeInterval = 3;
	var fadeFlag = false;
	context = game._canvas.getContext('2d');
	game.crossfade = function(elapsed){
	    if((fading === false) && (fadeFlag === true)){
		fading = true
	    }
	    if(fading === true){
		if(fadeTime >= fadeInterval){
		    fading = false;
		    fadeFlag = false;
		    fadeTime = 0;
		}else{
		    var valOld = Math.cos(fadeTime/fadeInterval * Math.PI) * 0.5 + 0.5;
		    var valNew = 1 - valOld;
		    if(game.mood === 'happy'){
			happySong2.volume = valNew;
			cuddleSad.volume = valOld;
			happyBG.fade = valNew;
			sadBG.fade = valOld;
		    }else{
			happySong2.volume = valOld;
			cuddleSad.volume = valNew;
			happyBG.fade = valOld;
			sadBG.fade = valNew;
		    }
		    fadeTime += elapsed;	
		}	
	    }
	};

	game.highMoodMark = 80;
	game.goal = 60;
	game.lowMoodMark = 70;

	game.mood = 'happy'; // On of happy or sad.
	
	game.update = jsGame.extend(game.update, function(){
		game.crossfade(game.elapsed);
	    });

	var justClicked = false;

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

	game._canvas.onmousedown = function(e)
	{
	    justClicked = true;
	    for(var h = 0; h < enemies.getChildren().length; h++){
		enemies.getChildren()[h].hugged = false;
	    }
	    player.hugSoundPlayed = false;

	}

    var player = jsGame.Sprite(300, 150);

	var guide = [];
	guide.x = 0;
	guide.y = 0;

	player.setImage('./assets/penguin.png', 80, 80);
	var walkAnim = jsGame.Animation.Strip([1, 2, 3, 4, 5, 6], 80, 80, 7.0);
	var idleAnim = jsGame.Animation.Strip([0], 80, 80, 1.0);
	var hugAnim = jsGame.Animation.Strip([7], 80, 80, 1.0);
	player.playAnimation(walkAnim);
	game.add(player);
    
	player.hugarms = {left: [{x:0, y:0}, {x:-10, y:-20}], right: [{x:0, y:0}, {x:10, y:-20}] };
	player.hugging = false;
	player.hugMagnitude = 0;
	player.hugMagSpeed = 360;
	player.hugAngleSpeed = 3.0;
	player.hugMaxMagnitude = 100;
	player.hugStartAngle = Math.PI / 4;
	player.hugAngle = 0;
	player.hugMinAngle = -0.2;
	player.hugSoundPlayed = false;
	player.hugSounds = [harpeffect, sigh];
    
	player.angle = 0;
	player.speed = 120;
	player.collisionRadius = 25;
	
	player.currFrame = 1;
	player.layer = 1;

	player.update = jsGame.extend(player.update, function(elapsed){
	    player.velocity.x = 0;
	    player.velocity.y = 0;

	    // This math might be terrible, should also be moved to mouse listener.
	    var vec = [];
	    vec.x = player.x - guide.x;
	    vec.y = player.y - guide.y;
	    var dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

        if(dist != 0)
        {
            vec.x /= dist;
            vec.y /= dist;
        }
        else
        {
            vec.x = 0;
            vec.y = -1;
        }
        player.forward = vec;

		if(((Math.abs(player.x - guide.x) > 20 ) || (Math.abs(player.y - guide.y) > 20)) && !player.hugging){
		    player.angle = Math.atan2(vec.x, vec.y);

		    player.velocity.x = -vec.x * player.speed;
		    player.velocity.y = -vec.y * player.speed;
		    player.playAnimation(walkAnim);
		}
		else{
            if(player.hugging)
            {
                player.playAnimation(hugAnim);
            }
            else
            {
		      player.playAnimation(idleAnim);
            }
		}

        if(justClicked && !player.hugging && !lost)
        {
            player.hugging = true;
            player.hugMagnitude = 0;
            player.hugAngle = player.hugStartAngle;
    	    var voiceChance = Math.random();
    	    console.log(voiceChance);
    	    if(voiceChance <= 0.2){
    		gonnagetcha1.play();
    	    }
        }
        if(player.hugging)
        {
            player.hugMagnitude = Math.min(player.hugMagnitude + game.elapsed * player.hugMagSpeed, player.hugMaxMagnitude);
            if(player.hugMagnitude >= player.hugMaxMagnitude)
            {
                player.hugAngle = Math.max(player.hugAngle - game.elapsed * player.hugAngleSpeed, player.hugMinAngle);
                if(player.hugAngle <= player.hugMinAngle)
                {
                    player.hugging = false;
                    player.hugMagnitude = 0;
                }
            }
        }

        leftArmStart = {x: Math.sin(-player.angle-Math.PI/2) * 20, y: -Math.cos(-player.angle-Math.PI/2) * 20}
        rightArmStart = {x: Math.sin(-player.angle+Math.PI/2) * 20, y: -Math.cos(-player.angle+Math.PI/2) * 20}
        leftArmAngle = player.angle + player.hugAngle;
        leftArmEnd = {x: leftArmStart.x + Math.sin(-leftArmAngle) * player.hugMagnitude, y: leftArmStart.y + -Math.cos(-leftArmAngle) * player.hugMagnitude}
        rightArmAngle = player.angle - player.hugAngle;
        rightArmEnd = {x: rightArmStart.x + Math.sin(-rightArmAngle) * player.hugMagnitude, y: rightArmStart.y + -Math.cos(-rightArmAngle) * player.hugMagnitude}
        player.hugarms.left = [leftArmStart, leftArmEnd];
        player.hugarms.right = [rightArmStart, rightArmEnd];

	    });

	player.render = function(context, camera){


        context.lineCap = 'round';

        context.beginPath();
        context.strokeStyle = "#0f3591";
        context.lineWidth = 6;
        context.moveTo(player.hugarms.left[0].x + player.x,player.hugarms.left[0].y + player.y);
        context.lineTo(player.hugarms.left[1].x + player.x,player.hugarms.left[1].y + player.y);
        context.moveTo(player.hugarms.left[1].x + player.x,player.hugarms.left[1].y + player.y);
        context.lineTo(player.hugarms.left[0].x*0.8 + player.x,player.hugarms.left[0].y*0.8 + player.y);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.strokeStyle = "#1e62ba";
        context.lineWidth = 6;
        context.moveTo(player.hugarms.left[1].x + player.x - 1,player.hugarms.left[1].y + player.y - 3);
        context.lineTo(player.hugarms.left[0].x*0.7 + player.x - 1,player.hugarms.left[0].y*0.7 + player.y - 3);
        context.stroke();
        context.closePath();


        context.beginPath();
        context.strokeStyle = "#0f3591";
        context.lineWidth = 6;
        context.moveTo(player.hugarms.right[0].x + player.x,player.hugarms.right[0].y + player.y);
        context.lineTo(player.hugarms.right[1].x + player.x,player.hugarms.right[1].y + player.y);
        context.moveTo(player.hugarms.right[1].x + player.x,player.hugarms.right[1].y + player.y);
        context.lineTo(player.hugarms.right[0].x*0.8 + player.x,player.hugarms.right[0].y*0.8 + player.y);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.strokeStyle = "#1e62ba";
        context.lineWidth = 6;
        context.moveTo(player.hugarms.right[1].x + player.x - 1,player.hugarms.right[1].y + player.y - 3);
        context.lineTo(player.hugarms.right[0].x*0.7 + player.x - 1,player.hugarms.right[0].y*0.7 + player.y - 3);
        context.stroke();
        context.closePath();

        context.fillStyle = "rgba(0,0,0,0.2)";
        context.beginPath();
        context.arc(player.x + 5, player.y + 7, 25, 0, Math.PI*2, true);
        context.closePath();
        context.fill();

	    var newFrame = player.frame.x / player.width;
	    if((player.currFrame != newFrame) && ((newFrame === 2) || (newFrame === 5))){
		if(Math.random() >= 0.5){
		    footstep1.play();
		    if(footstep1.currentTime > 0)
		    {
                footstep2.play();
            }
		}else{
		    footstep2.play();
		    if(footstep2.currentTime > 0)
		    {
                footstep1.play();
            }
		}
	    }
	    player.currFrame = newFrame;
	    context.fillStyle = "rgba(0,0,0,0.2)";
	    context.beginPath();
	    context.arc(player.x + 5, player.y + 7, 25, 0, Math.PI*2, true);
	    context.closePath();
	    context.fill();

		if(player.image !== null && player.visible){
		    context.save();
		    context.translate(player.x, player.y);
		    context.rotate(-(player.angle));
		    context.drawImage(player.image,
				      player.frame.x,
				      player.frame.y,
				      player.width,
				      player.height,
				      -player.width/2,
				      -player.height/2,
				      player.width,
				      player.height);
			context.restore();
		}
		

	};
    proj = {x:0, y:0};
	game.render = jsGame.extend(game.render, function(context, camera){

    });
    
    game.update = jsGame.extend(game.update, function(){
        justClicked = false;
        for(var i in game._children)
        {
            var o1 = game._children[i];
            for(var j in game._children)
            {
                if(i == j) { continue; }
                var o2 = game._children[j];
                var dx = o1.x - o2.x;
                var dy = o1.y - o2.y;
                if(dx * dx + dy * dy <= (o1.collisionRadius + o2.collisionRadius)*(o1.collisionRadius + o2.collisionRadius))
                {
                    var d = Math.sqrt(dx*dx+dy*dy);
                    dx /= d;
                    dy /= d;
                    if(o1 != player)
                    {
                        o1.x += dx * 3;
                        o1.y += dy * 3;
                    }
                }
            }
        }
    });

    enemies = jsGame.CollisionGroup();

    game.avgFuzz = undefined;

    
    // Average fuzzy level.
    game.update = jsGame.extend(game.update, function(){
	    var totalFuzz = 0;
	    for(var i = 0; i < enemies.getChildren().length; i++){
		totalFuzz += enemies.getChildren()[i].fuzzies;
	    }
	    game.avgFuzz = totalFuzz/enemies.children.length;
	    
	    if((game.mood === 'sad') && (game.avgFuzz >= game.highMoodMark) && (fadeFlag === false)){
		game.mood = 'happy';
		fadeFlag = true;
	    }
	    if((game.mood === 'happy') && (game.avgFuzz <= game.lowMoodMark) && (fadeFlag === false)){
		game.mood = 'sad';
		fadeFlag = true;
	    }

	});

    // Level timer and Game Over
    game.numEnemies = 15;
	game.minEnemiesToWin = Math.ceil(game.goal * game.numEnemies / 100);
	game.timer = 0;
    game.levelTimeLimit = 85;

    game.update = jsGame.extend(game.update, function(){
		game.numEnemiesAlive = game.numEnemies;
		for(var f = 0; f < enemies.getChildren().length; f++){
			var candidate = enemies.getChildren()[f];
			if (candidate.state === 'dead')
				game.numEnemiesAlive--;
		}
		
    	timerText.text = Math.max(0,Math.floor(game.levelTimeLimit - game.timer));
        if(gameOverBg)
        {
            gameOverBg.fade += game.elapsed * 0.25;
        }
        if(!gameOver)
        {
    	    if(game.timer >= game.levelTimeLimit){
                console.log(game.avgFuzz);
    			if(game.avgFuzz >= game.goal){
    			    //Good Ending
                    var s = jsGame.Sprite(165, 200);
                    s.setImage("assets/win.png");
                    s.layer = 100;
                    game.add(s);
                    gameOver = true;
                    gameOverBg = jsGame.Sprite(0, 0);
                    gameOverBg.setImage("assets/winbg.png");
                    gameOverBg.fade = 0;
                    gameOverBg.layer = -1.5
                    game.add(gameOverBg);
                    won = true;
    			}else{
    				//Bad Ending (Time up)
                    var s = jsGame.Sprite(281, 200);
                    s.setImage("assets/lose.png");
                    s.layer = 100;
                    game.add(s);
                    gameOver = true;
                    gameOverBg = jsGame.Sprite(0, 0);
                    gameOverBg.setImage("assets/deathbg.png");
                    gameOverBg.fade = 0;
                    gameOverBg.layer = -1.5
                    game.add(gameOverBg);
                    lost = true;
    			}
    	    }else if(game.numEnemiesAlive < game.minEnemiesToWin){
    			//Bad Ending, too many died
                  var s = jsGame.Sprite(281, 200);
                  s.setImage("assets/lose.png");
                  s.layer = 100;
                  game.add(s);
                  gameOver = true;
                  gameOverBg = jsGame.Sprite(0, 0);
                  gameOverBg.setImage("assets/deathbg.png");
                  gameOverBg.fade = 0;
                  gameOverBg.layer = -1.5
                  game.add(gameOverBg);
                  lost = true;
    		}else{
    		game.timer += game.elapsed;
    	    }
    	    if(gameOverBg)
    	    {
                var oldRender = gameOverBg.render;
            	gameOverBg.render = function(context, camera){
            	    context.save()
            	    context.globalAlpha = gameOverBg.fade;
            	    oldRender(context, camera);
            	    context.restore();
            	}
            }
         }
	});

    makeEnemy = function(x,y){
	var enemy = jsGame.Sprite(x, y);
        enemy.setImage('./assets/fluff.png', 80, 80);
    	enemy.walkAnim = jsGame.Animation.Strip([1,2,3,4,5,6], 80, 80, 7.0);
    	enemy.idleAnim = jsGame.Animation.Strip([0], 80, 80, 1.0);
    	enemy.dieAnim = jsGame.Animation.Strip([7,8,9,10,11,12,13,14], 80, 80, 16.0);
    	enemy.dieAnim.looping = false;
    	enemy.playAnimation(enemy.walkAnim);
    	enemy.wanderTimer = 0;
    	enemy.targetX = 0;
    	enemy.targetY = 0;

	//Default Enemy starting state
	enemy.fuzzies = 60 + Math.random() * 20;
	enemy.health = 100;
	enemy.state = 'wandering';
	enemy.aggroRadius = 20;
	enemy.attackTimer = 0;
	enemy.layer = Math.random();
	enemy.hugged = false;
	enemy.fuzzyTimer = 1;

    	enemy.speed = 70;
    	enemy.collisionRadius = 10;
        game.add(enemy);
        enemies.add(enemy);

        enemy.update = jsGame.extend(enemy.update, function(elapsed){
        if(enemy.state == 'dead') { enemy.velocity.x = enemy.velocity.y = 0; return; }
		if(enemy.fuzzyTimer <= 0){
            if(won)
            {
              enemy.fuzzies = Math.min(enemy.fuzzies + 5, 100);
              enemy.targetX = player.x;
              enemy.targetY = player.y;
            }
            else
            {
		      enemy.fuzzies = Math.max(enemy.fuzzies - 3, 0);
            }
		    enemy.fuzzyTimer = 1
		}else{
		    enemy.fuzzyTimer -= game.elapsed;

		}

		//Enemy Irritated state
		if(enemy.fuzzies <= 70 && enemy.fuzzies > 25)
		{
            enemy.setImage('./assets/fluff2.png', 80, 80);
        }
		
		//Enemy Happy state
        if(enemy.fuzzies > 70)
        {
            enemy.setImage('./assets/fluff.png', 80, 80);
        }
        
        //Enemy Angry State
        if(enemy.fuzzies < 25)
        {
            enemy.setImage('./assets/fluff3.png', 80, 80);
        }

		//When an enemy fights
		if(enemy.fuzzies <= 70){
		    enemy.state = 'fighting';
		}
		else{
		    enemy.state = 'wandering';
		}

        enemy.aggroRadius = Math.max(0,(70 - enemy.fuzzies)*2);

		if(enemy.health <= 0 && enemy.state != 'dead'){
		    // Play death animation.
		    enemy.state = 'dead';
		    enemy.collisionRadius = 0;
		    //enemy.visible = false;
		    enemy.playAnimation(enemy.dieAnim);
		    enemy.velocity.x = 0;
		    enemy.velocity.y = 0;
		    enemy.layer = -1;
		    pop.play();
		    return;
		}

		else{
		    if(enemy.state === 'fighting'){
		if(enemy.fightTarget === undefined){
			    // Try to find a target.
			    for(var e = 0; e < enemies.getChildren().length; e++){
				var candidate = enemies.getChildren()[e];
				if(candidate.state != 'dead' && candidate != enemy){
				    var vec = [];
				    vec.x = enemy.x - candidate.x;
				    vec.y = enemy.y - candidate.y;

				    distsq = vec.x * vec.x + vec.y * vec.y;
				    if(distsq <= enemy.aggroRadius * enemy.aggroRadius){
					   enemy.fightTarget = candidate;
				    }
				}
			    }
			}
			if((enemy.fightTarget === undefined) || (enemy.fightTarget.state ==='dead')){
			    enemy.fightTarget = undefined;
			    // Couldn't find a target, fall back to wandering, or enemy is dead.
			    enemy.state = 'wandering';
			}else{
  				enemy.targetX = enemy.fightTarget.x;
  				enemy.targetY = enemy.fightTarget.y;
  				
  				var dx = enemy.x - enemy.fightTarget.x;
  				var dy = enemy.y - enemy.fightTarget.y;

  				if(dx*dx+dy*dy <= 35*35 && enemy.attackTimer <= 0){
  				    enemy.fightTarget.health -= 10;
  				    enemy.fuzzies -= 5;
  				    


  				    //alert(enemy.fightTarget.health);
  				    enemy.attackTimer = 1.5;
  				    if(Math.random() > 0.5)
  				    {
  				      punch1.play();
                    }
                    else
                    {
                      punch2.play(); 
                    }

  				}
  				else{
  				    enemy.attackTimer -= game.elapsed;
  				}
			}
		    }
		    if((enemy.fightTarget === undefined) || (enemy.fightTarget.state ==='dead')){
			enemy.fightTarget = undefined;
			// Couldn't find a target, fall back to wandering, or enemy is dead.
			enemy.state = 'wandering';
		    }else{
			if(enemy.attackTimer <= 0){
			    var vec = [];
			    vec.x = enemy.x - enemy.fightTarget.x;
			    vec.y = enemy.y - enemy.fightTarget.y;

			    var dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
			    
			    if(dist != 0){
				vec.x /= dist;
				vec.y /= dist;
			    }
			    else{
				vec.x = 0;
				vec.y = -1;
			    }

			    if(dist <= 5){
				enemy.fightTarget.health -= 1;
				enemy.attackTimer = 5;
			    }
			    else{
				enemy.attackTimer -= game.elapsed;
			    }
			}
		    }
		}
		if(enemy.state === 'wandering'){
            enemy.fightTarget = undefined;
		    if(enemy.wanderTimer <= 0){
			enemy.wanderTimer = Math.random() * 5 + 1;
			enemy.targetX = Math.random() * 700 + 50;
			enemy.targetY = Math.random() * 500 + 50;
		    }
		    enemy.wanderTimer -= elapsed;
        }
		    enemy.velocity.x = 0;
		    enemy.velocity.y = 0;

		    // This math might be terrible, should also be moved to mouse listener.
		    var vec = [];
		    vec.x = enemy.x - enemy.targetX;
		    vec.y = enemy.y - enemy.targetY
		    var dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

		    if(dist != 0)
			{
			    vec.x /= dist;
			    vec.y /= dist;
			}
		    else
			{
			    vec.x = 0;
			    vec.y = -1;
			}

		    enemy.collisionRadius = Math.min(enemy.collisionRadius + elapsed * 20, 10);


		    if(((Math.abs(enemy.x - enemy.targetX) > 20 ) || (Math.abs(enemy.y - enemy.targetY) > 20))){
			enemy.angle = Math.atan2(vec.x, vec.y);

			enemy.velocity.x = -vec.x * enemy.speed;
			enemy.velocity.y = -vec.y * enemy.speed;
			enemy.playAnimation(enemy.walkAnim);
		    }
		    else{
			enemy.playAnimation(enemy.idleAnim);
		    }

		    if(player.hugging)
			{
			    project = function(ax,ay,bx,by)
			    {
				d = (bx*bx+by*by);
				dot = bx * ax + by * ay;
				temp = dot/d;
				return {x:bx*temp, y:by*temp};
			    };
			    testArm = function(arm)
			    {
				leftProj = project(enemy.x - arm[0].x - player.x, enemy.y - arm[0].y - player.y,
						   arm[1].x - arm[0].x,
						   arm[1].y - arm[0].y);
				if(leftProj.x * leftProj.x + leftProj.y * leftProj.y <= player.hugMagnitude * player.hugMagnitude)
				    {
                    if(leftProj.x * player.forward.x + leftProj.y * player.forward.y > 0) { return; }
					ldx = leftProj.x - (enemy.x - arm[0].x - player.x); ldy = leftProj.y - (enemy.y - arm[0].y - player.y);
					if( ldx*ldx+ldy*ldy <= 100)
					    {

						if(player.hugSoundPlayed === false){
						    player.hugSoundPlayed = true;
						    var snd = Math.floor(Math.random() * player.hugSounds.length);
						    var hugSound = player.hugSounds[snd];
						    hugSound.play();
						}
						dx = enemy.x - (player.x + player.forward.x * -80);
						dy = enemy.y - (player.y + player.forward.y * -80);
						d = Math.sqrt(dx*dx+dy*dy);
						if(d > 0)
						    {
							enemy.x += -dx / d * 2;
							enemy.y += -dy / d * 2;
						    }
						enemy.targetX = player.x;
						enemy.targetY = player.y;
						enemy.collisionRadius = 3;
						if(enemy.hugged === false){
						    enemy.hugged = true;
						    enemy.fuzzies = Math.min(enemy.fuzzies + 50, 100);
						    var heartSpawn = game.getHeart();
						    if(heartSpawn != undefined){
							heartSpawn.drawHeart(enemy.x, enemy.y);
						    }
						}
					    }
				    }
			    }
			    testArm(player.hugarms.left);
			    testArm(player.hugarms.right);
			}

		// Fence logic.
		if(enemy.x <= 40){
		    enemy.velocity.x = 20;
		}
		if(enemy.x >= 760){
		    enemy.velocity.x = -20;
		}
		if(enemy.y <= 40){
		    enemy.velocity.y = 20;
		}
		if(enemy.y >= 560){
		    enemy.velocity.y = -20;
		}

			});


	    enemy.render = function(context, camera){
            if(enemy.health > 0)
            {
        		context.fillStyle = "rgba(0,0,0,0.2)";
        		context.beginPath();
        		context.arc(enemy.x + 5, enemy.y + 7, 20, 0, Math.PI*2, true);
        		context.closePath();
        		context.fill();
            }

    		if(enemy.image !== null && enemy.visible){
    		    context.save();
    		    context.translate(enemy.x, enemy.y);
    		    context.rotate(-(enemy.angle));
    		    context.drawImage(enemy.image,
    				      enemy.frame.x,
    				      enemy.frame.y,
    				      enemy.width,
    				      enemy.height,
    				      -enemy.width/2,
    				      -enemy.height/2,
    				      enemy.width,
    				      enemy.height);
    			context.restore();
    		}
    	};
    }

    for(var i = 0; i < game.numEnemies; i++)
	{
	    makeEnemy(Math.random()*700+50,Math.random()*500+50);
	}

    game.add(sadBG);
    
    game.add(happyBG);
    
    game.run();
}
