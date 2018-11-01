// JavaScript source code


//DAY 1: Imported useful functions, made some new ones and set up drawing, movement and shooting for the player. Made circle collision detection. Need to figure out why everything is black, though.
//DAY 2: Made multiple .js files. Cleaned up code, retooled the object system, created Zombies and their spawning system. Zombie AI now fully implemented.
//DAY 3: Added a circleRenderer object making it so I can make invisible and other types of shapes in the future, modified the circleCol object to not require every object has one and added in a new canvas for HUD.
console.log("Group 1 Reporting");
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var objects = [];

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
	sright: "ArrowRight"

};

var no = objects.push(new Player());
objects[no - 1].id = no - 1;
no = objects.push(new director());
objects[no - 1].id = no - 1;


loadHandler();

//For futureproofing. If I implement sprite loading, this will come in handy.
function loadHandler() {
	window.addEventListener("keydown", keyDownHandler, false);
	window.addEventListener("keyup", keyUpHandler, false);

	spawnZombieGroup(100, 100, 30, 8, 1, 5, 5);

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

		if (obj.circleRenderer != undefined) {
			//console.log("rendering " + i);
			obj.circleRenderer.draw();

		}


	}


}

//Executed after rendering
function lateUpdate() {

	keysDownThisFrame = [];
	requestAnimationFrame(Update);
}