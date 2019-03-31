
function Ball(initPos, color){
    this.initPos = initPos;
    this.position = initPos.copy();
    this.velocity = new Vector2();
    this.origin = BALL_ORIGIN
    this.moving = false;
    this.sprite = getBallSpriteByColor(color);
    this.inHole = false;
    this.visible = true;
    this.color = color;
}

Ball.prototype.update = function(delta){

    //palla non in gioco, non aggiorno la sua posizione
    if(!this.visible){
        return;
    }

    this.position.addTo(this.velocity.mult(delta));

    //applico l'attrito del tavolo
    this.velocity = this.velocity.mult(0.984);

    if(this.moving && Math.abs(this.velocity.x) < 1 && Math.abs(this.velocity.y) < 1){
        this.stop();
    }
}

Ball.prototype.draw = function(){
    //palla eliminata non la disegno
    if(!this.visible){
        return;
    }
    Canvas.drawImage(this.sprite, this.position, BALL_ORIGIN);
}

Ball.prototype.shoot = function(power, rotation){

    this.velocity = new Vector2(power * Math.cos(rotation), power * Math.sin(rotation));
    this.moving = true;
}

Ball.prototype.collideWithBall = function(ball){

    //palla è stata eliminata, non avvengon collisioni con essa
    if(!this.visible || !ball.visible){
        return;
    }

    //calolo il vettore normale
    const n = this.position.subtract(ball.position);

    //trovo la distanza
    const dist = n.length();

    //no collisioni
    if(dist > BALL_DIAMETER){
        return;
    }

    //riproduco il suono di collisione in base alle componenti della velocità delle palle
    if(dist < BALL_DIAMETER){

        PoolPolicy.checkColisionValidity(this, ball);

        var power = (Math.abs(this.velocity.x) + Math.abs(this.velocity.y)) + 
                    (Math.abs(ball.velocity.x) + Math.abs(ball.velocity.y));
        power = power * 0.00482;
        var ballsCollide = sounds.ballsCollide.cloneNode(true);
        ballsCollide.volume = (power/(20))<1?(power/(20)):1;
        ballsCollide.play();
    }

    //trovo la distanza minima di traslazione
    const mtd = n.mult((BALL_DIAMETER - dist) / dist);

    //push-pull balls apart
    this.position = this.position.add(mtd.mult(1/2));
    ball.position = ball.position.subtract(mtd.mult(1/2));

    //trovo il vettore di norma unitaria perpendicolare alla superficie della palla che colpisco
    const un = n.mult(1/n.length());

    //trovo il vettore tangente unitario, tangente alla superficie delle palline
    const ut = new Vector2(-un.y, un.x);

    //calcolo le velocità dei vettori tramite prodotto scalare project velocities onto the unit normal and unit tangent vectors
    const v1n = un.dot(this.velocity);
    const v1t = ut.dot(this.velocity);
    const v2n = un.dot(ball.velocity);
    const v2t = ut.dot(ball.velocity);

    //trovo le nuove velocità normali
    let v1nTag = v2n;
    let v2nTag = v1n;

    //converto gli scalari delle velocità normali e tangenziali in vettori
    v1nTag = un.mult(v1nTag);
    const v1tTag = ut.mult(v1t);
    v2nTag = un.mult(v2nTag);
    const v2tTag = ut.mult(v2t);

    //aggiorno le velocità
    this.velocity = v1nTag.add(v1tTag);
    ball.velocity = v2nTag.add(v2tTag);

    this.moving = true;
    ball.moving = true;
}

//funzione per le collisioni con il tavolo
Ball.prototype.collideWithTable = function(table){
    

    if(!this.moving || !this.visible){
        return;
    }

    let collided = false;

    if(this.position.y <= table.TopY + BALL_RADIUS){
        this.position.y = table.TopY + BALL_RADIUS;
        this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
        collided = true;
        var power = (Math.abs(this.velocity.x) + Math.abs(this.velocity.y));
        power = power * 0.00482;
        var side = sounds.side.cloneNode(true);
        side.volume = (power/(50))<0.3?(power/(50)):0.3;
        side.play();
    }

    if(this.position.x >= table.RightX - BALL_RADIUS){
        this.position.x = table.RightX - BALL_RADIUS;
        this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
        collided = true;
        var power = (Math.abs(this.velocity.x) + Math.abs(this.velocity.y));
        power = power * 0.00482;
        var side = sounds.side.cloneNode(true);
        side.volume = (power/(50))<0.3?(power/(50)):0.3;
        side.play();
    }

    if(this.position.y >= table.BottomY - BALL_RADIUS){
        this.position.y = table.BottomY - BALL_RADIUS;
        this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
        collided = true;
        var power = (Math.abs(this.velocity.x) + Math.abs(this.velocity.y));
        power = power * 0.00482;
        var side = sounds.side.cloneNode(true);
        side.volume = (power/(50))<0.3?(power/(50)):0.3;
        side.play();
    }

    if(this.position.x <= table.LeftX + BALL_RADIUS){
        this.position.x = table.LeftX + BALL_RADIUS;
        this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
        collided = true;
        var power = (Math.abs(this.velocity.x) + Math.abs(this.velocity.y));
        power = power * 0.00482;
        var side = sounds.side.cloneNode(true);
        side.volume = (power/(50))<0.3?(power/(50)):0.3;
        side.play();
    }

    if(collided){
        this.velocity = this.velocity.mult(0.984);
    }
}
//gestisco la palla dentro la buca
Ball.prototype.handleBallInPocket = function(pockets, pocketRadius){
    
    if(!this.visible){
        return;
    }

    let inPocket = pockets.some(pocket =>{
        return this.position.distFrom(pocket) < pocketRadius;
    });

    if(!inPocket){
        return;
    }
    if(!PoolPolicy.inHand){
        var holeSound = sounds.hole.cloneNode(true);
        holeSound.volume = 0.4;
        holeSound.play();
    }
    this.visible = false;
    this.moving = false;
    this.velocity = new Vector2();

    let currentPlayer = PoolGame.gameWorld.players[PoolPolicy.turn];
    let secondPlayer = PoolGame.gameWorld.players[(PoolPolicy.turn+1)%2];
    
    //set della palla iniziale
    if(currentPlayer.color == undefined){
        if(this.color === RED){
            currentPlayer.color = "#990000";
            secondPlayer.color = "#FBB917";
        }
        else if(this.color === YELLOW){
            currentPlayer.color = "#FBB917";
            secondPlayer.color = "#990000";
        }
        else if(this.color === BLACK){
            PoolPolicy.won = true; 
            PoolPolicy.foul = true;
        }
        else if(this.color === WHITE){
            PoolPolicy.foul = true;
        }
    }

    //punto fatto
    if(currentPlayer.color === this.color){
        currentPlayer.totalScore.increment();
        PoolPolicy.scored = true;
        this.validBallsInsertedOnTurn++;
    }

    else if(this.color === WHITE){

        if(currentPlayer.color != undefined){
            PoolPolicy.foul = true;

            let ballsSet = PoolGame.gameWorld.getBallsSetByColor(currentPlayer.color);

            let allBallsInHole = true;

            for (var i = 0 ; i < ballsSet.length; i++){
                if(!ballsSet[i].inHole){
                    allBallsInHole = false;
                }
            }

            if(allBallsInHole){
                PoolPolicy.won = true;
            }
        }
    }
    else if(this.color === BLACK){

        if(currentPlayer.color != undefined){
            let ballsSet = PoolGame.gameWorld.getBallsSetByColor(currentPlayer.color);

            for (var i = 0 ; i < ballsSet.length; i++){
                if(!ballsSet[i].inHole){
                    PoolPolicy.foul = true;
                }
            }
            
            PoolPolicy.won = true;
        }
    }
    else{
        secondPlayer.totalScore.increment();
        PoolPolicy.foul = true; 
    }
    
}

//funzione di test per la pallina bianca

Ball.prototype.ballColor = function(){
    if(this.color === WHITE){
        return false;}

    return true;
}

Ball.prototype.reset = function(){
	this.inHole = false;
	this.moving = false;
	this.velocity = new Vector2();
	this.position = this.initPos;
	this.visible = true;
}

Ball.prototype.out = function(){

	this.position = new Vector2(0, 900);
	this.visible = false;
	this.inHole = true;

}

//fermo la pallina
Ball.prototype.stop = function(){

    this.moving = false;
    this.velocity = new Vector2();
}
