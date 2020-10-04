var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var sources = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {return ((structure.structureType == STRUCTURE_STORAGE || 
            structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 50)}});
            console.log(creep + " " + sources);
            if (sources = null){
                var ruin = creep.pos.findClosestByPath(FIND_RUINS, {
                    filter: (ruin) => { return ruin.store[RESOURCE_ENERGY] > 0;
                }});

                var target = ruin;
            }
            else{
                var target = sources;
                console.log('creep:' + creep + 'target: ' + target)
            }
            if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleUpgrader;