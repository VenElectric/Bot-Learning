const weapon_of_logging = require("../../utilities/LoggerConfig").logger;

export function channelSend(
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