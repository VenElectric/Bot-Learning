import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { Socket } from "socket.io";
import { RollObject } from "../../Interfaces/GameSessionTypes";
import {
  EmitTypes,
  topLevelCollections,
  secondLevelCollections,
} from "../../Interfaces/ServerCommunicationTypes";
import { addBash } from "../parse";
import * as db from "../database-common";
import { channelSend } from "./util";

const weapon_of_logging = require("../../utilities/LoggerConfig").logger;

export default function rollSocket(socket: Socket, client: any, io: any) {
  socket.on(
    EmitTypes.GET_INITIAL_ROLLS,
    async function (sessionId: string, respond: any) {
      weapon_of_logging.debug({
        message: "retrieving initial roll data",
        function: EmitTypes.GET_INITIAL_ROLLS,
      });
      const rolls = await db.retrieveCollection(
        sessionId,
        secondLevelCollections.ROLLS
      );
      respond(rolls);
    }
  );
  socket.on(
    EmitTypes.CREATE_NEW_ROLL,
    async function (data: { rollData: RollObject; sessionId: string }) {
      weapon_of_logging.debug({
        message: `adding roll ${data.rollData.id}`,
        function: EmitTypes.CREATE_NEW_ROLL,
      });
      await db.addSingle(data.rollData, data.sessionId, topLevelCollections.SESSIONS, secondLevelCollections.ROLLS);

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
      await db.updatecollectionRecord(
        data.rollData,
        secondLevelCollections.ROLLS,
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
      await db.deleteSingle(data.docId, data.sessionId, secondLevelCollections.ROLLS);
      socket.broadcast
        .to(data.sessionId)
        .emit(EmitTypes.DELETE_ONE_ROLL, data.docId);
    }
  );
  socket.on(
    EmitTypes.DISCORD_ROLL,
    function (data: { payload: DiceRoll; comment: string; sessionId: string }) {
      const finalRoll = addBash(data.payload.output, "green");
      const finalComment = addBash(data.comment, "blue");

      channelSend(
        client,
        { content: `Roll Results: ${finalRoll} ${finalComment}` },
        data.sessionId
      );
    }
  );
}
