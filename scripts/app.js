// import Pong from "./Pong.js";
import StartScene from "./StartScene.js";

let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [StartScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: false,
      debug: false,
    },
  },
};

new Phaser.Game(config);
