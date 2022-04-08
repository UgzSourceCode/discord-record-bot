import MailerLite from "mailerlite-api-v2-node";
import { MailerLiteClient } from "../types/mailerLiteApi/mailerLiteClient";

export const prepareMailerLiteClient = (mailerLiteApiKey?: string): MailerLiteClient => {
  if (!mailerLiteApiKey) {
    throw `Not found "MAILERLITE_API_KEY" in your enviroments.`;
  }

  return MailerLite(mailerLiteApiKey);
};
