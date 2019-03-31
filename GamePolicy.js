//file contenente tutte le regole di gioco

function GamePolicy(){

    this.turn = 0;
    this.firstCollision = true;    
    
    this.inHand = false;

    this.foul = false;

    this.scored = false;
    this.won = false;
    this.turnPlayed = false;
    this.validBallsInsertedOnTurn = 0;

    this.leftBorderX = BORDER_SIZE;
    this.rightBorderX = 1500 - BORDER_SIZE;
    this.topBorderY = BORDER_SIZE;
    this.bottomBorderY = 825 - BORDER_SIZE;

    this.topCenterHolePos = new Vector2(750,32);
    this.bottomCenterHolePos = new Vector2(750,794);
    this.topLeftHolePos = new Vector2(62,62);
    this.topRightHolePos = new Vector2(1435,62);
    this.bottomLeftHolePos = new Vector2(62,762)
    this.bottomRightHolePos = new Vector2(1435,762);
}

GamePolicy.prototype.reset = function(){
    this.turn = 0;
    PoolGame.gameWorld.players[0].color = undefined;
    PoolGame.gameWorld.players[1].color = undefined;
    PoolGame.gameWorld.players[0].totalScore.value = 0;
    PoolGame.gameWorld.players[1].totalScore.value = 0;
    this.foul = false;
    this.scored = false;
    this.turnPlayed = false;
    this.won = false;
    this.firstCollision = true;
    this.validBallsInsertedOnTurn = 0;
}

GamePolicy.prototype.drawScores = function(){
    Canvas.drawText("GIOCATORE ", new Vector2(1500/2 + 20,200), new Vector2(150,0), "#014710", "top", "Impact", "70px");
    Canvas.drawText(this.turn+1, new Vector2(1500/2 + 340,200), new Vector2(150,0), PoolGame.gameWorld.players[this.turn].color, "top", "Impact", "70px");
    Canvas.drawText("-", new Vector2(1500/2 + 140,825/2 - 45), new Vector2(125,60),"#014710", "top", "Impact", "150px");
    PoolGame.gameWorld.players[0].totalScore.draw();
    PoolGame.gameWorld.players[1].totalScore.draw();
}

//funzione per la collisione con la prima palla
GamePolicy.prototype.checkColisionValidity = function(ball1,ball2){

    let currentPlayerColor = PoolGame.gameWorld.players[this.turn].color;

    if(PoolGame.gameWorld.players[this.turn].totalScore.value == 7 &&
       (ball1.color == BLACK || ball2.color == BLACK)){
        this.firstCollision = false;
        return;
       }

    if(!this.firstCollision)
        return;

    if(currentPlayerColor == undefined){
        this.firstCollision = false;
        return;
    }

    if(ball1.color == WHITE){
        if(ball2.color != currentPlayerColor){
            this.foul = true;
        }
        this.firstCollision = false;
    }

    if(ball2.color == WHITE){
        if(ball1.color != currentPlayerColor){
            this.foul = true;
        }
        this.firstCollision = false;
    }
}

GamePolicy.prototype.switchTurns = function(){
    this.turn++;
    this.turn%=2;
}

GamePolicy.prototype.updateTurnOutcome = function(){
    
    if(!this.turnPlayed){
        return;
    }
    
    if(this.firstCollision == true){
        this.foul = true;
    }
    
    if(this.won){
        this.reset();
        PoolGame.gameWorld.reset();    
        return;
    }

    if(!this.scored || this.foul)
        this.switchTurns();

    this.scored = false;
    this.turnPlayed = false;
    this.firstCollision = true;
    this.validBallsInsertedOnTurn = 0;
}

GamePolicy.prototype.isXOutsideLeftBorder = function(pos, origin){
    return (pos.x - origin.x) < this.leftBorderX;
}

GamePolicy.prototype.isXOutsideRightBorder = function(pos, origin){
    return (pos.x + origin.x) > this.rightBorderX;
}
GamePolicy.prototype.isYOutsideTopBorder = function(pos, origin){
    return (pos.y - origin.y) < this.topBorderY;
}
GamePolicy.prototype.isYOutsideBottomBorder = function(pos , origin){
    return (pos.y + origin.y) > this.bottomBorderY;
}

GamePolicy.prototype.isOutsideBorder = function(pos,origin){
    return this.isXOutsideLeftBorder(pos,origin) || this.isXOutsideRightBorder(pos,origin) || 
    this.isYOutsideTopBorder(pos, origin) || this.isYOutsideBottomBorder(pos , origin);
}

GamePolicy.prototype.isInsideTopLeftHole = function(pos){
    return this.topLeftHolePos.distFrom(pos) < HOLE_RADIUS;
}

GamePolicy.prototype.isInsideTopRightHole = function(pos){
    return this.topRightHolePos.distFrom(pos) < HOLE_RADIUS;
}

GamePolicy.prototype.isInsideBottomLeftHole = function(pos){
    return this.bottomLeftHolePos.distFrom(pos) < HOLE_RADIUS;
}

GamePolicy.prototype.isInsideBottomRightHole = function(pos){
    return this.bottomRightHolePos.distFrom(pos) < HOLE_RADIUS;
}

GamePolicy.prototype.isInsideTopCenterHole = function(pos){
    return this.topCenterHolePos.distFrom(pos) < (HOLE_RADIUS + 6);
}

GamePolicy.prototype.isInsideBottomCenterHole = function(pos){
    return this.bottomCenterHolePos.distFrom(pos) < (HOLE_RADIUS + 6);
}

GamePolicy.prototype.isInsideHole = function(pos){
    return this.isInsideTopLeftHole(pos) || this.isInsideTopRightHole(pos) || 
           this.isInsideBottomLeftHole(pos) || this.isInsideBottomRightHole(pos) ||
           this.isInsideTopCenterHole(pos) || this.isInsideBottomCenterHole(pos);
}

let PoolPolicy = new GamePolicy();