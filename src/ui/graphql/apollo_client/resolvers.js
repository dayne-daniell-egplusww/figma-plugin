import querystring from 'querystring';
import selectionQuery from '../queries/selection.query.graphql';
import userConfigQuery from '../queries/user_config.query.graphql';
import { toProject, restApiUri } from '../../utils/gitlab_utils';
import { getUserConfigFromCache } from './utils';

export default {
  Mutation: {
    setSelection(_, { frames, components }, { cache }) {
      cache.writeQuery({
        query: selectionQuery,
        data: { selection: { __typename: 'Selection',  frames, components } },
      });

      return {frames, components };
    },
    setUserConfig(_, { userConfig: { accessToken, gitlabInstance } }, { cache }) {
      const userConfig = {
        __typename: 'UserConfig',
        accessToken,
        gitlabInstance: {
          __typename: 'GitlabInstanceConfig',
          ...gitlabInstance,
        },
      };

      cache.writeQuery({
        query: userConfigQuery,
        data: {
          userConfig,
        },
      });

      return userConfig;
    },
  },
  Query: {
    async currentUser(_, __, { cache }) {
      const {
        accessToken,
        gitlabInstance: { host },
      } = getUserConfigFromCache(cache);
      if (!accessToken) throw new Error('Access token is not set.');
      if (!host) throw new Error('GitLab instance host is not set.');

      return fetch(restApiUri(host, '/user'), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(res => {
          if (res.status !== 200) {
            return res.json().then(({ message }) => {
              throw new Error(message);
            });
          }

          return res;
        })
        .then(res => res.json())
        .then(data => {
          const { id, name, username } = data;

          return {
            __typename: 'User',
            id,
            name,
            username,
          };
        });
    },
    async assignedProjects(_, __, { cache }) {
      const { accessToken, gitlabInstance } = getUserConfigFromCache(cache);
      if (!accessToken) throw new Error('Access token not set.');

      return fetch(restApiUri(gitlabInstance.host, `/projects`), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(res => {
          if (res.status !== 200) {
            return res.json().then(({ message }) => {
              throw new Error(message);
            });
          }

          return res;
        })
        .then(res => res.json())
        .then(data => {
          return data.map(project => {
            return {
              ...toProject(project, { projectId: project.id }),
              __typename: 'Project',
            };
          });
        });
    },
    async uploadToProject(_, __, { cache }) {
      const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload: payload }),
    }

      
      const { accessToken, gitlabInstance } = getUserConfigFromCache(cache);
      if (!accessToken) throw new Error('Access token not set.');

      const response = await fetch(restApiUri(gitlabInstance.host, config));
        const data = await response.json();


    }
  },
};
