import { Socket } from "socket.io";
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
import {
  InitiativeObject,
  SpellObject,
  InitiativeObjectEnums,
} from "../Interfaces/GameSessionTypes";
import {
  collectionTypes,
  EmitTypes,
} from "../Interfaces/ServerCommunicationTypes";
import {
  isInitiativeObjectArray,
  isSpellObjectArray,
} from "../utilities/TypeChecking";
import { LoggingTypes } from "../Interfaces/LoggingTypes";
import * as dbCall from "./database-common";
import { turnOrder, resortInitiative } from "../services/initiative";
import * as initiativeFunctions from "../services/initiative";
import { initiativeEmbed, spellEmbed, statusEmbed } from "./create-embed";
import chalk from "chalk";

export interface SocketDataArray {
  payload: InitiativeObject | InitiativeObject[] | SpellObject | SpellObject[];
  sessionId: string;
  collectionType: collectionTypes;
  resetOnDeck: boolean;
  isSorted?: boolean;
  docId?: string;
}

export interface SocketDataObject {
  payload: InitiativeObject | SpellObject;
  sessionId: string;
  collectionType: collectionTypes;
  resetOnDeck: boolean;
  docId?: string;
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

  socket.on(EmitTypes.CREATE_NEW, async function (data: SocketDataArray) {
    let finalMessage;
    weapon_of_logging.debug({
      message: data.payload,
      function: "Create new socket receiver",
    });
    if (data.collectionType === collectionTypes.INITIATIVE) {
      finalMessage = await dbCall.addSingle(
        data.payload as InitiativeObject,
        data.sessionId,
        collectionTypes.INITIATIVE
      );
      dbCall.updateSession(data.sessionId, undefined, false);
      // where should this broadcast to?
      socket.broadcast.to(data.sessionId).emit(EmitTypes.CREATE_NEW, {
        payload: data.payload,
        collectionType: collectionTypes.INITIATIVE,
      });
    }
    if (data.collectionType === collectionTypes.SPELLS) {
      finalMessage = await dbCall.addSingle(
        data.payload as SpellObject,
        data.sessionId,
        collectionTypes.SPELLS
      );
      weapon_of_logging.debug({
        message: data.payload,
        function: "Create new socket receiver",
      });
      socket.broadcast.to(data.sessionId).emit(EmitTypes.CREATE_NEW, {
        payload: data.payload,
        collectionType: collectionTypes.SPELLS,
      });
    } else {
      finalMessage = `Invalid Collection Type. Type Sent: ${data.collectionType}`;
    }
    if (finalMessage instanceof Error) {
      weapon_of_logging.alert({
        message: finalMessage.message,
        function: "create_new SocketReceiver",
      });
    }
  });
  socket.on(EmitTypes.DELETE_ONE, async function (data: SocketDataArray) {
    if (data.docId !== undefined) {
      let finalMessage = await dbCall.deleteSingle(
        data.docId,
        data.sessionId,
        data.collectionType
      );
      if (finalMessage instanceof Error) {
        weapon_of_logging.alert({
          message: finalMessage.message,
          function: "DELETE_ONE SocketReceiver",
        });
      }
      if (data.collectionType === collectionTypes.INITIATIVE) {
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
      }
      socket.broadcast.to(data.sessionId).emit(EmitTypes.DELETE_ONE, {
        id: data.docId,
        collectionType: data.collectionType,
      });
    }
  });
  socket.on(EmitTypes.DELETE_ALL, async function (sessionId: string) {
    await dbCall.deleteSession(sessionId);
    let errorMsg = await dbCall.updateSession(sessionId, 0, false, 0);
    if (errorMsg instanceof Error) {
      weapon_of_logging.alert({
        message: errorMsg.message,
        function: "DELETE_ONE SocketReceiver",
      });
    }
    socket.broadcast.to(sessionId).emit(EmitTypes.UPDATE_SESSION, false);
    socket.broadcast.to(sessionId).emit(EmitTypes.DELETE_ALL);
  });

  socket.on(
    EmitTypes.GET_INITIAL,
    async function (data: SocketDataArray, respond: any) {
      let sessionId = data.sessionId;
      let initiative;
      let isSorted;
      let onDeck;
      let sessionSize;
      weapon_of_logging.debug({
        message: "retrieving initial data",
        function: "GET_INITIAL SOCKET RECEIVER",
      });
      if (data.sessionId !== undefined) {
        initiative = (await dbCall.retrieveCollection(
          data.sessionId,
          data.collectionType
        )) as InitiativeObject[];
        [isSorted, onDeck, sessionSize] = await dbCall.getSession(
          data.sessionId
        );
      }

      if (isSorted) {
        if (initiative !== undefined) {
          initiative = initiativeFunctions.resortInitiative(initiative);
        }
      }

      if (initiative instanceof Error) {
        weapon_of_logging.alert({
          message: initiative.message,
          function: "GET_INITIAL SOCKET RECEIVER",
        });
      }

      weapon_of_logging.debug({
        message: "succesfully retrieved initiative",
        function: "GET_INITIAL SOCKET RECEIVER",
      });

      respond({ initiativeList: initiative, isSorted: isSorted });
    }
  );
  socket.on(
    EmitTypes.GET_SPELLS,
    async function (data: SocketDataArray, respond: any) {
      let spells;
      weapon_of_logging.debug({
        message: "retrieving initial spell data",
        function: "GET_SPELLS SOCKET RECEIVER",
      });
      if (data.sessionId !== undefined) {
        spells = await dbCall.retrieveCollection(
          data.sessionId,
          data.collectionType
        );
      }

      if (spells instanceof Error) {
        weapon_of_logging.alert({
          message: spells.message,
          function: "GET_INITIAL SOCKET RECEIVER",
        });
      }

      weapon_of_logging.debug({
        message: "succesfully retrieved spells",
        function: "GET_SPELLS SOCKET RECEIVER",
      });

      respond({ spells: spells });
    }
  );
  socket.on(EmitTypes.NEXT, async function (data: SocketDataArray) {
    const [errorMsg, currentName, currentStatuses, currentId] = await turnOrder(
      data.sessionId,
      initiativeFunctions.initiativeFunctionTypes.NEXT
    );

    console.log(currentStatuses);
    if (errorMsg instanceof Error) {
      weapon_of_logging.alert(
        errorMsg.name,
        errorMsg.message,
        errorMsg.stack,
        data.payload
      );
    }
    weapon_of_logging.info({
      message: "succesfully retrieved next",
      function: "NEXT SOCKET RECEIVER",
    });
    setTimeout(async () => {
      let record = await dbCall.retrieveRecord(
        currentId,
        data.sessionId,
        collectionTypes.INITIATIVE
      );

      weapon_of_logging.info({
        message: record,
        function: "next SOCKET RECEIER",
      });
      io.to(data.sessionId).emit(EmitTypes.NEXT, record);

      const statuses = statusEmbed(currentName, currentStatuses);
      channelSend(client, { embeds: [statuses] }, data.sessionId);
    }, 300);
  });
  socket.on(EmitTypes.PREVIOUS, async function (data: SocketDataArray) {
    const [errorMsg, currentName, currentStatuses, currentId] = await turnOrder(
      data.sessionId,
      initiativeFunctions.initiativeFunctionTypes.PREVIOUS
    );
    if (errorMsg instanceof Error) {
      weapon_of_logging.alert({
        message: errorMsg.message,
        function: "PREVIOUS SOCKET RECEIVER",
      });
    }
    setTimeout(async () => {
      let record = await dbCall.retrieveRecord(
        currentId,
        data.sessionId,
        collectionTypes.INITIATIVE
      );

      weapon_of_logging.info({
        message: record,
        function: "previous SOCKET RECEIER",
      });
      io.to(data.sessionId).emit(EmitTypes.PREVIOUS, record);

      const statuses = statusEmbed(currentName, currentStatuses);
      channelSend(client, { embeds: [statuses] }, data.sessionId);
    }, 300);
  });
  socket.on(
    EmitTypes.RESORT,
    async function (data: SocketDataArray, respond: any) {
      let initiativeList = (await dbCall.retrieveCollection(
        data.sessionId,
        collectionTypes.INITIATIVE
      )) as InitiativeObject[];
      if (isInitiativeObjectArray(initiativeList)) {
        let finalMessage = initiativeFunctions.resortInitiative(initiativeList);
        socket.broadcast.to(data.sessionId).emit(EmitTypes.UPDATE_ALL, {
          payload: finalMessage,
          collectionType: collectionTypes.INITIATIVE,
        });
        if (finalMessage instanceof Error) {
          weapon_of_logging.alert({
            message: finalMessage.message,
            function: "RESORT SOCKET RECEIVER",
          });
        }
        respond(finalMessage);
      }
    }
  );
  socket.on(EmitTypes.RE_ROLL, async function (data: SocketDataArray) {
    if (data.docId) {
      let initiativeList = data.payload as InitiativeObject;
      let docId = data.docId;
      let finalMessage = await dbCall.updatecollectionRecord(
        initiativeList,
        data.collectionType,
        docId,
        data.sessionId
      );
      socket.broadcast.to(data.sessionId).emit(EmitTypes.UPDATE_ITEM, {
        payload: {
          toUpdate: initiativeList.initiative,
          ObjectType: InitiativeObjectEnums.initiative,
          docId: data.docId,
        },
        collectionType: collectionTypes.INITIATIVE,
      });
      if (finalMessage instanceof Error) {
        weapon_of_logging.alert({
          message: finalMessage.message,
          function: "REROLL SOCKET RECEIVER",
        });
      }
    }
  });
  socket.on(
    EmitTypes.UPDATE_ITEM,
    async function (data: {
      toUpdate: any;
      docId: string;
      collectionType: collectionTypes;
      sessionId: string;
      ObjectType: InitiativeObjectEnums;
    }) {
      weapon_of_logging.debug({
        message: "updating one value",
        function: "UPDATE ONE SOCKET RECEIVER",
      });
      if (data.docId) {
        try {
          dbCall.updateCollectionItem(
            data.toUpdate,
            data.collectionType.toLowerCase(),
            data.docId,
            data.sessionId,
            data.ObjectType
          );
          socket.broadcast.to(data.sessionId).emit(EmitTypes.UPDATE_ITEM, {
            payload: {
              toUpdate: data.toUpdate,
              ObjectType: data.ObjectType,
              docId: data.docId,
            },
            collectionType: data.collectionType,
          });
          // probably do not need this
        } catch (error) {
          if (error instanceof Error) {
            weapon_of_logging.alert({
              message: error.message,
              function: "UPDATE_ONE SOCKET RECEIVER",
            });
          }
        }
      }
    }
  );

  socket.on(EmitTypes.UPDATE_RECORD, async function (data: SocketDataObject) {
    weapon_of_logging.debug({
      message: "updating one value",
      function: "UPDATE RECORD SOCKET RECEIVER",
    });
    try {
      if (data.docId == undefined) {
        weapon_of_logging.warning({
          message: "missing docid",
          function: "UPDATE RECORD SOCKET RECEIVER",
        });
        return;
      }
      await dbCall.updatecollectionRecord(
        data.payload,
        data.collectionType,
        data.docId,
        data.sessionId
      );
      weapon_of_logging.debug({
        message: data.collectionType,
        function: "update record",
      });
      socket.broadcast.to(data.sessionId).emit(EmitTypes.UPDATE_RECORD, {
        payload: data.payload,
        collectionType: data.collectionType,
      });
    } catch (error) {
      if (error instanceof Error) {
        weapon_of_logging.alert({
          message: error.message,
          function: "UPDATE RECORD SOCKET RECEIVER",
        });
      }
    }
  });

  socket.on(EmitTypes.UPDATE_ALL, async function (data: SocketDataArray) {
    let isSorted;
    if (data.isSorted !== undefined) {
      isSorted = data.isSorted;
      weapon_of_logging.debug({
        message: `isSorted is: ${isSorted}`,
        function: "UPDATE_ALL SOCKET RECEIVER",
      });
    }
    if (
      isInitiativeObjectArray(data.payload) ||
      isSpellObjectArray(data.payload)
    ) {
      for (let record of data.payload) {
        try {
          let finalMessage = await dbCall.updatecollectionRecord(
            record,
            data.collectionType,
            record.id,
            data.sessionId
          );

          if (finalMessage instanceof Error) {
            weapon_of_logging.alert({
              message: finalMessage.message,
              function: "UPDATE_ALL SOCKET RECEIVER",
            });
          } else {
            weapon_of_logging.info({
              message: "Collection was updated successfully",
              function: "UPDATE_ALL SOCKET RECEIVER",
            });
          }
        } catch (error) {
          if (error instanceof Error) {
            weapon_of_logging.alert({
              message: error.message,
              function: "UPDATE_ALL SOCKET RECEIVER",
            });
            continue;
          }
        }
      }
    }
    setTimeout(async () => {
      if (data.collectionType === collectionTypes.INITIATIVE) {
        let initiativeList = (await dbCall.retrieveCollection(
          data.sessionId,
          collectionTypes.INITIATIVE
        )) as InitiativeObject[];
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

          let OnDeck = initiativeList[trueIndex].roundOrder + 1;

          const errorMsg = dbCall.updateSession(data.sessionId, OnDeck, undefined, initiativeList.length);

          socket.broadcast.to(data.sessionId).emit(EmitTypes.UPDATE_ALL, {
            payload: initiativeList,
            collectionType: collectionTypes.INITIATIVE,
            isSorted: true,
          });
          if (errorMsg instanceof Error) {
            weapon_of_logging.alert({
              message: errorMsg.message,
              function: "UPDATE_ALL SOCKET RECEIVER",
            });
          }
        } else {
          socket.broadcast.to(data.sessionId).emit(EmitTypes.UPDATE_ALL, {
            payload: initiativeList,
            collectionType: collectionTypes.INITIATIVE,
            isSorted: data.isSorted,
          });
        }
        weapon_of_logging.debug({
          message: "update to initiative successful",
          function: "UPDATE all socket receiver",
        });
        weapon_of_logging.debug({
          message: `isSorted is: ${data.isSorted}`,
          function: "UPDATE_ALL SOCKET RECEIVER",
        });

        return;
      }
      if (data.collectionType === collectionTypes.SPELLS) {
        const spells = await dbCall.retrieveCollection(
          data.sessionId,
          collectionTypes.SPELLS
        );
        socket.broadcast.to(data.sessionId).emit(EmitTypes.UPDATE_ALL, {
          payload: spells,
          collectionType: collectionTypes.SPELLS,
        });
      }
    }, 200);
  });
  socket.on(
    EmitTypes.ROUND_START,
    async function (data: SocketDataArray, respond: any) {
      try {
        let initiativeList = await dbCall.retrieveCollection(
          data.sessionId,
          data.collectionType
        );
        weapon_of_logging.debug({
          message: "starting round start, initiative retrieved",
          function: "ROUND_START SOCKET_RECEIVER",
        });
        if (isInitiativeObjectArray(initiativeList)) {
          let finalMessage = await initiativeFunctions.finalizeInitiative(
            initiativeList,
            true,
            data.sessionId
          );

          const startEmbed = initiativeEmbed(finalMessage);
          channelSend(
            client,
            { embeds: [startEmbed], content: "Rounds have started" },
            data.sessionId
          );

          weapon_of_logging.info({
            message: "initiative sorted and being emitted",
            function: "ROUND_START SOCKET_RECEIVER",
          });
          socket.broadcast.to(data.sessionId).emit(EmitTypes.UPDATE_ALL, {
            payload: finalMessage,
            collectionType: collectionTypes.INITIATIVE,
            isSorted: true,
          });
          respond(finalMessage);
        }
      } catch (error) {
        if (error instanceof ReferenceError) {
          weapon_of_logging.warning({
            message: error.message,
            function: "ROUND_START SOCKET_RECEIVER",
          });
          respond("No initiative to sort. Please add in initiative");
        } else if (
          error instanceof Error &&
          !(error instanceof ReferenceError)
        ) {
          weapon_of_logging.alert({
            message: error.message,
            function: "ROUND_START SOCKET_RECEIVER",
          });
        }
      }
    }
  );

  socket.on(EmitTypes.DISCORD, async function (data: SocketDataArray) {
    let sortedList: InitiativeObject[];
    try {
      if (data.collectionType === collectionTypes.INITIATIVE) {
        let newList = (await dbCall.retrieveCollection(
          data.sessionId,
          data.collectionType
        )) as InitiativeObject[];
        weapon_of_logging.info({
          message: `retrieving ${data.collectionType} for discord embed`,
          function: "DISCORD SOCKET_RECEIVER",
        });
        let [isSorted, onDeck, sessionSize] = await dbCall.getSession(
          data.sessionId
        );
        sortedList = await initiativeFunctions.finalizeInitiative(
          newList,
          false,
          data.sessionId
        );
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
          function: "DISCORD SOCKET_RECEIVER",
        });
        weapon_of_logging.debug({
          message: newList,
          function: "DISCORD SOCKET_RECEIVER",
        });
        let spellsEmbed = spellEmbed(newList);
        channelSend(client, { embeds: [spellsEmbed] }, data.sessionId);
      } else {
        weapon_of_logging.debug({
          message: "Enum not recognized",
          function: "DISCORD SOCKET_RECEIVER",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        weapon_of_logging.alert({
          message: error.message,
          function: "DISCORD SOCKET_RECEIVER",
        });
      }
    }
  });
}
