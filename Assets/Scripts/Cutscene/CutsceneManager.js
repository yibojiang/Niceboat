#pragma strict

private static var instance : CutsceneManager;
 
public static function Instance() : CutsceneManager
{
    if (instance == null)
        instance =GameObject.FindObjectOfType(CutsceneManager) as CutsceneManager;
    return instance;
}

class Cutscene{
	var id:int;
	var sequences=new List.<CutsceneSequence>();
	
	function TriggerCutscene(){
		var i:int;
		for (i=0;i<sequences.Count;i++){
			sequences[i].PerformAction();
			while (sequences[i].isPlaying){
				yield;
			}
		}
	}
}

var cutscenes=new List.<Cutscene>();

function TriggerCutscene(_id:int){
	var i:int;
	for (i=0;i<cutscenes.Count;i++){
		if (cutscenes[i].id==_id){
			cutscenes[i].TriggerCutscene();
			break;
		}
	}
}