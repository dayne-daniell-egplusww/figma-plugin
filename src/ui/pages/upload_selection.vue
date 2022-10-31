<script>
import { FIGMA_MESSAGE_TYPES } from '~/shared/constants';
import FigmaButton from '../components/figma_plugin_ds/button';
import FigmaAlert from '../components/figma_plugin_ds/alert';
import FigmaSection from '../components/figma_plugin_ds/section';
import SelectionCounter from '../components/selection_counter.vue';
import IssueSelector from '../components/issue_selector.vue';
import selectionQuery from '../graphql/queries/selection.query.graphql';
import currentUserQuery from '../graphql/queries/current_user.query.graphql';
import { pngFileFromData } from '../utils/gitlab_utils';
import windowEmitter from '../shared/window_message_event_bus';
import uploadDesignMutation from '../graphql/mutations/upload_design.mutation.graphql';
import { postPluginMessage } from '../utils/figma_utils';

export default {
  name: 'UploadSelection',
  components: {
    IssueSelector,
    SelectionCounter,
    FigmaButton,
    FigmaAlert,
    FigmaSection,
  },
  data() {
    return {
      selection: null,
      isUploading: false,
      issue: null,
      alertType: '',
      alertMessage: '',
      genericError: false,
    };
  },
  apollo: {
    currentUser: {
      query: currentUserQuery,
    },
    selection: {
      query: selectionQuery,
    },
  },
  computed: {
    selectedFrames() {
      return (this.selection && this.selection.frames) || [];
    },
    selectedComponents() {
      return (this.selection && this.selection.components) || [];
    },
    hasSelection() {
      return [...this.selectedFrames, ...this.selectedComponents].length > 0;
    },
  },
  mounted() {
    windowEmitter.on(FIGMA_MESSAGE_TYPES.EXPORT_SELECTION, ({ selections }) => {
      this.uploadSelection(selections);
    });
  },
  methods: {
    clearAlert() {
      this.alertMessage = '';
      this.genericError = false;
    },
    alertSuccess(message) {
      this.alertType = 'success';
      this.alertMessage = message;
    },
    alertWarning(message) {
      this.alertType = 'warning';
      this.alertMessage = message;
    },
    alertDanger(message) {
      this.alertType = 'danger';
      this.alertMessage = message;
    },
    onExport() {
      this.isUploading = true;
      this.clearAlert();

      postPluginMessage(FIGMA_MESSAGE_TYPES.EXPORT_SELECTION);
    },
    /**
     * Validates a selection prior to upload.
     *
     * Examples of invalid selection:
     * - Objects have the same name
     */
 
     
    uploadSelection(selections) {
      console.log('selections format is', selections)
      if (!this.isValidSelection(selections)) {
        this.isUploading = false;
        return this.alertDanger(`Upload failed: designs must have unique names.`);
      }

      const { projectPath, iid } = this.issue;
      const files = selections.map(({ data, name }) => pngFileFromData(data, name));

      return this.$apollo
        .mutate({
          mutation: uploadDesignMutation,
          variables: {
            files,
            projectPath,
            iid,
          },
          context: {
            hasUpload: true,
          },
        })
        .then(res => {
          if (!(res && res.data)) {
            throw new Error();
          }

          const { errors, skippedDesigns } = res.data.designManagementUpload;
          if (errors.length) {
            console.error(errors);
            return this.alertDanger(`Upload failed: ${errors[0]}`);
          }
          if (skippedDesigns.length) {
            return this.alertWarning('Some designs did not change since the last version.');
          }

          postPluginMessage(FIGMA_MESSAGE_TYPES.NOTIFY, {
            message: 'Your designs were successfully uploaded to GitLab.',
          });
        })
        .catch(error => {
          console.error(error);
          this.genericError = true;
        })
        .finally(() => {
          this.isUploading = false;
        });
    },
  },
};
</script>

<template>
  <main class="h-100 d-flex flex-column">
    <figma-section class="border-bottom-silver">
      <figma-alert
        v-if="!isUploading && alertMessage"
        class="mb-xsmall"
        :variant="alertType || 'danger'"
        @dismiss="alertMessage = null"
        >{{ alertMessage }}</figma-alert
      >
      <figma-alert
        v-if="!isUploading && genericError"
        class="mb-xsmall"
        variant="danger"
        @dismiss="genericError = false"
      >
        Upload failed. Ensure that your
        <a
          href="https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/wikis/home#generating-a-gitlab-personal-access-token"
          target="_blank"
          >access token is valid</a
        >
        and the GitLab project
        <a
          href="https://docs.gitlab.com/ee/user/project/issues/design_management#requirements"
          target="_blank"
          >meets the requirements</a
        >.
      </figma-alert>

      <div class="text-xlarge line-height-small">
        Select an issue
      </div>
    </figma-section>

    <issue-selector class="flex-grow overflow-auto" @select="issue = $event"></issue-selector>

    <figma-section
      class="d-flex justify-content-between align-items-center w-100 border-top-silver bg-white"
    >
      <selection-counter
        :frame-count="selectedFrames.length"
        :component-count="selectedComponents.length"
      />
      <figma-button :loading="isUploading" :disabled="!hasSelection || !issue" @click="onExport">{{
        isUploading ? 'Uploading' : 'Upload'
      }}</figma-button>
    </figma-section>
  </main>
</template>
