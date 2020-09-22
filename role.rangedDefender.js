var roleRangedDefender = {
    
    run: function(creep) {
        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if (closestHostile){
            if(creep.pos.inRangeTo(closestHostile, 3)) {
                creep.rangedAttack(closestHostile);
                }
        }
        else if(!closestHostile){
                creep.moveTo(27,16);
            }
        
        }
};
module.exports = roleRangedDefender;