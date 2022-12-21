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
      temp.push([0.0, 0.0, 0.0, 0.0]);
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

  var resViabilityWaterDist = [
    [1.0, 0.01],
    [1.0, -0.2],
    [0.9, 1.0],
    [1.0, 0.2]
  ];

  var resViabilityElevation = [
    [1.0, 0.9],
    [1.0, -0.1],
    [0.2, 1.0],
    [0.5, 1.0]
  ];

  for(var i = 0; i < initX; i++){
    for(var j = 0; j < initY; j++){
      if(elevationMap[i][j] <= waterLine){
        toRet[i][j] = [-1.0, -1.0, -1.0, -1.0];
        continue;
      }
      var relWaterDist = (waterDists[i][j] - 1) / (highestWaterDist - 1);
      var relElevation = (elevationMap[i][j] - waterLine) / (highest - waterLine);
      for(var k = 0; k < resViabilityElevation.length; k++){
        var viabilityWaterDist = max(0.0, relWaterDist * (resViabilityWaterDist[k][1] - resViabilityWaterDist[k][0]) + resViabilityWaterDist[k][0]);
        var viabilityElevation = max(0.0, relElevation * (resViabilityElevation[k][1] - resViabilityElevation[k][0]) + resViabilityElevation[k][0]);
        toRet[i][j][k] = viabilityWaterDist * viabilityElevation;
      }
    }
  }

  return toRet;
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
