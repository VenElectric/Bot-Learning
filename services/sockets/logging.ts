import { Socket } from "socket.io";
import { LoggingTypes } from "../../Interfaces/LoggingTypes";

const weapon_of_logging = require("../../utilities/LoggerConfig").logger;

export default function loggingSocket(socket: Socket){
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
}