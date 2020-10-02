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
            runMoving(creep, STATE_HARVESTING);
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
      
      creep.memory.init = true;
    }
