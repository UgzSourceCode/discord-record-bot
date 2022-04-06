import { Account, AccountWrap, Batch, CampaignAction, CampaignContent, CampaignData, CampaignQuery, CampaignSendData, CampaignStatus, FieldData, FieldUpdate, GroupData, GroupQuery, GroupSearchQuery } from "mailerlite-api-v2-node/dist/@types";
import { MailerLiteGroup } from "mailerlite-api-v2-node/dist/api/groups";

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