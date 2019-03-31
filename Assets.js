let sprites = {};
let sounds = {};
let assetsStillLoading = 0;

//richiedo al browser di eseguire un'animazione e fare la callback prima di fare il nuovo render del browser
//solo dopo aver caricato tutti gli assets
function assetsLoadingLoop(callback){
    if(assetsStillLoading){
        requestAnimationFrame(assetsLoadingLoop.bind(this, callback));
    }
    else{
        callback();
    }
}

//carico gli assets
function loadAssets(callback){
    //sprites
    function loadSprite(fileName){
        
        assetsStillLoading++;

        let spriteImage = new Image();
        spriteImage.src = "./assets/sprites/" + fileName;

        spriteImage.onload = function(){
            assetsStillLoading--;
        }
        return spriteImage;
    }
    //sounds
    function loadSound(fileName){

        let soundAudio = new Audio();
        soundAudio.src = "./assets/sounds/" + fileName;

        return soundAudio;

    }
    sprites.background = loadSprite("background_green2.png");
    sprites.menu = loadSprite("menuscreen.jpg");
    sprites.stick = loadSprite("spr_stick.png");
    sprites.whiteBall = loadSprite("spr_ball2.png");
    sprites.redBall = loadSprite("spr_redBall2.png");
    sprites.yellowBall = loadSprite("spr_yellowBall2.png");
    sprites.blackBall = loadSprite("spr_blackBall2.png");
    sprites.start = loadSprite("start.png");
    sprites.startPressedHover = loadSprite("start.png");
    sounds.side = loadSound("Side.wav");
    sounds.ballsCollide = loadSound("BallsCollide.wav");
    sounds.strike = loadSound("Strike.wav");
    sounds.hole = loadSound("Hole.wav");

    assetsLoadingLoop(callback);
}

function getBallSpriteByColor(color){

    switch(color){

        case RED:
            return sprites.redBall;
        case YELLOW:
            return sprites.yellowBall;
        case BLACK:
            return sprites.blackBall;
        case WHITE:
            return sprites.whiteBall;
    }
}

