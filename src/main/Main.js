/** @jsx jsx */

import { jsx } from "@emotion/core";
import Hex from "../game/Hex"

// Main screen.
function Main(props) {
	// Style
	const style = {
		height: "100%",
		color: "gold",
		backgroundImage: "linear-gradient(-45deg, midnightblue, cornflowerblue)",
		display: "flex",
		flexDirection: "column",
		fontSize: (25 * props.data.gameRatio) + "vmin",
		alignItems: "center",
		justifyContent: "center"
	};

	const titleStyle = {
		filter: "drop-shadow(0px 0px 5px black)"
	};
console.log(props.data.gameRatio);
	return (
		<div css={style}>
			<div css={titleStyle}>Hex 3</div>
			<Hex
				type="play"
				css={{ width: "30%" }}
				onClick={() => props.events.play()}></Hex>
		</div>
	);
}

export default Main;