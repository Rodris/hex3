/** @jsx jsx */

import { jsx, css } from "@emotion/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireAlt, faWater, faMountain, faWind, faLeaf, faPlayCircle, faPlay } from '@fortawesome/free-solid-svg-icons';

// Hex types.
const HexTypes = {
	FIRE: "fire",
	WATER: "water",
	EARTH: "earth",
	WIND: "wind",
	PLANT: "plant"
};
const HexTypesArray = Object.values(HexTypes);

// Hex bg image.
const HexBg = () =>
	<svg viewBox="-4 -4 144 130">
	<defs>
		<linearGradient
			id="linearGradient865">
			<stop style={{stopColor:"#1c1d1c",stopOpacity:1}} offset="0" id="stop861" />
			<stop style={{stopColor:"#494849",stopOpacity:1}} offset="1" id="stop863" />
		<linearGradient id="linearGradient902">
			<stop style={{stopColor:"#1c1d1c",stopOpacity:1}} offset="0" id="stop898" />
			<stop style={{stopColor:"#424344",stopOpacity:1}} offset="1" id="stop900" />
		</linearGradient>
		</linearGradient>
		<linearGradient xlinkHref="#linearGradient865" id="linearGradient871"
			x1="33.31208" y1="177.15852"
			x2="101.88778" y2="295.48209"
			gradientUnits="userSpaceOnUse" />
		<linearGradient xlinkHref="#linearGradient902" id="linearGradient904"
			x1="101.67748" y1="120.29309"
			x2="35.390953" y2="1.5915558"
			gradientUnits="userSpaceOnUse" />
	</defs>
	<g transform="translate(0,-175)">
		<path
			style={{fill:"url(#linearGradient871)",fillOpacity:1,stroke:"none",strokeWidth:5,strokeMiterlimit:4,strokeDasharray:"none",strokeOpacity:1}}
			d="m 120.62458,266.36089 c -20.37473,35.29009 -11.92228,30.41006 -52.67176,30.41006 -40.749477,0 -32.297026,4.88002 -52.671764,-30.41006 -20.3747383,-35.29008 -20.3747383,-25.53003 0,-60.82011 20.374738,-35.29008 11.922288,-30.41006 52.671764,-30.41006 40.74948,0 32.29703,-4.88002 52.67176,30.41006 20.37474,35.29008 20.37474,25.53003 0,60.82011 z"
			/>
	</g>
	<g>
		<path
			style={{display:"inline",fill:"none",fillOpacity:1,stroke:"url(#linearGradient904)",strokeWidth:4,strokeMiterlimit:4,strokeDasharray:"none",strokeOpacity:1}}
			d="m 120.62459,91.360892 c -20.37474,35.290088 -11.92229,30.410058 -52.67177,30.410058 -40.749479,0 -32.297028,4.88003 -52.671768,-30.410059 C -5.0936869,56.070807 -5.0936869,65.830857 15.281053,30.540773 35.655792,-4.7493108 27.203341,0.13071424 67.95282,0.13071442 c 40.74948,1.8e-7 32.29703,-4.88002492 52.67177,30.41005958 20.37474,35.290084 20.37474,25.530034 0,60.820118 z"
			/>
	</g>
	</svg>

// Hex shape.
const HexShape = () => <path d="m 120.62458,266.36089 c -20.37473,35.29009 -11.92228,30.41006 -52.67176,30.41006 -40.749477,0 -32.297026,4.88002 -52.671764,-30.41006 -20.3747383,-35.29008 -20.3747383,-25.53003 0,-60.82011 20.374738,-35.29008 11.922288,-30.41006 52.671764,-30.41006 40.74948,0 32.29703,-4.88002 52.67176,30.41006 20.37474,35.29008 20.37474,25.53003 0,60.82011 z" />

// Lights and shadows.
const HexLightsShadows = () =>
	<g>
		<path
			style={{fill:"#ffffff",fillOpacity:0.5,stroke:"none"}}
			d="M 24.46745,37.310295 C 5.7151846,68.789506 -6.3341638,69.596515 17.397721,33.186606 37.772461,-2.1034773 29.32001,2.7765477 70.069489,2.7765479 c 40.749481,2e-7 47.646671,9.9088231 7.314628,8.4874391 C 33.191732,9.7065573 41.200266,6.3951923 24.46745,37.310295 Z"
			/>
		<path
			style={{fill:"#000000",fillOpacity:0.5,stroke:"none"}}
			d="m 111.88455,85.671883 c 20.00022,-36.493381 32.12453,-31.946038 7.06973,4.652857 -20.374765,35.29011 -11.93304,29.47407 -52.671795,30.41008 -41.127458,0.94494 -47.659366,-10.01474 -7.314632,-9.01661 40.034677,0.99046 36.183852,2.41195 52.916697,-26.046327 z"
			/>
	</g>

// An hexagon.
function Hex(props) {
	// Styles
	let hexStyle = {
		stroke: (props.selected) ? "white" : "black",
		strokeWidth: 4,
		fill: "currentColor",
		animation: props.animation
	};

	// BG style.
	const bgStyle = {
		color: "gold",
		position: "absolute",
		top: 0,
		width: "100%",
		textAlign: "center"
	};

	if (props.data) {
		bgStyle.fontSize = (8 * props.data.gameRatio) + "vmin";
	}

	// Selects hex type.
	let icon;
	let color;
	let iconStyle;
	switch (props.type) {
		// Button types.
		case "play": icon = faPlay; color = "orange"; break;

		// Game types.
		case HexTypes.FIRE: icon = faFireAlt; color = "orange"; break;
		case HexTypes.WATER: icon = faWater; color = "deepskyblue"; break;
		case HexTypes.EARTH: icon = faMountain; color = "brown"; break;
		case HexTypes.WIND: icon = faWind; color = "white"; break;
		case HexTypes.PLANT: icon = faLeaf; color = "green"; break;
		default:
			icon = null;
			hexStyle = css(
				hexStyle,
				{
					fill: "none",
				}
			);
			break;
	}
	iconStyle = css({
		color: color
	})

	// Hex
	let hex = 
		<div css={hexStyle} {...props}>
			{ (icon) ? (
				<svg viewBox="-4 -4 144 130">
					<g transform="translate(0,-175)" css={iconStyle}>
						<HexShape></HexShape>
					</g>
					<FontAwesomeIcon icon={icon} transform="shrink-8 left-0.5 up-0.5" />
					<HexLightsShadows></HexLightsShadows>
				</svg>
			) : (
				<HexBg></HexBg>
			)}
			<div css={bgStyle}>{ props.letter }</div>
		</div>

	return hex;
}

export { HexTypes, HexTypesArray };

export default Hex;