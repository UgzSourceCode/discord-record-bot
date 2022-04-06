import { replaceParams } from './../helpers/replaceParams';
import { Account, AccountWrap, Batch, CampaignAction, CampaignContent, CampaignData, CampaignQuery, CampaignSendData, CampaignStatus, FieldData, FieldUpdate, GroupData, GroupQuery, GroupSearchQuery } from './../../node_modules/mailerlite-api-v2-node/dist/@types/index.d';
import { createLog } from './../helpers/logger';
import MailerLite from "mailerlite-api-v2-node";
import { MailerLiteGroup } from "mailerlite-api-v2-node/dist/api/groups";
import { AssetPathMap } from '../consts/assetPathMap';
import { loadFile, loadFileAsType } from '../helpers/loadFile';
import { ContentParam } from '../helpers/replaceParams';
import { preparePayReminderParams } from '../helpers/payReminderHelpers';
import { Executor } from './triggerManager';

export interface MailingManager {
  sendPayReminderMail: (groupName: string) => void;
  findGroup: (groupName: string) => Promise<MailerLiteGroup>;
  getMailingExecutor: () => Executor;
}

interface CreateCampaignResponse {
  campaignType?: string;
  date?: string;
  accountId?: number;
  campaignName?: string;
  id?: number;
  mailId?: number;
  options?: unknown;
}

interface SetCampaignContentResponse {
  success: boolean;
}

export interface MailerLiteClient {
  // ...account
  getAccountRaw: () => Promise<AccountWrap>;
  getAccount: () => Promise<Account>;
  getMe: () => Promise<Account>;
  // ...batch
  batch: (request: Batch[]) => Promise<any[]>;
  // ...campaigns
  actOnCampaign: (
    campaignId: number,
    action: CampaignAction,
    data: CampaignSendData,
  ) => Promise<unknown>;
  getCampaigns: (
    status: CampaignStatus,
    params: CampaignQuery
  ) => Promise<unknown>;
  getCampaignCount: (
    status: CampaignStatus
  ) => Promise<number>;
  createCampaign: (
    campaign: CampaignData
  ) => Promise<unknown>;
  removeCampaign: (
    campaignId: number
  ) => Promise<unknown>;
  setCampaignContent: (
    campaignId: number,
    content: CampaignContent
  ) => Promise<unknown>;
  // ...fields
  getFields: () => Promise<unknown>;
  createField: (
    field: FieldData
  ) => Promise<unknown>;
  updateField: (
    fieldId: number,
    fieldUpdate: FieldUpdate
  ) => Promise<unknown>;
  removeField: (
    fieldId: number
  ) => Promise<unknown>;
  // ...groups
  getGroups: (
    params: GroupQuery
  ) => Promise<MailerLiteGroup[]>;
  searchGroups: (
    groupName: GroupSearchQuery['group_name']
  ) => Promise<MailerLiteGroup[]>;
  getGroup: (
    groupId: number
  ) => Promise<MailerLiteGroup>;
  createGroup: (
    group: GroupData
  ) => Promise<MailerLiteGroup>;
}

export interface MailerLiteExecutor {

}

export const getMailingManager = (mailerLiteClient: MailerLiteClient, mailerLiteApiKey: string): MailingManager => {
  if (!process.env.MAILERLITE_API_KEY) {
    throw `Not found "MAILERLITE_API_KEY" in your enviroments.`;
  }
  // const mailerLite = MailerLite(process.env.MAILERLITE_API_KEY);

  // TODO: move to wrapper
  const createCampaign = (data: CampaignData): Promise<CreateCampaignResponse> => {
    return new Promise<CreateCampaignResponse>((resolve, reject) => {
      mailerLiteClient.createCampaign(data)
        .then(response => resolve(response as unknown as CreateCampaignResponse))
        .catch(err => reject(err));
    });
  };

  // TODO: move to Executor
  const findGroup = (groupName: string): Promise<MailerLiteGroup> => {
    return new Promise<MailerLiteGroup>((resolve, reject) => {
      mailerLiteClient.getGroups().then(response => {
        const group = response.find(g => g.name === groupName);
        if (group) {
          resolve(group);
        } else {
          throw `Not found group "${groupName}" in MailerLite.`;
        }
      }).catch(err => reject(err));
    });
  };

  // TODO: move to wrapper
  const setCampaignContent = (campaignId: number, content: CampaignContent): Promise<SetCampaignContentResponse> => {
    return new Promise<SetCampaignContentResponse>((resolve, reject) => {
      mailerLiteClient.setCampaignContent(campaignId, content)
        .then(response => resolve(response as unknown as SetCampaignContentResponse))
        .catch(err => reject(err));
    });
  };

  // TODO: move to wrapper
  const prepareGroupsIds = (groups: MailerLiteGroup[]): number[] => {
    return groups.map(group => group.id);
  };

  // TODO: move to wrapper
  const prepareContent = async (htmlFilePath: string, plainTextPath: string, params: ContentParam[]): Promise<CampaignContent> => {
    return {
      html: replaceParams(await loadFile(htmlFilePath), params),
      plain: replaceParams(await loadFile(plainTextPath), params)
    };
  };

  // TODO: move to executor
  const sendPayReminderMail = async (groupName: string) => {
    console.log("inside send Pay Reminder");
    let campaignId: number | undefined;
    let isSetContent: boolean = false;
    try {
      const content: CampaignContent = await prepareContent(AssetPathMap.payReminderMailHtml, AssetPathMap.payReminderMailTxt, preparePayReminderParams());
      const campaignData: CampaignData = await loadFileAsType(AssetPathMap.payReminderMailJson);
      const group: MailerLiteGroup = await findGroup(groupName);
      campaignData.groups = prepareGroupsIds([group]);
      const campaignResponse: CreateCampaignResponse = await createCampaign(campaignData);
      campaignId = campaignResponse.id;
      if (campaignId) {
        isSetContent = (await setCampaignContent(campaignId, content)).success;
      }
      if (campaignId && isSetContent) {
        const actResponse = await mailerLiteClient.actOnCampaign(campaignId, "send", {
          analytics: 1,
          type: 1
        });
        console.log(JSON.stringify(actResponse));
      }
      createLog.info(`Mail was send to group "${groupName}".`)
    } catch (err) {
      createLog.error(err);
      if (campaignId) {
        mailerLiteClient.removeCampaign(campaignId).then(() => {
          createLog.info(`Removed campaign "${campaignId}".`);
        }).catch(err => {
          createLog.error(err);
          createLog.info(`Can't remove campaign "${campaignId}".`);
        });
      }
    }
  };

  const getMailingExecutor = (): Executor => {
    return {
      name: "MailingExecutor",
      executor: this,
      typeName: typeof executor,
    };
  };

  return {
    getMailingExecutor,
    sendPayReminderMail,
    findGroup,
  };
};
