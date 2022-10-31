/**
 * @name FigmaController
 * @description The Figma controller handles events generated from the Figma application.
 * @see https://www.figma.com/plugin-docs/api/properties/figma-on/#available-event-types
 */
export default function(messageService: MessageService): FigmaController {
  return {
    init(): void {
      // https://www.figma.com/plugin-docs/api/properties/figma-on/#selectionchange
      figma.on('selectionchange', () => {
        messageService.updateSelection();
      });
    },
  };
}
