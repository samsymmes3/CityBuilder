class Building{
  game;
  player;
  maintenanceCost;
  x;
  y;

  constructor(initGame, initPlayer, initX, initY, initMaintenanceCost){
    this.game = initGame;
    this.player = initPlayer;
    this.x = initX;
    this.y = initY;
    this.maintenanceCost = initMaintenanceCost;
  }

  draw(initCtx){
    initCtx.fillStyle = this.player.color;
    var map = this.game.map;
    var tileSize = min((this.game.screenW / (map.tiles.length * 2 + 1.0)) / (0.8660254), (this.game.screenH / (map.tiles.length * 1.5 + 0.5)));
    var cx = (1.7320508 * this.x + 0.8660254 * (this.y % 2) + 0.8660254) * tileSize;
    var cy = (1.5 * this.y + 1) * tileSize;
    initCtx.fillRect(cx - tileSize / 2, cy - tileSize / 2, tileSize, tileSize);
  }
}
