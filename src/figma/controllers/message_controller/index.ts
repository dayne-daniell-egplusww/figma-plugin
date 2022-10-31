import { FIGMA_MESSAGE_TYPES } from '~/shared/constants';
import handleSetUserConfig from './handlers/set_user_config';
import handleExportSelection from './handlers/export_selection';
import handleProcessSelection from './handlers/process_selection';
import handlePackageSelection from './handlers/package_selection';
import handleResize from './handlers/resize';
import handleNotify from './handlers/notify';

const handlers = {
  [FIGMA_MESSAGE_TYPES.SET_USER_CONFIG]: handleSetUserConfig,
  [FIGMA_MESSAGE_TYPES.EXPORT_SELECTION]: handleExportSelection,
  [FIGMA_MESSAGE_TYPES.PROCESS_SELECTION]: handleProcessSelection,
  [FIGMA_MESSAGE_TYPES.PACKAGE_SELECTION]: handlePackageSelection,
  [FIGMA_MESSAGE_TYPES.RESIZE]: handleResize,
  [FIGMA_MESSAGE_TYPES.NOTIFY]: handleNotify,
};

/**
 * @name MessageController
 * @description The Message controller handles messages from the plugin UI (our Vue application)
 * @see https://www.figma.com/plugin-docs/creating-ui/#sending-a-message-from-the-ui-to-the-plugin-code
 */
export default function messageController(): MessageController {
  return {
    handle(message) {
      const handler = handlers[message.type];
      if (!handler) return Promise.reject(`No handler for message type [${message.type}]`);

      return handler(message);
    },
  };
}
