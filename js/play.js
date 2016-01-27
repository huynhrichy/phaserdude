var player;
var platforms;
var cursors;
var enemies;

var stars;
var score;
var scoreText;

var jumpSound, starSound, deadSound, music;

var playState = {
    create: function() {
        score = 0;
        
        // Give physics to the world itself
        game.world.enableBody = true;

        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;

        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Now let's create two ledges
        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;
        
        ledge = platforms.create(-230, 467, 'ground'); 
        ledge.body.immovable = true;

        // The player and its settings
        player = game.add.sprite(175, game.world.height - 150, 'dude');
        
        //player.anchor.x = 0.5;

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.05;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        //  Finally some stars to collect
        stars = game.add.group();

        //  We will enable physics for any star that is created in this group
        stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++)
        {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;

        // Enemies group
        enemies = game.add.group();}

        // Creates an enemy or two
        enemies.create(750, 350, 'baddie');
        enemies.create(600, 350, 'baddie');

        // Physics enabled for enemies
        enemies.enableBody = true;
        game.physics.arcade.enable(enemies);

        // Gives the enemy group gravity
        enemies.setAll('body.gravity.y', 400);

        // Gives the enemy group a tiny bounce
        enemies.setAll('body.bounce.y', 0.1);

        // Enemies hit the world bounds
        enemies.setAll('body.collideWorldBounds', true);

        // Gives enemies initial movement
        enemies.setAll('body.velocity.x', -50);

        // Gives each enemy animations
        enemies.forEachAlive(function(enemy) {
            enemy.animations.add('left', [0, 1], 10, true);
            enemy.animations.add('right', [2, 3], 10, true);
        }, this);

        //  The score
        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#ffffff' });

        //  Our controls
        cursors = game.input.keyboard.createCursorKeys();
        
        // Sounds
        jumpSound = game.add.audio('jump');
        jumpSound.allowMultiple = false;
        starSound = game.add.audio('coin');
        deadSound = game.add.audio('dead');
        music = game.add.audio('music');
        music.loop = true;
        //music.play();
    },
    
    update: function() {
        //  Collide between the player, stars, enemies, and platforms
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.collide(enemies, platforms);
        game.physics.arcade.collide(enemies, enemies);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        game.physics.arcade.collide(player, enemies, this.killPlayer, null, this);
        game.physics.arcade.overlap(player, stars, this.collectStar, null, this);
        
        if (stars.countDead() == 12) {
            this.winGame();
        }

        //  Reset the players velocity (movement)
        if (player.body.touching.down) {
            player.body.velocity.x = 0;
        }

        // Make each enemy move
        enemies.forEachAlive(function(enemy) {

            if (enemy.body.touching.left || enemy.body.x == 0) {
                enemy.body.velocity.x = 50;
            } 

            if (enemy.body.touching.right|| enemy.body.x == game.world.width - enemy.width) {
                enemy.body.velocity.x = -50;
            }


            if (enemy.body.velocity.x <= 0) {
                enemy.animations.play('left');
            } else {
                enemy.animations.play('right');
            }

            //console.log(enemy.body.velocity.x);

        }, this);
        
        if (player.body.touching.down) {
            if (cursors.left.isDown)
            {
                //  Move to the left
                player.body.velocity.x = -250;

                player.animations.play('left');
            }
            else if (cursors.right.isDown)
            {
                //  Move to the right
                player.body.velocity.x = 250;

                player.animations.play('right');
            }
            else
            {
                //  Stand still
                player.animations.stop();

                player.frame = 4;
            }          
        }
        
        //  Allow the player to jump if they are touching the ground.
        game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(function() {
            if (player.body.touching.down)
            {
                if (!jumpSound.isPlaying) {
                    jumpSound.play();
                }
                player.body.velocity.y = -250;
            }
            
        }, this);
        
        if (!player.body.touching.down) {
            if (player.body.velocity.x < 0) {
                player.frame = 3;   
            } else {
                player.frame = 6;
            }
        }
        
        if (player.body.touching.left || player.body.touching.right) {
            player.body.velocity.y = 0;
        }
    },
    
    collectStar: function(player, star) {
        starSound.play();
        
        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        score += 10;
        scoreText.text = 'Score: ' + score;
    },
    
    killPlayer: function(player, enemy) {
        deadSound.play();
        music.stop();
        game.state.start('menu');
    },
    
    winGame: function() {
        music.stop();
        game.state.start('menu');
    }
};