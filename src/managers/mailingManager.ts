
import { CampaignContent, CampaignData } from './../../node_modules/mailerlite-api-v2-node/dist/@types/index.d';
import { createLog } from '../utils/logger';
import { MailerLiteGroup } from "mailerlite-api-v2-node/dist/api/groups";
import { AssetPathMap } from '../consts/assetPathMap';
import { loadFileAsType } from '../utils/loadFile';
import { preparePayReminderParams } from '../helpers/payReminderHelpers';
import { Executor } from './triggerManager';
import { MailerLiteClient } from '../types/mailerLiteApi/mailerLiteClient';
import { prepareMailerContent } from '../utils/prepareMailerContent';
import { createCampaign, prepareGroupsIds, setCampaignContent } from '../helpers/mailerLiteApi';
import { CreateCampaignResponse } from '../types/mailerLiteApi/createCampaignResponse';

export interface MailingManager {
  getMailingExecutor: () => Executor;
}

export interface MailerLiteExecutor {
  sendPayReminderMail: (groupName: string) => void;
  findGroup: (groupName: string) => Promise<MailerLiteGroup>;
}

export const getMailingManager = (mailerLiteClient: MailerLiteClient): MailingManager => {
  const findGroup = (groupName: string): Promise<MailerLiteGroup> => {
    return new Promise<MailerLiteGroup>((resolve, reject) => {
      mailerLiteClient.getGroups().then(response => {
        const group = response.find(g => g.name === groupName);
        if (group) {
          resolve(group);
        } else {
          throw new Error(`Not found group "${groupName}" in MailerLite.`);
        }
      }).catch(err => reject(err));
    });
  };

  const sendPayReminderMail = async (groupName: string) => {
    let campaignId: number | undefined;
    let isSetContent: boolean = false;
    try {
      const content: CampaignContent = await prepareMailerContent(AssetPathMap.payReminderMailHtml, AssetPathMap.payReminderMailTxt, preparePayReminderParams());
      const campaignData: CampaignData = await loadFileAsType(AssetPathMap.payReminderMailJson);
      const group: MailerLiteGroup = await findGroup(groupName);
      campaignData.groups = prepareGroupsIds([group]);
      const campaignResponse: CreateCampaignResponse = await createCampaign(mailerLiteClient, campaignData);
      campaignId = campaignResponse.id;
      if (campaignId) {
        isSetContent = (await setCampaignContent(mailerLiteClient, campaignId, content)).success;
      }
      if (campaignId && isSetContent) {
        // const actResponse = 
        await mailerLiteClient.actOnCampaign(campaignId, "send", {
          analytics: 1,
          type: 1
        });
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
    const executor = {
      sendPayReminderMail,
      findGroup
    };

    return {
      name: "MailingExecutor",
      executor,
      typeName: typeof executor,
    };
  };

  return {
    getMailingExecutor,
  };
};
