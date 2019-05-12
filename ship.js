const angularSpeed = 0.1;
const acceleration = 0.1;
const halfPi = Math.PI / 2;

class Ship {
  constructor(x, y) {
    this.x = x;
		this.y = y;
		this.velocityX = 0;
		this.velocityY = 0;
		this.angle = 0;
		this.speed = 0;
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
	}

	draw() {
		push();
		translate(this.x, this.y);
		rotate(this.angle);				
		triangle(0, -10, -5, 5, 5, 5);
		pop();
	}
}