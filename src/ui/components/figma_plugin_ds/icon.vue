<script>
// specify explicitly so we can purge unused icon classes3
const FIGMA_ICON_CLASSES = {
  search: 'icon--search',
  component: 'icon--component',
  frame: 'icon--frame',
  check: 'icon--check',
};

export default {
  props: {
    icon: {
      type: String,
      required: false,
      default: null,
    },
  },
  computed: {
    iconClass() {
      return FIGMA_ICON_CLASSES[this.icon];
    },
  },
};
</script>
<template>
  <div class="icon" :class="iconClass"></div>
</template>
