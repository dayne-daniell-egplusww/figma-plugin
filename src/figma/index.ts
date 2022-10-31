import MessageService from './services/message_service';
import CommandController from './controllers/command_controller';
import MessageController from './controllers/message_controller';
import FigmaController from './controllers/figma_controller';

const messageService = MessageService();

const commandController = CommandController(messageService);
const messageController = MessageController();
const figmaController = FigmaController(messageService);

// setup message handler
figma.ui.onmessage = (message): void => {
  messageController.handle(message).catch(() => {
    figma.notify('Something went wrong! Open the Figma development console to inspect.');
  });
};

// handle the "command" that was triggered by the user clicking a menu item in Figma
// (see manifest.json for menu items that are exposed)
commandController.handle(figma.command);

// initialise the figma controller, which handles events originating from within Figma
figmaController.init();
