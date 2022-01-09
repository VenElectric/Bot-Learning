//@ts-ignore
const { db } = require("./firebase-setup");
const { v4: uuidv4 } = require("uuid");
const initRef = db.collection("sessions");
import { IInit } from "../Interfaces/IInit";
import { ISpell } from "../Interfaces/ISpell";
import { collectionTypes } from "../Interfaces/ENUMS";
import { weapon_of_logging } from "../utilities/LoggingClass";


export async function addSingle(item: any, sessionId: string, collection: collectionTypes) {
  let isUploaded;
  let errorMsg: any;
  initRef
    .doc(sessionId)
    .collection(collection)
    .doc(item.id)
    .set(item)
    .then(() => {
      isUploaded = true;
      errorMsg = "";
      weapon_of_logging.INFO("isUploaded", "added single upload",item,sessionId)
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
          sessionId
        );
    }
      isUploaded = false;
      errorMsg = error;
    });

  return [isUploaded, errorMsg];
}

export function deleteSingle(
  itemId: string,
  sessionId: string,
  collection: string
) {
  initRef
    .doc(sessionId)
    .collection(collection)
    .doc(itemId)
    .delete()
    .then(() => {
      weapon_of_logging.INFO("isDeleted", "success deletion",itemId,sessionId)
    })
    .catch((error: any) => {
      if (error instanceof Error) {
        weapon_of_logging.ERROR(
          error.name,
          error.message,
          error.stack,
          {itemId: itemId, collectionType: collection},
          sessionId
        );
    }
      console.log(error);
    });
}

export function updatecollectionRecord(
  item: any,
  collection: string,
  docId: string,
  sessionId: string
) {
  let isUploaded;
  let errorMsg;

  initRef
    .doc(sessionId)
    .collection(collection)
    .doc(docId)
    .set(item, { merge: true })
    .then(() => {
      weapon_of_logging.INFO("updateCollectionRecord", `success updating collection ${collection}`,{item:item,docId:docId,collection:collection},sessionId)
      isUploaded = true;
      errorMsg = 0;
    })
    .catch((error: any) => {
      if (error instanceof Error) {
        weapon_of_logging.ERROR(
          error.name,
          error.message,
          error.stack,
          {item: item, docId: docId, collectionType: collection},
          sessionId
        );
      }
      isUploaded = false;
      errorMsg = error;
    });
  return [isUploaded, errorMsg];
}

export async function retrieveCollection(
  sessionId: string,
  collection: string
): Promise<IInit[] | ISpell[] | boolean[]> {
  let databaseList = [];

  let snapshot = await initRef.doc(sessionId).collection(collection).get();

  if (snapshot.docs !== undefined) {
    snapshot.forEach((doc: any) => {
      databaseList.push({ ...doc.data() });
    });
    // logging
  }
  if (snapshot.docs === undefined) {
    // logging
    databaseList.push(false);
  }

  return databaseList;
}

export async function updateSession(
  sessionId: string,
  onDeck: number,
  isSorted: boolean,
  sessionSize: number
) {
  let isError = false;
  let errorMsg;
  try {
    initRef.doc(sessionId).set({ onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize }, { merge: true });
  } catch (error) {
    if (error instanceof Error) {
      isError = true;
      errorMsg = error.message;
      if (error instanceof Error) {
        weapon_of_logging.ERROR(
          error.name,
          error.message,
          error.stack,
          { onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize },
          sessionId
        );
      }
    }
  }

  return [isError, errorMsg]
}

export async function getSession(sessionId: string) {
  let snapshot = await initRef.doc(sessionId).get();
  //@ts-ignore
  let isSorted;
  //@ts-ignore
  let onDeck;
  //@ts-ignore
  let sessionSize;
console.log("in get session")
  try {
    console.log("in try catch ")
    if (snapshot.data() != undefined){
      console.log(snapshot.data(), "not undefined")
      isSorted = snapshot.data().isSorted;
      onDeck = snapshot.data().onDeck;
      sessionSize = snapshot.data().sessionSize
      weapon_of_logging.INFO("getSession", "grabbingSessionData",{ onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize },sessionId)
    }
      else {
        console.log("initref set")
        initRef.doc(sessionId).set({ isSorted: false, onDeck: 0, sessionSize:0 }, { merge: true }).then(() => 
        {console.log("sucess")}).catch((error:any) => {
          if (error instanceof Error) {
            weapon_of_logging.ERROR(
              error.name,
              error.message,
              error.stack,
              //@ts-ignore
              { onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize },
              sessionId
            );
          }
        });
        console.log(sessionId)
        
      }
    }
     catch (error) {
    console.log(error);
    console.log("in error")
    console.log(typeof(snapshot.data()))
    console.log(snapshot.data())
    if (error instanceof Error) {
      weapon_of_logging.ERROR(
        error.name,
        error.message,
        error.stack,
        sessionId,
        sessionId
      );
    }
    // better logging and error handling
  }

  return [isSorted, onDeck, sessionSize];
}
