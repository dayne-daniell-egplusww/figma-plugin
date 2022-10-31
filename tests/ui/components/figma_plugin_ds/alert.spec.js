import { shallowMount } from '@vue/test-utils';
import FigmaAlert from '~/ui/components/figma_plugin_ds/alert.vue';

describe('Figma alert component', () => {
  let wrapper;
  const findDismissButton = () => wrapper.find('.icon-button');

  function createComponent({ propsData = {} } = {}) {
    wrapper = shallowMount(FigmaAlert, {
      propsData,
    });
  }

  describe('renders', () => {
    it('default component', () => {
      createComponent();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it.each`
      variant
      ${'danger'}
      ${'warning'}
      ${'info'}
      ${'success'}
    `('component with $variant variant class', ({ variant }) => {
      createComponent({ propsData: { variant } });

      expect(wrapper.classes()).toContain(`alert--${variant}`);
    });

    it('emits dismiss event when button clicked', () => {
      createComponent();
      findDismissButton().trigger('click');

      return wrapper.vm.$nextTick().then(() => {
        expect(wrapper.emitted().dismiss).toBeTruthy();
      });
    });
  });
});
