// Util functions for hexagon calculations.
const HexUtil = {
	// Directions
	N: "N",
	NE: "NE",
	SE: "SE",
	S: "S",
	SW: "SW",
	NW: "NW",

	// Returns the direction between two hexes.
	getDirection: function(hexFrom, hexTo) {
		// Same column.
		if (hexFrom.x === hexTo.x) {
			// Checks if they are close.
			if (hexFrom.y === hexTo.y + 1) return HexUtil.N;
			if (hexFrom.y === hexTo.y - 1) return HexUtil.S;

		} else if (hexFrom.x === hexTo.x - 1) {
			if (hexFrom.y === hexTo.y) return HexUtil.SE;
			if (hexFrom.y === hexTo.y + 1) return HexUtil.NE;

		} else if (hexFrom.x === hexTo.x + 1) {
			if (hexFrom.y === hexTo.y) return HexUtil.NW;
			if (hexFrom.y === hexTo.y - 1) return HexUtil.SW;
		}

		return null;
	},

	// Returns an adjacent hex from a given direction.
	getHex: (board, x, y, direction) => {
		// Returns an hex from the board.
		const getHex = (x, y) => {
			return board[x] ? board[x][y] : null;
		};

		// Calculates the destination position.
		let toHex;
		switch (direction) {
			case HexUtil.N: toHex = getHex(x, y-1); break;
			case HexUtil.NE: toHex = getHex(x+1, y-1); break;
			case HexUtil.NW: toHex = getHex(x-1, y); break;
			case HexUtil.S: toHex = getHex(x, y+1); break;
			case HexUtil.SE: toHex = getHex(x+1, y); break;
			case HexUtil.SW: toHex = getHex(x-1, y+1); break;
			default: toHex = null; break;
		}

		return toHex;
	},

	// Finds the matches in a board in a given direction.
	findMatchesFor: (board, hex, direction) => {
		// Declarations
		let matches = [];
		let match;

		// Finds first valid hex.
		while (hex && !hex.type) hex = HexUtil.getHex(board, hex.x, hex.y, direction);

		// Validates hex.
		if (!hex) return [];

		// Adds first hex to match.
		match = [hex];

		// Get next hex.
		hex = HexUtil.getHex(board, hex.x, hex.y, direction);
		while (hex && hex.type) {
			// Checks if this hex type matches the type of the match.
			if (hex.type === match[0].type) {
				// Adds new hex to the current match.
				match.push(hex);

				// Check if match is valid.
				if (match.length === 3) matches.push(match);

			} else {
				// Starts a new possible match.
				match = [hex];
			}

			// Next hex.
			hex = HexUtil.getHex(board, hex.x, hex.y, direction);
		}
		
		return matches;
	},

	// Finds the matches in a board.
	findMatches: (board) => {
		// Declarations
		let matches = [];

		// Searches matches for south direction.
		for (let x = 0; x < board.length; x++) {
			matches = matches.concat(HexUtil.findMatchesFor(board, board[x][0], HexUtil.S));
		}

		// Searches matches for southeast direction.
		for (let y = 0; y < board.length; y++) {
			matches = matches.concat(HexUtil.findMatchesFor(board, board[0][y], HexUtil.SE));
		}

		// Searches matches for southwest direction.
		for (let x = 0; x < board.length; x++) {
			matches = matches.concat(HexUtil.findMatchesFor(board, board[x][0], HexUtil.SW));
		}
		for (let y = 1; y < board.length; y++) {
			matches = matches.concat(HexUtil.findMatchesFor(board, board[board.length - 1][y], HexUtil.SW));
		}

		return matches;
	}
};

export default HexUtil;