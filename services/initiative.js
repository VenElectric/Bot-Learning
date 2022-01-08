"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.turnOrder = exports.previousInitiative = exports.nextInitiative = exports.sortedtoFalse = exports.updateAllInitiative = exports.finalizeInitiative = exports.resortInitiative = exports.firstsortInitiave = exports.initiativeEmbed = exports.initiativeFunctionTypes = void 0;
const firebase_setup_1 = require("./firebase-setup");
const initRef = firebase_setup_1.db.collection("sessions");
const rpg_dice_roller_1 = require("@dice-roller/rpg-dice-roller");
const database_common_1 = require("./database-common");
const constants_1 = require("./constants");
const { MessageEmbed } = require("discord.js");
const cemoj = ":bow_and_arrow:";
const bemoj = ":black_medium_square:";
// add in redis functionality for all functions
// test that each function works
var initiativeFunctionTypes;
(function (initiativeFunctionTypes) {
    initiativeFunctionTypes["NEXT"] = "nextInitiative";
    initiativeFunctionTypes["PREVIOUS"] = "previousInitiative";
})(initiativeFunctionTypes = exports.initiativeFunctionTypes || (exports.initiativeFunctionTypes = {}));
function uniqueRolls(num) {
    let arrd20 = [];
    for (let z = 0; z < num; z++) {
        let myroll = new rpg_dice_roller_1.DiceRoll("d20");
        arrd20.push(myroll.total);
    }
    return [...new Set(arrd20)];
}
function findDuplicates(initiativeList) {
    let dupes = [];
    // loop i number of times = the length of initiativeList
    for (let x in initiativeList) {
        // now loop through every record in initiativeList matching it with the current iteration of initiativeList[i]
        // I.E. first we look at initiativeList[i=0] and compare that to record x of initiativeList
        for (let y in initiativeList) {
            // we want to only check values that are not initiativeList[i], so we check that against the unique ID of each record.
            // we don't use name, since there's a possibility that we could have similarly named characters.
            if (initiativeList[x].id !== initiativeList[y].id) {
                console.log("initiativeList");
                //logging
                // only add to dupes array if both the initiative and init_mod are the same. If the initiative is similar, but the init_mod is not, the sort later will handle that.
                if (Number(initiativeList[x].initiative) ==
                    Number(initiativeList[y].initiative) &&
                    Number(initiativeList[x].initiativeModifier) ==
                        Number(initiativeList[y].initiativeModifier)) {
                    dupes.push(initiativeList[x]);
                    break;
                }
                else {
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
function rerollDuplicates(dupes, initiativeList) {
    // if no dupes, proceed, else we need to find out who goes before who by rolling a d20
    try {
        if (dupes.length === 0) {
            console.log("Ok!");
        }
        else {
            let rolls = [];
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
                    .map((item) => item.id)
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
    }
    catch (error) {
        console.log(error);
    }
    return initiativeList;
}
function initiativeEmbed(initiativeList) {
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
exports.initiativeEmbed = initiativeEmbed;
//@ts-ignore
function firstsortInitiave(initiativeList) {
    // now the sorting
    // we're comparing if init of a > or < b
    // if a.init > b.init then leave them in the same place
    // if a.init < b.init then sort b before a
    // the same principle applies for init_mod
    //@ts-ignore
    initiativeList.sort((a, b) => {
        // we're sorting by init.
        if (a.initiative > b.initiative)
            return -1;
        if (a.initiative < b.initiative)
            return 1;
        // and also sorting by the init_mod
        if (a.initiativeModifier > b.initiativeModifier)
            return -1;
        if (a.initiativeModifier < b.initiativeModifier)
            return 1;
    });
    // loop through initiativeList and add ordering for easier sorting later.
    for (let v = 0; v < initiativeList.length; v++) {
        initiativeList[v].roundOrder = Number(v + 1);
    }
    return initiativeList;
}
exports.firstsortInitiave = firstsortInitiave;
function resortInitiative(initiativeList) {
    //@ts-ignore
    initiativeList.sort(function (a, b) {
        if (a.roundOrder > b.roundOrder)
            return -1;
        if (a.roundOrder < b.roundOrder)
            return 1;
    });
    return initiativeList;
}
exports.resortInitiative = resortInitiative;
function finalizeInitiative(initiativeList, isFirstSort, sessionId, onDeck, isSorted) {
    return __awaiter(this, void 0, void 0, function* () {
        // look for duplicate initiative and initiative modifiers. Add them to a dupes array
        let dupes = findDuplicates(initiativeList);
        console.log(dupes);
        // if no dupes, proceed, else we need to find out who goes before who by rolling a d20
        initiativeList = rerollDuplicates(dupes, initiativeList);
        if (isFirstSort) {
            initiativeList = firstsortInitiave(initiativeList);
            initiativeList[0].isCurrent = true;
        }
        else {
            initiativeList = resortInitiative(initiativeList);
        }
        let uploadResults = yield updateAllInitiative(initiativeList, sessionId, onDeck, isSorted, initiativeList.length);
        console.log("upload results", uploadResults);
        // better logic for logging/error handling
        return initiativeList;
    });
}
exports.finalizeInitiative = finalizeInitiative;
function updateAllInitiative(initiativeList, sessionId, onDeck, isSorted, sessionSize) {
    return __awaiter(this, void 0, void 0, function* () {
        let uploadArray = [];
        // todo loggin and error handling
        let [isError, errorMsg] = yield (0, database_common_1.updateSession)(sessionId, onDeck, isSorted, sessionSize);
        console.log(isError, errorMsg);
        for (let record of initiativeList) {
            let [isUploaded, errorMsg2] = (0, database_common_1.updatecollectionRecord)(record, constants_1.initiativeCollection, record.id, sessionId);
            uploadArray.push(Object.assign({ isUploaded: isUploaded, errorMsg: errorMsg2 }, record));
        }
        return uploadArray;
    });
}
exports.updateAllInitiative = updateAllInitiative;
function sortedtoFalse(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        let notSorted;
        let errorMsg;
        try {
            let [isSorted, onDeck, sessionSize] = yield (0, database_common_1.getSession)(sessionId);
            if (isSorted) {
                let [isError, errorMsg2] = yield (0, database_common_1.updateSession)(sessionId, onDeck, false, sessionSize);
                notSorted = true;
                if (isError) {
                    console.log(errorMsg2);
                    errorMsg = errorMsg2;
                }
            }
            else {
                // insert logging here
                notSorted = true;
            }
        }
        catch (error) {
            // better error handling. Not sure where the typerror for issorted is being caught....
            console.log(error);
            errorMsg = error;
            notSorted = true;
        }
        return [errorMsg, notSorted];
    });
}
exports.sortedtoFalse = sortedtoFalse;
function nextInitiative(onDeck, sessionLength) {
    let newOnDeck = 0;
    let previous = 0;
    if (onDeck == sessionLength) {
        newOnDeck = 1;
        previous = onDeck - 1;
        //logging
        console.log("this");
    }
    if (onDeck == 1) {
        newOnDeck = onDeck + 1;
        previous = sessionLength;
        //logging
        console.log("prev=total");
    }
    if (onDeck < sessionLength && onDeck != 1) {
        newOnDeck = onDeck + 1;
        previous = onDeck - 1;
        //logging
        console.log("current<total");
    }
    return [newOnDeck, previous];
}
exports.nextInitiative = nextInitiative;
function previousInitiative(previousOnDeck, sessionLength) {
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
        console.log("this");
    }
    if (previousOnDeck === 1) {
        newOnDeck = sessionLength;
        current = sessionLength - 1;
        //logging
        console.log("prev=total");
    }
    if (previousOnDeck <= sessionLength && previousOnDeck > 2) {
        newOnDeck = previousOnDeck - 1;
        current = newOnDeck - 1;
        //logging
        console.log(newOnDeck, current);
        console.log("current<total");
    }
    // need to change isCurrent to reflect the new current turn.
    // newondeck was previously the current turn so it needs to be false for isCurrent
    // current (from our previous exmample) is now 2, so that record needs to be true for isCurrent
    // and then set the ondeck parameter in the initiative collection to the newOndeck number
    return [newOnDeck, current];
}
exports.previousInitiative = previousInitiative;
function turnOrder(sessionId, functionType) {
    return __awaiter(this, void 0, void 0, function* () {
        const [isSorted, onDeck, sessionSize] = yield (0, database_common_1.getSession)(sessionId);
        if (functionType == initiativeFunctionTypes.NEXT) {
            console.log(onDeck, "Ondeck?");
            if (onDeck != 0) {
                let [newOnDeck, previous] = nextInitiative(onDeck, sessionSize);
                return nextpreviousDatabase(sessionId, previous, onDeck, newOnDeck);
            }
        }
        if (functionType == initiativeFunctionTypes.PREVIOUS) {
            let [newOnDeck, current] = previousInitiative(onDeck, sessionSize);
            return nextpreviousDatabase(sessionId, newOnDeck, current, newOnDeck);
        }
    });
}
exports.turnOrder = turnOrder;
function nextpreviousDatabase(sessionId, toFalse, toTrue, newOnDeck) {
    return __awaiter(this, void 0, void 0, function* () {
        let currentName;
        let errorMsg;
        try {
            console.log(toFalse, "toFalse");
            console.log(toTrue, "toTrue");
            let toFalseSnapshot = yield initRef
                .doc(sessionId)
                .collection("initiative")
                .where("roundOrder", "==", Number(toFalse))
                .get();
            let toTrueSnapshot = yield initRef
                .doc(sessionId)
                .collection("initiative")
                .where("roundOrder", "==", Number(toTrue))
                .get();
            initRef
                .doc(sessionId)
                .collection("initiative")
                .doc(toFalseSnapshot.docs[0].id)
                .set({ isCurrent: false }, { merge: true });
            initRef
                .doc(sessionId)
                .collection("initiative")
                .doc(toTrueSnapshot.docs[0].id)
                .set({ isCurrent: true }, { merge: true });
            initRef.doc(sessionId).set({ onDeck: newOnDeck }, { merge: true });
            currentName = toTrueSnapshot.docs[0].data().characterName;
        }
        catch (error) {
            console.log(error);
            errorMsg = error;
            // error logging
        }
        return [errorMsg, currentName];
    });
}
// // remove and use retrieveData from database-common
// export async function retrieveInitiative(sessionId: string) {
//   let initiativeList: IDatabase[] = [];
//   let snapshot = await initRef.doc(sessionId).collection("initiative").get();
//   if (snapshot.docs !== undefined) {
//     snapshot.forEach((doc: any) => {
//       initiativeList.push({ ...doc.data() });
//     });
//     // logging
//     return initiativeList;
//   }
//   if (snapshot.docs === undefined) {
//     // logging
//     return false;
//   }
// }
