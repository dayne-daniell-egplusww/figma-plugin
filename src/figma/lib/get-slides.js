import { 
    DELIMITER,
    SLIDE_CONTENT,
    VEEVA_CHROME_CONTENT,
    OVERLAY_CONTENT,
    TRIGGERS,
    TRIGGER_DELIMITER,
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
console.log('getSlides called with presentation as', presentation)
    return new Promise(async (resolve, reject) => {

        // get all the slide nodes
        const slideNodes = presentation.children;
        const svgMap = {}

        console.log('slideNodes ->', slideNodes.map(item => item.name));

        for (const [nodeIndex, node] of slideNodes.entries()) {
            
            const slideContent = node.children.find(item => item.name === 'CONTENT');
            
            svgMap[node.id] = await exportNodeSVG(slideContent) 
        }

        // second we need to collect each true slide in the pres
        // and create a true array for each slide
        // So we create an array of ids, sort it at the end (because it 
        // looks like Figma gives this to use backwards), and then 
        // we remove all duplicates.
        // Now we have an array that we can map all content back into
        let slideContent = [...new Set(slideNodes.map(node => {
            return node.name.split(SLIDE_ID_FROM_NAME)[0];
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

        // // let's get the SVGs for the slide, inlcuding tabs and overlays
        // for (const [slideIndex, slide] of slideContent.entries()) {

        //     //slideContent[slideIndex].slideChrome = (slide.slideChrome) ? await exportNodeSVG(slide.slideChrome) : null;
            
        //     slideContent[slideIndex].slideContent = (slide.slideContent) ? await exportNodeSVG(slide.slideContent) : null;

        //     for (const [tabIndex, tab] of slide.slideTabs.entries()) {

        //         slideContent[slideIndex].slideTabs[tabIndex].slideTab = (tab.slideTab) ? await exportNodeSVG(tab.slideTab) : null;
            
        //     }

        //     for (const [overlayIndex, overlay] of slide.slideOverlays.entries()) {
                
        //         slideContent[slideIndex].slideOverlays[overlayIndex].slideOverlay = (overlay.slideOverlay) ? await exportNodeSVG(overlay.slideOverlay) : null;
            
        //     }

        // }

        // // ok, this is for the POC --- UPDATE --- going back to a different way...oof
        // // the payload will be too big to nest the tabs and overlays
        // const returnSlideArray = [];

        // // for the POC, we need everything in the same slide
        // slideContent.forEach(slide => {

        //     returnSlideArray.push(slide);

        //     JSON.parse(JSON.stringify(slide.slideTabs)).forEach(tab => {
        //         returnSlideArray.push(tab);
        //     });

        //     JSON.parse(JSON.stringify(slide.slideOverlays)).forEach(overlay => {
        //         returnSlideArray.push(overlay);
        //     });

        // });

        // returnSlideArray.map(item => {
            
        //     if (item.type === 'slide') {

        //         item.slideTabs = item.slideTabs.map(tab => {
        //             tab.slideTab = tab.detailId;
        //             return tab;
        //         });

        //         item.slideOverlays = item.slideOverlays.map(overlay => {
        //             overlay.slideOverlay = overlay.detailId;
        //             return overlay;
        //         });

        //     }

        //     return item;
        // });

        return resolve(slideContent);

    });

}