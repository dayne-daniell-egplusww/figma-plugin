import showUploadUI from './handlers/show_upload_ui';
import showProcessUI from './handlers/show_process_ui';
import reset from './handlers/reset';
import { MENU_COMMANDS } from '../../constants';

/**
 * @name CommandController
 * @description The Command controller handles the Figma command in the context of the plugin's current environment.
 * Commands are triggered from clicking the plugin's menu items from within Figma.
 * @see https://www.figma.com/plugin-docs/api/figma/#command
 */
export default function(messageService: MessageService): CommandController {
  return {
    handle(command: string): void {
      switch (command) {
        case MENU_COMMANDS.SHOW_UPLOAD_UI: {
          showUploadUI(messageService);
          break;
        }
        case MENU_COMMANDS.SHOW_PROCESS_UI: {
          showProcessUI(messageService);
          break;
        }
        case MENU_COMMANDS.RESET: {
          reset();
          break;
        }
        default: {
          figma.closePlugin("Sorry, we don't know what to do with that menu item!");
          break;
        }
      }
    },
  };
}
