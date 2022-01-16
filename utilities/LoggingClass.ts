const { LEVEL } = require("triple-beam");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
import {LoggingTypes} from "../Interfaces/LoggingTypes";
import dayjs, { Dayjs } from "dayjs";
const { firestore } = require("firebase-admin");
const { db } = require("../services/firebase-setup");
const logRef = db.collection("logging");
import chalk from 'chalk';
import { client } from "../index";
require("dotenv").config();

async function addLog(item: any) {
  let errorMsg: any;
  console.log(chalk.greenBright(item.id))
  logRef
    .doc(item.id)
    .set(item)
    .then(() => {
      errorMsg = false;
    })
    .catch((error: any) => {
      // error handling
      errorMsg = error;
    });

  return Promise.resolve(errorMsg);
}

export const weapon_of_logging = {
  async [LoggingTypes.EMERGENCY](
    errorName: any,
    errorMessage: any,
    stackTrace: any,
    data: any,
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.EMERGENCY,
      [LEVEL]: LoggingTypes.EMERGENCY,
      errorName: errorName,
      errorMessage: errorMessage,
      data: JSON.stringify(data),
      stackTrace: stackTrace,
      date: firestore.Timestamp.now(),
    };

    try {
      client.channels.fetch(process.env.MY_DISCORD).then((channel: any) => {
        channel.send(
          `Error: ${errorName} \n Message: ${errorMessage} \n Data: ${data} \n Stack Trace: ${stackTrace}`
        );
      }).catch((error:any)=> {
        console.error(chalk.bgRedBright(`There was an error sending to the channel ${options[LEVEL]}`));
        console.error(error);
        weapon_of_logging.DEBUG(error.name,error.message,chalk.bgRedBright(`There was an error sending to the channel ${options[LEVEL]}`))
      });

      let errorMsg = await addLog(options);
      if (errorMsg instanceof Error) {
        console.log(chalk.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`))
        console.log(chalk.bgRedBright(errorMsg.message))
        weapon_of_logging.DEBUG(errorMsg.name,errorMsg.message,chalk.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`))
      }
    } catch (error) {
      if (error instanceof Error){
        console.error(chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
        console.error(error);
        weapon_of_logging.DEBUG(error.name,error.message,chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`))
      }
     
    }
  },
  async [LoggingTypes.ALERT](
    errorName: any,
    errorMessage: any,
    stackTrace: any,
    data: any,
    
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.ALERT,
      [LEVEL]: LoggingTypes.ALERT,
      errorName: errorName,
      errorMessage: errorMessage,
      data: JSON.stringify(data),
      stackTrace: stackTrace,
      date: firestore.Timestamp.now(),
    };
    try {
      client.channels.fetch(process.env.MY_DISCORD).then((channel: any) => {
        channel.send(
          `Error: ${errorName} \n Message: ${errorMessage} \n Data: ${data} \n Stack Trace: ${stackTrace}`
        );
      }).catch((error:any)=> {
        console.error(chalk.bgRedBright(`There was an error sending to the channel ${options[LEVEL]}`));
        console.error(error);
        weapon_of_logging.DEBUG(error.name,error.message,chalk.bgRedBright(`There was an error sending to the channel ${options[LEVEL]}`))
      });

      let errorMsg = await addLog(options);
      if (errorMsg instanceof Error) {
        console.log(chalk.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`))
        console.log(chalk.bgRedBright(errorMsg.message))
        weapon_of_logging.DEBUG(errorMsg.name,errorMsg.message,chalk.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`))
      }
    } catch (error) {
      if (error instanceof Error){
        console.error(chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
        console.error(error);
        weapon_of_logging.DEBUG(error.name,error.message,chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`))
      }
     
    }
  },
  async [LoggingTypes.CRITICAL](
    errorName: any,
    errorMessage: any,
    stackTrace: any,
    data: any,
    
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.CRITICAL,
      [LEVEL]: LoggingTypes.CRITICAL,
      errorName: errorName,
      errorMessage: errorMessage,
      stackTrace: stackTrace,
      data: JSON.stringify(data),
      date: firestore.Timestamp.now(),
    };
    try {
      client.channels.fetch(process.env.MY_DISCORD).then((channel: any) => {
        channel.send(
          `Error: ${errorName} \n Message: ${errorMessage} \n Data: ${data} \n Stack Trace: ${stackTrace}`
        );
      }).catch((error:any)=> {
        console.error(chalk.bgRedBright(`There was an error sending to the channel ${options[LEVEL]}`));
        console.error(error);
        weapon_of_logging.DEBUG(error.name,error.message,chalk.bgRedBright(`There was an error sending to the channel ${options[LEVEL]}`))
      });

      let errorMsg = await addLog(options);
      if (errorMsg instanceof Error) {
        console.log(chalk.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`))
        console.log(chalk.bgRedBright(errorMsg.message))
        weapon_of_logging.DEBUG(errorMsg.name,errorMsg.message,chalk.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`))
      }
    } catch (error) {
      if (error instanceof Error){
        console.error(chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
        console.error(error);
        weapon_of_logging.DEBUG(error.name,error.message,chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`))
      }
     
    }
  },
  async [LoggingTypes.ERROR](
    errorName: any,
    errorMessage: any,
    stackTrace: any,
    data: any,
    
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.ERROR,
      [LEVEL]: LoggingTypes.ERROR,
      errorName: errorName,
      errorMessage: errorMessage,
      stackTrace: stackTrace,
      data: JSON.stringify(data),
      date: firestore.Timestamp.now(),
    };
    try {
      let errorMsg = await addLog(options);
      if (errorMsg instanceof Error) {
        console.log(chalk.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`))
        console.log(chalk.bgRedBright(errorMsg.message))
        weapon_of_logging.DEBUG(errorMsg.name,errorMsg.message,chalk.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`))
      }
    } catch (error) {
      if (error instanceof Error){
        console.error(chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
        console.error(error);
        weapon_of_logging.DEBUG(error.name,error.message,chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`))
      }
     
    }
  },
  async [LoggingTypes.WARN](
    errorName: any,
    errorMessage: any,
    data: any,
    
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.WARN,
      [LEVEL]: LoggingTypes.WARN,
      errorName: errorName,
      errorMessage: errorMessage,
      data: JSON.stringify(data),
      date: firestore.Timestamp.now(),
    };
    try {
      let errorMsg = await addLog(options);
      if (errorMsg instanceof Error) {
        console.log(chalk.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`))
        console.log(chalk.bgRedBright(errorMsg.message))
        weapon_of_logging.DEBUG(errorMsg.name,errorMsg.message,chalk.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`))
      }
    } catch (error) {
      if (error instanceof Error){
        console.error(chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
        console.error(error);
        weapon_of_logging.DEBUG(error.name,error.message,chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`))
      }
    }
  },
  async [LoggingTypes.NOTICE](
    noticeName: any,
    noticeMessage: any,
    data: any,
    
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.NOTICE,
      [LEVEL]: LoggingTypes.NOTICE,
      errorName: noticeName,
      errorMessage: noticeMessage,
      data: JSON.stringify(data),
      date: firestore.Timestamp.now(),
    };
    try {
      let errorMsg = await addLog(options);
      if (errorMsg instanceof Error) {
        console.log(chalk.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`))
        console.log(chalk.bgRedBright(errorMsg.message))
        weapon_of_logging.DEBUG(errorMsg.name,errorMsg.message,chalk.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`))
      }
    } catch (error) {
      if (error instanceof Error){
        console.error(chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
        console.error(error);
        weapon_of_logging.DEBUG(error.name,error.message,chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`))
      }
     
    }
  },
  async [LoggingTypes.INFO](
    infoName: any,
    infoMessage: any,
    data: any,
    
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.INFO,
      [LEVEL]: LoggingTypes.INFO,
      infoName: infoName,
      infoMessage: infoMessage,
      data: JSON.stringify(data),
      date: firestore.Timestamp.now(),
    };
    try {
      let errorMsg = await addLog(options);
      if (errorMsg instanceof Error) {
        console.log(chalk.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`))
        console.log(chalk.bgRedBright(errorMsg.message))
        weapon_of_logging.DEBUG(errorMsg.name,errorMsg.message,chalk.bgRedBright("There was an error logging to the database"))
      }
    } catch (error) {
      if (error instanceof Error){
        console.error(chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
        console.error(error);
        weapon_of_logging.DEBUG(error.name,error.message,chalk.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`))
      }
     
    }
  },
  async [LoggingTypes.DEBUG](
    debugName: any,
    debugMessage: any,
    data: any,
    
  ) {
    let options = {
      id: uuidv4(),
      level: LoggingTypes.DEBUG,
      [LEVEL]: LoggingTypes.DEBUG,
      debugName: debugName,
      debugMessage: debugMessage,
      adata: JSON.stringify(data),
      date: dayjs()
    };
    try {
      
      fs.appendFile(
        "logs.txt",
        JSON.stringify(options) + "\n",
        function (error: any) {
          if (error) {
            console.error(options, error);
            return error
          }
         
          // Read the newly written file and print all of its content on the console
        }
      );
    } catch (error) {
      console.error(chalk.bgRedBright(`There was an error writing to the file. Level ${options[LEVEL]}`));
        console.error(error);
    }
  },
};
