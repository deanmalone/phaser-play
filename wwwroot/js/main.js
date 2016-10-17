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
    var sky;
    var map;
    var layer;
    var player;
    var cursors;

    function preload() {

        // Setup scale mode
        game.scale.pageAlignVertically = true;
        game.scale.pageAlignHorizontally = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        game.load.image('sky', 'assets/images/sky.png');
        game.load.image('tiles', 'assets/images/tiles.png');
        game.load.spritesheet("player","assets/images/player.png",32,48);
        game.load.tilemap('map', 'assets/images/map.json', null, Phaser.Tilemap.TILED_JSON);

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
        layer = map.createLayer('world');
        map.setCollisionBetween(1, 156); // all sprites are 

        // This resizes the game world to match the layer dimensions
        layer.resizeWorld();

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
        

        // setup keyboard input
        cursors = game.input.keyboard.createCursorKeys();
    }


    function update(){

        //  Collide the player and the layer
        game.physics.arcade.collide(player, layer);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -150;
            player.animations.play('left');
        }
        else if (cursors.right.isDown)
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
        if (cursors.up.isDown && player.body.onFloor())
        {
            player.body.velocity.y = -400;
        }

    }

};
