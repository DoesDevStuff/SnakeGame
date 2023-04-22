
class Snake {
    constructor(i = start_i, j = start_j) {
        this.position = []; //array of coordinates
        this.headColor = playerSnakeHeadColor;
        this.snakeColor = playerSnakeColor;
        this.direction = "e";
        this.isDead = false;
        //Baby snake
        for (let x = 0; x < startLength; x++) {
            this.position.push(new Coordinate(i, j))
            j--;
        };
    }

    //Update new position of each segment 
    move() {
        if (this.isDead) {
            return;
        } else {
            //Starting from tail
            for (let x = this.position.length - 1; x > 0; x--) {
                this.position[x].i = this.position[x - 1].i
                this.position[x].j = this.position[x - 1].j
                this.position[x].dir = this.position[x - 1].dir
            }
            //Head position
            this.position[0].dir = this.direction;
            switch (this.direction) {
                case "e":
                    this.position[0].j++;
                    break;
                case "n":
                    this.position[0].i--;
                    break;
                case "w":
                    this.position[0].j--;
                    break;
                case "s":
                    this.position[0].i++;
                    break;
            }
        }

    }

    setDirection(d) {
        this.direction = d;
    }

    //Push a new segment into the snake
    pushSegment(coordinate) {
        if (this.isDead) {
            return;
        } else {
            this.position.push(coordinate);
        }
    }

    //Checks if given coordinate is in snake;
    isInSnake(i, j, includeHead = false) {
        let isInSnake = false;
        let startIndex = includeHead ? 0 : 1;
        for (let x = startIndex; x < this.position.length; x++) {
            if (i === this.position[x].i &&
                j === this.position[x].j) {
                isInSnake = true;
            }
        }
        return isInSnake;
    }
    dirAtPosition(i, j) {
        let dir = null;
        for (let x = 0; x < this.position.length; x++) {
            if (i === this.position[x].i &&
                j === this.position[x].j) {
                dir = this.position[x].dir;
            }
        }
        return dir
    }
    setDisplay() {
        if (this.isDead) {
            return;
        } else {
            this.position.forEach((seg, idx) => {
                let n = getSquareNode(seg.i, seg.j);
                if (idx == 0) {
                    n.style.backgroundColor = this.headColor;
                } else {
                    n.style.backgroundColor = this.snakeColor;
                }

            });
        }
    }
    isAtApple(fruitObj) {
        if (fruitObj.position.i == this.position[0].i &&
            fruitObj.position.j == this.position[0].j) {
            return true;
        } else {
            return false;
        }
    }
    //Returns position index of given segment coordinate
    positionIndex(i, j) {
        let index = null;
        for (let x = 0; x < this.position.length; x++) {
            if (i === this.position[x].i &&
                j === this.position[x].j) {
                index = x;
            }
        }
        return index;

    }
    kill() {
        this.position = [];
        this.isDead = true;
    }

}
