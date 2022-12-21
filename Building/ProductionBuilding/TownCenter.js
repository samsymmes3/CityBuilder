class TownCenter extends ProductionBuilding{

  constructor(initGame, initPlayer, initX, initY){
    super(
      initGame,
      initPlayer,
      initX,
      initY,
      [0.0, 0.1, 0.05, 0.01],
      initGame.getTile(initX, initY).productionValue
    );
  }
}
