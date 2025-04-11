# Setup
```
nvs
yo @microsoft/sharepoint
npm install spfx-fast-serve
npm install @pnp/sp @pnp/spfx-controls-react @pnp/spfx-property-controls
```

# Webpart Title

## IShellfiesProps.ts

```
import { DisplayMode } from "@microsoft/sp-core-library";

export interface IS2Props {
  title: string;
  hasTeamsContext: boolean;
  displayMode: DisplayMode;
  updateTitle: (newTitle: string) => void;
}
```

## Shellfies.tsx

```
import * as React from 'react';
import styles from './S2.module.scss';
import type { IS2Props } from './IS2Props';
import { WebPartTitle } from '@pnp/spfx-controls-react';

export default class S2 extends React.Component<IS2Props> {
  public render(): React.ReactElement<IS2Props> {
    const {
      title,
      hasTeamsContext,
      displayMode,
      updateTitle,
    } = this.props;

    return (
      <section className={`${styles.s2} ${hasTeamsContext ? styles.teams : ''}`}>
        <WebPartTitle title={title} updateProperty={updateTitle} displayMode={displayMode} />
      </section>
    );
  }
}
```

## ShellfiesWebPart.ts

```
displayMode: this.displayMode,
updateTitle: (newTitle: string) => {
    this.properties.title = newTitle;
    this.render();
},
```

# Plumbing

## Shellfies.tsx

```
import * as React from 'react';
import styles from './S2.module.scss';
import type { IS2Props } from './IS2Props';
import { WebPartTitle } from '@pnp/spfx-controls-react';
import { Spinner, SpinnerSize } from '@fluentui/react';

export interface IEgg {
  imageSrc: string;
  name: string;
}

export const S2 = (props: IS2Props): JSX.Element => {
  const {
    title,
    hasTeamsContext,
    displayMode,
    updateTitle,
  } = props;

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [eggs, setEggs] = React.useState<IEgg[]>([]);

  React.useEffect(() => {
    const getEggs = async (): Promise<void> => {
      setEggs([{
        imageSrc: require('../assets/user.png'),
        name: 'Creepy Daniel',
      }]);
      setIsLoaded(false);
    }
    getEggs().catch((error) => {
      console.error('Error fetching eggs:', error);
    });
  }, [])

  return (
    <section className={`${styles.s2} ${hasTeamsContext ? styles.teams : ''}`}>
      <WebPartTitle title={title} updateProperty={updateTitle} displayMode={displayMode} />
      {!isLoaded &&
        <Spinner size={SpinnerSize.large} label="loading..." />
      }
      {isLoaded &&
        <div>
          {eggs.map((egg, index) => (
            <div key={index}>
              {egg.name}
            </div>
          ))}
        </div>
      }
    </section>
  );
}
```

# SP List Usage

## IShellfiesProps.ts
```
import { DisplayMode } from "@microsoft/sp-core-library";
import { SPFI } from "@pnp/sp";

export interface IS2Props {
  title: string;
  hasTeamsContext: boolean;
  displayMode: DisplayMode;
  updateTitle: (newTitle: string) => void;
  sp: SPFI;
  listId?: string;
  columnName?: string;
  limit: number;
}
```

Add Metadata limit default of 3

## ShellfiesWebPart.ts

```
import { SPFI, spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import { IColumnReturnProperty, PropertyFieldColumnPicker, PropertyFieldListPicker, PropertyFieldSpinButton } from '@pnp/spfx-property-controls';

export interface IS2WebPartProps {
  title: string;
  listId?: string;
  personColumn?: string;
  limit: number;
}
```

```
private sp: SPFI;
```

```
sp: this.sp,
listId: this.properties.listId,
columnName: this.properties.personColumn,
limit: this.properties.limit,
```

```
  protected onInit(): Promise<void> {
    return super.onInit()
      .then((): void => {
        this.sp = spfi().using(SPFx(this.context));
      });
  }
```

```
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
```

## Shellfies.tsx
```
const {
    title,
    hasTeamsContext,
    displayMode,
    updateTitle,
    sp,
    listId,
    columnName,
    limit,
  } = props;

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [eggs, setEggs] = React.useState<IEgg[]>([]);

  React.useEffect(() => {
    const getEggs = async (): Promise<void> => {
      if(listId && columnName) {
        const items = await sp.web.lists.getById(listId).items.select(`${columnName}/Title,${columnName}/EMail`).top(limit).expand(columnName)();
        setEggs(items.map((item) => ({
          imageSrc: `/_layouts/15/userphoto.aspx?size=L&username=${item[columnName].EMail}`,
          name: item[columnName].Title,
        }))
        );
        setIsLoaded(true);
      }
    };
    getEggs().catch((error) => {
      console.error('Error fetching eggs:', error);
    });
  }, [listId, columnName, limit, sp]);
```

# Egg Display

## Egg.tsx
```
import * as React from 'react';
import styles from './Egg.module.scss';

export interface IEggProps {
    imgSrc: string;
}

export const Egg = (props: IEggProps): JSX.Element => {

    const [isOpen, setIsOpen] = React.useState(false);

    const eggImages = {
        '--eggPlain': `url(${require('../assets/eggPlain.svg')})`,
        '--eggHalf': `url(${require('../assets/eggHalf.svg')})`,
        '--user': `url(${props.imgSrc})`,
    }

    return (
        <div
            className={styles.egg}
            style={eggImages as React.CSSProperties}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className={isOpen ? styles.open : styles.closed} />
        </div>
    );
};
```

## Egg.module.scss
```
.egg {
    width: 100px;
    height: 130px;
    background: var(--user) center/cover no-repeat;
    mask: var(--eggPlain) center/contain no-repeat;
    position: relative;

    .open,
    .closed {
        background-color: "[theme:themeLighter, default: beige]";
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
    }

    .open {
        mask: var(--eggHalf) center/contain no-repeat;
    }
    
    .closed {
        mask: var(--eggPlain) center/contain no-repeat;
    }
}
```

## Shellfies.tsx
```
import { Egg } from './Egg';
```

```
<Egg imgSrc={egg.imageSrc} key={index} />
```