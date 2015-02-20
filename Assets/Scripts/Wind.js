#pragma strict

var force:Vector3;

var cloth:InteractiveCloth;

function Start () {

}

function Update () {
	//cloth.AddForce(force);
	cloth.randomAcceleration =force;
}