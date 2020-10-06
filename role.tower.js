var run = function(tower){
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
        tower.attack(closestHostile);
    }
    if(!closestHostile){
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType != STRUCTURE_WALL) && (structure.hits < structure.hitsMax) && (structure.hits < 500000)
        });
    if(closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
    }
    }
}
};