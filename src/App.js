/** @jsx jsx */

import { jsx } from "@emotion/core"
import Main from './main/Main';
import Game from './game/Game';
import { useState, useEffect } from "react";
import Ranking from "./ranking/Ranking";
import Util from "./Util";

// Setups game data.
function init() {
	// Retrieves body dimensions.
	const bodyRect = document.body.getBoundingClientRect();

	// App data.
	let data = {};
	data.landscape = (bodyRect.height < bodyRect.width && bodyRect.height < 700);
	if (data.landscape) {
		data.gameHeight = Math.min(bodyRect.height, 500);
		data.gameWidth = Math.min(bodyRect.width, 9 * data.gameHeight / 5);
		data.boardSize = Math.min(data.gameHeight, 5 * data.gameWidth / 7);
	} else {
		data.gameWidth = Math.min(bodyRect.width, 500);
		data.gameHeight = Math.min(bodyRect.height, 9 * data.gameWidth / 5);
		data.boardSize = Math.min(data.gameWidth, 5 * data.gameHeight / 7);
	}
	data.minSize = Math.min(data.gameWidth, data.gameHeight);
	data.uiSize = data.boardSize / 5;
	data.gameRatio = data.boardSize / Math.min(bodyRect.width, bodyRect.height)

	// App style.
	data.style = {
		width: data.gameWidth,
		height: data.gameHeight,
		margin: "auto",
		overflow: "hidden",
		color: Util.colors.fontColor,
		backgroundImage: `linear-gradient(-45deg, ${Util.colors.bg1}, ${Util.colors.bg2})`
	};

	return data;
}

function App() {
	// Available app states.
	const
		AS_MAIN = "main",
		AS_GAME = "game",
		AS_RANK = "ranking";

	// Current app state.
	let [ data, setData ] = useState(init());
	let [ state, setState ] = useState(AS_MAIN);
	let [ score, setScore ] = useState(0);
	let appContent;

	// Handles device orientation change event.
	useEffect(() => {
		const updateAppSize = () => {
			setTimeout(() => {
				setData(init());
			}, 50);
		};
		window.addEventListener("orientationchange", updateAppSize);
		window.addEventListener("resize", updateAppSize);
	}, []);

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
		<div className="App" css={data.style}>
			{ appContent }
		</div>
  	);
}

export default App;
