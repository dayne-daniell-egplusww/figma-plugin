<script>
import FigmaIcon from './icon';
export default {
  components: {
    FigmaIcon,
  },
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      required: false,
      default: '',
    },
    state: {
      type: Boolean,
      required: false,
      default: true,
    },
    icon: {
      type: String,
      required: false,
      default: null,
    },
  },
};
</script>
<template>
  <div
    class="input"
    :class="{
      'input--invalid': !state,
      'input--with-icon': icon,
    }"
  >
    <figma-icon v-if="icon" :icon="icon"></figma-icon>
    <input
      class="input__field border-black1"
      v-bind="$attrs"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>
<style lang="scss" scoped>
.input {
  &.input--invalid {
    .input__field {
      border-color: var(--red);

      &:hover,
      &:placeholder-shown:hover {
        border-color: var(--red);
      }
    }
  }
}
.input--no-border {
  .input__field {
    border: none;
    outline: none;
  }
}
</style>
