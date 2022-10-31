import { shallowMount } from '@vue/test-utils';
import Issue from '~/ui/components/issue';
import FigmaIcon from '~/ui/components/figma_plugin_ds/icon';
import mockIssue from '../mock_data/issue';

describe('Issue component', () => {
  let wrapper;

  function createComponent({ issue = mockIssue, selected } = {}) {
    wrapper = shallowMount(Issue, {
      propsData: {
        issue,
        selected,
      },
    });
  }

  it('renders the component', () => {
    createComponent();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('emits click event when clicked', () => {
    createComponent();
    wrapper.trigger('click');
    expect(wrapper.emitted().click).toBeTruthy();
  });

  describe('with a closed issue', () => {
    const closedIssue = {
      ...mockIssue,
      state: 'closed',
    };

    it('renders indication that the issue is closed', () => {
      createComponent({ issue: closedIssue });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('when selected', () => {
    beforeEach(() => {
      createComponent({ selected: true });
    });
    it('adds background color', () => {
      expect(wrapper.classes()).toContain('bg-selection-b');
    });
    it('renders check icon', () => {
      const icon = wrapper.findComponent(FigmaIcon);
      expect(icon.exists()).toBe(true);
      expect(icon.props('icon')).toBe('check');
    });
  });
});
