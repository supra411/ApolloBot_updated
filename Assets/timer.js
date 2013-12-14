#pragma strict
var timer : float = 10;
var choiceActive : boolean;

function Start () {
	choiceActive = true;
	TestMe(choiceActive);
}

function TestMe (choiceActive : boolean) {
	if (choiceActive) {
		Debug.Log ("Inside");	
	}
	else {
		Debug.Log ("Outside");
	}
}

function Update () {
	TestMe (choiceActive);
	if (choiceActive) {
		if (timer > 0)
			timer -= Time.deltaTime;
		else if (timer <= 0) {
			Debug.Log ("Ending Loop");
			choiceActive = false;
		}
	}
}