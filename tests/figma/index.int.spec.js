import { MENU_COMMANDS, CLIENT_STORAGE_KEYS } from '~/figma/constants';
import { DEFAULT_WINDOW_SIZE, FIGMA_MESSAGE_TYPES } from '~/shared/constants';
import waitForPromises from '../helpers/wait_for_promises';
import mockUserConfig from './mock_data/mock_user_config';

function invokeFigma() {
  require('~/figma');
}

beforeEach(() => {
  jest.resetModules();
});

describe('Figma entry script', () => {
  const mockShowUI = jest.fn();
  const mockPostMessage = jest.fn();
  const mockOnFunction = jest.fn();
  const mockClosePlugin = jest.fn();
  const mockSetAsync = jest.fn().mockResolvedValue();

  global.figma = {
    ui: {
      postMessage: mockPostMessage,
    },
    showUI: mockShowUI,
    currentPage: {},
    on: mockOnFunction,
    closePlugin: mockClosePlugin,
    clientStorage: {
      setAsync: mockSetAsync,
    },
  };
  global.__html__ = {};

  describe('when command is [SHOW_UPLOAD_UI]', () => {
    beforeEach(() => {
      global.figma.command = MENU_COMMANDS.SHOW_UPLOAD_UI;
    });

    it('calls showUI and updates UI state', async () => {
      global.figma.clientStorage.getAsync = jest.fn().mockResolvedValue(mockUserConfig);

      invokeFigma();
      expect(global.figma.showUI).toHaveBeenCalledWith(global.__html__, { ...DEFAULT_WINDOW_SIZE });
      expect(global.figma.ui.postMessage).toHaveBeenCalledWith({
        data: {
          selection: {
            components: [],
            frames: [],
          },
        },
        type: FIGMA_MESSAGE_TYPES.UPDATE_SELECTION,
      });

      global.figma.ui.postMessage.mockClear();
      // wait for updateAccessToken to resolve
      await waitForPromises();
      expect(global.figma.ui.postMessage).toHaveBeenCalledWith({
        type: FIGMA_MESSAGE_TYPES.SET_USER_CONFIG,
        data: {
          accessToken: mockUserConfig.accessToken,
          gitlabInstance: { host: 'gitlab.com' },
        },
      });
    });
  });

  describe('when command is [RESET]', () => {
    beforeEach(() => {
      global.figma.command = MENU_COMMANDS.RESET;
    });

    it('sets access token to null and closes plugin', async () => {
      invokeFigma();
      expect(mockSetAsync).toHaveBeenCalledWith(CLIENT_STORAGE_KEYS.GITLAB_USER_CONFIG, {});

      await waitForPromises();
      expect(global.figma.closePlugin).toHaveBeenCalledTimes(1);
    });
  });
});
