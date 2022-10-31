export const FIGMA_MESSAGE_TYPES = {
  UPDATE_SELECTION: 'UPDATE_SELECTION',
  SET_USER_CONFIG: 'SET_USER_CONFIG',
  EXPORT_SELECTION: 'EXPORT_SELECTION',
  PROCESS_SELECTION: 'PROCESS_SELECTION',
  PACKAGE_SELECTION: 'PACKAGE_SELECTION',
  RESIZE: 'RESIZE',
  NOTIFY: 'NOTIFY',
  WARNING_MESSAGE: 'WARNING_MESSAGE',
  ERROR_MESSAGE: 'ERROR_MESSAGE'
};

export const DEFAULT_WINDOW_SIZE = {
  width: 380,
  height: 560,
};

export const GITLAB_INSTANCE_PROTOCOL = process.env.GITLAB_INSTANCE_PROTOCOL || 'https:';
