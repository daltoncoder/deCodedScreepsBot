var towerDrainer = function (room) {
  var enemyTower = Game.getObjectById('5f890f6de05d15282675a474');
  if(Game.creeps['tanker'] == undefined){
    Game.spawns['Spawn2'].spawnCreep([MOVE,MOVE,TOUGH,TOUGH,HEAL], 'tanker', {memory:{role: 'tanker'}});
  }
  if(Game.creeps['tanker']){
    var tanker = Game.creeps['tanker'];
    var startPos = new RoomPosition(3,1,'E23N22')
    var enter = new RoomPosition(3,48,'E23N23')

    if(!tanker.memory.inPos){
      tanker.moveTo(startPos);
    }
    if(tanker.pos == startPos){
      tanker.memory.inPos = true;
    }
  }
  if(tanker.memory.inPos == true && tanker.hits == tanker.hitsMax){
    tanker.memory.drainTime = true;
  }
  if(tanker.hits <= tanker.hitsMax * .5){
  tanker.memory.drainTime = false;
  }
  if(tanker.memory.drainTime == true){
    tanker.moveTo(enter);
    tanker.heal(tanker);
  }
  else if(tanker.memory.drainTime == false){
    tanker.moveTo(startPos)
    tanker.heal(tanker);
  }
  if(enemyTower.store[RESOURCE_ENERGY] == 0){
    tanker.memory.roomClear = true;
  }


};
module.exports = towerDrainer;
