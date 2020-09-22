var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('⚡  Repairing');
            }

        if(creep.memory.repairing) {
            const targets = creep.room.find(FIND_STRUCTURES, {
            filter: structure => (structure.hits < structure.hitsMax) && structure.structureType != STRUCTURE_WALL
            });

            targets.sort((a,b) => a.hits - b.hits);
            
            var containerTarg = creep.room.find(FIND_STRUCTURES, {
                filter: structure => (structure.hits < structure.hitsMax) && structure.structureType == STRUCTURE_CONTAINER
            });
            containerTarg.sort((a,b) => a.hits - b.hits);

            if(targets.length > 0) {
            if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
                }
            }
            if(containerTarg.length > 0) {
               if(creep.repair(containerTarg[0]) == ERR_NOT_IN_RANGE) {
                   creep.moveTo(containerTarg[0]);
               } 
            }
        }
        else {
            var sources = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && (structure.store[RESOURCE_ENERGY] > 200)}});
            if(creep.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }

                
        }
    }
};

module.exports = roleRepair;