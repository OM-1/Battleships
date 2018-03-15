var shipToPlace = {
    // Declaring ship orientation, lengths and position
  orientation: 0,
  lengths: [2, 3, 3, 4, 5],
  position: [],
  //defining number of ships place and the direction they are facing
  shipsPlaced: 0,
  directionList: ["north", "east", "south", "west"],
  //Declaring the names of ships that will be used on the side of the game 
  shipNames: ["Patrol Boat", "Submarine", "Destroyer", "Battleship", "Aircraft Carrier"],
  //Function to change colour of squares where the ship will be as you move the mouse around the board
  updateHighlightOnclicks: function () {
    if (this.shipsPlaced < 5){
      for (var i = 0; i < 10; i++) {
          for (var j = 0; j < 10; j++) {
            //Highlights the squares based on ship length and orientation and removes the highlight when you move the mouse away
          document.getElementById(i + "_" + j).setAttribute("onmouseenter", "highlightCells(" + this.orientation + "," + this.lengths[this.shipsPlaced] + "," + i + ", " + j +")");
          document.getElementById(i + "_" + j).setAttribute("onmouseout", "removeHighlight()");
        }
      }
    }
      //When all ships have been placed highlight the play game button
    else {
      this.disableMouseOvers();
      $("#playGame").attr("class", "redBorder");
    }
  },
  //Disables the highlighting placement of ships function - for use after ships have all been placed
  disableMouseOvers: function(){
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        document.getElementById(i + "_" + j).removeAttribute("onmouseenter");
        document.getElementById(i + "_" + j).removeAttribute("onmouseout");
      }
    }
  },
  //Function to change orientation of the ship
  rotateShip: function(){
    if (this.orientation == 1){
      this.orientation = 0;
    }
    else {
      this.orientation++;
    }
      //Updates the highlight ship placement function to ensure that the squares highlighted are the correct ones
    this.updateHighlightOnclicks();
  }
}
//Main highlight cells function, takes in the inputs orientation, length row and column
function highlightCells(orientation, length, row, column){
    //variable to store the list of cells highlighted
    var listOfCells = "";
    //validation of ship placement - checks if the ship when placed will go outside of the map border 
   if (isPlacementValid([row, column], length, myShips).valid && isPlacementValid([row, column], length, myShips).allValidDirections.includes(shipToPlace.directionList[orientation])) {
       //Function to change the orientation of ships
      switch (orientation) {
          //Selection statements to change the orienation of the ships depending on which direction the ship is facing and is turning to
          //If the statement is valid, it will add to the listOfCells a valid placement
       case 0:
        for (var i = 0; i < length - 1; i++){
          listOfCells += "#" + (row - i) + "_" + column + ", ";
        }
        listOfCells += "#" + (row - length + 1) + "_" + column;
        $(listOfCells).attr("class", "validPlacement");
        $(listOfCells).attr("onclick", "placeShip([" + row + ", " + column + "], " + orientation + ", " + length + ")");
        break;
      case 1:
          for (var i = 0; i < length - 1; i++){
            listOfCells += "#" + row + "_" + (column + i) + ", ";
          }
          listOfCells += "#" + row + "_" + (column + length - 1);
          $(listOfCells).attr("class", "validPlacement");
          $(listOfCells).attr("onclick", "placeShip([" + row + ", " + column + "], " + orientation + ", " + length + ")");
        break;
      case 2:
        for (var i = 0; i < length - 1; i++){
          listOfCells += "#" + (row + i) + "_" + column + ", ";
        }
        listOfCells += "#" + (row + length - 1) + "_" + column;
        $(listOfCells).attr("class", "validPlacement");
        $(listOfCells).attr("onclick", "placeShip([" + row + ", " + column + "], " + orientation + ", " + length + ")");
        break;
      case 3:
        for (var i = 0; i < length - 1; i++){
          listOfCells += "#" + row + "_" + (column - i) + ", ";
        }
        listOfCells += "#" + row + "_" + (column - length + 1);
        $(listOfCells).attr("class", "validPlacement");
        $(listOfCells).attr("onclick", "placeShip([" + row + ", " + column + "], " + orientation + ", " + length + ")");
        break;
    }
  }
    //If the orientation switch is not valid it will display on the side of the screen that the placement is not valid 
   else {
    switch (orientation){
      case 0:
        for (var i = 0; i < length; i++){
          if (!myShipsContain([row - i, column])){
            listOfCells += "#" + (row - i) + "_" + column + ", ";
          }
        }
        listOfCells = removeLastComma(listOfCells);
//This is the statement that adds an attribute called invalid placement
        $(listOfCells).attr("class", "invalidPlacement");
        break;
      case 1:
        for (var i = 0; i < length; i++){
          if (!myShipsContain([row, column + i])){
            listOfCells += "#" + row + "_" + (column + i) + ", ";
          }
        }
        listOfCells = removeLastComma(listOfCells);
        $(listOfCells).attr("class", "invalidPlacement");
        break;
      case 2:
        for (var i = 0; i < length; i++){
          if (!myShipsContain([row + i, column])){
            listOfCells += "#" + (row + i) + "_" + column + ", ";
          }
        }
        listOfCells = removeLastComma(listOfCells);
        $(listOfCells).attr("class", "invalidPlacement");
        break;
      case 3:
        for (var i = 0; i < length; i++){
          if (!myShipsContain([row, column - i])){
            listOfCells += "#" + row + "_" + (column - i) + ", ";
          }
        }
        listOfCells = removeLastComma(listOfCells);
        $(listOfCells).attr("class", "invalidPlacement");
        break;
    }
  }
}
//Function to remove a comma from a string parsed through the function
function removeLastComma(str){
  var newStr = "";
  for (var i = 0; i < str.length - 2; i++){
    newStr += str[i];
  }
  return newStr;
}

// removes validPlacement, invalidPlacement, and onclick from all grid element
function removeHighlight(){
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      $("#" + i + "_" + j).removeClass("validPlacement");
      $("#" + i + "_" + j).removeClass("invalidPlacement");
      $("#" + i + "_" + j).removeAttr("onclick");
    }
  }
}
//Function to add the ship to the map so the player can see the ship they have selected placed and in the correct orientation
function placeShip(aLocation, orientation, length){
  var shipLocations = [];
  switch (orientation){
    case 0:
      for (var i = 0; i < length; i++){
        shipLocations.push([aLocation[0] - i, aLocation[1]]);
      }
      break;
    case 1:
      for (var i = 0; i < length; i++){
        shipLocations.push([aLocation[0], aLocation[1] + i]);
      }
      break;
    case 2:
      for (var i = 0; i < length; i++){
        shipLocations.push([aLocation[0] + i, aLocation[1]]);
      }
      break;
    case 3:
      for (var i = 0; i < length; i++){
        shipLocations.push([aLocation[0], aLocation[1] - i]);
      }
      break;
  }
//Adds The ship's location and length to the myShips variable
  myShips.push(createShip(shipLocations, length));
    //When the ship is placed, the next 2 statements go to the next ship to place and then update the highlighting function so that the correct ship length is displayed on the player's board'
  shipToPlace.shipsPlaced++;
  shipToPlace.updateHighlightOnclicks();
    //Function to update grid state for all cells that have a ship in them
  myShips.forEach(function (ship, i) {
    ship.cellsOccupied.forEach(function(location){
      myGrid.gridState[location[0]][location[1]] = "s";
      document.getElementById(location[0] + "_" + location[1]).setAttribute("class", "ship")
    });
      //assigns the current name for the ship that is being placed
    ship.name = shipToPlace.shipNames[i];
  });
}
//fucntion to decide whether the cell had a ship in it
function myShipsContain(aLocation){
  //Boolean to set if cell has a ship in it (false meaning no ship true meaning ship)
  locationOccupied = false;
  //if ship object contains a location on the board set location occupied to true
  myShips.forEach(function (ship) {
    if (ship.contains(aLocation)){
      locationOccupied = true;
    }
  });
    //the return is used for validation purposes on the board
  return locationOccupied;
}
