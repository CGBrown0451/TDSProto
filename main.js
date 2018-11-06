// JavaScript source code


//DAY 1: Imported useful functions, made some new ones and set up drawing, movement and shooting for the player. Made circle collision detection. Need to figure out why everything is black, though.
//DAY 2: Made multiple .js files. Cleaned up code, retooled the object system, created Zombies and their spawning system. Zombie AI now fully implemented.
//DAY 3: Added a circleRenderer object making it so I can make invisible and other types of shapes in the future, modified the circleCol object to not require every object has one and added in a new canvas for HUD. Made a start on the AI Director which moderates enemy population. Spawns zombies in large groups. Fixed the 100% black problem
//DAY 4: Finished AI Director for Zombies. Added a line and rectangle renderer. Finished HTML formatting for canvasses. Made all renderers able to render on any of the canvasses.
console.log("Group 1 Reporting");

var canvas = [];
var context = [];

canvas.push(document.getElementById("canvas"));
context.push(canvas[0].getContext('2d'));

canvas.push(document.getElementById("leftHUD"));
context.push(canvas[1].getContext('2d'));

canvas.push(document.getElementById("botHUD"));
context.push(canvas[2].getContext('2d'));

var objects = [];

var pause = false;
var gameover = false;
var score = 0;

var controls = {

	mup: "KeyW",
	mdown: "KeyS",
	mleft: "KeyA",
	mright: "KeyD",
	sup: "ArrowUp",
	sdown: "ArrowDown",
	sleft: "ArrowLeft",
	sright: "ArrowRight",
	pause: "Escape"

};

var no = objects.push(new Player());
objects[no - 1].id = no - 1;
no = objects.push(new director());
objects[no - 1].id = no - 1;
no = objects.push(new HUD());
objects[no - 1].id = no - 1;



loadHandler();

//For futureproofing. If I implement sprite loading, this will come in handy.
function loadHandler() {
	window.addEventListener("keydown", keyDownHandler, false);
	window.addEventListener("keyup", keyUpHandler, false);

	//spawnZombieGroup(100, 100, 30, 8, 1, 5, 5);

	Update();

}

var sud, slr, mud, mlr;

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

//Main Game Loop
function Update() {

	inputHandler();

	if (getKeyDown(controls.pause)) {
		pause = !pause;
	}

	if (pause) {

		//Do pause stuff

	} else {

		for (var i in objects) {
			objects[i].update();
		}
	}
	//console.log(objects);
	Render();
	lateUpdate();
	

}

//Renders sprites and primitive shapes
function Render() {

	context[0].clearRect(0, 0, canvas[0].width, canvas[0].height);
	context[1].clearRect(0, 0, canvas[1].width, canvas[1].height);
	context[2].clearRect(0, 0, canvas[2].width, canvas[2].height);
	for (var i in objects) {
		var obj = objects[i];
		if (obj.renderers.length > 0) {
			for (j in obj.renderers) {

				obj.renderers[j].draw();

			}

		}

	}


}

//Executed after rendering
function lateUpdate() {

	keysDownThisFrame = [];
	requestAnimationFrame(Update);
}