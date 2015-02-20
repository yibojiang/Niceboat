#pragma strict

class MessageBox extends BattleUIElement{
	var msg:String;
	var txtMsg:TypeWriter;
	var rectTransform:RectTransform;
	var msgRectTransform:RectTransform;

	function ShowMessage(_msg:String,_immediately:boolean){
		if (msg==_msg){
			return;
		}

		msg=_msg;
		gameObject.SetActive(true);
		txtMsg.SetText(_msg);
	}

	function ShowMessage(_msg:String){	
		if (msg==_msg){
			return;
		}

		msg=_msg;
		gameObject.SetActive(true);
		txtMsg.SetText(_msg);
		txtMsg.PlayText();
	}

	function Hide(){
		gameObject.SetActive(false);
	}

	function Update(){
		rectTransform.sizeDelta.x=txtMsg.text.preferredWidth+10;
		//Debug.Log(rectTransform.rect.width + " - "+ txtMsg.text.preferredWidth);
	}
}
