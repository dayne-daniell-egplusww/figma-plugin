import { getCurrentSelection } from '../../../utils/figma_utils';
import { getCurrentPresentation } from '../../../utils/figma_utils';
import { FIGMA_MESSAGE_TYPES } from '~/shared/constants';

export default function handleExportSelection(): Promise<void> {
  const currentSelection = getCurrentSelection();
  const currentPresentation = getCurrentPresentation();

  return Promise.all(
    // export all selected components and frames
    [...currentSelection.components, ...currentSelection.frames].map(node => {
      return node
        .exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 2 } })
        .then(nodeData => {
          return {
            name: node.name,
            data: nodeData,
          };
        });
    }),
  ).then(selections => {
    figma.ui.postMessage({
      type: FIGMA_MESSAGE_TYPES.EXPORT_SELECTION,
      data: {
        selections,
        currentPresentation
      },
    });
  });
}


