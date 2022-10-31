import { shallowMount } from '@vue/test-utils';
import FigmaButton from '~/ui/components/figma_plugin_ds/button';
import FigmaAlert from '~/ui/components/figma_plugin_ds/alert';
import UploadSelection from '~/ui/pages/upload_selection.vue';
import mockIssue from '../mock_data/issue';
import { FIGMA_MESSAGE_TYPES } from '~/shared/constants';
import uploadDesignMutation from '~/ui/graphql/mutations/upload_design.mutation.graphql';

describe('Upload Selection page', () => {
  let wrapper;
  const mutate = jest.fn().mockResolvedValue();
  const $apollo = {
    mutate,
  };

  const findExportButton = () => wrapper.findComponent(FigmaButton);

  function createComponent({ selection, issue } = {}) {
    wrapper = shallowMount(UploadSelection, {
      data() {
        return {
          selection,
          issue,
        };
      },
      mocks: {
        $apollo,
      },
    });
  }

  describe('with no selection', () => {
    it('disables export button', () => {
      createComponent();
      expect(findExportButton().attributes('disabled')).toBe('true');
    });
  });

  describe('with a selection and an issue', () => {
    const mockSelection = {
      frames: ['1'],
    };

    it('enables export button', () => {
      createComponent({
        selection: mockSelection,
        issue: mockIssue,
      });

      expect(findExportButton().attributes('disabled')).toBe(undefined);
    });

    it('requests export data from Figma when export button clicked', () => {
      createComponent({
        selection: mockSelection,
        issue: mockIssue,
      });
      const postMessageSpy = jest.fn();
      window.parent.postMessage = postMessageSpy;

      const button = findExportButton();
      button.vm.$emit('click');

      expect(postMessageSpy).toHaveBeenCalledTimes(1);
      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          pluginMessage: {
            type: FIGMA_MESSAGE_TYPES.EXPORT_SELECTION,
          },
        },
        '*',
      );
    });

    describe('uploadSelection', () => {
      it('performs upload mutation', () => {
        createComponent({
          selection: mockSelection,
          issue: mockIssue,
        });

        wrapper.vm.uploadSelection([{ data: 't-e-s-t', name: 'testdesign' }]);
        expect(mutate).toHaveBeenCalledTimes(1);
        expect(mutate).toHaveBeenCalledWith({
          context: {
            hasUpload: true,
          },
          mutation: uploadDesignMutation,
          variables: {
            files: [new File(['t-e-s-t'], 'testdesign')],
            iid: mockIssue.iid,
            projectPath: mockIssue.projectPath,
          },
        });
      });

      describe('when designs have the same name', () => {
        it('displays error message', async () => {
          createComponent({
            selection: mockSelection,
            issue: mockIssue,
          });

          wrapper.vm.uploadSelection([
            { data: 't-e-s-t', name: 'testdesign' },
            { data: 'abcd', name: 'testdesign' },
          ]);

          await wrapper.vm.$nextTick();

          expect(wrapper.findComponent(FigmaAlert).exists()).toBe(true);
          expect(wrapper.findComponent(FigmaAlert).text()).toContain('Upload failed');
        });
      });
    });
  });
});
