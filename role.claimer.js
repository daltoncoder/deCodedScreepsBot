const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_CLAIMING = 2;

var run = function(creep) {
    if(!creep.memory.state){
        creep.memory.state = STATE_SPAWNING;
    }
    switch(creep.memory.state) {
        case STATE_SPAWNING:
            runSpawning(creep);
            break;
        case STATE_MOVING:
            runMoving(creep, STATE_CLAIMING);
            break;
        case STATE_CLAIMING:
            runClaiming(creep);
            break;
    }
};
var runSpawning = function(creep){
    //When the creep pops out of the spawn transition out of this state and into the next one
    if(!creep.spawning){
        creep.memory.state = STATE_MOVING;
        run(creep);
        return;
    }
    //Check to see if the creep needs to be "initalized" and if hasnt we do it. Will already have homeRoom in memory on spawn
    if(!creep.memory.init){
      var homeRoom = creep.memory.homeRoom;
      //Find a neighbor to the homeroom that is marked as claimable by the scouts
      var neighbors = Object.values(Memory.rooms[homeRoom].neighbors);

      for(room in neighbors){
        if (Memory.rooms[homeRoom].neighbors[neighbors[room]].claimable == true){
          creep.memory.targetRoom = room;
          break;
        }
      }
      creep.memory.init = true;
    }
  };

  var runMoving = function(creep, transitionState){
      var pos = new RoomPosition(Memory.rooms[creep.memory.homeRoom].neighbors[creep.memory.targetRoom].controllerPos.x, Memory.rooms[creep.memory.homeRoom].neighbors[creep.memory.targetRoom].controllerPos.y, creep.memory.targetRoom);
      if(creep.pos.getRangeTo(pos) <= 1){
          creep.memory.state = transitionState;
          run(creep);
          return;
      }
      creep.moveTo(pos);
  };

  var runClaiming = function(creep){
    if(!creep.memory.claimed){
      if(creep.claimController(creep.room.controller) == 0){
        creep.memory.claimed = true;
      }
    }    
  };

  module.exports = run;
