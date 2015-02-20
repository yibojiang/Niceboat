#pragma strict
import UI;
var text:Text;
var btn:Button;
var img:Image;
var rectTransform:RectTransform;

function Update(){
	rectTransform.sizeDelta.x=text.preferredWidth+10;
}