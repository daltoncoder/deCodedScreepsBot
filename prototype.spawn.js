
  var generateName = function (prefix) {
    var names = ['Dookie', 'Buttman', 'Thurston', 'Tidalwave', 'DogSniffer', 'Tesla', 'Fanta', 'Beretta', 'Maybeline', 'Dookster', 'Mcguiver', 'ESPN8 The Ocho', 'Aquaman', 'Halo', 'Om', 'Ipman', 'Goku', 'Naruto','Axeman', 'Lucifer', 'Calvary', 'Bruce Lee', 'Pikachu', 'Yogi', 'Keyser Soze', 'Riot', 'Carson Wentz', 'Shooter', 'Dalton', 'Shannon', 'Yu Yu Hakusho', 'Slayer', 'Godiva', 'Morgan Freeman', 'Beowulf', 'Bella', 'Rico', 'Aesop', 'Harley', 'Kung-Fu Guy', 'Thomas Shelby', 'Arthur Shelby', 'Boner Garage', 'Mr. Noodle', 'Mr. Miyagi', 'Karate Kid', 'That Guy Nobody Likes', 'Batman', 'Daniel-son', 'Tekashi-69', 'Cobain', 'BoobFace', 'Yuengling', 'Bro-Bro The Brohemian', 'Kevin', 'Josh', 'Lumley', 'Bella', 'Your Mom', 'Big Booty Back Girl', 'Grandpa', 'Town Drunk', 'Rectangle', 'Matt Damon']
    if (!Memory.creepNameCounter) {
      Memory.creepNameCounter = 0;
    }
    if(Memory.creepNameCounter >= names.length){
        Memory.creepNameCounter = 0;
    }
    let nameNumber = Memory.creepNameCounter;
    var name = prefix + ' ' + names[nameNumber];

    if(Game.creeps[name] == undefined) {
      Memory.creepNameCounter++
      return name;
    }
    else if (Game.creeps[name + 'the Second'] == undefined){
      Memory.creepNameCounter++
      return name + 'the Second';
    }
    else{
      Memory.creepNameCounter++
      return name + 'the Third';
    }
  }
	// create a new function for StructureSpawn
	StructureSpawn.prototype.createCustomMiner =
		function (energy, room) {
			// create a balanced body as big as possible with the given energy
		if(energy < 250) {
      var ems = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.homeRoom == room);
      if(ems.length < 3){
		    this.spawnCreep([WORK,CARRY,MOVE], generateName('EMS'), { memory: { role: 'harvester', homeRoom : room} });
      }
    }
		else if(energy < 200){
		    return;
		}
		else{
			var numberOfParts = Math.floor((energy - 50) / 100);
			numberOfParts = Math.min(numberOfParts, 5);
			var body = [];

      body.push(MOVE);

			for (let i = 0; i < numberOfParts; i++) {
				body.push(WORK);
			}
			//console.log(JSON.stringify(body));

			// create creep with the created body and the given role
			return this.spawnCreep(body, generateName('Miner'), { memory: { role: 'miner', homeRoom : room} });
		}
		};

    StructureSpawn.prototype.createCustomMover =
      function (energy, roleType, room) {
          if(energy < 100){
              return;
          }
          else{
        // create a balanced body as big as possible with given energy
        var numberOfParts = Math.floor(energy / 100);
        var numberOfParts = Math.min(numberOfParts, 5);
        var body = [];

        for (let i = 0; i < numberOfParts; i++){
          body.push(MOVE);
          body.push(CARRY);
        }

        return this.spawnCreep(body, generateName(roleType), { memory: { role: roleType, homeRoom : room} });
          }
      };

      StructureSpawn.prototype.createCustomUpgrader =
        function(energy,room) {
            if(energy<300){
                return;
            }
            else{
          // create a balanced body as big as possible with given energy
          var numberOfParts = Math.floor((energy - 50) / 250);
          var numberOfParts = Math.min(numberOfParts, 5);
          var body = [];

          body.push(CARRY);

          for (let i = 0; i < numberOfParts; i++){
            body.push(WORK);
            body.push(WORK);
            body.push(MOVE);
          }

          return this.spawnCreep(body, generateName('Upgrader'), { memory: { role: 'upgrader', homeRoom : room} });
            }
        };
        StructureSpawn.prototype.createCustomCreep =
          function(energy, roleType, room) {
              if (energy < 200){
              return;
              }
              else {
            // create a balanced body as big as possible with given energy
            var numberOfParts = Math.floor(energy / 200);
            var numberOfParts = Math.min(numberOfParts, 5);
            var body = [];

            for (let i = 0; i < numberOfParts; i++){
              body.push(CARRY);
              body.push(WORK);
              body.push(MOVE);
            }

            return this.spawnCreep(body, generateName(roleType), { memory: { role: roleType, homeRoom : room} });
              }
          };
          StructureSpawn.prototype.createCustomScout =
            function(energy, room) {
              if (energy < 50){
                return;
              }
              else {
                return this.spawnCreep([MOVE], generateName('Scout'), { memory: { role: 'scout', homeRoom : room} });
              }
            };
