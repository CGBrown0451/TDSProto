// JavaScript source code


//DAY 1: Imported useful functions, made some new ones and set up drawing, movement and shooting for the player. Need to figure out why everything is black, though.
console.log("Group 1 Reporting");
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var keysDown = [];
var keysDownThisFrame = [];
var objects = [];

var sud, slr, mud, mlr;

var controls = {

	mup: "KeyW",
	mdown: "KeyS",
	mleft: "KeyA",
	mright: "KeyD",
	sup: "ArrowUp",
	sdown: "ArrowDown",
	sleft: "ArrowLeft",
	sright: "ArrowRight"

};

var no = objects.push(newPlayer());
objects[no - 1].id = no - 1;

loadHandler();


//For futureproofing. If I implement sprite loading, this will come in handy.
function loadHandler() {
	window.addEventListener("keydown", keyDownHandler, false);
	window.addEventListener("keyup", keyUpHandler, false);

	spawnZombieGroup(100, 100, 30, 8, 1, 5, 5);

	Update();

}



//Main Game Loop
function Update() {

	inputHandler();
	for (var i in objects) {
		objects[i].update();
	}
	//console.log(objects);
	Render();
	lateUpdate();
	

}

//Renders sprites and primitive shapes
function Render() {

	context.clearRect(0, 0, canvas.width, canvas.height);

	for (var i in objects) {

		var obj = objects[i];

		context.fillstyle = obj.colour;

		context.beginPath();
		context.arc(obj.Vec2.x + obj.center.x, obj.Vec2.y + obj.center.y, obj.radius, 0, Math.PI * 2);
		context.closePath();
		context.fill();


	}


}


function lateUpdate() {

	keysDownThisFrame = [];
	requestAnimationFrame(Update);
}

//Handles input
function inputHandler() {

	sud = slr = mud = mlr = 0;  

	sud = Number(getKey(controls.sdown)) - Number(getKey(controls.sup));
	slr = Number(getKey(controls.sright)) - Number(getKey(controls.sleft));

	mud = Number(getKey(controls.mdown)) - Number(getKey(controls.mup));
	mlr = Number(getKey(controls.mright)) - Number(getKey(controls.mleft));

	/* Other example
	 * 
	 * if (getKey(controls.sdown) && !getKey(conrols.sup)) sud = 1;
	 * if (!getKey(controls.sdown) && getKey(conrols.sup)) sud = -1;
	 * 
	 */


}


//Initialises the player. TODO: too much
function newPlayer() {
	var player = {
		type: "player",
		Vec2: newVec2(350, 250,this),
		center: newVec2(0, 0,this),
		movespeed: 1,
		moveVector: newVec2(0, 0, this),
		shootVector: newVec2(0, 0, this),
		hp: 100,
		maxhp: 100,
		energy: 100,
		maxenergy: 100,
		colour: "blue",
		radius: 8,
		shootint: 30,
		shootcounter: 0,
		id: null,
		circleCol: newcircleCol(this.radius, this),
		shoot: function () {

			if (slr == 0 && sud == 0 || this.shootVector.magnitude() == 0) {
				return;
			}

			this.shootVector = this.shootVector.normalised();

			var no = objects.push(newBullet(this.Vec2.x + this.shootVector.x * this.radius + 2, this.Vec2.y + this.shootVector.y * this.radius + 2, 2, 1, 2, this.shootVector));

			objects[no - 1].id = no - 1;

			this.shootcounter = 0;

		},
		update: function () {

			this.moveVector.x = mlr;
			this.moveVector.y = mud;

			this.shootVector.x = slr;
			this.shootVector.y = sud;

			this.move();

			this.shootcounter++;

			if (this.shootcounter >= this.shootint) {

				this.shoot();

			}
			

		}
	};
	subFuncs(player);
	return player;
}
//Initialises Bullets.
function newBullet(x,y,radius,damage,speed,moveVector) {
	var bul = {
		type: "bullet",
		Vec2: newVec2(x, y, this),
		center: newVec2(0, 0, this),
		radius: radius,
		colour: "red",
		piercing: 1,
		damage: damage,
		movespeed: speed,
		moveVector: moveVector,
		circleCol: newcircleCol(this.radius, this),
		id: null,
		update: function () {
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

		}

	};
	subFuncs(bul);
	return bul;
}

//Zombie Initialisation

function newZombie(x,y,size,health,damage) {


	return new Zombie(x, y, size, health, damage);

	/*var zom = {
		type: "zombie",
		Vec2: newVec2(x, y, this),
		center: newVec2(0, 0, this),
		radius: size/2,
		colour: "purple",
		damage: damage,
		health: health,
		movespeed: 1.5,
		moveVector: newVec2(0, 0, this),
		circleCol: newcircleCol(this.radius, this),
		id: null,
		update: function () {

			for (var i in objects) {

				if (i == this.id) {
					continue;
				}

				var hit = this.circleCol.colCheck(i);

				if (hit) {

					switch (objects[i].type) {

						case "bullet":
							this.health -= objects[i].damage;
							objects[i].piercing--;
							break;
						case "player":
							objects[i].health -= this.damage;
							this.destroy();
							break;

					}

				}

			}

			if (this.health >= 0) {

				this.destroy();

			}

			//BUM RUSH

		}


	};
	subFuncs(zom);
	return zom;*/

}


//Creates a Vector2 subObject
function newVec2(x,y,parent) {
	var Vec2 = {
		x: x,
		y: y,
		parent: parent,
		magnitude: function () {

			return diag(this.x, this.y);

		},
		normalised: function () {

			mag = this.magnitude();
			if (mag !== 0) {
				return newVec2(this.x/mag, this.y/mag, this.parent);
			} else {
				return newVec2(0, 0, this.parent);
			}
		}
	};
	return Vec2;
}

//Creates a circle collider subObject.
function newcircleCol(radius,parent) {
	var circleCol = {
		radius: radius,
		parent: parent,
		colCheck: function (objectId) {
			console.log(this.parent);
			var x1 = this.parent.Vec2.x;
			var y1 = this.parent.Vec2.y;
			var x2 = objects[objectId].Vec2.x;
			var y2 = objects[objectId].Vec2.y;
			if (distBetween(x1, y1, x2, y2, false) < radius + objects[objectId].circleCol.radius) {

				return true;

			} else {

				return false;

			}
		}
	};
	return circleCol;
}


function spawnZombieGroup(x, y, spread, size, health, damage, number) {

	var i = 0;

	while (i < number) {

		objects.push(newZombie(x + Randrange(-spread, spread, true), y + Randrange(-spread, spread, true), size, health, damage));
		i++;
	}

}

//Initalises general subfunctions for objects
function subFuncs() {

	this.move = function () {

		this.moveVector = this.moveVector.normalised();

		this.Vec2.x += this.moveVector.x * this.movespeed;
		this.Vec2.y += this.moveVector.y * this.movespeed;

	};

	this.destroy = function () {

		if (this.id != objects.length - 1) {
			for (i = this.id + 1; i < objects.length; i++) {
				objects[i].id--;
			}
		}
		objects.splice(this.id, 1);

	};

}

function Randrange(low, high, int) {

	var rand = Math.random();
	var range = high - low;

	var gen = (rand * range) - low;

	if (int) {

		return Math.floor(gen);

	} else {

		return gen;

	}


}


//Measures the distance between two points. USES SQRT
function distBetween(x1, y1, x2, y2, Vec2) {

	var distx = x1 - x2;
	var disty = y1 - y2;

	if (Vec2) {

		return newVec2(distx, disty, null);

	} else {

		return diag(distx,disty);

	}
}


//Pythagoras, what else?
function diag(x, y) {


	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

}



//Checks for keys being down on the frame they are pressed.
function keyDownHandler(event) {

	if (!event.repeat) {
		keysDown.push(event.code);
		keysDownThisFrame.push(event.code);

	}


	//console.log(keysDown);
	//console.log(keysDownThisFrame);

}

//Checks for keys being up on the frame they are released
function keyUpHandler(event) {

	for (var i = 0; i < keysDown.length; i++) {

		if (event.code === keysDown[i]) {
			keysDown.splice(i, 1);
			i--;
		}

	}

}


//Universal function for getting a key that is currently down.
function getKey(key) {

	for (var i = 0; i < keysDown.length; i++) {

		if (key === keysDown[i]) {
			return true;
		}

	}
	return false;

}


//Like above, but for keys on the current frame instead.
function getKeyDown(key) {

	for (i = 0; i < keysDownThisFrame.length; i++) {

		if (key === keysDownThisFrame[i]) {
			return true;
		}

	}
	return false;

}