import { createLog } from '../utils/logger';
import { ListenerManager } from './listenersManager';
import { Client } from "discord.js";
import { Executor } from './triggerManager';
import { DiscordClientStatus } from '../types/discordClientStatusEnum';

export interface DiscordManager {
  status: DiscordClientStatus,
  login: () => void;
  getDiscordExecutor: () => Executor;
}

export const getDiscordManager = (client: Client, listenerManager: ListenerManager): DiscordManager => {
  let status: DiscordClientStatus = DiscordClientStatus.created;
  listenerManager.runAll(client);

  client.on("ready", () => {
    status = DiscordClientStatus.ready;
    createLog.info("Discord client is ready.");
  });

  client.on("error", (err) => {
    status = DiscordClientStatus.error;
    createLog.info("Discord client has error.");
    createLog.error(err);
  });

  client.on("disconnect", () => {
    status = DiscordClientStatus.disconected;
  });

  client.on("reconnecting", () => {
    status = DiscordClientStatus.reconnecting;
    createLog.info("Discord client is reconnecting");
  });

  const login = (): void => {
    if (process.env.DISCORD_BOT_TOKEN) {
      client.login(process.env.DISCORD_BOT_TOKEN);
    } else {
      status = DiscordClientStatus.error;
      throw new Error("Not found token for discord bot.");
    }
  };

  const getDiscordExecutor = (): Executor => {
    return {
      name: "DiscordClient",
      executor: client,
      typeName: typeof client,
    };
  };

  return {
    status,
    login,
    getDiscordExecutor,
  };
};

