class Map{
  game;
  tiles;
  startingLocations;

  constructor(initGame, initX, initY){
    var elevationMap = buildElevationMap(initX, initY);
    var typeMap = buildTypeMap(elevationMap);

    console.log(typeMap);

    var maxElevation = getMax2d(elevationMap);
    var minElevation = getMin2d(elevationMap);
    var waterLine = 0.5;

    this.game = initGame;
    this.tiles = [];
    for(var i = 0; i < initX; i++){
      var temp = [];
      for(var j = 0; j < initY; j++){
        var greyScaleNum = (elevationMap[i][j] - minElevation) / (maxElevation - minElevation);
        var colorHere = "#000000";
        if(greyScaleNum > waterLine){
          colorHere = colorScale(
            (greyScaleNum - waterLine) / (1 - waterLine),
            {
              r: 0,
              g: 70,
              b: 30
            },
            {
              r: 200,
              g: 200,
              b: 200
            }
          );
        }
        else{
          colorHere = colorScale(
            greyScaleNum / waterLine,
            {
              r: 0,
              g: 25,
              b: 50
            },
            {
              r: 0,
              g: 100,
              b: 200
            }
          );
        }
        var toAdd = new Tile(elevationMap[i][j], typeMap[i][j], colorHere);
        if(greyScaleNum > waterLine){toAdd.isWater = false;}
        temp.push(toAdd);
      }
      this.tiles.push(temp);
    }

    this.startingLocations = findStartingLocations(this.tiles);
  }

  draw(initCtx){
    var tileSize = min((this.game.screenW / (this.tiles.length * 2 + 1.0)) / (0.8660254), (this.game.screenH / (this.tiles.length * 1.5 + 0.5)));
    for(var i = 0; i < this.tiles.length; i++){
      for(var j = 0; j < this.tiles[i].length; j++){
        this.tiles[i][j].draw(initCtx, (1.7320508 * i + 0.8660254 * (j % 2) + 0.8660254) * tileSize, (1.5 * j + 1) * tileSize, tileSize);
      }
    }
  }
}
