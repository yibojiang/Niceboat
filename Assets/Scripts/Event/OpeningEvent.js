#pragma strict

class OpeningEvent extends GameEvent{
	private var soldier:Character;
	private var captain:Character;
	override function EventStart(){
		super.EventStart();
		StartCoroutine(DoEventStart());
	}

	function DoEventStart(){
		var pc:PlayerController= PlayerController.Instance();
		soldier=pc.characters[CharacterEnum.Soldier];
		captain=pc.characters[CharacterEnum.Captain];

		var standPos:float=soldier.transform.localPosition.x;
		var dir:float=soldier.transform.position.x-captain.transform.position.x;
		//while (Mathf.Abs(dir)>1 ){
		while (pc.target!=soldier ){
			soldier.direction=-1;
			dir=soldier.transform.position.x-captain.transform.position.x;
			
			yield WaitForEndOfFrame();	
		}

		soldier.direction=0;
		var dialogs=new List.<DialogData>();
		dialogs.Add(new DialogData("Jesus ! Our ship is sinking !") );
		
		var choices=new List.<ChoiceData>();
		choices.Add(new ChoiceData("Let's leave this place.",Leave() ) );
		choices.Add(new ChoiceData("I don't know.",DontKnow() ) );
		dialogs.Add(new DialogData("What do we do now, sir ?",choices) );

		pc.dialogBox.SetDialogs( String.Format("{0}",soldier.characterName) ,dialogs,soldier.portrait);
		pc.dialogBox.ShowDialog();
		while( pc.dialogBox.IsActive() ){
			yield WaitForEndOfFrame();
		}

		dir=soldier.transform.localPosition.x- standPos;
		while ( Mathf.Abs(dir)>0.1 ){
			//Debug.Log(dir);
			dir=soldier.transform.localPosition.x- standPos;
			soldier.direction=1;
			yield WaitForEndOfFrame();	
		}
		
		soldier.direction=0;
		Debug.Log("end");

		EventEnd();
	}

	function Leave():Action{
		return function(){
			var pc:PlayerController=PlayerController.Instance();
			var dialogs=new List.<DialogData>();
			var choices=new List.<ChoiceData>();
			dialogs.Add(new DialogData("I agreed, let's get the hell out of here.") );
			pc.dialogBox.SetDialogs(soldier.characterName,dialogs,soldier.portrait);
			pc.dialogBox.ShowNextDialog();	
		};
	}

	function DontKnow():Action{
		return function(){
			var pc:PlayerController=PlayerController.Instance();
			var dialogs=new List.<DialogData>();
			var choices=new List.<ChoiceData>();
			//choices.Add(new ChoiceData("Sure.",KillSomeOne(null) ) );
			dialogs.Add(new DialogData("God, I can't just wait here for die, let's get the hell out of here.") );
			pc.dialogBox.SetDialogs(soldier.characterName,dialogs,soldier.portrait);
			pc.dialogBox.ShowNextDialog();
		};
	}

	override function EventEnd(){
		super.EventEnd();
	}
}
