/** @jsx jsx */

import { jsx } from "@emotion/core"
import Main from './main/Main';
import Game from './game/Game';
import { useState } from "react";
import Ranking from "./ranking/Ranking";
import Util from "./Util";

// Retrieves viewport dimensions.
const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

// App data.
let data = {};
data.boardSize = Math.min(500, w, h);
data.gameRatio = data.boardSize / Math.min(w, h)

// App style.
const style = {
	maxWidth: 500,
	maxHeight: 800,
	height: "100%",
	margin: "auto",
	overflow: "hidden",
	color: Util.colors.fontColor,
	backgroundImage: `linear-gradient(-45deg, ${Util.colors.bg1}, ${Util.colors.bg2})`
};

function App() {
	// Available app states.
	const
		AS_MAIN = "main",
		AS_GAME = "game",
		AS_RANK = "ranking";

	// Current app state.
	let [ state, setState ] = useState(AS_MAIN);
	let [ score, setScore ] = useState(0);
	let appContent;

	// App events.
	const events = {
		// Enters main screen.
		main: () => {
			setState(AS_MAIN);
		},

		// Starts a game.
		play: () => {
			setState(AS_GAME);
		},

		// Shows ranking screen.
		ranking: (newScore) => {
			setScore(newScore);
			setState(AS_RANK);
		}
	};

	switch (state) {
		case AS_MAIN: appContent = <Main events={events} data={data}></Main>; break;
		case AS_GAME: appContent = <Game events={events} data={data}></Game>; break;
		case AS_RANK: appContent = <Ranking events={events} data={data} score={score}></Ranking>; break;
		default: break;
	}

	return (
		<div className="App" css={style}>
			{ appContent }
		</div>
  	);
}

export default App;
