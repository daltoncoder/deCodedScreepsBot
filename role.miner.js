const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_HARVESTING = 2;

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
            case STATE_HARVESTING:
                runHarvesting(creep);
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
        
        //Check to see if the creep needs to be "initalized" and if hasnt we do it. 
        if(!creep.memory.init){
            if(creep.memory.haulers){
                creep.memory.haulers.forEach((element) => {
                    let hauler = Game.getObjectById(element);
                    if(hauler){
                    hauler.memory.miner = creep.id;
                    }
                    else{
                        creep.memory.haulers.splice(element, 1);
                    }
                });
            }
            else {
                creep.memory.haulers = [];
            }
        
            if(!creep.memory.miningPos){
                let occupiedMiningPos =                     //store variable of all the mining positions of alive mining creep
                    _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').map((el) => el.memory.miningPos);
                let closestMiningPos =                      // find sources and filter them against occupiedMiningPos to ensure miners source is his own
                creep.pos.findClosestByRange(FIND_SOURCES,
                    {filter: (source) => occupiedMiningPos.indexOf(source.id) == -1});
                creep.memory.miningPos = closestMiningPos.id;
                    }
            
            
            var miningPos = Game.getObjectById(creep.memory.miningPos);
            var standingPos= miningPos.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER;
                }});
              
            if(standingPos.length <= 0){
            creep.memory.target = miningPos.pos;
            creep.memory.containers = false;
            }
            else{
                
                creep.memory.target = standingPos[0].pos;
            }
            
            creep.memory.spawnTime = Game.spawns['Spawn1'].pos.getRangeTo(creep.memory.target.x,creep.memory.target.y) * 3;
            
            creep.memory.haulersNeeded = 1;
            
            
                
            creep.memory.init = true;
        }
    };
    
    var runMoving = function(creep, transitionState){
        var pos = new RoomPosition(creep.memory.target.x, creep.memory.target.y, creep.memory.target.roomName);
        if(creep.pos.getRangeTo(pos) <= 0){
            creep.memory.state = transitionState;
            run(creep);
            return;
        }
        if(creep.memory.containers == false){
            if(creep.pos.getRangeTo(pos) <= 1){
                creep.memory.state = transitionState;
                run(creep);
                return;
            }
        }
        creep.moveTo(pos);
        
    };
    
    var runHarvesting = function(creep){
        var source = Game.getObjectById(creep.memory.miningPos);
        creep.harvest(source);
        if((creep.ticksToLive <= creep.memory.spawnTime) && (!creep.memory.spawned)) {
            let newName = "Miner" + Game.time;
            if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE], newName,
              {memory: {role: 'miner', haulers: creep.memory.haulers, haulersNeeded: creep.memory.haulersNeeded, miningPos: creep.memory.miningPos, homeRoom: creep.pos.roomName}})) {
              creep.memory.spawned = true;
              }
        }
    };
    
    

module.exports = run;