<template>
  <div class="d-flex text-xsmall">
    <span
      class="d-flex align-items-center justify-content-center mr-xsmall"
      :class="{ 'text-black3': frameCount === 0 }"
    >
      <figma-icon icon="frame" :class="{ 'icon--black3': frameCount === 0 }"></figma-icon>
      <span>{{ frameCount }} {{ frameCount === 1 ? 'frame' : 'frames' }}</span>
    </span>
    <span
      class="d-flex align-items-center justify-content-center"
      :class="{ 'text-black3': componentCount === 0 }"
    >
      <figma-icon icon="component" :class="{ 'icon--black3': componentCount === 0 }"></figma-icon>
      <span>{{ componentCount }} {{ componentCount === 1 ? 'component' : 'components' }}</span>
    </span>
  </div>
</template>

<script>
import FigmaIcon from './figma_plugin_ds/icon';

export default {
  name: 'SelectionCounter',
  components: {
    FigmaIcon,
  },
  props: {
    frameCount: {
      type: Number,
      required: false,
      default: 0,
    },
    componentCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
};
</script>
