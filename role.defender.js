var roleDefender = {
    
    run: function(creep) {
        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if (closestHostile){
            creep.attack(closestHostile);
        }
        if (!closestHostile){
            creep.moveTo(26,16);
        }
    
    
    }
};
module.exports = roleDefender;