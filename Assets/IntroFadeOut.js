#pragma strict

//Public variables.
var fadeButton : boolean;
var titleOut : boolean;
var fadeOutTexture : Texture2D;
var fadeSpeed = 0.3;
var alpha : float; 
var fadeDir : float = -1;
var fadeTimer : float;
var drawDepth = -1000;
var style : GUIStyle;
var scoreText : String;

//Fades GUI element out.
function fadeOut() {
	fadeDir = -1;	
}

//Fades GUI element in.
function fadeIn() {
	fadeDir = 1;	
}

//Please add all 
function Start () {
	fadeButton = true;
	alpha = 1;
	fadeOut();
	titleOut = false;
	fadeTimer = 1;
	scoreText = "Score: 0";
}

//When player hits the spacebar, title will begin to fade out.
function Update () {
	if (fadeButton) {
		if (Input.GetKeyDown("space")) {
			fadeButton = false;
			print("Space Bar");
		}
	}
}

//You can ignore this.  It's just stores the variable scoreText in to the other script.
function ScoreTransfer (text : String) {
	scoreText=text;
}

//Replace with the OnGUI that you had. If you added anything since then, please apply it in "else if (titleOut) {".
function OnGUI () {
    if (!fadeButton && alpha > 0) {
		GUI.color.a = alpha;
		GUI.depth = drawDepth;
		print ("Alpha: " + alpha);	
		if (fadeTimer > 0)
			fadeTimer-= Time.deltaTime;
		else {
			alpha += fadeDir * fadeSpeed * Time.deltaTime;	
			alpha = Mathf.Clamp01(alpha);
		}
		if (alpha <= 0)
			titleOut = true; //When alpha is <= 0, then title will never be displayed again.
    }
    if (!titleOut)
    	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), fadeOutTexture, ScaleMode.ScaleAndCrop);
    else if (titleOut) {//Add any additional GUI elements in this block of code.
    	GUI.color.a = 1;
    	GUI.Label (Rect (20, 20, 500, 200), scoreText.ToString(),style);
    }
}