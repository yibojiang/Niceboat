#pragma strict

function EventStart(){
	var pc:PlayerController= PlayerController.Instance();
	pc.controlOn=false;
	Debug.Log("Event "+this.gameObject.name+" starts.");
}



function EventEnd(){
	var pc:PlayerController= PlayerController.Instance();
	pc.controlOn=true;
	Debug.Log("Event "+this.gameObject.name+" ends.");
}