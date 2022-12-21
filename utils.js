function hexToRGB(initHex){
  toRet = {r: 0, g: 0, b: 0};
  toRet.r += 16 * hexLetterToNumber(initHex[1]);
  toRet.r += hexLetterToNumber(initHex[2]);
  toRet.g += 16 * hexLetterToNumber(initHex[3]);
  toRet.g += hexLetterToNumber(initHex[4]);
  toRet.b += 16 * hexLetterToNumber(initHex[5]);
  toRet.b += hexLetterToNumber(initHex[6]);
  return toRet;
}

function RGBToHex(initRGB){
  toRet = "#";
  toRet = toRet + numberToHexLetter(Math.floor(initRGB.r / 16));
  toRet = toRet + numberToHexLetter(Math.floor(initRGB.r % 16));
  toRet = toRet + numberToHexLetter(Math.floor(initRGB.g / 16));
  toRet = toRet + numberToHexLetter(Math.floor(initRGB.g % 16));
  toRet = toRet + numberToHexLetter(Math.floor(initRGB.b / 16));
  toRet = toRet + numberToHexLetter(Math.floor(initRGB.b % 16));
  return toRet;
}

function hexLetterToNumber(initHexLetter){
  if(initHexLetter == "a" || initHexLetter == "A"){
    return 10;
  }
  if(initHexLetter == "b" || initHexLetter == "B"){
    return 11;
  }
  if(initHexLetter == "c" || initHexLetter == "C"){
    return 12;
  }
  if(initHexLetter == "d" || initHexLetter == "D"){
    return 13;
  }
  if(initHexLetter == "e" || initHexLetter == "E"){
    return 14;
  }
  if(initHexLetter == "f" || initHexLetter == "F"){
    return 15;
  }
  return Number(initHexLetter);
}

function numberToHexLetter(initNumber){
  if(initNumber == 15){
    return "f";
  }
  if(initNumber == 14){
    return "e";
  }
  if(initNumber == 13){
    return "d";
  }
  if(initNumber == 12){
    return "c";
  }
  if(initNumber == 11){
    return "b";
  }
  if(initNumber == 10){
    return "a";
  }
  return String(initNumber);
}

function getMax2d(a){
  toRet = a[0][0];
  for(var i = 0; i < a.length; i++){
    for(var j = 0; j < a[0].length; j++){
      if(a[i][j] > toRet){toRet = a[i][j];}
    }
  }
  return toRet;
}

function getMin2d(a){
  toRet = a[0][0];
  for(var i = 0; i < a.length; i++){
    for(var j = 0; j < a[0].length; j++){
      if(a[i][j] < toRet){toRet = a[i][j];}
    }
  }
  return toRet;
}

function colorScale(scaleNum, zeroColor, oneColor){
  return RGBToHex({
    r: (oneColor.r - zeroColor.r) * scaleNum + zeroColor.r,
    g: (oneColor.g - zeroColor.g) * scaleNum + zeroColor.g,
    b: (oneColor.b - zeroColor.b) * scaleNum + zeroColor.b,
  })
}

function averageColors(a){
  var totals = {r: 0, g: 0, b: 0}
  for(var i = 0; i < a.length; i++){
    var colorRGB = hexToRGB(a[i]);
    totals.r += colorRGB.r;
    totals.g += colorRGB.g;
    totals.b += colorRGB.b;
  }
  totals.r /= a.length;
  totals.g /= a.length;
  totals.b /= a.length;
  return RGBToHex(totals);
}

function max(a, b){
  if(a > b){return a;}
  return b;
}

function min(a, b){
  if(a < b){return a;}
  return b;
}

function getDist(a, b){
  var vertDist = Math.abs(a[1] - b[1]);
  var horizDist = Math.abs(a[0] - b[0]);
  var freeLeft = Math.floor((vertDist + 1 - (a[1] % 2)) / 2);
  var freeRight = Math.floor((vertDist + (a[1] % 2)) / 2);
  if(a[0] < b[0]){
    return vertDist + max(0, horizDist - freeRight);
  }
  return vertDist + max(0, horizDist - freeLeft);
}
