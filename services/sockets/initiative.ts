import { Socket } from "socket.io";
import { EmitTypes, collectionTypes } from "../../Interfaces/ServerCommunicationTypes";
import { InitiativeSocketDataArray, InitiativeSocketDataObject } from "./types";
import * as db from "../database-common";
import * as init from "../../services/initiative";
import { InitiativeObject, InitiativeObjectEnums, SpellObject } from "../../Interfaces/GameSessionTypes";
import { statusEmbed, spellEmbed } from "../create-embed";
import { turnOrder, resortInitiative, initiativeEmbed } from "../initiative";
import { channelSend } from "./util";

const weapon_of_logging = require("../../utilities/LoggerConfig").logger;

export default function initiativeSocket(socket: Socket, client: any, io: any) {
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
          initiative = (await db.retrieveCollection(
            sessionId,
            collectionTypes.INITIATIVE
          )) as InitiativeObject[];
          [isSorted, onDeck, sessionSize] = await db.getSession(sessionId);
    
          if (isSorted) {
            if (initiative !== undefined) {
              initiative = init.resortInitiative(initiative);
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
        EmitTypes.CREATE_NEW_INITIATIVE,
        async function (data: InitiativeSocketDataObject) {
          let finalMessage;
          weapon_of_logging.debug({
            message: data.payload,
            function: "Create new socket receiver",
          });
          finalMessage = await db.addSingle(
            data.payload,
            data.sessionId,
            collectionTypes.INITIATIVE
          );
          db.updateSession(data.sessionId, undefined, false);
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
        EmitTypes.DELETE_ONE_INITIATIVE,
        async function (data: { docId: string; sessionId: string }) {
          if (data.docId !== undefined) {
            let finalMessage = await db.deleteSingle(
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
            let [isSorted, onDeck, sessionSize] = await db.getSession(
              data.sessionId
            );
            sessionSize -= 1;
            isSorted = false;
            onDeck = 0;
            let errorMsg = await db.updateSession(
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
        EmitTypes.DELETE_ALL_INITIATIVE,
        async function (sessionId: string) {
          try {
            await db.deleteCollection(sessionId, collectionTypes.INITIATIVE);
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

      socket.on(EmitTypes.NEXT, async function (sessionId: string) {
        const [errorMsg, currentName, currentStatuses, currentId] = await turnOrder(
          sessionId,
          init.initiativeFunctionTypes.NEXT
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
          let record = await db.retrieveRecord(
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
          init.initiativeFunctionTypes.PREVIOUS
        );
        if (errorMsg instanceof Error) {
          weapon_of_logging.alert({
            message: errorMsg.message,
            function: EmitTypes.PREVIOUS,
          });
        }
        setTimeout(async () => {
          let record = await db.retrieveRecord(
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
        let initiativeList = (await db.retrieveCollection(
          sessionId,
          collectionTypes.INITIATIVE
        )) as InitiativeObject[];
        try {
          initiativeList = init.resortInitiative(initiativeList);
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
              db.updateCollectionItem(
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
        EmitTypes.UPDATE_RECORD_INITIATIVE,
        async function (data: InitiativeSocketDataObject) {
          weapon_of_logging.debug({
            message: "updating one value",
            function: EmitTypes.UPDATE_RECORD_INITIATIVE,
            docId: data.payload.id,
          });
          try {
            await db.updatecollectionRecord(
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
            await db.updateCollection(
              data.sessionId,
              collectionTypes.INITIATIVE,
              data.payload
            );
            setTimeout(async () => {
              let initiativeList = await db.retrieveCollection(
                data.sessionId,
                collectionTypes.INITIATIVE
              ) as InitiativeObject[];
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
    
                  const errorMsg = db.updateSession(
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
        EmitTypes.ROUND_START,
        async function (sessionId: string, respond: any) {
          try {
            let initiativeList = await db.retrieveCollection(
              sessionId,
              collectionTypes.INITIATIVE
            ) as InitiativeObject[];
            weapon_of_logging.debug({
              message: "starting round start, initiative retrieved",
              function: "ROUND_START SOCKET_RECEIVER",
            });
              initiativeList = await init.finalizeInitiative(
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
        EmitTypes.DISCORD_INITIATIVE,
        async function (data: {
          sessionId: string;
          collectionType: collectionTypes;
        }) {
          let sortedList: InitiativeObject[];
          try {
            if (data.collectionType === collectionTypes.INITIATIVE) {
              let newList = (await db.retrieveCollection(
                data.sessionId,
                data.collectionType
              )) as InitiativeObject[];
              weapon_of_logging.info({
                message: `retrieving ${data.collectionType} for discord embed`,
                function: EmitTypes.DISCORD,
              });
              let [isSorted, onDeck, sessionSize] = await db.getSession(
                data.sessionId
              );
              if (isSorted) {
                sortedList = resortInitiative(newList);
              } else {
                sortedList = await init.finalizeInitiative(
                  newList,
                  false,
                  data.sessionId
                );
              }
              let initEmbed = initiativeEmbed(sortedList);
    
              channelSend(client, { embeds: [initEmbed] }, data.sessionId);
            }
            if (data.collectionType === collectionTypes.SPELLS) {
              let newList = (await db.retrieveCollection(
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