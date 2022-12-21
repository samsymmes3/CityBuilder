var can = document.getElementById("screenCanvas");
var ctx = can.getContext("2d");

var game = new Game(100, 100);
game.screenW = 800;
game.screenH = 800;
game.draw(ctx);
/*
window.setInterval(
  function(){
    game.tick();
    game.draw(ctx);
  },
  1
);*/
