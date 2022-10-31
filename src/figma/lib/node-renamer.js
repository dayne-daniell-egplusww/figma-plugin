import { 
    DELIMITER,
    SLIDE_CONTENT,
    VEEVA_CHROME_CONTENT,
    OVERLAY_CONTENT,
    TRIGGERS,
    TRIGGER_DELIMITER
} from './constants';
import { 
    idCleanup,
    convertToSlug
} from './utils';

export const nodeReNamer = (nodes, pagesMap) => {
    // this is one of the only times we will crawl through all the nodes
    // in order to rename them into a meaningfull pattern which we will 
    // use to stuff into path ids of the SVG for all the interactions
    nodes.forEach(node => {

        // we need to use frames just for the 
        // top level! otherwise it will break and be very very bad
        // https://www.figma.com/best-practices/groups-versus-frames/
        if (node.type !== "FRAME") {
try {

            
            let newName = convertToSlug(node.name.split(DELIMITER)[0]);

            // we need to set a sting pattern which will end up in an array
            // something like this:
            //    { Figma User Generated Name }___{ Figma Node ID }___{ Interaction Trigger }---{ Interation Destination Figma Node ID }[ ___{ Interaction Trigger }---{ Interation Destination Figma Node ID } ]
            // "___" above is actually whatever the DELIMITER constant value is
            // "---" above is actually whatever the TRIGGER_DELIMITER constant value is
            // "[ ... ]" above allows for additional reactions
            // Also, Figma ID's use ":" in them. We need to convert these to "-"

            // adding { Figma Node ID }
            newName = newName.concat(DELIMITER, idCleanup(node.id));

            // adding interaction trigger if esists
            // for now, we only use ON_CLICK (in constants). See https://www.figma.com/plugin-docs/api/Trigger/
            if (node.reactions && node.reactions.length) {
                
                // enable concat for multiple actions
                node.reactions.forEach(reaction => {

                    if (reaction.action.destinationId) {

                        // we need to get the presentation and detail slugs 
                        const convertedId = pagesMap.get(reaction.action.destinationId) || PRES_SLIDE_NO_ID;
                        
                        // only add this is we have allow for the trigger type
                        // adding { Interaction Trigger }---{ Interation Destination Figma Node ID }
                        if (TRIGGERS.includes(reaction.trigger.type)) {
                            newName = newName.concat(DELIMITER, reaction.trigger.type, TRIGGER_DELIMITER, idCleanup(convertedId));
                        }
                    }
                }); 
            }

            node.name = newName;
} catch(e) {
    console.log('node renamer error' ,e)
}
        }

    })

}