export default class Pong extends Phaser.Scene {
  constructor() {
    super({ key: "Pong" });
  }

  create() {
    this.gameOptions = {
      playerSpeed: 400,
      ballSpeedStart: [-200, 200],
      ballSpeedX: 300,
      ballSpeedY: 70,
    };
    // Center
    this.center = {
      x: this.physics.world.bounds.width / 2,
      y: this.physics.world.bounds.height / 2,
    };

    this.firstBall = true;

    this.background = this.add.image(this.center.x, this.center.y, "bg");
    this.background.setDisplaySize(this.center.x * 2, this.center.y * 2);

    this.impactSound = this.sound.add("impact", { volume: 0.2 });

    this.particles = this.add.particles("particle");
    this.emitter = this.particles.createEmitter({
      scale: { start: 1, end: 0 },
      speed: 20,
      lifespan: 400,
      blendMode: "ADD",
    });

    this.ball = this.physics.add.sprite(this.center.x, this.center.y, "ball");
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);
    this.ball.setVelocity(
      this.gameOptions.ballSpeedStart[
        Math.floor(Math.random() * this.gameOptions.ballSpeedStart.length)
      ]
    );
    this.ball.setScale(0.5);
    this.emitter.startFollow(this.ball);

    this.paddleLeftPoints = 0;
    this.paddleRightPoints = 0;
    this.scoreText = this.add.text(
      this.center.x + 50,
      50,
      this.paddleLeftPoints + " - " + this.paddleRightPoints,
      {
        fontFamily: "Arcade",
        fontSize: 50,
      }
    );
    this.scoreText.setOrigin(0.5);

    // Left paddle
    this.paddleLeft = this.physics.add.sprite(50, this.center.y, "ship", "ship.png");
    this.paddleLeft.setScale(0.5);
    this.paddleLeft.setCollideWorldBounds(true);
    this.paddleLeft.setImmovable(true);
    this.paddleLeft.setOrigin(0, 0.5);
    // this.paddleLeft.setSize(80, 140);

    // Right paddle
    this.paddleRight = this.physics.add.sprite(
      this.center.x * 2 - 50,
      this.center.y,
      "ship",
      "ship.png"
    );
    this.paddleRight.setFlipX(true);
    this.paddleRight.setScale(0.5);
    this.paddleRight.setCollideWorldBounds(true);
    this.paddleRight.setImmovable(true);
    this.paddleRight.setOrigin(1, 0.5);
    // this.paddleRight.setSize(80, 280);

    this.paddleRightControls = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: "shield",
      frames: [
        { key: "ship", frame: "sheld1.png" },
        { key: "ship", frame: "sheld2.png" },
        { key: "ship", frame: "sheld3.png" },
        { key: "ship", frame: "sheld2.png" },
        { key: "ship", frame: "sheld1.png" },
        { key: "ship", frame: "ship.png" },
      ],
      frameRate: 16,
      repeat: 0,
    });
    this.anims.create({
      key: "movedown",
      frames: [
        { key: "ship", frame: "movedown.png" },
        { key: "ship", frame: "ship.png" },
      ],
      frameRate: 16,
      repeat: 0,
    });
    this.anims.create({
      key: "moveup",
      frames: [
        { key: "ship", frame: "moveup.png" },
        { key: "ship", frame: "ship.png" },
      ],
      frameRate: 16,
      repeat: 0,
    });

    // Remove the collision on the left and right
    this.physics.world.checkCollision.left = false;
    this.physics.world.checkCollision.right = false;
  }
  update() {
    if (this.paddleRightControls.down.isDown) {
      this.paddleRight.setVelocityY(this.gameOptions.playerSpeed);
      this.paddleRight.anims.play("movedown", true);
    } else if (this.paddleRightControls.up.isDown) {
      this.paddleRight.setVelocityY(this.gameOptions.playerSpeed * -1);
      this.paddleRight.anims.play("moveup", true);
    } else {
      this.paddleRight.setVelocityY(0);
    }
    this.physics.add.collider(this.ball, this.paddleLeft, this.bounce, null, this);
    this.physics.add.collider(this.ball, this.paddleRight, this.bounce, null, this);

    this.ball.angle++;
    // Points
    this.checkIfPoint();
    this.computerPlayer();
  }
  bounce(ball, player) {
    player.anims.play("shield", true);
    this.impactSound.play();
    if (this.firstBall) {
      if (this.ball.body.velocity.x > 0) {
        this.ball.setVelocityX(this.gameOptions.ballSpeedX);
      } else {
        this.ball.setVelocityX(this.gameOptions.ballSpeedX * -1);
      }
      this.firstBall = false;
    }
    if (this.ball.y < player.y) {
      this.ball.setVelocityY(ball.body.velocity.y - this.gameOptions.ballSpeedY);
    } else {
      this.ball.setVelocityY(ball.body.velocity.y + this.gameOptions.ballSpeedY);
    }
  }
  checkIfPoint() {
    if (this.ball.x < 0) {
      this.paddleRightPoints++;
      this.resetGame();
    } else if (this.ball.x > this.center.x * 2) {
      this.paddleLeftPoints++;
      this.resetGame();
    }
  }
  resetGame() {
    this.firstBall = true;
    this.scoreText.setText(this.paddleLeftPoints + "  " + this.paddleRightPoints);
    this.ball.setVelocity(
      this.gameOptions.ballSpeedStart[
        Math.floor(Math.random() * this.gameOptions.ballSpeedStart.length)
      ]
    );
    this.ball.setPosition(this.center.x, Math.floor(Math.random() * this.center.y));
  }

  computerPlayer() {
    if (this.ball.body.velocity.x > 0) {
      this.paddleLeft.setVelocityY(0);
      return;
    }
    if (this.ball.x < this.paddleRight.x) {
      if (this.ball.y > this.paddleLeft.y + 10) {
        this.paddleLeft.setVelocityY(this.gameOptions.playerSpeed);
        this.paddleLeft.anims.play("movedown", true);
      } else if (this.ball.y < this.paddleLeft.y - 10) {
        this.paddleLeft.setVelocityY(this.gameOptions.playerSpeed * -1);
        this.paddleLeft.anims.play("moveup", true);
      } else {
        this.paddleLeft.setVelocityY(0);
      }
    }
  }
}
