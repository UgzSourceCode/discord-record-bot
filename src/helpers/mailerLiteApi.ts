import { MailerLiteClient } from './../types/mailerLiteApi/mailerLiteClient';
import { CampaignContent, CampaignData } from "mailerlite-api-v2-node/dist/@types";
import { CreateCampaignResponse } from "../types/mailerLiteApi/createCampaignResponse";
import { SetCampaignContentResponse } from '../types/mailerLiteApi/setCampaignContentResponse';
import { MailerLiteGroup } from 'mailerlite-api-v2-node/dist/api/groups';

export const createCampaign = (mailerLiteClient: MailerLiteClient, data: CampaignData): Promise<CreateCampaignResponse> => {
  return new Promise<CreateCampaignResponse>((resolve, reject) => {
    mailerLiteClient.createCampaign(data)
      .then(response => resolve(response as unknown as CreateCampaignResponse))
      .catch(err => reject(err));
  });
};

export const setCampaignContent = (mailerLiteClient: MailerLiteClient, campaignId: number, content: CampaignContent): Promise<SetCampaignContentResponse> => {
  return new Promise<SetCampaignContentResponse>((resolve, reject) => {
    mailerLiteClient.setCampaignContent(campaignId, content)
      .then(response => resolve(response as unknown as SetCampaignContentResponse))
      .catch(err => reject(err));
  });
};

export const prepareGroupsIds = (groups: MailerLiteGroup[]): number[] => {
  return groups.map(group => group.id);
};