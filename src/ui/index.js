import Vue from 'vue';
import VueApollo from 'vue-apollo';
import './assets/styles/app.scss';
import { createDefaultClient } from './graphql/apollo_client';
import router from './router';
import setSelectionMutation from './graphql/mutations/set_selection.mutation.graphql';
import { FIGMA_MESSAGE_TYPES } from '~/shared/constants';
import windowEmitter from './shared/window_message_event_bus';


Vue.config.productionTip = false;
Vue.use(VueApollo);

const defaultClient = createDefaultClient();
const apolloProvider = new VueApollo({
  defaultClient,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  apolloProvider,
  router,
});

/**
 * Handle onmessage events from Figma
 */
window.onmessage = event => {
  const { pluginMessage } = event.data;

  // emit all the events to the event bus
  windowEmitter.emit(pluginMessage.type, pluginMessage.data);

    // handle _some_ events here
    switch (pluginMessage.type) {
      case FIGMA_MESSAGE_TYPES.UPDATE_SELECTION: {
        const { frames, components } = pluginMessage.data.selection;
        defaultClient.mutate({
          mutation: setSelectionMutation,
          variables: {
            frames,
            components,
          },
        });
        break;
      }

      default:
        break;
    }
};
