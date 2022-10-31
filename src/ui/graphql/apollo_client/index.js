import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import resolvers from './resolvers';
import { getUserConfigFromCache } from './utils';
import { graphqlApiUri } from '../../utils/gitlab_utils';
import typeDefs from '../typedefs.graphql';

const createCache = () => {
  const cache = new InMemoryCache();

  // set initial cache state
  cache.writeData({
    data: {
      selection: null,
      userConfig: null,
      currentUser: null,
    },
  });

  return cache;
};

export function createDefaultClient() {
  const cache = createCache();
  const authLink = setContext((_, { headers }) => {
    const { accessToken, gitlabInstance } = getUserConfigFromCache(cache);

    return {
      uri: graphqlApiUri(gitlabInstance.host),
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  });

  return new ApolloClient({
    typeDefs,
    resolvers,
    cache,
    link: authLink.concat(createUploadLink()),
  });
}
