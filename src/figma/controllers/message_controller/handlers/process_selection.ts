import { getCurrentSelection, getCurrentPresentation, getAllNodes } from '../../../utils/figma_utils';
import  {getSlides}  from '../../../lib/get-slides';
import { setPageMap } from '../../../lib/set-page-map';
import { nodeReNamer } from '../../../lib/node-renamer';
import { FIGMA_MESSAGE_TYPES } from '~/shared/constants';

export default async function  handleProcessSelection(presentationName): Promise<void> {
  const currentSelection = getCurrentSelection();
  const currentPresentation = getCurrentPresentation();
  const currentNodes = getAllNodes();
  let payloadSlides = [];
  console.log('presentation name is going to be ', presentationName);

  //const pagesMap = setPageMap(currentPresentation.children);
  if(currentSelection.components.length > 0) {
   payloadSlides = await getSlides(currentPresentation, presentationName.data)
  } else {
    payloadSlides = await getSlides(currentPresentation, presentationName.data);
  }
   

  return Promise.all(
    // export all selected components and frames
    [...currentSelection.components, ...currentSelection.frames].map(node => {

        //nodeReNamer(node, pagesMap);
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
      type: FIGMA_MESSAGE_TYPES.PROCESS_SELECTION,
      data: {
        selections,
        currentPresentation, 
        currentNodes,
        payloadSlides
      },
    });
  });
}