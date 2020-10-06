var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0){
            var droppedResources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                if(droppedResources == null) {
                    var sources = creep.pos.findClosestByPath(FIND_SOURCES);
                    if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                else {
                if(creep.pickup(droppedResources) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResources, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else{
                var constructionSites = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)
                if(constructionSites){
                    if(creep.pos.isNearTo(constructionSites)){
                        creep.build(constructionSites);
                    }
                    else{
                        creep.moveTo(constructionSites);
                    }                   ]

                }
            }
        }
    }
};

module.exports = roleHarvester;