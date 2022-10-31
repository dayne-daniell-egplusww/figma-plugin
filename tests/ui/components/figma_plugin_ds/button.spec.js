import { shallowMount } from '@vue/test-utils';
import FigmaButton from '~/ui/components/figma_plugin_ds/button.vue';
import FigmaLoadingIcon from '~/ui/components/figma_plugin_ds/loading_icon.vue';

describe('Figma button component', () => {
  let wrapper;
  function createComponent({ propsData = {} } = {}) {
    wrapper = shallowMount(FigmaButton, {
      propsData,
      slots: {
        default: 'test',
      },
    });
  }

  describe('renders', () => {
    it('default component', () => {
      createComponent();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('component with props', () => {
      createComponent({ propsData: { type: 'submit' } });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it.each`
      variant
      ${'primary'}
      ${'secondary'}
      ${'tertiary'}
    `('component with $variant variant class', ({ variant }) => {
      createComponent({ propsData: { variant } });

      expect(wrapper.classes()).toContain(`button--${variant}`);
    });
  });

  it('emits click event when clicked', () => {
    createComponent();
    wrapper.trigger('click');

    return wrapper.vm.$nextTick().then(() => {
      expect(wrapper.emitted().click).toBeTruthy();
    });
  });

  describe('when prop [loading] is true', () => {
    it('displays loading spinner', () => {
      createComponent({ propsData: { loading: true } });
      expect(wrapper.findComponent(FigmaLoadingIcon).exists()).toBe(true);
    });
  });
});
