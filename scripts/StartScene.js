import Pong from "./Pong.js";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    this.load.image("ball", "./assets/planet.png");
    this.load.image("bg", "./assets/space.jpg");
    this.load.multiatlas("ship", "./assets/animation.json", "./assets");
    this.load.audio("space", "./assets/space.mp3");
    this.load.audio("impact", "./assets/impact.mp3");
    this.load.image("particle", "./assets/particle.png");
  }
  create() {
    this.spaceSound = this.sound.add("space", { volume: 0.2 });
    this.center = {
      x: this.physics.world.bounds.width / 2,
      y: this.physics.world.bounds.height / 2,
    };

    this.background = this.add.image(this.center.x, this.center.y, "bg");
    this.background.setDisplaySize(this.center.x * 2, this.center.y * 2);

    this.title = this.add.text(
      this.center.x,
      this.center.y,
      "Space Pong",
      {
        fontFamily: "Arcade",
        fontSize: 100,
      },
      this
    );
    this.gradient = this.title.context.createLinearGradient(0, 0, 0, this.title.height);
    this.gradient.addColorStop(0, "#F2D335");
    this.gradient.addColorStop(1, "#A63F03");
    this.title.setFill(this.gradient);
    this.title.setOrigin(0.5);

    this.startText = this.add.text(
      this.center.x,
      this.title.y + 100,
      "Press any key to start",
      {
        fontFamily: "Arcade",
        fontSize: 30,
      },
      this
    );
    this.startGradient = this.startText.context.createLinearGradient(
      0,
      0,
      0,
      this.startText.height
    );
    this.startGradient.addColorStop(0, "#F2D335");
    this.startGradient.addColorStop(1, "#A63F03");
    this.startText.setFill(this.startGradient);
    this.startText.setOrigin(0.5);

    this.tweens.add({
      targets: this.startText,
      alpha: 0,
      duration: 800,
      ease: "Cubic.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    this.particles = this.add.particles("particle");
    this.emitter = this.particles.createEmitter({
      scale: { start: 1, end: 0 },
      speed: 20,
      // angle: { min: -20, max: 20 },
      lifespan: 2000,
      blendMode: "ADD",
      // maxParticles: 10,
    });
    this.ball = this.physics.add.sprite(this.center.x, this.center.y, "ball");
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);
    this.ball.setVelocity(Phaser.Math.Between(-200, 200));
    this.ball.setScale(0.7);

    this.emitter.startFollow(this.ball);
    this.input.keyboard.on("keydown", () => {
      this.scene.add("Pong", Pong, true);
      this.scene.remove("StartScene");
      this.spaceSound.play();
    });
  }
  update() {
    this.ball.angle++;
  }
}
