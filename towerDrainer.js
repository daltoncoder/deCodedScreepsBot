var towerDrainer = function (room) {
  var enemyTower = Game.getObjectById('5f890f6de05d15282675a474');
  if(Game.creeps['tanker'] == undefined){
    Game.spawns['Spawn2'].spawnCreep([TOUGH,TOUGH,MOVE,MOVE,MOVE,HEAL], 'tanker', {memory:{role: 'tanker'}});
  }
  if(Game.creeps['tanker']){
    var tanker = Game.creeps['tanker'];
    var startPos = new RoomPosition(3,1,'E23N22')
    var enter = new RoomPosition(3,48,'E23N23')

    if(!tanker.memory.inPos){
      tanker.moveTo(startPos);
    }
    if(tanker.pos.isEqualTo(startPos)){
      tanker.memory.inPos = true;
    }
  }
  if(tanker.memory.inPos == true && tanker.hits == tanker.hitsMax){
    tanker.memory.drainTime = true;
  }
  if(tanker.hits <= tanker.hitsMax * .75){
  tanker.memory.drainTime = false;
  }
  if(tanker.memory.drainTime == true){
    tanker.moveTo(enter);
    tanker.heal(tanker);
  }
  else if(tanker.memory.drainTime == false){
    console.log('trying to move back')
    tanker.moveTo(startPos)
    tanker.heal(tanker);
  }
  if(enemyTower){
  if(enemyTower.store[RESOURCE_ENERGY] == 0){
    tanker.memory.roomClear = true;
  }
  else{
    tanker.memory.roomClear = false;
  }
}
if(tanker.memory.roomClear == true);{
  Game.spawns['Spawn2'].spawnCreep([ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK], 'attacker', {memory:{role: 'attacker'}});
}
if(Game.creeps['attacker']){
  var attacker = Game.creeps['attacker'];
  var nextToTower= new RoomPosition(34,14, 'E23N23');
  if(!attacker.memory.inRoom){
    attacker.moveTo(nextToTower);
  }
  if(attacker.pos.isEqualTo(nextToTower)){
    attacker.memory.inRoom = true;
  }
  if(attacker.memory.inRoom == true){
    var enemySpawn = Game.getObjectById('5f88388b38d6233ae6d352d9');
    if(enemyTower){
    attacker.attack(enemyTower);
  }
  else if(enemySpawn){
    attacker.attack(enemySpawn);
  }
  else{
    var enemyCreeps= attacker.room.find(FIND_HOSTILE_CREEPS);
    console.log(enemyCreeps.lenght + '   length')
    if(enemyCreeps.length > 0){
      var closestCreep = attacker.pos.findClosestByRange(enemyCreeps);
      if(attacker.attack(closestCreep) == ERR_NOT_IN_RANGE){
        attacker.moveTo(closestCreep);
        attacker.attack(closestCreep);
      }
    }
    else{
      console.log('in else');
      var enemyStructs = attacker.room.find(FIND_STRUCTURES, {filter: (struct) => {struct.my == false}});
      if(enemyStructs.length > 0){
        var closestStruct = attacker.pos.findClosestByRange(enemyStructs);
        if(attacker.attack(closestStruct) == ERR_NOT_IN_RANGE){
          attacker.moveTo(closestStruct);
        }
      }
    }

  }
}
}



};
module.exports = towerDrainer;
