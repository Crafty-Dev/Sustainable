export async function requestJson(url){
    const res = await fetch(url);
    if(!res.ok)
      return null;
  
    return await res.json();
  }
  

  /**
   * 
   * @param {String} url 
   * @param {RequestInit} postConfig 
   */
  export async function postJson(url, postConfig){

    const res = await fetch(url, postConfig);
    if(!res.ok)
      return null;

    return await res.json();

  }

  export const ActionResult = {
    
    PASSWORDS_NOT_MATCHING: -1,
    INVALID_EMAIL: -2,
    INVALID_USERNAME: -3,
    INVALID_PASSWORD: -4,
    EMAIL_ALREADY_IN_USE: -5,
    EMAIL_NOT_EXISTANT: -6,
    INVALID_ACCESS_TOKEN: -7,
    FAILED: 0,
    SUCCESS: 1
    
}


export function getStatusText(status){

  switch(status){
    case ActionResult.PASSWORDS_NOT_MATCHING:
      return "Passwörter stimmen nicht überein";
    case ActionResult.INVALID_EMAIL:
      return "Ungültige E-Mail Adresse";
    case ActionResult.INVALID_USERNAME:
      return "Ungültiger Benutzername";
    case ActionResult.INVALID_PASSWORD:
      return "Ungültiges Passwort";
    case ActionResult.EMAIL_ALREADY_IN_USE:
      return "Diese E-Mail Adresse wird bereits für ein anderes Konto verwendet";
    case ActionResult.EMAIL_NOT_EXISTANT:
      return "Es existiert kein Konto mit dieser E-Mail Adresse";
    case ActionResult.INVALID_ACCESS_TOKEN:
      return "Ungültiger Authentifizierungstoken";
    case ActionResult.FAILED:
      return "Vorgang konnte nicht abgeschlossen werden"
  }

}