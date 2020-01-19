/** @jsx jsx */

import { jsx } from "@emotion/core";
import Hex from "../game/Hex"

// Main screen.
function Main(props) {
	// Style
	const style = {
		height: "100%",
		display: "flex",
		flexDirection: "column",
		fontSize: (25 * props.data.gameRatio) + "vmin",
		alignItems: "center",
		justifyContent: "center"
	};

	const titleStyle = {
		filter: "drop-shadow(0px 0px 5px black)"
	};

	const buttonsStyle = {
		width: "100%",
		display: "flex"
	};

	const hexStyle = {
		width: 0.35 * Math.min(props.data.gameWidth, props.data.gameHeight)
	}

	let buttons = [
		<Hex type="play" css={hexStyle} onClick={() => props.events.play()} key="0"></Hex>,
		<Hex type="ranking" css={hexStyle} onClick={() => props.events.ranking()} key="1"></Hex>
	];

	if (props.data.landscape) {
		buttons = 
			<div css={buttonsStyle}>
				<div className="filler"></div>
					{ buttons }
				<div className="filler"></div>
			</div>
	}

	return (
		<div css={style}>
			<div css={titleStyle}>Hex 3</div>
			{ buttons }
		</div>
	);
}

export default Main;