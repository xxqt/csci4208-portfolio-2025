// src/TitleScene.js
class TitleScene extends Phaser.Scene {
    constructor() {
        super('title'); // Register scene with key 'title'
    }

    create() {
        // Initialize game data
        this.create_game_data();

        // Display the title and instructions
        this.create_title();

        // Display the top score
        this.create_topscore();

        // Start the play scene on SPACE key press
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('play');
        });
    }

    // Display the title and instructions
    create_title() {
        const width = this.game.config.width;
        const height = this.game.config.height;

        // Game Title
        this.add.text(
            width / 2,
            height / 3,
            'DODGER GAME',
            { fontSize: '48px', fill: '#FFFFFF' }
        ).setOrigin(0.5);

        // Instructions
        this.add.text(
            width / 2,
            height / 2,
            'Arrow Keys to Move\nSpacebar to Fire',
            {
                fontSize: '24px',
                fill: '#FFFFFF',
                align: 'center' // Center-align multi-line text
            }
        ).setOrigin(0.5);

        // Start prompt
        this.add.text(
            width / 2,
            height * 2 / 3,
            'Press SPACE to Start',
            { fontSize: '24px', fill: '#FFFF00' }
        ).setOrigin(0.5);
    }

    // Initialize default game data in the registry
    create_game_data() {
        this.registry.set('top_score', this.registry.get('top_score') || 100);
        this.registry.set('winner', this.registry.get('winner') || 'Top Score');
    }

    // Display the top score on the title screen
    create_topscore() {
        const topScore = this.registry.get('top_score');
        const winner = this.registry.get('winner');

        const x = this.game.config.width / 2;
        const y = this.game.config.height - 50;

        this.add.text(
            x,
            y,
            `Leader: ${winner} - ${topScore}`,
            { fontSize: '20px', fill: '#FFFFFF' }
        ).setOrigin(0.5);
    }
}
