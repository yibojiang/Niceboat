#pragma strict

var minPow:float=0.7;
var maxPow:float=0.9;
var flickerInterval:float=0.05;
private var flickerToggle:float;



function Start () {

}

function Update () {
	flickerToggle+=Time.deltaTime;
	if (flickerToggle>flickerInterval){
		flickerToggle-=flickerInterval;
		light.intensity=Random.Range(minPow,maxPow);
	}

	
	
}