import { 
    DELIMITER,
    SLIDE_CONTENT,
    VEEVA_CHROME_CONTENT,
    OVERLAY_CONTENT,
    TRIGGERS,
    TRIGGER_DELIMITER,
    SPLIT_DELIMITER,
    PRES_SLIDE_DELIMITER,
    SLIDE_KEY,
    OVERLAY_KEY,
    SLIDE_ID_FROM_NAME,
    TAB_KEY,
    SLIDE_CHROME,
    TAB_OVERLAY_ID_FROM_NAME
} from './constants';
import { 
    idCleanup,
    convertToSlug,
    exportNodeSVG
} from './utils';

export const getSlides = async (presentation) => {

    return new Promise(async (resolve, reject) => {

        // get all the slide nodes
        const slideNodes = presentation.children;
        const svgMap = {}

        for (const [nodeIndex, node] of slideNodes.entries()) {
        //    console.log('node is', node)
            
            const slideContent = node.children.find(item => item.name === 'CONTENT');
            
            svgMap[node.id] = await exportNodeSVG(slideContent);
        }

        // second we need to collect each true slide in the pres
        // and create a true array for each slide
        // So we create an array of ids, sort it at the end (because it 
        // looks like Figma gives this to use backwards), and then 
        // we remove all duplicates.
        // Now we have an array that we can map all content back into
        let slideContent = [...new Set(slideNodes.map(node => {
            return node.name.split(SPLIT_DELIMITER)[0]; //returns numbering convention
        }))].sort();

        // now we take our super simple array and create
        // a new one pulling content in from the original array
        slideContent = slideContent.map((slideId, slideIndex) => {

            const slideNode = slideNodes.find(nodeItem => {
                return slideId === nodeItem.name.split(SLIDE_ID_FROM_NAME)[0];
            });

            return {

                id: idCleanup(slideNode.id),
                figmaId: slideNode.id,
                type: 'slide',
                detailName: presentation.name,
                detailId: slideId,
                slideName: slideNode.name,
                slideNameSlug: convertToSlug(slideNode.name),
                order: slideIndex + 1,
                slideContent: (slideNode.name.includes(TAB_KEY) || slideNode.name.includes(OVERLAY_KEY)) ? null : svgMap[slideNode.id],
                slideTabs: slideNodes.map(item => {
                    return (slideId === item.name.split(SLIDE_ID_FROM_NAME)[0] && item.name.includes(TAB_KEY)) ? item : null;
                }).filter(item => !!item).map((node, index) => {
                    return {
                        tabName: node.name,
                        type: 'tab',
                        id: idCleanup(node.id),
                        parentId: slideId,
                        detailName: presentation.name,
                        detailId: node.name.split(TAB_OVERLAY_ID_FROM_NAME)[0],
                        figmaId: node.id,
                        order: index + 1,
                        slideTabContent: node.name.split(TAB_OVERLAY_ID_FROM_NAME)[1].split('_').join(' '),
                        slideTab: svgMap[node.id]
                    }
                }).reverse(),
                slideOverlays: slideNodes.map(item => {
                    return (slideId === item.name.split(SLIDE_ID_FROM_NAME)[0] && item.name.includes(OVERLAY_KEY)) ? item : null;
                }).filter(item => !!item).map((node, index) => {
                    return {
                        overlayName: node.name,
                        type: 'overlay',
                        id: idCleanup(node.id),
                        parentId: slideId,
                        detailName: presentation.name,
                        detailId: node.name.split(TAB_OVERLAY_ID_FROM_NAME)[0],
                        figmaId: node.id,
                        order: index + 1,
                        slideOverlay: svgMap[node.id]
                    }
                }).reverse()

            }

        });

        console.log('slidecontent in getslides is', slideContent)

        return resolve(slideContent);

    });

}