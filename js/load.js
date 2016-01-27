var loadState = {
    preload: function() {
        var progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
        
        // Center the anchor so it shows up in the middle of the screen
        progressBar.anchor.setTo(0.5, 0.5);
        
        // Shows a loading bar as game preloading happens
        game.load.setPreloadSprite(progressBar);

        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
        
        game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
        game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
        game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);
        game.load.audio('music', ['assets/music.mp3']);
    },
    
    create: function() {
        game.state.start('menu');
    }
};