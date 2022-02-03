import { collectionTypes } from "../Interfaces/ServerCommunicationTypes";
import {SessionData,InitiativeObject,SpellObject, CharacterStatus} from "../Interfaces/GameSessionTypes";

export function isSessionData(payload: any): payload is SessionData {
    if (payload as SessionData) {
      return true;
    } else {
      return false;
    }
  }
  
  export function isInitiativeObject(payload: any): payload is InitiativeObject {
    if (payload as InitiativeObject) {
      return true;
    } else {
      return false;
    }
  }
  
  export function isSpellObject(payload: any): payload is SpellObject {
    if (payload as SpellObject) {
      return true;
    } else {
      return false;
    }
  }

  export function isInitiativeObjectArray(payload: any): payload is InitiativeObject[] {
    if (payload as InitiativeObject[]) {
      return true;
    } else {
      return false;
    }
  }
  
  export function isSpellObjectArray(payload: any): payload is SpellObject[] {
    if (payload as SpellObject[]) {
      return true;
    } else {
      return false;
    }
  }

  export function collectionequalsObject(collection:collectionTypes, item: InitiativeObject | SpellObject) {
    if (collection === collectionTypes.INITIATIVE){
      return isInitiativeObject(item);
    }
    if (collection === collectionTypes.SPELLS){
      return isSpellObject(item);
    }
  }

  export function isDoubleArray(payload: any): payload is CharacterStatus[][] {
    if (payload as CharacterStatus[][]) {
      return true;
    }
    else {
      return false;
    }
  }
  