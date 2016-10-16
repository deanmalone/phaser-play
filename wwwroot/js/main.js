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
	
	var game = new Phaser.Game(w, h, Phaser.AUTO, '', { preload: preload, create: create });

    function preload() {

        game.scale.pageAlignVertically = true;
        game.scale.pageAlignHorizontally = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        game.load.image('bg', 'assets/images/background.png');

    }

    function create() {

        game.add.image(0, 0, 'bg');
    
    }

};
