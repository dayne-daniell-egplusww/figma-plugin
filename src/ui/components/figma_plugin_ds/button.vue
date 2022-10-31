<script>
import FigmaLoadingIcon from './loading_icon';

/**
 * https://github.com/thomas-lowry/figma-plugin-ds#button
 */
const MODIFIERS = {
  primary: 'button--primary',
  secondary: 'button--secondary',
  tertiary: 'button--tertiary',
};

const DEFAULT_VARIANT = 'primary';

export default {
  components: {
    FigmaLoadingIcon,
  },
  props: {
    variant: {
      type: String,
      required: false,
      default: DEFAULT_VARIANT,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    modifierClass() {
      return MODIFIERS[this.variant];
    },
  },
};
</script>
<template>
  <button class="button" :class="modifierClass" @click="$emit('click', $event)">
    <slot></slot>
    <figma-loading-icon v-if="loading" class="ml-1"></figma-loading-icon>
  </button>
</template>
<style lang="scss" scoped>
.button:focus {
  outline: none;
}
</style>
