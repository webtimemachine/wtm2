import { CompleteNavigationEntry } from './complete-navigation-entry.type';

export const countNavigationEntriesQueryRaw = `
  SELECT count(*) FROM navigation_entry ne 
  WHERE 
      ne."userId" = $1 AND
    (
      ne."tsvectorGeneratedContent" @@ to_tsquery('english', $2) OR 
      ne."titleLower" SIMILAR TO $3 OR 
      ne."url" SIMILAR TO $4
    )
  `;

export const navigationEntriesQueryRaw = `
  SELECT
    ne."id" AS "navigationEntryId",
    ne."url" AS "navigationEntryUrl",
    ne."title" AS "navigationEntryTitle",
    ne."userId" AS "navigationEntryUserId",
    ne."createdAt" AS "navigationEntryCreatedAt",
    ne."updateAt" AS "navigationEntryUpdatedAt",
    ne."navigationDate" AS "navigationEntryNavigationDate",
    ne."userDeviceId" AS "navigationEntryUserDeviceId",
    ne."liteMode" AS "navigationEntryLiteMode",
    ne."aiGeneratedContent" AS "navigationEntryAIGeneratedContent",
    ud."id" AS "userDeviceId",
    ud."userId" AS "userDeviceUserId",
    ud."createdAt" AS "userDeviceCreatedAt",
    ud."updateAt" AS "userDeviceUpdatedAt",
    ud."deviceAlias" AS "userDeviceAlias",
    ud."deviceId" AS "userDeviceDeviceId",
    d."id" AS "deviceId",
    d."createdAt" AS "deviceCreatedAt",
    d."updateAt" AS "deviceUpdatedAt",
    d."deviceKey" AS "deviceKey",
    d."userAgent" AS "deviceUserAgent",
    d."userAgentData" AS "deviceUserAgentData",
    et."id" AS "entryTagId",
    et."entryId" AS "entryTagEntryId",
    et."tagId" AS "entryTagTagId",
    t."id" AS "tagId",
    t."name" AS "tagName"
  FROM
    navigation_entry ne
  INNER JOIN user_device ud ON
    ne."userDeviceId" = ud.id
  INNER JOIN device d ON
    ud."deviceId" = d.id
  LEFT JOIN entry_tag et ON
    ne."id" = et."entryId"
  LEFT JOIN tag t ON
    et."tagId" = t.id
  WHERE 
    ne."userId" = $1 AND
    (
      ne."tsvectorGeneratedContent" @@ to_tsquery('english', $2) OR 
      ne."titleLower" SIMILAR TO $3 OR 
      ne."url" SIMILAR TO $4
    )
  ORDER BY "navigationEntryNavigationDate" DESC
  LIMIT $5 
  OFFSET $6;
  `;

export interface RawCompleteNavigationEntry {
  navigationEntryId: bigint;
  navigationEntryCreatedAt: Date;
  navigationEntryUpdateAt: Date | null;
  navigationEntryUrl: string;
  navigationEntryTitle: string;
  navigationEntryTitleLower: string;
  navigationEntryLiteMode: boolean;
  navigationEntryUserId: bigint;
  navigationEntryNavigationDate: Date;
  navigationEntryUserDeviceId: bigint;
  navigationEntryAIGeneratedContent: string;

  userDeviceId: bigint;
  userDeviceCreatedAt: Date;
  userDeviceUpdateAt: Date | null;
  userDeviceUserId: bigint;
  userDeviceDeviceAlias: string | null;
  userDeviceDeviceId: bigint;

  deviceId: bigint;
  deviceCreatedAt: Date;
  deviceUpdateAt: Date | null;
  deviceDeviceKey: string;
  deviceUserAgent: string | null;
  deviceUserAgentData: string | null;

  entryTagId: bigint | null;
  entryTagEntryId: bigint | null;
  entryTagTagId: bigint | null;

  tagId: bigint | null;
  tagName: string | null;
}

export const transformRawToCompleteNavigationEntries = (
  rawEntries: RawCompleteNavigationEntry[],
): CompleteNavigationEntry[] => {
  // Map to group navigation entries by ID
  const entryMap: Map<bigint, CompleteNavigationEntry> = new Map();

  rawEntries.forEach((raw) => {
    // Check if the navigation entry already exists in the map
    if (!entryMap.has(raw.navigationEntryId)) {
      // Create a new CompleteNavigationEntry object
      const navigationEntry: CompleteNavigationEntry = {
        id: raw.navigationEntryId,
        createdAt: raw.navigationEntryCreatedAt,
        updateAt: raw.navigationEntryUpdateAt,
        url: raw.navigationEntryUrl,
        title: raw.navigationEntryTitle,
        titleLower: raw.navigationEntryTitleLower,
        liteMode: raw.navigationEntryLiteMode,
        userId: raw.navigationEntryUserId,
        navigationDate: raw.navigationEntryNavigationDate,
        userDeviceId: raw.navigationEntryUserDeviceId,
        aiGeneratedContent: raw.navigationEntryAIGeneratedContent,
        userDevice: {
          id: raw.userDeviceId,
          createdAt: raw.userDeviceCreatedAt,
          updateAt: raw.userDeviceUpdateAt,
          userId: raw.userDeviceUserId,
          deviceAlias: raw.userDeviceDeviceAlias,
          deviceId: raw.userDeviceDeviceId,
          device: {
            id: raw.deviceId,
            createdAt: raw.deviceCreatedAt,
            updateAt: raw.deviceUpdateAt,
            deviceKey: raw.deviceDeviceKey,
            userAgent: raw.deviceUserAgent,
            userAgentData: raw.deviceUserAgentData,
          },
        },
        entryTags: [], // Initialize as an empty array to be populated later
      };
      entryMap.set(raw.navigationEntryId, navigationEntry);
    }

    // Add entryTag if it exists
    if (raw.entryTagId && raw.tagId) {
      const completeEntry = entryMap.get(raw.navigationEntryId)!;
      completeEntry.entryTags!.push({
        id: raw.entryTagId,
        entryId: raw.entryTagEntryId!,
        tagId: raw.entryTagTagId!,
        tag: {
          id: raw.tagId,
          name: raw.tagName || '',
        },
      });
    }
  });

  // Convert the map values back to an array
  return Array.from(entryMap.values());
};
