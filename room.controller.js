require('prototype.spawn');
var run = function (room) {
  if (!room.memory.init) {
    room.memory.name = room.name;
    sources = room.find(FIND_SOURCES);
    room.memory.sourceAmt = sources.length;
    room.memory.sources = sources;

    for (var element in room.memory.sources) {
      let source = Game.getObjectById(room.memory.sources[element].id);
      room.memory.sources[element].minersNeeded = 1;
      let spawn = source.pos.findClosestByPath(FIND_MY_SPAWNS);
      let spawnDist = source.pos.getRangeTo(spawn);
      console.log('spawnDist: ' + spawnDist + " Element: " + element);
      room.memory.sources[element].haulersNeeded = Math.round(spawnDist / 6);
      room.memory.sources[element].minerRespawn = spawnDist * 3;
      room.memory.totalHaulers += room.memory.sources[element].haulersNeeded;
    }

    room.memory.controllerPos = room.controller.pos;
    room.memory.storagePos = room.storage.pos;

    if (!room.memory.spawnQueue) {
      room.memory.spawnQueue = [];
    }

    var roomExits = Object.values(Game.map.describeExits(room.name));
    for (exit in roomExits){
      if(!room.memory.neighbors){
        room.memory.neighbors = {};
      }
      room.memory.neighbors[roomExits[exit]] = {needScout : true};
    }

    room.memory.init = true;
  }
  var maxMiners = room.memory.sourceAmt;
  var maxHaulers = room.memory.totalHaulers;
  if ((room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0) && (room.storage.store.getUsedCapacity(RESOURCE_ENERGY) < 75000)) {
    var maxTransporters = 1;
  }
  else if (room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 100000) {
    var maxTransporters = 2;
  }
  else {
    var maxTransporters = 0;
  }
  var maxUpgraders = 1;
  var maxBuilders = 0;

  var scoutableRooms = _.filter(Object.keys(room.memory.neighbors), (openRoom) => room.memory.neighbors[openRoom].needScout == true);
  var maxScouts = scoutableRooms.length; 

  var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.homeRoom == room.name);
  var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler' && creep.memory.homeRoom == room.name);
  var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter' && creep.memory.homeRoom == room.name);
  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.homeRoom == room.name);
  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.homeRoom == room.name);
  var scouts = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout' && creep.memory.homeRoom == room.name);

  if (miners.length < 1 && !room.memory.spawnQueue.includes('miner')) {
    room.memory.spawnQueue.push('miner');
  }
  else if (haulers.length < 1 && !room.memory.spawnQueue.includes('hauler')) {
    room.memory.spawnQueue.push('hauler');
  }
  else if (transporters.length < 1 && !room.memory.spawnQueue.includes('transporter')) {
    room.memory.spawnQueue.push('transporter');
  }
  else if (miners.length < maxMiners && !room.memory.spawnQueue.includes('miner')) {
    room.memory.spawnQueue.push('miner');
  }
  else if (haulers.length < maxHaulers && !room.memory.spawnQueue.includes('hauler')) {
    room.memory.spawnQueue.push('hauler');
  }
  else if (transporters.length < maxTransporters && !room.memory.spawnQueue.includes('transporter')) {
    room.memory.spawnQueue.push('transporter');
  }
  else if (upgraders.length < maxUpgraders && !room.memory.spawnQueue.includes('upgrader')) {
    room.memory.spawnQueue.push('upgrader');
  }
  else if (builders.length < maxBuilders && !room.memory.spawnQueue.includes('builder')) {
    room.memory.spawnQueue.push('builder');
  }
  else if (scouts.length < maxScouts && !room.memory.spawnQueue.includes('scout')) {
    room.memory.spawnQueue.push('scout');
  }


  if (room.memory.spawnQueue.length > 0) {
    var spawns = room.find(FIND_MY_SPAWNS);
    for (var spawn of spawns) {
      if (!spawn.spawning && room.memory.spawnQueue.length > 0) {
        var spawnObj = room.memory.spawnQueue[0];
        var energy = room.energyAvailable;
        var roomName = room.memory.name;
        if (spawnObj == 'miner') {
          spawn.createCustomMiner(energy, roomName);
          room.memory.spawnQueue.splice(0, 1);
        }
        else if (spawnObj == 'hauler') {
          spawn.createCustomMover(energy, 'hauler', roomName);
          room.memory.spawnQueue.splice(0, 1);
        }
        else if (spawnObj == 'transporter') {
          spawn.createCustomMover(energy, 'transporter', roomName);
          room.memory.spawnQueue.splice(0, 1);
        }
        else if (spawnObj == 'upgrader') {
          spawn.createCustomUpgrader(energy, roomName);
          room.memory.spawnQueue.splice(0, 1);
        }
        else if (spawnObj == 'builder') {
          spawn.createCustomCreep(energy, 'builder', roomName);
          room.memory.spawnQueue.splice(0, 1);
        }
        else if (spawnObj == 'scout') {
          spawn.createCustomScout(energy, roomName);
          room.memory.spawnQueue.splice(0, 1);
      }

    }
  }
}

};
module.exports = run;
