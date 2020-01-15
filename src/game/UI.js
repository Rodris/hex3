/** @jsx jsx */

import { jsx } from "@emotion/core";
import Hex, { HexTypes } from "./Hex"
import { useEffect } from "react";

// Total score.
function ScoreAndMoves(props) {
	// Label style.
	const labelStyle = {
		width: "30%",
		padding: 6
	};

	// Hex style.
	const hexStyle = {
		position: "relative",
		width: "20%"
	};

	// Text style.
	const textStyle = {
		position: "absolute",
		top: 0,
		width: "100%",
		height: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	};

	// Style
	const style = {
		zIndex: 10,
		backgroundImage:  "linear-gradient(0deg, #232323ff, #646464ff)",
		display: "flex",
		padding: 4,
		alignItems: "center",
		fontWeight: "bold",
		color: "gold"
	};

	// Total score and moves.
	const scoreAndMoves = 
		<div css={[style, {...props.style}]}>
			<div css={hexStyle}>
				<Hex></Hex>
				<div css={textStyle}>{ props.gameSession.score }</div>
			</div>
			<div css={labelStyle}>Score</div>
			<div css={[labelStyle, { textAlign: "right" }]}>Moves</div>
			<div css={hexStyle}>
				<Hex></Hex>
				<div css={textStyle}>{ props.gameSession.moves }</div>
			</div>
		</div>

	return scoreAndMoves;
}

// Hexes powers.
function HexesPowers(props) {
	// Effects
	useEffect(() => {
		// Finds scores positions.
		let pos = {};
		Object.values(HexTypes).forEach(ht => {
			let score = document.getElementById(`score_${ht}`);
			pos[ht] = score.getBoundingClientRect();
		});
		
		// Sends scores positions to game controller.
		props.onScoresPositions(pos);
	});

	// Scores hexes.
	const scores = Object.values(HexTypes).map(ht => {
		const elementStyle = {
			padding: 4,
			width: 0,
			flexGrow: 1
		};
		const hexStyle = {
			width: "100%"
		};
		return (
			<div css={elementStyle} key={ht} id={`score_${ht}`}>
				<Hex type={ht} css={hexStyle}></Hex>
			</div>
		);
	})

	// Style
	let uiStyle = {
		display: "flex",
		zIndex: 1,
		backgroundImage:  "linear-gradient(0deg, #232323ff, #646464ff)"
	};

	let ui =
		<div css={uiStyle}>
			{ scores }
		</div>

	return ui;
}

export { ScoreAndMoves, HexesPowers };