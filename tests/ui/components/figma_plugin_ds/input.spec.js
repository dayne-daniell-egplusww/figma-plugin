import { shallowMount } from '@vue/test-utils';
import FigmaInput from '~/ui/components/figma_plugin_ds/input.vue';
import FigmaIcon from '~/ui/components/figma_plugin_ds/icon';

describe('Figma input component', () => {
  let wrapper;
  const findInput = () => wrapper.find('input');

  function createComponent({ propsData = {} } = {}) {
    wrapper = shallowMount(FigmaInput, {
      propsData,
    });
  }

  describe('renders', () => {
    it('default component', () => {
      createComponent();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('component with props', () => {
      createComponent({ propsData: { type: 'password', placeholder: 'Test placeholder' } });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('emits event when value changes', () => {
      createComponent();
      const inputElem = findInput();
      inputElem.element.value = 'test';
      inputElem.trigger('input');

      return wrapper.vm.$nextTick().then(() => {
        expect(wrapper.emitted().input[0]).toEqual(['test']);
      });
    });

    describe('when :state is false', () => {
      it('should have invalid class', () => {
        createComponent({ propsData: { state: false } });

        expect(wrapper.classes()).toContain(`input--invalid`);
      });
    });

    describe('with icon', () => {
      it('renders icon', () => {
        createComponent({ propsData: { icon: 'search' } });

        expect(wrapper.findComponent(FigmaIcon).exists()).toBe(true);
      });
    });
  });
});
