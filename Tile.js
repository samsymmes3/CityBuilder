class Tile{
  elevation;
  productionValue;
  color;
  isWater;
  /*
    0: ocean
    1: shore
    2: plains
    3: forest
    4: stone
    5: gold
  */

  constructor(initElevation, initProductionValue, initColor){
    this.elevation = initElevation;
    this.productionValue = initProductionValue;
    this.color = initColor;
    this.isWater = true;
  }

  draw(initCtx, cX, cY, size){
    initCtx.fillStyle = this.color;

    initCtx.beginPath();
    initCtx.moveTo(cX, cY - size);
    initCtx.lineTo(cX + 0.8660254 * size, cY - size / 2);
    initCtx.lineTo(cX + 0.8660254 * size, cY + size / 2);
    initCtx.lineTo(cX, cY + size);
    initCtx.lineTo(cX - 0.8660254 * size, cY + size / 2);
    initCtx.lineTo(cX - 0.8660254 * size, cY - size / 2);
    initCtx.closePath();
    initCtx.fill();
  }
}
