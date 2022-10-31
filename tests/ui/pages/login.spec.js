import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueApollo from 'vue-apollo';
import { createMockClient } from 'mock-apollo-client';
import Login from '~/ui/pages/login.vue';
import FigmaAlert from '~/ui/components/figma_plugin_ds/alert.vue';
import currentUserQuery from '~/ui/graphql/queries/current_user.query.graphql';
import typeDefs from '~/ui/graphql/typedefs.graphql';
import { FIGMA_MESSAGE_TYPES } from '~/shared/constants';

const currentUserMock = {
  name: 'Waylon Smithers',
  username: 'wsmithers',
  id: 123,
};

const currentUserMockResponse = {
  data: {
    currentUser: {
      __typename: 'User',
      ...currentUserMock,
    },
  },
};

const localVue = createLocalVue();
localVue.use(VueApollo);

describe('Login page', () => {
  let wrapper;
  let mockClient;
  let apolloProvider;
  let requestHandlers;
  let $router;

  function createComponent({ data = {} } = {}, apolloHandlers) {
    requestHandlers = {
      currentUserQuery: jest.fn().mockResolvedValue(currentUserMockResponse),
      ...apolloHandlers,
    };

    mockClient = createMockClient({ typeDefs });
    mockClient.setRequestHandler(currentUserQuery, requestHandlers.currentUserQuery);

    apolloProvider = new VueApollo({
      defaultClient: mockClient,
    });

    $router = {
      push: jest.fn(),
    };

    wrapper = shallowMount(Login, {
      localVue,
      apolloProvider,
      data() {
        return {
          ...data,
        };
      },
      stubs: {
        'empty-issue-illustration': true,
        'gitlab-logo': true,
      },
      mocks: {
        $router,
      },
    });
  }

  describe('on initial load', () => {
    beforeEach(() => {
      createComponent();
    });

    it('renders splash screen', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('after initial load', () => {
    const mockInitialLoadState = { afterInitialLoad: true };

    it('renders login page', async () => {
      createComponent({ data: { ...mockInitialLoadState } });
      await wrapper.vm.$nextTick();

      expect(wrapper.html()).toMatchSnapshot();
    });

    describe('when access token is invalid', () => {
      beforeEach(async () => {
        createComponent(
          { data: { ...mockInitialLoadState } },
          {
            currentUserQuery: jest.fn().mockRejectedValue(),
          },
        );

        await wrapper.vm.$nextTick();
      });

      it('renders error message', () => {
        expect(wrapper.findComponent(FigmaAlert).exists()).toBe(true);
      });
    });

    describe('when access token is valid', () => {
      const postMessageSpy = jest.fn();

      beforeEach(async () => {
        window.parent.postMessage = postMessageSpy;

        createComponent({
          data: {
            ...mockInitialLoadState,
            userConfig: { accessToken: '123abc', gitlabInstance: { host: 'mygitlab.com' } },
          },
        });
        await wrapper.vm.$nextTick();
      });

      afterEach(() => {
        postMessageSpy.mockClear();
      });

      it('navigates to UploadSelection page', () => {
        expect($router.push).toHaveBeenCalledTimes(1);
        expect($router.push).toHaveBeenCalledWith({ name: 'UploadSelection' });
      });

      it('requests Figma to store access token', () => {
        expect(postMessageSpy).toHaveBeenCalledTimes(1);
        expect(postMessageSpy).toHaveBeenCalledWith(
          {
            pluginMessage: {
              data: { accessToken: '123abc', gitlabInstance: { host: 'mygitlab.com' } },
              type: FIGMA_MESSAGE_TYPES.SET_USER_CONFIG,
            },
          },
          '*',
        );
      });
    });
  });
});
