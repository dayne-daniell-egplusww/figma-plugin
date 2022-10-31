import { setUserConfig } from '../../../utils/figma_utils';

export default function reset(): void {
  setUserConfig({}).then(() => {
    figma.closePlugin('GitLab plugin was restored to its default state.');
  });
}
