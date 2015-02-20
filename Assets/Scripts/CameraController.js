#pragma strict

private static var instance:CameraController;

public static function Instance() : CameraController{
    if (instance == null)
        instance =GameObject.FindObjectOfType(CameraController) as CameraController;
    return instance;
}

var cam:Camera;
var uiCam:Camera;

var camFade:Image;

var fading:boolean;
function Start () {

}

function FadeTo(_interval:float,_action:Action){
	camFade.gameObject.SetActive(true);
	var interval:float=_interval/2;
	yield DoFadeOut(interval,null);
	_action();
	DoFadeIn(interval,null);
}

function FadeOut(_interval:float,_action:Action){
	StartCoroutine(DoFadeOut(_interval,null));
}
function FadeIn(_interval:float){
	StartCoroutine(DoFadeIn(_interval,null));
}

function DoFadeOut(_interval:float,_action:Action){
	camFade.gameObject.SetActive(true);
	fading=true;
	var toggle:float;
	var interval:float=_interval;
	while(toggle<interval){
		camFade.color.a=Mathf.Lerp(0,1,toggle/interval);
		toggle+=Time.deltaTime;
		yield WaitForEndOfFrame();
	}
	camFade.color.a=1;
	fading=false;
	if (_action!=null){
		_action();
	}

}

function DoFadeIn(_interval:float,_action:Action){
	camFade.gameObject.SetActive(true);
	fading=true;
	var toggle:float;
	var interval:float=_interval;
	while(toggle<interval){
		camFade.color.a=Mathf.Lerp(1,0,toggle/interval);
		toggle+=Time.deltaTime;
		yield WaitForEndOfFrame();
	}
	camFade.color.a=0;
	fading=false;
	if (_action!=null){
		_action();
	}
	camFade.gameObject.SetActive(false);
}