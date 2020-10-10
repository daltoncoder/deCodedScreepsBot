var run = function(creep){
    if(!creep.room.controller.sign || creep.room.controller.sign.username != 'Mcguiver') {
        if(creep.signController(creep.room.controller, "New programmer writing 1st screeps bot.Msg Me if you have any advice or notice anything off about my code.") == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
    else{
        creep.suicide();
    }
    
};
module.exports = run;