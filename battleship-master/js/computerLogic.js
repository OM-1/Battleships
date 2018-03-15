//if the first turn is taken this variable is changed to true
var firstTurnTaken = false;
//Computer's turn function'
function computerTakesTurn(){
    //If the first shot has been taken , it Changes first turn taken to true
   if (!firstTurnTaken) {
       firstTurnTaken = true;
        //also Runs a random shot function
       randomShot();
   }
  
   else {
       //Otherwise if the seeker function has found a ship and is in the process of sinking it, it updates the priority and handlecomputershot function
    if (!seeker.targetAcquired){
      updatePriorityIndices();
      handleComputerShot(myGrid.indicesAndLocations[0].location);
    }
    else { // If the computer has not found a ship to shoot at, it takes a shot 
      seekerShot();
    }
  }
}

// computer takes a random shot at the board, only called when no target acquired
function randomShot() {
    //randomly selects a random cell within the board to shoot at
  var randomRow = Math.floor(Math.random() * 10);
  var randomColumn = Math.floor(Math.random() * 10);
  while (shotAlreadyFired([randomRow, randomColumn])){
    randomRow = Math.floor(Math.random() * 10);
    randomColumn = Math.floor(Math.random() * 10);
  }
    //Runs handleComputerShot with the random cell
  handleComputerShot([randomRow, randomColumn]);
}

// computer takes a shot following the seeker algorithm, only called once target
// is acquired
function seekerShot() {
    //List for the squares next to the hit scored
  var adjacentToHits = [];
  var randomNum;
  if (seeker.directionAcquired){
    // seeker will take a guess in the direction of the acquired direction
    // if seeker misses than directionAcquired will be set to false and seekerShot called again
      switch (seeker.directionIndex) {
        //Selection cases for each direction when you score a hit
      case 0:
        if (!isComputerShotValid([seeker.lastHit[0] - 1, seeker.lastHit[1]])){
          seeker.directionAcquired = false;
          seeker.rotate();
          seeker.tries++;
          seekerShot()
        }
        else { 
          handleComputerShot([seeker.lastHit[0] - 1, seeker.lastHit[1]]);
        }
        break;
      case 1:
        if (!isComputerShotValid([seeker.lastHit[0], seeker.lastHit[1] + 1])){
          seeker.directionAcquired = false;
          seeker.rotate();
          seeker.tries++;
          seekerShot();
        }
        else {
          handleComputerShot([seeker.lastHit[0], seeker.lastHit[1] + 1]);
        }
        break;
      case 2:
        if (!isComputerShotValid([seeker.lastHit[0] + 1, seeker.lastHit[1]])){
          seeker.directionAcquired = false;
          seeker.rotate();
          seeker.tries++;
          seekerShot();
        }
        else {
          handleComputerShot([seeker.lastHit[0] + 1, seeker.lastHit[1]]);
        }
        break;
      case 3:
        if (!isComputerShotValid([seeker.lastHit[0], seeker.lastHit[1] - 1])){
          seeker.directionAcquired = false;
          seeker.rotate();
          seeker.tries++;
          seekerShot();
        }
        else {
          handleComputerShot([seeker.lastHit[0], seeker.lastHit[1] - 1]);
        }
        break;
    }
  }
  
  else {
    //if the seeker has tested more than 6 locations
      if (seeker.tries > 6) {
        //sets adjacent hits to the return from the checkrecenthits function
      adjacentToHits = checkRecentHits();
      //If there are no valid adjacent hits, takes a random shot
      if (adjacentToHits.length != 0) {
        randomNum = Math.floor(Math.random() * adjacentToHits.length);
        handleComputerShot(adjacentToHits[randomNum]);
      }
      else {//Otherwise sets the attribute tries to zero and changes the target acquired boolean to false
        seeker.tries = 0;
        seeker.targetAcquired = false;
        //Runs random shot function
        randomShot();
      }
      }
    //Explanation of cases:
    // seeker has acquired a target but not a direction, and has not yet tested 4 directions
    else {
      switch (seeker.directionIndex){ // Cases to get direction of the ship that the computer is targeting
        case 0:
          if (!isComputerShotValid([seeker.lastHit[0] - 1, seeker.lastHit[1]])){
            //Runs the rotate function, increments the number of tries then runs the shot function
            seeker.rotate();
            seeker.tries++;
            seekerShot();
          }
          else {
            handleComputerShot([seeker.lastHit[0] - 1, seeker.lastHit[1]]);
          }
          break;
        case 1:
          if (!isComputerShotValid([seeker.lastHit[0], seeker.lastHit[1] + 1])){
            seeker.rotate();
            seeker.tries++;
            seekerShot();
          }
          else {
            handleComputerShot([seeker.lastHit[0], seeker.lastHit[1] + 1]);
          }
          break;
        case 2:
          if (!isComputerShotValid([seeker.lastHit[0] + 1, seeker.lastHit[1]])){
            seeker.rotate();
            seeker.tries++;
            seekerShot();
          }
          else {
            handleComputerShot([seeker.lastHit[0] + 1, seeker.lastHit[1]]);
          }
          break;
        case 3:
          if (!isComputerShotValid([seeker.lastHit[0], seeker.lastHit[1] - 1])){
            seeker.rotate();
            seeker.tries++;
            seekerShot();
          }
          else {
            handleComputerShot([seeker.lastHit[0], seeker.lastHit[1] - 1]);
          }
          break;
      }
    }
  }
}
//Defines seeker object
var seeker = {
    //Defines target and direction acquired to false as well 
  targetAcquired: false,
    //The index is got from the cases in the above function which covers which direction the ship is facing 
  directionIndex: 0,
  directionAcquired: false,
  //Stores the initial, last and recent hits
  initialHit: [],
  lastHit: [],
  recentHits: [],
  //Sets the tries to zero
  tries: 0,
  //List of ships sunk
  recentShipsSunk: [],
  rotate: function(){ //Rotate function - rotates ship by 90 degrees
    if (this.directionIndex == 3){
      this.directionIndex = 0;
    }
    else { 
      this.directionIndex++;
    }
  },
  reverse: function(){ //Reverse direction function
    if (this.directionIndex < 2){
      this.directionIndex += 2;
    }
    else {
      this.directionIndex -= 2;
    }
  },
  logSelf: function(){ //Console function, stores conditions used in the computer logic
    console.log("------");
    console.log("targetAcquired: " + this.targetAcquired);
    console.log("directionAcquired: " + this.directionAcquired);
    console.log("directionIndex: " + this.directionIndex);
    console.log("initialHit: " + this.initialHit[0] + "-" + this.initialHit[1]);
    console.log("lastHit: " + this.lastHit[0] + "-" + this.initialHit[1]);
    console.log("tries: " + this.tries);
    console.log("------");
  }
}

function isComputerShotValid(aLocation){ //Validation for the computer's shot
  if (aLocation[0] > 9 || aLocation[0] < 0 || aLocation[1] > 9 || aLocation[1] < 0){
    return false;
  }
  else {//updates grid state for hits and misses
    if (myGrid.gridState[aLocation[0]][aLocation[1]] == "m" ||
    myGrid.gridState[aLocation[0]][aLocation[1]] == "h"){
      return false;
    }
    return true;
  }
}
//Validation for shots
function shotAlreadyFired(aLocation){
  var alreadyFired = false;
  computerShots.forEach(function(shot){
    if (shot[0] == aLocation[0] && shot[1] == aLocation[1]){
      alreadyFired = true;
    }
  });
  return alreadyFired;
}
//function for processing the shot 
function handleComputerShot(cellLocation){// assigns if a shot is a hit or miss
  if (myGrid.gridState[cellLocation[0]][cellLocation[1]] == "h"){
      myGrid.gridState[cellLocation[0]][cellLocation[1]] = "m";
      //updates the message box at the side of the screen for a miss
    document.getElementById("compMessage").innerHTML = "Computer missed!";
    // if seeker was following an acquired direction, then go back to the initial
    // hit and reverse direction for next turn
    if (seeker.directionAcquired){ // Condition for if the seeker has acquired the direction of the ship
      seeker.lastHit = seeker.initialHit; //Assigns initial hit to the first hit scored
      seeker.reverse(); //Reverses the direction of the seeker
      seeker.directionAcquired = false; //Changes direction acquired to false
    }

    seeker.tries++; //increments the number of tries 
    computerShots.push(cellLocation); 
  }
    //if a hit scored, updates the message box for hit
  else if (myGrid.gridState[cellLocation[0]][cellLocation[1]] == "s"){
    myGrid.gridState[cellLocation[0]][cellLocation[1]] = "h";
    document.getElementById("compMessage").innerHTML = "Computer scored a hit!";
    if (seeker.targetAcquired){
      seeker.directionAcquired = true;
    }
    else { //Sets targetaquired to true and initialhit to the location of the last shot 
      seeker.targetAcquired = true;
      seeker.initialHit = cellLocation;
    }
    seeker.lastHit = cellLocation;
      //sets tries to 0,increments computer hits and pushes the recent hit onto the recenthit attribute
    seeker.tries = 0;
    myGrid.hits++;
    computerShots.push(cellLocation);
    seeker.recentHits.push(cellLocation);
      //runs the update ship health function
    updateMyShipHealth([cellLocation[0], cellLocation[1]]);
  }
  myGrid.render();
    //when the computer scores enough hits to sink all ships, displays you lose
  if (myGrid.hits > 16){
    disableOnClicks();
    document.getElementById("message").innerHTML = "You lose!";
  }
}

// checks to see if computer has sunk a ship, called whenever computer gets a hit
// also resets the seeker object
function updateMyShipHealth(aLocation){
  var lengthOfShipsSunk = 0;
  myShips.forEach(function(ship){
    if (ship.contains(aLocation)){
      ship.health--;
      if (ship.health < 1){//Updates the message box with the sunk messages
        document.getElementById("compMessage").innerHTML = "Hit and sunk! Computer sunk my " + ship.name + "!";
        document.getElementById("my" + ship.name).innerHTML = ship.name + ": Sunk";
        document.getElementById("my" + ship.name).setAttribute("class", "sunk");
        //Updates the recentshipsSunk attribute with the last ship sunk
        seeker.recentShipsSunk.push(ship);
        seeker.recentShipsSunk.forEach(function(ship){
          lengthOfShipsSunk += ship.length;
        });
        if (seeker.recentHits.length == lengthOfShipsSunk){
          seeker.targetAcquired = false;
          seeker.directionAcquired = false;
          seeker.recentHits = [];
          seeker.recentShipsSunk = [];
        }
      }
    }
  });
}

function checkRecentHits(){
  var validShots = [];
  seeker.recentHits.forEach(function(hit){
    if (isComputerShotValid([hit[0] - 1, hit[1]])){
      foundValidShot = true;
      validShots.push([hit[0] - 1, hit[1]]);
    }
    else if (isComputerShotValid([hit[0], hit[1] + 1])){
      foundValidShot = true;
      validShots.push([hit[0], hit[1] + 1]);
    }
    else if (isComputerShotValid([hit[0] + 1, hit[1]])){
      foundValidShot = true;
      validShots.push([hit[0] + 1, hit[1]]);
    }
    else if (isComputerShotValid([hit[0], hit[1] - 1])){
      foundValidShot = true;
      validShots.push([hit[0], hit[1] - 1]);
    }
  });
  return validShots;
}

function updatePriorityIndices(){
  myGrid.indicesAndLocations = []
  var allDistanceObjects = [];
  for (var i = 0; i < 10; i++){
    for (var j = 0; j < 10; j++){
      myGrid.searchPriorityIndices[i][j] = getPriorityIndex([i, j]);
      if (isComputerShotValid([i, j])){
        myGrid.indicesAndLocations.push({
          index: getPriorityIndex([i, j]),
          location: [i, j]
        });
      }
    }
  }
  myGrid.indicesAndLocations.sort(function(a, b){
    if (a.index < b.index) {
      return 1;
    }
    if (a.index > b.index) {
      return -1;
    }
    return 0;
  });
}

function minimumDistanceToBoundary(cell){
  var distances = []
  distances.push(cell[0] + 1);
  distances.push(Math.abs(9 - cell[1]) + 1);
  distances.push(Math.abs(9 - cell[0]) + 1);
  distances.push(cell[1] + 1);
  distances.sort();
  return distances[0];
}

function getPriorityIndex(cell){
  var allDistances = [];
  myGrid.listObstacles().forEach(function(obstacle){
    allDistances.push(Math.abs(cell[0] - obstacle[0]) + Math.abs(cell[1] - obstacle[1]));
  });
  // allDistances.push(minimumDistanceToBoundary(cell));
  allDistances.sort(function(a, b){
    if (a < b) {
      return - 1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
  return allDistances[0];
}

function showIndexValues(){
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      if (getPriorityIndex([i,j]) <= 1){
        $("#" + i + "_" + j).attr("class", "one");
      }
      else if (getPriorityIndex([i,j]) <= 2){
        $("#" + i + "_" + j).attr("class", "two");
      }
      else if (getPriorityIndex([i,j]) <= 3){
        $("#" + i + "_" + j).attr("class", "three");
      }
      else if (getPriorityIndex([i,j]) < 10){
        $("#" + i + "_" + j).attr("class", "fourPlus");
      }
      else {
        $("#" + i + "_" + j).attr("class", "tenPlus");
      }
    }
  }

}
