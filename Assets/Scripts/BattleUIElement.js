#pragma strict

import UI;
var targetTransform:Transform;
var offset:Vector3;

function UpdatePosition(){
	if (targetTransform!=null){
		var cc:CameraController=CameraController.Instance();
		var screenPos:Vector3=cc.cam.WorldToScreenPoint(targetTransform.position+offset);
		transform.position=cc.cam.ScreenToWorldPoint(screenPos);
	}
}

function LateUpdate(){
	UpdatePosition();
	
}

function SetTarget(_target:Transform,_offset:Vector3){
	targetTransform=_target;
	offset=_offset;
}

