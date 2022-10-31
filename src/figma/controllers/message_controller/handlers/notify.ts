export default function handleNotify(pluginMessage: PluginMessage): Promise<NotificationHandler> {
  const { message, options } = pluginMessage.data;

  return Promise.resolve(figma.notify(message, options));
}
