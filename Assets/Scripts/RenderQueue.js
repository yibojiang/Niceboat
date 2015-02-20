#pragma strict
var renderQueue:int;

@script ExecuteInEditMode()
function Start () {
	renderer.sharedMaterial.renderQueue=renderQueue;
}

function Update () {
	
}