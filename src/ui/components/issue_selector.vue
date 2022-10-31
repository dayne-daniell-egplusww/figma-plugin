<script>
import debounce from 'lodash/debounce';
import FigmaInputSection from '../components/figma_plugin_ds/input_section';
import FigmaFormFeedback from '../components/figma_plugin_ds/form_feedback';
import FigmaLoadingIcon from '../components/figma_plugin_ds/loading_icon';
import FigmaSection from '../components/figma_plugin_ds/section';
import Issue from './issue';
import issueQuery from '../graphql/queries/issue.query.graphql';
import assignedIssuesQuery from '../graphql/queries/assigned_issues.query.graphql';
import { parseIssueUrl, toIssue } from '../utils/gitlab_utils';

export default {
  components: {
    Issue,
    FigmaInputSection,
    FigmaFormFeedback,
    FigmaLoadingIcon,
    FigmaSection,
  },
  data() {
    return {
      loading: {
        singularIssue: false,
      },
      inputValidaton: {
        isValidIssueUrl: false,
        issueUrlError: false,
      },
      rawSearchInput: '',
      filterText: '',
      selectedIssue: undefined,
      singularIssue: undefined,
    };
  },
  apollo: {
    assignedIssues: {
      query: assignedIssuesQuery,
    },
  },
  computed: {
    isLoading() {
      return this.loading.singularIssue || this.$apollo.queries.assignedIssues.loading;
    },
    invalidFormFeedbackMessage() {
      let message;

      const { isValidIssueUrl, issueUrlError } = this.inputValidaton;
      if (isValidIssueUrl && issueUrlError) {
        message = 'Issue does not exist';
      }

      return message;
    },
    isValidInput() {
      return Boolean(!this.invalidFormFeedbackMessage);
    },
    issues() {
      // if we have fetched a specific issue, then show _only_ this issue in the list
      if (this.singularIssue) {
        return [this.singularIssue];
      } else if (this.filterText) {
        // Only try to filter the list if we have filter text
        return this.assignedIssues.filter(issue => {
          const searchable = `${issue.title}${issue.iid}`.toLowerCase();
          return searchable.includes(this.filterText);
        });
      }

      return this.assignedIssues;
    },
  },
  watch: {
    rawSearchInput() {
      this.search();
    },
  },
  mounted() {
    this.search = debounce(() => this.onSearch(), 200);
  },
  methods: {
    onIssueSelect(issue) {
      this.selectedIssue = issue;
      this.$emit('select', issue);
    },
    deselectIssue() {
      this.onIssueSelect(undefined);
    },
    fetchIssue({ projectPath, iid }) {
      return this.$apollo
        .query({
          query: issueQuery,
          variables: {
            fullPath: projectPath,
            iid,
          },
        })
        .then(res => {
          const { project } = res.data;
          if (!project) return;

          const { issue } = project;
          return toIssue(issue, {
            projectId: project.id,
          });
        });
    },
    findIssue(projectPath, issueId) {
      this.loading.singularIssue = true;
      this.inputValidaton.issueUrlError = false;

      this.fetchIssue({ projectPath, iid: issueId })
        .then(issue => {
          if (!issue) {
            throw new Error();
          }

          this.singularIssue = issue;
          // select the issue on behalf of the user
          this.onIssueSelect(issue);
        })
        .catch(err => {
          console.error(err);
          this.inputValidaton.issueUrlError = true;
        })
        .finally(() => {
          this.loading.singularIssue = false;
        });
    },
    onSearch() {
      this.deselectIssue();
      // clear the singular issue
      this.singularIssue = undefined;

      const { projectPath, issueId } = parseIssueUrl(this.rawSearchInput);
      // if we get a (potentially) valid GitLab URL, try to find it
      if (projectPath && issueId) {
        this.inputValidaton.isValidIssueUrl = true;
        this.filterText = '';
        this.findIssue(projectPath, issueId);
      } else {
        // else, filter the list of assigned issues
        this.inputValidaton.isValidIssueUrl = false;
        this.filterText = this.rawSearchInput;
      }
    },
  },
};
</script>

<template>
  <div>
    <figma-input-section
      id="issue_url_input"
      v-model="rawSearchInput"
      icon="search"
      type="text"
      placeholder="Filter by issue number, title, or paste an issue URL"
      required
      class="border-bottom-grey"
    ></figma-input-section>

    <figma-section v-show="!isValidInput" class="pl-large">
      <figma-form-feedback variant="invalid">{{ invalidFormFeedbackMessage }} </figma-form-feedback>
    </figma-section>

    <figma-section v-show="isLoading" class="px-3 py-2 text-xsmall">
      <figma-loading-icon></figma-loading-icon>
    </figma-section>
    <ul class="p-0 m-0">
      <issue
        v-for="issue in issues"
        v-show="!isLoading && isValidInput"
        :key="`${issue.projectId}-${issue.iid}`"
        class="border-bottom-grey"
        :issue="issue"
        :selected="issue === selectedIssue"
        @click="onIssueSelect(issue)"
      ></issue>
    </ul>
  </div>
</template>
