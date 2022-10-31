import { getCurrentSelection, getCurrentPresentation, getAllNodes } from '../../../utils/figma_utils';
import { getSlides } from '../../../lib/get-slides';
import { setPageMap } from '../../../lib/set-page-map';
import { nodeReNamer } from '../../../lib/node-renamer';
import { FIGMA_MESSAGE_TYPES } from '~/shared/constants';

export default function handlePackageSelection(): Promise<void> {
  const currentSelection = getCurrentSelection();
  const currentPresentation = getCurrentPresentation();
  const currentNodes = getAllNodes();


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
        currentPresentation, 
        currentNodes
      },
    });
  });
}