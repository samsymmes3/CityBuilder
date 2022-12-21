class Farm extends ProductionBuilding{

  constructor(initGame, initPlayer, initX, initY){
    super(
      initGame,
      initPlayer,
      initX,
      initY,
      [0.0, 0.05, 0.01, 0.001],
      [initGame.getTile(initX, initY).productionValue[0], 0.0, 0.0, 0.0]
    );
  }
}
