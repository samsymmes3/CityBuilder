class LumberCamp extends ProductionBuilding{

  constructor(initGame, initX, initY){
    super(
      initGame,
      initX,
      initY,
      [0.0, 0.05, 0.01, 0.001],
      [0.0, initGame.getTile(initX, initY).productionValue[1], 0.0, 0.0]
    );
  }
}
