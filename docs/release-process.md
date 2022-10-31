# Release process

Publishing the plugin to the Figma plugin directory is a [manual process](https://help.figma.com/hc/en-us/articles/360042293714#Publish_an_update). This project adopts a
Git-flow-inspired development workflow, where the [`main`](https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/tree/main) branch is the source-of-truth.

## Publish the plugin

When all features for a release have been merged to [`main`](https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/tree/main) and you're ready to publish the plugin, complete the following steps:

1. [Create a release](https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/releases/new) in the [`gitlab-figma-plugin`](https://gitlab.com/gitlab-org/gitlab-figma-plugin) project with the appropriate version (following `semver`) and a brief changelog.
1. Generate a production-ready application bundle on your local machine for the `main` branch:

   ```bash
   # in the project's root directory
   git checkout main
   npm run build:clean
   ```

   This will ensure the `dist/` directory is up to date with the latest changes.

Now, within the Figma desktop application:

1. Sign in to the `@gitlab_dev` (`integrations(at)gitlab.com`) Figma account. Login credentials for this account are located in the GitLab Engineering 1Password vault.
1. From the application menu, click **Plugins > Manage plugins** to open the **Plugins** modal.
1. Find the **GitLab** plugin under the **In development** section.

   > If you cannot find the **GitLab** plugin, ensure you have completed the [Figma setup](#figma-setup).

1. Open the **Publish New Release** modal by click the three-dots icon (ellipsis) > **Publish New Release**.
1. Add a brief changelog to the **Version notes** text area, as well as a link to the release in GitLab.
1. Publish the release by clicking **Publish**.

## Updating the plugin listing details

Updates to the plugin listing copy and assets (for example, cover art) are made within the Figma desktop
application in the **Publish Plugin** modal (see the final steps of the [Release process](#figma-plugin-releases)) section for a guide on publishing the plugin).

**Important**: we need to track the changes of marketing copy and assets for the plugin's listing in the
Figma plugin directory, and also ensure that this is reviewed by a GitLab Product Manager. When updating the plugin listing details:

1. Make any changes to the `figma_plugin_directory_assets/` directory.
1. Create a merge request, and request a review from a member of the ~"group::knowledge" ~frontend or product team.

Once its content is merged, follow the [Release process](#figma-plugin-releases) to make the approved changes to the plugin's listing on the **Publish Plugin** modal.
