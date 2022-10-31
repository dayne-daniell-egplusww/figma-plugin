<script>
import FigmaIcon from './figma_plugin_ds/icon';

export default {
  components: {
    FigmaIcon,
  },
  props: {
    issue: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    isClosed() {
      return this.issue.state === 'closed';
    },
  },
};
</script>
<template>
  <li
    :id="`issue_${issue.iid}`"
    class="pl-large pr-xxsmall pt-xxsmall pb-xxsmall hover-bg-selection-b cursor-pointer list-style-none position-relative"
    :class="{ 'bg-selection-b': selected }"
    @click="$emit('click', $event)"
  >
    <div
      v-if="selected"
      class="d-flex align-items-center justify-content-center h-100 ml-xxsmall position-absolute issue__selected-icon"
    >
      <figma-icon icon="check" class="icon--black8"> </figma-icon>
    </div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <div>
          <span>
            <a
              class="text-black8 hover-text-black8 text-large font-weight-bold mb-xxxsmall inline-block line-height-small"
              target="_blank"
              :href="issue.webUrl"
              >{{ issue.title }}</a
            >
          </span>
        </div>

        <div class="font-weight-normal text-black6 text-small">
          <span class="issue-reference-path">{{ issue.fullReference }}</span>
        </div>
      </div>

      <div>
        <span v-if="isClosed" class="ml-xxsmall text-large line-height-small">CLOSED</span>
      </div>
    </div>
  </li>
</template>
<style lang="scss">
.issue__selected-icon {
  top: 0;
  left: 0;
}
</style>
