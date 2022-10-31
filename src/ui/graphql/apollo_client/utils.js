import userConfigQuery from '../queries/user_config.query.graphql';

export const getUserConfigFromCache = cache => {
  const { userConfig } = cache.readQuery({ query: userConfigQuery }) || {};
  return userConfig || {};
};
