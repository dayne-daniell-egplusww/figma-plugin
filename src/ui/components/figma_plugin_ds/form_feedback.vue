<script>
const MODIFIERS = {
  invalid: 'form__feedback--invalid',
  default: 'form__feedback--default',
};

const DEFAULT_VARIANT = 'default';

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
      return MODIFIERS[this.variant];
    },
  },
};
</script>

<template>
  <div class="form__feedback text-small" :class="modifierClass">
    <slot> </slot>
  </div>
</template>
<style lang="scss" scoped>
.form__feedback {
  &--invalid {
    color: var(--red);
  }
  &--default {
    color: var(--black3);
  }
}
</style>
