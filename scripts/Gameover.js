export default class Gameover extends Phaser.Scene {
  constructor() {
    super({ key: "Gameover" });
  }
  create() {
    this.center = {
      x: this.physics.world.bounds.width / 2,
      y: this.physics.world.bounds.height / 2,
    };
    this.background = this.add.image(this.center.x, this.center.y, "bg");
    this.background.setDisplaySize(this.center.x * 2, this.center.y * 2);

    this.title = this.add.text(
      this.center.x,
      this.center.y,
      "Game Over",
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

    this.winner = sessionStorage.getItem("winner");
    this.winnerText = this.add.text(
      this.center.x,
      this.title.y + 100,
      "Winner is " + this.winner,
      {
        fontFamily: "Arcade",
        fontSize: 30,
      },
      this
    );
    this.startGradient = this.winnerText.context.createLinearGradient(
      0,
      0,
      0,
      this.winnerText.height
    );
    this.startGradient.addColorStop(0, "#F2D335");
    this.startGradient.addColorStop(1, "#A63F03");
    this.winnerText.setFill(this.startGradient);
    this.winnerText.setOrigin(0.5);

    this.startText = this.add.text(
      this.center.x,
      this.winnerText.y + 100,
      "Press any key to go back",
      {
        fontFamily: "Arcade",
        fontSize: 20,
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
    this.input.keyboard.on("keydown", () => {
      this.scene.start("StartScene");
    });
  }
}
