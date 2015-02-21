#pragma strict

class DialogInfo{
	var characterId:CharacterEnum;
	var dialogId:int;
}

enum CutsceneSequenceType{
	Dialog=0,
	Animation=1
}

class CutsceneSequence{
	var isPlaying:boolean;
	var type:CutsceneSequenceType;
	var dialogInfos=new List.<DialogInfo>();

	function PerformAction(){


	}
}