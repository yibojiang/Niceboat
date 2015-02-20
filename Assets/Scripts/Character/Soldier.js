#pragma strict
class Soldier extends Character{
	override function GetDialogs():List.<DialogData>{
		var dialogs=new List.<DialogData>();
		dialogs.Add(new DialogData("What's up ?") );
		var choices=new List.<ChoiceData>();
		var pc:PlayerController=PlayerController.Instance();
		if (pc.CanGoBoating() ){
			choices.Add(new ChoiceData("Go boating.",Boating() ) );
		}
		
		choices.Add(new ChoiceData("Kill Someone.",Kill() ) );
		choices.Add(new ChoiceData("Fishing.",Fishing() ) );
		choices.Add(new ChoiceData("Nothing.",DoNothing() ) );
		dialogs.Add(new DialogData("What do we do now, sir ?",choices) );

		return dialogs;
	}

	function Kill():Action{
		return function():void{
			Debug.Log("Kill");
			var pc:PlayerController=PlayerController.Instance();
			var dialogs=new List.<DialogData>();
			var choices=new List.<ChoiceData>();
			var i:int;
			for (i=0;i<pc.characters.Length;i++){
				if (pc.characters[i]!=pc.player && pc.characters[i]!=this && pc.characters[i].alive && !pc.characters[i].disappear ){
					choices.Add(new ChoiceData(pc.characters[i].characterName,KillSomeOne(pc.characters[i]) ) );	
				}
			}
			choices.Add(new ChoiceData("Nobody.",KillSomeOne(null) ) );
			dialogs.Add(new DialogData("Kill whom, sir ?",choices) );
			pc.dialogBox.SetDialogs(characterName,dialogs,portrait);
			pc.dialogBox.ShowNextDialog();
		};
	}

	function PerformKill(_character:Character):Action{
		return function():void{
			var am:AudioManager=AudioManager.Instance();
			_character.Die();
			am.PlayPostol();

			var pc:PlayerController=PlayerController.Instance();
			var i:int;
			for (i=0;i<pc.characters.Length;i++){
				if (pc.characters[i].IsAvailable() ){
					pc.characters[i].AddPsy(-1);	
				}
			}
		};
	}

	function KillSomeOne(_character:Character):Action{
		return function():void{
			var pc:PlayerController=PlayerController.Instance();
			var dialogs=new List.<DialogData>();
			if (pc.ammo<=0){
				dialogs.Add(new DialogData("We have no ammo, sir.") );
				pc.dialogBox.SetDialogs(characterName,dialogs,portrait);
				pc.dialogBox.ShowNextDialog();	

			}
			else{
				if (_character!=null){
					Debug.Log("Kill "+_character.characterName);
					GameManager.Instance().ShowMessage( String.Format("{0}'s killed.",_character.characterName),PerformKill(_character) );
					pc.AddAction(-1);
					pc.AddAmmo(-1);
					pc.dialogBox.Hide();
				}
				else{
					
					dialogs.Add(new DialogData("See ya, sir.") );
					pc.dialogBox.SetDialogs(characterName,dialogs,portrait);
					pc.dialogBox.ShowNextDialog();	
				}	
			}
			
			
			
			
		};
	}	
}