var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleDefender = require('role.defender');
var roleRangedDefender = require ('role.rangedDefender');
var roleTransporter = require ('role.transporter');
var roomController = require ('room.controller');
require ('prototype.spawn');


module.exports.loop = function () {

    for(var name in Memory.creeps) {       // Clear Memory if creep no longer exists
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var towers = Game.rooms.E22N23.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER});

    for (let tower of towers) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        if(!closestHostile){
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType != STRUCTURE_WALL) && (structure.hits < structure.hitsMax) && (structure.hits < 500000)
            });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        }
    }

    for(let name in Game.rooms){
        var room = Game.rooms[name];
      if(room.controller.my){
        roomController(room)
      }
    }


	for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repair') {
            roleRepair.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler(creep);
        }
        if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        if(creep.memory.role == 'rangedDefender') {
            roleRangedDefender.run(creep);
        }
        if(creep.memory.role == 'transporter') {
          roleTransporter(creep);
        }

    }
    console.log(Game.cpu.getUsed());
    if(Game.cpu.bucket > 9000) {
        Game.cpu.generatePixel();
    }
}
