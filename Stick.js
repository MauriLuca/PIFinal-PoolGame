function Stick(position, onShoot){
    this.position = position;
    this.rotation = 0;
    this.origin = STICK_ORIGIN.copy();
    this.power = 0;
    this.onShoot = onShoot;
    this.shot = false;
    this.visible = true;
}

Stick.prototype.update = function () {

    //per evitare di poter colpire nuovamente prima che le palline si fermino
    if(this.shot || PoolPolicy.foul){
        return;
    }
    if (Mouse.left.down){
        this.increasePower();
    } 
    else if ( this.power > 0){
        this.shoot();
    }
    this.updateRotation();
}

Stick.prototype.draw = function() {
    if(PoolPolicy.foul){
        return;
    }
    Canvas.drawImage(sprites.stick, this.position, this.origin, this.rotation);
}

Stick.prototype.updateRotation = function(){

    let opposite = Mouse.position.y - this.position.y;
    let adjacent = Mouse.position.x - this.position.x;

    this.rotation = Math.atan2(opposite, adjacent);
}

Stick.prototype.increasePower = function(){
    if(this.power > MAX_POWER){
        return;
    }
    this.power += 120;
    this.origin.x += 5;
}

Stick.prototype.shoot = function(){
    if(PoolPolicy.foul){
        return;
    }
    this.onShoot(this.power, this.rotation);
    var strike = sounds.strike.cloneNode(true);
    strike.volume = (this.power/(10))<1?(this.power/(10)):1;
    strike.play();
    PoolPolicy.turnPlayed = true;
    this.power = 0;
    this.origin = STICK_SHOT_ORIGIN.copy();
    this.shot = true;
}

Stick.prototype.reposition = function(position){
    this.position = position.copy();
    this.origin = STICK_ORIGIN.copy();
    this.shot = false;
    this.visible = true;
}

Stick.prototype.reset = function(){
    this.position.x = PoolGame.gameWorld.whiteBall.position.x;
    this.position.y = PoolGame.gameWorld.whiteBall.position.y;
    this.origin = STICK_ORIGIN.copy();
    this.shot = false;
    this.visible = true;
    this.power = 0;
  };