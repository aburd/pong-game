"use strict";
var $ = require("jquery");
$(function () {
    var gameSpeed = 30;
    var aiSpeed = 7;
    var green = "#2f1";
    var red = "#f21";
    var black = "#111111";
    var white = "#ffffff";
    var canvas = document.getElementById('game-canvas');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = black;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    var topBound = 0;
    var leftBound = 0;
    var rightBound = canvas.width;
    var bottomBound = canvas.height;
    var pWidth = 25;
    var pHeight = 150;
    var bWidth = 25;
    var bHeight = 25;
    var p1Position = { x: (canvas.width / 2) - 150, y: 100 };
    var p2Position = { x: (canvas.width / 2) + 150, y: 100 };
    var initialBallPosition = { x: (rightBound / 2) - (bWidth / 2), y: (bottomBound / 2) - (bHeight / 2) };
    var Paddle = (function () {
        function Paddle(position, width, height, scorePosition, color) {
            this.position = position;
            this.width = width;
            this.height = height;
            this.scorePosition = scorePosition;
            this.color = color;
            this.points = 0;
            this.velocity = 0;
        }
        Paddle.prototype.addPoint = function () {
            this.points += 1;
        };
        Paddle.prototype.draw = function () {
            this.position.y += this.velocity;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
            ctx.font = "48pt helvetica";
            ctx.fillStyle = white;
            ctx.fillText(this.points.toString(), this.scorePosition.x, this.scorePosition.y);
        };
        Paddle.prototype.move = function (direction) {
            var target = this.position.y += direction;
            if (target <= 0) {
                this.position.y = 0;
            }
            else if (target + this.height >= canvas.height) {
                this.position.y = canvas.height - this.height;
            }
            else {
                this.position.y = target;
            }
        };
        Paddle.prototype.setVelocity = function (direction) {
            this.velocity *= direction;
        };
        Paddle.prototype.getVelocity = function () {
            return this.velocity;
        };
        return Paddle;
    }());
    Paddle.maxSpeed = 30;
    var Ball = (function () {
        function Ball(position, width, height, velocityX, velocityY, color) {
            this.position = position;
            this.width = width;
            this.height = height;
            this.velocityX = velocityX;
            this.velocityY = velocityY;
            this.color = color;
        }
        Ball.prototype.draw = function () {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        };
        Ball.prototype.detectCollision = function (paddle) {
            return this.position.y > paddle.position.y && this.position.y <= (paddle.position.y + paddle.height) &&
                this.position.x < (paddle.position.x + paddle.width) && this.position.x >= paddle.position.x ||
                this.position.y > paddle.position.y && this.position.y <= (paddle.position.y + paddle.height) &&
                    this.position.x + this.width > paddle.position.x && this.position.x + this.width <= paddle.position.x + paddle.width;
        };
        Ball.prototype.move = function () {
            this.position.x += this.velocityX;
            this.position.y += this.velocityY;
            if (this.detectCollision(p1) || this.detectCollision(p2)) {
                this.velocityX *= -1;
            }
            if (this.position.y <= 0 || this.position.y + this.height >= canvas.height) {
                this.velocityY *= -1;
            }
            if (this.position.x <= 0) {
                this.reset({ x: (rightBound / 2) - (bWidth / 2), y: (bottomBound / 2) - (bHeight / 2) });
                p2.addPoint();
            }
            if (this.position.x + this.width >= canvas.width) {
                this.reset({ x: (rightBound / 2) - (bWidth / 2), y: (bottomBound / 2) - (bHeight / 2) });
                p1.addPoint();
            }
        };
        Ball.prototype.getPosition = function () {
            return this.position;
        };
        Ball.prototype.myPosition = function () {
            return "Ball Stats - x: " + this.position.x + ", y: " + this.position.y;
        };
        Ball.prototype.reset = function (point) {
            this.position = point;
            this.velocityX *= -1;
            this.velocityY *= -1;
        };
        return Ball;
    }());
    var p1 = new Paddle({ x: leftBound + 50, y: topBound + 100 }, pWidth, pHeight, p1Position, green);
    var p2 = new Paddle({ x: rightBound - (50 + pWidth), y: bottomBound - (100 + pHeight) }, pWidth, pHeight, p2Position, red);
    var ball = new Ball(initialBallPosition, bWidth, bHeight, 10, 10, white);
    function drawWorld(p1Position, p2Position, bPosition) {
        ctx.fillStyle = black;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = red;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        p1.draw();
        p2.draw();
        ball.draw();
        ball.move();
        if (ball.getPosition().y < p2.position.y) {
            p2.move(aiSpeed * -1);
        }
        else if (ball.getPosition().y > p2.position.y && ball.getPosition().y < p2.position.y + p2.height) {
            p2.move(0);
        }
        else {
            p2.move(aiSpeed);
        }
        $('#root').text(ball.myPosition());
    }
    window.addEventListener('keydown', function (ev) {
        var code = ev.keyCode;
        if (code === 38) {
            p1.move(-20);
        }
        else if (code === 40) {
            p1.move(20);
        }
    }, true);
    var animateWorld = setInterval(drawWorld, gameSpeed);
    var stopBtn = document.getElementById('stop');
    stopBtn.onclick = clearInterval.bind(null, animateWorld);
    var setBtn = document.getElementById('set');
    setBtn.onclick = function () { ball.reset({ x: 200, y: 200 }); };
});
//# sourceMappingURL=app.js.map