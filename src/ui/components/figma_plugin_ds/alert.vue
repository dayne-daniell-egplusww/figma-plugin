<script>
const MODIFIERS = {
  danger: 'alert--danger',
  warning: 'alert--warning',
  info: 'alert--info',
  success: 'alert--success',
};

const DEFAULT_VARIANT = 'info';

export default {
  props: {
    variant: {
      type: String,
      required: false,
      default: DEFAULT_VARIANT,
    },
  },
  computed: {
    modifierClass() {
      return MODIFIERS[this.variant] || MODIFIERS[DEFAULT_VARIANT];
    },
  },
};
</script>
<template>
  <div
    class="d-flex align-items-center w-100 p-xxsmall pl-xsmall text-xsmall alert"
    :class="modifierClass"
  >
    <div class="flex-grow-1">
      <slot></slot>
    </div>

    <div class="icon-button cursor-pointer" @click="$emit('dismiss', $event)">
      <div class="icon icon--close cursor-pointer"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.alert {
  border-radius: var(--border-radius-med);
  color: var(--black8-opaque);

  &--danger {
    background-color: #fcf1ef;
  }
  &--warning {
    background-color: #fdf1dd;
  }
  &--info {
    background-color: #e9f3fc;
  }
  &--success {
    background-color: #ecf4ee;
  }
}
</style>
