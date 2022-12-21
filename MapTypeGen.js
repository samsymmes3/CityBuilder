function buildTypeMap(elevationMap){
  var toRet = []
  var initX = elevationMap.length;
  var initY = elevationMap[0].length;

  var waterLevel = 0.5;
  var oceanLevel = 0.45;
  var highest = elevationMap[0][0];
  var lowest = elevationMap[0][0];
  for(var i = 0; i < initX; i++){
    var temp = [];
    for(var j = 0; j < initY; j++){
      temp.push(0);
      if(elevationMap[i][j] > highest){highest = elevationMap[i][j];}
      else if(elevationMap[i][j] < lowest){lowest = elevationMap[i][j];}
    }
    toRet.push(temp);
  }
  var waterLine = (highest - lowest) * waterLevel + lowest;
  var oceanLine = (highest - lowest) * oceanLevel + lowest;

  var waterDists = getWaterDists(elevationMap, waterLine);

  var highestWaterDist = 0;
  for(var i = 0; i < initX; i++){
    for(var j = 0; j < initY; j++){
      if(waterDists[i][j] > highestWaterDist){
        highestWaterDist = waterDists[i][j];
      }
    }
  }

  var typeWeightsByElevation = [
    [100.0, 80.0],
    [1000.0, 20.0],
    [5.0, 1000.0],
    [1.0, 3.0]
  ];
  var typeWeightsByWaterDist = [
    [200.0, 0.0],
    [200.0, 0.0],
    [0.0, 200.0],
    [2.0, 1.0]
  ];
  var proximityWeight = [
    [1000.0, 500.0, 200.0],
    [2000.0, 1000.0, 400.0],
    [100.0, 50.0, 20.0],
    [50.0, 25.0, 10.0]
  ];

  var proximityWeightMap = [];
  for(var i = 0; i < initX; i++){
    temp = [];
    for(var j = 0; j < initY; j++){
      temp.push([0.0, 0.0, 0.0, 0.0]);
    }
    proximityWeightMap.push(temp);
  }

  for(var i = 0; i < initX; i++){
    for(var j = 0; j < initY; j++){
      if(elevationMap[i][j] <= oceanLine){continue;}
      if(elevationMap[i][j] <= waterLine){
        toRet[i][j] = 1;
        continue;
      }
      var weights = [];
      var totalWeight = 0;
      for(var k = 0; k < 4; k++){
        var weightHere = proximityWeightMap[i][j][k];

        var elevationPerc = (elevationMap[i][j] - waterLine) / (highest - waterLine);
        var elevationSpread = typeWeightsByElevation[k][1] - typeWeightsByElevation[k][0];
        weightHere += elevationPerc * elevationSpread + typeWeightsByElevation[k][0];

        var waterDistPerc = (waterDists[i][j] - 1.0) / (highestWaterDist - 1);
        var waterDistSpread = typeWeightsByWaterDist[k][1] - typeWeightsByWaterDist[k][0];
        weightHere += waterDistPerc * waterDistSpread + typeWeightsByWaterDist[k][0];

        weights.push(weightHere);
        totalWeight += weightHere;
      }
      var weightPick = Math.random() * totalWeight;
      for(var k = 0; k < weights.length; k++){
        if(weightPick < weights[k]){
          toRet[i][j] = k + 2;
          updatePoximityWeightMap(proximityWeightMap, proximityWeight, i, j, k);
          break;
        }
        weightPick -= weights[k];
      }
    }
  }

  return toRet;
}

function updatePoximityWeightMap(proximityWeightMap, proximityWeight, x, y, type){
  //3 above and below
  for(var i = max(0, x - 2 + (y % 2)); i < min(proximityWeightMap.length, x + 3 - (y % 2)); i++){
    if(y > 2){
      for(var j = 0; j < proximityWeight.length; j++){
        proximityWeightMap[i][y - 3][j] += proximityWeight[j][2];
      }
    }
    if(y < proximityWeightMap[0].length - 3){
      for(var j = 0; j < proximityWeight.length; j++){
        proximityWeightMap[i][y + 3][j] += proximityWeight[j][2];
      }
    }
  }
  //2 above and below
  for(var i = max(0, x - 2); i < min(proximityWeightMap.length, x + 3); i++){
    if(y > 1){
      for(var j = 0; j < proximityWeight.length; j++){
        if(i == x - 2 || i == x + 2){
          proximityWeightMap[i][y - 2][j] += proximityWeight[j][2];
        }
        else{
          proximityWeightMap[i][y - 2][j] += proximityWeight[j][1];
        }
      }
    }
    if(y < proximityWeightMap[0].length - 2){
      for(var j = 0; j < proximityWeight.length; j++){
        if(i == x - 2 || i == x + 2){
          proximityWeightMap[i][y + 2][j] += proximityWeight[j][2];
        }
        else{
          proximityWeightMap[i][y + 2][j] += proximityWeight[j][1];
        }
      }
    }
  }

  //1 above and below
  for(var i = max(0, x - 3 + (y % 2)); i < min(proximityWeightMap.length, x + 4 - (y % 2)); i++){
    if(y > 0){
      for(var j = 0; j < proximityWeight.length; j++){
        if(i == x - 3 + (y % 2) || i == x + 3 - (y % 2)){
          proximityWeightMap[i][y - 1][j] += proximityWeight[j][2];
        }
        else if(i == x - 2 + (y % 2) || i == x + 2 - (y % 2)){
          proximityWeightMap[i][y - 1][j] += proximityWeight[j][1];
        }
        else{
          proximityWeightMap[i][y - 1][j] += proximityWeight[j][0];
        }
      }
    }
    if(y < proximityWeightMap[0].length - 1){
      for(var j = 0; j < proximityWeight.length; j++){
        if(i == x - 3 + (y % 2) || i == x + 3 - (y % 2)){
          proximityWeightMap[i][y + 1][j] += proximityWeight[j][2];
        }
        else if(i == x - 2 + (y % 2) || i == x + 2 - (y % 2)){
          proximityWeightMap[i][y + 1][j] += proximityWeight[j][1];
        }
        else{
          proximityWeightMap[i][y + 1][j] += proximityWeight[j][0];
        }
      }
    }
  }

  //for middle row
  for(var i = max(0, x - 3); i < min(proximityWeightMap.length, x + 4); i++){
    for(var j = 0; j < proximityWeight.length; j++){
      proximityWeightMap[i][y][j] += proximityWeight[j][Math.abs(i - x) - 1];
    }
  }
}

function getWaterDists(elevationMap, waterLine){
  var toRet = [];
  for(var i = 0; i < elevationMap.length; i++){
    var temp = [];
    for(var j = 0; j < elevationMap[i].length; j++){
      if(elevationMap[i][j] <= waterLine){
        temp.push(0);
      }
      else{
        temp.push(-1);
      }
    }
    toRet.push(temp);
  }

  var waterStack = [];
  for(var i = 0; i < elevationMap.length; i++){
    for(var j = 0; j < elevationMap[i].length; j++){
      if(toRet[i][j] == 0){continue;}

      if(i > 0){
        if(toRet[i - 1][j] == 0){
          toRet[i][j] = 1;
          waterStack.push([i, j, 1]);
          continue;
        }
        if(j % 2 == 0){
          if(j > 0){
            if(toRet[i - 1][j - 1] == 0){
              toRet[i][j] = 1;
              waterStack.push([i, j, 1]);
              continue;
            }
          }
          if(j < elevationMap[i].length - 1){
            if(toRet[i - 1][j + 1] == 0){
              toRet[i][j] = 1;
              waterStack.push([i, j, 1]);
              continue;
            }
          }
        }
      }

      if(i < elevationMap.length - 1){
        if(toRet[i + 1][j] == 0){
          toRet[i][j] = 1;
          waterStack.push([i, j, 1]);
          continue;
        }
        if(j % 2 == 1){
          if(j > 0){
            if(toRet[i + 1][j - 1] == 0){
              toRet[i][j] = 1;
              waterStack.push([i, j, 1]);
              continue;
            }
          }
          if(j < elevationMap[i].length - 1){
            if(toRet[i + 1][j + 1] == 0){
              toRet[i][j] = 1;
              waterStack.push([i, j, 1]);
              continue;
            }
          }
        }
      }

      if(j > 0){
        if(toRet[i][j - 1] == 0){
          toRet[i][j] = 1;
          waterStack.push([i, j, 1]);
          continue;
        }
      }

      if(j < elevationMap.length - 1){
        if(toRet[i][j + 1] == 0){
          toRet[i][j] = 1;
          waterStack.push([i, j, 1]);
          continue;
        }
      }
    }
  }

  while(waterStack.length > 0){
    var ref = waterStack.splice(0, 1)[0];

    if(ref[0] > 0){
      if(toRet[ref[0] - 1][ref[1]] < 0){
        toRet[ref[0] - 1][ref[1]] = ref[2] + 1;
        waterStack.push([ref[0] - 1, ref[1], ref[2] + 1]);
      }
      if(ref[1] % 2 == 0){
        if(ref[1] > 0){
          if(toRet[ref[0] - 1][ref[1] - 1] < 0){
            toRet[ref[0] - 1][ref[1] - 1] = ref[2] + 1;
            waterStack.push([ref[0] - 1, ref[1] - 1, ref[2] + 1]);
          }
        }
        if(ref[1] < toRet[0].length - 1){
          if(toRet[ref[0] - 1][ref[1] + 1] < 0){
            toRet[ref[0] - 1][ref[1] + 1] = ref[2] + 1;
            waterStack.push([ref[0] - 1, ref[1] + 1, ref[2] + 1]);
          }
        }
      }
    }

    if(ref[0] < toRet.length - 1){
      if(toRet[ref[0] + 1][ref[1]] < 0){
        toRet[ref[0] + 1][ref[1]] = ref[2] + 1;
        waterStack.push([ref[0] + 1, ref[1], ref[2] + 1]);
      }
      if(ref[1] % 2 == 1){
        if(ref[1] > 0){
          if(toRet[ref[0] + 1][ref[1] - 1] < 0){
            toRet[ref[0] + 1][ref[1] - 1] = ref[2] + 1;
            waterStack.push([ref[0] + 1, ref[1] - 1, ref[2] + 1]);
          }
        }
        if(ref[1] < toRet[0].length - 1){
          if(toRet[ref[0] + 1][ref[1] + 1] < 0){
            toRet[ref[0] + 1][ref[1] + 1] = ref[2] + 1;
            waterStack.push([ref[0] + 1, ref[1] + 1, ref[2] + 1]);
          }
        }
      }
    }

    if(ref[1] > 0){
      if(toRet[ref[0]][ref[1] - 1] < 0){
        toRet[ref[0]][ref[1] - 1] = ref[2] + 1;
        waterStack.push([ref[0], ref[1] - 1, ref[2] + 1]);
      }
    }
    if(ref[1] < toRet[0].length - 1){
      if(toRet[ref[0]][ref[1] + 1] < 0){
        toRet[ref[0]][ref[1] + 1] = ref[2] + 1;
        waterStack.push([ref[0], ref[1] + 1, ref[2] + 1]);
      }
    }
  }

  return toRet;
}
