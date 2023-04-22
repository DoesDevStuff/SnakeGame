//Size of game area
const gridSize = 40;
//time taken for each refresh in ms
const clock = 100;

//Starting snake length
const startLength = 10;
//Snake head starting position
const start_i = Math.floor(gridSize / 2);
const start_j = startLength + 1;
//Array to store list of active snakes
let snakeList = [];

//Rounds
let gameRound = 0;
//Default snake colours
// let snakeColor = "rgba(52, 70, 90, 1)";
let playerSnakeColor = "rgba(171,235,232, 0.5)"
let AISnakeColor = "rgba(109,216,93, 0.5)";
// let playerSnakeHeadColor = "hsl(110,39%,50%)";
let playerSnakeHeadColor = "#81e1de";
// let AISnakeHeadColor = "hsl(261, 70%, 80%)";
let AISnakeHeadColor = "#61ce34";
//Default fruit color
// let fruitColor = "hsl(110,70%,50%)";
let fruitColor = "#dc6d71";
// let AIfruitColor = "hsl(261, 79%, 50%)";
let AIfruitColor = "#DF740C";
//Score
let score = 0;
//directions north, south, east, west
const D = ['n', 'e', 's', 'w'];

//---CONVENIENCE FUNCTIONS
//Get square from coordinates
function getSquareNode(i, j) {
    return document.getElementById("game-board").children[i].children[j]
}

//Makes a copy of the original position array
function copyPosArray(original) {
    let crispy = [];
    for (x = 0; x < original.length; x++) {
        crispy[x] = {
            i: original[x].i,
            j: original[x].j,
            dir: original[x].dir
        }
    }
    return crispy;
}

//Get last segment object of given position array
function getLastSeg(posArray) {
    let seg = new Coordinate(null, null, null)
    seg.i = posArray[posArray.length - 1].i;
    seg.j = posArray[posArray.length - 1].j;
    seg.dir = posArray[posArray.length - 1].dir;
    return seg;
}

//Translates a given coordinate base on given direction and distance
function translate(a, b, dir, distance = 1) {
    let coordinate = {
        i: null,
        j: null
    };
    switch (dir) {
        case "e":
            coordinate.i = a;
            coordinate.j = b + (1 * distance);
            break;
        case "n":
            coordinate.i = a - (1 * distance);
            coordinate.j = b;
            break;
        case "w":
            coordinate.i = a;
            coordinate.j = b - (1 * distance);
            break;
        case "s":
            coordinate.i = a + (1 * distance);
            coordinate.j = b;
            break;
    }
    return coordinate;
}

function countdownTimer(gamePlay, count = 3, go = "Go!") {
    let countdownInterval = setInterval(countdown, 800);

    function countdown() {
        let cddParent = document.getElementById("countdown");
        if (count === -1) {
            clearInterval(countdownInterval);
            gamePlay();
            cddParent.innerHTML = "";
            count = 3;
        } else {
            cddParent.innerHTML = "";
            let h2 = document.createElement("h2");
            h2.id = "countdown-display"
            h2.innerText = count === 0 ? go : count;
            cddParent.appendChild(h2);
            h2.classList.add("fade-out");
            count--;
        }
    }
}

function respawnTimer(func, count = 3, go = "Go!") {
    let cddParent = document.getElementById("countdown");
    let countdownInterval = setInterval(countdown, 1200);

    function countdown() {
        if (count === -1) {
            clearInterval(countdownInterval);
            func();
            cddParent.innerHTML = "";
            count = 3;
        } else {
            cddParent.innerText = "";
            let h2 = document.createElement("p");
            h2.id = "respawn-countdown"
            h2.innerText = count === 0 ? "A new challenger has arrived." : `${count}`;
            cddParent.appendChild(h2);
            h2.classList.add("fade-out");
            count--; 
        }
    }
}


function killAnimate(playerDied = false, type = "fadeOut"){
    let cddParent = document.getElementById("countdown");
    cddParent.innerText = "";
    let h2 = document.createElement("p");
    h2.id = "kill-animation"
    h2.innerText = playerDied ? "You died." : "Good Kill!";
    h2.classList.add('animate__animated', `animate__${type}`);
    h2.addEventListener('animationend', () => {
        h2.classList.remove('animate__animated', `animate__${type}`, 'animate__slower');
        cddParent.innerText = "";
    });
    cddParent.appendChild(h2);
}

let instructions = document.getElementById("instructions");
instructions.innerText = "";
instructions.style.visibility = "hidden";

let pc = document.getElementById("play-classic");
pc.onmouseover = function(){
    instructions.innerText += "Play the Classic Snake." 
    instructions.classList.add('animate__animated', `animate__fadeIn`);
    instructions.style.visibility = "visible";
    pc.onmouseout = function (){
        instructions.classList.remove('animate__animated', `animate__fadeIn`);
        instructions.style.visibility = "hidden";
    }
};


let pb = document.getElementById("play-battleMode");
pb.onmouseover = function(){
    instructions.innerText = "Battle against an AI Snake."
    instructions.classList.add('animate__animated', `animate__fadeIn`);
    instructions.style.visibility = "visible";
    pb.onmouseout = function (){
        instructions.classList.remove('animate__animated', `animate__fadeIn`);
        instructions.style.visibility = "hidden";
    }
};



//--DISPLAY DOM MANIPULATION
//Set up game board
function setUpGameBoard() {
    for (let i = 0; i < gridSize; i++) {
        let row = document.createElement("div");
        row.classList.add("game-row");
        for (let i = 0; i < gridSize; i++) {
            var sq = document.createElement("div");
            sq.classList.add("game-square");
            row.appendChild(sq);
        }
        let gb = document.getElementById("game-board");
        gb.appendChild(row);
    }
}
setUpGameBoard();

//---SCORING
let scoreBoard = {
    round: 0,
    score: 0,
    kills: 0,
    resetScore: function () {
        // this.round=0;
        this.score = 0;
        this.kills = 0;
    }
}

function updateScoreDisplay() {
    let rd = document.getElementById("round-display");
    let sd = document.getElementById("score-display");
    let kd = document.getElementById("kills-display");
    rd.innerText = scoreBoard.round;
    sd.innerText = scoreBoard.score;
    kd.innerText = scoreBoard.kills;
}

//Display=true will force set it to display
function toggleScoreDisplay(display = false) {
    let sb = document.getElementById("score-board");
    if (display) {
        sb.style.visibility = "visible";
    } else {
        if (sb.style.visibility == "visible") {
            sb.style.visibility = "hidden";
        } else {
            sb.style.visibility = "visible";
        }
    }
}


//---GAME OBJECTS
class Coordinate {
    constructor(i = 0, j = 0, dir = "e") {
        this.i = i;
        this.j = j;
        this.dir = dir;
    }
}


//------ SNAKE HELPER FUNCTIONS TO CHECK  FOR BORDER
//Checks if the snake is Out of bounds (OOB) 
function isSnakeOOB(snakeObj) {
    if (snakeObj.position[0].i > gridSize - 1 //east border
        ||
        snakeObj.position[0].i < 0 //west border
        ||
        snakeObj.position[0].j > gridSize - 1 //south border
        ||
        snakeObj.position[0].j < 0 //north border
    ) {
        return true;
    } else {
        return false;
    }
}

//Check if snake runs into itself
function isSnakeHitSelf(snakeObj) {
    let i = snakeObj.position[0].i;
    let j = snakeObj.position[0].j;
    return snakeObj.isInSnake(i, j);
}


//Fruit coordinate for testing
let testFruitCoord = [];
// testFruitCoord.push(new Coordinate(25,25));
// testFruitCoord.push(new Coordinate(18, 25));
// testFruitCoord.push(new Coordinate(40, 22));

class Fruit {
    constructor() {
        this.position = getEmptyCoordinate();
        this.color = fruitColor;
    }
    resetPosition() {
        if (testFruitCoord.length > 0) {
            this.position = testFruitCoord.shift();
        } else {
            this.position = getEmptyCoordinate();
        }

    }
    setDisplay() {
        let n = getSquareNode(this.position.i, this.position.j);
        n.style.backgroundColor = this.color;
    }
}

//------ FRUIT HELPER FUNCTIONS
//Generates a random coordinate without any snake bodies
function getEmptyCoordinate() {
    if (snakeList.length > 0) {
        //GENERATE INITIAL LIST OF POSSIBLE COORDINATES
        let possibleCoords = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                possibleCoords.push(new Coordinate(i, j))
            }
        }
        
        //FOR EACH SNAKE IN SNAKELIST
        snakeList.forEach(s => {
            //FOR EACH POSITION IN SNAKE
            s.position.forEach(c => {
                //COMPARE WITH EVERY VALUE IN POSSIBLE COORDINATES 
                possibleCoords.forEach((pc, idx) => {
                    //IF MATCHES, REMOVE FROM POSSIBLE COORDINDATES
                    if (c.i == pc.i && c.j == pc.j) {
                        possibleCoords.splice(idx, 1);
                    }
                });
            });
        });

        let randIdx = Math.floor(Math.random()*possibleCoords.length);
        return possibleCoords[randIdx];
    } else {
        return new Coordinate(Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize));
    }
}

//------ GAME DOM MANIPULATION
//Clears the gameboard of all objects (snake & apple)
function clearGameBoardDisplay() {
    let gs = document.querySelectorAll(".game-square")
    gs.forEach(n => {
        n.style.backgroundColor = "transparent"
    });
}


//---------------- PRE START GAME 

let demoInterval = null;
let demoAI = null;
let demoApple = null;
demoSnake();
function demoSnake() {
    demoAI = new AISnake();
    snakeList.push(demoAI);
    demoApple = new Fruit();
    demoApple.color = AIfruitColor;
    demoAI.setDisplay();
    demoApple.setDisplay();
    let gamePlayDemo = function () {
        demoInterval = setInterval(step, clock);

        function step() {
            let currAILastSeg = null;
            currAILastSeg = getLastSeg(demoAI.position);
            demoAI.autoMove(demoApple);
            if (demoAI.isAtApple(demoApple)) {
                demoApple.resetPosition();
                demoAI.pushSegment(currAILastSeg);
            }
            if (isSnakeHitSelf(demoAI) ||
                demoAI.position.length >= 50 ||
                isSnakeOOB(demoAI)) {
                demoAI = new AISnake();
                //animateGameboard("pulse");
            }
            clearGameBoardDisplay();
            demoAI.setDisplay();
            demoApple.setDisplay();
        }
    }
    gamePlayDemo();
}

//Clear demo snake and title displays
function clearDemo() {
    snakeList = [];
    clearInterval(demoInterval);
    clearGameBoardDisplay();
    toggleStartMenu();
}

function toggleStartMenu() {

    let gt = document.querySelector("#game-title");
    let gs = document.querySelector(".game-select");

    if (gt.style.visibility == "hidden") {
        gt.style.visibility = "visible";
        gs.style.visibility = "visible";
    } else {
        gt.style.visibility = "hidden";
        gs.style.visibility = "hidden";
    }

}


//------ GAME SET UP

//Initialize game objects

let playerSnake = null
let playerApple = null;
let classicInterval = null;
let AI = null;
let AIapple = null;


//Event listeners for game type selection

//CLASSIC
document.getElementById("play-classic").addEventListener('click', function () {
    clearDemo();

    //Initialize player snake and fruit
    playerSnake = new Snake();
    snakeList.push(playerSnake);
    playerSnake.setDisplay();

    playerApple = new Fruit();
    playerApple.setDisplay();

    //Initialize controls
    setControls(playerSnake);
    setAllClickListeners(playerSnake);

    //(Re)set scoreboard
    scoreBoard.round++;
    scoreBoard.resetScore();
    toggleScoreDisplay(true);
    document.getElementById("kills-board").style.visibility = "hidden";
    updateScoreDisplay();

    //Begin Classic
    countdownTimer(gamePlayClassic);

});

// BATTLE SNAKES
document.getElementById("play-battleMode").addEventListener('click', function() {
    clearDemo();

    //Initialize player snake and fruit
    playerSnake = new Snake();
    snakeList.push(playerSnake);
    playerSnake.setDisplay();

    playerApple = new Fruit();
    playerApple.setDisplay();

    //Initialize controls
    setControls(playerSnake);
    setAllClickListeners(playerSnake);

    //Initialize new AI Snake and Fruit
    AI = new AISnake();
    snakeList.push(AI);
    AIapple = new Fruit();
    AIapple.color = AIfruitColor;
    AI.setDisplay();
    AIapple.setDisplay();

    //(Re)set scoreboard
    scoreBoard.round++;
    scoreBoard.resetScore();
    toggleScoreDisplay(true);
    document.getElementById("kills-board").style.visibility = "visible";
    updateScoreDisplay();

    // Begin Battle Mode
    countdownTimer(gamePlayBattle, 3, 'Battle!');

});


//------ CLASSIC SNAKE GAMEPLAY
let gamePlayClassic = function () {

    classicInterval = setInterval(step, clock);

    function step() {

        //Store position of last segment of snake
        let currSnakeLastSeg = null;
        if (!playerSnake.isDead) {
            currSnakeLastSeg = getLastSeg(playerSnake.position);
        }

        //Move snake
        playerSnake.move();

        //Player Snake Dies end interval
        if (isSnakeOOB(playerSnake) || isSnakeHitSelf(playerSnake)) {
            console.log(`Player Dead`);
            killAnimate(true);
            clearInterval(classicInterval)
            animateGameboard("headShake");
            setTimeout(function(){
                demoSnake();
                toggleStartMenu();
            }, 2500);
            
        } else {
            if (playerSnake.isAtApple(playerApple)) {
                playerApple.resetPosition();
                playerSnake.pushSegment(currSnakeLastSeg);
                scoreBoard.score++;
            }
            //Reset grid display
            clearGameBoardDisplay();
            //Show display
            playerSnake.setDisplay();
            playerApple.setDisplay();
            updateScoreDisplay();
        }
    }
}


//------ BATTLE MODE GAMEPLAY
let gamePlayBattle = function() {
    battleInterval = setInterval(step, clock);

    function step() {
        let currSnakeLastSeg = null;
        let currAILastSeg = null;

        //Store position of last segment of snake
        if (!playerSnake.isDead) {
            currSnakeLastSeg = getLastSeg(playerSnake.position);
        }

        if(!AI.isDead){
            currAILastSeg = getLastSeg(AI.position);
        }

        //move snakes
        playerSnake.move();
        AI.autoMove(AIapple);

        // Player Snake Dies end main interval
        if(isSnakeOOB(playerSnake) || isSnakeHitSelf(playerSnake) || AI.isInSnake(playerSnake.position[0].i, playerSnake.position[0].j, true) ) {
            if(playerSnake.position[0].i == AI.position[0].i) {
                console.log("Head on collision");
                killAnimate(true);
            }
            else{
                console.log("Player Dead");
                killAnimate(true);
            }
            clearInterval(battleInterval);
            animateGameboard("headShake");
            toggleStartMenu();
        }
        else {
            // check conditions
            //Player snake eats apple
            if (playerSnake.isAtApple(playerApple)) {
                playerApple.resetPosition();
                playerSnake.pushSegment(currSnakeLastSeg);
                scoreBoard.score++;
                console.log(scoreBoard);
            }

            if (!AI.isDead) {
                if (isSnakeHitSelf(AI) || playerSnake.isInSnake(AI.position[0].i, AI.position[0].j, true) || isSnakeOOB(AI)) {
                    console.log(`AI is Dead`)
                    animateGameboard("pulse");
                    killAnimate();
                    AI.kill();
                    scoreBoard.kills++;

                    respawnTimer(function () {
                        AI = new AISnake();
                        AI.setDisplay();
                        AIapple.resetPosition();
                    }, 3, "");

                } else if (AI.isAtApple(AIapple)) {
                    AIapple.resetPosition();
                    AI.pushSegment(currAILastSeg);
                }
            }
            //Reset grid display
            clearGameBoardDisplay();
            //Show display
            playerSnake.setDisplay();
            playerApple.setDisplay();
            AI.setDisplay();
            AIapple.setDisplay();
            updateScoreDisplay();
        }
    }

}


//------ USER CONTROLS

//Assign keyboard controls
function setControls(snakeObj) {
    document.addEventListener("keyup", arrowHit)

    function arrowHit() {
        console.log("arrow hit")
        switch (event.keyCode) {
            case 39: //east
                if (snakeObj.direction != "w") {
                    snakeObj.setDirection("e");
                }
                break;
            case 38: //north
                if (snakeObj.direction != "s") {
                    snakeObj.setDirection("n");
                }
                break;
            case 37: //west
                if (snakeObj.direction != "e") {
                    snakeObj.setDirection("w");
                }
                break;
            case 40: //south
                if (snakeObj.direction != "n") {
                    snakeObj.setDirection("s");
                }
                break;
        }
    }
}


//Removes default arrow key behaviour on windows
window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


//Set touch listeners for touchscreen support
function setClickListener(i, j, dir, snakeObj) {
    let sq = getSquareNode(i, j)
    sq.addEventListener("touchstart", function () {
        switch (dir) {
            case "e": //east
                if (snakeObj.direction != "w") {
                    snakeObj.setDirection("e");
                }
                break;
            case "n": //north
                if (snakeObj.direction != "s") {
                    snakeObj.setDirection("n");
                }
                break;
            case "w": //west
                if (snakeObj.direction != "e") {
                    snakeObj.setDirection("w");
                }
                break;
            case "s": //south
                if (snakeObj.direction != "n") {
                    snakeObj.setDirection("s");
                }
                break;
        }
    });
}

//Set listeners based on gameboard
function setAllClickListeners(snakeObj) {
    //North
    for (let idx = 0, len = gridSize - 1; idx < Math.floor(gridSize / 2); idx++, len--) {
        for (let jdx = idx + 1; jdx < len; jdx++) {
            setClickListener(idx, jdx, "n", snakeObj)
        }
    }

    //South
    for (let idx = gridSize - 1, len = gridSize - 1; idx > Math.floor(gridSize / 2); idx--, len--) {
        for (let jdx = gridSize - len; jdx < len; jdx++) {
            setClickListener(idx, jdx, "s", snakeObj)
        }
    }

    //West
    for (let jdx = 0, len = gridSize - 1; jdx < Math.floor(gridSize / 2); jdx++, len--) {
        for (let idx = jdx + 1; idx < len; idx++) {
            setClickListener(idx, jdx, "w", snakeObj)
        }
    }

    //East
    for (let jdx = gridSize - 1, len = gridSize - 1; jdx > Math.floor(gridSize / 2); jdx--, len--) {
        for (let idx = gridSize - len; idx < len; idx++) {
            setClickListener(idx, jdx, "e", snakeObj)
        }
    }
}

//------ ANIMATION / FX
function animateGameboard(type = "pulse") {
    const element = document.querySelector('#game-board');
    element.classList.add('animate__animated', `animate__${type}`, 'animate__faster');
    element.addEventListener('animationend', () => {
        element.classList.remove('animate__animated', `animate__${type}`, 'animate__faster');
    });
}
