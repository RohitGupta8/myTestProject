# @infomaker/substance

This project is a fork of [the altgr-fix-branch of the Infomaker fork of the Substance project](https://github.com/Infomaker/substance/tree/altgr-fix).

The output of this project is the npm package `@infomaker/substance` which is used by the writer-client project for its text editor and content editing functionality.

External TypeScript typings, usable for writer plugins, can be found in the separate npm package [@infomaker/types-substance](https://www.npmjs.com/package/@infomaker/types-substance).

## Development

### Branching Model

`master` is the only main branch, creating and pushing semver tags (`x.y.z`) will build and publish a new version of the npm package.

```bash
# Release release candidate
npm run release X.Y.Z-rc.1

# Release major (X.y.z)
npm run release:major

# Release minor (x.Y.z)
npm run release:minor

# Relase hotfix (x.y.Z)
npm run release:hotfix
```

### Local Development

When developing this package and testing locally, use the `npm link`-command to create a symlink to the `@infomaker/substance` package.

Run in root of this project:

```bash
npm link
```

Run in root of project which has `@infomaker/substance` as dependency:

```bash
npm link @infomaker/substance
```

Run in root of this project to start file watcher which continually runs build command:

```bash
npm run dev
```

### Tests

The legacy headless browser tests have been adopted and updated to be able to run in bitbucket pipelines and locally using a headless Chrome browser.

```bash
npm test
```

## Legacy README

Substance is a JavaScript library for web-based content editing. It provides building blocks for realizing custom text editors and web-based publishing systems.

Check the [project website](http://substance.io) and the [documentation](http://substance.io/docs).

## Features

| Features                                            | State  |
| --------------------------------------------------- | :----: |
| Custom document schemas                             |   ✓    |
| Custom converters (XML, HTML, etc.)                 |   ✓    |
| Custom HTML Rendering                               |   ✓    |
| Drag & Drop Support                                 |   ✓    |
| Annotations can hold information (e.g. a comment)   |   ✓    |
| Annotations that can span over multiple nodes       | Beta 7 |
| Isolated Nodes (any content with any custom UI)     |   ✓    |
| Incremental document updates (undoable operations)  |   ✓    |
| Transformations for document manipulation           |   ✓    |
| Custom editing toolbars                             |   ✓    |
| Commands for controlling the editor                 |   ✓    |
| Multi-language support                              |   ✓    |
| Realtime collaboration                              |   ✓    |
| Persistence API for documents                       |   ✓    |
| Text Macros                                         |   ✓    |
| Key bindings                                        |   ✓    |
| Packages (aka Plugins)                              |   ✓    |
|                                                     |
| **UI Components**                                   |
| TextPropertyEditor for editing annotated text       |   ✓    |
| ContainerEditor for in-flow-editing                 |   ✓    |
| Scrollable ContentPanel with support for highlights |   ✓    |
| Customizable Toolbar                                |   ✓    |
| ScrollPane with interactive visual Scrollbar        |   ✓    |
| Interactive TOCPanel                                |   ✓    |
|                                                     |
| **Predefined content types**                        |
| Paragraph                                           |   ✓    |
| Heading                                             |   ✓    |
| Blockquote                                          |   ✓    |
| Codeblock                                           |   ✓    |
| Image                                               |   ✓    |
| List                                                |   ✓    |
| Table                                               |   ✓    |
|                                                     |
| **Predefined annotation types**                     |
| Strong                                              |   ✓    |
| Emphasis                                            |   ✓    |
| Link                                                |   ✓    |
| Subscript                                           |   ✓    |
| Superscript                                         |   ✓    |
| Code                                                |   ✓    |
|                                                     |
| **Platform support**                                |
| Mozilla Firefox (>=49)                              |   ✓    |
| Apple Safari (>=10)                                 |   ✓    |
| Google Chrome (>=53)                                |   ✓    |
| Microsoft Edge                                      |   ✓    |

