#pragma strict


var xOffset:float=1;
var yOffset:float=1;
var zOffset:float=1;
var xFrequent:float=1;
var yFrequent:float=1;
var zFrequent:float=1;
function Start () {

}

function Update () {
	transform.localPosition.x=xOffset*Mathf.Sin(xFrequent*Time.time);
	transform.localPosition.y=yOffset*Mathf.Sin( (yFrequent*Time.time)+Mathf.PI/2 );
	transform.localPosition.z=zOffset*Mathf.Sin( (zFrequent*Time.time)+Mathf.PI/2 );
}