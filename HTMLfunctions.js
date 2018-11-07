// JavaScript source code
document.getElementById("spl").addEventListener("click", function(){
	buyspl = true;
});
var sp = document.getElementById("sp");
document.getElementById("ssp").addEventListener("click", function(){
	buyssp = true;
});
var ss = document.getElementById("ss");
document.getElementById("dmg").addEventListener("click", function(){
	buydmg = true;
});
var dm = document.getElementById("dm");
document.getElementById("sup").addEventListener("click", function(){
	buysup = true;
});
var su = document.getElementById("su");
document.getElementById("fri").addEventListener("click", function(){
	buyfri = true;
});
var fr = document.getElementById("fr");
var bzc = document.getElementById("bzc");

var buyspl = false;
var buyssp = false;
var buydmg = false;
var buysup = false;
var buyfri = false;



function HTMLUpdate(){

	if (buyspl) {
		objects[3].upgrade(0);
	}
	if (buyssp) {
		objects[3].upgrade(1);
	}
	if (buydmg) {
		objects[3].upgrade(2);
	}
	if (buysup) {
		objects[3].upgrade(3);
		
	}
	if (buyfri) {
		objects[3].upgrade(4);
		
	}

	bzc.innerText = "Brouzouf: " + brouzouf;
	if (!objects[3].split.capped) {
		sp.innerText = " " + objects[3].split.cost + "Bz " + objects[3].split.level + "/" + objects[3].split.cap + " Splitter";
	} else {
		sp.innerText = " " + objects[3].split.level + "/" + objects[3].split.cap + " Splitter";
	}

	if (!objects[3].shootspeed.capped) {
		ss.innerText = " " + objects[3].shootspeed.cost + "Bz " + objects[3].shootspeed.level + "/" + objects[3].shootspeed.cap + " Shooting Speed";
	} else {
		ss.innerText = " " + objects[3].shootspeed.level + "/" + objects[3].shootspeed.cap + " Shooting Speed";
	}

	if (!objects[3].damage.capped) {
		dm.innerText = " " + objects[3].damage.cost + "Bz " + objects[3].damage.level + "/" + objects[3].damage.cap + " Damage";
	} else {
		dm.innerText = " " + objects[3].damage.level + "/" + objects[3].damage.cap + " Damage";
	}

	if (!objects[3].spray.capped) {
		su.innerText = " " + objects[3].spray.cost + "Bz " + objects[3].spray.level + "/" + objects[3].spray.cap + " Spray Upgrade";
	} else {
		su.innerText = " " + objects[3].spray.level + "/" + objects[3].spray.cap + " Spray Upgrade";
	}

	if (!objects[3].friends.capped) {
		fr.innerText = " " + objects[3].friends.cost + "Bz " + objects[3].friends.level + "/" + objects[3].friends.cap + " Friends";
	} else {
		fr.innerText = " " + objects[3].friends.level + "/" + objects[3].friends.cap + " Friends";
	}


	buyspl = false;
	buyssp = false;
	buydmg = false;
	buysup = false;
	buyfri = false;
}