$(function () {
 /* Function for randomly placing the ships */
    function setupStrategy(board) {
        /*defining the sizes of ships to place*/
        return [5, 4, 3, 3, 2].map(function (size) {
        
        while (1) {
        var blocks = randomBlocks(board, size);
        if (fits(board, blocks)) {
          placeBlocks(board, blocks);
          return blocks;
        }
      }
    });

    function randomBlocks (board, size) {
      var blocks = [[
        _.random(size-1, board.length-1),
        _.random(board[0].length-1)
      ]];
      while (--size) {
        blocks.unshift([blocks[0][0]-1, blocks[0][1]]);
      }
      if (_.random(1)) {
        blocks = blocks.map(function (b) {
          return [b[1], b[0]];
        });
      }
      return blocks;
    }
    
    function fits (board, blocks) {
      return blocks.every(function (b) {
        return !board[b[0]][b[1]];
      });
    }
  
    function placeBlocks (board, blocks) {
      blocks.forEach(function (b) {
        board[b[0]][b[1]] = 1;
      });
    }
  }
  
//AI Strategy
  function playStrategy (guesses, callback) {
    //Call the Random cell function
     callback(randomCell(guesses))
    
   //Defining Random Cell function
    function randomCell (board) {
        return [
          //Chooses a random square within the boundaries of the board
        _.random(guesses.length-1),
        _.random(guesses[0].length-1)
      ];
    }
  }
  //Run the runGame function - this initiates the game
  runGame();
  
  function runGame() {
    //Sets the Width parameter for the board
      var width = 10;
    //Sets the Height parameter for the board
      var height = 10;
    //Creates a new player board with the correct width and height
      var myBoard = emptyBoard(width, height);
    //Creates a new instance of the board for the AI
    var myGuesses = emptyBoard(width, height);
    var oppBoard = emptyBoard(width, height);
    var oppGuesses = emptyBoard(width, height);
    //Places ships randomly on the player board
    ShipSetup(myBoard);
    //Places the ships randomly on the AI board
    ShipSetup(oppBoard);
    //Starts the Turn function
    doTurn(0);

    //Define the Ship Setup function
    function ShipSetup (board) {
      var pieces = setupStrategy(emptyBoard(width, height));
      
      pieces = _.sortBy(pieces, 'length');
      ['A', 'B', 'C', 'D', 'E'].forEach(function (name, i) {
        placeBlocks(board, pieces[i], name);
      });
    }
    
    function placeBlocks (board, blocks, value) {
      value = value || 1;
      blocks.forEach(function (b) {
        board[b[0]][b[1]] = value;
      });
    }
    
    function doTurn (turn) {
      render();
      if (turn % 2) {
        playStrategy(oppGuesses, function (guess) {
          var correct = !!cellValue(myBoard, guess);
          placeBlocks(oppGuesses, [guess], correct ? 'H' : 'M');
          doTurn(turn+1);
        });
      } else {
        manualInputStrategy(myGuesses, function (guess) {
          var correct = !!cellValue(oppBoard, guess);
          placeBlocks(myGuesses, [guess], correct ? 'H' : 'M');
          doTurn(turn+1);
        });
      }
    }
  
    function render () {
      $('#playerboard').empty().append(renderBoard(myBoard, oppGuesses));
      $('#aiboard').empty().append(renderBoard(myGuesses));
    }
  
    function verifyPieces (pieces) {
      var sizes = pieces.map(function (p) {
        return p.length;
      }).sort();
      // todo make sure pieces are contiguous and within bounds
      return _.isEqual(sizes, [5, 4, 3, 3, 2]);
    }
    
    function manualInputStrategy (guesses, callback) {
      $('#aiboard').one('click', 'td', function () {
        callback($(this).data('position'));
      });
    }
    
    function cellValue (board, cell) {
      return board[cell[0]][cell[1]];
    }
    
    function emptyBoard (width, height) {
      return Array.apply(null, {length: height}).map(function() {
        return Array.apply(null, {length: width})
      });
    }

    function renderBoard (board, guesses) {
      return $('<tbody>').append(board.map(function (row, r) {
        return $('<tr>').append(row.map(function (cell, c) {
          return $('<td>').append(
            $('<div>').text(cell)
          ).data('position', [r, c])
          .toggleClass('correct', cellValue(guesses || board, [r, c]) === 'H')
          .toggleClass('incorrect', cellValue(guesses || board, [r, c]) === 'M');
        }));
      }));
    }
  }
});