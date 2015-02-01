#pragma strict
var line:LineRenderer;
var vertexCount:int;

var color:Color;
var frequent:float;
var amplitude:float=1;
var offset:float;
var dir:int=1;
//var randomAmplitude:float;

@script ExecuteInEditMode()
function Start () {

}

function Update () {
	line.SetColors(color,color);
	line.SetVertexCount(vertexCount);

	
	var i:int;
	for(i=0;i<vertexCount;i++){
		var pos:Vector3;
		pos.x=25.0*i/vertexCount;
		pos.y=(amplitude)*Mathf.Sin(dir* Time.time*frequent+i+offset);
		line.SetPosition(i,pos);
	}
}