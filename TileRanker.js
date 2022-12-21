function findStartingLocations(tiles){
  var tileRanks = tileRanker(tiles);
  var landMassSizeMap = landMassSizer(tiles);

  var highestRank = 0.0;
  var largestLandMass = 0;
  var bins = [];
  for(var i = 0; i < 120; i++){
    bins.push(0);
  }
  for(var i = 0; i < tiles.length; i++){
    for(var j = 0; j < tiles[0].length; j++){
      if(tileRanks[i][j] > highestRank){
        highestRank = tileRanks[i][j];
      }
      if(landMassSizeMap[i][j] > largestLandMass){
        largestLandMass = landMassSizeMap[i][j];
      }
    }
  }

  var rankingLimit = highestRank * 0.95;

  var tileOptions = [];
  for(var i = 0; i < tiles.length; i++){
    for(var j = 0; j < tiles[0].length; j++){
      if(tileRanks[i][j] > rankingLimit && landMassSizeMap[i][j] == largestLandMass){
        tileOptions.push([i, j]);
        tiles[i][j].color = "#ff0000";
      }
    }
  }

  var p1StartLoc = tileOptions[Math.floor(Math.random() * tileOptions.length)];
  tiles[p1StartLoc[0]][p1StartLoc[1]].color = "#ffff00";

  var tileOptions = [];
  for(var i = 0; i < tiles.length; i++){
    for(var j = 0; j < tiles[0].length; j++){
      if(tileRanks[i][j] > rankingLimit && landMassSizeMap[i][j] == largestLandMass && getDist([i, j], [p1StartLoc[0], p1StartLoc[1]]) > 20){
        tileOptions.push([i, j]);
        //tiles[i][j].color = "#ff0000";
      }
    }
  }

  var p2StartLoc = tileOptions[Math.floor(Math.random() * tileOptions.length)];
  tiles[p2StartLoc[0]][p2StartLoc[1]].color = "#ffff00";

  return [p1StartLoc, p2StartLoc];
}

function landMassSizer(tiles){
  var toRet = [];
  for(var i = 0; i < tiles.length; i++){
    var temp = [];
    for(var j = 0; j < tiles[0].length; j++){
      if(tiles[i][j].isWater){temp.push(-1);}
      else{temp.push(0);}
    }
    toRet.push(temp);
  }

  for(var i = 0; i < tiles.length; i++){
    for(var j = 0; j < tiles[0].length; j++){
      var ref = tiles[i][j];
      if(toRet[i][j] != 0){continue;}

      toRet[i][j] = 1;
      var landStack = [[i, j]];
      var thisLandMass = [];
      var landCount = 2;
      while(landStack.length > 0){
        var ref2 = landStack.splice(0, 1)[0];
        thisLandMass.push(ref2);

        if(ref2[0] > 0){
          if(toRet[ref2[0] - 1][ref2[1]] == 0){
            toRet[ref2[0] - 1][ref2[1]] = landCount;
            landCount += 1;
            landStack.push([ref2[0] - 1, ref2[1]]);
          }
          if(ref2[1] % 2 == 0){
            if(ref2[1] > 0){
              if(toRet[ref2[0] - 1][ref2[1] - 1] == 0){
                toRet[ref2[0] - 1][ref2[1] - 1] = landCount;
                landCount += 1;
                landStack.push([ref2[0] - 1, ref2[1] - 1]);
              }
            }
            if(ref2[1] < tiles[0].length - 1){
              if(toRet[ref2[0] - 1][ref2[1] + 1] == 0){
                toRet[ref2[0] - 1][ref2[1] + 1] = landCount;
                landCount += 1;
                landStack.push([ref2[0] - 1, ref2[1] + 1]);
              }
            }
          }
        }

        if(ref2[0] < tiles.length - 1){
          if(toRet[ref2[0] + 1][ref2[1]] == 0){
            toRet[ref2[0] + 1][ref2[1]] = landCount;
            landCount += 1;
            landStack.push([ref2[0] + 1, ref2[1]]);
          }
          if(ref2[1] % 2 == 1){
            if(ref2[1] > 0){
              if(toRet[ref2[0] + 1][ref2[1] - 1] == 0){
                toRet[ref2[0] + 1][ref2[1] - 1] = landCount;
                landCount += 1;
                landStack.push([ref2[0] + 1, ref2[1] - 1]);
              }
            }
            if(ref2[1] < tiles[0].length - 1){
              if(toRet[ref2[0] + 1][ref2[1] + 1] == 0){
                toRet[ref2[0] + 1][ref2[1] + 1] = landCount;
                landCount += 1;
                landStack.push([ref2[0] + 1, ref2[1] + 1]);
              }
            }
          }
        }

        if(ref2[1] > 0){
          if(toRet[ref2[0]][ref2[1] - 1] == 0){
            toRet[ref2[0]][ref2[1] - 1] = landCount;
            landCount += 1;
            landStack.push([ref2[0], ref2[1] - 1]);
          }
        }

        if(ref2[1] < tiles[0].length - 1){
          if(toRet[ref2[0]][ref2[1] + 1] == 0){
            toRet[ref2[0]][ref2[1] + 1] = landCount;
            landCount += 1;
            landStack.push([ref2[0], ref2[1] + 1]);
          }
        }

      }

      landCount -= 1;
      for(var k = 0; k < thisLandMass.length; k++){
        var ref2 = thisLandMass[k];
        toRet[ref2[0]][ref2[1]] = landCount;
      }
    }
  }
  return toRet;
}

function tileRanker(tiles){
  var toRet = [];
  for(var i = 0; i < tiles.length; i++){
    var temp = [];
    for(var j = 0; j < tiles[0].length; j++){
      var ref = tiles[i][j];
      if(ref.isWater){
        temp.push(-1.0);
        continue;
      }
      var highestViability = 0.0;
      var ranking = 1.0;
      for(var k = 0; k < ref.productionValue.length; k++){
        if(ref.productionValue[k] > highestViability){
          highestViability = ref.productionValue[k];
        }
        ranking *= ref.productionValue[k];
      }
      temp.push(ranking * highestViability);
    }
    toRet.push(temp);
  }
  return toRet;
}
