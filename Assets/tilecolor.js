#pragma strict

function Start () {

}

function Update () {

		// Set specular shader
		renderer.material.shader = Shader.Find ("Specular");
		// Set red specular highlights
		
		if (Input.GetKeyDown ("r"))
			renderer.material.SetColor ("_Color", Color.red);
			
			if (Input.GetKeyDown ("g"))
			renderer.material.SetColor ("_Color", Color.green);
			
			if (Input.GetKeyDown ("b"))
			renderer.material.SetColor ("_Color", Color.blue);
			
			if (Input.GetKeyDown ("y"))
			renderer.material.SetColor ("_Color", Color.yellow);
		
}