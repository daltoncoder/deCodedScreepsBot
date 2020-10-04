const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_DEPOSIT_RESOURCE = 3;
const STATE_GRAB_RESOURCE = 4;

var run = function (creep){
    if(!creep.memory.state) {
        creep.memory.state = STATE_SPAWNING;
    }

    switch(creep.memory.state) {
        case STATE_SPAWNING:
            runSpawning(creep, {nextState: STATE_MOVING});
            break;
        case STATE_MOVING:
            runMoving(creep, {context: transporterContext});
            break;
        case STATE_GRAB_RESOURCE:
            runGrabResource(creep, {nextState: STATE_MOVING});
            break;
        case STATE_DEPOSIT_RESOURCE:
            runDepositResource(creep, {nextState: STATE_MOVING});
            break;
    }
};

var transporterContext = function(creep, currentState) {
    switch(currentState) {
        case STATE_MOVING:
            if(_.sum(creep.store) > 0) {
                creep.memory.targetPos = getTransporterDepositTarget(creep);
                return {nextState: STATE_DEPOSIT_RESOURCE};
            }
            else {
                creep.memory.targetPos = getTransporterWithdrawTarget(creep);
                return {nextState: STATE_GRAB_RESOURCE};
                
            }
            break;
    }
};

var getTransporterWithdrawTarget = function(creep) {
    var ruins = creep.room.find(FIND_RUINS, {
        filter: (ruin) => {
            return (ruin.store[RESOURCE_ENERGY] > 0)
        }
    });
    if(ruins.length > 0){
        creep.memory.targetID = ruins.id;
        return ruins.pos;
    }
    else{
        var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: (resource) => {return resource.resourceType == RESOURCE_ENERGY}
        });
        if(droppedEnergy.length > 0){
            creep.memory.targetID = droppedEnergy[0].id;
            return droppedEnergy[0].pos
        }
        else {
            let storagePos = Game.getObjectById(creep.memory.storage);
            creep.memory.targetID = storagePos.id;
            return storagePos.pos;
        }
    }

};

var getTransporterDepositTarget = function(creep) {
    // We work out where to put the resources...
    // Perhaps we fill the spawn/extensions...
    // Perhaps we deposit into the storage/terminal...
    // Perhaps we fill towers, labs, nukers, power spawn, etc...
    // It depends on your code!
    var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
    if(hostiles.lenghth > 0){
        var towers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 150;
            }
        });
    
        if(towers){
            creep.memory.depositTarget = towers.id;
            return towers.pos;
        }
    }
    var spawns = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
    });
    if (spawns == null){
        var towers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 150;
                    }
        });
        if(towers){
            creep.memory.depositTarget = towers.id;
            return towers.pos;
        }
        else {
          var upgraderCont = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 4, {
            filter: (structure) => {
              return ((structure.structureType == STRUCTURE_CONTAINER) &&
              (structure.store.getFreeCapacity() > 0))
          }});
          if (upgraderCont.length > 0) {
            creep.memory.depositTarget = upgraderCont[0].id;
            return upgraderCont[0].pos;
            }
          }
    }
    else if(spawns) {
        creep.memory.depositTarget = spawns.id;
        return spawns.pos;
    }
    else {
        creep.say('Awaiting Target');
        return null;
    }
  };

var runSpawning = function(creep, options) {

  var transitionState = options.context ? transporterContext(creep, STATE_SPAWNING).nextState : options.nextState;
  //When the creep pops out of the spawn transition out of this state and into the next one
  if(!creep.spawning){
      creep.memory.state = transitionState;
      run(creep);
      return;
      }
  //Check to see if the creep needs to be "initalized" and if hasnt we do it.
  if(!creep.memory.init){
    var storage =  creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
        return (structure.structureType == STRUCTURE_STORAGE)}});
    }
    if (storage){
      creep.memory.storage = storage.id;
      creep.memory.targetPos = storage.pos;
    }
    creep.memory.init = true;
};

var runMoving = function(creep, options) {
    var transitionState = options.context ? transporterContext(creep, STATE_MOVING).nextState : options.nextState;
    if(creep.memory.targetPos == null){
        return;
    }
    else {
    var pos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);
    }
    // Has the creep arrived?
    if(creep.pos.isNearTo(pos)) {
        creep.memory.state = transitionState;
        run(creep);
        return;
    }
    // It hasn't arrived, so we get it to move to targetPos
    else {
    creep.moveTo(pos);
    }
};

var runGrabResource = function(creep, options) {

  var transitionState = options.context ? transporterContext(creep, STATE_GRAB_RESOURCE).nextState : options.nextState;

  if (creep.store.getFreeCapacity() <= 0){
      creep.memory.state = transitionState;
      run(creep);
      return;
  }
var grabTarget = Game.getObjectById(creep.memory.targetID);
if(!grabTarget.structureType){
creep.pickup(grabTarget);
}
else{
    creep.withdraw(grabTarget, RESOURCE_ENERGY);
}
};

var runDepositResource = function(creep, options) {
  var transitionState = options.context ? transporterContext(creep, STATE_DEPOSIT_RESOURCE).nextState : options.nextState;

  var depositTarget = Game.getObjectById(creep.memory.depositTarget);
  if (creep.transfer(depositTarget, RESOURCE_ENERGY) != OK) {
      creep.memory.state = transitionState;
      run(creep);
      return;
  }
};
module.exports = run;