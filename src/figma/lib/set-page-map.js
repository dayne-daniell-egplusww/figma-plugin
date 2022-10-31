import { 
    DELIMITER,
    SLIDE_CONTENT,
    VEEVA_CHROME_CONTENT,
    OVERLAY_CONTENT,
    TRIGGERS,
    TRIGGER_DELIMITER,
    PRES_SLIDE_DELIMITER
} from './constants';
import { 
    idCleanup,
    convertToSlug
} from './utils';

export const setPageMap = (nodes) => {

    // includes overlays
    const slideTabOverlayMap = new Map();

    nodes.forEach(node => {
        // storing by id
        // we store detail and id slugs
        slideTabOverlayMap.set(node.id, `${convertToSlug(node.parent.name)}${PRES_SLIDE_DELIMITER}${convertToSlug(node.name)}`);

    });

    return slideTabOverlayMap;

}