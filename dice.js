const scene = document.querySelector('#scene');
const numDiceInput = document.querySelector('input[name="numDice"]');
const sound = document.querySelector('#sound');
const rollHistoryList = document.querySelector('#history ol');

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
}
scene.addEventListener('click', roll);
document.body.addEventListener('keydown', (event) => {
	if (event.key === ' ') {
		event.preventDefault();
		roll();
	}
});

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

const fullscreenArea = document.querySelector('#fullscreenArea');
if (!fullscreenArea.requestFullscreen && !fullscreenArea.webkitRequestFullscreen) {
	document.querySelector('#fullscreen').closest('li').remove();
} else {
	document.querySelector('#fullscreen').addEventListener('click', () => {
		if (fullscreenArea.requestFullscreen) {
			fullscreenArea.requestFullscreen();
		} else if (fullscreenArea.webkitRequestFullscreen) {
			fullscreenArea.webkitRequestFullscreen();
		}
	});
}
