import { GITLAB_INSTANCE_PROTOCOL } from '~/shared/constants';

const GITLAB_ISSUE_URL_REGEX = /\/(.+)\/-\/issues\/([0-9]+)/;
export const GITLAB_COM_HOST = 'gitlab.com';

function sanitiseFilename(filename) {
  const sanitisedFileName = filename.replace('/', ':');
  return sanitisedFileName;
}

export const restApiUri = (host, path) => {
  return `${GITLAB_INSTANCE_PROTOCOL}//${host}/api/v4${path}`;
};

export const graphqlApiUri = host => {
  return `${GITLAB_INSTANCE_PROTOCOL}//${host}/api/graphql`;
};

export function pngFileFromData(data, filename) {
  const fileData = new Blob([data], { type: 'image/png' });
  const file = new File([fileData], `${sanitiseFilename(filename)}.png`, {
    type: 'image/png',
  });

  return file;
}

export function jsonFileFromData(data) {
  return JSON.stringify(data, null, -1)
}

/**
 * Parse a GitLab issue URL.
 * @param {String} issueUrl url to test
 * @return {Object} Object containing [projectPath] and [issueId]. If invalid URL, empty object.
 */
export function parseProjectUrl(projectUrl) {
  let url;
  try {
    url = new URL(projectUrl);
  } catch (e) {
    return {};
  }

  // if (url.protocol !== GITLAB_INSTANCE_PROTOCOL || url.hostname !== GITLAB_INSTANCE_HOSTNAME) {
  if (url.protocol !== GITLAB_INSTANCE_PROTOCOL) {
    return {};
  }

  const match = url.pathname.match(GITLAB_ISSUE_URL_REGEX);
  if (!match) return {};

  const [, projectPath, projectId] = match;
  return {
    projectPath,
    projectId,
  };
}


export function toProject(project, { projectId } = {}) {

  const webUrl = project.webUrl || project.web_url;
  const { projectPath } = project.path_with_namespace;

  return {
    name: project.name,
    webUrl,
    projectId,
    projectPath,
    fullReference: project.web_url
      ? `${projectPath}${project.reference}`
      : (project.references || {}).full,
  };
}

export function isHostGitlabCom(host) {
  return host === GITLAB_COM_HOST;
}
