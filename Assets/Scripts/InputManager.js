#pragma strict
private static var instance : InputManager;
public static function Instance() : InputManager
{
    if (instance == null)
        instance =GameObject.FindObjectOfType(InputManager) as InputManager;
    return instance;
}

function GetSkipButtonDown():boolean{
	return Input.GetKeyDown(KeyCode.Z) || Input.GetMouseButtonDown(0);
}