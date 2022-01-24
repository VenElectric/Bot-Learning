import { Socket } from "socket.io";
const weapon_of_logging = require("../utilities/LoggerConfig").logger
import {
  SessionData,
  InitiativeObject,
  SpellObject,
} from "../Interfaces/GameSessionTypes";
import {
  collectionTypes,
  EmitTypes,
} from "../Interfaces/ServerCommunicationTypes";
import {
  isInitiativeObject,
  isSpellObject,
  isInitiativeObjectArray,
  isSpellObjectArray,
} from "../utilities/TypeChecking";
import { LoggingTypes } from "../Interfaces/LoggingTypes";
import * as dbCall from "./database-common";
import * as initiativeFunctions from "../services/initiative";
import { initiativeEmbed, spellEmbed } from "./create-embed";
import chalk from "chalk";

export interface SocketData {
  payload:
    | InitiativeObject
    | InitiativeObject[]
    | SpellObject
    | SpellObject[]
    | SessionData
    | string;
  sessionId: string;
  collectionType: collectionTypes;
}

// {sessionId: sessionId, payload: payload, collectionType: collectionType}

// add in client  client.channels.fetch(sessionId).then((channel: any) => {
//   channel.send(
//    data.....
// channel.execute?
//   );
// });
export function socketReceiver(socket: Socket, client: any) {
  socket.on(LoggingTypes.DEBUG, async function (data: any) {
    weapon_of_logging.debug(
     {message: data.message, function: data.function}
    );

  });
  // LOGGING SOCKETS
  socket.on(LoggingTypes.INFO, async function (data: any) {
   weapon_of_logging.info(
    {message: data.message, function: data.function}
    );

  });

  
  socket.on(LoggingTypes.ERROR, async function (data: any) {
   weapon_of_logging.alert(
    {message: data.message, function: data.function}
    );
 
  });
 
  socket.on(LoggingTypes.WARN, async function (data: any) {
    
   weapon_of_logging.alert(
    {message: data.message, function: data.function}
    );
   
  });

  // DATABASE/INITIATIVE/SPELL SOCKETS

  socket.on(
    EmitTypes.REMOVE_STATUS_EFFECT,
    async function (data: SocketData, respond: any) {}
  );

  socket.on(
    EmitTypes.ADD_STATUS_EFFECT,
    async function (data: SocketData, respond: any) {}
  );

  socket.on(
    EmitTypes.CREATE_NEW,
    async function (data: SocketData, respond: any) {
      let finalMessage;

      if (isInitiativeObject(data.payload)) {
        finalMessage = await dbCall.addSingle(
          data.payload,
          data.sessionId,
          collectionTypes.INITIATIVE
        );
        socket.broadcast
          .to(data.sessionId)
          .emit(EmitTypes.UPDATE_ONE, data.payload);
        respond(finalMessage);
      }
      if (isSpellObject(data.payload)) {
        finalMessage = await dbCall.addSingle(
          data.payload,
          data.sessionId,
          collectionTypes.SPELLS
        );
        socket.broadcast
          .to(data.sessionId)
          .emit(EmitTypes.CREATE_NEW, data.payload);
        respond(finalMessage);
      } else {
        finalMessage = `Invalid Collection Type. Type Sent: ${data.collectionType}`;
        respond(finalMessage);
      }
      if (finalMessage instanceof Error) {
       weapon_of_logging.alert(
          {message: finalMessage.message, function: "create_new SocketReceiver"}
        );
      }
    }
  );
  socket.on(
    EmitTypes.DELETE_ONE,
    async function (data: SocketData, respond: any) {
      let finalMessage = await dbCall.deleteSingle(
        data.payload as string,
        data.sessionId,
        data.collectionType
      );
      if (finalMessage instanceof Error) {
        weapon_of_logging.alert(
          {message: finalMessage.message, function: "DELETE_ONE SocketReceiver"}
        );
      }
      let newList = await dbCall.retrieveCollection(
        data.sessionId,
        data.collectionType
      );
      socket.broadcast.to(data.sessionId).emit(EmitTypes.UPDATE_ALL, newList);
      respond(finalMessage);
    }
  );
  socket.on(EmitTypes.DELETE_ALL, async function (data: any, respond: any) {
    console.log(data);
  });

  socket.on(
    EmitTypes.GET_INITIAL,
    async function (data: SocketData, respond: any) {
      let sessionId = data.sessionId;
      let initiative;
      let isSorted;
      let onDeck;
      let sessionSize;
      weapon_of_logging.debug( {message: "retrieving initial data", function: "GET_INITIAL SOCKET RECEIVER"});
      if (data.sessionId !== undefined) {
         initiative = await dbCall.retrieveCollection(
          data.sessionId,
          data.collectionType
        );
        [isSorted, onDeck, sessionSize] = await dbCall.getSession(
          data.sessionId
        );
      }
      
      if (initiative instanceof Error) {
        weapon_of_logging.alert(
          {message: initiative.message, function: "GET_INITIAL SOCKET RECEIVER"}
        );
      
      }
     
      weapon_of_logging.debug(
        {message: "succesfully retrieved initiative", function: "GET_INITIAL SOCKET RECEIVER"}
      );

      respond({ initiativeList: initiative, isSorted: isSorted });
    }
  );
  socket.on(EmitTypes.NEXT, async function (data: SocketData, respond: any) {
    let finalMessage = await initiativeFunctions.turnOrder(
      data.sessionId,
      initiativeFunctions.initiativeFunctionTypes.NEXT
    );
    if (finalMessage instanceof Error) {
      weapon_of_logging.alert(
        finalMessage.name,
        finalMessage.message,
        finalMessage.stack,
        data.payload,

      );
    }
   weapon_of_logging.info(
    {message: "succesfully retrieved next", function: "NEXT SOCKET RECEIVER"}

    );
    let initiativeList = await dbCall.retrieveCollection(
      data.sessionId,
      collectionTypes.INITIATIVE
    );
    socket.broadcast
      .to(data.sessionId)
      .emit(EmitTypes.UPDATE_ALL, initiativeList);
    if (finalMessage instanceof Error) {
     weapon_of_logging.alert(
      {message:finalMessage.message, function: "NEXT SOCKET RECEIVER"}

      );
    }
    respond(finalMessage);
  });
  socket.on(
    EmitTypes.PREVIOUS,
    async function (data: SocketData, respond: any) {
      let finalMessage = await initiativeFunctions.turnOrder(
        data.sessionId,
        initiativeFunctions.initiativeFunctionTypes.PREVIOUS
      );
      if (finalMessage instanceof Error) {
        weapon_of_logging.alert(
          {message:finalMessage.message, function: "PREVIOUS SOCKET RECEIVER"}
        );
      }
      let initiativeList = await dbCall.retrieveCollection(
        data.sessionId,
        collectionTypes.INITIATIVE
      );
      socket.broadcast
        .to(data.sessionId)
        .emit(EmitTypes.UPDATE_ALL, initiativeList);
      if (finalMessage instanceof Error) {
        weapon_of_logging.alert(
          {message:finalMessage.message, function: "PREVIOUS SOCKET RECEIVER"}
        );
      } else {
        weapon_of_logging.info(
          {message: "succesfully retrieved previous", function: "NEXT SOCKET RECEIVER"}
        );
      }
      respond(finalMessage);
    }
  );
  socket.on(EmitTypes.RESORT, async function (data: SocketData, respond: any) {
    let initiativeList = await dbCall.retrieveCollection(
      data.sessionId,
      collectionTypes.INITIATIVE
    );
    if (isInitiativeObjectArray(initiativeList)) {
      let finalMessage = initiativeFunctions.resortInitiative(initiativeList);
      socket.broadcast
        .to(data.sessionId)
        .emit(EmitTypes.UPDATE_ALL, finalMessage);
      if (finalMessage instanceof Error) {
        weapon_of_logging.alert(
          {message:finalMessage.message, function: "RESORT SOCKET RECEIVER"}
        );
      }
      respond(finalMessage);
    }
  });
  socket.on(EmitTypes.RE_ROLL, async function (data: SocketData, respond: any) {
    let initiativeList = data.payload as InitiativeObject
    let docId = data.sessionId;
      let finalMessage = await dbCall.updatecollectionRecord(
        initiativeList,
        data.collectionType,
        docId,
        data.sessionId
      );
      let newList = await dbCall.retrieveCollection(
        data.sessionId,
        data.collectionType
      );
      socket.broadcast.to(data.sessionId).emit(EmitTypes.UPDATE_ALL, newList);
      if (finalMessage instanceof Error) {
        weapon_of_logging.alert(
          {message:finalMessage.message, function: "REROLL SOCKET RECEIVER"}
        );
      }
      respond(finalMessage);
  });
  socket.on(
    EmitTypes.UPDATE_ONE,
    async function (data: any, respond: any) {
      weapon_of_logging.debug(  {message:"updating one value", function: "UPDATE ONE SOCKET RECEIVER"})
      try {
        dbCall.updateCollectionItem(data.toUpdate,data.CollectionType,data.id,data.sessionId,data.ObjectType)
      }
      catch(error){
        if (error instanceof Error) {
          weapon_of_logging.alert(
            {message:error.message, function: "UPDATE_ONE SOCKET RECEIVER"}
          );
      }
       let finalMessage = await dbCall.retrieveCollection(data.sessionId,data.CollectionType);



        if (finalMessage instanceof Error) {
          weapon_of_logging.alert(
            {message:finalMessage.message, function: "UPDATE_ONE SOCKET RECEIVER"}
          );
        }
        let newList = await dbCall.retrieveCollection(
          data.sessionId,
          data.CollectionType
        );
        socket.broadcast.to(data.sessionId).emit(EmitTypes.UPDATE_ONE, newList);
        respond(finalMessage);
        }
      }
  );

  socket.on(EmitTypes.UPDATE_ALL, async function (data: any, respond: any) {
    let failures = [];
    let successes = [];
    if (
      data.collectionType != collectionTypes.INITIATIVE ||
      collectionTypes.SPELLS
    ) {
      respond(`Invalid Collection Type. Type Sent: ${data.collectionType}`);
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
            weapon_of_logging.alert(
              {message:finalMessage.message, function: "UPDATE_ALL SOCKET RECEIVER"}
            );
            failures.push(record.id);
          } else {
            weapon_of_logging.info(
              {message:"Collection was updated successfully", function: "UPDATE_ALL SOCKET RECEIVER"}
            );
            successes.push(record.id);
          }
        } catch (error) {
          if (error instanceof Error) {
            weapon_of_logging.alert(
              {message:error.message, function: "UPDATE_ALL SOCKET RECEIVER"}
            );
            continue;
          }
        }
      }
      respond({ successes: successes, failures: failures });
    }
  });
  socket.on(
    EmitTypes.ROUND_START,
    async function (data: SocketData, respond: any) {
      if (data.collectionType != collectionTypes.INITIATIVE) {
        respond(`Invalid Collection Type. Type Sent: ${data.collectionType}`);
      }

      try {
        let initiativeList = await dbCall.retrieveCollection(
          data.sessionId,
          data.collectionType
        );
        weapon_of_logging.debug(
          {message: "starting round start, initiative retrieved", function: "ROUND_START SOCKET_RECEIVER"}
        );
        if (isInitiativeObjectArray(initiativeList)) {
          let [isSorted, onDeck, sessionSize] = await dbCall.getSession(
            data.sessionId
          );
          let finalMessage = await initiativeFunctions.finalizeInitiative(
            initiativeList,
            true,
            data.sessionId,
            onDeck,
            isSorted
          );
         
          weapon_of_logging.info(
            {message: "initiative sorted and being emitted", function: "ROUND_START SOCKET_RECEIVER"}
          );
          socket.broadcast
            .to(data.sessionId)
            .emit(EmitTypes.UPDATE_ALL, finalMessage);
          respond(finalMessage);
        }
      } catch (error) {
        if (error instanceof ReferenceError) {
          weapon_of_logging.warning(
            {message: error.message, function: "ROUND_START SOCKET_RECEIVER"}
          );
          respond("No initiative to sort. Please add in initiative");
        } else if (
          error instanceof Error &&
          !(error instanceof ReferenceError)
        ) {
          weapon_of_logging.alert(
            {message: error.message, function: "ROUND_START SOCKET_RECEIVER"}
          );
        }
      }
    }
  );

  socket.on(EmitTypes.DISCORD, async function (data: SocketData, respond: any) {
    let sortedList: InitiativeObject[];
    try {
      if (data.collectionType === collectionTypes.INITIATIVE) {
        let newList = (await dbCall.retrieveCollection(
          data.sessionId,
          data.collectionType
        )) as InitiativeObject[];
        weapon_of_logging.info(
          {message: `retrieving ${data.collectionType} for discord embed`, function: "DISCORD SOCKET_RECEIVER"}
        );
        let [isSorted, onDeck, sessionSize] = await dbCall.getSession(
          data.sessionId
        );
        sortedList = await initiativeFunctions.finalizeInitiative(
          newList,
          isSorted,
          data.sessionId,
          onDeck,
          isSorted
        );
        let initEmbed = initiativeEmbed(sortedList);
        client.channels.fetch(data.sessionId).then((channel: any) => {
          channel.send({ embeds: [initEmbed] });
          weapon_of_logging.info(
            {message: "sending initiative to discord channel success", function: "DISCORD SOCKET_RECEIVER"}
          );
          respond(200);
        });
      }
      if (data.collectionType === collectionTypes.SPELLS) {
        let newList = (await dbCall.retrieveCollection(
          data.sessionId,
          data.collectionType
        )) as SpellObject[];
        weapon_of_logging.info(
          {message:`retrieving ${data.collectionType} for discord embed`, function: "DISCORD SOCKET_RECEIVER"}
        );
        let spellsEmbed = spellEmbed(newList);
        client.channels.fetch(data.sessionId).then((channel: any) => {
          channel.send({ embeds: [spellsEmbed] });
          weapon_of_logging.info(
            {message: "sending spells to discord channel success", function: "DISCORD SOCKET_RECEIVER"}
          );
          respond(200);
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        weapon_of_logging.alert(
         {message: error.message, function: "DISCORD SOCKET_RECEIVER"}
        );
        respond(error);
      }
    }
  });

  //just in case I need it....
  // socket.on("GET_INITIAL_INIT", async (sessionId: any, respond: any) => {
  //   console.log("GET_INITIAL_INIT");
  //   let initiativeList = await retrieveCollection(
  //     sessionId,
  //     initiativeCollection
  //   );
  //   let [isSorted, onDeck, sessionSize] = await getSession(sessionId);
  //   console.log(isSorted, onDeck, sessionSize);
  //   respond({
  //     initiativeList: initiativeList,
  //     spellList: [],
  //     isSorted: isSorted,
  //     onDeck: onDeck,
  //     sessionId,
  //   });
  // });

  // socket.on("GET_INITIAL_SPELLS", async (sessionId: any, respond: any) => {
  //   let spellList = await retrieveCollection(sessionId, spellCollection);
  //   console.log("get initial spells");
  //   respond(spellList);
  // });

  // socket.on(EmitTypes.CREATE_NEW, async (dataList: any, respond: any) => {
  //   console.log(dataList);
  //   let response;
  //   try {
  //     await addSingle(
  //       dataList.payload,
  //       dataList.sessionId,
  //       dataList.collectionType
  //     );
  //     console.log("success");
  //     response = 200;
  //   } catch (error) {
  //     console.log(error);
  //     response = error;
  //   }

  //   respond(response);
  // });

  // socket.on(EmitTypes.ROUND_START, async (sessionId: any, respond: any) => {
  //   let initiativeList = await retrieveCollection(
  //     sessionId,
  //     initiativeCollection
  //   );
  //   let [isSorted, onDeck, sessionSize] = await getSession(sessionId);
  //   let sortedList = await finalizeInitiative(
  //     initiativeList as InitiativeObject[],
  //     true,
  //     sessionId,
  //     onDeck,
  //     isSorted
  //   );
  //   socket.broadcast.to(sessionId).emit(EmitTypes.ROUND_START, {
  //     initiativeList: sortedList,
  //     isSorted: isSorted,
  //     sessionSize: sessionSize,
  //     onDeck: onDeck,
  //   });
  //   respond({
  //     initiativeList: sortedList,
  //     isSorted: isSorted,
  //     sessionSize: sessionSize,
  //     onDeck: onDeck,
  //   });
  // });
}
