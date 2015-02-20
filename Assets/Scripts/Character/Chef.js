#pragma strict

class Chef extends Character{
	override function GetDialogs():List.<DialogData>{
		var pc:PlayerController=PlayerController.Instance();
		var dialogs=new List.<DialogData>();
		dialogs.Add(new DialogData("What's up ?") );
		var choices=new List.<ChoiceData>();

		if (pc.CanGoBoating() ){
			choices.Add(new ChoiceData("Go boating.",Boating() ) );
		}

		choices.Add(new ChoiceData("Fishing.",Fishing() ) );
		choices.Add(new ChoiceData("Cook food for all.",Cook() ) );
		
		
		if (pc.GetEatCount()>0 ){
			choices.Add(new ChoiceData("Cook deaths for all.",CookDeath() ) );	
		}
		
		choices.Add(new ChoiceData("Nothing.",DoNothing() ) );
		dialogs.Add(new DialogData("What do we do now, sir ?",choices) );

		return dialogs;
	}




	override function CanBeEaten():boolean{
		return false;
	}

	function CookFood():Action{
		return function():void{
			var pc:PlayerController=PlayerController.Instance();
			var i:int;
			var eatFood:float;
			if (pc.food>pc.GetAvailableCount()){
				pc.food-=pc.GetAvailableCount();	
				eatFood=pc.GetAvailableCount();	
			}
			else{
				//pc.food=0;	
				eatFood=pc.food;
			}
			
			var averageFood:float=eatFood/pc.GetAvailableCount();
			for (i=0;i<pc.characters.Length;i++){
				if (pc.characters[i].IsAvailable() ){
					pc.characters[i].AddHunger(-averageFood);
					pc.AddFood(-averageFood);	
				}
			}
		};
	}

	function AfterCookSomeOne(_character:Character):Action{
		return function():void{
			_character.Disappear();
		};
	}

	function CookSomeOne(_character:Character){
		return function():void{
			var pc:PlayerController=PlayerController.Instance();
			var i:int;
			if (_character!=null){
				var deathFood:float=_character.maxHealth;
				var averageFood:float=deathFood/pc.GetAvailableCount();
				for (i=0;i<pc.characters.Length;i++){
					if (pc.characters[i].IsAvailable() ){
						pc.characters[i].AddHunger(-averageFood);
					}
				}
				var gm:GameManager=GameManager.Instance();
				var tmpStr:String=String.Format("{0} made {1} into food, all crews have a lunch.",characterName,_character.characterName);
				gm.ShowMessage( tmpStr,AfterCookSomeOne(_character) );
				gm.AddLog(tmpStr);
				pc.dialogBox.Hide();
				pc.AddAction(-1);
			}
			else{
				var dialogs=new List.<DialogData>();
				dialogs.Add(new DialogData("okay, sir.") );
				pc.dialogBox.SetDialogs(characterName,dialogs,portrait);
				pc.dialogBox.ShowNextDialog();	
			}
		};
	}


	function CookDeath():Action{
		return function():void{
			Debug.Log("Cook Death");
			var pc:PlayerController=PlayerController.Instance();
			

			var dialogs=new List.<DialogData>();
			var choices=new List.<ChoiceData>();
			var i:int;
			for (i=0;i<pc.characters.Length;i++){
				if ( pc.characters[i].CanBeEaten() ){
					choices.Add(new ChoiceData(pc.characters[i].characterName,CookSomeOne(pc.characters[i]) ) );	
				}
			}
			choices.Add(new ChoiceData("Nobody.",CookSomeOne(null) ) );
			dialogs.Add(new DialogData("Cook whom ?",choices) );
			pc.dialogBox.SetDialogs(characterName,dialogs,portrait);
			pc.dialogBox.ShowNextDialog();
		};
	}

	function Cook():Action{
		return function():void{
			Debug.Log("Cook");
			var pc:PlayerController=PlayerController.Instance();
			if (pc.food>0){
				
				pc.dialogBox.Hide();
				GameManager.Instance().ShowMessage("All crews have a lunch.",CookFood() );
				pc.AddAction(-1);

			}
			else{

				var dialogs=new List.<DialogData>();
				dialogs.Add(new DialogData("We have no food left, sir.") );
				pc.dialogBox.SetDialogs(characterName,dialogs,portrait);
				pc.dialogBox.ShowNextDialog();
			}
		};
	}
}