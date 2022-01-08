//@ts-ignore
const { db } = require("./firebase-setup");
const { v4: uuidv4 } = require("uuid");
const initRef = db.collection("sessions");
import { IInit } from "../Interfaces/IInit";
import { ISpell } from "../Interfaces/ISpell";
import { initiativeCollection } from "./constants";

export async function addSingle(item: any, sessionId: string, collection: string) {
  let isUploaded;
  let errorMsg;

  initRef
    .doc(sessionId)
    .collection(collection)
    .doc(item.id)
    .set(item)
    .then(() => {
      isUploaded = true;
    })
    .catch((error: any) => {
      // error handling
      console.log(error);
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
      // insert logging here
      console.log("Success?");
    })
    .catch((error: any) => {
      // error handling
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
      console.log("success");
      isUploaded = true;
      errorMsg = 0;
    })
    .catch((error: any) => {
      console.log(error);
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
    }
  }

  return [isError, errorMsg]
}

export async function getSession(sessionId: string) {
  let snapshot = await initRef.doc(sessionId).get();
  let isSorted;
  let onDeck;
  let sessionSize;

  try {
    if (snapshot.data().isSorted != undefined) {
      isSorted = snapshot.data().isSorted;
    }
    if (snapshot.data().isSorted == undefined) {
      initRef.doc(sessionId).set({ isSorted: false }, { merge: true });
      isSorted = false;
    }
    if (snapshot.data().onDeck != undefined) {
      onDeck = snapshot.data().onDeck;
    }
    if (snapshot.data().onDeck == undefined) {
      initRef.doc(sessionId).set({ onDeck: 0 }, { merge: true });
      onDeck = 0;
    }
    if (snapshot.data().sessionSize != undefined) {
      sessionSize = snapshot.data().sessionSize;
    }
    if (snapshot.data().sessionSize == undefined) {
      let session = await retrieveCollection(sessionId, initiativeCollection);
      sessionSize = !session[0] ? session.length : 0;
      initRef.doc(sessionId).set({ sessionSize: sessionSize }, { merge: true });
    }
  } catch (error) {
    console.log(error);
    // better logging and error handling
  }
  console.log(onDeck)
  return [isSorted, onDeck, sessionSize];
}
