const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_BUILDING = 3;
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
            runMoving(creep, {context: builderContext});
            break;
        case STATE_GRAB_RESOURCE:
            runGrabResource(creep, {nextState: STATE_MOVING});
            break;
        case STATE_BUILDING:
            runBuilding(creep, {nextState: STATE_MOVING});
            break;
    }
};

var runSpawning = function (creep,options){
    var transitionState = options.context ? builderContext(creep, STATE_SPAWNING).nextState : options.nextState;

//When the creep pops out of the spawn transition out of this state and into the next one
    if(!creep.spawning){
        creep.memory.state = transitionState;
        run(creep);
        return;
        }
//Check to see if the creep needs to be "initalized" and if hasnt we do it.
    if(!creep.memory.init){
        creep.memory.init = true;
    }
};

var builderContext = function(creep, currentState) {
    switch(currentState) {
        case STATE_MOVING:
            if(_.sum(creep.store) > 0) {
                creep.memory.targetPos = getBuildingTarget(creep);
                return {nextState: STATE_BUILDING};
            } else {
                creep.memory.targetPos = getEnergyTarget(creep);	// or perhaps you're very fancy and you have a function that dynamically assigns your haulers...
                return {nextState: STATE_GRAB_RESOURCE};
            }
            break;
    }
};

var getEnergyTarget = function(creep) {
if(creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 0){
    creep.memory.targetID = creep.room.storage.id;
    return creep.room.storage.pos;
}
else{
    var fullStructs = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.store && structure.store[RESOURCE_ENERGY] > 0 && structure.structureType != STRUCTURE_EXTENSION && structure.structureType != STRUCTURE_SPAWN;
            }
    });
    if(fullStructs.length > 0){
        creep.memory.targetID = fullStructs[0].id;
        return fullStructs[0].pos;
    }
    else{
        var ruins = creep.room.find(FIND_RUINS, {
            filter: (ruin) => {
                return ruin.store[RESOURCE_ENERGY] > 0;
            }});
        if(ruins.length > 0){
            creep.memory.targetID = ruins[0].id;
            return ruins[0].pos;
            }    
        else{
                var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                    filter: (resource) => {
                    return resource.resourceType == RESOURCE_ENERGY;
                    }
                });
            if(droppedEnergy.length > 0){
                creep.memory.targetID = droppedEnergy[0].id;
                return droppedEnergy[0].pos;
            }
            else{
                var source = creep.pos.findClosestByRange(FIND_SOURCES);
                if(source){
                    creep.memory.targetID = source.id;
                    return source.pos;
                }
            else{            
            creep.memory.targetID = null;
            return null;
            }

            }
        }
    }
}
};

var getBuildingTarget = function(creep) {
    // We work out where to put the resources...
    // Perhaps we fill the spawn/extensions...
    // Perhaps we deposit into the storage/terminal...
    // Perhaps we fill towers, labs, nukers, power spawn, etc...
    // It depends on your code!
    var homeRoom = creep.memory.homeRoom;
    var constructionSites = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
    if (constructionSites == null){
        var neighbors = Object.keys(Memory.rooms[homeRoom].neighbors);
        for (room in neighbors){
            if(Memory.rooms[homeRoom].neighbors[neighbors[room]].builderNeeded == true && neighbors[room] != creep.pos.roomName){
                var roomPos = {x : 25, y : 25, roomName : neighbors[room]}
                return roomPos;
            }
        }
            creep.memory.targetID = null;
            return null;
        
    }
    else if(constructionSites){
        creep.memory.targetID = constructionSites.id;
        return constructionSites.pos;
    }
};

var runMoving = function(creep, options) {

    var transitionState = options.context ? builderContext(creep, STATE_MOVING).nextState : options.nextState;

    if(creep.memory.targetPos == null){
        return;
    }
    else{
    // We know that creep.memory.targetPos is set up before this state is called. For haulers, it's set in haulerContext(), for other creep roles it would be set somewhere else...
    var pos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);

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
}
};

var runGrabResource = function(creep, options) {

    var transitionState = options.context ? builderContext(creep, STATE_GRAB_RESOURCE).nextState : options.nextState;
    if(creep.memory.targetID == null){
        return;
    }
    else{
    if (creep.store.getFreeCapacity() <= 0){
        creep.memory.state = transitionState;
        run(creep);
        return;
    }
    var target = Game.getObjectById(creep.memory.targetID);
    if(target instanceof Source){
        if(creep.harvest(target) != OK){
            creep.memory.state = transitionState;
            run(creep);
            return;
        }
    }
    else if(creep.pickup(target) != OK){
            if(creep.withdraw(target, RESOURCE_ENERGY) != OK){
                creep.memory.state = transitionState;
                run(creep);
                return;
            }
        }
    }
};

var runBuilding = function(creep,options) {
    var transitionState = options.context ? builderContext(creep, STATE_BUILDING).nextState : options.nextState;
    if(creep.memory.targetID == null){
        return;
    }
    else{
    var target = Game.getObjectById(creep.memory.targetID);

    if (creep.build(target) != OK){
        creep.memory.state = transitionState;
        run(creep);
        return;
    }
}
};

module.exports = run;
