#pragma strict
import System.Collections.Generic;

var dialogGroups=new List.<DialogGroup>();

function Start(){
	var character:Character=GetComponent.<Character>();
	var i:int;
	var j:int;
	for (i=0;i<dialogGroups.Count;i++){
		for (j=0;j<dialogGroups[i].choices.Count;j++){
			dialogGroups[i].choices[j].action=character.TriggerOptionDialog(dialogGroups[i].choices[j].dialogGroupId);
		}
	}
}

function GetDialogGroupById(_id:int):DialogGroup{
	var i:int;
	for (i=0;i<dialogGroups.Count;i++){
		if (_id==dialogGroups[i].id){
			return dialogGroups[i];
		}
	}
}