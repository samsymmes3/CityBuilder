class BuildBuildingAction extends Action{
  x;
  y;
  /*
    0: farm
    1: lumber camp
    2: stone mine
    3: gold mine
  */
  buildingType;

  constructor(initBuildingType, initX, initY){
    super("BuildBuilding");
    this.buildingType = initBuildingType;
    this.x = initX;
    this.y = initY;
  }
}
