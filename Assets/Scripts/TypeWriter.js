#pragma strict
import UI;
var text:Text;
var speed:float=10;
var typing:boolean;
private var lastString:String;
var mute:boolean=false;
private var toggle:float;
private var interval:float;

function Reset(){
	text=GetComponent.<Text>();
}

function SetText(_text:String){
	text.text=_text;
}

function PlayText(){
	StartCoroutine(DoPlayText() );
}

function DoPlayText(){
	typing=true;
	var am:AudioManager=AudioManager.Instance();
	var originText:String=text.text;
	text.text="";
	//var toggle:float;
	if (speed<1){
		speed=1;
	}
	//var interval:float=originText.length/speed;
	toggle=0;
	interval=originText.length/speed;
	while(toggle<interval){
		//Debug.Log("typing");
		var tmpString:String=originText.Substring(0, Mathf.Lerp(0, originText.length,toggle/interval) );
		if (text.text!=tmpString){
			if (!mute){
				if (text.text+" "==tmpString){
					am.PlaySFX(am.typeWriterEnter);
				}
				else{
					am.PlayTypeWriter();
				}	
			}
			
			text.text=tmpString;
		}
		toggle+=Time.deltaTime;

		yield WaitForEndOfFrame();
	}

	if (!mute){
		am.PlayTypeWriter();
	}
	text.text=originText;
	typing=false;
}

function Update(){
	if (typing){
		if (Input.GetKeyDown(KeyCode.Z) ){
			//Debug.Log("skip123");
			if (toggle>0.05){
				Debug.Log("skip text");
				toggle=interval;	
			}
			
		}	
	}
}

function Start(){
	//PlayText();
}