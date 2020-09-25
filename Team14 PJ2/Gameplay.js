/**
 * @class
 */
class Gameplay {
	/**
	* @description Manages the boards and user interaction during gameplay (ship placement and attacking)
	* @param rows {number} The number of rows the boards have
	* @param cols {number} The number of columns the boards have
	* @param numShips {number} The number of ships each player has
	**/
	constructor(rows, cols, numShip) {
		/*
		 * @member turn {boolean} Which player's turn it is - false is board0 (left) and true is board1 (right)
		 * @member isSetup {boolean} Whether the ship placement phase of gameplay has been completed
		 * @member board0 {Board} Player false's board
		 * @member board1 {Board} Player true's board
		 * @member numShipsPlaced {number} How many ships the current player has placed so far during setup
		 * @member isVertical {boolean} Whether the ship is vertical or horizontal during ship placement
		 */
		this.rows = rows;
		this.cols = cols;
		this.numShips = numShip;

		this.turn = false;
		this.isSetup = false;
		this.numShipsPlaced = 0;

		this.board0 = new Board(rows, cols, this.numShips);
		this.board1 = new Board(rows, cols, this.numShips);
		this.renderBoards(false);
		
		this.isVertical = false;
		for (let radio of document.getElementsByName("dir")) {
			radio.addEventListener("change", e => {
				if (e.target.checked) this.isVertical = e.target.value == "true";
			});
		}
		
		this.msg(this.playerName(this.turn) + " place your " + this.numShips + " ship");

		document.getElementById("switch-turn").addEventListener("click", e => {
			if (this.isSetup) {
				this.msg("Switching turn...");
				this.blankBoards();
				document.getElementById("switch-turn").style.display = "none";
				let modal = document.getElementById("modal");
				modal.style.display = "block";
				let time = 5;
				document.getElementById("turn-switch-time").innerText = time;
				this.turnTimer = setInterval(() => {
					time--;
					document.getElementById("turn-switch-time").innerText = time;
					if (time <= 0) this.switchTurns();
				}, 1000);
			}
			else { // Switch to second player placing their ships
				this.numShipsPlaced = 0;
				this.turn = true;
				document.getElementById("switch-turn").style.display = "none";
				document.getElementById("dir-container").style.display = "";
				this.renderBoards(false);
				this.msg(this.playerName(this.turn) + " place your " + this.numShips + " ship");
			}
		});
		
		document.getElementById("switch-now").addEventListener("click", e => this.switchTurns());
		
		// Future enhancement: Reset the game properly so player names can be kept
		document.getElementById("play-again").addEventListener("click", e => window.location.reload());
	}

	/**
	* @description Sets up the next player's turn by hiding the turn switch modal and displaying their ships
	**/
	switchTurns() {
		modal.style.display = "none";
		this.turn = !this.turn;
		this.renderBoards(false);
		clearInterval(this.turnTimer);
		this.msg("It's " + this.playerName(this.turn) + "'s turn. Attack a space on " + this.playerName(!this.turn) + "'s board.");
	}

	/**
	* @description Render the boards, hides the ships on both boards, for use during turn switching
	**/
	blankBoards() {
		this.board0.render(document.getElementById("board0"), this, false, true);
		this.board1.render(document.getElementById("board1"), this, false, true);
	}

	/**
	* @description Render the boards, only showing ships on the current player's board
	* @parameter {boolean} preventClicking Whether to not setup the clickSpace listener on each cell
	**/
	renderBoards(preventClicking) {
		this.board0.render(document.getElementById("board0"), this, !this.turn, preventClicking);
		this.board1.render(document.getElementById("board1"), this, this.turn, preventClicking);
	}

	/**
	* @description Render the boards, showing ships on both boards, and display a victory message
	**/
	gameEnd() {
		this.msg(this.playerName(this.turn) + " wins!!!");
		this.board0.render(document.getElementById("board0"), this, true, true);
		this.board1.render(document.getElementById("board1"), this, true, true);
		document.getElementById("switch-turn").style.display = "none";
		document.getElementById("play-again").style.display = "";
	}
	
	/**
	* @description Handles a space being clicked on either board
	* @param {Space} cell The Space object that was clicked
	* @param {boolean} isCurrentPlayer Whether the board that was clicked belongs to the player whose turn it currently is
	**/


	/**change by T14**/
	/**change by T14**/
	clickSpace(cell, isCurrentPlayer) {
		var explosionEffect;
		explosionEffect = new sound("Explosion1.wav");
		var winnerEffect;
		let modNumShips = 0;
		if(this.numShips==1)
		{
			modNumShips=1;
		}
		if(this.numShips==2)
		{
			modNumShips=3;
		}
		if(this.numShips==3)
		{
			modNumShips=6;
		}
		if(this.numShips==4)
		{
			modNumShips=10;
		}
		if(this.numShips==5)
		{
			modNumShips=15;
		}
		winnerEffect= new sound ("Win.mp3");
		if (this.isSetup) {
			if (!isCurrentPlayer && !cell.isHit) {
				cell.isHit = true;
				if (cell.hasShip) {
					let board = this.turn ? this.board0 : this.board1;
					/**scoreBoard**/
					this.scoreBoard();
					explosionEffect.play()
					this.msg("Hit!");
					board.shipSpaces--;
					if (board.checkWin()){
						winnerEffect.play();
						let m = modNumShips-this.board0.get_shipSpace();

						let n = modNumShips-this.board1.get_shipSpace();
					
						this.gameEnd();
					}
					else {
						this.renderBoards(true);
						document.getElementById("switch-turn").style.display = "";
					}
				}
				else {
					this.renderBoards(true);
					document.getElementById("switch-turn").style.display = "";
					this.msg("Miss.")
				}
			}

			var m = modNumShips-this.board0.get_shipSpace();
			// this.msg(m);

			var n = modNumShips-this.board1.get_shipSpace();
			// this.msg(n);
			this.scoreBoard(m,n)
		}

		else if (isCurrentPlayer) { // During setup phase, you click your own board
			this.newShip(cell);
		}
	}
	/**change by T14**/
	/**change by T14**/



	/**
	* @description Places a new ship on the current player's board
	* @param cell {Space} The space the user clicked on, which will be the top/left end of the new ship
	**/
	newShip(cell) {
		let board = this.turn ? this.board1 : this.board0;
		let shipLength = this.numShips - this.numShipsPlaced;
		let placedShip = board.placeShip(shipLength, cell.row, cell.col, this.isVertical);
		if (placedShip !== true) { // Failed to place ship in a valid location
			this.msg(placedShip);
			this.renderBoards(false);
		}
		else if (++this.numShipsPlaced < this.numShips) { // Placed successfully and still more ships to place
			this.msg(this.playerName(this.turn) + " place your " + (shipLength-1) + " ship");
			this.renderBoards(false);
		}
		else { // Last ship placed
			this.msg("Ship placement complete");
			this.renderBoards(true);
			document.getElementById("dir-container").style.display = "none";
			document.getElementById("switch-turn").style.display = "";
			if (this.board0.ships.length == this.board1.ships.length) { // Both players have placed their ships
				this.isSetup = true;
			}
		}
	}

	/**change by T14**/
	/**change by T14**/
	scoreBoard(m,n){
		document.getElementById("scoreboards").style.display = "";
		document.getElementById("player0-score").innerHTML = n;
		document.getElementById("player1-score").innerHTML = m;
		// return document.getElementById("scoreboards").innerHTML;
	}
	/**change by T14**/
	/**change by T14**/


	/**
	* @description Display a message to the current player
	**/
	msg(message) {
		document.getElementById("message").innerHTML = message;
	}
	
	/**
	* @param player {boolean} Which player to get the name of
	* @return {string} The name of the specified player
	**/
	playerName(player) {
		return document.getElementById("player" + (player ? "1" : "0") + "-name").value;
	}

}
