/** @jsx jsx */

import { jsx, css, keyframes } from "@emotion/core";
import HexUtil from "./HexUtil"
import Hex, { HexTypesArray, HexTypes } from "./Hex"
import bg from "./board.svg"
import { useState, useEffect } from "react";
import Util from "../Util";

/**
 * State machine:
 * Init -> Ready
 * Ready -> (match) ? Match : Unmatch
 * Unmatch -> Ready
 * Match -> Explosion
 * Explosion -> Fall
 * Fall -> (match) ? Match : Ready
 */
const
	GS_INIT = "init",
	GS_READY = "ready",
	GS_UNMATCH = "unmatch",
	GS_MATCH = "match",
	GS_EXPLOSION = "explosion",
	GS_FALL = "fall",
	GS_OVER = "over";

// Constants
const
	noHex = { x: -1, y: -1, type: "none" },
	leftIni = 10,
	topIni = -14,
	leftOffset = 11,
	topOffset = 6.5;

// Declarations
let typesBuffer = [];

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
			board[x][y].fallFrom = { x: x, y: y - (gridSize + 3) };
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

// Hex board.
function Board(props) {
	// State
	let [ gameState, setGameState ] = useState(GS_INIT);
	let [ slots, setSlots ] = useState(null);
	let [ selectedHex, setSelectedHex ] = useState(noHex);
	let [ matches, setMatches ] = useState([]);
	let [ hexes ] = useState(init());
	let qtdAnimations = 0;

	// Traverses all hexes in board.
	const forHex = (onHex) => {
		for (let x = 0; x < hexes.length; x++) {
			for (let y = hexes.length - 1; y >= 0; y--) {
				// Ignores hexes out of the board.
				if (!hexes[x][y].type) continue;

				// Apply to hex.
				onHex(hexes[x][y], x, y);
			}
		}
	};

	// Calculates the position of an hex.
	const calcPos = (hex, unit = "%") => {
		return {
			left: (leftIni + hex.x * leftOffset) + unit,
			top: (topIni + hex.x * topOffset + hex.y * 2 * topOffset) + unit
		}
	};

	// Builds the initial animation for an hex.
	const buildAnimationInit = (hex) => {
		const pos1 = calcPos(hex.fallFrom);
		const pos2 = calcPos(hex);
		const anim = keyframes({
			from: pos1,
			to: pos2
		});

		const bottomPos = ((hexes.length >> 1) + (hexes.length - 1) * 2);
		const hexPos = (hex.x + hex.y * 2);
		let animationDuration = 1 + (hex.y - hex.fallFrom.y) / hexes.length - hexPos / bottomPos;
		if (hex.y > hexes.length) {
			animationDuration += 2;
		}

		return `${anim} ${animationDuration}s ease`;
	};

	// Builds the unmatch animation for an hex.
	const buildAnimationUnmatch = (hex) => {
		const pos1 = calcPos(hex);
		const pos2 = calcPos(hex.target);
		const anim = keyframes`
			from, to { ${pos1} }
			50% { ${pos2} }
		`;

		return `${anim} 0.5s ease`;
	};

	// Builds the match animation for an hex.
	const buildAnimationMatch = (hex) => {
		const pos1 = calcPos(hex);
		const pos2 = calcPos(hex.target);
		const anim = keyframes`
			from { ${pos2} }
			to { ${pos1} }
		`;

		return `${anim} 0.25s ease`;
	};

	// Builds the explosion animation for an hex.
	const buildAnimationExplosion = (hex) => {
		// Calculates destination position.
		const boardRect = document.getElementById("board").getBoundingClientRect();
		const hexRect = document.getElementById(hex.x + "_" + hex.y).getBoundingClientRect();
		const scoreRect = props.getScoresPositions()[hex.type];
		const dest = {
			left: Math.round(100 * (scoreRect.x - boardRect.x + (scoreRect.width - hexRect.width) / 2) / boardRect.width) + "%",
			top: Math.round(100 * (scoreRect.y - boardRect.y + (scoreRect.width - hexRect.height) / 2) / boardRect.height) + "%"
		};

		// Calculates explosion destination.
		const pos1 = calcPos(hex, 0);
		const pos2 = calcPos(hex.target, 0);
		pos2.left = pos1.left + 0.3 * (pos1.left - pos2.left) + "%";
		pos2.top = pos1.top + 0.3 * (pos1.top - pos2.top) + "%";
		pos1.left += "%";
		pos1.top += "%";

		// Builds animation.
		const anim = keyframes`
			from { ${pos1} }
			30% { ${pos2} }
			to { ${dest} }
		`;

		return `${anim} 1.2s ease`;
	};

	// Builds the over animation for an hex.
	const buildAnimationOver = (hex) => {
		// Calculates positions.
		hex.fallFrom = { x: hex.x, y: hex.y };
		hex.y += 2 * hexes.length;

		return buildAnimationInit(hex);
	};

	// Builds the animation for an hex.
	const buildAnimation = (hex) => {
		// Declarations
		let animation;

		// Checks hex state.
		switch (hex.state) {
			case GS_INIT: animation = buildAnimationInit(hex); break;
			case GS_UNMATCH: animation = buildAnimationUnmatch(hex); break;
			case GS_MATCH: animation = buildAnimationMatch(hex); break;
			case GS_EXPLOSION: animation = buildAnimationExplosion(hex); break;
			case GS_FALL: animation = buildAnimationInit(hex); break;
			case GS_OVER: animation = buildAnimationOver(hex); break;
			default: return;
		}

		// One more animation.
		qtdAnimations++;

		return animation;
	}

	// Handles animation end event.
	const onAnimationEnd = (hex) => {
		// Checks if hex is over.
		 if (hex.state === GS_OVER) {
			// Removes it from board.
			delete hex.type;
		}

		// One less animation.
		qtdAnimations--;

		// Checks if there are more active animations.
		if (qtdAnimations > 0) return;

		// Resets all animations.
		clearHexesStates();

		// Checks if it was the explosion or unmatch animation.
		if (gameState === GS_EXPLOSION || gameState === GS_UNMATCH) {
			// Earn points.
			let pointsEarned = matches.reduce((total, match) => total + match.length, 0);

			// Dispatches match event.
			props.events.onMatch(pointsEarned);

			// Checks if it was the explosion animation.
			if (gameState === GS_EXPLOSION) {
				// Update to fall state.
				setGameState(GS_FALL);

				// Removes exploded hexes from board.
				let explodedHexes = [];
				matches.forEach(match => {
					match.forEach(hex => {
						hexes[hex.x][hex.y] = noHex;
						if (explodedHexes.indexOf(hex) === -1) {
							explodedHexes.push(hex);
						}
					})
				})

				// Start the fall animation.
				forHex((hex, x, y) => {
					// Checks if slot is empty.
					if (hex === noHex) {
						// Brings an hex down.
						let yUp = y - 1;
						let hexToFall = hexes[x][yUp];

						// Finds a non empty hex.
						while (hexToFall && hexToFall.type && hexToFall === noHex) {
							yUp--;
							hexToFall = hexes[x][yUp];
						}

						// Checks if no hexes were available in column.
						if (!hexToFall || !hexToFall.type) {
							// Adds a new hex from the ones that exploded.
							hexToFall = explodedHexes.pop();
							hexToFall.fallFrom = { x: x, y: y - hexes.length - 1 }
							hexToFall.type = Util.randomValue(HexTypesArray);
						} else {
							// Move hex down.
							hexToFall.fallFrom = { x: hexToFall.x, y: hexToFall.y }
							hexes[x][hexToFall.y] = noHex;
						}

						// Adds the fall animation to the hex.
						hexes[x][y] = hexToFall;
						hexToFall.x = x;
						hexToFall.y = y;
						hexToFall.state = GS_FALL;
						buildAnimation(hexToFall);
					}
				});
			} else {
				// Game ready.
				setGameReady();
			}
		}

		// Checks if it was the match or fall animation.
		else if (gameState === GS_MATCH) {
			// Starts explosion.
			setExplosionState();
		}

		// Checks if it was the fall animation.
		else if (gameState === GS_FALL) {
			// Looks for new matches.
			matches = HexUtil.findMatches(hexes); 
			setMatches(matches);

			// Any?
			if (matches.length > 0) {
				// Starts explosion.
				setExplosionState();
			} else {
				// Game ready.
				setGameReady();
			}
		}
		// Checks if it was the game over animation.
		else if (gameState === GS_OVER) {
			// Distaches event to game.
			props.events.onGameOver();
		}
	};

	// Sets game ready state.
	const setGameReady = () => {
		// Checks if game is over.
		if (props.gameOver) {
			// Starts over animation.
			forHex(hex => {
				// Over state for hex.
				hex.state = GS_OVER;
			});

			// Game over.
			setGameState(GS_OVER);

			// Writes game over on board.
			buildSlots(true);

		} else {
			// Game ready.
			setGameState(GS_READY);
		}
	};

	// Sets the explosion state.
	const setExplosionState = () => {
		// Sets game state.
		setGameState(GS_EXPLOSION);

		// Starts explosion animation.
		matches.forEach(match => {
			// Calculates center of explosion, with a little random noise.
			let explosionCenter = match.reduce((total, hex) => ({ x: total.x + hex.x, y: total.y + hex.y }), noHex);
			explosionCenter.x = explosionCenter.x / match.length + 0.5 * Math.random();
			explosionCenter.y = explosionCenter.y / match.length + 0.5 * Math.random();

			// Setups hexes.
			match.forEach(hex => {
				hex.state = GS_EXPLOSION;
				hex.target = explosionCenter;
			})
		});
	};

	// Clears hexes states.
	const clearHexesStates = () => {
		hexes.forEach(hexesX => {
			hexesX.forEach(hex => {
				delete hex.state;
			})
		})
	};

	// Builds hexes slots.
	const buildSlots = (gameOver = false) => {
		// Initializations
		let newSlots = [];

		forHex((hex, x, y) => {
			// Position style for slots and hexes.
			let posStyle = calcPos(hex);
			posStyle.position = "absolute";
			posStyle.width = "14%";

			let letter = "";
			if (gameOver) {
				if (x === 2 && y === 2) letter = "G";
				if (x === 3 && y === 2) letter = "A";
				if (x === 4 && y === 2) letter = "M";
				if (x === 5 && y === 2) letter = "E";
				if (x === 1 && y === 4) letter = "O";
				if (x === 2 && y === 4) letter = "V";
				if (x === 3 && y === 4) letter = "E";
				if (x === 4 && y === 4) letter = "R";
			}

			// Slots
			newSlots.push(<Hex data={props.data} letter={letter} css={posStyle} key={"s_" + hex.x + "_" + hex.y} />);
		});

		setSlots(newSlots);
	};
	useEffect(buildSlots, []);

	// Builds hexes.
	let hexesItems = [];

	forHex(hex => {
		// Buids hex animation.
		let anim = buildAnimation(hex);

		// Position style for slots and hexes.
		let hexStyle = calcPos(hex);
		hexStyle.position = "absolute";
		hexStyle.width = "14%";
		hexStyle.zIndex =  hex.state === GS_EXPLOSION ? 1 : 0;

		// Hexes
		let hexItem = <Hex
			data={props.data}
			css={hexStyle}
			type={hex.type}
			selected={hex.x === selectedHex.x && hex.y === selectedHex.y}
			animation={anim}
			id={hex.x + "_" + hex.y}
			key={hex.x + "_" + hex.y}
			onClick={() => onClickHex(hex)}
			onAnimationEnd={() => onAnimationEnd(hex)} />

		hexesItems.push(hexItem);
	});

	// Handles hex click events.
	let onClickHex = (hex) => {
		// Checks if clicked hex is far away.
		if (!HexUtil.getDirection(selectedHex, hex)) {
			// New selection.
			setSelectedHex(hex);
			return;
		}

		// Dispatches move event.
		props.events.onMove();

		// Switches types and looks for a matches.
		let type = hex.type;
		hex.type = selectedHex.type;
		selectedHex.type = type;
		matches = HexUtil.findMatches(hexes); 
		setMatches(matches); 

		// Makes hexes reference each other.
		hex.target = selectedHex;
		selectedHex.target = hex;

		// No matches?
		if (matches.length === 0) {
			// Restores types.
			selectedHex.type = hex.type;
			hex.type = type;

			// Sets unmatch animation.
			setGameState(GS_UNMATCH);
			selectedHex.state = hex.state = GS_UNMATCH;
			
		} else {
			// Sets match animation.
			setGameState(GS_MATCH);
			selectedHex.state = hex.state = GS_MATCH;
		}

		// Resets selection.
		setSelectedHex(noHex);
	};

	// Board style
	let style = css({
		position: "relative",
		width: props.data.boardSize,
		height: props.data.boardSize,
		backgroundImage: `URL(${bg})`,
		backgroundSize: "contain"
	});

	// Builds board.
	let board =
		<div css={style} id="board">
			{ slots }
			{ hexesItems }
		</div>

	return board;
}

export default Board;