var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleDefender = require('role.defender');
var roleRangedDefender = require ('role.rangedDefender');
var roleTransporter = require ('role.transporter');
var roleScout = require ('role.scout');
var roleClaimer = require ('role.claimer');
var roomController = require ('room.controller');
require ('prototype.spawn');


module.exports.loop = function () {

    for(var name in Memory.creeps) {       // Clear Memory if creep no longer exists
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
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
            try{
            roleUpgrader.run(creep);
            }
            catch{
                Game.notify('upgrader role error:  '+ error);
                console.log('upgrader role error:  '+ error);
            }
        }
        if(creep.memory.role == 'builder') {
            try{
                roleBuilder(creep);
            }
            catch(error){
                Game.notify('builder role error:   ' + error);
                console.log('builder role error:   ' + error);
            }
        }
        if(creep.memory.role == 'repair') {
            roleRepair.run(creep);
        }
        if(creep.memory.role == 'miner') {
            try{
                roleMiner(creep);
            }
            catch(error){
                Game.notify('miner role error:  ' + error);
                console.log('miner role error:  ' + error);
            }
        }
        if(creep.memory.role == 'hauler') {
            try{
            roleHauler(creep);
            }
            catch(error){
                Game.notify('hauler role error:  '+ error);
                console.log('hauler role error:  '+ error);
            }
        }
        if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        if(creep.memory.role == 'rangedDefender') {
            roleRangedDefender.run(creep);
        }
        if(creep.memory.role == 'transporter') {
          //  try{
                roleTransporter(creep);
            //}
          //  catch(error){
            //    Game.notify('transporter role error:  '+ error);
              //  console.log('transporter role error:  ' + error);
           // }
        }
        if(creep.memory.role == 'scout'){
            try{
            roleScout(creep);
            }
            catch(error){
                Game.notify('scout role error:  ' + error);
                console.log('scout role error:  ' + error);
            }
        }
        if(creep.memory.role == 'claimer'){
            try{
            roleClaimer(creep);
            }
            catch(error){
                Game.notify('claimer role error:  '+ error);
                console.log('claimer role error:    ' + error);
            }
        }

    }
    console.log(Game.cpu.getUsed());
    if(Game.cpu.bucket > 9000) {
        Game.cpu.generatePixel();
    }
}
