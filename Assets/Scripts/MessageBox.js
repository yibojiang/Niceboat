#pragma strict

class MessageBox extends BattleUIElement{
	var txtMsg:TypeWriter;

	function ShowMessage(_msg:String){
		
		gameObject.SetActive(true);
		txtMsg.SetText(_msg);
		txtMsg.PlayText();
	}

	function Hide(){
		gameObject.SetActive(false);
	}
}
