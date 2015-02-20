#pragma strict

private static var instance : GameManager;
 
public static function Instance() : GameManager
{
    if (instance == null)
        instance =GameObject.FindObjectOfType(GameManager) as GameManager;
    return instance;
}



var txtTitle:TypeWriter;
var txtStory:TypeWriter;
var txtMessage:TypeWriter;

var msgPrefab:MessageBox;
var ingameUI:Transform;


var day:int=0;

var cutScene:boolean=false;

var dayBg:GameObject[];
var nightBackground:GameObject;
var dayBackground:GameObject;
var sinkShip:GameObject;

var progress:int=0;
var maxProgress:int=10;
var dailyLog:String;
var storyLog:String;

var events:GameEvent[];

function AddLog(_logString){
	dailyLog+=_logString+"\n";
	storyLog+=_logString+"\n";
}

function GetMaxProgress():int{
	return maxProgress;
}

function UpdateBackGround(){
	if (day>0){
		nightBackground.SetActive(false);	
		dayBackground.SetActive(true);
	}
	else{
		dayBackground.SetActive(false);
		nightBackground.SetActive(true);	
	}

	var i:int;
	for (i=0;i<dayBg.Length;i++){
		dayBg[i].SetActive(false);
	}

	if (progress>=dayBg.Length){
		//progress=dayBg.Length-1;
		//game over
	}

	if (progress>0){
		sinkShip.gameObject.SetActive(false);
	}

	var bgIndex:int=Random.Range(0,dayBg.Length);
	Debug.Log("index: "+bgIndex);
	dayBg[bgIndex].SetActive(true);
}

function GameFinish(){
	Debug.Log("GameFinish");
	cutScene=true;
	var cc:CameraController=CameraController.Instance();
	var pc:PlayerController=PlayerController.Instance();
	pc.controlOn=false;
	yield cc.DoFadeOut(0.5,null);
	
	AddLog("You are saved.");
	var gameFinishCap:String="Ending: You are saved !";
	var gameFinishMsg:String="";
	var crazyMsg:String;
	var sleepMsg:String;
	var dieMsg:String;

	var i:int;
	for (i=0;i<pc.characters.Length;i++){
		if (pc.characters[i].alive){
			if (pc.characters[i].IsSleeping() ){
				sleepMsg+=pc.characters[i].characterName+" ";
			}

			if (pc.characters[i].IsCrazy() ){
				crazyMsg+=pc.characters[i].characterName+" ";
			}	
		}
		else{
			dieMsg+=pc.characters[i].characterName+" ";
		}
	}
	
	txtTitle.gameObject.SetActive(true);
	txtTitle.SetText(gameFinishCap);
	yield txtTitle.DoPlayText();
	gameFinishMsg=String.Format("{3}\nSleep: {0}\nCrazy: {1}\nDeath: {2}",sleepMsg,crazyMsg,dieMsg,storyLog );
	txtStory.gameObject.SetActive(true);
	txtStory.SetText(gameFinishMsg);
	yield txtStory.DoPlayText();

	yield WaitForEndOfFrame();

	var tap:boolean=false;
	while(!tap){
		if ( InputManager.Instance().GetSkipButtonDown() ){
			tap=true;
		}
		yield;
	}

	
	//txtTitle.gameObject.SetActive(false);
	//txtStory.gameObject.SetActive(false);

	//yield cc.DoFadeIn(0.5,null);
	//pc.controlOn=true;
	//cutScene=false;
}

function GameOver(){
	//"on the 2 of December 1901 the s.s.marty sank"
	Debug.Log("Game Over");
	cutScene=true;
	var cc:CameraController=CameraController.Instance();
	var pc:PlayerController=PlayerController.Instance();
	pc.controlOn=false;
	yield cc.DoFadeOut(0.5,null);
	
	AddLog("You are lost.");
	var gameFinishCap:String="Ending: You are lost !";
	var gameFinishMsg:String="";
	var crazyMsg:String;
	var sleepMsg:String;
	var dieMsg:String;

	var i:int;
	for (i=0;i<pc.characters.Length;i++){
		if (pc.characters[i].alive){
			if (pc.characters[i].IsSleeping() ){
				sleepMsg+=pc.characters[i].characterName+" ";
			}

			if (pc.characters[i].IsCrazy() ){
				crazyMsg+=pc.characters[i].characterName+" ";
			}	
		}
		else{
			dieMsg+=pc.characters[i].characterName+" ";
		}
	}
	
	txtTitle.gameObject.SetActive(true);
	txtTitle.SetText(gameFinishCap);
	yield txtTitle.DoPlayText();

	var lostMsg:String="On the 2 of December 1910 the s.s.marty sank.";
	gameFinishMsg=String.Format("{3}\nCrews Left:\nSleep: {0}\nCrazy: {1}\nDeath: {2}",sleepMsg,crazyMsg,dieMsg,lostMsg );
	txtStory.gameObject.SetActive(true);
	txtStory.SetText(gameFinishMsg);
	yield txtStory.DoPlayText();

	yield WaitForEndOfFrame();
	var tap:boolean=false;
	while(!tap){
		if ( InputManager.Instance().GetSkipButtonDown() ){
			tap=true;
		}
		yield;
	}
}

function NextDay(){
	StartCoroutine(DoNextDay() );
}

function DoNextDay(){
	var pc:PlayerController=PlayerController.Instance();
	var cc:CameraController=CameraController.Instance();
	Debug.Log("Next Day");


	cutScene=true;
	day++;


	pc.controlOn=false;
	yield cc.DoFadeOut(2,null);
	txtTitle.gameObject.SetActive(true);
	

	var availableCrews=new List.<Character>();

	var crazyMsg:String;
	var sleepMsg:String;
	var dieMsg:String;

	var i:int;
	for (i=0;i<pc.characters.Length;i++){
		if (pc.characters[i].IsAvailable() ){
			availableCrews.Add(pc.characters[i]);
		}
	}

	for (i=0;i<pc.characters.Length;i++){
		if (pc.characters[i].alive && pc.characters[i].IsHungry() ){
			pc.characters[i].AddHealth(-1);
			AddLog(pc.characters[i].characterName+" is too hungry, loses health.");
		}

		if (pc.characters[i].alive){
			pc.characters[i].AddHunger(1);
		}

		if (pc.characters[i].alive && !pc.characters[i].IsSleeping() ){
			pc.characters[i].AddPsy(-1);
		}

		if (pc.characters[i].alive && !pc.characters[i].IsSleeping() && pc.characters[i].IsCrazy() ){
			var randomAttackTarget:int=Random.Range(0,availableCrews.Count);
			var crazyAttackStr:String=String.Format("{0} goes mad and beats {1}.",pc.characters[i].characterName,availableCrews[randomAttackTarget].characterName);

			AddLog(crazyAttackStr);
			availableCrews[randomAttackTarget].AddHealth(-1);
		}

		if (pc.characters[i].alive){
			if (pc.characters[i].IsSleeping() ){
				sleepMsg+=pc.characters[i].characterName+" ";
			}

			if (pc.characters[i].IsCrazy() ){
				crazyMsg+=pc.characters[i].characterName+" ";
			}	
		}
		else{
			dieMsg+=pc.characters[i].characterName+" ";
		}
	}

	txtTitle.SetText("Daily Log");
	yield txtTitle.DoPlayText();
	txtStory.gameObject.SetActive(true);
	txtStory.SetText(String.Format("{3}\nSleep: {0}\nCrazy: {1}\nDeath: {2}",sleepMsg,crazyMsg,dieMsg,dailyLog ) );
	yield txtStory.DoPlayText();

	yield WaitForEndOfFrame();

	var tap:boolean=false;
	while(!tap){
		if ( InputManager.Instance().GetSkipButtonDown() ){
			tap=true;
		}
		yield;
	}

	txtTitle.gameObject.SetActive(false);
	txtStory.gameObject.SetActive(false);

	Debug.Log("Recover action point");
	pc.actionPoint=pc.GetMaxActionPoint();
	pc.boatCount=0;

	UpdateBackGround();
	yield cc.DoFadeIn(2,null);

	//setup next day
	pc.controlOn=true;
	cutScene=false;
	
	dailyLog="";
	AddLog("Day "+day);

	if (pc.player.health==0 ){//player sleeps
		GameOver();
	}

	if (pc.GetAvailableCount()==1){//only player left
		GameOver();
	}
	
}

function ShowMessage(_msg:String,_action:Action){
	StartCoroutine( DoShowMessage(_msg,_action) );
}

function DoShowMessage(_msg:String,_action:Action){
	cutScene=true;
	var cc:CameraController=CameraController.Instance();
	var pc:PlayerController=PlayerController.Instance();
	pc.controlOn=false;
	yield cc.DoFadeOut(0.5,null);
	if (_action!=null){
		_action();
		yield WaitForSeconds(0.5);
	}

	txtTitle.gameObject.SetActive(false);
	txtStory.gameObject.SetActive(true);
	txtStory.SetText(_msg);

	
	yield txtStory.DoPlayText();

	yield WaitForEndOfFrame();

	var tap:boolean=false;
	while(!tap){
		if ( InputManager.Instance().GetSkipButtonDown() ){
			tap=true;
		}
		yield;
	}

	txtTitle.gameObject.SetActive(false);
	txtStory.gameObject.SetActive(false);

	yield cc.DoFadeIn(0.5,null);
	pc.controlOn=true;
	cutScene=false;

	if (progress>=GetMaxProgress() ){
		GameFinish();
	}
}

var skip:boolean;
function Start () {
	var pc:PlayerController=PlayerController.Instance();
	var cc:CameraController=CameraController.Instance();

	
	if (!skip){
		cutScene=true;
		pc.controlOn=false;
		cc.camFade.color.a=1;
		
		txtStory.gameObject.SetActive(false);
		txtTitle.gameObject.SetActive(true);
		yield txtTitle.DoPlayText();

		txtStory.gameObject.SetActive(true);
		yield txtStory.DoPlayText();
		
		yield WaitForEndOfFrame();
		var tap:boolean=false;
		while(!tap){
			if ( InputManager.Instance().GetSkipButtonDown() ){
				tap=true;
			}
			yield;
		}
		txtTitle.gameObject.SetActive(false);
		txtStory.gameObject.SetActive(false);

		yield cc.DoFadeIn(0.5,null);
		cutScene=false;
		pc.controlOn=true;	
	}
	else{
		pc.controlOn=false;		
	}
	
	//events[0].EventStart();

}

function Update () {
	//Debug.Log(Input.GetMouseButtonDown(0));
}