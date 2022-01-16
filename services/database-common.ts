//@ts-ignore
const { db } = require("./firebase-setup");
const { v4: uuidv4 } = require("uuid");
const initRef = db.collection("sessions");
import { collectionTypes } from "../Interfaces/ServerCommunicationTypes";
import { weapon_of_logging } from "../utilities/LoggingClass";
import {SessionData,InitiativeObject,SpellObject} from "../Interfaces/GameSessionTypes";
import { isInitiativeObject, isSpellObject, isSessionData } from "../utilities/TypeChecking";
import chalk from "chalk";




export async function addSingle(item: InitiativeObject | SpellObject, sessionId: string, collection: collectionTypes) {
  let errorMsg: any;
  // check if doc exists
  initRef
    .doc(sessionId)
    .collection(collection)
    .doc(item.id)
    .set(item)
    .then(() => {
      errorMsg = false;
      weapon_of_logging.INFO("isUploaded", "added single upload",item)
    })
    .catch((error: any) => {
      // error handling
      console.trace(error);
      if (error instanceof Error) {
        weapon_of_logging.CRITICAL(
          error.name,
          error.message,
          error.stack,
          {item:item, collectionType: collection},
        );
    }
      errorMsg = error;
    });

    return Promise.resolve(errorMsg)
}

export function deleteSingle(
  itemId: string,
  sessionId: string,
  collection: string
) {
  // check if doc exists
  let errorMsg:any;
  initRef
    .doc(sessionId)
    .collection(collection)
    .doc(itemId)
    .delete()
    .then(() => {
      errorMsg = false;
      weapon_of_logging.INFO("isDeleted", "success deletion",itemId)
    })
    .catch((error: any) => {
      if (error instanceof Error) {
        errorMsg = error;
        weapon_of_logging.ERROR(
          error.name,
          error.message,
          error.stack,
          {itemId: itemId, collectionType: collection},

        );
    }
    });
    return Promise.resolve(errorMsg)
}

export function updateCollectionItem(value: any, collection:string, docId: string, sessionId: string, valueName: string){
  try {
    weapon_of_logging.DEBUG("updatecollectionitem","initial data",{value,collection,docId,sessionId})
    initRef.doc(sessionId)
    .collection(collection)
    .doc(docId)
    .set({[valueName]: value}, {merge:true})
    .then(() => {
      weapon_of_logging.DEBUG("updatecollectionitem", `successfully updated ${valueName} in ${collection}`, value)
    })
  }
  catch(error){
    if (error instanceof Error){
      weapon_of_logging.DEBUG("updateCollectionitem", error.message, value);
    }
  }
}

export function updatecollectionRecord(
  // check if doc/collection exists
  item: InitiativeObject | SpellObject,
  collection: string,
  docId: string,
  sessionId: string
) {
  let errorMsg:any;

  
  initRef
    .doc(sessionId)
    .collection(collection)
    .doc(docId)
    .set(item, { merge: true })
    .then(() => {
      weapon_of_logging.INFO("updateCollectionRecord", `success updating collection ${collection}`,{item:item,docId:docId,collection:collection},)
      errorMsg = false;
    })
    .catch((error: any) => {
      if (error instanceof Error) {
        weapon_of_logging.ERROR(
          error.name,
          error.message,
          error.stack,
          {item: item, docId: docId, collectionType: collection},

        );
      }
      
      errorMsg = error;
    });
  return Promise.resolve(errorMsg)
}

export async function retrieveCollection(
  sessionId: string,
  collection: string
): Promise<InitiativeObject[] | SpellObject[]> {
  let databaseList: any = [];
  console.info(sessionId)
  console.info(collection)
  try{
    let snapshot = await initRef.doc(sessionId).collection(collection).get();

    if (snapshot.docs !== undefined) {
      
      snapshot.forEach((doc: any) => {
        databaseList.push({ ...doc.data() });
      });
      // logging
    }
    if (snapshot.docs === undefined) {
      weapon_of_logging.DEBUG("retrievecollection","snapshot is undefined","none");
      // weapon_of_logging.NOTICE("snapshot.docs === undefined","none",collection,sessionId)
      // throw ReferenceError(`snapshot.docs is undefined sessionId: ${sessionId} collection: ${collection}`); 
    }
  }
  catch(error){
    console.log(chalk.bgGreenBright(sessionId))
    console.log(chalk.bgGreenBright(collection))
    console.log(error)
  }
  
  // weapon_of_logging.INFO("retrieveCollection", "complete",databaseList,sessionId)
  return Promise.resolve(databaseList);
}

export async function updateSession(
  sessionId: string,
  onDeck: number,
  isSorted: boolean,
  sessionSize: number
) {
  let errorMsg:any
  // check if doc exists
  try {
    initRef.doc(sessionId).set({ onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize }, { merge: true });
    errorMsg = false
  } catch (error) {
    if (error instanceof Error) {
      errorMsg = error.message;
      if (error instanceof Error) {
        weapon_of_logging.ERROR(
          error.name,
          error.message,
          error.stack,
          { onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize },
        );
      }
    }
  }

  return Promise.resolve(errorMsg)
}

export async function getSession(sessionId: string): Promise<[isSorted:boolean,onDeck:number,sessionSize:number]> {
  // check if doc + items exist
  let snapshot = await initRef.doc(sessionId).get();
  //@ts-ignore
  let isSorted;
  //@ts-ignore
  let onDeck;
  //@ts-ignore
  let sessionSize;
  try {
    if (snapshot.data() != undefined){
      isSorted = snapshot.data().isSorted;
      onDeck = snapshot.data().onDeck;
      sessionSize = snapshot.data().sessionSize
      weapon_of_logging.DEBUG("getSession", "grabbingSessionData",{ onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize },)
    }
      else {
  
        initRef.doc(sessionId).set({ isSorted: false, onDeck: 0, sessionSize:0 }, { merge: true }).then(() => 
        {weapon_of_logging.INFO("getSession", "setting session data success",null)}).catch((error:any) => {
          if (error instanceof Error) {
            weapon_of_logging.DEBUG("getSession", "grabbingSessionData","failed to get session data for some reason.",)
            weapon_of_logging.ERROR(
              error.name,
              error.message,
              error.stack,
              //@ts-ignore
              { onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize },

            );
            isSorted = false;
            onDeck = 0;
            sessionSize = 0;
          }
        });

        
      }
    }
     catch (error) {
    if (error instanceof Error) {
      weapon_of_logging.ERROR(
        error.name,
        error.message,
        error.stack,
        "none"
      );
    }
  }

  return Promise.resolve([isSorted, onDeck, sessionSize]);
}
