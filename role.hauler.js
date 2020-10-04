const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_DEPOSIT_RESOURCE = 3;
const STATE_GRAB_RESOURCE = 4;

var run = function(creep) {
    if(!creep.memory.state) {
        creep.memory.state = STATE_SPAWNING;
    }

    switch(creep.memory.state) {
        case STATE_SPAWNING:
            runSpawning(creep, {nextState: STATE_MOVING});
            break;
        case STATE_MOVING:
            runMoving(creep, {context: haulerContext});
            break;
        case STATE_GRAB_RESOURCE:
            runGrabResource(creep, {nextState: STATE_MOVING});
            break;
        case STATE_DEPOSIT_RESOURCE:
            runDepositResource(creep, {nextState: STATE_MOVING});
            break;
    }
};

var haulerContext = function(creep, currentState) {
    switch(currentState) {
        case STATE_MOVING:
            if(_.sum(creep.store) > 0) {
                creep.memory.targetPos = getHaulerDepositTarget(creep);
                return {nextState: STATE_DEPOSIT_RESOURCE};
            } else {
                creep.memory.targetPos = creep.memory.minerPos;	// or perhaps you're very fancy and you have a function that dynamically assigns your haulers...
                return {nextState: STATE_GRAB_RESOURCE};
            }
            break;
    }
};

var getHaulerDepositTarget = function(creep) {
    // We work out where to put the resources...
    // Perhaps we fill the spawn/extensions...
    // Perhaps we deposit into the storage/terminal...
    // Perhaps we fill towers, labs, nukers, power spawn, etc...
    // It depends on your code!
    var hostiles = creep.room.find(FIND_HOSTILE_CREEPS)
    if(hostiles.length > 0){
        var towers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 150;
            }
        });
    }
        if(towers){
            creep.memory.depositTarget = towers.id;
            return towers.pos;
        
    }
    var spawns = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
    });
    if (spawns == null){
        var towers = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
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
            var storage = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE);
                }
            });
            creep.memory.depositTarget = storage.id;
            return storage.pos;
        }
    }
    else {
        creep.memory.depositTarget = spawns.id;
        return spawns.pos;
    }

};
var runSpawning = function (creep,options){
    var transitionState = options.context ? haulerContext(creep, STATE_SPAWNING).nextState : options.nextState;
    
//When the creep pops out of the spawn transition out of this state and into the next one
    if(!creep.spawning){
        creep.memory.state = transitionState;
        run(creep);
        return;
        }
//Check to see if the creep needs to be "initalized" and if hasnt we do it. 
    if(creep.id){
    if(!creep.memory.init){
        var miner = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(miner) {
                if((miner.memory.role == 'miner') && (miner.memory.haulers.length < miner.memory.haulersNeeded)){
                    return true;
                }
                else {
                    return false;
                }
                }});
        if(!miner){
            creep.memory.minerPos = Game.getObjectById('5f5f8f747a361d382d8f3976').pos;
        }
        else{
            creep.memory.miner = miner.id;
            miner.memory.haulers.push(creep.id);
            creep.memory.minerPos = miner.memory.target;
        }
        creep.memory.init = true;
    }
    }
    // Wait for spawn
};

var runMoving = function(creep, options) {

    var transitionState = options.context ? haulerContext(creep, STATE_MOVING).nextState : options.nextState;
    
    // We know that creep.memory.targetPos is set up before this state is called. For haulers, it's set in haulerContext(), for other creep roles it would be set somewhere else...
    var pos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);
    
    // Has the creep arrived?
    if(creep.pos.isNearTo(pos)) {
        creep.memory.state = transitionState;
        run(creep);
        return;
    }
    
    if(creep.ticksToLive < 100 && !creep.memory.retired) {
        let miner = Game.getObjectById(creep.memory.miner);
        if(miner){
        miner.memory.haulers.shift();
        creep.memory.retired = true;
        }
    }
    
    
    // It hasn't arrived, so we get it to move to targetPos
    else {
    creep.moveTo(pos);
    }
};

var runGrabResource = function(creep, options) {
    
    var transitionState = options.context ? haulerContext(creep, STATE_GRAB_RESOURCE).nextState : options.nextState;
    
    if (creep.store.getFreeCapacity() <= 0){
        creep.memory.state = transitionState;
        run(creep);
        return;
    }
        
    
    if((creep.memory.grabTargetP == null) || (creep.memory.grabTargetW == null)){
        var droppedEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if (droppedEnergy.length > 0){
            creep.memory.grabTargetP = droppedEnergy[0];
            }
        else{
            var miningContainer = creep.pos.findInRange(FIND_STRUCTURES, 3, {
                filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }});
                creep.memory.grabTargetW = miningContainer[0];
                var withdraw = miningContainer[0];
        }
    }
    if(creep.memory.grabTargetP){
        var pickup = Game.getObjectById(creep.memory.grabTargetP.id);
        if (creep.pickup(pickup) != OK) {
            creep.memory.grabTargetP = null;
        }
    }
    if(creep.memory.grabTargetW){
        if (creep.withdraw(withdraw, RESOURCE_ENERGY) != OK) {
            creep.memory.grabTargetW = null;
        }
    }
};

var runDepositResource = function(creep,options) {
    var transitionState = options.context ? haulerContext(creep, STATE_DEPOSIT_RESOURCE).nextState : options.nextState;
    var depositTarget = Game.getObjectById(creep.memory.depositTarget);
    if (creep.transfer(depositTarget, RESOURCE_ENERGY) != OK) {
        creep.memory.state = transitionState;
        run(creep);
        return;
    }
};
    
    
module.exports = run;