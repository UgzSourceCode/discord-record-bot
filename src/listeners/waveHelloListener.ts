import { Client, IntentsString, Message, MessageEmbed } from 'discord.js';
import { getRandomFromMap } from '../utils/getRandomFromMap';
import { Listener } from './../managers/listenersManager';

export const helloGifsMap: Map<string, string> = new Map<string, string>([
    ["yoda", "https://c.tenor.com/-z2KfO5zAckAAAAC/hello-there-baby-yoda.gif"],
    ["pinguin", "https://c.tenor.com/pvFJwncehzIAAAAC/hello-there-private-from-penguins-of-madagascar.gif"],
    ["forrestGump", "https://c.tenor.com/Dhrbmr_t3tEAAAAd/forrest-gump-hello.gif"],
]);

export const getWaveHelloListener = (): Listener => {
    const name = "WaveHelloListener";
    const event = "messageCreate";
    const privilages: IntentsString[] = ["GUILDS", "GUILD_MESSAGES"];

    const method = (msg: Message) => {
        if (msg.type === "GUILD_MEMBER_JOIN") {
            const gifUrl = getRandomFromMap(helloGifsMap);
            if (gifUrl) {
                const image = new MessageEmbed();
                image.setImage(gifUrl);
                msg.reply({embeds: [image]});
            }
        }
    };

    const run = (client: Client) => {
        client.on(event, method);
    };
    
    return {
        name,
        event,
        privilages,
        run
    }
};
