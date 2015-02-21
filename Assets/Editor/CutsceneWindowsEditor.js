#pragma strict
class CutsceneWindowEditor extends EditorWindow {
    @MenuItem ("CustomEditor/CutsceneEditor")
    static function ShowWindow () {
        EditorWindow.GetWindow ( CutsceneWindowEditor);
    }

    var curCutsceneIndex:int=0;
    var curSequenceIndex:int=0;
    var dlgInfoIndex:int=0;
    var curSeq:CutsceneSequence;
    var curCutscene:Cutscene;
    var dlgIdIndex:int=0;
    var i:int;
    function OnGUI () {
    	var csm:CutsceneManager=CutsceneManager.Instance();
    	
    	

    	GUILayout.BeginVertical();
    		GUILayout.BeginHorizontal(GUILayout.Width(200) );
    			GUILayout.Label("Cutscene: ");	
    			if (GUILayout.Button("+cutScene",GUILayout.Width(100) ) ){
	    			var scene:Cutscene=new Cutscene();
	    			csm.cutscenes.Add(scene);
	    			curCutsceneIndex=csm.cutscenes.Count-1;
	    		}

	    		if (GUILayout.Button("-cutScene",GUILayout.Width(100) ) ){
	    			csm.cutscenes.RemoveAt(curCutsceneIndex);
	    		}
    		GUILayout.EndHorizontal();

    		GUILayout.BeginHorizontal(GUILayout.Width(200) );

	    		var sceneSelStrings:String[];
				sceneSelStrings=new String[csm.cutscenes.Count];

				for (i=0;i<csm.cutscenes.Count;i++){
					sceneSelStrings[i]=csm.cutscenes[i].id.ToString();
				}

				curCutsceneIndex=GUILayout.SelectionGrid (curCutsceneIndex, sceneSelStrings, sceneSelStrings.Length);

		    	curCutsceneIndex=Mathf.Clamp(curCutsceneIndex,0,csm.cutscenes.Count-1);

		    	curCutscene=csm.cutscenes[curCutsceneIndex];


	    	GUILayout.EndHorizontal();
	    	//GUILayout.Label("Cutscene ID: "+curCutScene.id);
	    	
    		curCutscene.id=EditorGUILayout.IntField("Cutscene ID",curCutscene.id,GUILayout.Width(200) );

    		
    		GUILayout.BeginHorizontal(GUILayout.Width(200) );
    			GUILayout.Label("Sequences: "+curSequenceIndex);
    			if (GUILayout.Button("+Seq",GUILayout.Width(100) ) ){
	    			var seq:CutsceneSequence=new CutsceneSequence();
	    			curCutscene.sequences.Add(seq);
		    		curSequenceIndex=curCutscene.sequences.Count-1;
	    		}

	    		if (GUILayout.Button("-Seq",GUILayout.Width(100) ) ){
	    			curCutscene.sequences.Remove(curSeq);
	    		}
    		GUILayout.EndHorizontal();

    		GUILayout.BeginHorizontal(GUILayout.Width(200) );
    			var seqSelStrings:String[];
				seqSelStrings=new String[curCutscene.sequences.Count];
				for (i=0;i<curCutscene.sequences.Count;i++){
					seqSelStrings[i]=curCutscene.sequences[i].type.ToString();
				}

				curSequenceIndex=GUILayout.SelectionGrid (curSequenceIndex, seqSelStrings, seqSelStrings.Length);

	    		

		    	if (curCutscene.sequences.Count>0){
	    			curSequenceIndex=Mathf.Clamp(curSequenceIndex,0,curCutscene.sequences.Count-1);
	    			curSeq=curCutscene.sequences[curSequenceIndex];
	    		}
	    		else {
	    			curSequenceIndex=0;	
	    		}

	    	GUILayout.EndHorizontal();

	    	if (curSeq!=null){
	    		curSeq.type=EditorGUILayout.EnumPopup("Sequence Type: ",curSeq.type,GUILayout.Width(300));
	    		if (curSeq.type==CutsceneSequenceType.Dialog){
	    			GUILayout.BeginHorizontal(GUILayout.Width(200) );
	    				GUILayout.Label("Dialog: "+dlgInfoIndex);

						if (GUILayout.Button("+Dialog Info",GUILayout.Width(100) ) ){
							var dlgInfo:DialogInfo=new DialogInfo();
							curSeq.dialogInfos.Add(dlgInfo);
							dlgInfoIndex=curSeq.dialogInfos.Count-1;
						}

						if (GUILayout.Button("-Dialog Info",GUILayout.Width(100) ) ){
							curSeq.dialogInfos.RemoveAt(dlgInfoIndex);
						}
	    			GUILayout.EndHorizontal();
	    			GUILayout.BeginHorizontal(GUILayout.Width(200) );

			    		var dlgSelStrings:String[];
						dlgSelStrings=new String[curSeq.dialogInfos.Count];
						for (i=0;i<curSeq.dialogInfos.Count;i++){
							dlgSelStrings[i]=curSeq.dialogInfos[i].characterId.ToString()+":"+curSeq.dialogInfos[i].dialogId.ToString();
						}

						dlgInfoIndex=GUILayout.SelectionGrid (dlgInfoIndex, dlgSelStrings, dlgSelStrings.Length);

	    				

						if (curSeq.dialogInfos.Count>0){
		    				dlgInfoIndex=Mathf.Clamp(dlgInfoIndex,0,curSeq.dialogInfos.Count-1);
		    				var curDialogInfo:DialogInfo=curSeq.dialogInfos[dlgInfoIndex];
	    				}
	    				else{
	    					dlgInfoIndex=0;
	    				}
					
					GUILayout.EndHorizontal();

					if (curDialogInfo!=null){

						curDialogInfo.characterId=EditorGUILayout.EnumPopup("Character:", curDialogInfo.characterId,GUILayout.Width(300) );
						var character:Character=PlayerController.Instance().characters[curDialogInfo.characterId];
						
						if (character.dialogContainer.dialogGroups.Count>0){
							var options =new String [character.dialogContainer.dialogGroups.Count];
							for (i=0;i<character.dialogContainer.dialogGroups.Count;i++){
								options[i]=character.dialogContainer.dialogGroups[i].id+":"+character.dialogContainer.dialogGroups[i].msg[0];
							}
							
							dlgIdIndex=EditorGUILayout.Popup(dlgIdIndex, options);
							curDialogInfo.dialogId=character.dialogContainer.dialogGroups[dlgIdIndex].id;	
						}
						
					}
	    		}
	    		else if (curSeq.type==CutsceneSequenceType.Animation){
	    			GUILayout.Label("not dialog sequences");
	    		}

	    		
	    	}

	    	


    	GUILayout.EndVertical();
        // The actual window code goes here
    }
}