import { setUserConfig } from '../../../utils/figma_utils';

export default function handleSetUserConfig(message: PluginMessage): Promise<void> {
  const { accessToken, gitlabInstance } = message.data;

  const userConfig: UserConfig = {
    accessToken,
    gitlabInstance,
  };

  return setUserConfig(userConfig);
}
