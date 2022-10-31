import { shallowMount } from '@vue/test-utils';
import IssueSelector from '~/ui/components/issue_selector';
import Issue from '~/ui/components/issue';
import mockIssue from '../mock_data/issue';
import mockAssignedIssues from '../mock_data/assigned_issues';
import waitForPromises from '../../helpers/wait_for_promises';

jest.mock('lodash/debounce', () => jest.fn(fn => fn));

describe('Issue selector component', () => {
  let wrapper;

  function createComponent({ issue = mockIssue, rawSearchInput, $apollo, stubs } = {}) {
    wrapper = shallowMount(IssueSelector, {
      data() {
        return {
          rawSearchInput,
          assignedIssues: mockAssignedIssues,
        };
      },
      propsData: {
        issue,
      },
      mocks: {
        $apollo: $apollo || {
          query: jest.fn().mockResolvedValue({ data: { project: { id: 1234, issue: mockIssue } } }),
          queries: {
            assignedIssues: { loading: false },
          },
        },
      },
      stubs,
    });
  }

  describe('with no search text', () => {
    it('renders the empty state', () => {
      createComponent();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('with search text', () => {
    describe('with plain text', () => {
      beforeEach(async () => {
        createComponent();
        return await wrapper.setData({ rawSearchInput: '222' });
      });
      it('renders correctly filtered list of issues', () => {
        expect(wrapper.findAllComponents(Issue)).toHaveLength(2);
      });
    });

    describe('with an issue URL', () => {
      describe('with valid issue URL', () => {
        beforeEach(async () => {
          createComponent();
          return await wrapper.setData({ rawSearchInput: mockIssue.webUrl });
        });

        it('emits @select event on successful search', () => {
          return waitForPromises().then(() => {
            expect(wrapper.emitted().select).toBeTruthy();
            expect(wrapper.emitted().select.length).toBe(2);
            expect(wrapper.emitted().select[0]).toEqual([undefined]);
            expect(wrapper.emitted().select[1]).toEqual([
              {
                state: 'open',
                projectPath: 'gitlab-org/gitlab',
                iid: '54321',
                webUrl: 'https://gitlab.com/gitlab-org/gitlab/-/issues/12345',
                title: 'Merge requests requiring attention',
                fullReference: 'gitlab-org/gitlab#12345',
                projectId: 1234,
              },
            ]);
            expect(wrapper.findAllComponents(Issue)).toHaveLength(1);
          });
        });
      });

      describe('with invalid issue URL', () => {
        describe('when URL is not a valid GitLab Issue URL', () => {
          it('does not execute a search', () => {
            const mockOnSearch = jest.fn();
            createComponent({
              methods: {
                onSearch: mockOnSearch,
              },
            });

            wrapper.setData({
              rawSearchInput: 'https://example.com/issue/1',
            });

            return wrapper.vm.$nextTick().then(() => {
              expect(mockOnSearch).not.toHaveBeenCalled();
            });
          });
        });

        describe('when GitLab issue cannot be found', () => {
          it('displays warning to the user', () => {
            createComponent({
              $apollo: {
                query: jest.fn().mockResolvedValue(), // mock 'issue not found' scenario
                queries: {
                  assignedIssues: { loading: false },
                },
              },
            });

            wrapper.setData({
              rawSearchInput: mockIssue.webUrl + 'asd',
            });

            return waitForPromises().then(() => {
              expect(wrapper.vm.inputValidaton.issueUrlError).toBe(true); // TODO we should check the DOM
            });
          });
        });
      });
    });
  });

  it('emits @select event when clicking an issue', async () => {
    createComponent({
      stubs: {
        issue: Issue,
      },
    });

    const issue = wrapper.findAllComponents(Issue).at(0);
    await issue.trigger('click');

    expect(wrapper.emitted().select).toBeTruthy();
    expect(wrapper.emitted().select.length).toBe(1);
    expect(wrapper.emitted().select[0]).toEqual([{ ...mockAssignedIssues[0] }]);
  });
});
