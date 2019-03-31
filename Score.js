
function Score(position){
    this.position = position;
    this.origin = new Vector2(47,82);
    this.value = 0;
}

//funzione di reset del punteggio
Score.prototype.reset = function(){
    this.position = position;
    this.origin = new Vector2(30,0);
    this.value = 0;
};

Score.prototype.draw = function () {
  Canvas.drawText(
      this.value, 
      this.position, 
      this.origin, 
      "#014710", 
      "top", 
      "Impact", 
      "200px"
    );
};

Score.prototype.increment = function(){
    this.value++;
};
