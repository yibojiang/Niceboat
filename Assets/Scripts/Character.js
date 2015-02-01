#pragma strict
import System.Collections.Generic;
var characterName:String;
var walkSpeed:float=3;
var direction:float;
var flipDir:int;

var health:int=3;
var maxHealth:int=5;
var psy:int=3;
var maxPsy:int=5;

var alive:boolean=true;

var hunger:float=0;
var maxHunger:float=5;

//var dialogs=new List.<DialogData>();
var msgBox:MessageBox;

var disappear:boolean;

var anim:Animator;


var speakTarget:Character;
var isSleeping:boolean;

function IsHungry():boolean{
	if (hunger<maxHealth){
		return false;
	}
	else{
		return true;
	}
}

function IsSleeping():boolean{
	return isSleeping;
	/*
	if (health==0 && alive){
		return true;
	}
	else{
		return false;
	}
	*/
}

function IsCrazy():boolean{
	if (psy==0 && alive){
		return true;
	}
	else{
		return false;
	}
}

function AddPsy(_psy:int){
	psy+=_psy;
	if (psy>maxPsy){
		psy=maxPsy;
	}

	if (psy<=0){
		psy=0;
		Crazy();
	}
}

function AddHunger(_hunger:float){
	hunger+=_hunger;
	if (_hunger>maxHunger){
		_hunger=maxHunger;
	}

	if (hunger<0){
		hunger=0;
	}
}


function AddHealth(_health:int){

	health+=_health;
	if (health>maxHealth){
		health=maxHealth;
	}

	if (health<=0){
		health=0;
		if (IsSleeping() ){

		}
		else{
			FallAsleep();	
		}
	}

	if (IsSleeping() ){
		if (health>0){
			Wakeup();
		}	
	}
	
}



function Crazy(){
	Debug.Log("Crazy");
}

function Wakeup(){
	Debug.Log("Wake up");
	transform.eulerAngles.z=0;
	isSleeping=false;
}

function FallAsleep(){
	Debug.Log("Sleep");
	var gm:GameManager=GameManager.Instance();
	gm.AddLog(characterName+" fell asleep.");
	isSleeping=true;
	transform.eulerAngles.z=-90;
}

function IsAvailable():boolean{
	if (!alive || IsSleeping() || disappear ){
		return false;
	}
	else{
		return true;
	}
}

function CanBeEaten():boolean{
	if ((!alive || IsSleeping() ) && !disappear){
		return true;
	}
	else{
		return false;
	}
}

function Disappear(){
	disappear=true;
	gameObject.SetActive(false);
}

function Die(){
	Debug.Log("Die");
	transform.eulerAngles.z=-90;
	if (anim!=null){
		anim.Play("dead");
	}
	alive=false;
}

function Awake(){
	var gm:GameManager=GameManager.Instance();
	msgBox=Instantiate( gm.msgPrefab);
	msgBox.SetTarget(transform,Vector3(0,3.5,0));
	msgBox.transform.SetParent(gm.ingameUI);
	msgBox.transform.localScale=Vector3(1,1,1);
	msgBox.Hide();
}

function SetSpeakTarget(_target:Character){
	speakTarget=_target;
	if (_target!=null){
		Debug.Log(characterName+" speak to "+_target.characterName);
		var speakDir:float=_target.transform.position.x-transform.position.x;
		if (speakDir>0){
			SetDir(1);
		}
		else{
			SetDir(-1);	
		}
	}
	else{
		Debug.Log(characterName+" speak over");	
	}

	
	
}

function SayHello(_target:Character){
	//Debug.Log("SayHello");
	var helloMsg=new String[2];

	if (IsHungry() ){
		helloMsg=new String[2];
		helloMsg[0]="Sir, I'm hungry.";	
		helloMsg[1]="I need to eat sth.";	
	}
	else if ( IsCrazy() ){
		helloMsg=new String[4];
		helloMsg[0]="Ah, I'm gundam !";	
		helloMsg[1]="I can see zombies !";
		helloMsg[2]="Who are you ?";
		helloMsg[3]="fuck, we're done!";
	}
	else{
		helloMsg=new String[3];
		helloMsg[0]="Hello, sir.";
		helloMsg[1]="What's up?";
		helloMsg[2]="Can I help you?";
	}

	
	msgBox.ShowMessage(helloMsg[Random.Range(0,helloMsg.Length)]);
}

function SayGoodbye(){
	msgBox.Hide();
}

function DoNothing():Action{
	return function():void{
		Debug.Log("DoNothing");
		//var pc:PlayerController=PlayerController.Instance();
		//pc.dialogBox.Hide();
		var pc:PlayerController=PlayerController.Instance();
		var dialogs=new List.<DialogData>();
		dialogs.Add(new DialogData("Ok, See ya.") );
		pc.dialogBox.SetDialogs(characterName,dialogs);
		pc.dialogBox.ShowNextDialog();
	};
}

function AfterBoating():Action{
	return function():void{
		Debug.Log("After boating");
		var gm:GameManager=GameManager.Instance();
		var pc:PlayerController=PlayerController.Instance();
		gm.progress++;
		pc.GoBoating();
		AddHunger(2);
	};
}

function GetFish(_count:int):Action{
	return function():void{
		var pc:PlayerController=PlayerController.Instance();
		pc.food+=_count;
	};
}

function Fishing():Action{
	return function():void{
		Debug.Log("Fishing");
		
		//show fade
		var pc:PlayerController=PlayerController.Instance();			
		var fishCount:int;

		if (Random.value>0.4){
			fishCount=2;
			GameManager.Instance().ShowMessage("Lucky, you've got some fish.",GetFish(1) );
		}
		else{
			fishCount=0;
			GameManager.Instance().ShowMessage("Got no fish.",null );
		}
		
		AddHunger(1);
		pc.AddAction(-1);
		pc.food+=fishCount;

		pc.dialogBox.Hide();
	};
}

function Boating():Action{
	return function():void{
		Debug.Log("go boating");
		var pc:PlayerController=PlayerController.Instance();

		var gm:GameManager=GameManager.Instance();
		var i:int;
		var eventMsg:String;
		if (gm.day>0){
			var flag:int=Random.Range(0,100);
			if (flag<30){//nothing happens
				eventMsg=String.Format("{0} went boating. You moved to a new place.",characterName);
				gm.ShowMessage(eventMsg ,AfterBoating() );	
			}
			else if (flag<50){//storm event
				eventMsg= String.Format("{0} went boating. You met storm, and lost some food and ammo, all crews lose health.",characterName);
				gm.ShowMessage(eventMsg,AfterBoating() );			
				pc.AddFood(-pc.food/2);
				pc.AddAmmo(-pc.ammo/2);
				for (i=0;i<pc.allCharacters.Length;i++){
					pc.allCharacters[i].AddHealth(-1);
				}
			}
			else if (flag<65){//Ghost event
				eventMsg=String.Format("{0} went boating. You met the ghost of the old navy, and some of you are crazy.",characterName);
				gm.ShowMessage(  eventMsg ,AfterBoating() );
				for (i=0;i<pc.allCharacters.Length;i++){
					pc.allCharacters[i].AddPsy(-2);
				}

			}
			else if (flag<75){//shark event
				if (pc.ammo>2 && pc.allCharacters[4].IsAvailable() ){
					eventMsg=String.Format("{0} went boating. A shark attacked, the soldier shooted the shark, you got some food and lose some ammo.",characterName);
					gm.ShowMessage( eventMsg,AfterBoating() );
					pc.AddAmmo(-2);
					pc.AddFood(5);
				}
				else{
					eventMsg=String.Format("{0} went boating. A shark attacked, {0} was eaten by the shark.",characterName);
					gm.ShowMessage( eventMsg,AfterBoating() );
					Die();
				}
			}
			else if (flag<85){//get ammo and food.
				eventMsg=String.Format("{0} went boating. You found a floating treasures, got some food and ammo",characterName);
				gm.ShowMessage( eventMsg,AfterBoating() );
				pc.AddAmmo(5);
				pc.AddFood(5);
			}
			else{//meet enemy
				if (pc.ammo>5 && pc.allCharacters[4].IsAvailable() ){
					eventMsg=String.Format("{0} went boating. You met pirates, soldier shooted the enemies, got some food and ammo",characterName);
					gm.ShowMessage( eventMsg,AfterBoating() );
					pc.AddAmmo(10);
					pc.AddFood(10);
				}
				else{
					eventMsg=String.Format("{0} went boating. You met pirates, lost all food and ammo, all crews lose health.",characterName);
					gm.ShowMessage( eventMsg,AfterBoating() );
					pc.AddAmmo(-pc.ammo);
					pc.AddFood(-pc.food);

					for (i=0;i<pc.allCharacters.Length;i++){
						pc.allCharacters[i].AddHealth(-1);
					}
				}
			}
		}else{
			eventMsg=String.Format("{0} went boating. You moved to a new place.",characterName);
			gm.ShowMessage(eventMsg ,AfterBoating() );	
		}
		gm.AddLog(eventMsg);
		pc.AddAction(-1);
		pc.dialogBox.Hide();
	};
}

function Start () {

}

function GetDialogs():List.<DialogData>{
	var dialogs=new List.<DialogData>();
	var dialog:DialogData=new DialogData();
	dialogs.Add(new DialogData("What's up ?") );
	dialogs.Add(new DialogData("What do we do now, sir ?") );

	return dialogs;
}

var turning:boolean;

function DoSetDir(_dir:int){
	
	turning=true;
	yield WaitForSeconds(0.2);
	flipDir=_dir;


	if (flipDir>0){
		transform.eulerAngles.y=0;
	}
	else if (flipDir<0){
		transform.eulerAngles.y=180;
	}
	turning=false;
}

function SetDir(_dir:int){
	if (flipDir!=_dir){
		if (anim!=null){
			anim.SetTrigger("turnAround");	
		}
		
		StartCoroutine(DoSetDir(_dir) );
	}
}

function IsPlayer():boolean{
	var pc:PlayerController=PlayerController.Instance();
	if (this!=pc.player){
		return false;
	}
	else{
		return true;
	}
}



function FixedUpdate () {
	

	if (anim!=null){
		anim.SetFloat("walkSpeed",Mathf.Abs(walkSpeed*direction) );
	}

	if (anim!=null){
		if (speakTarget!=null){
			anim.SetBool("speaking",true);	
		}
		else{
			anim.SetBool("speaking",false);
		}
		
	}

	if (!turning){
		if (direction>0){
			SetDir(1);
		}
		else if (direction<0){
			SetDir(-1);	
		}	
		rigidbody.MovePosition(rigidbody.position + Vector3(walkSpeed*direction,0,0)*Time.deltaTime );
	}
	
}