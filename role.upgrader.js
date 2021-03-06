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
            if (sources == null){
                var ruin = creep.pos.findClosestByPath(FIND_RUINS, {
                    filter: (ruin) => { return ruin.store[RESOURCE_ENERGY] > 0;
                }});
                if(ruin){
                var groundTarget = null;
                var target = ruin;
                }
                else{
                    var droppedEnergy =creep.room.find(FIND_DROPPED_RESOURCES, {filter: (resource) => { return resource.resourceType == RESOURCE_ENERGY}});
                    if(droppedEnergy.length > 0){
                        var target = null;
                        var groundTarget = droppedEnergy[0];
                    }
                }
            }
            else{
                var groundTarget = null;
                var target = sources;
            }
            if(target){
            if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
            else if(groundTarget){
                if(creep.pickup(groundTarget) == ERR_NOT_IN_RANGE){
                    creep.moveTo(groundTarget);
                }
            }      
        }
    }
};

module.exports = roleUpgrader;