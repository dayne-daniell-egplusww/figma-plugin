<script>
import { FIGMA_MESSAGE_TYPES } from '~/shared/constants';
import FigmaInput from '../components/figma_plugin_ds/input';
import FigmaLabel from '../components/figma_plugin_ds/label';
import FigmaButton from '../components/figma_plugin_ds/button';
import FigmaAlert from '../components/figma_plugin_ds/alert';
import FigmaSection from '../components/figma_plugin_ds/section';
import FigmaCheckbox from '../components/figma_plugin_ds/checkbox';
import selectionQuery from '../graphql/queries/selection.query.graphql';
import EmptyIssueIllustration from '../assets/illustrations/issues.svg';
import setUserConfigMutation from '../graphql/mutations/set_user_config.mutation.graphql';
import currentUserQuery from '../graphql/queries/current_user.query.graphql';
import windowEmitter from '../shared/window_message_event_bus';
import { isHostGitlabCom, GITLAB_COM_HOST } from '../utils/gitlab_utils';
import { postPluginMessage } from '../utils/figma_utils';
import { get } from 'http';

export default {
  name: 'ProcessFiles',
  components: {
    FigmaInput,
    FigmaLabel,
    FigmaButton,
    FigmaAlert,
    FigmaSection,
    FigmaCheckbox,
    EmptyIssueIllustration
  },
  data() {
    return {
      laVida: {
        accessToken: '',
        processing: { host: '' },
      },
      selection: null,
      presentation: null,
      isUploading: false,
      afterInitialLoad: false,
      issue: null,
      alertType: '',
      alertMessage: '',
      errorMessage: '',
      genericError: false,
    };
  },
  apollo: {
    selection: {
      query: selectionQuery,
    },
  },
  computed: {
    isLoading() {
      return this.$apollo.queries.currentUser.loading;
    },
  },
  mounted() {

    /* this listener is tied to the process function
     * when the process button is pressed, the pub/sub function fires off on the figma side
     * when the figma side is done processing, it publishes the PROCESS_SELECTION message with the data
     * so the UI side can post the data in the API call
    */
    windowEmitter.on(FIGMA_MESSAGE_TYPES.PROCESS_SELECTION, (data) => {
      console.log('data.selections in process_files.vue are',data.selections);
      console.log('currentPresentation in process_files.vue is',data.currentPresentation)
      this.processSelectionForUpload(data.currentNodes, data.currentPresentation, data.selections, data.payloadSlides);

    });

    windowEmitter.on(FIGMA_MESSAGE_TYPES.WARNING_MESSAGE, ({ message }) => {
      this.isUploading = false;
      this.alertWarning(message);
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
    onInitialLoad() {
      // we have "intially loaded"
        this.afterInitialLoad = true;
        this.isLoading = false;
      
    },
    isValidSelection(selections) {
      const objectNames = selections.map(({ name }) => name);

      // ensure all objects have unique names
      return new Set(objectNames).size === objectNames.length;
    },

    /**
     * apiCall
     * @param {*} datum 
     * this is the function that does the post of packaged data to the server for further processing
     */

    apiCall(datum)  {
      // before the apiCall (or the gitlab call), the data needs processed. 
      const payload = datum;

      console.log('payload is', payload)

      const size = new TextEncoder().encode(JSON.stringify(payload, null, -1)).length;
      const kiloBytes = size / 1024;
      const megaBytes = kiloBytes / 1024;
      console.log('payload size (mb): ', megaBytes);

      const stagingURL = `http://localhost:1065`; // /${payload.slides[0].detailNameSlug}`
      const config = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ payload: payload }, null, -1),
      }

      const response =  fetch('http://localhost:1065/api/', config);
      const data =  JSON.stringify(response);
      this.isUploading = false;
      console.log('fetch done! ', data);

    },

    /**
     * uploadSelection
     * @param {} selections
     *  
     */
    async processSelectionForUpload(currentNodes, currentPresentation, selections, payloadSlides){

      console.log('process selection for upload called');

      if (!this.isValidSelection(selections)) {
        return this.alertDanger(`Upload failed: designs must have unique names.`);
      } else {
        if(!selections){
          return this.alertWarning('No Frames were selected for processing');
        } else {
          console.log('call the processing function here')
          
          this.apiCall(payloadSlides)
        }
      }
    },

    onProcess() {
      this.isUploading = true;
      this.clearAlert();
      postPluginMessage(FIGMA_MESSAGE_TYPES.PROCESS_SELECTION);
    },
  },
};
</script>

<template>
  <main class="h-100 d-flex flex-column">
    <!-- Splash screen -->
    <div v-if="!afterInitialLoad" class="h-100 d-flex align-items-center justify-content-center">
      <figma-section>
        <fieldset>
    <!--  <figma-label class="w-75">Staging/Processing Host URL:</figma-label>
      <figma-input
              id="processing_host"
              v-model="laVida.processing.host"
              placeholder="gitlab.mycompany.com"
              type="text"
            ></figma-input> -->
          </fieldset>

            <figma-button  @click="onProcess" class="mt-2"> {{
        isUploading ? 'Processing' : 'Process'
      }}</figma-button>
</figma-section>
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

      </figma-section>
    </template>
  </main>
</template>
