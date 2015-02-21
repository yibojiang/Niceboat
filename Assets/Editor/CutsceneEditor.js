#pragma strict
@CustomEditor (CutsceneManager)
public class CutsceneEditor extends Editor{

	function OnInspectorGUI(){
        DrawDefaultInspector();
        var myScript : CutsceneManager = target;

        if(GUILayout.Button("Add Cutscene")){
        	var cutscene:Cutscene=new Cutscene();
        	myScript.cutscenes.Add(cutscene);
        }
    }
}

