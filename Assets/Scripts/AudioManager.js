#pragma strict
private static var instance : AudioManager;
 
public static function Instance() : AudioManager
{
    if (instance == null)
        instance =GameObject.FindObjectOfType(AudioManager) as AudioManager;
    return instance;
}
var typeWriterClip:AudioClip[];
var typeWriterEnter:AudioClip;

var sfxVol:float=1;
var bgmVol:float=1;
var postolClip:AudioClip[];


function PlaySFX(_clip:AudioClip){
	this.audio.PlayOneShot(_clip,sfxVol);
}

function PlayPostol(){
	var random:int=Random.Range(0,postolClip.Length);
	PlaySFX(postolClip[random]);
}

function PlayTypeWriter(){
	var random:int=Random.Range(0,typeWriterClip.Length);
	PlaySFX(typeWriterClip[random]);
}

function Start () {

}

function Update () {
	/*
	if (Input.GetKeyDown(KeyCode.K)){
		PlayTypeWriter();
	}
	*/
}