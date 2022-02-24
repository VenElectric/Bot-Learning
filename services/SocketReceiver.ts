import { Socket } from "socket.io";
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
import {
  InitiativeObject,
  SpellObject,
  InitiativeObjectEnums,
  SpellObjectEnums,
  CharacterStatus,
  RollObject,
} from "../Interfaces/GameSessionTypes";
import {
  collectionTypes,
  EmitTypes,
} from "../Interfaces/ServerCommunicationTypes";
import { isInitiativeObjectArray } from "../utilities/TypeChecking";
import { LoggingTypes } from "../Interfaces/LoggingTypes";
import * as dbCall from "./database-common";
import { turnOrder, resortInitiative } from "../services/initiative";
import * as initiativeFunctions from "../services/initiative";
import { initiativeEmbed, spellEmbed, statusEmbed } from "./create-embed";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { addBash } from "./parse";

export interface InitiativeSocketDataArray {
  payload: InitiativeObject[];
  sessionId: string;
  resetOnDeck: boolean;
  isSorted?: boolean;
  docId?: string;
}

export interface SpellSocketDataArray {
  payload: SpellObject[];
  sessionId: string;
}

export interface SpellSocketDataObject {
  payload: SpellObject;
  sessionId: string;
  docId?: string;
}

export interface InitiativeSocketDataObject {
  payload: InitiativeObject;
  sessionId: string;
  resetOnDeck: boolean;
  docId?: string;
}

export interface SpellSocketItem {
  ObjectType: SpellObjectEnums;
  toUpdate: any;
  sessionId: string;
  docId: string;
}

export interface InitiativeSocketItem {
  ObjectType: InitiativeObjectEnums;
  toUpdate: any;
  sessionId: string;
  docId: string;
}

function channelSend(
  client: any,
  item: { embeds?: [item: any]; content?: string; ephemeral?: boolean },
  sessionId: string
) {
  client.channels.fetch(sessionId).then((channel: any) => {
    channel.send(item);
    weapon_of_logging.info({
      message: "sending initiative to discord channel success",
      function: "DISCORD SOCKET_RECEIVER",
    });
  });
}

export function socketReceiver(socket: Socket, client: any, io: any) {
  socket.on(LoggingTypes.debug, async function (data: any) {
    weapon_of_logging.debug({ message: data.message, function: data.function });
  });
  // LOGGING SOCKETS
  socket.on(LoggingTypes.info, async function (data: any) {
    weapon_of_logging.info({ message: data.message, function: data.function });
  });

  socket.on(LoggingTypes.alert, async function (data: any) {
    weapon_of_logging.alert({ message: data.message, function: data.function });
  });

  socket.on(LoggingTypes.warning, async function (data: any) {
    weapon_of_logging.warning({
      message: data.message,
      function: data.function,
    });
  });

  // DATABASE/INITIATIVE/SPELL SOCKETS
  socket.on(
    EmitTypes.CREATE_NEW_ROLL,
    async function (data: { rollData: RollObject; sessionId: string }) {
      weapon_of_logging.debug({
        message: `adding roll ${data.rollData.id}`,
        function: EmitTypes.CREATE_NEW_ROLL,
      });
      await dbCall.addSingle(
        data.rollData,
        data.sessionId,
        collectionTypes.ROLLS
      );

      socket.broadcast
        .to(data.sessionId)
        .emit(EmitTypes.CREATE_NEW_ROLL, data.rollData);
    }
  );
  socket.on(
    EmitTypes.UPDATE_ROLL_RECORD,
    async function (data: { rollData: RollObject; sessionId: string }) {
      weapon_of_logging.debug({
        message: "updating roll",
        function: EmitTypes.UPDATE_ROLL_RECORD,
      });
      await dbCall.updatecollectionRecord(
        data.rollData,
        collectionTypes.ROLLS,
        data.rollData.id,
        data.sessionId
      );

      socket.broadcast
        .to(data.sessionId)
        .emit(EmitTypes.UPDATE_ROLL_RECORD, data.rollData);
    }
  );
  socket.on(
    EmitTypes.DELETE_ONE_ROLL,
    async function (data: { docId: string; sessionId: string }) {
      await dbCall.deleteSingle(data.docId, data.sessionId, collectionTypes.ROLLS);
        socket.broadcast
        .to(data.sessionId)
        .emit(EmitTypes.DELETE_ONE_ROLL, data.docId);
    }
  );
  socket.on(EmitTypes.DISCORD_ROLL, function(data: {payload: DiceRoll, comment: string, sessionId: string}) {
    const finalRoll = addBash(data.payload.output, "green");
    const finalComment = addBash(data.comment, "blue");

    channelSend(client,{content: `Roll Results: ${finalRoll} ${finalComment}`}, data.sessionId)


  })
  socket.on(
    EmitTypes.CREATE_NEW_INITIATIVE,
    async function (data: InitiativeSocketDataObject) {
      let finalMessage;
      weapon_of_logging.debug({
        message: data.payload,
        function: "Create new socket receiver",
      });
      finalMessage = await dbCall.addSingle(
        data.payload,
        data.sessionId,
        collectionTypes.INITIATIVE
      );
      dbCall.updateSession(data.sessionId, undefined, false);
      // where should this broadcast to?
      socket.broadcast
        .to(data.sessionId)
        .emit(EmitTypes.CREATE_NEW_INITIATIVE, data.payload);
      if (finalMessage instanceof Error) {
        weapon_of_logging.alert({
          message: finalMessage.message,
          function: EmitTypes.CREATE_NEW_INITIATIVE,
          docId: data.payload.id,
        });
      }
    }
  );
  socket.on(
    EmitTypes.CREATE_NEW_SPELL,
    async function (data: SpellSocketDataObject) {
      let finalMessage;
      const spellRecord = { ...data.payload };

      finalMessage = await dbCall.addSingle(
        spellRecord,
        data.sessionId,
        collectionTypes.SPELLS
      );
      weapon_of_logging.info({
        message: `Spell successfully added`,
        function: "Create new socket receiver",
        docId: data.payload.id,
      });
      socket.broadcast
        .to(data.sessionId)
        .emit(EmitTypes.CREATE_NEW_SPELL, data.payload);
      if (finalMessage instanceof Error) {
        weapon_of_logging.alert({
          message: finalMessage.message,
          function: EmitTypes.CREATE_NEW_SPELL,
          docId: data.payload.id,
        });
      }
    }
  );
  socket.on(
    EmitTypes.DELETE_ONE_INITIATIVE,
    async function (data: { docId: string; sessionId: string }) {
      if (data.docId !== undefined) {
        let finalMessage = await dbCall.deleteSingle(
          data.docId,
          data.sessionId,
          collectionTypes.INITIATIVE
        );
        if (finalMessage instanceof Error) {
          weapon_of_logging.alert({
            message: finalMessage.message,
            function: EmitTypes.DELETE_ONE_INITIATIVE,
            docId: data.docId,
          });
        }
        let [isSorted, onDeck, sessionSize] = await dbCall.getSession(
          data.sessionId
        );
        sessionSize -= 1;
        isSorted = false;
        onDeck = 0;
        let errorMsg = await dbCall.updateSession(
          data.sessionId,
          onDeck,
          isSorted,
          sessionSize
        );
        socket.broadcast
          .to(data.sessionId)
          .emit(EmitTypes.UPDATE_SESSION, false);
        if (errorMsg instanceof Error) {
          weapon_of_logging.alert({
            message: errorMsg.message,
            function: "DELETE_ONE SocketReceiver",
          });
        }
        socket.broadcast
          .to(data.sessionId)
          .emit(EmitTypes.DELETE_ONE_INITIATIVE, data.docId);
      }
    }
  );
  socket.on(
    EmitTypes.DELETE_ONE_SPELL,
    async function (data: { docId: string; sessionId: string }) {
      if (data.docId !== undefined) {
        let finalMessage = await dbCall.deleteSingle(
          data.docId,
          data.sessionId,
          collectionTypes.SPELLS
        );
        if (finalMessage instanceof Error) {
          weapon_of_logging.alert({
            message: finalMessage.message,
            function: EmitTypes.DELETE_ONE_SPELL,
            docId: data.docId,
          });
        }
        socket.broadcast
          .to(data.sessionId)
          .emit(EmitTypes.DELETE_ONE_SPELL, data.docId);
      }
    }
  );
  socket.on(
    EmitTypes.DELETE_ALL_INITIATIVE,
    async function (sessionId: string) {
      try {
        await dbCall.deleteCollection(sessionId, collectionTypes.INITIATIVE);
      } catch (error) {
        if (error instanceof Error) {
          weapon_of_logging.alert({
            message: error.message,
            function: EmitTypes.DELETE_ALL_INITIATIVE,
          });
        }
      }
      socket.broadcast.to(sessionId).emit(EmitTypes.UPDATE_SESSION, false);
      socket.broadcast.to(sessionId).emit(EmitTypes.DELETE_ALL_INITIATIVE);
    }
  );
  socket.on(EmitTypes.DELETE_ALL_SPELL, async function (sessionId: string) {
    try {
      await dbCall.deleteCollection(sessionId, collectionTypes.SPELLS);
    } catch (error) {
      if (error instanceof Error) {
        weapon_of_logging.alert({
          message: error.message,
          function: EmitTypes.DELETE_ALL_SPELL,
        });
      }
    }
    socket.broadcast.to(sessionId).emit(EmitTypes.DELETE_ALL_SPELL);
  });

  socket.on(
    EmitTypes.GET_INITIAL,
    async function (sessionId: string, respond: any) {
      let initiative;
      let isSorted;
      let onDeck;
      let sessionSize;
      weapon_of_logging.debug({
        message: "retrieving initial data",
        function: EmitTypes.GET_INITIAL,
      });
      initiative = (await dbCall.retrieveCollection(
        sessionId,
        collectionTypes.INITIATIVE
      )) as InitiativeObject[];
      [isSorted, onDeck, sessionSize] = await dbCall.getSession(sessionId);

      if (isSorted) {
        if (initiative !== undefined) {
          initiative = initiativeFunctions.resortInitiative(initiative);
        }
      }

      if (initiative instanceof Error) {
        weapon_of_logging.alert({
          message: initiative.message,
          function: EmitTypes.GET_INITIAL,
        });
      }

      weapon_of_logging.debug({
        message: "succesfully retrieved initiative",
        function: EmitTypes.GET_INITIAL,
      });

      respond({ initiativeList: initiative, isSorted: isSorted });
    }
  );
  socket.on(
    EmitTypes.GET_SPELLS,
    async function (sessionId: string, respond: any) {
      let spells;
      weapon_of_logging.debug({
        message: "retrieving initial spell data",
        function: EmitTypes.GET_SPELLS,
      });
      spells = await dbCall.retrieveCollection(
        sessionId,
        collectionTypes.SPELLS
      );

      if (spells instanceof Error) {
        weapon_of_logging.alert({
          message: spells.message,
          function: EmitTypes.GET_SPELLS,
        });
      }

      weapon_of_logging.debug({
        message: "succesfully retrieved spells",
        function: EmitTypes.GET_SPELLS,
      });
      respond(spells);
    }
  );
  socket.on(EmitTypes.GET_INITIAL_ROLLS, async function(sessionId: string, respond: any) {
    weapon_of_logging.debug({
      message: "retrieving initial roll data",
      function: EmitTypes.GET_INITIAL_ROLLS,
    });
    const rolls = await dbCall.retrieveCollection(sessionId, collectionTypes.ROLLS)
    respond(rolls);
  })
  socket.on(EmitTypes.NEXT, async function (sessionId: string) {
    const [errorMsg, currentName, currentStatuses, currentId] = await turnOrder(
      sessionId,
      initiativeFunctions.initiativeFunctionTypes.NEXT
    );
    weapon_of_logging.debug({
      message: "next turn and statuses retrieved",
      function: EmitTypes.NEXT,
      docId: currentId,
    });
    if (errorMsg instanceof Error) {
      weapon_of_logging.alert({
        message: errorMsg.message,
        function: EmitTypes.NEXT,
      });
    }
    weapon_of_logging.info({
      message: "succesfully retrieved next",
      function: EmitTypes.NEXT,
    });
    setTimeout(async () => {
      let record = await dbCall.retrieveRecord(
        currentId,
        sessionId,
        collectionTypes.INITIATIVE
      );

      weapon_of_logging.info({
        message: record,
        function: EmitTypes.NEXT,
      });
      io.to(sessionId).emit(EmitTypes.NEXT, record);

      const statuses = statusEmbed(currentName, currentStatuses);
      channelSend(client, { embeds: [statuses] }, sessionId);
    }, 300);
  });
  socket.on(EmitTypes.PREVIOUS, async function (sessionId: string) {
    const [errorMsg, currentName, currentStatuses, currentId] = await turnOrder(
      sessionId,
      initiativeFunctions.initiativeFunctionTypes.PREVIOUS
    );
    if (errorMsg instanceof Error) {
      weapon_of_logging.alert({
        message: errorMsg.message,
        function: EmitTypes.PREVIOUS,
      });
    }
    setTimeout(async () => {
      let record = await dbCall.retrieveRecord(
        currentId,
        sessionId,
        collectionTypes.INITIATIVE
      );

      weapon_of_logging.info({
        message: record,
        function: EmitTypes.PREVIOUS,
      });
      io.to(sessionId).emit(EmitTypes.PREVIOUS, record);

      const statuses = statusEmbed(currentName, currentStatuses);
      channelSend(client, { embeds: [statuses] }, sessionId);
    }, 300);
  });
  socket.on(EmitTypes.RESORT, async function (sessionId: string, respond: any) {
    let initiativeList = await dbCall.retrieveCollection(
      sessionId,
      collectionTypes.INITIATIVE
    );
    if (isInitiativeObjectArray(initiativeList)) {
      try {
        initiativeList = initiativeFunctions.resortInitiative(initiativeList);
        weapon_of_logging.info({
          message: "Resort Complete",
          function: EmitTypes.RESORT,
        });
        socket.broadcast.to(sessionId).emit(EmitTypes.UPDATE_ALL_INITIATIVE, {
          payload: initiativeList,
          isSorted: true,
        });
        respond(initiativeList);
      } catch (error) {
        if (error instanceof Error) {
          weapon_of_logging.alert({
            message: error.message,
            function: EmitTypes.RESORT,
          });
        }
      }
    }
  });
  socket.on(
    EmitTypes.UPDATE_ITEM_INITIATIVE,
    async function (data: {
      toUpdate: any;
      docId: string;
      sessionId: string;
      ObjectType: InitiativeObjectEnums;
    }) {
      weapon_of_logging.debug({
        message: "updating one value",
        function: EmitTypes.UPDATE_ITEM_INITIATIVE,
        docId: data.docId,
      });
      if (data.docId) {
        try {
          const newObject = Object.assign({
            toUpdate: data.toUpdate,
            docId: data.docId,
          });
          dbCall.updateCollectionItem(
            newObject.toUpdate,
            collectionTypes.INITIATIVE,
            newObject.docId,
            data.sessionId,
            data.ObjectType
          );
          console.log(data.toUpdate);
          socket.broadcast
            .to(data.sessionId)
            .emit(EmitTypes.UPDATE_ITEM_INITIATIVE, {
              toUpdate: data.toUpdate,
              ObjectType: data.ObjectType,
              docId: data.docId,
            });
          // probably do not need this
        } catch (error) {
          if (error instanceof Error) {
            weapon_of_logging.alert({
              message: error.message,
              function: EmitTypes.UPDATE_ITEM_INITIATIVE,
              docId: data.docId,
            });
          }
        }
      }
    }
  );
  socket.on(
    EmitTypes.UPDATE_ITEM_SPELL,
    async function (data: {
      toUpdate: any;
      docId: string;
      collectionType: collectionTypes;
      sessionId: string;
      ObjectType: SpellObjectEnums;
    }) {
      weapon_of_logging.debug({
        message: "updating one value",
        function: "UPDATE ONE SOCKET RECEIVER",
      });
      if (data.docId) {
        try {
          dbCall.updateCollectionItem(
            data.toUpdate,
            collectionTypes.SPELLS,
            data.docId,
            data.sessionId,
            data.ObjectType
          );
          socket.broadcast
            .to(data.sessionId)
            .emit(EmitTypes.UPDATE_ITEM_SPELL, {
              payload: {
                toUpdate: data.toUpdate,
                ObjectType: data.ObjectType,
                docId: data.docId,
              },
              collectionType: data.collectionType,
            });
        } catch (error) {
          if (error instanceof Error) {
            weapon_of_logging.alert({
              message: error.message,
              function: EmitTypes.UPDATE_ITEM_SPELL,
            });
          }
        }
      }
    }
  );
  socket.on(
    EmitTypes.UPDATE_RECORD_INITIATIVE,
    async function (data: InitiativeSocketDataObject) {
      weapon_of_logging.debug({
        message: "updating one value",
        function: EmitTypes.UPDATE_RECORD_INITIATIVE,
        docId: data.payload.id,
      });
      try {
        await dbCall.updatecollectionRecord(
          data.payload,
          collectionTypes.INITIATIVE,
          data.payload.id,
          data.sessionId
        );
        weapon_of_logging.debug({
          message: "update complete, broadcasting to room",
          function: EmitTypes.UPDATE_RECORD_INITIATIVE,
          docId: data.payload.id,
        });
        socket.broadcast
          .to(data.sessionId)
          .emit(EmitTypes.UPDATE_RECORD_INITIATIVE, data.payload);
      } catch (error) {
        if (error instanceof Error) {
          weapon_of_logging.alert({
            message: error.message,
            function: EmitTypes.UPDATE_RECORD_INITIATIVE,
            docId: data.payload.id,
          });
        }
      }
    }
  );
  socket.on(
    EmitTypes.UPDATE_RECORD_SPELL,
    async function (data: SpellSocketDataObject) {
      weapon_of_logging.debug({
        message: "updating one value",
        function: EmitTypes.UPDATE_RECORD_SPELL,
        docId: data.payload.id,
      });
      try {
        const spellRecord = { ...data.payload };
        console.log(spellRecord);
        await dbCall.updatecollectionRecord(
          spellRecord,
          collectionTypes.SPELLS,
          data.payload.id,
          data.sessionId
        );
        weapon_of_logging.debug({
          message: collectionTypes.SPELLS,
          function: EmitTypes.UPDATE_RECORD_SPELL,
          docId: data.payload.id,
        });
        socket.broadcast
          .to(data.sessionId)
          .emit(EmitTypes.UPDATE_RECORD_SPELL, data.payload);
      } catch (error) {
        if (error instanceof Error) {
          weapon_of_logging.alert({
            message: error.message,
            function: EmitTypes.UPDATE_RECORD_SPELL,
            docId: data.payload.id,
          });
        }
      }
    }
  );
  socket.on(
    EmitTypes.UPDATE_ALL_INITIATIVE,
    async function (data: InitiativeSocketDataArray) {
      let isSorted;
      if (data.isSorted !== undefined) {
        isSorted = data.isSorted;
        weapon_of_logging.debug({
          message: `isSorted is: ${isSorted}`,
          function: "UPDATE_ALL SOCKET RECEIVER",
        });
      }
      try {
        await dbCall.updateCollection(
          data.sessionId,
          collectionTypes.INITIATIVE,
          data.payload
        );
        setTimeout(async () => {
          let initiativeList = await dbCall.retrieveCollection(
            data.sessionId,
            collectionTypes.INITIATIVE
          );
          if (isInitiativeObjectArray(initiativeList)) {
            if (data.isSorted !== undefined) {
              if (data.isSorted) {
                weapon_of_logging.debug({
                  message: `data.isSorted is: ${data.isSorted}`,
                  function: "UPDATE_ALL SOCKET RECEIVER",
                });
                initiativeList = resortInitiative(initiativeList);
              }
            }
            if (data.resetOnDeck) {
              weapon_of_logging.debug({
                message: `resortOndeck: ${data.resetOnDeck}`,
                function: "UPDATE_ALL SOCKET RECEIVER",
              });

              const trueIndex = initiativeList
                .map((item: InitiativeObject) => item.isCurrent)
                .indexOf(true);

              let OnDeck;

              if (
                initiativeList[trueIndex].roundOrder === initiativeList.length
              ) {
                OnDeck = 1;
              } else {
                OnDeck = initiativeList[trueIndex].roundOrder + 1;
              }

              const errorMsg = dbCall.updateSession(
                data.sessionId,
                OnDeck,
                undefined,
                initiativeList.length
              );

              socket.broadcast
                .to(data.sessionId)
                .emit(EmitTypes.UPDATE_ALL_INITIATIVE, {
                  payload: initiativeList,
                  isSorted: true,
                });
              if (errorMsg instanceof Error) {
                weapon_of_logging.alert({
                  message: errorMsg.message,
                  function: "UPDATE_ALL SOCKET RECEIVER",
                });
              }
            } else {
              socket.broadcast
                .to(data.sessionId)
                .emit(EmitTypes.UPDATE_ALL_INITIATIVE, {
                  payload: initiativeList,
                  isSorted: data.isSorted,
                });
            }
          }
        }, 200);
      } catch (error) {
        if (error instanceof Error) {
          weapon_of_logging.alert({
            message: error.message,
            function: EmitTypes.UPDATE_ALL_INITIATIVE,
          });
        }
      }
    }
  );
  socket.on(
    EmitTypes.UPDATE_ALL_SPELL,
    async function (data: SpellSocketDataArray) {
      try {
        let spellRecord = [...data.payload];
        await dbCall.updateCollection(
          data.sessionId,
          collectionTypes.SPELLS,
          spellRecord
        );
        socket.broadcast
          .to(data.sessionId)
          .emit(EmitTypes.UPDATE_ALL_SPELL, data.payload);
      } catch (error) {
        if (error instanceof Error) {
          weapon_of_logging.alert({
            message: error.message,
            function: EmitTypes.UPDATE_ALL_SPELL,
          });
        }
      }
    }
  );
  socket.on(
    EmitTypes.ROUND_START,
    async function (sessionId: string, respond: any) {
      try {
        let initiativeList = await dbCall.retrieveCollection(
          sessionId,
          collectionTypes.INITIATIVE
        );
        weapon_of_logging.debug({
          message: "starting round start, initiative retrieved",
          function: "ROUND_START SOCKET_RECEIVER",
        });
        if (isInitiativeObjectArray(initiativeList)) {
          initiativeList = await initiativeFunctions.finalizeInitiative(
            initiativeList,
            true,
            sessionId
          );

          const startEmbed = initiativeEmbed(initiativeList);
          channelSend(
            client,
            { embeds: [startEmbed], content: "Rounds have started" },
            sessionId
          );

          weapon_of_logging.info({
            message: "initiative sorted and being emitted",
            function: "ROUND_START SOCKET_RECEIVER",
          });
          socket.broadcast.to(sessionId).emit(EmitTypes.ROUND_START);
          socket.broadcast.to(sessionId).emit(EmitTypes.UPDATE_ALL_INITIATIVE, {
            payload: initiativeList,
            collectionType: collectionTypes.INITIATIVE,
            isSorted: true,
          });
          respond(initiativeList);
        }
      } catch (error) {
        if (error instanceof ReferenceError) {
          weapon_of_logging.warning({
            message: error.message,
            function: EmitTypes.ROUND_START,
          });
          respond("No initiative to sort. Please add in initiative");
        } else if (
          error instanceof Error &&
          !(error instanceof ReferenceError)
        ) {
          weapon_of_logging.alert({
            message: error.message,
            function: EmitTypes.ROUND_START,
          });
        }
      }
    }
  );

  socket.on(
    EmitTypes.DISCORD,
    async function (data: {
      sessionId: string;
      collectionType: collectionTypes;
    }) {
      let sortedList: InitiativeObject[];
      try {
        if (data.collectionType === collectionTypes.INITIATIVE) {
          let newList = (await dbCall.retrieveCollection(
            data.sessionId,
            data.collectionType
          )) as InitiativeObject[];
          weapon_of_logging.info({
            message: `retrieving ${data.collectionType} for discord embed`,
            function: EmitTypes.DISCORD,
          });
          let [isSorted, onDeck, sessionSize] = await dbCall.getSession(
            data.sessionId
          );
          if (isSorted) {
            sortedList = resortInitiative(newList);
          } else {
            sortedList = await initiativeFunctions.finalizeInitiative(
              newList,
              false,
              data.sessionId
            );
          }
          let initEmbed = initiativeEmbed(sortedList);

          channelSend(client, { embeds: [initEmbed] }, data.sessionId);
        }
        if (data.collectionType === collectionTypes.SPELLS) {
          let newList = (await dbCall.retrieveCollection(
            data.sessionId,
            data.collectionType
          )) as SpellObject[];
          weapon_of_logging.info({
            message: `retrieving ${data.collectionType} for discord embed`,
            function: EmitTypes.DISCORD,
          });
          weapon_of_logging.debug({
            message: newList,
            function: EmitTypes.DISCORD,
          });
          let spellsEmbed = spellEmbed(newList);
          channelSend(client, { embeds: [spellsEmbed] }, data.sessionId);
        } else {
          weapon_of_logging.debug({
            message: "Enum not recognized",
            function: EmitTypes.DISCORD,
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          weapon_of_logging.alert({
            message: error.message,
            function: EmitTypes.DISCORD,
          });
        }
      }
    }
  );
}
