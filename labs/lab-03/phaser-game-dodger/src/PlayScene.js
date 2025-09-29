class PlayScene extends Phaser.Scene {
    // Construct new scene
    constructor() {
        // Set this scene's id within superclass constructor
        super('play');
        // this.top_score = 100;
        // this.winner = 'Top Score'
    }

    // Preload external game assets
    preload() {
        this.load.path = 'assets/'; //Define file path 
        this.load.image('background', 'background.png'); //Load tile images
        this.load.image('player', 'player.png'); //Load player image
        this.load.image('enemy', 'enemy.png'); //Load enemy image
        this.load.image('powerup-projectile', 'powerup-1.png'); //Load projectile image 
        this.load.image('powerup-slay', 'powerup-2.png'); //Load projectile image
        this.load.image('projectile', 'projectile.png'); //Load projectile image

        this.load.image('player-0', 'player-0.png'); //Load walk frame 0 
        this.load.image('player-1', 'player-1.png'); //Load walk frame 1
        this.load.image('enemy-0', 'enemy-0.png'); //Load walk frame 0 
        this.load.image('enemy-1', 'enemy-1.png'); //Load walk frame 1
    }

    // Create game data
    create() {
        this.create_map();//create level
        this.create_projectiles(); //create projectiles
        this.create_animations(); //create animations
        this.create_player(); //helper method: create player
        this.create_enemies(); //helper method: create enemies
        this.create_powerups();
        this.create_collisions(); //create physics-related behaviors
        this.create_hud(); //create hud
        this.input.keyboard.on('keydown-ESC', () => { this.scene.start('title'); });
    }

    // Update game data
    update(time) {
        this.update_player(time);
        this.update_background();
        this.update_score();
    }

    //update game state 
    update_player(time) {
        this.player.move();
        this.player.attack(time);
    }

    update_score() {
        this.score_text.setText("Score: " + this.score);
        this.top_score_text.setText("Top Score: " + this.top_score);
    }


    update_background() {
        this.background.tilePositionX += 3;
    }

    //Load level 
    create_map() {
        this.background = this.add.tileSprite(640 / 2, 480 / 2, 640, 480, 'background');
    }

    create_player() {
        this.player = new Player(this); //create player 
    }

    create_enemies() {
        this.enemies = [];

        const event = new Object();
        event.delay = 200;
        event.callback = this.spawn_enemy;
        event.callbackScope = this;
        event.loop = true;

        this.time.addEvent(event, this);
    }

    spawn_enemy() {
        const config = {};
        config.x = 640 + 32;
        config.y = Phaser.Math.Between(0, 480);

        const monster = new Enemy(this, config);
        this.enemies.push(monster);
        this.score += 1;
    }

    // Sets up overlap collision behaviors
    create_collisions() {
        // Player and enemies collision triggers game over
        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.game_over,
            null,
            this
        );

        // Player projectiles and enemies collision destroys both
        this.physics.add.overlap(
            this.player_projectiles,
            this.enemies,
            this.slay_enemy,
            null,
            this
        );

        // Enemy projectiles and player collision triggers game over
        this.physics.add.overlap(
            this.enemy_projectiles,
            this.player,
            this.game_over,
            null,
            this
        );

        // Player and power-ups collision applies the power-up
        this.physics.add.overlap(
            this.player,
            this.powerups,
            this.collectPowerUp,
            null,
            this
        );
    }




    create_hud() {
        // Initialize score
        this.score = 0;

        // Player score display
        this.score_text = this.add.text(32, 32, "");
        this.score_text.depth = 3;
        this.score_text.setColor('rgb(255,255,255)');

        // Initialize persistent state by reading from the registry
        const { winner, top_score } = this.registry.values;

        // Top score display
        this.top_score_text = this.add.text(600, 32, `${winner}: ${top_score}`);
        this.top_score_text.depth = 3;
        this.top_score_text.setOrigin(1, 0);
    }



    // Create animations
    create_animations(scene) {
        if (!this.anims.exists('player-move')) {
            const anim_player_move = new Object();
            anim_player_move.key = 'player-move'; // Key to register into Phaser
            anim_player_move.frames = [
                { key: 'player-0' },
                { key: 'player-1' }
            ]; // List of image keys for anim
            anim_player_move.frameRate = 6;  // Speed to play animation
            anim_player_move.repeat = -1;    // -1 for infinite loop

            this.anims.create(anim_player_move); // Factory creates anim obj
        }
        if (!this.anims.exists('enemy-move')) {
            const anim_enemy_move = new Object();
            anim_enemy_move.key = 'enemy-move'; // Key to register into Phaser
            anim_enemy_move.frames = [
                { key: 'enemy-0' },
                { key: 'enemy-1' }
            ]; // List of image keys for anim
            anim_enemy_move.frameRate = 6;  // Speed to play animation
            anim_enemy_move.repeat = -1;    // -1 for infinite loop

            this.anims.create(anim_enemy_move); // Factory creates anim obj
        }


    }

    game_over() {
        const { top_score } = this.registry.values;

        // Check for new high score
        if (this.score >= top_score) {
            this.registry.set('top_score', this.score);

            // Freeze gameplay
            this.physics.pause();

            // Prompt for winner's name
            const winnerName = prompt(`New High Score! Enter your name:`);
            this.registry.set('winner', winnerName || 'Top Score');

            // Reset Phaser keyboard input
            this.input.keyboard.resetKeys(); // safer than manually clearing keys
        }

        // Flash the camera for effect
        this.cameras.main.flash();

        // Restart the scene
        this.scene.restart();
    }



    update_score() {
        // Update current score display
        this.score_text.setText(`Score: ${this.score}`);

        // Update top score display from registry
        const { winner, top_score } = this.registry.values;
        this.top_score_text.setText(`${winner}: ${top_score}`);
    }


    create_projectiles() {
        this.player_projectiles = [];
        this.enemy_projectiles = [];
    }

    slay_enemy(projectile, enemy) {
        enemy.destroy();
        projectile.destroy();
    }

    update_enemies(time) {
        this.enemies.forEach(enemy => enemy.attack(time));
    }

    create_powerups() {
        this.powerups = [];

        const event = new Object();
        event.delay = 3000;
        event.callback = this.spawn_powerup;
        event.callbackScope = this;
        event.loop = true;

        this.time.addEvent(event, this);
    }

    // The powerup spawner
    // The powerup spawner
    spawn_powerup() {
        this.powerup_types = [ProjectilePowerUp, SlayPowerUp];

        // 20% chance to spawn (0 out of 0-4)
        if (Phaser.Math.Between(0, 4) !== 0) return;

        // 1. Pick a random PowerUp CLASS from our array
        const PowerUpClass = Phaser.Utils.Array.GetRandom(this.powerup_types);

        // 2. Define the spawn position
        const position = {
            x: 640 + 32,
            y: Phaser.Math.Between(50, 430)
        };

        // 3. Instantiate the chosen class and add it to a SINGLE group/array
        const powerup = new PowerUpClass(this, position.x, position.y);
        this.powerups.push(powerup);
    }


    // The beautifully simple, polymorphic callback
    collect_powerup(player, powerup) {
        // Tell the power-up to do its thing. The scene doesn't care what it is.
        powerup.applyEffect(player);
        powerup.destroy();
    }







}
