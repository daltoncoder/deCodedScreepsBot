var run = function(creep){
    if(!room.controller.sign || creep.room.controller.sign.username != 'Mcguiver') {
        if(creep.signController(creep.room.controller, "New programmer and screeps player trying to write my first screeps bot. Very friendly player. Please message me if you have any advice or notice anything off about my code. Also if my code is interfering with what your trying to do just shoot me a message. Thanks and goodluck!") == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
    else{
        creep.suicide();
    }
    
};
module.exports = run;