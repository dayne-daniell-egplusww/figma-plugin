<script>
import { FIGMA_MESSAGE_TYPES } from '~/shared/constants';
import FigmaInput from '../components/figma_plugin_ds/input';
import FigmaLabel from '../components/figma_plugin_ds/label';
import FigmaButton from '../components/figma_plugin_ds/button';
import FigmaAlert from '../components/figma_plugin_ds/alert';
import FigmaSection from '../components/figma_plugin_ds/section';
import FigmaCheckbox from '../components/figma_plugin_ds/checkbox';
import EmptyIssueIllustration from '../assets/illustrations/issues.svg';
import GitlabLogo from '../assets/icons/gitlab-icon-rgb.svg';
import setUserConfigMutation from '../graphql/mutations/set_user_config.mutation.graphql';
import currentUserQuery from '../graphql/queries/current_user.query.graphql';
import windowEmitter from '../shared/window_message_event_bus';
import { isHostGitlabCom, GITLAB_COM_HOST } from '../utils/gitlab_utils';
import { postPluginMessage } from '../utils/figma_utils';

export default {
  name: 'Login',
  components: {
    FigmaInput,
    FigmaLabel,
    FigmaButton,
    FigmaAlert,
    FigmaSection,
    FigmaCheckbox,
    EmptyIssueIllustration,
    GitlabLogo,
  },
  data() {
    return {
      userConfig: {
        accessToken: '',
        gitlabInstance: { host: '' },
      },
      alertMessage: null,
      tokenReceived: false,
      afterInitialLoad: false,
      useSelfManagedGitlab: false,
    };
  },
  apollo: {
    /**
     * currentUser query is used to verify we have valid user config
     * (i.e. that the accessToken/host combination is valid).
     *
     * This query is refetched various times, but whenever the currentUser
     * object is valid, we "log the user in" by pushing them to the next screen.
     */
    currentUser: {
      query: currentUserQuery,
      result({ data }) {
        if (!(data && data.currentUser)) {
          return;
        }
        // If we successfully got the current user,
        // we can imply that the userConfig is correct.
        // Thus, ensure the plugin localStorage is in sync here.
        postPluginMessage(FIGMA_MESSAGE_TYPES.SET_USER_CONFIG, this.userConfig);

        // Then, immediately navigate to next screen
        this.$router.push({ name: 'UploadSelection' });
      },
      error(err) {
        // only set initial load if we've received a token
        if (this.tokenReceived) {
          this.onInitialLoad();
        }

        console.error(err);
        this.alertDanger('Invalid access token. Please try again.');
      },
    },
  },
  computed: {
    isLoading() {
      return this.$apollo.queries.currentUser.loading;
    },
  },
  mounted() {
    /**
     * Listen to SET_USER_CONFIG events from Figma plugin.
     *
     * When plugin starts, Figma will send a message containing
     * the stored user config. We handle this event here.
     *
     * We handle this event by:
     *    1. Setting this component's state
     *    2. Update Apollo Cache (via @client mutation) with user config
     *    3. Force 'currentUser' query refetch, which will verify if we have
     *        valid user config (via the GitLab REST API)
     */
    windowEmitter.on(FIGMA_MESSAGE_TYPES.SET_USER_CONFIG, data => {
      this.tokenReceived = true;

      const { accessToken } = data;
      if (!accessToken) {
        // if no access token, save a network request
        // and bail early
        this.onInitialLoad();
        return;
      }

      this.userConfig = data;
      const { host } = this.userConfig.gitlabInstance;
      this.useSelfManagedGitlab = host && !isHostGitlabCom(host);
      this.onSetUserConfig();
    });
  },
  methods: {
    onInitialLoad() {
      // we have "intially loaded"
      // when Figma sends us the access token,
      // and when the currentUser request has completed
      if (!this.afterInitialLoad) {
        this.afterInitialLoad = true;
      }
    },
    setUserConfig() {
      const userConfig = {
        ...this.userConfig,
        gitlabInstance: {
          host: this.useSelfManagedGitlab ? this.userConfig.gitlabInstance.host : GITLAB_COM_HOST,
        },
      };

      // force-update the state
      this.userConfig = userConfig;

      return this.$apollo.mutate({
        mutation: setUserConfigMutation,
        variables: {
          userConfig,
        },
      });
    },
    onSetUserConfig() {
      this.setUserConfig().then(() => {
        this.$apollo.queries.currentUser.refetch();
      });
    },
    alertDanger(message) {
      this.alertType = 'danger';
      this.alertMessage = message;
    },
  },
};
</script>

<template>
  <main class="h-100 d-flex flex-column">
    <!-- Splash screen -->
    <div v-if="!afterInitialLoad" class="h-100 d-flex align-items-center justify-content-center">
      <gitlab-logo class="w-50"></gitlab-logo>
    </div>

    <!-- Login screen -->
    <template v-else>
      <figma-section class="flex-grow">
        <figma-alert
          v-if="!isLoading && alertMessage"
          class="mb-3"
          :variant="alertType || 'danger'"
          @dismiss="alertMessage = null"
          >{{ alertMessage }}</figma-alert
        >
        <div class="w-100 p-medium m-auto">
          <empty-issue-illustration></empty-issue-illustration>
        </div>

        <p class="text-xsmall">You are one step away from contributing to your designs.</p>
        <p class="text-xsmall">
          Authenticate with GitLab using a GitLab personal access token.
        </p>
        <form id="set_user_config_form" class="m-0" @submit.prevent="onSetUserConfig">
          <figma-label>GitLab access token</figma-label>
          <figma-input
            id="access_token_input"
            v-model="userConfig.accessToken"
            type="password"
            required
          ></figma-input>

          <figma-checkbox
            id="gitlab_instance_toggle"
            v-model="useSelfManagedGitlab"
            label="I am using a self-managed GitLab instance"
            class="pt-small pb-small"
          />

          <template v-if="useSelfManagedGitlab">
            <figma-label>Self-managed host</figma-label>
            <figma-input
              id="gitlab_host"
              v-model="userConfig.gitlabInstance.host"
              placeholder="gitlab.mycompany.com"
              type="text"
              required
            ></figma-input
          ></template>
        </form>
      </figma-section>
      <figma-section
        class="d-flex justify-content-between align-items-center w-100 border-top-grey"
      >
        <a
          href="https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/wikis/home#creating-a-gitlab-personal-access-token"
          class="text-xsmall"
          rel="noopener noreferrer"
          target="_blank"
          >Where to find my token?
        </a>
        <figma-button :loading="isLoading" type="submit" form="set_user_config_form">{{
          isLoading ? 'Saving settings' : 'Save settings'
        }}</figma-button>
      </figma-section>
    </template>
  </main>
</template>
