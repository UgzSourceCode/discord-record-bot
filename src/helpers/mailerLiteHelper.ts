import { CampaignData } from "mailerlite-api-v2-node/dist/@types";

interface CreateCampaignResponse {
  campaignType?: string;
  date?: string;
  accountId?: number;
  campaignName?: string;
  id?: number;
  mailId?: number;
  options?: unknown;
}

export interface mailerLiteHelper {
  createCampaign: (data: CampaignData) => Promise<CreateCampaignResponse>;
};

export const getMailerLiteHelper = (mailerLiteClient): mailerLiteHelper => {

  const createCampaign = (data: CampaignData): Promise<CreateCampaignResponse> => {
    return new Promise<CreateCampaignResponse>((resolve, reject) => {
      mailerLiteClient.createCampaign(data)
        .then(response => resolve(response as unknown as CreateCampaignResponse))
        .catch(err => reject(err));
    });
  };

  return {
    createCampaign,
  };
};

