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

	const hexStyle = {
		width: "30%"
	}

	return (
		<div css={style}>
			<div css={titleStyle}>Hex 3</div>
			<Hex type="play" css={hexStyle} onClick={() => props.events.play()}></Hex>
			<Hex type="ranking" css={hexStyle} onClick={() => props.events.ranking()}></Hex>
		</div>
	);
}

export default Main;