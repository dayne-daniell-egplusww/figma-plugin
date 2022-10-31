<script>
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false,
    },
    label: {
      type: String,
      required: false,
      default: null,
    },
  },
};
</script>
<template>
  <div class="checkbox">
    <input
      type="checkbox"
      class="checkbox__box"
      v-bind="$attrs"
      :checked="value"
      @change="$emit('input', $event.target.checked)"
    />
    <label v-if="label" :for="$attrs.id" class="checkbox__label">{{ label }}</label>
  </div>
</template>
<style lang="scss" scoped>
.checkbox__label {
  margin: 0;
  &:before {
    margin-top: 1px;
    margin-left: -34px;
    margin-right: 10px;
    width: 13px;
    height: 13px;
  }
}
</style>
