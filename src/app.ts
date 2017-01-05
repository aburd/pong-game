import $ = require('jquery');

$(() => {
  // CONFIG
  const gameSpeed: number = 15;
  const aiSpeed: number = 7;

  // colors
  const green = "#2f1";
  const red = "#f21";
  const black = "#111111";
  const white = "#ffffff";

  const canvas = <HTMLCanvasElement> document.getElementById('game-canvas');
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
  // draw background
  ctx.fillStyle = black;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // draw center line
  ctx.fillStyle = red;
  ctx.beginPath();
  ctx.moveTo(canvas.width/2,0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();

  // Bounds
  const topBound: number = 0;
  const leftBound: number = 0
  const rightBound: number = canvas.width;
  const bottomBound: number = canvas.height;

  // Sizes
  const pWidth: number = 25;
  const pHeight: number = 150;
  const bWidth: number = 25;
  const bHeight: number = 25;

  // scorePositions
  const p1Position = { x: (canvas.width / 2) - 150, y: 100}
  const p2Position = { x: (canvas.width / 2) + 150, y: 100}

  // Point definition
  interface Point {
      x: number,
      y: number
  }
  const initialBallPosition: Point = {x: (rightBound / 2) - (bWidth/2), y: (bottomBound / 2) - (bHeight/2) }

  /*
   * PADDLE
   */
  class Paddle {
    private points: number = 0
    private velocity: number = 0
    static maxSpeed: number = 30


    constructor(
      public position: Point,
      public width: number,
      public height: number,
      private scorePosition: Point,
      private color: string ){
    }
    addPoint(): void {
      this.points += 1
    }
    draw(): void {
      this.position.y += this.velocity

      ctx.fillStyle = this.color
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
      ctx.font = "48pt helvetica";
      ctx.fillStyle = white;
      ctx.fillText(this.points.toString(), this.scorePosition.x, this.scorePosition.y)
    }
    move(direction: number): void {
      const target = this.position.y += direction
      if(target <= 0) {
        this.position.y = 0
      } else if(target + this.height >= canvas.height) {
        this.position.y = canvas.height - this.height
      } else {
        this.position.y = target
      }
    }
    setVelocity(direction: number): void {
      this.velocity *= direction
    }
    getVelocity(): number {
      return this.velocity
    }
  }

  /*
   * BALL
   */
  class Ball {
    constructor(
      private position: Point,
      public width: number,
      public height: number,
      private velocityX: number,
      private velocityY: number,
      private color: string ){
    }

    draw(): void {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    detectCollision(paddle: Paddle): boolean {
      return this.position.y > paddle.position.y && this.position.y <= (paddle.position.y + paddle.height) &&
        this.position.x < (paddle.position.x + paddle.width) && this.position.x >= paddle.position.x ||
        this.position.y > paddle.position.y && this.position.y <= (paddle.position.y + paddle.height) &&
        this.position.x + this.width > paddle.position.x && this.position.x + this.width <= paddle.position.x + paddle.width
    }
    move(): void {
      this.position.x += this.velocityX
      this.position.y += this.velocityY

      // paddle collision detection
      if( this.detectCollision(p1) || this.detectCollision(p2)) {
        this.velocityX *= -1
      }
      // bounce off of top and bottom walls
      if(this.position.y <= 0 || this.position.y + this.height >= canvas.height) {
        this.velocityY *= -1
      }
      // ball is off the screen
      if(this.position.x <= 0 ) {
        this.reset({x: (rightBound / 2) - (bWidth/2), y: (bottomBound / 2) - (bHeight/2) })
        p2.addPoint()
      }
      // ball is off the screen 2p
      if(this.position.x + this.width >= canvas.width) {
        this.reset({x: (rightBound / 2) - (bWidth/2), y: (bottomBound / 2) - (bHeight/2) })
        p1.addPoint()
      }

    }
    getPosition(): Point {
      return this.position
    }
    myPosition(): string {
      return `Ball Stats - x: ${this.position.x}, y: ${this.position.y}`;
    }
    public reset(point: Point): void {
      this.position = point
      this.velocityX *= -1
      this.velocityY *= -1
    }
  }

  // Paddles & Ball
  let p1 = new Paddle({x:leftBound + 50, y: topBound + 100}, pWidth, pHeight, p1Position, green)
  let p2 = new Paddle({x: rightBound - (50 + pWidth), y: bottomBound - (100 + pHeight)}, pWidth, pHeight, p2Position, red)
  let ball = new Ball(initialBallPosition, bWidth, bHeight, 5, 5, white)

  function drawWorld(p1Position: Point, p2Position: Point, bPosition: Point): void {
    // draw background
    ctx.fillStyle = black;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // draw center line
    ctx.strokeStyle = red;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2,0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();

    // draw paddles and ball
    p1.draw()
    p2.draw()
    ball.draw()
    // move objects
    ball.move()

    // P2 AI
    if(ball.getPosition().y < p2.position.y) {
      p2.move(aiSpeed * -1)
    } else if(ball.getPosition().y > p2.position.y && ball.getPosition().y < p2.position.y + p2.height) {
      p2.move(0)
    } else {
      p2.move(aiSpeed)
    }

    // log debug info to screen
    $('#root').text(ball.myPosition());
  }

  // P1 controls
  window.addEventListener('keydown', (ev) => {
    const code: number = ev.keyCode

    if(code === 38) {
      p1.move(-20)
    } else if (code === 40) {
      p1.move(20)
    }
  }, true)


  // Animate the world
  var animateWorld = setInterval(drawWorld, gameSpeed);
  let stopBtn = <HTMLButtonElement> document.getElementById('stop')
  stopBtn.onclick = clearInterval.bind(null, animateWorld)
  // Set the ball
  let setBtn = <HTMLButtonElement> document.getElementById('set')
  setBtn.onclick = function(){ ball.reset({x: 200, y: 200}) }
});
