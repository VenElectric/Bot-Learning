const { LEVEL } = require("triple-beam");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
import validator from "validator";
const { firestore } = require("firebase-admin");
const { db } = require("../services/firebase-setup");
const initRef = db.collection("sessions");
import { client } from "../index";
import { collectionTypes } from "../Interfaces/ENUMS";
require("dotenv").config();

enum LoggingTypes {
  EMERGENCY = "EMERGENCY",
  ALERT = "ALERT",
  CRITICAL = "CRITICAL",
  ERROR = "ERROR",
  WARN = "WARN",
  NOTICE = "NOTICE",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

function addLog(item: any, sessionId: string) {
  let isUploaded;
  let errorMsg: any;
  initRef
    .doc(sessionId)
    .collection(collectionTypes.LOGGING)
    .doc(item.id)
    .set(item)
    .then(() => {
      isUploaded = true;
      errorMsg = "";
    })
    .catch((error: any) => {
      // error handling
      
      if (errorMsg instanceof Error) {
        console.log(error);
        console.trace(error.name);
        console.trace(error.msg);
      }
      isUploaded = false;
      errorMsg = error;
    });

  return [isUploaded, errorMsg];
}

export const weapon_of_logging = {
  async [LoggingTypes.EMERGENCY](
    errorName: any,
    errorMessage: any,
    stackTrace: any,
    data: any,
    sessionId: string
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.EMERGENCY,
      [LEVEL]: LoggingTypes.EMERGENCY,
      errorName: errorName,
      errorMessage: errorMessage,
      data: data,
      stackTrace: stackTrace,
      date: firestore.Timestamp.now(),
    };

    try {
      client.channels.fetch(process.env.MY_DISCORD).then((channel: any) => {
        channel.send(
          `Error: ${errorName} \n Message: ${errorMessage} \n Data: ${data}`
        );
      });

      let [isUploaded, errorMsg] = addLog(options, sessionId);
      if (errorMsg instanceof Error) {
        console.trace(isUploaded);
        console.trace(errorMsg);
      }
    } catch (error) {
      console.error(options);
      console.error(error);
      return;
    }
  },
  async [LoggingTypes.ALERT](
    errorName: any,
    errorMessage: any,
    stackTrace: any,
    data: any,
    sessionId: string
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.ALERT,
      [LEVEL]: LoggingTypes.ALERT,
      errorName: errorName,
      errorMessage: errorMessage,
      data: data,
      stackTrace: stackTrace,
      date: firestore.Timestamp.now(),
    };
    try {
      client.channels.fetch(process.env.MY_DISCORD).then((channel: any) => {
        channel.send(
          `Error: ${errorName} \n Message: ${errorMessage} \n Data: ${data}`
        );
      });

      let [isUploaded, errorMsg] = addLog(options, sessionId);
      if (errorMsg instanceof Error) {
        console.trace(isUploaded);
        console.trace(errorMsg);
      }
    } catch (error) {
      console.error(options);
      console.error(error);
    }
  },
  async [LoggingTypes.CRITICAL](
    errorName: any,
    errorMessage: any,
    stackTrace: any,
    data: any,
    sessionId: string
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.CRITICAL,
      [LEVEL]: LoggingTypes.CRITICAL,
      errorName: errorName,
      errorMessage: errorMessage,
      stackTrace: stackTrace,
      data: data,
      date: firestore.Timestamp.now(),
    };
    try {
      client.channels.fetch(process.env.MY_DISCORD).then((channel: any) => {
        channel.send(
          `Error: ${errorName} \n Message: ${errorMessage} \n Data: ${data}`
        );
      });

      let [isUploaded, errorMsg] = addLog(options, sessionId);
      if (errorMsg instanceof Error) {
        console.trace(isUploaded);
        console.trace(errorMsg);
      }
    } catch (error) {
      console.error(options);
      console.error(error);
    }
  },
  async [LoggingTypes.ERROR](
    errorName: any,
    errorMessage: any,
    stackTrace: any,
    data: any,
    sessionId: string
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.ERROR,
      [LEVEL]: LoggingTypes.ERROR,
      errorName: errorName,
      errorMessage: errorMessage,
      stackTrace: stackTrace,
      data: data,
      date: firestore.Timestamp.now(),
    };
    try {
      let [isUploaded, errorMsg] = addLog(options, sessionId);
      if (errorMsg instanceof Error) {
        console.trace(isUploaded);
        console.trace(errorMsg);
      }
    } catch (error) {
      console.error(options);
      console.error(error);
    }
  },
  async [LoggingTypes.WARN](
    errorName: any,
    errorMessage: any,
    data: any,
    sessionId: string
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.WARN,
      [LEVEL]: LoggingTypes.WARN,
      errorName: errorName,
      errorMessage: errorMessage,
      data: data,
      date: firestore.Timestamp.now(),
    };
    try {
      let [isUploaded, errorMsg] = addLog(options, sessionId);
      if (errorMsg instanceof Error) {
        console.trace(isUploaded);
        console.trace(errorMsg);
      }
    } catch (error) {
      console.error(options);
      console.error(error);
    }
  },
  async [LoggingTypes.NOTICE](
    noticeName: any,
    noticeMessage: any,
    data: any,
    sessionId: string
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.NOTICE,
      [LEVEL]: LoggingTypes.NOTICE,
      errorName: noticeName,
      errorMessage: noticeMessage,
      data: data,
      date: firestore.Timestamp.now(),
    };
    try {
      let [isUploaded, errorMsg] = addLog(options, sessionId);
      if (errorMsg instanceof Error) {
        console.trace(isUploaded);
        console.trace(errorMsg);
      }
    } catch (error) {
      console.error(options);
      console.error(error);
    }
  },
  async [LoggingTypes.INFO](
    infoName: any,
    infoMessage: any,
    data: any,
    sessionId: string
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.INFO,
      [LEVEL]: LoggingTypes.INFO,
      infoName: infoName,
      infoMessage: infoMessage,
      data: data,
      date: firestore.Timestamp.now(),
    };
    try {
      let [isUploaded, errorMsg] = addLog(options, sessionId);
      if (errorMsg instanceof Error) {
        console.trace(isUploaded);
        console.trace(errorMsg);
      }
    } catch (error) {
      console.error(options);
      console.error(error);
    }
  },
  async [LoggingTypes.DEBUG](
    debugName: any,
    debugMessage: any,
    data: any,
    sessionId: string
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.INFO,
      [LEVEL]: LoggingTypes.INFO,
      debugName: debugName,
      debugMessage: debugMessage,
      data: data,
      date: firestore.Timestamp.now(),
      sessionId: sessionId,
    };
    try {
      console.log(options);
      fs.appendFile(
        "logs.txt",
        JSON.stringify(options) + "\n",
        function (error: any) {
          if (error) {
            return console.error(options, error);
          }
          console.log("Data written successfully!");
          // Read the newly written file and print all of its content on the console
        }
      );
    } catch (error) {
      console.error(options);
      console.error(error);
      return;
    }
  },
};
