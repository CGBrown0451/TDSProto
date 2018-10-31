// JavaScript source code





function Zombie(x, y, size, health, damage) {

	this.type = "Zombie";
	this.Vec2 = new Vec2(x, y, this);
	this.center = new Vec2(0, 0, this);
	this.radius = size / 2;
	this.health = health;
	this.damage = damage;
	this.colour = "purple";
	this.id = null;
	this.circleCol = new circleCol(this.radius, this);
	this.update = function () {

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

	};
	subFuncs();
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
			return newVec2(this.x / mag, this.y / mag, this.parent);
		} else {
			return newVec2(0, 0, this.parent);
		}
	};
}

//Creates a circle collider subObject.
function circleCol(radius, parent) {

	this.radius = radius,
	this.parent = parent,
	this.colCheck = function (objectId) {
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
	};
}