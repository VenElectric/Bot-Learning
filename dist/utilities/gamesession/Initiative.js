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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataBase_1 = __importDefault(require("../../data/firestore/DataBase"));
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const { DiceRoll } = require("@dice-roller/rpg-dice-roller");
class Initiative extends DataBase_1.default {
    constructor(sonic) {
        super(sonic);
        this.topLevel = ServerCommunicationTypes_1.topLevelCollections.SESSIONS;
        this.secondLevel = ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE;
    }
    firstSort(initiativeList) {
        initiativeList.sort((a, b) => {
            return (b.initiative - a.initiative ||
                b.initiativeModifier - a.initiativeModifier);
        });
        // loop through initiativeList and add ordering for easier sorting later.
        initiativeList = this.setRoundOrder(initiativeList);
        this.log("Sorting Complete", this.info, this.firstSort.name);
        return initiativeList;
    }
    setRoundOrder(initiativeList) {
        for (let v = 0; v < initiativeList.length; v++) {
            initiativeList[v].roundOrder = Number(v);
        }
        return initiativeList;
    }
    roundStart(initiativeList) {
        let dupes = this.findDuplicates(initiativeList);
        if (dupes.length > 0) {
            initiativeList = this.rerollDuplicates(dupes, initiativeList);
            this.log("Duplicates Taken Care Of", this.info, this.roundStart.name);
        }
        else {
            this.log("No Duplicates Detected", this.debug, this.roundStart.name);
        }
        initiativeList = this.resetisCurrent(initiativeList);
        this.log("Reset isCurrent Variable => False", this.debug, this.roundStart.name);
        initiativeList = this.firstSort(initiativeList);
        this.log("finished sort", this.info, this.roundStart.name);
        //UPDATE ALL INITIATIVE AFTER CALLING THIS
        return initiativeList;
    }
    findDuplicates(initiativeList) {
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
                    if (Number(initiativeList[x].initiative) ==
                        Number(initiativeList[y].initiative) &&
                        Number(initiativeList[x].initiativeModifier) ==
                            Number(initiativeList[y].initiativeModifier)) {
                        dupes.push(initiativeList[x]);
                        this.log("Duplicate Init and Mod", this.debug, this.findDuplicates.name, arguments);
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
        this.log("Duplicate Detection Complete", this.debug, this.findDuplicates.name, arguments);
        return dupes;
    }
    uniqueRolls(num) {
        let arrd20 = [];
        for (let z = 0; z < num; z++) {
            let myroll = new DiceRoll("d20");
            arrd20.push(myroll.total);
        }
        return [...new Set(arrd20)];
    }
    rerollDuplicates(dupes, initiativeList) {
        try {
            let rolls = [];
            let mylen = 0;
            // while the number of dupes is less than the dupes array length, keep rolling until all dupes have been handled
            while (mylen < dupes.length) {
                rolls = this.uniqueRolls(dupes.length);
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
        catch (error) {
            this.onError(error, this.rerollDuplicates.name, arguments);
        }
        this.log("Reroll duplicates complete", this.info, this.rerollDuplicates.name);
        return initiativeList;
    }
    resort(initiativeList) {
        initiativeList.sort((a, b) => {
            return b.roundOrder - a.roundOrder;
        });
        initiativeList = this.setRoundOrder(initiativeList);
        this.log("resort complete", this.info, this.resort.name);
        return initiativeList;
    }
    resetisCurrent(initiativeList) {
        for (let record of initiativeList) {
            record.isCurrent = false;
        }
        return initiativeList;
    }
    next(initiativeList, oldNext) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                return initiativeList.splice(0, oldNext)[0];
            }
            catch (error) {
                this.onError(error, this.next.name, ...arguments);
            }
        });
    }
    previous(initiativeList, previous) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                return initiativeList[previous - 1];
            }
            catch (error) {
                this.onError(error, this.previous.name, ...arguments);
            }
        });
    }
    calcForward(calc, sessionSize) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                return calc == sessionSize - 1 ? 0 : calc + 1;
            }
            catch (error) {
                this.onError(error, this.calcForward.name, ...arguments);
            }
        });
    }
    calcBackwards(calc, sessionSize) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                return calc == 0 ? sessionSize - 1 : calc - 1;
            }
            catch (error) {
                this.onError(error, this.calcBackwards.name, ...arguments);
            }
        });
    }
    setNext(next, sessionId) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                this.db
                    .collection(this.topLevel)
                    .doc(sessionId)
                    .set({ next: next }, { merge: true });
            }
            catch (error) {
                this.onError(error, this.setNext.name, ...arguments);
            }
        });
    }
    setPrevious(previous, sessionId) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                this.db
                    .collection(this.topLevel)
                    .doc(sessionId)
                    .set({ previous: previous }, { merge: true });
            }
            catch (error) {
                this.onError(error, this.setPrevious.name, ...arguments);
            }
        });
    }
    setisSorted(isSorted, sessionId) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                this.db
                    .collection(this.topLevel)
                    .doc(sessionId)
                    .set({ isSorted: isSorted }, { merge: true });
            }
            catch (error) {
                this.onError(error, this.setPrevious.name, ...arguments);
            }
        });
    }
    setsessionSize(sessionSize, sessionId) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                this.db
                    .collection(this.topLevel)
                    .doc(sessionId)
                    .set({ sessionSize: sessionSize }, { merge: true });
            }
            catch (error) {
                this.onError(error, this.setPrevious.name, ...arguments);
            }
        });
    }
}
exports.default = Initiative;
