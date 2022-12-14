import { CLIENT_STORAGE_KEYS } from '../constants';

const USER_CONFIG_DEFAULTS = {
  accessToken: null,
  gitlabInstance: {},
};

/**
 * Return all Figma Frames and Components that are currently selected by the user in Figma
 */
 export const getCurrentSelection = (): PluginSelection => {
  const currentSelection = figma.currentPage.selection || [];

  const validSelection: PluginSelection = { components: [], frames: [] };
  currentSelection.forEach(selection => {
    if (selection.type === 'FRAME') {
      validSelection.frames.push(selection);
    } else if (selection.type === 'COMPONENT') {
      validSelection.components.push(selection);
    }
  });

  return validSelection;
};

/**
 * 
 * @returns pageNode object of current page
 */
export const getCurrentPresentation = () => {
  const currentPage = figma.currentPage;
  return currentPage
}

export const getAllNodes = () => {
  return figma.currentPage.findAll()
}

export const exportNodeSVG = async (node) => {
  return new Promise((resolve, reject) => {
    if(node) {
      node.exportAsync({format: 'SVG', svgIdAttribute: true}).then(res => {
        resolve(String.fromCharCode.apply(null, res));
    }).catch(err => reject(err));
    }
  });
}

export const setUserConfig = (userConfig: UserConfig): Promise<void> => {
  return figma.clientStorage.setAsync(CLIENT_STORAGE_KEYS.GITLAB_USER_CONFIG, userConfig);
};

export const getUserConfig = (): Promise<UserConfig | null> => {
  return figma.clientStorage
    .getAsync(CLIENT_STORAGE_KEYS.GITLAB_USER_CONFIG)
    .then(config => {
      return Object.assign(USER_CONFIG_DEFAULTS, config);
    })
    .catch(() => {
      return USER_CONFIG_DEFAULTS;
    });
};
