#pragma strict

import System.Collections.Generic;
var lg:LighteningGenerator;
var energy:float;


var spawnToggle:float;
var spawnInterval:float;


var line:LineRenderer;

var vetPos:List.<Vector3>;

var dir:Vector2;

var speed:float;

var alive:boolean;
var randomAngleRange:float;

function Awake(){
	line=GetComponent(LineRenderer) as LineRenderer;
	vetPos=new List.<Vector3>();
}



function Start () {

}

function Emit(_pos:Vector3){
	vetPos.Add(_pos);
	spawnToggle=0;
	alive=true;
	//spawnInterval=Random.Range(0.02,0.03);
}

function Update () {
	if (alive){
		var i:int;
		var nextDir:Vector2;
		var randomAngle:float;

		line.SetVertexCount(vetPos.Count);
		for(i  = 0; i < vetPos.Count; i++) {
			line.SetPosition(i, vetPos[i] );
		}

		if (energy>0){
			energy-=Time.deltaTime;	
			spawnToggle+=Time.deltaTime;
			if (spawnToggle>=spawnInterval){
				spawnToggle-=spawnInterval;

				randomAngle=Random.Range(-Mathf.PI/6,Mathf.PI/6);
				
				nextDir.x=dir.x*Mathf.Cos(randomAngle)-dir.y*Mathf.Sin(randomAngle);
				nextDir.y=dir.x*Mathf.Sin(randomAngle)+dir.y*Mathf.Cos(randomAngle);

				lg.GenerateLightening(vetPos[vetPos.Count-1],energy/2,nextDir);
			}

			//randomAngle=Random.Range(-Mathf.PI/6,Mathf.PI/6);
			//randomAngle=Random.Range(-Mathf.PI/6,Mathf.PI/6);
			randomAngle=Random.Range(-randomAngleRange,randomAngleRange);
			//Debug.Log(randomAngle*Mathf.Rad2Deg);
			nextDir.x=dir.x*Mathf.Cos(randomAngle)-dir.y*Mathf.Sin(randomAngle);
			nextDir.y=dir.x*Mathf.Sin(randomAngle)+dir.y*Mathf.Cos(randomAngle);
			var nextPos:Vector3=vetPos[vetPos.Count-1]+speed*Vector3(nextDir.x,nextDir.y,0);
			vetPos.Add(nextPos);
		}
		else{
			alive=false;
			FadeAndDestroy();		
		}
	}
}


function FadeAndDestroy(){

	//Debug.Log("FadeAndDestroy");
	var fadeToggle:float=0;
	var fadeDuration:float=1;

	var color:Color=Color.white;
	while(fadeToggle<fadeDuration){
		fadeToggle+=Time.deltaTime;
		color.a=1-fadeToggle/fadeDuration;

		line.SetColors(color,color);
		yield WaitForEndOfFrame();
	}

	lg.ltnlist.Remove(this);
	Destroy(this.gameObject);
}

function SpawnLigtenning(){

}