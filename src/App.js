/** @jsx jsx */

import { jsx } from "@emotion/core"
import Game from './game/Game';

function App() {
	return (
		<div className="App" css={{ height: "100%" }}>
			<Game></Game>
		</div>
  	);
}

export default App;
