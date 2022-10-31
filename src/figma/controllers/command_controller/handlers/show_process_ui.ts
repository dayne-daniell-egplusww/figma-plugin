import { DEFAULT_WINDOW_SIZE } from '~/shared/constants';

export default function showProcessUI(messageService: MessageService): void {
  figma.showUI(__html__, { width: DEFAULT_WINDOW_SIZE.width, height: DEFAULT_WINDOW_SIZE.height });
  messageService.updateUserConfig();
  messageService.updateSelection();
}
