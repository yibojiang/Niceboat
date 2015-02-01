#pragma strict
import System.Collections.Generic;
var lightening:Lightening;

var energy:float;


var ltnlist:List.<Lightening>;

var speed:float;

var spawnInterval:float;

var width:float;


var toggle:float;
var interval:float;

var randomX:float;
var randomY:float;
var dir:Vector2;
var randomAngleRange:float=Mathf.PI/5;

function Start () {

}

function GenerateLightening(_pos:Vector3,_energy:float,_dir:Vector2){
	var l:Lightening=Instantiate(lightening);
	l.transform.parent=transform;
	l.transform.localPosition=Vector3.zero;
	l.energy=_energy;
	l.lg=this;
	l.Emit(_pos);
	l.dir=_dir;
	l.speed=speed;
	l.randomAngleRange=randomAngleRange;
	l.spawnInterval=spawnInterval;
	var lwidth:float=_energy;
	lwidth=Mathf.Clamp(lwidth,0.05,0.1);
	lwidth*=width;
	l.line.SetWidth(lwidth,lwidth);
	ltnlist.Add(l);

	//Debug.Log("generate dir: "+_dir);
}

function Update () {

	//var tmpDir:Vector2=Vector2(Random.value-0.5,-1);
	//var tmpDir:Vector2=Vector2(-1,Random.value-0.5);

	toggle+=Time.deltaTime;
	if (toggle>interval){
		toggle-=interval;
		//GenerateLightening(Vector3(Random.Range(-8,8),0,0),energy,tmpDir);
		GenerateLightening(Vector3( transform.position.x+Random.Range(-randomX,randomX),transform.position.y+Random.Range(-randomY,randomY),transform.position.z),energy,dir);
	}

	/*
	if (Input.GetKeyDown(KeyCode.L)){
		GenerateLightening(Vector3( transform.position.x+Random.Range(-randomX,randomX),transform.position.y+Random.Range(-randomY,randomY),transform.position.z),energy,dir);
	}
	*/

}