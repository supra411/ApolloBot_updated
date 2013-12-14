#pragma strict

var explosionPrefab : GameObject;
var clone : GameObject; // now available for all functions.
var timer : float = 2.0;
var explosion : GameObject;

function Hit () {
	explosion = Instantiate(explosionPrefab, transform.position, transform.rotation);
	Destroy(explosion, 0.75);
}