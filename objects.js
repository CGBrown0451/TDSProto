// JavaScript source code

//Creates a bullet
function Bullet(x, y, size, damage, speed, moveVector) {
	this.type = "bullet";
	this.Vec2 = new Vec2(x, y, this);
	this.piercing = 1;
	this.size = size;
	this.damage = damage;
	this.movespeed = speed;
	this.moveVector = moveVector;
	this.circleCol = new circleCol(this.size/2, this);
	this.circleRenderer = new circleRenderer(this.size/2, new Vec2(0, 0, this), "red", this);
	this.id = null;
	
	this.update = function () {
		this.moveVector.parent = this;
		this.move();

		if (this.Vec2.x < 0 || this.Vec2.x > canvas.width) {
			this.destroy();
		} else if (this.Vec2.y < 0 || this.Vec2.y > canvas.height) {
			this.destroy();
		}

		if (this.moveVector.magnitude() == 0) {
				this.destroy();
		}

		if (this.piercing < 1) {

			this.destroy();

		}

	};
	subFuncs(this);
}

//Creates a Zombie
function Zombie(x, y, size, health, damage) {
	this.type = "Zombie";
	this.Vec2 = new Vec2(x, y, this);
	this.movespeed = 0.5;
	this.size = size;
	this.moveVector = new Vec2(0, 0, this);
	this.health = health;
	this.damage = damage;
	this.id = null;
	this.circleRenderer = new circleRenderer(this.size/2, new Vec2(0, 0, this), "purple", this);
	this.circleCol = new circleCol(this.size/2, this);
	this.update = function () {

		var vec = distBetween(this.Vec2.x, this.Vec2.y, objects[0].Vec2.x, objects[0].Vec2.y, true);

		vec = new Vec2(vec[0], vec[1], null);

		vec = vec.normalised();

		vec.x = Math.round(vec.x);
		vec.y = Math.round(vec.y);

		this.moveVector.x = -vec.x;
		this.moveVector.y = -vec.y;

		this.move();

		

		for (var i in objects) {

			if (i == this.id) {
				continue;
			}

			switch (objects[i].type) {

				case "bullet":
					if (this.circleCol.colCheck(i)) {
						console.log("hit");
						this.health -= objects[i].damage;
						objects[i].piercing--;
					}
					break;
				case "player":
					if (this.circleCol.colCheck(i)) {
						if (objects[i].damage(damage)) {
							this.destroy();

						} else {

							this.moveVector.x = -this.moveVector.x;
							this.moveVector.y = -this.moveVector.y;
							this.move();

						}

					}
					break;
				case "Zombie":
					if (this.circleCol.colCheck(i)) {
						this.moveVector.x = -this.moveVector.x;
						this.moveVector.y = -this.moveVector.y;
						this.move();

					}

			}

		}
		if (this.health <= 0) {

			this.destroy();

		}

	};
	subFuncs(this);
}
	

//Makes the player
function Player() {
	this.type = "player";
	this.Vec2 = new Vec2(350, 250, this);
	this.movespeed = 1;
	this.size = 16;
	this.moveVector = new Vec2(0, 0, this);
	this.shootVector = new Vec2(0, 0, this);
	this.health = 100;
	this.maxhealth = 100;
	this.energy = 100;
	this.maxenergy = 100;
	this.shootint = 18;
	this.shootcounter = 0;
	this.iframes = 0;
	this.id = null;
	this.circleRenderer = new circleRenderer(this.size/2, new Vec2(0, 0, this), "blue", this);
	this.circleCol = new circleCol(this.size/2, this);

	this.damage = function (dmg) {

		if (this.iframes < 1) {
			this.health -= dmg;
			this.iframes = 30;
			return true;
		} else {
			return false;
		}

	};

	this.shoot = function () {

		if (slr == 0 && sud == 0 || this.shootVector.magnitude() == 0) {
			return;
		}

		this.shootVector = this.shootVector.normalised();

		var no = objects.push(new Bullet(this.Vec2.x + this.shootVector.x * (this.size / 2 + 2), this.Vec2.y + this.shootVector.y * (this.size / 2 + 2), 4, 1, 2, this.shootVector));
		objects[no - 1].id = no - 1;

		this.shootcounter = 0;
	};
	this.update = function () {

		this.moveVector.x = mlr;
		this.moveVector.y = mud;

		this.shootVector.x = slr;
		this.shootVector.y = sud;

		this.move();

		this.shootcounter++;
		this.iframes--;

		if (this.shootcounter >= this.shootint) {

			this.shoot();

		}


	};
	subFuncs(this);
}

//Spawns a group of zombies in a random range around a point. Best way to spawn Zombies.
function spawnZombieGroup(x, y, spread, size, health, damage, number) {

	var i = 0;

	while (i < number) {

		var no = objects.push(new Zombie(x + Randrange(-spread, spread, true), y + Randrange(-spread, spread, true), size, health, damage));
		objects[no - 1].id = no - 1;
		i++;
	}

}

//Creates a Vector2 subObject
function Vec2(x, y, parent) {
	this.x = x;
	this.y = y;
	this.parent = parent;
	this.magnitude = function () {

		return diag(this.x, this.y);

	};
	this.normalised = function () {

		mag = this.magnitude();
		if (mag !== 0) {
			return new Vec2(this.x / mag, this.y / mag, this.parent);
		} else {
			return new Vec2(0, 0, this.parent);
		}
	};
}

//Creates a circle collider subObject.
function circleCol(radius, parent) {

	this.radius = radius;
	this.parent = parent;
	this.colCheck = function (objectId) {
		if (objects[objectId].circleCol != undefined) {
			var x1 = this.parent.Vec2.x;
			var y1 = this.parent.Vec2.y;
			var x2 = objects[objectId].Vec2.x;
			var y2 = objects[objectId].Vec2.y;
			if (distBetween(x1, y1, x2, y2, false) < radius + objects[objectId].circleCol.radius) {
				return true;
			} else {
				return false;
			}
		} else {

			//TODO other colliders
			return false;

		}
	}
}


//Makes a circle renderer
function circleRenderer(radius, center, colour, parent) {

	this.radius = radius;
	this.center = center;
	this.colour = colour;
	this.parent = parent;
	this.draw = function () {

		context.fillstyle = this.colour;
		context.beginPath();
		context.arc(this.parent.Vec2.x + this.center.x, this.parent.Vec2.y + this.center.y, this.radius, 0, Math.PI * 2);
		context.fill();
		context.closePath();

	} 

}

//Initalises general subfunctions for objects
function subFuncs(obj) {

	obj.move = function () {

		this.moveVector = this.moveVector.normalised();

		this.Vec2.x += this.moveVector.x * this.movespeed;
		this.Vec2.y += this.moveVector.y * this.movespeed;

	};

	obj.destroy = function () {

		if (this.id != objects.length - 1) {
			for (var i = this.id + 1; i < objects.length; i++) {
				objects[i].id--;
			}
		}
		objects.splice(this.id, 1);

	};

}