const canvasSize = 600;
const maxTimeTilEnd = 200;
const outerCircleDiameter = (canvasSize / 10) * 9;
const innerCircleDiameter = (canvasSize / 10) * 3;
const outerCircleRadius = outerCircleDiameter / 2;
const innerCircleRadius = innerCircleDiameter / 2;
const midpoint = canvasSize / 2;
const singlePlayer = false;
const numShips = 2000;
let ships = [];
let crashedShips = [];
let ship;

let timeTilEndWithNoProgress = maxTimeTilEnd;
let timeTilEnd = maxTimeTilEnd * 10; // global timeout


function setup() {
	createCanvas(canvasSize, canvasSize);
	if (singlePlayer) {
		ship = new Ship(getShipStartXPosition(), midpoint, midpoint, innerCircleRadius, outerCircleRadius, canvasSize);
	} else {
		setupShips();
	}
}

function setupShips() {
	for (let i = 0; i < numShips; i++) {
		const x = getShipStartXPosition();
		const ship = new Ship(x, midpoint, midpoint, innerCircleRadius, outerCircleRadius, canvasSize, null, 1);
		ships.push(ship);
	}
}

function getShipStartXPosition() {
	return getRandomArbitrary(midpoint - outerCircleRadius, midpoint - innerCircleRadius);
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function draw() {
	background(0);
	if (singlePlayer) {
		checkKeyPresses();
		ship.animate();
		if (ship.isCollide()) {
			console.log('collide');
		}
	} else {
		for(let i = ships.length - 1; i >= 0; i--) {
			ships[i].animate();
			if (ships[i].isCollide()) {
				crashedShips.push(ships[i]);
				ships.splice(i, 1); // remove crashed ship
			} else if (ships[i].isNewQuad()) {
				timeTilEndWithNoProgress = maxTimeTilEnd;	// ship made progress so restart no progress timeout
			}
		}
	}
	drawTrack();
	if (singlePlayer) {
		ship.draw();
	} else {
		for(const ship of ships) {
			ship.draw();
		}
	}
	timeTilEndWithNoProgress--;	
	timeTilEnd--;
	if (timeTilEndWithNoProgress < 0 || timeTilEnd < 0 || ships.length === 0) {
		const globalTimeout = timeTilEnd < 0;	// global timeout passed, this indicates doing well as survived til end
		nextGeneration(globalTimeout);
		timeTilEndWithNoProgress = maxTimeTilEnd;
		timeTilEnd = maxTimeTilEnd * 20;
	}
}

function nextGeneration(globalTimeout) {
	const allShips = ships.concat(crashedShips).sort((a, b) => b.fitness - a.fitness);
	addNormalisedFitness(allShips);
	ships = [];
	crashedShips = [];

	for (let i = 0; i < numShips; i++) {
		const ship = selectShipForNextGen(allShips);
		const x = getShipStartXPosition();
		const mutateMulitplier = globalTimeout ? 0.5 : 1;	// global timeout means doing well so mutate less
		ships.push(new Ship(x, midpoint, midpoint, innerCircleRadius, outerCircleRadius, canvasSize, ship.brain, mutateMulitplier));
	}
}

function addNormalisedFitness(allShips) {
	const sum = allShips.reduce((a, b) => a + Math.pow(b.fitness, 3), 0);
	allShips.forEach(s => s.normalisedFitness = Math.pow(s.fitness, 3) * 10 / sum);
	console.log(`${allShips[0].normalisedFitness} - ${allShips[1].normalisedFitness} - ${allShips[2].normalisedFitness}`);
}

function selectShipForNextGen(allShips) {
	let i = 0;
	while (true) {
		if (random(1) < allShips[i].normalisedFitness || i == allShips.length - 1) {
			return allShips[i] 
		}
		i++;
	};
}

function checkKeyPresses() {
	if (singlePlayer) {
		if (keyIsDown(LEFT_ARROW)) {
			ship.left();
		} 
		if (keyIsDown(RIGHT_ARROW)) {
			ship.right();
		} 
		if (keyIsDown(UP_ARROW)) {
			ship.forward();
		}
	}
}

function drawTrack() {
	circle(midpoint, midpoint, outerCircleDiameter);
	circle(midpoint, midpoint, innerCircleDiameter);
	line(midpoint - outerCircleRadius, midpoint, midpoint - innerCircleRadius, midpoint);
	line(midpoint + outerCircleRadius, midpoint, midpoint + innerCircleRadius, midpoint);
	line(midpoint, midpoint - outerCircleRadius, midpoint, midpoint - innerCircleRadius);
	line(midpoint, midpoint + outerCircleRadius, midpoint, midpoint + innerCircleRadius);
}
