#pragma strict

var style:GUIStyle;

var IntroFadeOut : IntroFadeOut;
IntroFadeOut = gameObject.GetComponent("IntroFadeOut");

function Start () {

}

function Update () {
//transform.Translate(Vector3.forward * Time.deltaTime);
//transform.Translate(Vector3.up * Time.deltaTime);

		// Set specular shader
		renderer.material.shader = Shader.Find ("Specular");
		// Set red specular highlights
		
		if (Input.GetKeyDown ("r"))
			renderer.material.SetColor ("_Color", Color.red);
			
			if (Input.GetKeyDown ("g"))
			renderer.material.SetColor ("_Color", Color.green);
			
			if (Input.GetKey ("k"))
				transform.Translate(Vector3.right * (Time.deltaTime*50));
				if (Input.GetKey ("j"))
				transform.Translate(Vector3.right * -(Time.deltaTime*50));
				if (Input.GetKey ("l"))
				transform.Rotate(Vector3.up * (Time.deltaTime*50));
				if (Input.GetKey ("h"))
				transform.Rotate(Vector3.up * -(Time.deltaTime*50));
				
				if (Input.GetKey ("u"))
				transform.Translate(Vector3.forward * (Time.deltaTime*50));
				if (Input.GetKey ("m"))
				transform.Translate(Vector3.forward * -(Time.deltaTime*50));
				
				if(Input.GetKeyDown("s")) {
				transform.parent.rigidbody.angularVelocity = Vector3(0,0,0);
				transform.parent.rigidbody.velocity = Vector3(0,0,0);
				transform.eulerAngles = Vector3(360,0.6596069,360);
				}
				
				
				if (Input.GetKey ("i"))
				transform.Translate(Vector3.up * (Time.deltaTime*50));
				
				
				if (Input.GetKey ("d"))
					Application.LoadLevel ("SpaceBattle");
				if (Input.GetKey ("f"))
					Application.LoadLevel ("scene1");
				
				if (Input.GetKey ("o"))
				transform.Translate(Vector3.up * -(Time.deltaTime*50));
				
				
}

var score = 0;
var scoreText = "Score: 0";

function OnTriggerEnter( other : Collider ) {
    Debug.Log("OnTriggerEnter() was called");
    if (other.tag == "Coin") {
        Debug.Log("Other object is a coin");
        score += 1;
        scoreText = "Score: " + score;
        IntroFadeOut.ScoreTransfer (scoreText);
        Debug.Log("Score is now " + score);
        Destroy(other.gameObject);
        var dice= Random.Range(0,10);
        if (dice>5){
				Application.LoadLevelAdditive("SpaceBattle");
				}
    }
}

//function OnTriggerEnter (other : Collider) { other.transform.parent = gameObject.transform; Debug.Log("foo"); } 
//function OnTriggerExit (other : Collider) { other.transform.parent = null; Debug.Log("bar");}