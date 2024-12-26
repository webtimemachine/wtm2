import { CreateNavigationEntry } from '@wtm/api';

export enum ServiceWorkerMessageType {
  COMPLETION_RESULT = 'completion_result',
  GENERATE_COMPLETION = 'generate_completion',
  CREATE_NAVIGATION_ENTRY = 'create_navigation_entry',
  UPDATE_EXTENSION_ICON = 'update_extension_icon',
  EXTERNAL_LOGIN = 'external_login',
}

export type ServiceWorkerPayload =
  | {
      type: ServiceWorkerMessageType.GENERATE_COMPLETION;
      content: string;
      url: string;
    }
  | {
      type: ServiceWorkerMessageType.COMPLETION_RESULT;
      result: string;
    }
  | {
      type: ServiceWorkerMessageType.CREATE_NAVIGATION_ENTRY;
      navigationEntry: CreateNavigationEntry;
    }
  | {
      type: ServiceWorkerMessageType.UPDATE_EXTENSION_ICON;
    }
  | {
      type: ServiceWorkerMessageType.EXTERNAL_LOGIN;
      accessToken: string;
      refreshToken: string;
      serverUrl: string;
    };

export enum EngineStatus {
  READY = 'ready',
  NOT_READY = 'not_ready',
  LOADING = 'loading',
}

export enum Ports {
  SERVICE_WORKER = 'webtm_service_worker',
}
