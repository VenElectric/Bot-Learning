//@ts-ignore
const { db } = require("./firebase-setup");
const { v4: uuidv4 } = require("uuid");
const initRef = db.collection("sessions");
import { collectionTypes } from "../Interfaces/ServerCommunicationTypes";
const weapon_of_logging = require("../utilities/LoggerConfig").logger
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
      weapon_of_logging.info({message: `added item to collection ${collection}`, function:"addSingle"})
    })
    .catch((error: any) => {
      // error handling
      console.trace(error);
      if (error instanceof Error) {
        weapon_of_logging.alert(
          {message: error.message, function:"addSingle"}
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
      weapon_of_logging.info({message: `successfully deleted from ${collection}`, function:"deleteSingle"})
    })
    .catch((error: any) => {
      if (error instanceof Error) {
        errorMsg = error;
        weapon_of_logging.alert(
          {message: error.message, function:"deleteSingle"}

        );
    }
    });
    return Promise.resolve(errorMsg)
}

export function updateCollectionItem(value: any, collection:string, docId: string, sessionId: string, valueName: string){
  try {
    weapon_of_logging.debug({message: {docId, collection, value, valueName}, function:"deleteSingle"})
    initRef.doc(sessionId)
    .collection(collection)
    .doc(docId)
    .set({[valueName]: value}, {merge:true})
    .then(() => {
      weapon_of_logging.info({message:`successfully updated ${valueName} in ${collection}`, function: "updateCollection"})
    })
  }
  catch(error){
    if (error instanceof Error){
      weapon_of_logging.alert({message: error.message, function: "updateCollection"});
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

  weapon_of_logging.debug({message: {docId, collection}, function:"updateCollectionRecord"})
  initRef
    .doc(sessionId)
    .collection(collection)
    .doc(docId)
    .set(item, { merge: true })
    .then(() => {
      weapon_of_logging.info({message: `success updating collection ${collection}`, function: "updateCollectionRecord"})
      errorMsg = false;
    })
    .catch((error: any) => {
      if (error instanceof Error) {
        weapon_of_logging.alert(
          {message: error.message, function: "updateCollectionRecord"}

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
      weapon_of_logging.warning({message: "snapshot.docs is undefined", function:"retrieveCollection"});
      // weapon_of_logging.warning("snapshot.docs === undefined","none",collection,sessionId)
      // throw ReferenceError(`snapshot.docs is undefined sessionId: ${sessionId} collection: ${collection}`); 
    }
  }
  catch(error){
    if (error instanceof Error) {
      weapon_of_logging.alert(
        {message: error.message, function: "updateCollectionRecord"}

      );
    }
  }
  weapon_of_logging.info({message: "collection retrieved", function:"retrieveCollection"});
  // weapon_of_logging.info("retrieveCollection", "complete",databaseList,sessionId)
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
        weapon_of_logging.alert(
         {message: error.message, function: "updatesession"}
        );
      }
    }
  }
  weapon_of_logging.info(
    {message: "updateSession set", function: "updatesession"}
   );
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
      weapon_of_logging.debug({message: "snapshot.data is not undefined",function: "getSession"})
    }
      else {
  
        initRef.doc(sessionId).set({ isSorted: false, onDeck: 0, sessionSize:0 }, { merge: true }).then(() => 
        {weapon_of_logging.info({message: "setting session data success",function: "getSession"})}).catch((error:any) => {
          if (error instanceof Error) {
            weapon_of_logging.alert(
              {message: error.message, function: "updatesession"}

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
      weapon_of_logging.alert(
        {message: error.message, function: "updatesession"}
      );
    }
  }

  return Promise.resolve([isSorted, onDeck, sessionSize]);
}
