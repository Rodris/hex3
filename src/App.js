/** @jsx jsx */

import { jsx } from "@emotion/core"
import Main from './main/Main';
import Game from './game/Game';
import { useState } from "react";

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
	overflow: "hidden"
};

function App() {
	// Available app states.
	const
		AS_MAIN = "main",
		AS_GAME = "game";

	// Current app state.
	let [ state, setState ] = useState(AS_MAIN);
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
		}
	};

	switch (state) {
		case AS_MAIN: appContent = <Main events={events} data={data}></Main>; break;
		case AS_GAME: appContent = <Game events={events} data={data}></Game>; break;
		default: break;
	}

	return (
		<div className="App" css={style}>
			{ appContent }
		</div>
  	);
}

export default App;
