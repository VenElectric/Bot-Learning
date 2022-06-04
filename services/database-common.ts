//@ts-ignore
const { db } = require("./firebase-setup");
import { writeBatch, doc, collection } from "firebase/firestore";
const { v4: uuidv4 } = require("uuid");
const initRef = db.collection("sessions");
import { collectionTypes } from "../Interfaces/ServerCommunicationTypes";
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
import {
  InitiativeObject,
  SpellObject,
  CharacterStatus,
  RollObject,
} from "../Interfaces/GameSessionTypes";

export function separateArrays(characterIds: CharacterStatus[][]) {
  return { target: characterIds[1], source: characterIds[0] };
}
export async function addSingle(
  item: InitiativeObject | SpellObject | RollObject,
  sessionId: string,
  collection: collectionTypes
) {
  let errorMsg: any;
  initRef
    .doc(sessionId)
    .collection(collection)
    .doc(item.id)
    .set(item)
    .then(() => {
      errorMsg = false;
      weapon_of_logging.info({
        message: `added item to collection ${collection}`,
        function: "addSingle",
      });
    })
    .catch((error: any) => {
      // error handling
      if (error instanceof Error) {
        weapon_of_logging.alert({
          message: error.message,
          function: "addSingle",
        });
      }
      errorMsg = error;
    });

  return Promise.resolve(errorMsg);
}

export function deleteSingle(
  itemId: string,
  sessionId: string,
  collection: string
) {
  // check if doc exists
  let errorMsg: any;
  initRef
    .doc(sessionId)
    .collection(collection)
    .doc(itemId)
    .delete()
    .then(() => {
      errorMsg = false;
      weapon_of_logging.info({
        message: `successfully deleted from ${collection}`,
        function: "deleteSingle",
      });
    })
    .catch((error: any) => {
      if (error instanceof Error) {
        errorMsg = error;
        weapon_of_logging.alert({
          message: error.message,
          function: "deleteSingle",
        });
      }
    });
  return Promise.resolve(errorMsg);
}

export function updateCollectionItem(
  value: any,
  collection: string,
  docId: string,
  sessionId: string,
  valueName: string
) {
  try {
    weapon_of_logging.debug({
      message: { docId, collection, value, valueName },
      function: "updateCollectionItem",
    });
    initRef
      .doc(sessionId)
      .collection(collection)
      .doc(docId)
      .set({ [valueName]: value }, { merge: true })
      .then(() => {
        weapon_of_logging.info({
          message: `successfully updated ${valueName} in ${collection}`,
          function: "updateCollection",
        });
      });
  } catch (error) {
    if (error instanceof Error) {
      weapon_of_logging.alert({
        message: error.message,
        function: "updateCollection",
      });
    }
  }
}

export async function updateCollection(
  sessionId: string,
  collectionType: collectionTypes,
  payload: SpellObject[] | InitiativeObject[]
) {
  try {
    const docRef = db
      .collection("sessions")
      .doc(sessionId)
      .collection(collectionType);
      const batch = db.batch();
    for (const record of payload) {
      const recordRef = docRef.doc(record.id);
      batch.set(recordRef, record);
    }
    await batch.commit();
  } catch (error) {
    if (error instanceof Error) {
      weapon_of_logging.alert({
        message: error.message,
        function: `updateCollection ${collectionType} ${payload[0].id}`,
      });
    }
  }
}

export function updatecollectionRecord(
  // check if doc/collection exists
  item: InitiativeObject | SpellObject | RollObject,
  collection: string,
  docId: string,
  sessionId: string
) {
  let errorMsg: any;

  weapon_of_logging.debug({
    message: { docId, collection },
    function: "updateCollectionRecord",
  });
  initRef
    .doc(sessionId)
    .collection(collection)
    .doc(docId)
    .set(item, { merge: true })
    .then(() => {
      weapon_of_logging.info({
        message: `success updating collection ${collection}`,
        function: "updateCollectionRecord",
      });
      errorMsg = false;
    })
    .catch((error: any) => {
      if (error instanceof Error) {
        weapon_of_logging.alert({
          message: error.message,
          function: "updateCollectionRecord",
        });
      }

      errorMsg = error;
    });
  return Promise.resolve(errorMsg);
}

export async function retrieveCollection(
  sessionId: string,
  collection: string
): Promise<InitiativeObject[] | SpellObject[]> {
  let databaseList: any = [];
  try {
    let snapshot = await initRef.doc(sessionId).collection(collection).get();

    if (snapshot.docs !== undefined) {
      snapshot.forEach((doc: any) => {
        databaseList.push({ ...doc.data() });
      });
      // logging
    }
    if (snapshot.docs === undefined) {
      weapon_of_logging.warning({
        message: "snapshot.docs is undefined",
        function: "retrieveCollection",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      weapon_of_logging.alert({
        message: error.message,
        function: "updateCollectionRecord",
      });
    }
  }
  weapon_of_logging.info({
    message: "collection retrieved",
    function: "retrieveCollection",
  });
  return Promise.resolve(databaseList);
}

export async function retrieveRecord(
  docId: string,
  sessionId: string,
  collectionType: collectionTypes
) {
  try {
    const record = await initRef
      .doc(sessionId)
      .collection(collectionType.toLowerCase())
      .doc(docId)
      .get();
    weapon_of_logging.debug({
      message: record.data().id,
      function: "retrieveRecord",
    });
    return record.data();
  } catch (error) {
    weapon_of_logging.alert({
      message: `Could not find collection item: ${docId} Type: ${collectionType}`,
      function: "getRecord",
    });
  }
}

// test this
function validateNumber(value: number){
 return typeof(value) === "number" && value > 0
}

export async function updateSession(
  sessionId: string,
  onDeck?: number,
  isSorted?: boolean,
  sessionSize?: number
) {
  let errorMsg: any;
  try {
    if (onDeck) {
      initRef.doc(sessionId).set({ onDeck: onDeck }, { merge: true });
      errorMsg = false;
    }
    if (isSorted !== undefined) {
      initRef.doc(sessionId).set({ isSorted: isSorted }, { merge: true });
      errorMsg = false;
    }
    if (sessionSize) {
      initRef.doc(sessionId).set({ sessionSize: sessionSize }, { merge: true });
      errorMsg = false;
    }
  } catch (error) {
    if (error instanceof Error) {
      errorMsg = error.message;
      if (error instanceof Error) {
        weapon_of_logging.alert({
          message: error.message,
          function: "updatesession",
        });
      }
    }
  }
  weapon_of_logging.info({
    message: "updateSession set",
    function: "updatesession",
  });
  return Promise.resolve(errorMsg);
}

export async function getSession(
  sessionId: string
): Promise<[isSorted: boolean, onDeck: number, sessionSize: number]> {
  // check if doc + items exist
  let snapshot = await initRef.doc(sessionId).get();

  let isSorted;
  let onDeck;
  let sessionSize;

  try {
    if (snapshot.data() != undefined) {
      isSorted = snapshot.data().isSorted;
      onDeck = snapshot.data().onDeck;
      sessionSize = snapshot.data().sessionSize;
      weapon_of_logging.debug({
        message: "snapshot.data is not undefined",
        function: "getSession",
      });
    } else {
      initRef
        .doc(sessionId)
        .set({ isSorted: false, onDeck: 0, sessionSize: 0 }, { merge: true })
        .then(() => {
          weapon_of_logging.info({
            message: "setting session data success",
            function: "getSession",
          });
        })
        .catch((error: any) => {
          if (error instanceof Error) {
            weapon_of_logging.alert({
              message: error.message,
              function: "updatesession",
            });
            isSorted = false;
            onDeck = 0;
            sessionSize = 0;
          }
        });
    }
  } catch (error) {
    if (error instanceof Error) {
      weapon_of_logging.alert({
        message: error.message,
        function: "updatesession",
      });
    }
  }

  return Promise.resolve([isSorted, onDeck, sessionSize]);
}

export async function deleteSession(sessionId: string) {
  try {
    await deleteCollection(sessionId, collectionTypes.INITIATIVE);
    await deleteCollection(sessionId, collectionTypes.SPELLS);
  } catch (error) {
    if (error instanceof Error) {
      weapon_of_logging.alert({
        message: error.message,
        function: "deleteSession",
      });
    }
  }
}

export async function deleteCollection(
  sessionId: string,
  collectionType: collectionTypes
) {
  const docRef = db.collection("sessions").doc(sessionId);
  const docSnapshot = await docRef.collection(collectionType).get();
  const batch = db.batch();

  // use update session to change values
  if (collectionType === collectionTypes.INITIATIVE) {
    docRef
      .set({ isSorted: false, onDeck: 0, sessionSize: 0 }, { merge: true })
      .then(() => {
        weapon_of_logging.debug({
          message: "reset of session values successufl",
          function: "clearsessionlist",
        });
      })
      .catch((error: any) => {
        if (error instanceof Error) {
          weapon_of_logging.alert({
            message: "error resetting session values",
            function: "clearsessionlist",
          });
        }
      });
  }

  docSnapshot.docs.forEach((doc: any) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}
