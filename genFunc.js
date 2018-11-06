// JavaScript source code

var keysDown = [];
var keysDownThisFrame = [];

//Selects a random integer/float from a range
function Randrange(low, high, int) {

	var rand = Math.random();
	var range = high - low;

	var gen = (rand * range) + low;

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

		return [distx, disty];

	} else {

		return diag(distx, disty);

	}
}


//Pythagoras, what else? USES SQRT
function diag(x, y) {


	return Math.sqrt((x * x) + (y * y));

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

//Zero Buffering
function ZeroBuffer(num, length) {
	if (num == null) { num = 0 };
	var no = num.toString();
	var zerostoadd = length - no.length;
	for (i = 0; i < zerostoadd; i++) {
		no = "0" + no;
	}
	return no;
}
