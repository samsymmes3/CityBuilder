function buildElevationMap(x, y){
  var elevationMap = [];
  for(var i = 0; i < x; i++){
    var temp = [];
    for(var j = 0; j < y; j++){
      temp.push({
        x: i,
        y: j,
        min: 0,
        max: (x + y) * 2,
        adjecent: [],
        elevation: -1,
        touched: false
      });
    }
    elevationMap.push(temp);
  }

  for(var i = 0; i < x; i++){
    for(var j = 0; j < y; j++){
      if(i > 0){elevationMap[i][j].adjecent.push(elevationMap[i - 1][j]);}
      if(i < x - 1){elevationMap[i][j].adjecent.push(elevationMap[i + 1][j]);}
      if(j > 0){
        elevationMap[i][j].adjecent.push(elevationMap[i][j - 1]);
        if(j % 2 == 0){
          if(i > 0){elevationMap[i][j].adjecent.push(elevationMap[i - 1][j - 1]);}
        }
        else{
          if(i < x - 1){elevationMap[i][j].adjecent.push(elevationMap[i + 1][j - 1]);}
        }
      }
      if(j < y - 1){
        elevationMap[i][j].adjecent.push(elevationMap[i][j + 1]);
        if(j % 2 == 0){
          if(i > 0){elevationMap[i][j].adjecent.push(elevationMap[i - 1][j + 1]);}
        }
        else{
          if(i < x - 1){elevationMap[i][j].adjecent.push(elevationMap[i + 1][j + 1]);}
        }
      }
    }
  }

  var tilePool = []
  for(var i = 0; i < x; i++){
    for(var j = 0; j < y; j++){
      tilePool.push({x: i, y: j});
    }
  }

  isFirstPick = true;
  while(tilePool.length > 0){
    var pick = Math.floor(Math.random() * tilePool.length);
    var refTile = tilePool[pick];
    var refTileX = refTile.x;
    var refTileY = refTile.y;
    var refMapTile = elevationMap[refTileX][refTileY];

    if(isFirstPick){
      refMapTile.elevation = x + y;
      isFirstPick = false;
    }
    else{
      refMapTile.elevation = pickElevation(refMapTile.min, refMapTile.max);
    }
    elevationHere = refMapTile.elevation;
    //refMapTile.touched = true;

    tilePool.splice(pick, 1);
    for(var i = 0; i < tilePool.length; i++){
      var tileHere = tilePool[i];
      var tileHereX = tileHere.x;
      var tileHereY = tileHere.y;
      var mapTile = elevationMap[tileHere.x][tileHere.y];
      var dist = Math.abs(refTile.y - tileHere.y);
      var reach = dist / 2;

      if(tileHereY % 2 == 0){
        if(tileHereX >= refTileX){
          reach += 0.51;
        }
      }
      else{
        if(tileHereX < refTileX){
          reach += 0.51;
        }
      }
      reach = Math.floor(reach);
      var dist2 = dist + max(0, Math.abs(refTileX - tileHereX) - reach);
      mapTile.min = max(elevationHere - dist2, mapTile.min);
      mapTile.max = min(elevationHere + dist2, mapTile.max);
    }

  }

  toRet = [];
  for(var i = 0; i < x; i++){
    var temp = [];
    for(var j = 0; j < y; j++){
      temp.push(elevationMap[i][j].elevation);
    }
    toRet.push(temp);
  }
  return toRet;
}

function pickElevation(initMin, initMax){
  var elevationPick = ourRandom2();
  return Math.floor(elevationPick * (initMax + 1 - initMin) + initMin);
}

function ourRandom(){
  var temp = Math.random() * Math.random() / 2;
  if(Math.random() < 0.5){return 0.5 + temp;}
  return 0.5 - temp;
}

function ourRandom2(){
  return (ourRandom() + Math.random() + Math.random()) / 3;
}
