const angularSpeed = 0.1;
const acceleration = 0.1;
const halfPi = Math.PI / 2;
const quadTopLeft = 1;
const quadTopRight = 2;
const quadBottomRight = 3;
const quadBottomLeft = 4;


class Ship {
  constructor(x, y, midpoint, innerCircleRadius, outerCircleRadius) {
    this.x = x;
		this.y = y;
		this.velocityX = 0;
		this.velocityY = 0;
		this.angle = 0;
		this.speed = 0;
		this.midpoint = midpoint;
		this.innerCircleRadius = innerCircleRadius;
		this.outerCircleRadius = outerCircleRadius;
		this.currentQuad = this.getCurrentQuad();
		this.previousQuad = this.currentQuad;
	}
	
	left() {
		this.angle -= angularSpeed;
	}
	
	right() {
		this.angle += angularSpeed;
	}

	forward() {
		this.velocityX += Math.cos(this.angle - halfPi) * acceleration;
		this.velocityY += Math.sin(this.angle - halfPi) * acceleration;		
	}

	animate() {
		this.x += this.velocityX;
		this.y += this.velocityY;
		// recognise which quadrant ship is in
		this.previousQuad = this.currentQuad;
		this.currentQuad = this.getCurrentQuad();
	}

	isCollide() {
		const distance = this.distanceBetweenPoints(this.x, this.y, this.midpoint, this.midpoint);
		if (distance < this.innerCircleRadius) {
			return true;
		}
		if (distance > this.outerCircleRadius) {
			return true;
		}
		console.log(`${this.currentQuad} ${this.previousQuad}`);
		// don't allow ship to return to previous quadrant
		if (this.currentQuad < this.previousQuad && 
				(this.previousQuad !== 4 || this.currentQuad !== 1) ||
				this.previousQuad === 1 && this.currentQuad === 4) {
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