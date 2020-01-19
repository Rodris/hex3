/** @jsx jsx */

import { jsx } from "@emotion/core";
import Hex, { HexTypes } from "./Hex"
import { useEffect } from "react";
import Util from "../Util";

const uiBgImage = `linear-gradient(0deg, ${Util.colors.bg1}, ${Util.colors.bg2})`;

// Total score.
function ScoreAndMoves(props) {
	// Label style.
	const labelStyle = {
		padding: 6
	};

	// Hex style.
	const hexStyle = {
		position: "relative",
		width: props.data.landscape ? "100%" : "20%"
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
		width: props.data.landscape ? props.data.uiSize : "100%",
		zIndex: 10,
		backgroundImage: uiBgImage,
		display: "flex",
		flexDirection: props.data.landscape ? "column" : "row",
		padding: 4,
		alignItems: "center",
		fontWeight: "bold"
	};

	// Total score and moves.
	const scoreAndMoves = 
		<div css={[style, {...props.style}]}>
			<div css={hexStyle}>
				<Hex></Hex>
				<div css={textStyle}>{ props.gameSession.score }</div>
			</div>
			<div css={[labelStyle, { flexGrow: 1 }]}>Score</div>
			<div css={labelStyle}>Moves<br />Left</div>
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
		flexDirection: props.data.landscape ? "column" : "row",
		width: props.data.landscape ? props.data.uiSize : "100%",
		zIndex: 1,
		backgroundImage: uiBgImage
	};

	let ui =
		<div css={uiStyle}>
			{ scores }
		</div>

	return ui;
}

export { ScoreAndMoves, HexesPowers };