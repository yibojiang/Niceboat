#pragma strict
var needle:Transform;
var chart:Transform;
var character:Transform;
var north:Transform;
var compass:Transform;
//var needleUp:Transform;
var targetTransform:Transform;
var mapTransform:Transform;
var speed:float=5;

var camTransform:Transform;

var rightHandAnim:Animator;
var leftHand:GameObject;


function Start () {

}

function Update () {
	var dir:float=Input.GetAxis("Horizontal");
	//character.eulerAngles.y+=dir*Time.deltaTime*1000;
	//Debug.Log(compass.up);


	//needle.LookAt(needleUp,needle.TransformDirection(Vector3.up) );
	//var maxRotation:Quaternion=Quaternion.Euler(0, 340, 0);
	//var lerp:float=Quaternion.InverseLerp(camTransform.eulerAngles.y,maxRotation);

	//Debug.Log(camTransform.eulerAngles.x);
	var rotate:float=camTransform.eulerAngles.x;
	if (rotate==0){
		rotate=360;
	}
	var lerp:float=(360-rotate)/8;
	//Debug.Log(lerp);
	leftHand.transform.localPosition.y=Mathf.Lerp(0,-0.65, lerp*lerp );

	var angle:float=Quaternion.Angle(camTransform.rotation,north.rotation );
	if (camTransform.eulerAngles.y>180){
		needle.localEulerAngles.y=angle;	
	}
	else{
		needle.localEulerAngles.y=-angle;
	}

	mapTransform.rotation=Quaternion.Lerp( mapTransform.rotation, targetTransform.rotation,Time.deltaTime*speed );
	mapTransform.position=Vector3.Lerp(mapTransform.position,targetTransform.position , Time.deltaTime*speed );
	
	if (Input.GetKeyDown(KeyCode.E)){
		rightHandAnim.SetTrigger("TakeCompass");	
	}
	
}