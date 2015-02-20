#pragma strict

var needle:Transform;
var compass:Transform;
var target:Transform;

function Start () {

}

function Update () {
	//compass.rotation=target.rotation;
	
	//needle.eulerAngles.z=Mathf.Lerp(needle.eulerAngles.z,-target.eulerAngles.z,0.9);
	needle.rotation=Quaternion.Lerp(needle.rotation,Quaternion.Inverse(target.rotation) ,0.9);
}