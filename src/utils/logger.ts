import logger from "pino";

export const createLog = logger({
    Level: process.env.LOG_LEVEL || 'debug',
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            ignore: "hostname,pid",
            translationTime: "SYS:standard"
        }
    }
});
