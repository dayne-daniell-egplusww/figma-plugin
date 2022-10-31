export default function handleResize(message: PluginMessage): Promise<void> {
  const { width, height } = message.data;
  if (!width || !height) return;

  figma.ui.resize(width, height);

  return Promise.resolve();
}
