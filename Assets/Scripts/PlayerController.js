#pragma strict
private static var instance : PlayerController;
 
public static function Instance() : PlayerController
{
    if (instance == null)
        instance =GameObject.FindObjectOfType(PlayerController) as PlayerController;
    return instance;
}

var player:Character;
var dialogBox:DialogBox;

var target:Character;
var moveOn:boolean;

var allCharacters:Character[];

var food:float=100;
var ammo:int=3;

var actionPoint:int=5;
var boatCount:int=0;
var maxBoatCount:int=1;

var txtState:Text;
var controlOn:boolean;

var txtDay:Text;
var txtProgress:Text;

function GoBoating(){
	boatCount++;
	var gm:GameManager=GameManager.Instance();
	gm.UpdateBackGround();
}

function GetMaxActionPoint():int{
	return GetAvailableCount()-1;
}

function CanGoBoating():boolean{
	if (boatCount<maxBoatCount){
		return true;
	}
	else{
		return false;
	}
}

function GetAvailableCount():int{
	var count:int=0;
	var i:int;
	for (i=0;i<allCharacters.Length;i++){
		if (allCharacters[i].IsAvailable() ){
			count++;
		}
	}
	return count;
}

function GetEatCount():int{
	
	var count:int=0;
	var i:int;
	for (i=0;i<allCharacters.Length;i++){
		if (allCharacters[i].CanBeEaten() ){
			count++;
		}
	}
	return count;
}

function AddFood(_food:float){
	food+=_food;
	if (food<=0){
		food=0;
	}
}

function AddAmmo(_ammo:int){
	ammo+=_ammo;
	if (ammo<=0){
		ammo=0;
	}
}

function AddAction(_actionPoint:int){
	actionPoint+=_actionPoint;
	if (actionPoint<=0){
		NextDay();
	}
}

function NextDay(){
	var gm:GameManager=GameManager.Instance();
	while (gm.cutScene){
		yield;
	}
	
	//controlOn=false;
	//var cc:CameraController=CameraController.Instance();
	//cc.FadeOut(1,null);
	gm.NextDay();
}

function Update () {
	/*
	if (Input.GetKeyDown(KeyCode.K) ){
		AddAction(-1);
	}
	*/

	var gm:GameManager=GameManager.Instance();
	txtState.text=String.Format("HEALTH: {4}/{5}\nFOOD: {0}\nHUNGER: {6}/{7}\nAMMO: {1}\nACTIONS: {2}\nBOATING: {3}",food.ToString("f0"),ammo,actionPoint,CanGoBoating(),player.health,player.maxHealth,player.hunger,player.maxHunger );
	txtDay.text=String.Format("Day {0}",gm.day);
	txtProgress.text=String.Format("Progress:{0}/{1}",gm.progress,gm.GetMaxProgress() );
	if (controlOn){
		
		if (dialogBox.IsActive() ){
			moveOn=false;
		}
		else{
			moveOn=true;

		}

		if (moveOn){
			player.direction=Input.GetAxis("Horizontal");	
			if (Input.GetKeyDown(KeyCode.Z) ){
				if (target!=null){

					dialogBox.SetDialogs( String.Format("{0}",target.characterName) ,target.GetDialogs() );
					dialogBox.ShowDialog();	
				}
			}
		}
		else{
			player.direction=0;	


		}
	}
}

