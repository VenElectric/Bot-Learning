import { db } from "./firebase-setup";
const initRef = db.collection("sessions");
import { InitiativeObject } from "../Interfaces/GameSessionTypes";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import {
  updatecollectionRecord,
  getSession,
  updateSession,
} from "./database-common";
import { initiativeCollection } from "./constants";
const weapon_of_logging = require("../utilities/LoggerConfig").logger
const { MessageEmbed } = require("discord.js");
const cemoj = ":bow_and_arrow:";
const bemoj = ":black_medium_square:";

// add in redis functionality for all functions
// test that each function works

export enum initiativeFunctionTypes {
  NEXT = "nextInitiative",
  PREVIOUS = "previousInitiative",
}

function uniqueRolls(num: number) {
  let arrd20 = [];
  for (let z = 0; z < num; z++) {
    let myroll = new DiceRoll("d20");
    arrd20.push(myroll.total);
  }

  return [...new Set(arrd20)];
}

function resetisCurrent(initiativeList: InitiativeObject[]){
  for (let record of initiativeList){
    record.isCurrent = false;
  }
  return initiativeList;
}

function findDuplicates(initiativeList: InitiativeObject[]) {
  let dupes = [];

  // loop i number of times = the length of initiativeList
  for (let x in initiativeList) {
    // now loop through every record in initiativeList matching it with the current iteration of initiativeList[i]
    // I.E. first we look at initiativeList[i=0] and compare that to record x of initiativeList
    for (let y in initiativeList) {
      // we want to only check values that are not initiativeList[i], so we check that against the unique ID of each record.
      // we don't use name, since there's a possibility that we could have similarly named characters.
      if (initiativeList[x].id !== initiativeList[y].id) {
       
        //logging

        // only add to dupes array if both the initiative and init_mod are the same. If the initiative is similar, but the init_mod is not, the sort later will handle that.
        if (
          Number(initiativeList[x].initiative) ==
            Number(initiativeList[y].initiative) &&
          Number(initiativeList[x].initiativeModifier) ==
            Number(initiativeList[y].initiativeModifier)
        ) {
          dupes.push(initiativeList[x]);
          weapon_of_logging.debug({message: "adding to dupes", function:"findDuplicates"})
          break;
        } else {
          continue;
        }
      }
      // if the ids are the same, don't bother!
      if (initiativeList[x].id === initiativeList[y].id) {
        continue;
      }
    }
  }
  return dupes;
}

function rerollDuplicates(dupes: InitiativeObject[], initiativeList: InitiativeObject[]) {
  // if no dupes, proceed, else we need to find out who goes before who by rolling a d20
  try {
    if (dupes.length === 0) {
      console.log("Ok!");
    } else {
      let rolls: number[] = [];
      let mylen = 0;
      // while the number of dupes is less than the dupes array length, keep rolling until all dupes have been handled
      while (mylen < dupes.length) {
        rolls = uniqueRolls(dupes.length);
        mylen = rolls.length;
      }

      // iterate through the dupes list
      for (let z = 0; z < dupes.length; z++) {
        // next iterate through initiativeList and match the id of the dupe with the id of initiativeList using .map and index of
        // we have to use .map + indexOf because this is an object. using .indexof on initiativeList will return -1 even though the id is there
        // because indexof is looking for an array of single values. Not an array of objects.
        let dupe_index = initiativeList
          .map((item: any) => item.id)
          .indexOf(dupes[z].id);
        // divide the roll total by 100
        let resultdec = Number(rolls[z] / 100);
        // get the init_mod from the record in initiativeList
        let newnum = Number(initiativeList[dupe_index].initiativeModifier);
        // add the roll/100 to the init_mod
        let total = Number(newnum + resultdec);
        // change the init_mod to the new total
        initiativeList[dupe_index].initiativeModifier = total;
        // reset values for next iteration
        newnum = 0;
        resultdec = 0;
        total = 0;
      }
    }
  } catch (error) {
    if (error instanceof Error){
      weapon_of_logging.error({message: error.message, function:"rerollDuplicates"})
    }
   
  }
  weapon_of_logging.info({message: "duplicate rerolls complete", function:"rerollDuplicates"})
  return initiativeList;
}

export function initiativeEmbed(initiativeList: InitiativeObject[]) {
  let embedFields = [];

  for (let item of initiativeList) {
    embedFields.push({
      name: `${item.characterName}`,
      value: `${item.isCurrent ? cemoj : bemoj}`,
      inline: false,
    });
  }

  return new MessageEmbed().setTitle("Initiative").addFields(embedFields);
}
//@ts-ignore
export function firstsortInitiave(initiativeList: InitiativeObject[]) {
  // now the sorting
  // we're comparing if init of a > or < b
  // if a.init > b.init then leave them in the same place
  // if a.init < b.init then sort b before a
  // the same principle applies for init_mod
  //@ts-ignore
  initiativeList.sort((a, b) => {
    // we're sorting by init.
    if (a.initiative > b.initiative) return -1;
    if (a.initiative < b.initiative) return 1;
    // and also sorting by the init_mod
    if (a.initiativeModifier > b.initiativeModifier) return -1;
    if (a.initiativeModifier < b.initiativeModifier) return 1;
  });

  // loop through initiativeList and add ordering for easier sorting later.
  for (let v = 0; v < initiativeList.length; v++) {
    initiativeList[v].roundOrder = Number(v + 1);
  }
  weapon_of_logging.info({message: "sorting complete", function:"firstsortinitiative"})
  return initiativeList;
}

export function resortInitiative(initiativeList: InitiativeObject[]) {
  //@ts-ignore
  initiativeList.sort(function (a, b) {
    if (a.roundOrder > b.roundOrder) return -1;
    if (a.roundOrder < b.roundOrder) return 1;
  });
  weapon_of_logging.debug({message: "sorting complete", function:"resortinitiative"})

  return initiativeList;
}

export async function finalizeInitiative(
  initiativeList: InitiativeObject[],
  isFirstSort: boolean,
  sessionId: string,
  onDeck: number,
  isSorted: boolean
) {
  // look for duplicate initiative and initiative modifiers. Add them to a dupes array

  let dupes = findDuplicates(initiativeList);

  weapon_of_logging.debug({message:`retrieved duplicates Number: ${dupes.length}`, function:"finalizeinitiative"})
  // if no dupes, proceed, else we need to find out who goes before who by rolling a d20
  initiativeList = rerollDuplicates(dupes, initiativeList);
  weapon_of_logging.debug({message: "reroll duplicates complete", function:"finalizeinitiative"})
  
  if (isFirstSort) {
    initiativeList = resetisCurrent(initiativeList);
    initiativeList = firstsortInitiave(initiativeList);
    isSorted = true;
    initiativeList[0].isCurrent = true;
    weapon_of_logging.debug({message: "isFirsSort = true", function:"finalizeinitiative"})
  } else {
    initiativeList = resortInitiative(initiativeList);
    weapon_of_logging.debug({message: "isFirsSort = false", function:"finalizeinitiative"})
  }
  weapon_of_logging.info(
    {message: "finished sort and dupe detection", function:"finalizeinitiative"}

  );
  await updateAllInitiative(
    initiativeList,
    sessionId,
    onDeck,
    isSorted,
    initiativeList.length
  );
 
  weapon_of_logging.info(
    {message: "finished uploading to db", function:"finalizeinitiative"}

  );
  return initiativeList;
}

export async function updateAllInitiative(
  initiativeList: InitiativeObject[],
  sessionId: string,
  onDeck: number,
  isSorted: boolean,
  sessionSize: number
) {
  // todo loggin and error handling
  let errorMsg = await updateSession(
    sessionId,
    onDeck,
    isSorted,
    sessionSize
  );
  if (errorMsg instanceof Error) {
    weapon_of_logging.error(
      {message: errorMsg.message, function:"updateAllInitiative"}
    );
  }

  for (let record of initiativeList) {
    let errorMsg2 = updatecollectionRecord(
      record,
      initiativeCollection,
      record.id,
      sessionId
    );
    if (errorMsg2 instanceof Error) {
      weapon_of_logging.error(
        {message: errorMsg.message, function:"updateAllInitiative"}

      );
    } else {
      weapon_of_logging.debug(
        {message: "finished updating collection record", function:"updateAllInitiative"}

      );
    }

  }
  weapon_of_logging.info(
    {message: "finished uploading to db", function:"updateAllInitiative"}

  );
}

export async function sortedtoFalse(sessionId: string) {
  let notSorted;
  let errorMsg;
  let dataParams = {
    isSorted: false,
    onDeck: 0,
    sessionSize: 0,
  };
  try {
    let [isSorted, onDeck, sessionSize] = await getSession(sessionId);
    dataParams.isSorted = isSorted;
    dataParams.onDeck = onDeck;
    dataParams.sessionSize = sessionSize;
    if (isSorted) {
      let errorMsg2 = await updateSession(
        sessionId,
        onDeck,
        false,
        sessionSize
      );
      notSorted = true;

      if (errorMsg2 instanceof Error) {
        weapon_of_logging.error(
          {message: errorMsg2.message, function:"sortedtoFalse"}

        );
      }
    } else {
      weapon_of_logging.info(
       {message: "finished resting isSorted to false", function:"sortedtoFalse"}
      );
      notSorted = true;
    }
  } catch (error) {
    if (error instanceof Error) {
      weapon_of_logging.error(
        {message: error.message, function:"sortedtoFalse"}
      );
    }
  }

  return [errorMsg, notSorted];
}

export function nextInitiative(onDeck: number, sessionLength: number) {
  let newOnDeck = 0;
  let previous = 0;

  if (onDeck == sessionLength) {
    newOnDeck = 1;
    previous = onDeck - 1;
    //logging
    weapon_of_logging.debug(
      {message: "onDeck == sessionLength", function:"nextInitiative"}
     );
  }
  if (onDeck == 1) {
    newOnDeck = onDeck + 1;
    previous = sessionLength;
    //logging
    weapon_of_logging.debug(
      {message: "onDeck == 1", function:"nextInitiative"}
     );
  }
  if (onDeck < sessionLength && onDeck != 1) {
    newOnDeck = onDeck + 1;
    previous = onDeck - 1;
    //logging
    weapon_of_logging.debug(
      {message: "onDeck < sessionLength && onDeck != 1", function:"nextInitiative"}
     );
  }

  return [newOnDeck, previous];
}

export function previousInitiative(
  previousOnDeck: number,
  sessionLength: number
) {
  let newOnDeck = 0;
  let current = 0;

  // use the current ondeck to go to a previous initiative order
  //  I.E. if ondeck is currently 4, then the current turn is 3, and we want to go back to 2
  // then 4 - 1 = 3 which would be the new ondeck
  // and then the new current would be the new ondeck - 1 or 3 - 1 = 2
  if (previousOnDeck === 2) {
    newOnDeck = 1;
    current = sessionLength;
    //logging
    weapon_of_logging.debug(
      {message: "previousOnDeck === 2", function:"previousInitiative"}
     );
  }
  if (previousOnDeck === 1) {
    newOnDeck = sessionLength;
    current = sessionLength - 1;
    //logging
    weapon_of_logging.debug(
      {message: "previousOnDeck === 1", function:"previousInitiative"}
     );
  }
  if (previousOnDeck <= sessionLength && previousOnDeck > 2) {
    newOnDeck = previousOnDeck - 1;
    current = newOnDeck - 1;
    //logging
    weapon_of_logging.debug(
      {message: "previousOnDeck <= sessionLength && previousOnDeck > 2", function:"previousInitiative"}
     );
  }

  return [newOnDeck, current];
}

export async function turnOrder(
  sessionId: string,
  functionType: initiativeFunctionTypes
) {
  const [isSorted, onDeck, sessionSize] = await getSession(sessionId);
  if (functionType == initiativeFunctionTypes.NEXT) {
    if (onDeck != 0) {
      weapon_of_logging.debug(
        {message: "starting next function", function:"turnOrder"}
       );
      let [newOnDeck, previous] = nextInitiative(onDeck, sessionSize);
      return Promise.resolve(nextpreviousDatabase(sessionId, previous, onDeck, newOnDeck));
    }
  }
  if (functionType == initiativeFunctionTypes.PREVIOUS) {
    weapon_of_logging.debug(
      {message: "starting previous function", function:"turnOrder"}
     );
    let [newOnDeck, current] = previousInitiative(onDeck, sessionSize);
    return Promise.resolve(nextpreviousDatabase(sessionId, newOnDeck, current, newOnDeck));
  }
}

async function nextpreviousDatabase(
  sessionId: string,
  toFalse: number,
  toTrue: number,
  newOnDeck: number
) {
  let currentName;
  let errorMsg;
  let snapshotData = {
    toFalse: null,
    toTrue: null,
  };
  try {
    let toFalseSnapshot = await initRef
      .doc(sessionId)
      .collection("initiative")
      .where("roundOrder", "==", Number(toFalse))
      .get();
    let toTrueSnapshot = await initRef
      .doc(sessionId)
      .collection("initiative")
      .where("roundOrder", "==", Number(toTrue))
      .get();
    snapshotData.toFalse = toFalseSnapshot.docs[0].id;
    snapshotData.toTrue = toTrueSnapshot.docs[0].id;
    initRef
      .doc(sessionId)
      .collection("initiative")
      .doc(snapshotData.toFalse)
      .set({ isCurrent: false }, { merge: true });
    initRef
      .doc(sessionId)
      .collection("initiative")
      .doc(snapshotData.toTrue)
      .set({ isCurrent: true }, { merge: true });

    initRef.doc(sessionId).set({ onDeck: newOnDeck }, { merge: true });
    weapon_of_logging.info(
      {message: "finished setting snapshot data", function:"nextpreviousDatabase"}
    );

    currentName = toTrueSnapshot.docs[0].data().characterName;
  } catch (error: any) {
    if (error instanceof Error) {
      weapon_of_logging.error(
       {message: error.message, function: "nextpreviousDatabase"}

      );
    }
    errorMsg = error;
    // error logging
  }

  return [errorMsg, currentName];
}
