import Vue from 'vue';
import VueRouter from 'vue-router';
import { FIGMA_MESSAGE_TYPES, DEFAULT_WINDOW_SIZE } from '~/shared/constants';
import Login from './pages/login.vue';
import UploadSelection from './pages/upload_selection.vue';
import ProcessFiles from './pages/process_files.vue';
import { postPluginMessage } from './utils/figma_utils';

Vue.use(VueRouter);

const routes = [
  /*{
    name: 'Login',
    path: '/',
    component: Login,
    beforeEnter: (to, from, next) => {
      // don't resize if this is the first page we see
      if (from.path === '/') return next();

      postPluginMessage(FIGMA_MESSAGE_TYPES.RESIZE, {
        ...DEFAULT_WINDOW_SIZE,
      });

      next();
    },
  }, */
  {
    name: 'UploadSelection',
    path: '/upload',
    component: UploadSelection,
    beforeEnter: (to, from, next) => {
      // TODO currently commented out, but
      // eventually, we will use this (when we present issue list)
      // window.parent.postMessage(
      //   {
      //     pluginMessage: {
      //       type: FIGMA_MESSAGE_TYPES.RESIZE,
      //       data: {
      //         width: 380,
      //         height: 540,
      //       },
      //     },
      //   },
      //   '*',
      // );

      next();
    },
  },
  {
    name: 'ProcessFiles',
    path: '/',
    component: ProcessFiles,
    beforeEnter: (to, from, next) => {
      // TODO currently commented out, but
      // eventually, we will use this (when we present issue list)
      // window.parent.postMessage(
      //   {
      //     pluginMessage: {
      //       type: FIGMA_MESSAGE_TYPES.RESIZE,
      //       data: {
      //         width: 380,
      //         height: 540,
      //       },
      //     },
      //   },
      //   '*',
      // );

      next();
    },
  },
];
const router = new VueRouter({
  routes,
});

export default router;
