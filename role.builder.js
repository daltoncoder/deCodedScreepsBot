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
            runDepositResource(creep, {nextState: STATE_MOVING});
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
                creep.memory.targetPos = Game.rooms[creep.memory.homeRoom].storage.pos;	// or perhaps you're very fancy and you have a function that dynamically assigns your haulers...
                return {nextState: STATE_GRAB_RESOURCE};
            }
            break;
    }
};

var getBuildingTarget = function(creep) {
    // We work out where to put the resources...
    // Perhaps we fill the spawn/extensions...
    // Perhaps we deposit into the storage/terminal...
    // Perhaps we fill towers, labs, nukers, power spawn, etc...
    // It depends on your code!
    var homeRoom = creep.memory.homeRoom;
    var constructionSites = creep.room.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
    if (constructionSites == null){
        var neighbors = Object.keys(Memory.rooms[homeRoom].neighbors);
        for (room in neighbors){
            if(Memory.rooms[homeRoom].neighbors[room].builderNeeded = true){
                var roomPos = {x : 25, y : 25, roomName : room}
                return roomPos;
            }
        }
    }
    else{
        creep.memory.targetID = constructionSites.id;
        return constructionSites.pos;
    }
};

var runMoving = function(creep, options) {

    var transitionState = options.context ? builderContext(creep, STATE_MOVING).nextState : options.nextState;
    
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
};

var runGrabResource = function(creep, options) {
    
    var transitionState = options.context ? builderContext(creep, STATE_GRAB_RESOURCE).nextState : options.nextState;
    
    if (creep.store.getFreeCapacity() <= 0){
        creep.memory.state = transitionState;
        run(creep);
        return;
    }
    creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
};

var runBuilding = function(creep,options) {
    var transitionState = options.context ? builderContext(creep, STATE_BUILDING).nextState : options.nextState;
    var target = Game.getObjectById(creep.memory.targetID);

    if (creep.build(target) != OK){
        creep.memory.state = transitionState;
        run(creep);
        return;
    }
};

module.exports = run;