class Game {
  constructor() {
    this.canvas = document.querySelector("#snake");
    this.ctx = this.canvas.getContext("2d");
    this.FPS = 15;

    this.WIDTH = 500;
    this.HEIGHT = 500;

    this.girdSize = 20;
    this.gridCount = this.WIDTH / this.girdSize;

    document.addEventListener("keypress", this.keyHandle.bind(this));

    this.gameLoop = null;
  }

  keyHandle(e) {
    if (e.key === "w" && this.velocityY !== 1) {
      this.velocityX = 0;
      this.velocityY = -1;
    }
    if (e.key === "a" && this.velocityX !== 1) {
      this.velocityX = -1;
      this.velocityY = 0;
    }
    if (e.key === "s" && this.velocityY !== -1) {
      this.velocityX = 0;
      this.velocityY = 1;
    }
    if (e.key === "d" && this.velocityX !== -1) {
      this.velocityX = 1;
      this.velocityY = 0;
    }
  }

  updatePosition() {
    this.positionX += this.velocityX;
    this.positionY += this.velocityY;

    if (this.positionX > this.gridCount - 1) {
      this.positionX = 0;
    }
    if (this.positionY > this.gridCount - 1) {
      this.positionY = 0;
    }
    if (this.positionX < 0) {
      this.positionX = this.gridCount - 1;
    }
    if (this.positionY < 0) {
      this.positionY = this.gridCount - 1;
    }
  }

  eat() {
    if (this.positionX === this.appleX && this.positionY === this.appleY) {
      this.tailSize++;
      this.appleX = Math.floor(Math.random() * this.gridCount);
      this.appleY = Math.floor(Math.random() * this.gridCount);

      this.tailCheck((t) => {
        if (this.appleX === t.positionX && this.appleY === t.positionY) {
          this.appleX = Math.floor(Math.random() * this.gridCount);
          this.appleY = Math.floor(Math.random() * this.gridCount);
        }
      });
    }
  }

  tailCheck(func) {
    this.tail.forEach((t) => func(t));
  }

  update() {
    this.updatePosition();
    this.eat();

    this.tailCheck((t) => {
      if (t.positionX === this.positionX && t.positionY === this.positionY) {
        this.reset();
      }
    });

    this.tail.push({ positionX: this.positionX, positionY: this.positionY });
    if (this.tail.length > this.tailSize) {
      this.tail.shift();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    this.tail.forEach((t) => {
      // Snake
      this.ctx.fillStyle = "#d5d5d5";
      this.ctx.fillRect(
        t.positionX * this.girdSize,
        t.positionY * this.girdSize,
        18,
        18
      );
    });

    // Apple
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      this.appleX * this.girdSize,
      this.appleY * this.girdSize,
      18,
      18
    );

    // Score
    this.ctx.fillStyle = "white";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(this.tailSize - 5, 50, 50);
  }

  reset() {
    clearInterval(this.gameLoop);
    this.start();
  }

  loop() {
    this.gameLoop = setInterval(() => {
      this.update();
      this.draw();
    }, 1000 / this.FPS);
  }

  init() {
    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    this.positionX = 12;
    this.positionY = 12;
    this.velocityX = 0;
    this.velocityY = 0;
    this.tail = [{ positionX: 12, positionY: 12 }];
    this.tailSize = 5;
    this.appleX = 12;
    this.appleY = 4;
  }

  start() {
    this.init();
    this.loop();
  }
}

const game = new Game();
game.start();
