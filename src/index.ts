import { prepareMailerLiteClient } from './utils/prepareMailerLiteClient';
import { createLog } from './utils/logger';
import { getWaveHelloListener } from './listeners/waveHelloListener';
import { getWelcomeListener } from './listeners/welcomeListener';
import { getDiscordManager } from './managers/discordManager';
import { getListenerManager } from './managers/listenersManager';
import { getTriggerManager } from './managers/triggerManager';
import { getPayReminderMsgTrigger } from './triggers/payReminderMsgTrigger';
import { getMailingManager } from './managers/mailingManager';
import { getPayReminderMailTrigger } from './triggers/payReminderMailTrigger';
import { prepareDiscordClient } from './utils/prepareDiscordClient';

require('dotenv').config();

try {
  createLog.info("Bot is starting...");
  const listenerManager = getListenerManager();
  listenerManager.registerListener(getWelcomeListener());
  listenerManager.registerListener(getWaveHelloListener());

  const discordManager = getDiscordManager(
    prepareDiscordClient(listenerManager.getAllIntents()),
    listenerManager
  );
  discordManager.login();

  const mailingManager = getMailingManager(
    prepareMailerLiteClient(process.env.MAILERLITE_API_KEY)
  );

  const triggerManagger = getTriggerManager();
  triggerManagger.registerExecutor(discordManager.getDiscordExecutor());
  triggerManagger.registerExecutor(mailingManager.getMailingExecutor());
  triggerManagger.registerTrigger(getPayReminderMsgTrigger());
  triggerManagger.registerTrigger(getPayReminderMailTrigger());
  triggerManagger.runAll();
} catch (error) {
  createLog.error(error);
} finally {
  createLog.info("Bot was stopped.");
}
