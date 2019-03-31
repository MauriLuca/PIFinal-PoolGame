"use strict";

//contiene tutti gli oggetti fisici

function GameWorld(){

    this.firstCollision = true;

    let player1TotalScore = new Score(new Vector2(1500/2 - 75,825/2 - 45));
    let player2TotalScore = new Score(new Vector2(1500/2 + 140,825/2 - 45));

    this.players = [new Player(player1TotalScore), new Player(player2TotalScore)];

    this.whiteBallStartingPosition = new Vector2(413,413);

    //Palle Rosse
    this.redBalls = [
        new Ball(new Vector2(1056,433),RED),//3
        new Ball(new Vector2(1090,374),RED),//4
        new Ball(new Vector2(1126,393),RED),//8
        new Ball(new Vector2(1126,472),RED),//10
        new Ball(new Vector2(1162,335),RED),//11
        new Ball(new Vector2(1162,374),RED),//12
        new Ball(new Vector2(1162,452),RED)//14
        ]
    //Palle Gialle
    this.yellowBalls = [
        new Ball(new Vector2(1022,413),YELLOW),//1
        new Ball(new Vector2(1056,393),YELLOW),//2
        new Ball(new Vector2(1090,452),YELLOW),//6
        new Ball(new Vector2(1126,354),YELLOW),//7
        new Ball(new Vector2(1126,433),YELLOW),//9
        new Ball(new Vector2(1162,413),YELLOW),//13
        new Ball(new Vector2(1162,491),YELLOW)//15
        ];

    this.whiteBall = new Ball(new Vector2(413,413),WHITE);
    this.blackBall = new Ball(new Vector2(1090,413),BLACK);

    this.balls = [
        this.yellowBalls[0],
        this.yellowBalls[1],
        this.redBalls[0],
        this.redBalls[1],
        this.blackBall,
        this.yellowBalls[2],
        this.yellowBalls[3],
        this.redBalls[2],
        this.yellowBalls[4],
        this.redBalls[3],
        this.redBalls[4],
        this.redBalls[5],
        this.yellowBalls[5],
        this.redBalls[6],
        this.yellowBalls[6],
        this.whiteBall]

    this.stick = new Stick(
        new Vector2(413,413), 
        this.whiteBall.shoot.bind(this.whiteBall));//per non perdere il riferimento

    this.table = {
        TopY: 57,
        RightX: 1443,
        BottomY: 768,
        LeftX: 57
    }

    this.pocketRadius = 46,
    this.pockets = [
        new Vector2(750, 32),
        new Vector2(750,794),
        new Vector2(62,62),
        new Vector2(1435,62),
        new Vector2(62,762),
        new Vector2(1435,762)
    ];
    this.gameOver = false;
}

//funzione per dividere le palle nelle quattro categorie
GameWorld.prototype.getBallsSetByColor = function(color){

    if(color === RED){
        return this.redBalls;
    }
    if(color === YELLOW){
        return this.yellowBalls;
    }
    if(color === WHITE){
        return this.whiteBall;
    }
    if(color === BLACK){
        return this.blackBall;
    }
}

GameWorld.prototype.handleCollision = function(){

    for(let i = 0; i < this.balls.length; i++){ 

        this.balls[i].handleBallInPocket(this.pockets, this.pocketRadius);
        this.balls[i].collideWithTable(this.table);

        for(let j = i + 1; j < this.balls.length; j++){
            const firstBall = this.balls[i];
            const sencondBall = this.balls[j];
            //la pallina bianca non sposta le altre mentre viene riposizionata
            if(sencondBall  === this.whiteBall && PoolPolicy.inHand === true){}
            else{
            firstBall.collideWithBall(sencondBall);
            }
        }
    }
}

GameWorld.prototype.update = function(){
    this.handleCollision();
    
    this.stick.update();
    
    for(let i = 0; i < this.balls.length; i++){
        this.balls[i].update(DELTA);
    }

    if(!this.ballsMoving() && this.stick.shot){
        this.stick.reposition(this.whiteBall.position);
    }

    if(!this.ballsMoving()){
        PoolPolicy.updateTurnOutcome();
        //se la palla è in fallo
        if(PoolPolicy.foul){
            if(!this.ballsMoving()){
            this.ballInHand();
            this.stick.visible = false;
            }
        }
    }
}

//funzione per riposizionare la palla bianca
GameWorld.prototype.ballInHand = function(){
    PoolPolicy.inHand = true;
    this.whiteBall.visible = true;
    if(!Mouse.middle.down){
        this.whiteBall.position = Mouse.position;
    }
    else {
        let ballsOverlap = this.whiteBallOverlapsBalls();

        if(!PoolPolicy.isOutsideBorder(Mouse.position,this.whiteBall.origin) &&
            !PoolPolicy.isInsideHole(Mouse.position) &&
            !ballsOverlap){
            Mouse.reset();
            this.whiteBall.position = Mouse.position;
            this.whiteBall.inHole = false;
            PoolPolicy.foul = false;
            this.stick.position = this.whiteBall.position;
            this.stick.position = this.stick.position.copy();
            PoolPolicy.inHand = false;
        }
    }

}
//funzione di supporto che controlla che la palla non si sovrapponga alle altre
GameWorld.prototype.whiteBallOverlapsBalls = function(){

    let ballsOverlap = false;
    for (var i = 0 ; i < this.balls.length; i++) {
        if(this.whiteBall !== this.balls[i]){
            if(this.whiteBall.position.distFrom(this.balls[i].position)<BALL_DIAMETER){
                ballsOverlap = true;
            }
        }
    }

    return ballsOverlap;
}

GameWorld.prototype.draw = function(){

    Canvas.drawImage(sprites.background);
    PoolPolicy.drawScores();

    for(let i = 0; i < this.balls.length; i++){
        this.balls[i].draw();
    }

    this.stick.draw();

}

GameWorld.prototype.reset = function () {
    this.gameOver = false;

    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].reset();
    }

    this.stick.reset();
    
};

GameWorld.prototype.ballsMoving = function(){
    let ballsMoving = false;

    for(let i = 0; i < this.balls.length; i++){
        if(this.balls[i].moving){
            ballsMoving = true;
            break;
        }
    }

    return ballsMoving;
}