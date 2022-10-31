import { getUserConfig, getCurrentSelection } from '../utils/figma_utils';
import { FIGMA_MESSAGE_TYPES } from '~/shared/constants';

/**
 * @name MessageService
 * @description The Message service provides an API for sending messages to the plugin API (our Vue application).
 * Available methods are simple wrappers around `figma.ui.postmessage`.
 */
export default function getMessageService(): MessageService {
  function updateSelection(): void {
    const selection = getCurrentSelection();

    figma.ui.postMessage({
      type: FIGMA_MESSAGE_TYPES.UPDATE_SELECTION,
      data: {
        selection: {
          frames: selection.frames,
          components: selection.components,
        },
      },
    });
  }

  async function updateUserConfig(): Promise<void> {
    const userConfig = await getUserConfig();

    figma.ui.postMessage({
      type: FIGMA_MESSAGE_TYPES.SET_USER_CONFIG,
      data: userConfig,
    });
  }

  return { updateSelection, updateUserConfig };
}
