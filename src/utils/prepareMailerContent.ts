import { CampaignContent } from "mailerlite-api-v2-node/dist/@types";
import { ContentParam } from "../types/contentParam";
import { loadFile } from "./loadFile";
import { replaceParams } from "./replaceParams";

export const prepareMailerContent = async (htmlFilePath: string, plainTextPath: string, params: ContentParam[]): Promise<CampaignContent> => {
  return {
    html: replaceParams(await loadFile(htmlFilePath), params),
    plain: replaceParams(await loadFile(plainTextPath), params)
  };
};
