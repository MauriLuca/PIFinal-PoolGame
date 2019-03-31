
function Game() {
    this.size = undefined;
    this.spritesStillLoading = 0;
    this.gameWorld = undefined;
    this.sound = true;
}

//inizializza il gioco
Game.prototype.init = function(){
    this.gameWorld = new GameWorld();
}

//fa partire il gioco
Game.prototype.start = function(x,y){
    this.size = new Vector2(x,y);
    Canvas.initialize();
    PoolGame.init();
    PoolGame.mainLoop();
}

//loop del gioco
Game.prototype.mainLoop = function(){
    
    Canvas.clear();
    PoolGame.gameWorld.update();
    PoolGame.gameWorld.draw();
    //mouse input
    Mouse.reset();

    requestAnimationFrame(PoolGame.mainLoop);
}

let PoolGame = new Game();