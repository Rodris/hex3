/** @jsx jsx */

import { jsx } from "@emotion/core";
import { useState, useEffect } from "react";
import Hex from "../game/Hex";
import Util from "../Util";

// Default ranking.
const defaultRanking = [
	{ score: 100, name: "Rodris" },
	{ score: 90, name: "Anne" },
	{ score: 80, name: "Harry" },
	{ score: 70, name: "Fisch" },
	{ score: 60, name: "Wendy" },
	{ score: 50, name: "Mary" },
	{ score: 40, name: "Phill" },
	{ score: 30, name: "Leah" },
	{ score: 20, name: "Rey" },
	{ score: 10, name: "Noah" }
];

// Ranking screen.
function Ranking(props) {
	// Style
	const style = {
		height: "100%",
		display: "flex",
		flexDirection: "column",
		fontSize: (25 * props.data.gameRatio) + "vmin",
		textAlign: "center",
		overflowY: "auto"
	};

	const titleStyle = {
		filter: "drop-shadow(0px 0px 5px black)",
		marginBottom: 10
	};

	const ratingStyle = {
		position: "relative",
		fontSize: (10 * props.data.gameRatio) + "vmin",
		textAlign: "left",
		margin: "4px 4px",
		padding: "4px 10px",
		borderRadius: 15,
		backgroundImage: `linear-gradient(45deg, ${Util.colors.bg2}, transparent)`,
		filter: "drop-shadow(0px 0px 5px black)"
	};

	const inputStyle = {
		width: "75%",
		color: Util.colors.fontColor,
		border: "none",
		backgroundColor: "transparent",
		fontSize: (10 * props.data.gameRatio) + "vmin"
	};

	const hexStyle = {
		position: "absolute",
		top: 0,
		right: 8,
		width: 0.17 * props.data.minSize
	};

	const scoreStyle = {
		...hexStyle,
		top: 13,
		textAlign: "center",
		fontSize: (6 * props.data.gameRatio) + "vmin"
	};

	const hexButtonStyle = {
		width: "20%",
		margin: "auto"
	};

	// Loads saved ranking.
	const [ ranking, setRanking ] = useState(JSON.parse(localStorage.getItem("ranking")) || defaultRanking);

	// Checks if a new score is in ranking.
	let [ newPos ] = useState(ranking.findIndex(rating => rating.score < props.score));

	// Initializes ranking.
	const init = () => {
		if (newPos >= 0) {
			// Adds new rating to the ranking.
			let rating = { score: props.score };
			ranking.splice(newPos, 0, rating);
			ranking.pop();
			setRanking(ranking.slice(0));
		}
	};
	useEffect(init, []);

	// Rating name change handler.
	const onRatingName = (event) => {
		if (newPos >= 0) {
			let rating = ranking[newPos];
			rating.name = event.target.value;
		}
	};

	// Builds ratings.
	const ratings = ranking.map((r, i) => 
		<div css={ratingStyle} key={i}>
			{ i === newPos ? (
				<div><input autoFocus type="text" css={inputStyle} onChange={onRatingName}></input></div>
			) : (
				<div>{ r.name }</div>
			)}
			<Hex css={hexStyle}>ok</Hex>
			<div css={scoreStyle}>{ r.score }</div>
		</div>
	);

	// Confirms ranking.
	const onOk = () => {
		// Checks if a new rating is set.
		if (newPos >= 0) {
			// Saves ranking.
			localStorage.setItem("ranking", JSON.stringify(ranking));
		}

		// Returns to main screen.
		props.events.main();
	};

	return (
		<div css={style}>
			<div css={titleStyle}>Ranking</div>
			{ ratings }
			<div>
				<Hex css={hexButtonStyle} type="back" onClick={onOk}></Hex>
			</div>
		</div>
	);
}

export default Ranking;