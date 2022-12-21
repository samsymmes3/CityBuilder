class Game{
  screenW;
  screenH;
  map;
  p1;
  p2;

  constructor(initX, initY){
    this.map = new Map(this, initX, initY);
    this.p1 = new Player(
      new TownCenter(
        this,
        null,
        this.map.startingLocations[0][0],
        this.map.startingLocations[0][1]
      )
    );
    this.p1.buildings[0].player = this.p1;
    this.p1.color = "#0000ff";
    this.p2 = new Player(
      new TownCenter(
        this,
        null,
        this.map.startingLocations[1][0],
        this.map.startingLocations[1][1]
      )
    );
    this.p2.buildings[0].player = this.p2;
    this.p2.color = "#ff0000";
  }

  tick(){
    var actionList = [];
    var p1Actions = this.p1.tick();
    var p2Actions = this.p2.tick();
    for(var i = 0; i < p1Actions.length; i++){
      actionList.push([0, p1Actions[i]]);
    }
    for(var i = 0; i < p2Actions.length; i++){
      actionList.push([1, p2Actions[i]]);
    }

    while(actionList.length > 0){
      var curAction = actionList.splice(Math.floor(Math.random() * actionList.length), 1)[0];
      this.makeAction(curAction[0], curAction[1]);
    }
  }

  makeAction(playerNum, action){
    if(action.actionType = "BuildBuilding"){
      if(playerNum == 0){
        this.p1.buildings.push(
          new Farm(
            this,
            this.p1,
            action.x,
            action.y
          )
        );
      }
      else{
        this.p2.buildings.push(
          new Farm(
            this,
            this.p2,
            action.x,
            action.y
          )
        );
      }
    }
  }

  getTile(initX, initY){
    return this.map.tiles[initX][initY];
  }

  draw(initCtx){
    this.map.draw(initCtx);
    for(var i = 0; i < this.p1.buildings.length; i++){
      this.p1.buildings[i].draw(initCtx);
    }
    for(var i = 0; i < this.p2.buildings.length; i++){
      this.p2.buildings[i].draw(initCtx);
    }
  }
}
