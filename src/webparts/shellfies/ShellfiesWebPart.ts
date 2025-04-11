import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ShellfiesWebPartStrings';
import { Shellfies } from './components/Shellfies';
import { IShellfiesProps } from './components/IShellfiesProps';
import { SPFI, spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import { IColumnReturnProperty, PropertyFieldColumnPicker, PropertyFieldListPicker, PropertyFieldSpinButton } from '@pnp/spfx-property-controls';

export interface IShellfiesWebPartProps {
  title: string;
  listId?: string;
  personColumn?: string;
  limit: number;
}

export default class ShellfiesWebPart extends BaseClientSideWebPart<IShellfiesWebPartProps> {

  private sp: SPFI;

  public render(): void {
    const element: React.ReactElement<IShellfiesProps> = React.createElement(
      Shellfies,
      {
        title: this.properties.title,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        displayMode: this.displayMode,
        updateTitle: (newTitle: string) => {
          this.properties.title = newTitle;
          this.render();
        },
        sp: this.sp,
        listId: this.properties.listId,
        columnName: this.properties.personColumn,
        limit: this.properties.limit,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return super.onInit()
      .then((): void => {
        this.sp = spfi().using(SPFx(this.context));
      });
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    return {
      pages: [
        {
          header: {
            description: "DrAW pEoPLe aS sHeLLfies!"
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldListPicker('listId', {
                  label: 'Pick a list',
                  selectedList: this.properties.listId,
                  includeHidden: false,
                  context: this.context,
                  properties: this.properties,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  key: 'listId',
                }),
                PropertyFieldColumnPicker('personColumn', {
                  label: 'Pick a person column',
                  selectedColumn: this.properties.personColumn,
                  listId: this.properties.listId,
                  filter: "TypeAsString eq 'User'",
                  columnReturnProperty: IColumnReturnProperty['Internal Name'],
                  disabled: !this.properties.listId,
                  context: this.context,
                  properties: this.properties,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  key: 'personColumn',
                }),
                PropertyFieldSpinButton('limit', {
                  label: 'Limit',
                  initialValue: this.properties.limit,
                  min: 1,
                  max: 10,
                  suffix: ' eggs',
                  properties: this.properties,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  key: 'limit',
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
