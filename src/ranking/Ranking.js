/** @jsx jsx */

import { jsx } from "@emotion/core";
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
	// Tries to load saved ranking.
	let savedRanking = JSON.parse(localStorage.getItem("ranking"));

	// State
	//const [ ranking, setRanking ] = useState(savedRanking || defaultRanking);
	let ranking = (savedRanking || defaultRanking);
	let rating = { score: props.score, new: true };

	// Checks if a new score is in ranking.
	let newPos = ranking.findIndex(rating => rating.score < props.score);

	if (newPos >= 0) {
		// Adds new rating to the ranking.
		ranking.splice(newPos, 0, rating);
		ranking.pop();
	}

	// Updates rating name.
	const onRatingName = (event) => {
		rating.name = event.target.value;
	};

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
		top: 3,
		right: 8,
		width: "17%"
	};

	const scoreStyle = {
		position: "absolute",
		top: 16,
		right: 8,
		width: "17%",
		textAlign: "center",
		fontSize: (6 * props.data.gameRatio) + "vmin"
	};

	const hexButtonStyle = {
		width: "20%",
		margin: "auto"
	};

	// Builds ratings.
	const ratings = ranking.map((rating, i) => 
		<div css={ratingStyle} key={i}>
			{ rating.new ? (
				<div><input autoFocus type="text" css={inputStyle} onChange={onRatingName}></input></div>
			) : (
				<div>{ rating.name }</div>
			)}
			<Hex css={hexStyle}>ok</Hex>
			<div css={scoreStyle}>{ rating.score }</div>
		</div>
	);

	// Confirms ranking.
	const onOk = () => {
		// Updates ranking.
		if (rating.name) {
			delete rating.new;
		}
		//setRanking(ranking.slice(0));
		localStorage.setItem("ranking", JSON.stringify(ranking));

		// Returns to main scree.
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