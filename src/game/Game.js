/** @jsx jsx */

import { css, jsx } from "@emotion/core"
import { ScoreAndMoves, HexesPowers } from './UI';
import Board from './Board';
import { HexTypes } from "./Hex"
import HexUtil from "./HexUtil";
import { useState } from "react";
import Util from "../Util";

function Game() {
	// Declarations
	let typesBuffer = [];

	// Game state.
	let [ gameSession, setGameSession ] = useState({ score: 0, moves: 20 });

	// Board events.
	const boardEvents = {
		// Handles move event.
		onMove: () => {
			// Updates game state.
			setGameSession({ score: gameSession.score, moves: gameSession.moves - 1 });
		},

		// Handles match event.
		onMatch: (pointsEarned) => {
			// Updates game state.
			setGameSession({ score: gameSession.score + pointsEarned, moves: gameSession.moves });
		}
	};

	// Returns a type from the type buffer.
	const getType = () => {
		// Keeps the buffer with a minimum size.
		while (typesBuffer.length <= 5) typesBuffer = typesBuffer.concat(Object.values(HexTypes));

		// Selects a random type.
		return typesBuffer.splice(Util.randomIndex(typesBuffer), 1)[0];
	};

	// Inits a new game.
	const init = () => {
		// Builds board.
		const gridSize = 7;
		let board = [];
		for (let x = 0; x < gridSize; x++) {
			board.push([]);
			for (let y = 0; y < gridSize; y++) {
				// Checks if hex is out of the board.
				if ((x**2 + y**2 <= 4) || ((gridSize - x - 1)**2 + (gridSize - y - 1)**2 <= 4)) {
					board[x][y] = { x: x, y: y };
					continue;
				}

				// Game board.
				board[x][y] = { x: x, y: y, type: getType(), state: "init" };
			}
		}

		// Undoes matches.
		let matches = HexUtil.findMatches(board);
		let totalCount = 100;
		while (matches.length > 0 && totalCount > 0) {
			// Replaces some types.
			matches.forEach(match => {
				match[Util.randomIndex(match)].type = getType();
			});

			// Checks for new matches.
			matches = HexUtil.findMatches(board);
			totalCount--;
		}

		return board;
	};

	let [ board ] = useState(init());
	let scoresPositions = [];

	// Retrieves viewport dimensions.
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	// Style
	const style = css({
		height: "100%",
		display: "flex",
		flexDirection: "column"
	});

	return (
		<div className="Game" css={style}>
			<div style={{flexGrow: 1}}></div>
			<ScoreAndMoves gameSession={gameSession}></ScoreAndMoves>
			<HexesPowers onScoresPositions={(pos) => scoresPositions = pos}></HexesPowers>
			<Board hexes={board} getScoresPositions={() => scoresPositions} events={boardEvents}></Board>
		</div>
  	);
}

export default Game;
