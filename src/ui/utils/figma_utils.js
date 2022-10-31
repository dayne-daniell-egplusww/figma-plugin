/**
 * Post a message to Figma
 * @param {string} type - message type
 * @param {any} data - payload to send
 */
export const postPluginMessage = (type, data) => {
  window.parent.postMessage(
    {
      pluginMessage: { type, data },
    },
    '*',
  );
};
