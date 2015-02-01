#pragma strict
class Sailor extends Character{
	override function GetDialogs():List.<DialogData>{
		var dialogs=new List.<DialogData>();
		dialogs.Add(new DialogData("What's up ?") );
		var choices=new List.<ChoiceData>();
		var pc:PlayerController=PlayerController.Instance();
		if (pc.CanGoBoating() ){
			choices.Add(new ChoiceData("Go boating.",Boating() ) );	
		}
		
		choices.Add(new ChoiceData("Sing a song.",Sing() ) );
		choices.Add(new ChoiceData("Fishing.",Fishing() ) );
		choices.Add(new ChoiceData("Nothing.",DoNothing() ) );
		dialogs.Add(new DialogData("What do we do now, sir ?",choices) );

		return dialogs;
	}
	/*
	function Fishing():Action{
		return function():void{
			Debug.Log("Fishing");
			//var dialogs=new List.<DialogData>();
			//dialogs.Add(new DialogData("Got it.") );
			//show fade
			var pc:PlayerController=PlayerController.Instance();			
			var fishCount:int;

			if (Random.value>0.2){
				fishCount=3;
				GameManager.Instance().ShowMessage("Lucky, you've got some fish.",GetFish(1) );
			}
			else{
				fishCount=0;
				GameManager.Instance().ShowMessage("Got no fish.",null );
			}
			
			pc.AddAction(-1);
			pc.food+=fishCount;

			//get fish
			//pc.dialogBox.SetDialogs(characterName,dialogs);
			//pc.dialogBox.ShowNextDialog();
			pc.dialogBox.Hide();
		};
	}
	
	function GetFish(_count:int):Action{
		return function():void{
			var pc:PlayerController=PlayerController.Instance();
			pc.food+=_count;
		};
	}
	*/

	

	function Sing():Action{
		return function():void{
			Debug.Log("Sing");
			var pc:PlayerController=PlayerController.Instance();
			
			var i:int;
			for (i=0;i<pc.allCharacters.Length;i++){
				if (pc.allCharacters[i].IsAvailable() ){
					pc.allCharacters[i].AddPsy(1);	
				}
			}
			
			GameManager.Instance().ShowMessage("As the sailor sings a song, all crews feel hope.",null );
			pc.AddAction(-1);
			pc.dialogBox.Hide();
		};
	}	
}