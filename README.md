# shellfies

## Summary

Short summary on functionality and used technologies.

[picture of the solution in action, if possible]

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.20.0-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> Any special pre-requisites?

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| folder name | Author details (name, company, twitter alias with link) |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.1     | March 10, 2021   | Update comment  |
| 1.0     | January 29, 2021 | Initial release |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**

> Include any additional steps as needed.

## Features

Description of the extension that expands upon high-level summary above.

This extension illustrates the following concepts:

- topic 1
- topic 2
- topic 3

> Notice that better pictures and documentation will increase the sample usage and the value you are providing for others. Thanks for your submissions advance.

> Share your web part with others through Microsoft 365 Patterns and Practices program to get visibility and exposure. More details on the community, open-source projects and other activities from http://aka.ms/m365pnp.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development

# Steps

- Replace `{tenantdomain}` in config/serve.json with your site `thechriskent.sharepoint.com/sites/mockingbirds`
- Run as is `gulp serve`
- Add it to the workbench. Wowee
[!Vanilla Webpart](./assets/images/vanillawebpart.png)

## SPFx Fast Serve
- https://github.com/s-KaiNet/spfx-fast-serve?tab=readme-ov-file#how-to-use
- `npm install spfx-fast-serve -g`
- `spfx-fast-serve`
  - Press enter when prompted to install the dependencies

## Webpart Title
- `npm install @pnp/spfx-controls-react`
- `npm run serve`
- Notice that changes get reflected immediately on save with auto refresh. Wowee!

- ShellfiesWebPart.manifest.json
  - Set `officeFabricIconFontName` to `Camera`
  - Rename `description` property from to `title`
- IShellfiesProps.ts
  - Rename `description` to `title`
  - remove `isDarkTheme`
  - remove `environmentMessage`
  - remove `userDisplayName`
  - Add `displayMode: DisplayMode;` and ensure `import { DisplayMode } from "@microsoft/sp-core-library";` gets added to the top
  - Add `updateTitle: (newTitle: string) => void;`
- Shellfies.tsx
  - rename `description` to `title` in prop constants
  - remove `isDarkTheme`, `environmentMessage`, `userDisplayName` from prop constants
  - add `displayMode` and `updateTitle` to prop constants
  - Remove everything inside the primary `section`
  - Remove import from lodash
  - Inside the section add `<WebPartTitle displayMode={displayMode} title={title} updateProperty={updateTitle} />`
    - Ensure the `import { WebPartTitle } from '@pnp/spfx-controls-react';` gets added to the top
    - https://pnp.github.io/sp-dev-fx-controls-react/controls/WebPartTitle/
- ShellfiesWebPart.ts
  - Change `description` to `title` in the `IShellfiesWebPartProps`
  - Remove `_isDarkTheme` and `_environmentMessage` on lines 21-22
  - Change `description` to `title` and `this.properties.description` to `this.properties.title` in the `createElement` call on line 25
  - Remove `isDarkTheme`, `environmentMessage`, and `userDisplayName` from `createElement call
  - Add
    ```typescript
    displayMode: this.displayMode,
    updateTitle: (newTitle: string) => {
      this.properties.title = newTitle;
      this.render();
    },
    ```
  - Comment out the `onInit` method
  - Delete the `_getEnvironmentMessage` method starting on line 46
  - Delete the `this._isDarkTheme = !!currentTheme.isInverted;` on line 49

## Configuration Placeholder

- IShellfiesProps.ts
  - Add `isConfigured: boolean;`
  - Add `onConfigure: () => void;`
- ShellfiesWebPart.ts
  - Add `isConfigured: false,` after line 31
  - Add `onConfigure: this.context.propertyPane.open,`
- Shellfies.tsx
  - Add `isConfigured` and `onConfigure` to prop constants
  - Under the `<WebPartTitle>` component add:
  ```typescript
  {isConfigured ? (
    <span>All Configured!</span>
  ) : (
    <Placeholder
      iconName='WarningSolid'
      iconText='Not Configured!'
      description='Fix me!'
      buttonLabel='Configure'
      onConfigure={onConfigure}
    />
  )}
  ```
  - https://pnp.github.io/sp-dev-fx-controls-react/controls/Placeholder/
- Refresh in the workbench to show it working

## Egg Assets
- Delete welcome-dark.png and welcome-light.png from src/webparts/shellfies/assets
- Copy over egg svg files
- Shellfies.module.scss
  - Remove everything but the `.shellfies` root class (everything after line 12)
- Add crate div
- Egg component
  - Have it just say egg at first (empty props, return only with a div with styles.egg)
  - Will likely have to restart serve when adding Egg.module.scss
  - Just set color for now
  - Add style
  - Add useState and onClick

## Property Controls
- `npm install @pnp/spfx-property-controls`
- Property pane currently has a description
- ShelfiesWebPart.ts
  - Add `listId?: string;` to `IShellfiesWebPartProps`
  - Remove lines 83-85 (`PropertyPaneTextField`)
  - Remove `PropertyPaneTextField` from imports
- `npm run serve`
  - Change description to `'DrAW pEoPLe aS sHeLLfies!'`
  - Add PropertyFieldListPicker
    - https://pnp.github.io/sp-dev-fx-property-controls/controls/PropertyFieldListPicker/
  - Add `personColumn?: string` to `IShellfiesWebPartProps`
  - Add `limit: number` to `IShellfiesWebPartProps`
  - Add `"limit": 3` to properties in ShellfiesWebPart.manifest.json
  - Add PropertyFieldColumnPicker
    - https://pnp.github.io/sp-dev-fx-property-controls/controls/PropertyFieldColumnPicker/
  - Add PropertyFieldSpinButton
    - https://pnp.github.io/sp-dev-fx-property-controls/controls/PropertyFieldSpinButton/