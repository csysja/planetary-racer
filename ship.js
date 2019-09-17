const angularSpeed = 0.1;
const acceleration = 0.1;
const halfPi = Math.PI / 2;
const quadTopLeft = 1;
const quadTopRight = 2;
const quadBottomRight = 3;
const quadBottomLeft = 4;
const maxSpeed = 3;
let mutateMultiplier = 1;

function mutate(mutateMultiplier) {
	return function(x) {
		if (random(1) < (0.2 * mutateMultiplier)) {
			let offset = randomGaussian() * 0.4 * mutateMultiplier;
			let newx = x + offset;
			return newx;
		} else {
			return x;
		}
	}
}

class Ship {
  constructor(x, y, midpoint, innerCircleRadius, outerCircleRadius, canvasSize, brain, mutateMultiplier) {
    this.x = x;
		this.y = y;
		this.velocityX = 0;
		this.velocityY = 0;
		this.angle = 0;
		this.speed = 0;
		this.midpoint = midpoint;
		this.innerCircleRadius = innerCircleRadius;
		this.outerCircleRadius = outerCircleRadius;
		this.canvasSize = canvasSize;
		this.currentQuad = this.getCurrentQuad();
		this.previousQuad = this.currentQuad;
		this.fitness = 0;
		this.hasEverMoved = false;
		this.isAlive = true;

		if (brain instanceof NeuralNetwork) {
			this.brain = brain.copy();
			this.brain.mutate(mutate(mutateMultiplier));
		} else {
			this.brain = new NeuralNetwork(5, 10, 2);
		}

	}
	
	left() {
		this.angle -= angularSpeed;
		if (this.angle < 0) {
			this.angle += Math.PI * 2;	// always want positive angle
		}
	}
	
	right() {
		this.angle += angularSpeed;
	}

	forward() {
		this.velocityX += Math.cos(this.angle - halfPi) * acceleration;
		this.velocityY += Math.sin(this.angle - halfPi) * acceleration;		
		const magnitude = Math.sqrt(Math.pow(this.velocityX, 2) + Math.pow(this.velocityY, 2));	// calculate magnitude of two vectors
		if (magnitude > maxSpeed) {
			const factor = maxSpeed / magnitude;	// ship going too fast, calculate how much to slow it by
			this.velocityX *= factor;
			this.velocityY *= factor;
		}
		this.hasEverMoved = true;
	}

	animate() {
		this.x += this.velocityX;
		this.y += this.velocityY;
		// recognise which quadrant ship is in
		this.previousQuad = this.currentQuad;
		this.currentQuad = this.getCurrentQuad();
		this.useBrain();	
		this.forward();
		this.calculateFitness();
	}

	calculateFitness() {
		if (this.hasEverMoved && this.isAlive) {
			this.fitness += 1;
		}
		if (this.isNewQuad() && !this.isCollide()) {
			this.fitness += 1000;
		}
	}

	isNewQuad() {
		return this.previousQuad !== this.currentQuad;
	}

	roundDecimal(number, numDecimalPlaces) {
		return Math.round(number * Math.pow(10, numDecimalPlaces)) / Math.pow(10, numDecimalPlaces);
	}

	useBrain() {
		const x = this.x - this.midpoint;
		const y = this.canvasSize - this.y - this.midpoint;
		const angleToCenter = Math.atan2(y, -x);
		const angleRelativeToX = angleToCenter >= 0 ? angleToCenter : 2 * Math.PI + angleToCenter;
		const shipAngleCos = Math.cos(this.angle);
		const shipAngleSin = Math.cos(this.angle);
		const shipAngleRelativeToXCos = Math.cos(angleRelativeToX);
		const shipAngleRelativeToXSin = Math.sin(angleRelativeToX);
		let inputs = [];
		const distance = Math.sqrt(Math.pow(this.x - this.midpoint, 2) + Math.pow(this.y - this.midpoint, 2))
		const normalisedDistance = map(distance, this.innerCircleRadius, this.outerCircleRadius, 0, 1);
		inputs.push(normalisedDistance);
		inputs.push(map(shipAngleCos, -1, 1, 0, 1));
		inputs.push(map(shipAngleSin, -1, 1, 0, 1));
		inputs.push(map(shipAngleRelativeToXCos, -1, 1, 0, 1));
		inputs.push(map(shipAngleRelativeToXSin, -1, 1, 0, 1));
		const action = this.brain.predict(inputs);
		if (action[0] > 0.5) {
			this.left();
		}
		if (action[1] > 0.5) {
			this.right();
		}	
	}

	isCollide() {
		const distance = this.distanceBetweenPoints(this.x, this.y, this.midpoint, this.midpoint);
		if (distance < this.innerCircleRadius) {
			this.isAlive = false;
			return true;
		}
		if (distance > this.outerCircleRadius) {
			this.isAlive = false;
			return true;
		}
		// don't allow ship to return to previous quadrant
		if (this.currentQuad < this.previousQuad && 
				(this.previousQuad !== 4 || this.currentQuad !== 1) ||
				this.previousQuad === 1 && this.currentQuad === 4) {
			this.isAlive = false;
			return true;
		}
		return false;
	}

	getCurrentQuad() {
		if (this.x <= this.midpoint) {
			if (this.y <= this.midpoint) {
				return quadTopLeft;
			} else {
				return quadBottomLeft;
			}
		} else {
			if (this.y <= this.midpoint) {
				return quadTopRight;
			} else {
				return quadBottomRight;
			}
		}
	}

	distanceBetweenPoints(x1, y1, x2, y2) {
		const a = x1 - x2;
		const b = y1 - y2;

		return Math.sqrt( a*a + b*b );
	}

	draw() {
		push();
		translate(this.x, this.y);
		rotate(this.angle);				
		triangle(0, -10, -5, 5, 5, 5);
		pop();
	}
}
