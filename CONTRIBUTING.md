## Developer Certificate of Origin + License

By contributing to GitLab B.V., You accept and agree to the following terms and
conditions for Your present and future Contributions submitted to GitLab B.V.
Except for the license granted herein to GitLab B.V. and recipients of software
distributed by GitLab B.V., You reserve all right, title, and interest in and to
Your Contributions. All Contributions are subject to the following DCO + License
terms.

[DCO + License](https://gitlab.com/gitlab-org/dco/blob/master/README.md)

_This notice should stay as the first item in the CONTRIBUTING.md file._

---

# Contributing to the GitLab Figma Plugin

Thank you for your interest in contributing to the GitLab Figma Plugin! This guide details how to contribute
to this project in a way that is easy for everyone. These are mostly guidelines, not rules.
Use your best judgement, and feel free to propose changes to this document in a merge request.

## Code of Conduct

We want to create a welcoming environment for everyone who is interested in contributing. Visit our [Code of Conduct page](https://about.gitlab.com/community/contribute/code-of-conduct/) to learn more about our commitment to an open and welcoming environment.

## Reporting Issues

Create a [new issue from the "Bug" template](https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/issues/new?issuable_template=Bug) and follow the instructions in the template.

## Proposing Features

Create a [new issue from the "Feature Proposal" template](https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/issues/new?issuable_template=Feature%20Proposal) and follow the instructions in the template.

## Configuring Development Environment

The following instructions will help you run the GitLab Figma plugin locally.

1. Installation Prerequisites

   - [Git](https://git-scm.com/)
   - [node.js](https://nodejs.org/en/)
   - [npm](https://www.npmjs.com/get-npm)
   - [Figma desktop application](https://www.figma.com/downloads/)

1. Fork and Clone the project

   1. Use your GitLab account to [fork](https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/forks/new) this project

      - Don't know how forking works? Refer to [this guide](https://docs.gitlab.com/ee/gitlab-basics/fork-project.html#doc-nav).
      - Don't have GitLab account? [Create one](https://gitlab.com/users/sign_in#register-pane)! It is free and it is awesome!

   1. Visit your forked project (usually URL is `https://gitlab.com/<your user name>/gitlab-figma-plugin`) and copy
      SSH or HTTPS URL to clone the project into your system.
      - Don't know how to clone a project? Refer to [this guide](https://docs.gitlab.com/ee/gitlab-basics/command-line-commands.html#clone-your-project).

1. Install dependencies

   ```bash
   npm install
   ```

1. Build assets

   ```bash
   npm run build
   ```

   or, to watch files (recommended for development):

   ```bash
   npm run watch
   ```

1. Running plugin in Figma

   Now that we've compiled the plugin's source code, we need to add it to Figma.

   From the Figma tab within the Figma desktop application:

   1. Navigate to the **Plugins** tab from the left-hand sidebar.
   1. Click **Create your own plugin** on the right-hand sidebar to reveal a modal.
   1. Click **Click to choose a `manifest.json` file**.
   1. Select the `manifest.json` file from within this repository's directory.

   Now, to use the development plugin, navigate to **Plugins > Development**; the **GitLab** menu item should be available.

### Debugging tips

- To open the Figma development console: from the top menu, **Plugins > Development > Open Console**.
- To re-run the last plugin command in Figma:
  <kbd>&#8984; command</kbd> + <kbd>&#8997; option</kbd> + <kbd>P</kbd>.

### Running tests

To run tests, open terminal within the project folder and run following:

```bash
npm test
```

### Running linters

To run linters, open terminal within the project folder and run following;

```bash
npm eslint-fix # Automatically fixes eslint errors
npm eslint # Checks for eslint errors
```

## Your first contribution

For newcomers to the project, you can take a look at issues [labelled as `Accepting merge requests`](https://gitlab.com/gitlab-org/gitlab-figma-plugin/-/issues?label_name[]=Accepting%20merge%20requests).

## Opening merge requests

Steps to opening a merge request to contribute code to the GitLab Figma Plugin is similar to any other open source project.
You develop in a separate branch of your own fork and the merge request should have a related issue open in the project.
Be sure you have followed the steps from [Configuring Development Environment](#configuring-development-environment) before opening a merge request.

### Getting your merge request reviewed

This project follows the [GitLab code review guidelines](https://docs.gitlab.com/ee/development/code_review.html) and all merge requests should be reviewed by a maintainer. To request a review, tag any GitLab user who is a [CODEOWNER](CODEOWNERS) and they will respond as per the [first-response SLO](https://about.gitlab.com/handbook/engineering/workflow/code-review/#first-response-slo).

## Technical overview

For an overview of the architecture of the plugin, see the [technical overview documentation](docs/technical-overview.md)
