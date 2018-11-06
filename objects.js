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
	this.circleRenderer = new circleRenderer(this.size / 2, new Vec2(0, 0, this), "red", 0, this);
	this.renderers = [this.circleRenderer];
	this.id = null;
	
	this.update = function () {
		this.moveVector.parent = this;
		this.move(this.moveVector, this.movespeed);

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
	this.type = "zombie";
	this.Vec2 = new Vec2(x, y, this);
	this.movespeed = 0.5;
	this.size = size;
	this.moveVector = new Vec2(0, 0, this);
	this.health = health;
	this.damage = damage;
	this.id = null;
	this.circleRenderer = new circleRenderer(this.size / 2, new Vec2(0, 0, this), "purple", 0, this);
	this.renderers = [this.circleRenderer];
	this.circleCol = new circleCol(this.size/2, this);
	this.update = function () {
		if (!gameover) {
			var vec = distBetween(this.Vec2.x, this.Vec2.y, objects[0].Vec2.x, objects[0].Vec2.y, true);

			vec = new Vec2(vec[0], vec[1], null);

			vec = vec.normalised();

			vec.x = Math.round(vec.x);
			vec.y = Math.round(vec.y);

			this.moveVector.x = -vec.x;
			this.moveVector.y = -vec.y;

			this.move(this.moveVector, this.movespeed + Randrange(-0.4,0.5,false));
		}
		

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
							this.move(this.moveVector,this.movespeed);

						}

					}
					break;
				case "zombie":
					if (this.circleCol.colCheck(i)) {
						var movedir = distBetween(this.Vec2.x, this.Vec2.y, objects[i].Vec2.x, objects[i].Vec2.y, true);
						this.moveVector.x = movedir[0];
						this.moveVector.y = movedir[1];
						this.move(this.moveVector, this.movespeed);

					}

			}

		}
		if (this.health <= 0) {
			score += 10;
			brouzouf += 10;
			objects[1].zombies--;
			this.destroy();

		}

	};
	subFuncs(this);
}

//Makes a tank
function Tank(x,y) {
	this.type = "tank";
	this.Vec2 = new Vec2(x, y, this);
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
	this.circleRenderer = new circleRenderer(this.size / 2, new Vec2(0, 0, this), "blue", 0, this);
	this.renderers = [this.circleRenderer];
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

		this.move(this.moveVector, this.movespeed);

		this.shootcounter++;
		this.iframes--;

		if (this.shootcounter >= this.shootint) {

			this.shoot();

		}

		if (this.health <= 0) {

			this.destroy();
			gameover = true; 
		}

	};
	subFuncs(this);
}

function director() {

	this.type = "director";
	this.renderers = [];
	this.gameticks = 0;
	this.zombieSpawnTimer = 0;
	this.loZombiespawnInterval = 1800;
	this.hiZombieSpawnInterval = 120;
	this.zombieSpawnInterval = 120;
	this.desiredZombies = 100;
	this.softZombiecap = 150;
	this.zombies = 0;
	this.zombieDamage = 5;
	this.zombieSpeed = 1;
	this.deathwait = 60;
	this.deathtime = null;
	this.zombieSpawnAve = 10;
	this.zombiespawnDev = 5;
	this.update = function () {

		if (this.zombies < this.desiredZombies) {

			this.zombieSpawnInterval = this.hiZombieSpawnInterval;

		} else {

			var coeff = (this.zombies - this.desiredZombies) / (this.softZombiecap - this.desiredZombies);
			var int = (this.loZombiespawnInterval - this.hiZombieSpawnInterval) * coeff;

			this.zombieSpawnInterval = this.hiZombieSpawnInterval + int;

		}

		if (this.zombieSpawnInterval <= this.zombieSpawnTimer) {
			var number = Randrange(this.zombieSpawnAve - this.zombiespawnDev, this.zombieSpawnAve + this.zombiespawnDev, true);
			console.log("spawn " + number + " zombies");
			if (this.zombies < this.softZombiecap) {
				spawnZombieGroup(Randrange(0, canvas[0].width, true), Randrange(0, canvas[0].height, true), 30, 8, this.zombieSpeed, this.zombieDamage, number);
				this.zombies += number;
			}
			this.zombieSpawnTimer = 0;

		}

		if (objects[0].type != "player") {

			if (this.deathtime == null) {
				this.deathtime = this.gameticks;
				gameover = true;
			}

			if (this.gameticks - this.deathwait == this.deathtime) {

				alert("Game Over. Final Score: " + score);

			}


		}

		this.gameticks++;
		this.zombieSpawnTimer++;
	};
	subFuncs(this);

}

function HUD() {

	this.healthback = new rectRenderer(new Vec2(10, 50, this), new Vec2(500, 40, this), "black", 2, this);
	this.healthfront = new rectRenderer(new Vec2(10, 50, this), new Vec2(500, 40, this), "red", 2, this);
	this.healthtext = new textRenderer("Health", new Vec2(10, 34, this), 32, "Trebuchet MS", "black", "left", 2, this);
	this.scoretext = new textRenderer("Score: ", new Vec2(500, 34, this), 32, "Trebuchet MS", "black", "right", 2, this);
	this.renderers = [this.healthback, this.healthfront, this.healthtext, this.scoretext];

	this.update = function () {

		this.healthfront.dimensions.x = (objects[0].health / objects[0].maxhealth) * 500;
		this.scoretext.text = "Score: " + ZeroBuffer(score, 10);

	};

}

function Upgrades() {

	this.split = new Upgrade(3, false, [5000, 10000, 50000], 0);
	this.shootspeed = new Upgrade(25, true, 500, 0.5);
	this.damage = new Upgrade(1000, true, 100, 1);
	this.spray = new Upgrade(1, false, [10000], 0);
	this.friends = new Upgrade(2, false, [10000, 20000], 0);
	this.renderers = [];
	this.upgrades = [this.split, this.shootspeed, this.damage, this.spray, this.friends];

	this.upgrade = function (no) {

		var upg = this.upgrades[no];

		if (brouzouf >= upg.cost) {
			if (upg.level < upg.cap) {

				brouzouf -= upg.cost;
				upg.level++;
				if (upg.level < upg.cap) {
					if (upg.algorithm) {
						upg.cost += Math.floor(upg.cost * upg.coeff);
					} else {
						upg.cost = upg.costs[upg.level];
					}
				} else {

					upg.capped = true;

				}
			}
		}
	};

	this.update = function () {

	};


}

function Upgrade(cap,alg,costs,coeff) {

	this.level = 0;
	this.cap = cap;
	this.algorithm = alg;
	this.capped = false;

	if (this.algorithm) {

		this.cost = costs;
		this.coeff = coeff;

	} else {

		this.cost = costs[0];
		this.costs = costs;

	}

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
function circleRenderer(radius, center, colour, canvasno, parent) {

	this.radius = radius;
	this.center = center;
	this.colour = colour;
	this.parent = parent;
	this.canvasno = canvasno;
	this.draw = function () {

		context[this.canvasno].fillStyle = this.colour;
		context[this.canvasno].beginPath();
		context[this.canvasno].arc(this.parent.Vec2.x + this.center.x, this.parent.Vec2.y + this.center.y, this.radius, 0, Math.PI * 2);
		context[this.canvasno].fill();
		context[this.canvasno].closePath();

	} 

}

function lineRenderer(start, end, colour, canvasno, parent) {

	this.start = start;
	this.end = end;
	this.colour = colour;
	this.parent = parent;
	this.canvasno = canvasno;
	this.draw = function () {

		context[this.canvasno].fillStyle = this.colour;
		context[this.canvasno].beginPath();
		context[this.canvasno].moveTo(this.start.x, this.start.y);
		context[this.canvasno].lineTo(this.end.x, this.end.y);
		context[this.canvasno].stroke();
		context[this.canvasno].closePath();
	};
}

function rectRenderer(start, dimensions, colour, canvasno, parent) {

	this.start = start;
	this.dimensions = dimensions;
	this.colour = colour;
	this.parent = parent;
	this.canvasno = canvasno;
	this.draw = function () {

		context[this.canvasno].fillStyle = this.colour;
		context[this.canvasno].beginPath();
		context[this.canvasno].rect(start.x, start.y, dimensions.x, dimensions.y);
		context[this.canvasno].fill();
		context[this.canvasno].closePath();

	};

}


//render the hecking text
function textRenderer(text, start, size, font, colour, align, canvasno, parent) {

	this.text = text;
	this.start = start;
	this.size = size;
	this.font = font;
	this.colour = colour;
	this.canvasno = canvasno;
	this.parent = parent;
	this.align = align;
	this.draw = function () {

		context[this.canvasno].fillStyle = this.colour;
		context[this.canvasno].textAlign = align;
		context[this.canvasno].beginPath();
		context[this.canvasno].font = this.size + "px " + this.font;
		context[this.canvasno].fillText(this.text, this.start.x, this.start.y);
		context[this.canvasno].closePath();


	};

}

//Initalises general subfunctions for objects
function subFuncs(obj) {

	obj.move = function (moveVector,speed) {

		moveVector = moveVector.normalised();

		this.Vec2.x += moveVector.x * speed;
		this.Vec2.y += moveVector.y * speed;

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