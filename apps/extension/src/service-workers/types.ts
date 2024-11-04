import { CreateNavigationEntry } from '@wtm/api';

export enum ServiceWorkerMessageType {
  ENGINE_READY = 'engine_ready',
  COMPLETION_RESULT = 'completion_result',
  GENERATE_COMPLETION = 'generate_completion',
  CREATE_NAVIGATION_ENTRY = 'create_navigation_entry',
  UPDATE_EXTENSION_ICON = 'update_extension_icon',
}

export type ServiceWorkerPayload =
  | {
      type: ServiceWorkerMessageType.ENGINE_READY;
    }
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
    };

export enum EngineStatus {
  READY = 'ready',
  NOT_READY = 'not_ready',
  LOADING = 'loading',
}

export enum Ports {
  SERVICE_WORKER = 'webtm_service_worker',
}
