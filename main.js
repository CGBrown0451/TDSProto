// JavaScript source code


//DAY 1: Imported useful functions and set up the canvas. Started on movement
console.log("Group 1 Reporting");
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');


var objects = [];

objects.push(newPlayer());




//Initialises the player. TODO: too much
function newPlayer() {
	var player = {

		Vec2: newVec2(350, 250,this),
		center: newVec2(8, 8,this),
		circleCol: newcircleCol(center, radius, this),
		movespeed: 1,
		moveVector: newVec2(0, 0, this),
		hp: 100,
		maxhp: 100,
		energy: 100,
		maxenergy: 100,
		move: function () {

			this.moveVector.normalise();

			this.Vec2.x += this.moveVector.x * this.movespeed;
			this.Vec2.y += this.moveVector.y * this.movespeed;

		},
		shoot: function () {



		}
	};
	return player;
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