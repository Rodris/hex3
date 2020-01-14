// Utilities
const Util = {
	// Returns a random index from an array.
	randomIndex: (array) => {
		return Math.round(Math.random() * (array.length - 1));
	},

	// Returns a random element from array.
	randomValue: (array) => {
		return array[Util.randomIndex(array)];
	}
}

export default Util;