#pragma strict

function OnTriggerEnter(_other:Collider){
	var ch:Character=_other.GetComponent.<Character>();
	var pc:PlayerController=PlayerController.Instance();
	if (ch!=null){
		if (ch.alive){
			if (!ch.IsPlayer() ){
				if (pc.target!=null){
					pc.target.SayGoodbye();
					//pc.dialogBox.Hide();
					//pc.player.SetSpeakTarget(null);
				}
				pc.target=ch;
				pc.target.SayHello(pc.player);
				//pc.player.SetSpeakTarget(pc.target);
				//pc.dialogBox.ShowDialog();
			}	
		}
		
	}	
}

function OnTriggerExit(_other:Collider){
	var ch:Character=_other.GetComponent.<Character>();
	var pc:PlayerController=PlayerController.Instance();
	if (ch!=null){
		if (!ch.IsPlayer() ){
			if (ch==pc.target){
				pc.target=null;
				ch.SayGoodbye();	
				//pc.dialogBox.Hide();
			}
			
		}
	}	
}
