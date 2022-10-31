# Technical overview

Figma plugins are built with 2 contexts in mind:

1. `sandbox`: A Figma sandbox where direct interaction with the Figma application happens.
2. `iframe`: An iframe isolated from the Figma application where the UI for the plugin is rendered (in our case, a [Vue](https://vuejs.org/) application).

Read more about this in the [Figma documentation](https://www.figma.com/plugin-docs/how-plugins-run/).

![figma-sandbox-diagram](https://static.figma.com/uploads/04c4c6293fce2a7fe67bccd385ee5ab998705780)

## `src/ui/`

The `ui/` directory holds all code related to the UI. This is a single page application implemented in Vue and runs in the `iframe` context.
It is entirely `javascript` and Vue single-file-components (for now).

## `src/figma`

The `figma/` directory holds all code that will run in the `sandbox` context. It is entirely `typescript`.
