function game(gametype) {
  let snake_speed = 100;
  let dx = 10;
  let dy = 0;
  let foodObj;
  let snakeObj;
  let canvasObj;
  let speedChanged = true;
  let movementObj;
  let score = 0;
  let changingDirection = false;
  let start = true;
  let wallObj;
  let wallShow = false;
  var key;
  var count = 20;
  var keyU = true;

  function events() {
    document.addEventListener("keydown", startGame);
    document.addEventListener("keydown", movementObj.changeDirection);
    document.addEventListener("keyup", movementObj.keyUpDone);
  }

  function init() {
    if(gametype === 'Advanced') {
      snake_speed = 100;
    }

    canvasObj = new canvas(200, 300);
    movementObj = new movement();
    snakeObj = new snake();
    foodObj = new food('red');
    wallObj = new wall()
    events();
    canvasObj.createCanvas();
    foodObj.createFood();
    foodObj.drawFood();
    snakeObj.moveSnake();
    snakeObj.drawSnake();
    wallObj.createWall();
  }

  function startGame() {
    if (start) {
      if (event.keyCode == 39) {
        document.getElementById('start').style.display = "none";
        start = false;
        movementObj.mainMovement();
      } else {
        alert('To Start the game press right arrow key');
      }
    }
  }

  function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
  }

  function foodTypes() {
    return {
      'red' : { 'score' : 10, 'color' : 'red', 'borderColor' : 'darkred'},
      'yellow' : { 'score' : 20, 'color' : 'yellow', 'borderColor' : 'darkyellow'},
      'pink' : { 'score' : 30, 'color' : 'pink', 'borderColor' : 'darkpink'}
    }
  }

  function movement() {
    var self = this;
    var snake;

    this.mainMovement = function () {
      if (this.didGameEnd()) {
        alert('Game ended');
        return;
      }

      setTimeout(function () {
        changingDirection = false;
        canvasObj.createCanvas();
        if(wallShow) {
          wallObj.drawWall();
        }
        foodObj.drawFood();
        snakeObj.moveSnake();
        snakeObj.drawSnake();

        // Call game again
        self.mainMovement();
      }, snake_speed)
    }

    this.increaseSpeed = function () {
      if(score > 40 && score < 80) {
        wallShow = true;
        snake_speed = 50;
      } else if(score >80 && score < 200) {
        wallShow = false;
        snake_speed = 20;
      }
    }

    this.changeColor = function () {
      if(snake.length % 7 === 0) {
        foodObj.type = 'yellow';
      } else if(snake.length % 9 === 0) {
        foodObj.type = 'pink';
      } else {
        foodObj.type = 'red';
      }
    }


    this.didGameEnd = function () {
      snake = snakeObj.snakeValues();
      this.increaseSpeed();
      this.changeColor();
      wall = wallObj.getWall();
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
      }

      if(wallShow) {
        for (let i = 0; i < wall.length; i++) {
          if (wall[i].x === snake[0].x && wall[i].y === snake[0].y) return true
        }
      }

      const hitLeftWall = snake[0].x < 0;
      const hitRightWall = snake[0].x > gameCanvas.width - 10;
      const hitToptWall = snake[0].y < 0;
      const hitBottomWall = snake[0].y > gameCanvas.height - 10;

      return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
    }

    this.changeDirection = function (event) {
      const LEFT_KEY = 37;
      const RIGHT_KEY = 39;
      const UP_KEY = 38;
      const DOWN_KEY = 40;
      if (changingDirection) return;
      changingDirection = true;

      const keyPressed = event.keyCode;

      if(!key) {
        keyU = false;
        key = new Date().getTime();
      }

      if(new Date().getTime() >= (key + count) && !keyU) {
        snake_speed = 50;
      } else {
        snake_speed = 100;
      }

      const goingUp = dy === -10;
      const goingDown = dy === 10;
      const goingRight = dx === 10;
      const goingLeft = dx === -10;

      if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
      }
      if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
      }
      if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
      }
      if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
      }
    }
    this.keyUpDone = function () {
      keyU = true;
      key = undefined;
    }
  }

  function canvas(width, height) {
    const gameCanvas = document.getElementById("gameCanvas");
    const ctx = gameCanvas.getContext("2d");
    const CANVAS_BORDER_COLOUR = 'black';
    const CANVAS_BACKGROUND_COLOUR = "white";
    this.width = width;
    this.height = height;

    this.ctxElement = function () {
      return ctx;
    }

    this.createCanvas = function () {
      ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
      ctx.strokestyle = CANVAS_BORDER_COLOUR;
      ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
      ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
    }
  }

  function snake() {

    let snake = [{
        x: 150,
        y: 150
      },
      {
        x: 140,
        y: 150
      },
      {
        x: 130,
        y: 150
      },
      {
        x: 120,
        y: 150
      },
      {
        x: 110,
        y: 150
      }
    ];

    const SNAKE_COLOUR = 'lightgreen';
    const SNAKE_BORDER_COLOUR = 'darkgreen';
    let ctx = canvasObj.ctxElement();

    this.snakeValues = function () {
      return snake;
    }

    this.drawSnake = function () {
      snake.forEach(this.drawSnakePart)
    }

    this.drawSnakePart = function (snakePart) {
      ctx.fillStyle = SNAKE_COLOUR;
      ctx.strokestyle = SNAKE_BORDER_COLOUR;
      ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
      ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }

    this.moveSnake = function () {
      const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
      };
      snake.unshift(head);

      const didEatFood = snake[0].x === foodObj.foodValuesX() && snake[0].y === foodObj.foodValuesY();
      if (didEatFood) {
        score += foodTypes()[foodObj.type]['score'];
        document.getElementById('score').innerHTML = score;
        foodObj.createFood();
      } else {
        snake.pop();
      }
    }
  }

  function food(type) {
    let foodX;
    let foodY;
    let snake = snakeObj.snakeValues();
    let ctx = canvasObj.ctxElement();

    this.type = type;

    this.drawFood = function () {
      ctx.fillStyle = foodTypes()[this.type]['color'];
      ctx.strokestyle = foodTypes()[this.type]['color'];
      ctx.fillRect(foodX, foodY, 10, 10);
      ctx.strokeRect(foodX, foodY, 10, 10);
    }

    this.foodValuesX = function () {
      return foodX;
    }

    this.foodValuesY = function () {
      return foodY;
    }

    this.createFood = function () {
      foodX = randomTen(0, gameCanvas.width - 10);
      foodY = randomTen(0, gameCanvas.height - 10);

      snake.forEach(function isFoodOnSnake(part) {
        const foodIsoNsnake = part.x == foodX && part.y == foodY;
        if (foodIsoNsnake) createFood();
      });
    }
  }


  function wall(length) {
    let ctx = canvasObj.ctxElement();
    let wallX;
    let wallY;
    let wall = [];

    this.getWall = function () {
      return wall;
    }

    this.createWall = function() {
      wallX = randomTen(0, gameCanvas.width - 10);
      wallY = randomTen(0, gameCanvas.height - 10);

      if(wallY + 50  >= gameCanvas.height) {
        this.createWall();
      }

      for(var i = 0; i < 5; i++){
        wallY = wallY + 10;
        wall.push({x: wallX, y:wallY});
      }
    }

    this.drawWall = function () {
      wall.forEach(this.drawWallPart)
    }

    this.drawWallPart = function (wallPart) {
      ctx.fillStyle = 'black';
      ctx.strokestyle = 'black';
      ctx.fillRect(wallPart.x, wallPart.y, 10, 10);
      ctx.strokeRect(wallPart.x, wallPart.y, 10, 10);
    }
  }

  return {
    init: init
  };
}

game().init();
