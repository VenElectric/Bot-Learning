import { Socket } from "socket.io";
import {
  EmitTypes,
  secondLevelCollections,
  topLevelCollections,
} from "../../Interfaces/ServerCommunicationTypes";
import {
  SpellSocketDataArray,
  SpellSocketDataObject,
} from "./types";
import * as db from "../database-common";
import {
  SpellObjectEnums,
  SpellObject,
} from "../../Interfaces/GameSessionTypes";
import { spellEmbed } from "../create-embed";
import { channelSend } from "./util";

const weapon_of_logging = require("../../utilities/LoggerConfig").logger;

export default function spellSocket(socket: Socket, client: any, io: any) {
  socket.on(
    EmitTypes.GET_SPELLS,
    async function (sessionId: string, respond: any) {
      let spells;
      weapon_of_logging.debug({
        message: "retrieving initial spell data",
        function: EmitTypes.GET_SPELLS,
      });
      spells = await db.retrieveCollection(
        sessionId,
        secondLevelCollections.SPELLS
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
  socket.on(
    EmitTypes.CREATE_NEW_SPELL,
    async function (data: SpellSocketDataObject) {
      let finalMessage;
      const spellRecord = { ...data.payload };

      finalMessage = await db.addSingle(
        spellRecord,
        data.sessionId,
        topLevelCollections.SESSIONS,
        secondLevelCollections.SPELLS
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
    EmitTypes.DELETE_ONE_SPELL,
    async function (data: { docId: string; sessionId: string }) {
      if (data.docId !== undefined) {
        let finalMessage = await db.deleteSingle(
          data.docId,
          data.sessionId,
          secondLevelCollections.SPELLS
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

  socket.on(EmitTypes.DELETE_ALL_SPELL, async function (sessionId: string) {
    try {
      await db.deleteCollection(sessionId, secondLevelCollections.SPELLS);
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
    EmitTypes.UPDATE_ITEM_SPELL,
    async function (data: {
      toUpdate: any;
      docId: string;
      collectionType: secondLevelCollections;
      sessionId: string;
      ObjectType: SpellObjectEnums;
    }) {
      weapon_of_logging.debug({
        message: "updating one value",
        function: "UPDATE ONE SOCKET RECEIVER",
      });
      if (data.docId) {
        try {
          db.updateCollectionItem(
            data.toUpdate,
            secondLevelCollections.SPELLS,
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
        await db.updatecollectionRecord(
          spellRecord,
          secondLevelCollections.SPELLS,
          data.payload.id,
          data.sessionId
        );
        weapon_of_logging.debug({
          message: secondLevelCollections.SPELLS,
          function: EmitTypes.UPDATE_RECORD_SPELL,
          docId: data.payload.id,
        });
        console.log(data.sessionId);
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
    EmitTypes.UPDATE_ALL_SPELL,
    async function (data: SpellSocketDataArray) {
      try {
        let spellRecord = [...data.payload];
        await db.updateCollection(
          data.sessionId,
          secondLevelCollections.SPELLS,
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
    EmitTypes.DISCORD_SPELL,
    async function (data: {
      sessionId: string;
      collectionType: secondLevelCollections;
    }) {
      try {
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
