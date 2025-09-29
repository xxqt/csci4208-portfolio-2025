class PowerUp extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.depth = 1;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.velocity.x = -300;
    }

    // Placeholder method for subclasses to override
    applyEffect(player) {
        console.warn('applyEffect not implemented for this power-up type.');
    }
}

// SlayPowerUp subclass
class SlayPowerUp extends PowerUp {
    constructor(scene, x, y) {
        super(scene, x, y, 'powerup-slay');
    }

    applyEffect(player) {
        // Access the scene to clear enemies and bullets
        const scene = this.scene;

        // Destroy all enemies
        scene.enemies.forEach(monster => monster.destroy());

        // Destroy all enemy projectiles
        scene.enemy_projectiles.forEach(bullet => bullet.destroy());

        // Flash the camera as a visual effect
        scene.cameras.main.flash();
    }
}


// SlayPowerUp subclass underneath superclass
class ProjectilePowerUp extends PowerUp {
    constructor(scene, x, y) {
        // Pass the specific texture key to the parent
        super(scene, x, y, 'powerup-projectile');
    }

    // Override the base method with specific logic
    applyEffect(player) {
        player.projectileScale = Math.min(player.projectileScale + 1, 3);
    }
}

