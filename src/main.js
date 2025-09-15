import "./style.css"

//canvas variables
const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
canvas.height = 600
canvas.width = 500

//score
const score = document.getElementById("myScore")
let p1Score = 0
let p2Score = 0
score.textContent = `${p1Score} - ${p2Score}`

//start button
const startButton = document.getElementById("start-button")
startButton.addEventListener("click", handleStart)
let newGame = true

//players mode
const players = document.querySelectorAll('input[name="toggle"]')
let isSinglePlayer = true

//ball variables
const ballRadius = 5
let randomServe = Math.floor(Math.random() * (100 - 50 + 1)) + 50

let ballX = canvas.width / 2
let ballY = canvas.height / 2 - randomServe

let ballDirectionX = 1
let ballDirectionY = 1

let isServe = true

//left paddle variables

let leftPaddleHeight = 70
let leftPaddleWidth = 10

let leftPaddleX = 10
let leftPaddleY = (canvas.height - leftPaddleHeight) / 2 //center paddle

//right paddle variables

let rightPaddleHeight = 70
let rightPaddleWidth = 10

let rightPaddleX = canvas.width - 10 - rightPaddleWidth
let rightPaddleY = (canvas.height - rightPaddleHeight) / 2 //center paddle

//right paddle inputs
let rightInputUp = false
let rightInputDown = false

//left paddle inputs
let leftInputUp = false
let leftInputDown = false

function drawLine() {
  context.beginPath()
  context.setLineDash([10, 15]) // [dash length, gap length]
  context.moveTo(canvas.width / 2, 0)
  context.lineTo(canvas.width / 2, canvas.height)
  context.strokeStyle = "white"
  context.lineWidth = 2
  context.stroke()

  // Reset line dash so it doesn’t affect paddles/ball later
  context.setLineDash([])
}

function drawBall() {
  context.beginPath()
  context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2) //center coordinates, radius, start and finish angles
  context.fillStyle = "#fff"
  context.fill()
  context.closePath()
}

function ballMovement() {
  ballX += ballDirectionX
  ballY += ballDirectionY
}

function startServe(serveDirection) {
  randomServe = Math.floor(Math.random() * (100 - 50 + 1)) + 50
  ballX = canvas.width / 2
  ballY = canvas.height / 2 - randomServe

  if (serveDirection === "right") {
    ballDirectionX = 1
    ballDirectionY = 1
  }

  if (serveDirection === "left") {
    ballDirectionX = -1
    ballDirectionY = 1
  }
  isServe = true

  leftPaddleX = 10
  leftPaddleY = (canvas.height - leftPaddleHeight) / 2 //center paddle

  rightPaddleX = canvas.width - 10 - rightPaddleWidth
  rightPaddleY = (canvas.height - rightPaddleHeight) / 2 //center paddle
}

function drawLeftPaddle() {
  context.fillStyle = "#fff"
  context.fillRect(leftPaddleX, leftPaddleY, leftPaddleWidth, leftPaddleHeight)
}

function drawRightPaddle() {
  context.fillStyle = "#fff"
  context.fillRect(
    rightPaddleX,
    rightPaddleY,
    rightPaddleWidth,
    rightPaddleHeight
  )
}

function initEvents() {
  document.addEventListener("keydown", keyDownHandler)
  document.addEventListener("keyup", keyUpHandler)

  function keyDownHandler(event) {
    const { key } = event //reading which key is pressed

    // right paddle inputs
    if (key === "Up" || key === "ArrowUp") {
      rightInputUp = true
    } else if (key === "Down" || key === "ArrowDown") {
      rightInputDown = true
    }

    // left paddle inputs
    if (key === "W" || key === "w") {
      leftInputUp = true
    } else if (key === "S" || key === "s") {
      leftInputDown = true
    }
  }

  function keyUpHandler(event) {
    const { key } = event //reading which key is pressed

    // right paddle inputs
    if (key === "Up" || key === "ArrowUp") {
      rightInputUp = false
    } else if (key === "Down" || key === "ArrowDown") {
      rightInputDown = false
    }

    // left paddle inputs
    if (key === "W" || key === "w") {
      leftInputUp = false
    } else if (key === "S" || key === "s") {
      leftInputDown = false
    }
  }
}

function leftPaddleMovement() {
  if (leftInputUp && leftPaddleY > 0) {
    leftPaddleY -= 3
  } else if (leftInputDown && leftPaddleY < canvas.height - leftPaddleHeight) {
    leftPaddleY += 3
  }
}

function rightPaddleMovement() {
  if (rightInputUp && rightPaddleY > 0) {
    rightPaddleY -= 3
  } else if (
    rightInputDown &&
    rightPaddleY < canvas.height - rightPaddleHeight
  ) {
    rightPaddleY += 3
  }
}

function cpuPlayer() {
  const rightPaddleCenter = rightPaddleY + rightPaddleHeight / 2
  if (ballX > canvas.width / 3) {
    if (ballY > rightPaddleCenter) {
      rightPaddleY += 3
    }
    if (ballY < rightPaddleCenter) {
      rightPaddleY -= 3
    }
  }
}

function collitionDetection() {
  //detect p1 point
  if (ballX + ballDirectionX > canvas.width) {
    p1Score += 1
    startServe("right")
  }

  //detect p2 point - reset
  if (ballX + ballDirectionX < 0) {
    p2Score += 1
    startServe("left")
  }

  //detect hit with top or buttom
  if (ballY + ballDirectionY > canvas.height || ballY + ballDirectionY < 0) {
    ballDirectionY = -ballDirectionY // inverting horizontal direction
  }

  //detect left paddle hit
  if (
    ballX === leftPaddleX + leftPaddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + leftPaddleHeight
  ) {
    ballDirectionX = -ballDirectionX

    //increase ball speed first hit
    if (isServe) {
      ballDirectionX = ballDirectionX * 2
      ballDirectionY = ballDirectionY * 2
      isServe = false
    }
  }

  //detect right paddle hit
  if (
    ballX === rightPaddleX &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + rightPaddleHeight
  ) {
    ballDirectionX = -ballDirectionX

    //increase ball speed first hit

    if (isServe) {
      ballDirectionX = ballDirectionX * 2
      ballDirectionY = ballDirectionY * 2
      isServe = false
    }
  }
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height)
}

function drawGame() {
  //clear last frame
  clearCanvas()

  //refresh drawing functions
  drawLine()
  drawBall()
  drawLeftPaddle()
  drawRightPaddle()

  //update positions
  ballMovement()
  leftPaddleMovement()
  isSinglePlayer ? cpuPlayer() : rightPaddleMovement()
  collitionDetection()

  //loop function everyframe
  score.textContent = `${p1Score} - ${p2Score}`

  if (p1Score <= 4 && p2Score <= 4) {
    window.requestAnimationFrame(drawGame)
  } else if (p1Score > 4) {
    score.textContent = `P1 Winner!`
    newGame = true
    startButton.textContent = "reset game"
  } else if (p2Score > 4) {
    isSinglePlayer
      ? (score.textContent = `PCU Winner!`)
      : (score.textContent = `P2 Winner!`)
    newGame = true
    startButton.textContent = "reset game"
  }
}

function handleStart() {
  if (newGame) {
    players.forEach((player) => {
      if (player.checked) {
        player.value === "singlePlayer"
          ? (isSinglePlayer = true)
          : (isSinglePlayer = false)
      }
    })
    p1Score = 0
    p2Score = 0
    startButton.textContent = "start game"
    startServe("right")
    newGame = false
    drawGame()
  }
}

initEvents()
