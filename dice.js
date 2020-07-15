const scene = document.querySelector('#scene');

const numDiceInput = document.querySelector('input[name="numDice"]');
function updateNumDice() {
	const newNumDice = parseInt(numDiceInput.value);
	const oldNumDice = scene.children.length;
	while (scene.children.length > newNumDice) {
		scene.children[newNumDice].remove();
	}
	while (scene.children.length < newNumDice) {
		scene.appendChild(scene.children[0].cloneNode(true));
	}
}
numDiceInput.addEventListener('change', updateNumDice);
updateNumDice();

let rollCount = 0;
const sound = document.querySelector('#sound');
const rollButton = document.querySelector('#roll');
function roll() {
	scene.dataset.rollCountMod5 = ++rollCount % 5;
	const rolls = [];
	for (const die of scene.querySelectorAll('.die')) {
		const roll = Math.floor(Math.random() * 6) + 1;
		rolls.push(roll);
		die.dataset.result = roll;
	}

	addToHistory(rolls);

	if (document.querySelector('input[name="sound"]').checked) {
		sound.currentTime = 0;
		sound.play();
	}

	rollButton.focus();
}
scene.addEventListener('click', roll);
rollButton.addEventListener('click', roll);

const rollHistoryList = document.querySelector('#history ol');
function addToHistory(rolls) {
	const li = document.createElement('li');
	const strong = document.createElement('strong');
	strong.appendChild(document.createTextNode(rolls.reduce((acc, roll) => acc + roll, 0)));
	li.appendChild(strong);
	li.appendChild(document.createTextNode(` (${rolls.join(', ')})`));
	rollHistoryList.appendChild(li);
	li.scrollIntoView({
		behavior: 'smooth',
		block: 'end',
		inline: 'end',
	});
}

function updateNumberStyle() {
	scene.dataset.numberStyle = document.querySelector('input[name="numberStyle"]:checked').value;
}
for (const radio of document.querySelectorAll('input[name="numberStyle"]')) {
	radio.addEventListener('change', updateNumberStyle);
}
updateNumberStyle();

const fullscreenButton = document.querySelector('#fullscreen');
const fullscreenArea = document.querySelector('#fullscreenArea');
if (!fullscreenArea.requestFullscreen && !fullscreenArea.webkitRequestFullscreen) {
	fullscreenButton.addEventListener('click', () => {
		document.querySelector('header').style.display = 'none';
		document.querySelector('footer').style.display = 'none';
	});
} else {
	fullscreenButton.addEventListener('click', () => {
		if (fullscreenArea.requestFullscreen) {
			fullscreenArea.requestFullscreen();
		} else if (fullscreenArea.webkitRequestFullscreen) {
			fullscreenArea.webkitRequestFullscreen();
		}
	});
}

const shakeCheckbox = document.querySelector('input[name="shake"]');
if (window.DeviceMotionEvent) {
	const ACCELERATION_THRESHOLD_RANGE = [8, 14];
	const ROTATION_THRESHOLD_RANGE = [40, 80];
	const TURNS_PER_SECOND_THRESHOLD = 5;
	const SHAKE_COOLOFF = 1e3;

	let lastShakeTime = null;

	const turns = {
		// Changes of linear acceleration direction
		x: [],
		y: [],
		z: [],

		// Changes of rotation direction
		alpha: [],
		beta: [],
		gamma: [],
	};

	function handleMotion(event) {
		const time = new Date();
		const minTime = time - 1e3;

		// See if we've changed direction in any of the six dimensions
		for (const [dim, value, thresholdRange] of [
			['x', event.acceleration.x, ACCELERATION_THRESHOLD_RANGE],
			['y', event.acceleration.y, ACCELERATION_THRESHOLD_RANGE],
			['z', event.acceleration.z, ACCELERATION_THRESHOLD_RANGE],
			['alpha', event.rotationRate.alpha, ROTATION_THRESHOLD_RANGE],
			['beta', event.rotationRate.alpha, ROTATION_THRESHOLD_RANGE],
			['gamma', event.rotationRate.gamma, ROTATION_THRESHOLD_RANGE]
		]) {
			// Abort if it's outside the threshold range
			if (Math.abs(value) < thresholdRange[0] || Math.abs(value) > thresholdRange[1]) continue;

			// Abort if direction is the same as the last recording
			if (turns[dim].length > 0) {
				const prevValue = turns[dim][turns[dim].length - 1].value;
				if (value > 0 && prevValue > 0 || value < 0 && prevValue < 0) {
					// Same direction
					continue;
				}
			}

			// Remove old or irrelevant direction changes
			if (turns[dim].length > TURNS_PER_SECOND_THRESHOLD) {
				turns[dim] = turns[dim].slice(-TURNS_PER_SECOND_THRESHOLD);
			}
			for (let i = turns[dim].length - 1; i >= 0; i--) {
				if (turns[dim][i].time <= minTime) {
					turns[dim] = turns[dim].slice(i);
					break;
				}
			}

			// Log the direction change
			turns[dim].push({
				time,
				value,
			});

			// Has it been long enough since the last shake?
			if (lastShakeTime != null && time - lastShakeTime < SHAKE_COOLOFF) continue;

			// Have we shaken fast enough?
			if (turns[dim].length > TURNS_PER_SECOND_THRESHOLD) {
				roll();
				lastShakeTime = time;
				break;
			}
		}
	}


	shakeCheckbox.addEventListener('change', () => {
		if (shakeCheckbox.checked) {
			window.addEventListener('devicemotion', handleMotion);
		} else {
			window.removeEventListener('devicemotion', handleMotion);
		}
	});
} else {
	shakeCheckbox.disabled = true;
	shakeCheckbox.closest('li').append(" (not available on this browser)");
}
