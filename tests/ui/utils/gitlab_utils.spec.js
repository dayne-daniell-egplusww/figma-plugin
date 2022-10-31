import { parseIssueUrl } from '~/ui/utils/gitlab_utils';

describe('GitLab utilities', () => {
  describe('parseIssueUrl', () => {
    describe('with valid GitLab issue url', () => {
      it.each`
        url                                                                                            | result
        ${'https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/issues/1'}                              | ${{ issueId: '1', projectPath: 'gitlab-org/gitlab-figma-plugin' }}
        ${'https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/issues/10'}                             | ${{ issueId: '10', projectPath: 'gitlab-org/gitlab-figma-plugin' }}
        ${'https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/issues/100'}                            | ${{ issueId: '100', projectPath: 'gitlab-org/gitlab-figma-plugin' }}
        ${'https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/issues/1#note_380107899'}               | ${{ issueId: '1', projectPath: 'gitlab-org/gitlab-figma-plugin' }}
        ${'https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/issues/1/designs'}                      | ${{ issueId: '1', projectPath: 'gitlab-org/gitlab-figma-plugin' }}
        ${'https://gitlab.com/gitlab-org/nested/gitlab-figma-plugin/-/issues/1'}                       | ${{ issueId: '1', projectPath: 'gitlab-org/nested/gitlab-figma-plugin' }}
        ${'https://gitlab.com/gitlab-org/nested/nested/gitlab-figma-plugin/-/issues/1#note_380107899'} | ${{ issueId: '1', projectPath: 'gitlab-org/nested/nested/gitlab-figma-plugin' }}
      `('parses $url correctly', ({ url, result }) => {
        expect(parseIssueUrl(url)).toEqual(result);
      });
    });

    describe('with invalid GitLab issue url', () => {
      it.each`
        url
        ${'gitlab.com/gitlab-org/gitlab-figma-plugin/-/issues/1'}
        ${'https://gitlab.com/gitlab-org/gitlab-figma-plugin/issues/1'}
        ${'http://gitlab.com/gitlab-org/gitlab-figma-plugin/-/issues/1'}
        ${'https://gitlab.com/-/issues/1/designs'}
        ${'notaurl'}
        ${'not a url'}
      `('returns empty object when url is $url', ({ url }) => {
        expect(parseIssueUrl(url)).toEqual({});
      });
    });
  });
});
