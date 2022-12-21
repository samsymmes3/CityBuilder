class ProductionBuilding extends Building{
  resProduction;

  constructor(initGame, initPlayer, initX, initY, initMaintenanceCost, initResProduction){
    super(initGame, initPlayer, initX, initY, initMaintenanceCost);
    this.resProduction = initResProduction;
  }

}
