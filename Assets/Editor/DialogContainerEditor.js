#pragma strict
import System.IO;

@CustomEditor (DialogContainer)
public class DialogContainerEditor extends Editor
{
    function OnInspectorGUI()
    {
        DrawDefaultInspector();
        
        var myScript : DialogContainer = target;
        if(GUILayout.Button("Import Text"))
        {

        	var fileName:String = EditorUtility.OpenFilePanel("Load Level File", "", "");
        	var sReader:StreamReader = File.OpenText(fileName);
       		myScript.dialogGroups.Clear();
       		var curGroup:DialogGroup=new DialogGroup();
       		var stage:String="Idle";
       		
       		while (sReader.Peek() >= 0) {
                var lineStr:String=sReader.ReadLine();
                if (lineStr.EndsWith("[DialogBegin]") ){
                	stage="Dialog";
                	continue;
                }

                if (lineStr.EndsWith("[DialogEnd]") ){
                	stage="Idle";
                	continue;
                }

                if (stage=="Dialog"){
                	if (lineStr.StartsWith("-")) {
                        var dialogIdStr:String=lineStr.Remove(0,1);
                		curGroup=new DialogGroup();
                		
                		myScript.dialogGroups.Add(curGroup);	
                		curGroup.id=int.Parse(dialogIdStr);//myScript.dialogGroups.Count-1;
                	}
                	else if (lineStr.StartsWith("#")) {
                		lineStr=lineStr.Remove(0,1);
                		//Debug.Log(lineStr);
                		var choiceStr:String[]=lineStr.Split("|"[0] );
                		var i:int;
                		for (i=0;i<choiceStr.Length;i++){
                            var cm:ChoiceMeta=new ChoiceMeta();
                            //Debug.Log(choiceStr[i]);
                            var idStr:String=choiceStr[i].Substring(choiceStr[i].LastIndexOf("/"[0])+1 );
                            var nameStr:String=choiceStr[i].Substring(0,choiceStr[i].LastIndexOf("/"[0])-1 );
                            //Debug.Log(idStr);
                            var dialogGroupID:int=int.Parse(idStr);
                            cm.dialogGroupId=dialogGroupID;
                            cm.name=nameStr;
                            
                			//Debug.Log(choiceStr[i]);
                			curGroup.choices.Add( cm );

                		}
                		
                	}
                	else if (lineStr.Trim()!=""){
                		curGroup.msg.Add(lineStr);
                	}
                }
                
            }
       		sReader.Close();
       		//Debug.Log(dataString);
            //myScript.BuildObject();
        }
    }
}