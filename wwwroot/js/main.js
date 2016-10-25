window.onload = function() {
	
	var w = window.innerWidth;
	var h = window.innerHeight;
	var f = h / w;
	
	if (w > h) {
		w = 1200;
		h = w * f;
	} else {
		h = 800;
		w = 800 / f;
	}
	
	var game = new Phaser.Game(w, h, Phaser.AUTO, '', { preload: preload, create: create, update,update });
    var score = 0;
    var scoreText;
    var sky;
    var map;
    var layer;
    var items;
    var player;
    var cursors;
    var virtualcontroller = {};

    function preload() {

        // Setup scale mode
        game.scale.pageAlignVertically = true;
        game.scale.pageAlignHorizontally = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        game.load.image('sky', 'assets/images/sky.png');
        game.load.image('tiles', 'assets/images/tiles.png');
        game.load.spritesheet("player","assets/images/player.png",32,48);
        game.load.tilemap('map', 'assets/images/map.json', null, Phaser.Tilemap.TILED_JSON);

        game.load.spritesheet('buttonleft', 'assets/images/button-round.png',96,96);
        game.load.spritesheet('buttonright', 'assets/images/button-round.png',96,96);
        game.load.spritesheet('buttonjump', 'assets/images/button-round-a.png',96,96);

        game.load.image('star', 'assets/images/star.png');

    }

    function create() {

        // The Arcade Physics system provides a lightweight physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Add the sky as our background
        sky = game.add.image(0, 0, 'sky');
        sky.fixedToCamera = true;

        // Setup our tilemap
        map = game.add.tilemap('map');

        // The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
        // The second parameter maps this name to the Phaser.Cache key 'tiles'
        map.addTilesetImage('tiles', 'tiles');

        // Creates a layer from the World layer in the map data.
        // A Layer is effectively like a Phaser.Sprite, so is added to the display list.
        layer = map.createLayer("background");
        map.setCollisionBetween(1, 156, true, "background", true); // all sprites are 

        // This resizes the game world to match the layer dimensions
        layer.resizeWorld();

        map.createLayer("foreground");

        // add the stars, based on object layer
        items = game.add.group(game.world,'mygroup',false,true,Phaser.Physics.ARCADE);
        var stars = map.objects["items"];
        for (var i in stars) {
            items.create(stars[i].x, stars[i].y - 32, 'star'); // need to confirm positioning...
        }

        // The player and its settings
        player = game.add.sprite(100, 100, 'player');
        game.physics.arcade.enable(player);
        game.camera.follow(player);

        player.body.bounce.y = 0.2;
        player.body.gravity.y = 500;
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        player.frame = 4;
        player.inputEnabled = true;
        player.body.collideWorldBounds = true;
        
        // display a score
        scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#ffe' });
        scoreText.fixedToCamera = true; 

        // setup keyboard input (for desktop)
        cursors = game.input.keyboard.createCursorKeys();

        // setup virtual game controller buttons (for mobile)
        var buttonjump = game.add.button(w - 100, h -100, 'buttonjump', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
        buttonjump.fixedToCamera = true;  //our buttons should stay on the same place  
        buttonjump.events.onInputOver.add(function(){virtualcontroller.jump=true;});
        buttonjump.events.onInputOut.add(function(){virtualcontroller.jump=false;});
        buttonjump.events.onInputDown.add(function(){virtualcontroller.jump=true;});
        buttonjump.events.onInputUp.add(function(){virtualcontroller.jump=false;});        

        var buttonleft = game.add.button(0, h-100, 'buttonleft', null, this, 0, 1, 0, 1);
        buttonleft.fixedToCamera = true;
        buttonleft.events.onInputOver.add(function(){virtualcontroller.left=true;});
        buttonleft.events.onInputOut.add(function(){virtualcontroller.left=false;});
        buttonleft.events.onInputDown.add(function(){virtualcontroller.left=true;});
        buttonleft.events.onInputUp.add(function(){virtualcontroller.left=false;});

        var buttonright = game.add.button(128, h-100, 'buttonright', null, this, 0, 1, 0, 1);
        buttonright.fixedToCamera = true;
        buttonright.events.onInputOver.add(function(){virtualcontroller.right=true;});
        buttonright.events.onInputOut.add(function(){virtualcontroller.right=false;});
        buttonright.events.onInputDown.add(function(){virtualcontroller.right=true;});
        buttonright.events.onInputUp.add(function(){virtualcontroller.right=false;});

    }


    function update(){

        //  Collide the player and the layer
        game.physics.arcade.collide(player, layer);

        //  Check if player has collected any stars
        game.physics.arcade.overlap(player, items, collisionHandler, null, this);
        
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown || virtualcontroller.left)
        {
            //  Move to the left
            player.body.velocity.x = -150;
            player.animations.play('left');
        }
        else if (cursors.right.isDown || virtualcontroller.right)
        {
            //  Move to the right
            player.body.velocity.x = 150;
            player.animations.play('right');
        }
        else
        {
            //  Stand still and return to middle frame
            player.animations.stop();
            player.frame = 4;
        }
        
        //  Allow the player to jump if they are touching the ground.
        if ((cursors.up.isDown || virtualcontroller.jump) && player.body.onFloor())
        {
            player.body.velocity.y = -400;
        }
    }

    function collisionHandler (player, item) {
        
        console.log("collisionHandler");

        // remove the star
        item.kill();

        //  Update the score
        score += 10;
        scoreText.text = 'Score: ' + score;

        return true;

    }

};
