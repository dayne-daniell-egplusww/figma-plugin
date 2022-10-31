<script>
import FigmaInput from './input';
export default {
  components: {
    FigmaInput,
  },
  inheritAttrs: false,
};
</script>
<template>
  <div class="p-xxsmall">
    <figma-input class="input--no-border" v-bind="$attrs" @input="$emit('input', $event)" />
  </div>
</template>
