import { BitFieldResolvable, IntentsString, Client, ClientEvents } from 'discord.js';

export interface Listener {
  name: string;
  event: EventsStrings;
  privilages: IntentsString[];
  run: (client: Client) => void;
}

export type EventsStrings = keyof ClientEvents;

export interface ListenerManager {
  registerListener: (listener: Listener) => void;
  runAll: (client: Client) => void;
  getAllIntents: () => BitFieldResolvable<IntentsString, number>;
}

export const getListenerManager = (): ListenerManager => {
  const listeners: Map<string, Listener> = new Map<string, Listener>();
  const registerListener = (listener: Listener): void => {
    listeners.set(listener.name, listener);
  };

  const getAllIntents = (): BitFieldResolvable<IntentsString, number> => {
    const result: string[] = [];
    listeners.forEach(listener => {
      listener.privilages.forEach(privilage => {
        if (!result.find(p => p === privilage)) {
          result.push(privilage);
        }
      });
    });

    return (result as BitFieldResolvable<IntentsString, number>);
  };

  const runAll = (client: Client): void => {
    listeners.forEach(listener => listener.run(client));
  };

  return {
    registerListener,
    runAll,
    getAllIntents
  };
};
