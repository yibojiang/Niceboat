﻿#pragma strict
import UI;
import System.Collections.Generic;
import System;
var txtCaptain:Text;
var txtMsg:TypeWriter;
var target:GameObject;
var inTransistion:boolean;
var bg:Image;
var optionBtnPrefab:OptionButton;

class ChoiceData{
	var name:String;
	var action:Action;
	function ChoiceData(){}
	function ChoiceData(_name:String,_action:Action){
		name=_name;
		action=_action;
	}
}

class DialogData{
	var speed:float=100;
	var msg:String;
	var choices:List.<ChoiceData>;
	function DialogData(){}
	function DialogData(_msg:String){
		speed=40;
		msg=_msg;
	}

	function DialogData(_msg:String,_choices:List.<ChoiceData>){
		speed=40;
		msg=_msg;
		choices=_choices;
	}
}

var dialogs:List.<DialogData>;
var dialogIndex:int=0;

var curOptionIndex:int;
var optionButtons=new List.<OptionButton>();

function SetDialogs(_name:String,_dialogs:List.<DialogData>){
	txtCaptain.text=_name;
	dialogs=_dialogs;
	txtMsg.SetText("");
	dialogIndex=-1;
}



function ShowNextDialog(){
	
	dialogIndex++;

	if (dialogIndex<dialogs.Count){
		var i:int;
		for (i=0;i<optionButtons.Count;i++){
			Destroy(optionButtons[i].gameObject);
		}
		optionButtons.Clear();

		txtMsg.SetText(dialogs[dialogIndex].msg);
		//bg.GetComponent.<RectTransform>().sizeDelta.y=txtMsg.text.GetComponent.<RectTransform>().sizeDelta.y+50;
		txtMsg.speed=dialogs[dialogIndex].speed;
		txtMsg.PlayText();

		if (dialogs[dialogIndex].choices!=null){
			curOptionIndex=0;
			for (i=0;i<dialogs[dialogIndex].choices.Count;i++ ){
				var btn:OptionButton=Instantiate(optionBtnPrefab);
				btn.transform.SetParent(target.transform);
				var btnRect:RectTransform=btn.GetComponent.<RectTransform>();
				btnRect.transform.localScale=Vector3(1,1,1);
				btnRect.anchoredPosition.x=0;
				btnRect.anchoredPosition.y=-10-i*20;
				btnRect.anchoredPosition3D.z=0;
				btn.btn.onClick.AddListener(dialogs[dialogIndex].choices[i].action);
				btn.text.text=dialogs[dialogIndex].choices[i].name;
				optionButtons.Add(btn);
			}	
		}
	}
	else{
		Hide();
	}
}

function ShowDialog(){
	if (inTransistion){
		return;
	}
	var pc:PlayerController=PlayerController.Instance();
	pc.player.SetSpeakTarget(pc.target);
	pc.target.SetSpeakTarget(pc.player);
		
	var i:int;
	for (i=0;i<optionButtons.Count;i++){
		Destroy(optionButtons[i].gameObject);
	}
	optionButtons.Clear();

	target.SetActive(true);
	var rectTransform=target.GetComponent.<RectTransform>();
	var toggle:float;
	var interval:float=0.2;
	inTransistion=true;
	while (toggle<interval){
		rectTransform.anchoredPosition.x=Mathf.Lerp(-300,5,toggle/interval);
		toggle+=Time.deltaTime;
		yield WaitForEndOfFrame();
	}
	inTransistion=false;
	rectTransform.anchoredPosition.x=5;
	ShowNextDialog();
}

function Hide(){
	if (inTransistion){
		return;
	}

	var pc:PlayerController=PlayerController.Instance();
	pc.player.SetSpeakTarget(null);
	pc.target.SetSpeakTarget(null);
	
	var rectTransform=target.GetComponent.<RectTransform>();
	var toggle:float;
	var interval:float=0.2;
	inTransistion=true;
	while (toggle<interval){
		rectTransform.anchoredPosition.x=Mathf.Lerp(5,-300,toggle/interval);
		toggle+=Time.deltaTime;
		yield WaitForEndOfFrame();
	}
	rectTransform.anchoredPosition.x=-300;
	//rectTransform.anchoredPosition3D.z=0;
	inTransistion=false;
	target.SetActive(false);
}

function IsActive():boolean{
	return target.activeInHierarchy;
}

function Update(){
	//Debug.Log(Navigation.defaultNavigation);
	if (!txtMsg.typing && IsActive()){
		if (Input.GetKeyDown(KeyCode.Z)){
			if (dialogIndex<dialogs.Count && dialogIndex>=0){
				if (dialogs[dialogIndex].choices==null){
					ShowNextDialog();	
				}
				else{
					dialogs[dialogIndex].choices[curOptionIndex].action();
				}

			}
		}
	}
	if (optionButtons.Count>0){
		optionButtons[curOptionIndex].img.color=Color.Lerp(Color.black,Color.gray,Mathf.PingPong(2*Time.time,1)	) ;
		
		if (Input.GetKeyDown(KeyCode.UpArrow)){
			optionButtons[curOptionIndex].img.color=Color.black;
			curOptionIndex--;
		}
		else if (Input.GetKeyDown(KeyCode.DownArrow)){
			optionButtons[curOptionIndex].img.color=Color.black;
			curOptionIndex++;	
		}

		//optionButtons[curOptionIndex].btn.colors.normalColor.g=optionButtons[curOptionIndex].btn.colors.normalColor.r;
		//optionButtons[curOptionIndex].btn.colors.normalColor.b=optionButtons[curOptionIndex].btn.colors.normalColor.r;
		curOptionIndex=Mathf.Clamp(curOptionIndex,0,optionButtons.Count-1);
	}
	
}