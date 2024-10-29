import { CreateNavigationEntry } from '@wtm/api';

export enum SERVICE_WORKER_MESSAGE_TYPE {
  engineReady = 'engine_ready',
  completionResult = 'completion_result',
  generateCompletion = 'generate_completion',
  createNavigationEntry = 'create_navigation_entry',
  updateExtensionIcon = 'update_extension_icon',
}

export type ServiceWorkerPayload =
  | {
      type: SERVICE_WORKER_MESSAGE_TYPE.engineReady;
    }
  | {
      type: SERVICE_WORKER_MESSAGE_TYPE.generateCompletion;
      content: string;
      url: string;
    }
  | {
      type: SERVICE_WORKER_MESSAGE_TYPE.completionResult;
      result: string;
    }
  | {
      type: SERVICE_WORKER_MESSAGE_TYPE.createNavigationEntry;
      navigationEntry: CreateNavigationEntry;
    }
  | {
      type: SERVICE_WORKER_MESSAGE_TYPE.updateExtensionIcon;
    };

export enum ENGINE_STATUS {
  ready = 'ready',
  notReady = 'not_ready',
  loading = 'loading',
}

export enum PORT {
  serviceWorker = 'webtm_service_worker',
}
