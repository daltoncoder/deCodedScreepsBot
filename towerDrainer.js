var towerDrainer = function (room) {
  var enemyTower = Game.getObjectById('5f80d8fc8591b34cb3e44175');
  if(Game.creeps['tanker'] == undefined){
    Game.spawns['Spawn2'].spawnCreep([MOVE], 'tanker', {memory:{role: 'tanker'}});
  }
  if(Game.creeps['tanker']){
    var tanker = Game.creeps['tanker'];
    var startPos = new RoomPosition(47,45,'E23N22')
    var enter = new RoomPosition(1,46,'E24N22')

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
  if(enemyTower.store[RESOURCE_ENERGY] < 50){
    tanker.memory.roomClear = true;
  }
  else{
    tanker.memory.roomClear = false;
  }
}
if(tanker.memory.roomClear == true && Game.creeps['attacker' == undefined]);{
  Game.spawns['Spawn2'].spawnCreep([ATTACK,MOVE], 'attacker', {memory:{role: 'attacker'}});
}
if(Game.creeps['attacker']){
  var attacker = Game.creeps['attacker'];
  var nextToTower= new RoomPosition(14,23, 'E24N22');
  if(!attacker.memory.inRoom){
    attacker.moveTo(nextToTower);
  }
  if(attacker.pos.isEqualTo(nextToTower)){
    attacker.memory.inRoom = true;
  }
  if(attacker.memory.inRoom == true){
  var enemySpawn = Game.getObjectById('5f80271ea466d2f525e56053');
  if(enemyTower){
    if(attacker.attack(enemyTower) == ERR_NOT_IN_RANGE){
      attacker.moveTo(enemyTower);
    }
  }
  else if(enemySpawn){
    if(attacker.attack(enemySpawn)== ERR_NOT_IN_RANGE){
      attacker.moveTo(enemySpawn);
    }
  }
  else{
    var enemyCreeps= attacker.room.find(FIND_HOSTILE_CREEPS);
    if(enemyCreeps.length > 0){
      var closestCreep = attacker.pos.findClosestByRange(enemyCreeps);
      if(attacker.attack(closestCreep) == ERR_NOT_IN_RANGE){
        attacker.moveTo(closestCreep);
        attacker.attack(closestCreep);
      }
    }
    else{
      var enemyStructs = attacker.room.find(FIND_STRUCTURES, {filter: (struct) => {return ((struct.my == false) && (struct.structureType != STRUCTURE_CONTROLLER))}});
      console.log(enemyStructs.length);
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
