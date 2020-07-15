/**
 * This hacky script produces the CSS for random-looking numbers of rotations
 * for the rolls for each die
 */

const DIM_TURNS_MAX = 2;
const TOTAL_TURNS_MIN = 2;
const TOTAL_TURNS_MAX = 7;
const MOD_MAX = 5;
const DIGIT_MAX = 6;

function out(mod, child, x, y, z) {
	console.log(`#scene[data-roll-count-mod${MOD_MAX}="${mod}"] > :nth-child(${DIGIT_MAX}n+${child}) { --spin: rotateX(${x}turn) rotateY(${y}turn) rotateZ(${z}turn); }`);
}
function getrand(min = 2) {
	return Math.floor(Math.random() * (DIM_TURNS_MAX + 1) + min) * (Math.random() < 0.5 ? -1 : 1);
}
for (let child = 1; child <= DIGIT_MAX; child++) {
	while (true) {
		const spins = [[0, 0, 0]];
		for (let mod = 1; mod < MOD_MAX; mod++) {
			const prev = spins[spins.length - 1];
			let nums = null;
			while (true) {
				nums = [getrand(), getrand(), getrand()];
				const turnsTotal = nums.reduce((acc, n) => acc + Math.abs(n), 0);
				if (turnsTotal >= TOTAL_TURNS_MIN && turnsTotal <= TOTAL_TURNS_MAX) break;
			}
			spins.push(prev.map((p, i) => p + nums[i]));
		}
		const wrapTurnsTotal = spins[spins.length - 1].reduce((acc, n) => acc + Math.abs(n), 0);
		if (wrapTurnsTotal >= TOTAL_TURNS_MIN && wrapTurnsTotal <= TOTAL_TURNS_MAX) {
			for (const [mod, spin] of spins.entries()) {
				out(mod, child, ...spin);
			}
			break;
		}
	}
}
