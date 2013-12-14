#pragma strict

var laserActive : boolean;
var laser : LineRenderer;
var laserDist : float; //Length = Vector3 distance between p1 and p2. 
var laserCt : float; //Size of laser as a ratio to laserDist. So laserCt is always between 0 and 1.
var laserSpeed : float = 2; //Speed of laser.  Higher = slower.
var destroyShip : boolean; //Sets explosion for single shot or destruction of ship.
var playerHit : int;

var p1 : Transform;
var p2 : Transform;
var winner : Transform;
var loser : Transform;

var p2Explosion : GameObject;
p2Explosion = GameObject.Find("p2Explosion");
var P2ExplosionCreate : P2ExplosionCreate;
P2ExplosionCreate = p2Explosion.GetComponent("P2ExplosionCreate");

var p1Explosion : GameObject;
p1Explosion = GameObject.Find("p1Explosion");
var P1ExplosionCreate : P1ExplosionCreate;
P1ExplosionCreate = p1Explosion.GetComponent("P1ExplosionCreate");

var p1Destroy : GameObject;
p1Destroy = GameObject.Find("p1Destroy");
var P1DestroyCreate : P1DestroyCreate;
P1DestroyCreate = p1Destroy.GetComponent("P1DestroyCreate");

var p2Destroy : GameObject;
p2Destroy = GameObject.Find("p2Destroy");
var P2DestroyCreate : P2DestroyCreate;
P2DestroyCreate = p2Destroy.GetComponent("P2DestroyCreate");

//function Start () {
////	destroyShip = false;
////	laserActive = false;
////	laser = GetComponent(LineRenderer);//Set variable laser as the component LineRenderer in GameObject.
////	laser.SetPosition (0, winner.position);//Start at p1's position (index is 0).
//	laser.SetWidth(.2, .2);//Width of line.
////	laserDist = Vector3.Distance(winner.position, loser.position);//Sets laserDist as the distance between p1 and p2.
//}

function LaserShot (playerWin : int, destroy : boolean){
	if (playerWin == 1) {
		winner = p1;
		loser = p2;
		playerHit = 2;
		print ("p1 lasers p2.");
	}
	else if (playerWin == 2) {
		winner = p2;
		loser = p1;
		playerHit = 1;
		print ("p2 lasers p1.");
	}
	laser = GetComponent(LineRenderer);//Set variable laser as the component LineRenderer in GameObject.
	laser.SetPosition (0, winner.position);//Start at p1's position (index is 0).
	laser.SetWidth(.2, .2);//Width of line.
	laserDist = Vector3.Distance(winner.position, loser.position);//Sets laserDist as the distance between p1 and p2.
	destroyShip = destroy;
	laserCt = 0;
	laserActive = true;
	laser.enabled = true;
	print ("Laser on.");
}

function Update () {
	if (laserActive) {
		if (laserCt <= 1) {
			laserCt += .1 / laserSpeed; //laserCt keeps moving up to 1.
			/*x is the length of 0 and laserDist, multiple by the percentage of laserCt.
			**Mathf.Lerp = Interpolates between a and b by t. t is clamped between 0 and 1.
			*/
			var x : float = Mathf.Lerp (0, laserDist, laserCt);
			var winnerPos : Vector3 = winner.position; //P1's position.
			var loserPos : Vector3 = loser.position; //P2's position.
			/*laserMove is size of laser as it goes towards p2.
			**Normalize makes sure the vector keeps the same direction but its length is 1.0.
			*/
			var laserMove : Vector3 = x * Vector3.Normalize (loserPos - winnerPos) + winnerPos; 
			laser.SetPosition (1, laserMove);
		}
		else if (laserCt > 1) {
			print ("Turning laser off.");
			if (playerHit == 1) {
				if (!destroyShip)
					P1ExplosionCreate.Hit();
				else if (destroyShip)
					P1DestroyCreate.Hit();
			}
			else if (playerHit == 2) {
				if (!destroyShip)
					P2ExplosionCreate.Hit();
				else if (destroyShip)
					P2DestroyCreate.Hit();
			}
			laserActive = false;
			laser.enabled = false;
		}
	}
}