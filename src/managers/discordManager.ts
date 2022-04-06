import { createLog } from './../helpers/logger';
import { ListenerManager } from './listenersManager';
import { Client } from "discord.js";
import { Executor } from './triggerManager';

export enum DiscordClientStatus {
  created = 0,
  ready,
  disconected,
  reconnecting,
  error,
}

export interface DiscordManager {
  status: DiscordClientStatus,
  login: () => void;
  getDiscordExecutor: () => Executor;
}

export const getDiscordManager = (client: Client, listenerManager: ListenerManager): DiscordManager => {
  // const intents: BitFieldResolvable<IntentsString, number> = listenerManager.getAllIntents();

  let status: DiscordClientStatus = DiscordClientStatus.created;
  // const client = new Client({ intents });
  listenerManager.runAll(client);

  client.on("ready", () => {
    status = DiscordClientStatus.ready;
    createLog.info("Discord client is ready.");
  });

  client.on("error", () => {
    status = DiscordClientStatus.error;
    createLog.info("Discord client has error.");
    // TODO: Print error content
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

