/** @jsx jsx */

import { jsx } from "@emotion/core";
import { ScoreAndMoves, HexesPowers } from './UI';
import Board from './Board';
import { useState } from "react";

function Game(props) {
	// Game state.
	let [ gameSession, setGameSession ] = useState({ score: 0, moves: 20 });
	let [ gameOver, setGameOver ] = useState(false);

	// Board events.
	const boardEvents = {
		// Handles move event.
		onMove: () => {
			// Updates game state.
			gameSession.moves--;
			setGameSession({ score: gameSession.score, moves: gameSession.moves });
			setGameOver(gameSession.moves === 0);
		},

		// Handles match event.
		onMatch: (pointsEarned) => {
			// Updates game state.
			setGameSession({ score: gameSession.score + pointsEarned, moves: gameSession.moves });
		},

		// Handles game over event.
		onGameOver: () => {
			// Dispatches event to app.
			props.events.ranking(gameSession.score);
		}
	};

	let scoresPositions = [];

	// Style
	const style = {
		height: "100%",
		display: "flex",
		flexDirection: props.data.landscape ? "row" : "column"
	};

	// Board bg style.
	const bgStyle = {
		display: "flex",
		flexDirection: props.data.landscape ? "row" : "column",
		flexGrow: 1,
		width: props.boardSize,
		pointerEvents: (gameSession.moves > 0) ? "all" : "none"
	};

	return (
		<div className="Game" css={style}>
			<ScoreAndMoves data={props.data} gameSession={gameSession}></ScoreAndMoves>
			<HexesPowers data={props.data} onScoresPositions={(pos) => scoresPositions = pos}></HexesPowers>
			<div css={bgStyle}>
				<div className="filler"></div>
				<Board
					data={props.data}
					gameOver={gameOver}
					getScoresPositions={() => scoresPositions}
					events={boardEvents}></Board>
				<div className="filler"></div>
			</div>
		</div>
  	);
}

export default Game;
