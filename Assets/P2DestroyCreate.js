#pragma strict

//Variable to access and destroy battle scene.
var explode : GameObject;
explode = GameObject.Find("Fight");

//Variable to access explosion prefab and GameObject p2Ship.
var explosionPrefab : GameObject;
var p2Ship : GameObject;

//var clone : GameObject; // now available for all functions.
var timer : float;
var explosion : GameObject;

var explosionSwitch : boolean;

function Start () {
	explosionSwitch = false;
	timer = 3.0;
}

function Hit () {
	explosion = Instantiate(explosionPrefab, transform.position, transform.rotation);
	explosionSwitch = true;
	Destroy(p2Ship);
}

function LateUpdate () {
	if (explosionSwitch) {
		if (timer > 0)
			timer -= Time.deltaTime;
		else if (timer <= 0) {
			print ("We have a winner!");
			Destroy (explode);
		}
	}
}