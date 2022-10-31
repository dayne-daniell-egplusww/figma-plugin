<script>
import debounce from 'lodash/debounce';
import FigmaInputSection from '../components/figma_plugin_ds/input_section';
import FigmaFormFeedback from '../components/figma_plugin_ds/form_feedback';
import FigmaLoadingIcon from '../components/figma_plugin_ds/loading_icon';
import FigmaSection from '../components/figma_plugin_ds/section';
import Project from './project';
import projectQuery from '../graphql/queries/project.query.graphql';
import assignedProjectsQuery from '../graphql/queries/assigned_projects.query.graphql';
import { parseProjectUrl, toProject } from '../utils/gitlab_utils';

export default {
  components: {
    Project,
    FigmaInputSection,
    FigmaFormFeedback,
    FigmaLoadingIcon,
    FigmaSection,
  },
  data() {
    return {
      loading: {
        singularProject: false,
      },
      inputValidation: {
        isValidProjectUrl: false,
        projectUrlError: false,
      },
      rawSearchInput: '',
      filterText: '',
      selectedProject: undefined,
      singularProject: undefined,
    };
  },
  apollo: {
    assignedProjects: {
      query: assignedProjectsQuery,
    },
  },
  computed: {
    isLoading() {
      return this.loading.singularProject || this.$apollo.queries.assignedProjects.loading;
    },
    invalidFormFeedbackMessage() {
      let message;

      const { isValidProjectUrl, projectUrlError } = this.inputValidation;
      if (isValidProjectUrl && projectUrlError) {
        message = 'Project does not exist';
      }

      return message;
    },
    isValidInput() {
      return Boolean(!this.invalidFormFeedbackMessage);
    },
    projects() {
      // if we have fetched a specific issue, then show _only_ this issue in the list
      if (this.singularProject) {
        return [this.singularProject];
      } else if (this.filterText) {
        // Only try to filter the list if we have filter text
        return this.assignedProjects.filter(project => {
          const searchable = `${project.name}${projectId}`.toLowerCase();
          return searchable.includes(this.filterText);
        });
      }
      return this.assignedProjects;
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
    onProjectSelect(project) {
      this.selectedProject = project;
      this.$emit('select', project);
    },
    deselectProject() {
      this.onProjectSelect(undefined);
    },
    fetchProject({ projectPath, id }) {
      return this.$apollo
        .query({
          query: projectQuery,
          variables: {
            fullPath: projectPath,
            id,
          },
        })
        .then(res => {
          const { project } = res.data;
          if (!project) return;

          return toProject(project, {
            projectId: project.id,
          });
        });
    },
    findProject(projectPath, projectId) {
      this.loading.singularProject = true;
      this.inputValidation.projectUrlError = false;

      this.fetchProject({ projectPath, id: projectId })
        .then(project => {
          if (!project) {
            throw new Error();
          }

          this.singularProject = project;
          // select the issue on behalf of the user
          this.onProjectSelect(project);
        })
        .catch(err => {
          console.error(err);
          this.inputValidation.projectUrlError = true;
        })
        .finally(() => {
          this.loading.singularProject = false;
        });
    },
    onSearch() {
      this.deselectProject();
      // clear the singular issue
      this.singularProject = undefined;

      const { projectPath, projectId } = parseProjectUrl(this.rawSearchInput);
      // if we get a (potentially) valid GitLab URL, try to find it
      if (projectPath && projectId) {
        this.inputValidation.isValidProjectUrl = true;
        this.filterText = '';
        this.findProject(projectPath, projectId);
      } else {
        // else, filter the list of assigned issues
        this.inputValidation.isValidProjectUrl = false;
        this.filterText = this.rawSearchInput;
      }
    },
  },
};

</script>

<template>
  <div>
    <figma-input-section
      id="project_url_input"
      v-model="rawSearchInput"
      icon="search"
      type="text"
      placeholder="Filter by project number, title, or paste a project URL"
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
      <project
        v-for="project in projects"
        v-show="!isLoading && isValidInput"
        :key="`${project.projectId}-${project.projectId}`"
        class="border-bottom-grey"
        :project="project"
        :selected="project === selectedProject"
        @click="onProjectSelect(project)"
      ></project>
    </ul>
  </div>
</template>
