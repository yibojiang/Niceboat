#pragma strict

var frequent:float=1;
var amplitude:float=1;
var hover:boolean;

function Hover(){
	hover=true;
	StartCoroutine(DoHover() );
}

function DoHover(){
	//var toggle:float;
	var startPos:float=transform.position.y;
	while (hover){
		transform.position.y=startPos+amplitude*Mathf.Sin(frequent*Time.time);
		yield WaitForEndOfFrame();
	}
}

function StopHover(){
	hover=false;
}

function Start () {
	Hover();
}

function Update () {

}