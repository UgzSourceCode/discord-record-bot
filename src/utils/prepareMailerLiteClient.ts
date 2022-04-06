import MailerLite from "mailerlite-api-v2-node";

// TODO: add returned type
export const prepareMailerLiteClient = (mailerLiteApiKey: string) => {
  return MailerLite(mailerLiteApiKey);
};
