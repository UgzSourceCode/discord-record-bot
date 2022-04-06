import { BitFieldResolvable, Client, IntentsString } from "discord.js";

export const prepareDiscordClient = (intents: BitFieldResolvable<IntentsString, number>): Client => {
  return new Client({ intents });
};
