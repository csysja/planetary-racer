const canvasSize = 600;
const outerCircleDiameter = (canvasSize / 10) * 9;
const innerCircleDiameter = (canvasSize / 10) * 3;
const outerCircleRadius = outerCircleDiameter / 2;
const innerCircleRadius = innerCircleDiameter / 2;
const midpoint = canvasSize / 2;
let ship;

function setup() {
	createCanvas(canvasSize, canvasSize);
	setupShips();
}

function setupShips() {
	let x = getShipStartXPosition();
	ship = new Ship(x, midpoint, midpoint, innerCircleRadius, outerCircleRadius);
}

function getShipStartXPosition() {
	return getRandomArbitrary(midpoint - outerCircleRadius, midpoint - innerCircleRadius);
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function draw() {
	background(0);
	checkKeyPresses();
	ship.animate();
	if (ship.isCollide()) {
		console.log('collide');
	}
	drawTrack();
	ship.draw();
}

function checkKeyPresses() {
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

function drawTrack() {
	circle(midpoint, midpoint, outerCircleDiameter);
	circle(midpoint, midpoint, innerCircleDiameter);
	line(midpoint - outerCircleRadius, midpoint, midpoint - innerCircleRadius, midpoint);
	line(midpoint + outerCircleRadius, midpoint, midpoint + innerCircleRadius, midpoint);
	line(midpoint, midpoint - outerCircleRadius, midpoint, midpoint - innerCircleRadius);
	line(midpoint, midpoint + outerCircleRadius, midpoint, midpoint + innerCircleRadius);

}