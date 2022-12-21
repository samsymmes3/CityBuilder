class Player{
  buildings;
  color;

  constructor(initTownCenter){
    this.buildings = [initTownCenter];
  }

  tick(){
    if(Math.random() < 0.01){
      var x = Math.floor(Math.random() * 11) - 5 + this.buildings[0].x;
      var y = Math.floor(Math.random() * 11) - 5 + this.buildings[0].y;
      if(x < 0){x = 0;}
      else if(x > 99){x = 99;}
      if(y < 0){y = 0;}
      else if(y > 99){y = 99;}
      return [new BuildBuildingAction(0, x, y)];
    }
    return [];
  }
}
