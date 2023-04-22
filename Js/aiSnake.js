
class AISnake extends Snake {
    constructor(i = start_i - 5, j = start_j - 5) {
        super(i, j);
        this.headColor = AISnakeHeadColor;
        this.snakeColor = AISnakeColor;
        this.position = [];
        for (let x = 0; x < startLength - 5; x++) {
            this.position.push(new Coordinate(i, j))
            j--;
        };

    }
    //Checks if movement 1 unit in "dir" will result in snake
    isNewPosInSnake(dir) {
        let newPos = translate(this.position[0].i, this.position[0].j, dir);
        return this.isInSnake(newPos.i, newPos.j)
    }

    autoMove(fruit) {

        if (this.isDead) {
            return;
        } else {
            //Set direction based on current scenario
            // directions are north south east west
            // this.direction=D[Math.floor(Math.random()*3)]
            // console.log(coordinate);
            let di = fruit.position.i;
            let dj = fruit.position.j;
            let i = this.position[0].i;
            let j = this.position[0].j;

            //southeast quadrant
            if (di >= i && dj >= j) {
                switch (this.direction) {
                    case "s":
                        this.direction = i == di ? "e" : "s"
                    case "e":
                        this.direction = j == dj ? "s" : "e";
                        break;
                    case "n":
                        this.direction = "e";
                        break;
                    case "w":
                        this.direction = "s";
                        break;
                }
                //southwest quadrant
            } else if (di >= i && dj <= j) {
                switch (this.direction) {
                    case "s":
                        this.direction = i == di ? "w" : "s"
                        break;
                    case "w":
                        this.direction = j == dj ? "s" : "w";
                        break;
                    case "e":
                        this.direction = "s";
                        break;
                    case "n":
                        this.direction = "w";
                        break;
                }
                //northwest quadrant
            } else if (di <= i && dj <= j) {
                switch (this.direction) {
                    case "n":
                        this.direction = i == di ? "w" : "n"
                        break;
                    case "w":
                        this.direction = j == dj ? "n" : "w";
                        break;
                    case "e":
                        this.direction = "n";
                        break;
                    case "s":
                        this.direction = "w";
                        break;
                }
                //northeast quadrant
            } else if (di <= i && dj >= j) {
                switch (this.direction) {
                    case "n":
                        this.direction = i == di ? "e" : "n"
                        break;
                    case "e":
                        this.direction = j == dj ? "n" : "e";
                        break;
                    case "s":
                        this.direction = "e";
                        break;
                    case "w":
                        this.direction = "n";
                        break;
                }
            }

            //CHECK IF NEW DIRECTION COLLIDES WITH ITSELF
            if (this.isNewPosInSnake(this.direction)) {
                console.log("will collide")
                let newPos = translate(this.position[0].i, this.position[0].j, this.direction);
                console.log(`current position: ${this.position[0].i},${this.position[0].j}`)
                console.log(`newPos: ${newPos.i}, ${newPos.j}`)
                let dir = this.dirAtPosition(newPos.i, newPos.j);
                console.log(`direction at position: ${dir}`)
                switch (this.direction) {
                    case "n":
                    case "s":
                        switch (dir) {
                            case "w":
                                this.direction = this.isNewPosInSnake("e") ? "w" : "e";
                                break;
                            case "e":
                                this.direction = this.isNewPosInSnake("w") ? "e" : "w";
                                break;
                            case "s":
                            case "n":
                                this.direction = this.position[this.positionIndex(newPos.i, newPos.j) - 1].dir == "w" ? "e" : "w";
                                break;
                        }
                        break;
                    case "e":
                    case "w":
                        switch (dir) {
                            case "s":
                                this.direction = this.isNewPosInSnake("n") ? "s" : "n";
                                break;
                            case "n":
                                this.direction = this.isNewPosInSnake("s") ? "n" : "s";
                                break;
                            case "e":
                            case "w":
                                this.direction = this.position[this.positionIndex(newPos.i, newPos.j) - 1].dir == "s" ? "n" : "s";
                                break;

                        }
                        break;
                }
                console.log(`result: ${this.direction}`)
            }
            //IF SO, CHOOSE A NEW DIRECTION THAT DOESN'T

            this.move();
        }
    }
}
