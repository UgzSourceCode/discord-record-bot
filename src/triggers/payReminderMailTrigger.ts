import { Executor, Trigger } from "../managers/triggerManager";
import schedule from "node-schedule";
import { MailerLiteExecutor } from "../managers/mailingManager";

export const getPayReminderMailTrigger = (): Trigger => {
  const name = "PayReminderMail";
  const executorName = "MailingExecutor";
  const nextDate = process.env.PAY_REMINDER_SCHEDULE || "00 10 5 * *";
  let mailerExecutor: MailerLiteExecutor;

  const method = () => {
    if (!mailerExecutor) {
      throw new Error(`Not found mMilerExecutor in "${name}"`);
    }
    if (!process.env.MAILERLITE_MG_REMINDER_GROUP_NAME) {
      throw new Error(`Not found value for "MAILERLITE_MG_REMINDER_GROUP_NAME" enviroment.`);
    }

    mailerExecutor.sendPayReminderMail(process.env.MAILERLITE_MG_REMINDER_GROUP_NAME);
  };

  const run = (executor: Executor) => {
    if (executor.name !== executorName) {
      throw new Error(`Trigger "${name}" can't be run by "${executor.name}" executor.`);
    }
    mailerExecutor = executor.executor as MailerLiteExecutor;
    schedule.scheduleJob(nextDate, () => {
      method();
    });
  };

  return {
    name,
    executorName,
    nextDate,
    run,
  };
};
