#pragma strict
private static var instance : MenuSystem;
 
public static function Instance() : MenuSystem
{
    if (instance == null)
        instance =GameObject.FindObjectOfType.<MenuSystem>();
    return instance;
}

var mapPanel:MapPanel;

function Start () {

}

function Update () {

}