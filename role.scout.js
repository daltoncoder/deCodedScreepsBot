const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_SCOUTING = 3;

var run = function(creep) {
    if(!creep.memory.state) {
        creep.memory.state = STATE_SPAWNING;
    }

    switch(creep.memory.state) {
        case STATE_SPAWNING:
            runSpawning(creep, STATE_MOVING);
            break;
        case STATE_MOVING:
            runMoving(creep, STATE_SCOUTING);
            break;
        case STATE_SCOUTING:
            runScouting(creep);
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
        var assignedRooms = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout').map((el) => el.memory.targetRoom);

        var openRoom = _.filter(Object.keys(Memory.rooms[creep.memory.homeRoom].neighbors), (room) => assignedRooms.indexOf(room) == -1 && Memory.rooms[creep.memory.homeRoom].neighbors[room].needScout == true);
        if (openRoom.length > 0){
            creep.memory.targetRoom = openRoom[0];

        }

    creep.memory.init = true;
    }

    // we wait for spawn
};

var runMoving = function(creep, transitionState){
    var pos = new RoomPosition(25, 25, creep.memory.targetRoom);
    if((creep.pos.roomName == creep.memory.targetRoom) && (creep.pos.x > 0 && creep.pos.x < 49) && (creep.pos.y > 0 && creep.pos.y < 49)) {
        creep.memory.state = transitionState;
        run(creep);
        return;
    }
    creep.moveTo(pos);

};

var runScouting = function(creep){
    var homeRoom = creep.memory.homeRoom;
    var targetRoom = creep.memory.targetRoom;
    if(!creep.memory.scouted){
        var sources = creep.room.find(FIND_SOURCES);
        Memory.rooms[homeRoom].neighbors[targetRoom].sources = sources;
        var homeRoomExits = Game.map.describeExits(creep.memory.homeRoom);
        var homeRoomExitsNames = Object.values(homeRoomExits);
        console.log("1: " + homeRoomExitsNames);

        Memory.rooms[homeRoom].neighbors[targetRoom].controllerPos = creep.room.controller.pos;
        if (homeRoomExitsNames.includes(targetRoom)){
            var roomExits = Object.values(Game.map.describeExits(targetRoom));
            console.log("2: " + roomExits)
            for (exit in roomExits){
                if (!exit == homeRoom){
                if(!Memory.rooms[homeRoom].neighbors[roomExits[exit]]){
                    Memory.rooms[homeRoom].neighbors[roomExits[exit]] = {needScout : true};
                }
            }
            }
        }

        if(!homeRoomExitsNames.includes(targetRoom)){
            if(sources.length >= 2 && Game.map.getRoomStatus(targetRoom).status == 'normal'){
                Memory.rooms[homeRoom].neighbors[targetRoom].claimable = true;
                Memory.rooms[homeRoom].roomToClaim = true;
            }
            Memory.rooms[homeRoom].neighbors[targetRoom].needScout = false;
        }
        creep.memory.scouted = true;
    }

    if (Game.time % 10 === 0){
        let constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        if(constructionSites.length > 0){
            Memory.rooms[homeRoom].neighbors[targetRoom].builderNeeded = true;
        }
        else {
            Memory.rooms[homeRoom].neighbors[targetRoom].builderNeeded = false;
        }
    }

    };

module.exports = run;
