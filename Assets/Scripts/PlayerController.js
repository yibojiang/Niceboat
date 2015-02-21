#pragma strict
private static var instance : PlayerController;
 
public static function Instance() : PlayerController
{
    if (instance == null)
        instance =GameObject.FindObjectOfType(PlayerController) as PlayerController;
    return instance;
}

enum CharacterEnum{
	Captain=0,
	Chef=1,
	Doctor=2,
	Sailor=3,
	Soldier=4
}

var player:Character;
var dialogBox:DialogBox;

var target:Character;
var moveOn:boolean;

var characters:Character[];

var food:float=100;
var ammo:int=3;

var actionPoint:int=5;
var boatCount:int=0;
var maxBoatCount:int=1;

var txtState:Text;
var controlOn:boolean;

var txtDay:Text;
var txtProgress:Text;

var fpsObj:GameObject;
var tpsObj:GameObject;

var msgBox:MessageBox;

enum ControlType{
	Keyboard=0,
	Mouse=1
}

var controlType:ControlType;//0 is keyboard, 1 is mouse

function Start(){
	var gm:GameManager=GameManager.Instance();
	if (Application.platform==RuntimePlatform.IPhonePlayer || Application.platform==RuntimePlatform.Android){
		
	}
	else{
		/*
		msgBox=Instantiate( gm.msgPrefab);
		msgBox.transform.SetParent(gm.ingameUI);
		msgBox.transform.localScale=Vector3(1,1,1);
		msgBox.rectTransform.pivot=Vector2(0,0);
		msgBox.Hide();	
		*/
	}
	
}

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
	for (i=0;i<characters.Length;i++){
		if (characters[i].IsAvailable() ){
			count++;
		}
	}
	return count;
}

function GetEatCount():int{
	
	var count:int=0;
	var i:int;
	for (i=0;i<characters.Length;i++){
		if (characters[i].CanBeEaten() ){
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
	
	gm.NextDay();
}

function Update () {
	/*
	if (Input.GetKeyDown(KeyCode.K) ){
		AddAction(-1);
	}
	*/
	var cc:CameraController=CameraController.Instance();
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
			if (controlType==ControlType.Keyboard){
				player.direction=Input.GetAxis("Horizontal");	
			}
			else if (controlType==ControlType.Mouse){
				
				var cam:Camera=CameraController.Instance().cam;
				var p : Vector3 = cam.ScreenToWorldPoint (Vector3 (Input.mousePosition.x,Input.mousePosition.y,cam.nearClipPlane));
				if (msgBox!=null){
					msgBox.transform.position=p;
				}
				//Debug.Log(Input.mousePosition);
				
				//var uiSize:Vector2=Vector2(Screen.width,Screen.height)/2;
				//msgBox.rectTransform.anchoredPosition=Input.mousePosition;
				// Construct a ray from the current mouse coordinates
				var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
				
				if (msgBox!=null){
					msgBox.ShowMessage("Move",true);	
				}
				
				if (Input.GetMouseButtonDown (0)) {
					player.MoveToPos(p);
				}

				var showMove:boolean=true;
				var hit : RaycastHit;
				if (Physics.Raycast (ray,hit,1000) ){
					var ch:Character=hit.collider.GetComponent.<Character>();
					if (ch!=null){
						if (ch.alive){
							if (ch!=player){
								if (msgBox!=null){
									msgBox.ShowMessage("Talk to "+ch.characterName,true);
								}

								if (Input.GetMouseButtonDown (0)) {
									player.TalkTo(ch);
								}	
							}
						}
					}
				}
				
				
				
				
			}
			
			//interactive
			if (Input.GetKeyDown(KeyCode.Z) ){
				if (target!=null){
					target.Talk();
					//dialogBox.SetDialogs( String.Format("{0}",target.characterName) ,target.GetDialogs(),target.portrait);
					//dialogBox.ShowDialog();	
				}
			}

			//switch to mode
			if (Input.GetKeyDown(KeyCode.X) ){
				if (!cc.fading){
					cc.FadeTo(0.5,SwitchMode);
				}
				
			}
		}
		else{
			player.direction=0;
		}
	}


}

var mode:int=0;//0-tps mode, 1-fps mode
function SwitchMode(){
	//Debug.Log("SwitchMode");
	mode++;
	mode=mode % 2;
	if (mode==0){
		fpsObj.SetActive(false);
		tpsObj.SetActive(true);
	}
	else if (mode==1){
		fpsObj.SetActive(true);
		tpsObj.SetActive(false);
	}
}
