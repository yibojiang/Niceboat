#pragma strict

class Doctor extends Character{
	override function GetDialogs():List.<DialogData>{
		var dialogs=new List.<DialogData>();
		dialogs.Add(new DialogData("What's up ?") );
		var choices=new List.<ChoiceData>();
		var pc:PlayerController=PlayerController.Instance();
		if (pc.CanGoBoating() ){
			choices.Add(new ChoiceData("Go boating.",Boating() ) );
		}

		choices.Add(new ChoiceData("Heal Someone.",Heal() ) );
		choices.Add(new ChoiceData("Fishing.",Fishing() ) );
		choices.Add(new ChoiceData("Nothing.",DoNothing() ) );
		dialogs.Add(new DialogData("What do we do now, sir ?",choices) );
		return dialogs;
	}

	function Heal():Action{
		return function():void{
			Debug.Log("Heal");
			var pc:PlayerController=PlayerController.Instance();
			var dialogs=new List.<DialogData>();
			var choices=new List.<ChoiceData>();
			var i:int;
			for (i=0;i<pc.allCharacters.Length;i++){
				if (pc.allCharacters[i].alive && !pc.allCharacters[i].disappear && pc.allCharacters[i]!=this && pc.allCharacters[i].health<pc.allCharacters[i].maxHealth){
					choices.Add(new ChoiceData(pc.allCharacters[i].characterName,HealSomeOne(pc.allCharacters[i]) ) );	
				}
			}
			choices.Add(new ChoiceData("Nobody.",HealSomeOne(null) ) );
			dialogs.Add(new DialogData("Heal whom, sir ?",choices) );
			pc.dialogBox.SetDialogs(characterName,dialogs);
			pc.dialogBox.ShowNextDialog();
		};
	}



	function HealSomeOne(_character:Character):Action{
		return function():void{
			var pc:PlayerController=PlayerController.Instance();
			if (_character!=null){
				Debug.Log("Heal "+_character.characterName);
				_character.AddHealth(1);
				GameManager.Instance().ShowMessage( String.Format("{0}'s health increases 1.",_character.characterName),null );
				pc.AddAction(-1);
				pc.dialogBox.Hide();
			}
			else{
				var dialogs=new List.<DialogData>();
				dialogs.Add(new DialogData("See ya, sir.") );
				pc.dialogBox.SetDialogs(characterName,dialogs);
				pc.dialogBox.ShowNextDialog();	
			}
			
		};
	}

}