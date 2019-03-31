"use strict";

function Canvas2D(){
    this._canvas = null;
    this._canvasContext = null;
    this._canvasOffset = Vector2.zero;
}

Object.defineProperty(Canvas2D.prototype, "offset",
    {
        get: function () {
            return this._canvasOffset;
        }
    });

Object.defineProperty(Canvas2D.prototype, "scale",
    {
        get: function () {
            return new Vector2(this._canvas.width /1500,
                this._canvas.height / 825);
        }
    });

Canvas2D.prototype.initialize = function(){
    this._canvas = document.getElementById("screen");
    this._canvasContext = this._canvas.getContext("2d");
    this._div = document.getElementById("gameArea");
    window.onresize = Canvas2D.prototype.resize;
    this.resize();
}

Canvas2D.prototype.resize = function () {
    var gameCanvas = Canvas._canvas;
    var gameArea = Canvas._div;
    var widthToHeight = 1500 / 825;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
    } else {
        newHeight = newWidth / widthToHeight;
    }
    gameArea.style.width = newWidth + 'px';
    gameArea.style.height = newHeight + 'px';

    gameArea.style.marginTop = (window.innerHeight - newHeight) / 2 + 'px';
    gameArea.style.marginLeft = (window.innerWidth - newWidth) / 2 + 'px';
    gameArea.style.marginBottom = (window.innerHeight - newHeight) / 2 + 'px';
    gameArea.style.marginRight = (window.innerWidth - newWidth) / 2 + 'px';

    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;

    var offset = Vector2.zero;
    if (gameCanvas.offsetParent) {
        do {
            offset.x += gameCanvas.offsetLeft;
            offset.y += gameCanvas.offsetTop;
        } while ((gameCanvas = gameCanvas.offsetParent));
    }
    Canvas._canvasOffset = offset;
};

//funzione che cancella tutto il canvas
Canvas2D.prototype.clear = function(){
    this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
}

Canvas2D.prototype.drawImage = function(image, position, origin, rotation, scale){
    var canvasScale = this.scale;

    position = typeof position !== 'undefined' ? position : Vector2.zero;
    rotation = typeof rotation !== 'undefined' ? rotation : 0;
    scale = typeof scale !== 'undefined' ? scale : 1;
    origin = typeof origin !== 'undefined' ? origin : Vector2.zero;

    this._canvasContext.save();
    this._canvasContext.scale(canvasScale.x, canvasScale.y);
    this._canvasContext.translate(position.x, position.y);
    this._canvasContext.rotate(rotation);
    this._canvasContext.drawImage(image, 0, 0,
        image.width, image.height,
        -origin.x * scale, -origin.y * scale,
        image.width * scale, image.height * scale);
    this._canvasContext.restore();
}

Canvas2D.prototype.drawText = function (text, position, origin, color, textAlign, fontname, fontsize) {
    var canvasScale = this.scale;

    position = typeof position !== 'undefined' ? position : Vector2.zero;
    origin = typeof origin !== 'undefined' ? origin : Vector2.zero;
    color = typeof color !== 'undefined' ? color : "#014710";
    textAlign = typeof textAlign !== 'undefined' ? textAlign : "top";
    fontname = typeof fontname !== 'undefined' ? fontname : "sans-serif";
    fontsize = typeof fontsize !== 'undefined' ? fontsize : "20px";

    this._canvasContext.save();
    this._canvasContext.scale(canvasScale.x, canvasScale.y);
    this._canvasContext.translate(position.x - origin.x, position.y - origin.y);
    this._canvasContext.textBaseline = 'top';
    this._canvasContext.font = fontsize + " " + fontname;
    this._canvasContext.fillStyle = color.toString();
    this._canvasContext.textAlign = textAlign;
    this._canvasContext.fillText(text, 0, 0);
    this._canvasContext.restore();
}

let Canvas = new Canvas2D();

