import MessageService from '~/figma/services/message_service';
import MessageController from '~/figma/controllers/message_controller';
import FigmaController from '~/figma/controllers/figma_controller';
import CommandController from '~/figma/controllers/command_controller';

jest.mock('~/figma/services/message_service');
jest.mock('~/figma/controllers/message_controller');
jest.mock('~/figma/controllers/figma_controller');
jest.mock('~/figma/controllers/command_controller');

function invokeFigma() {
  require('~/figma');
}

describe('Figma entry script', () => {
  global.figma = {
    ui: {},
  };

  const mockMessageController = {
    handle: jest.fn().mockResolvedValue(),
  };
  const mockFigmaController = {
    init: jest.fn(),
  };
  const mockCommandController = {
    handle: jest.fn(),
  };

  beforeEach(() => {
    MessageController.mockReturnValue(mockMessageController);
    FigmaController.mockReturnValue(mockFigmaController);
    CommandController.mockReturnValue(mockCommandController);
  });

  it('sets appropriate event handlers', () => {
    invokeFigma();

    expect(global.figma.ui.onmessage).toBeDefined();
    expect(MessageController).toHaveBeenCalledTimes(1);
    expect(FigmaController).toHaveBeenCalledTimes(1);
    expect(CommandController).toHaveBeenCalledTimes(1);
    expect(MessageService).toHaveBeenCalledTimes(1);
    expect(FigmaController).toHaveBeenCalledWith(MessageService());
    expect(CommandController).toHaveBeenCalledWith(MessageService());
    expect(mockCommandController.handle).toHaveBeenCalledTimes(1);
    expect(mockFigmaController.init).toHaveBeenCalledTimes(1);
  });

  describe('Figma onmessage handler', () => {
    it('calls MessageController handler on invocation', () => {
      const mockMessage = { test: 'test_message' };

      invokeFigma();
      global.figma.ui.onmessage(mockMessage);

      expect(mockMessageController.handle).toHaveBeenCalledTimes(1);
      expect(mockMessageController.handle).toHaveBeenCalledWith(mockMessage);
    });
  });
});
