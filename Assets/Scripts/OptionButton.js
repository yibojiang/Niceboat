#pragma strict
import UI;
var text:Text;
var btn:Button;
var img:Image;
var rectTransform:RectTransform;
var textRect:RectTransform;

function Update(){
	rectTransform.anchoredPosition.y=-5;
	rectTransform.sizeDelta.x=Mathf.Min(textRect.sizeDelta.x+10,text.preferredWidth+10);
	rectTransform.sizeDelta.y=Mathf.Min(textRect.sizeDelta.y+10,text.preferredHeight+10);
}