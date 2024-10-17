import { CreateNavigationEntry } from '@wtm/api';

export enum SERVICEWORKERMESSAGETYPE {
  ENGINE_READY = 'engine_ready',
  COMPLETION_RESULT = 'completion_result',
  GENERATE_COMPLETION = 'generate_completion',
  CREATE_NAVIGATION_ENTRY = 'create_navigation_entry',
}

export type ServiceWorkerPayload =
  | {
      type: SERVICEWORKERMESSAGETYPE.ENGINE_READY;
    }
  | {
      type: SERVICEWORKERMESSAGETYPE.GENERATE_COMPLETION;
      content: string;
      url: string;
    }
  | {
      type: SERVICEWORKERMESSAGETYPE.COMPLETION_RESULT;
      result: string;
    }
  | {
      type: SERVICEWORKERMESSAGETYPE.CREATE_NAVIGATION_ENTRY;
      navigationEntry: CreateNavigationEntry;
    };

export enum ENGINESTATUS {
  READY = 'ready',
  NOT_READY = 'not_ready',
  LOADING = 'loading',
}
